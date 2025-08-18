from datetime import datetime
from typing import Optional
from fastapi import APIRouter
from pydantic import BaseModel
from app.logger import logger
from app.database.schemas.department_data import IHMSFilteredHouseData, IHMSHouseData
from app.router.utils import find_project
from app.settings.config import settings
from app.security.oauth2 import get_current_user_data

import httpx

from fastapi import Depends, HTTPException


"""
Endpoint: /dev
Purpose:
  - Testing
"""

router = APIRouter(prefix="/dev")


class IHMSHouseId(BaseModel):
    c: str
    s: str
    l: str

@router.get("/test", response_model=dict)
def dev(houseId: IHMSHouseId):
    return {"TEST" : "OK", "data": houseId.model_dump()}


from app.router.utils.find_project import find_project
@router.get(path='/get/{project_uid}', dependencies=[Depends(get_current_user_data)])
def get_epc_data_with_project_uid(project_uid: str):
    target_project = find_project(project_uid)

    # return target_project["teclab_data"]["epc_data"]
    result_project = {
        "project_info": target_project["project_info"],
        "epc_data": target_project["teclab_data"]["epc_data"]
    }
    return result_project

@router.get("/ihms/get/{project_uid}", dependencies=[Depends(get_current_user_data)])
async def get_epc_fields(project_uid: str):
    try:
        target_project = find_project(project_uid)
        project_info = target_project["project_info"]
        parts = project_info["project_id"].split('-')
        community, section, lot_number = parts[0], "S"+parts[1], parts[2]
        if len(lot_number) == 1: 
            lot_number = "0"+lot_number
        
        logger.info(f"Searching IHMS: community={community}, section={section}, lot_number={lot_number}")
        
        # Make API call to IHMS
        house_number = await get_house_number(community, section, lot_number)
        if house_number is None or house_number == "": 
            logger.error(f"Couldn't get IHMS house number using {community}-{section}-{lot_number}")
            return {
                "error": "House not found in IHMS",
                "details": f"No house found for {community}-{section}-{lot_number}"
            }
        
        logger.info(f"Found IHMS house number: {house_number}")
        ihms_house_data = await get_ihms_house_data(community, house_number)
        ihms_filtered_data = filter_ihms_house_data(ihms_house_data)

        # Debug: Check what's actually being returned
        # print("Before return - filtered_data:", ihms_filtered_data.model_dump())

        return {
            "IHMS_HOUSE_DATA": ihms_house_data.model_dump(by_alias=True),
            "IHMS_FILTERED_DATA": ihms_filtered_data.model_dump(by_alias=True),
            "metadata": {
                "community": community,
                "section": section, 
                "lot_number": lot_number,
                "house_number": house_number
            }
        }
        
    except Exception as e:
        logger.error(f"Error fetching IHMS data: {str(e)}")
        return {
            "error": "Failed to fetch IHMS data",
            "details": str(e)
        }


def filter_ihms_house_data(house_data: IHMSHouseData) -> IHMSFilteredHouseData:
    house_dict = house_data.model_dump(by_alias=True)
    
    # Use aliases as keys (assuming all fields have aliases)
    filtered_data = {
        field_info.alias: house_dict.get(field_info.alias)  # type: ignore
        for field_info in IHMSFilteredHouseData.model_fields.values()
    }
    
    # Create model using alias keys
    result = IHMSFilteredHouseData.model_validate(filtered_data, from_attributes=False)
    
    return result


@router.get("/ihms/test", response_model=dict, dependencies=[Depends(get_current_user_data)])
async def test():
    community = "RB"
    section = "S7"
    lot_number = "28"
    try:
        # Make API call to IHMS
        house_number = await get_house_number(community, section, lot_number)
        print("::::HOUSE NUMBER is", house_number)
        res = await get_ihms_house_data(community, house_number)
        print("res:💡💡")
        # print(res)
        return {"TEST": "WARRANTY DASHBOARDS", "data": res}
    except httpx.ConnectError as e:
        # Handle connection errors
        raise HTTPException(status_code=503, detail=f"Service unavailable: {str(e)}")
    except httpx.TimeoutException:
        # Handle timeout errors
        raise HTTPException(status_code=504, detail="Request timed out")
    except Exception as e:
        # Handle other errors
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

"""
GET the house number
"""
async def get_house_number(community, section, lot_number) -> str:
    IHMS_api_endpoint = "https://api.ecimarksystems.com/rest/EVA"
    IHMS_company_code = "001"
    IHMS_development_code = community

    # https://api.ecimarksystems.com/rest/EVA/companies/001/developments/RB/houses
    url = f"{IHMS_api_endpoint}/companies/{IHMS_company_code}/developments/{IHMS_development_code}/houses"
    # TODO: save the access_token and get a new one only after it expires
    access_token = await get_access_token()
    headers = {
        "Content-Type" : "application/json",
        "Authorization": access_token
    }

    house_number = None
    all_houses = []

    # Get all the houses in the given community
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(
                url=url,
                headers=headers,
                timeout=10.0
            )
            # print("::::response::::", response)
            
            if response.status_code == 200:
                all_houses = response.json()
            else:
                logger.error(f"API returned status code {response.status_code} \ndetails: {response.text}")
                return ""
        except httpx.RequestError as e:
            logger.error(f"Request failed: {str(e)}")
            return ""

    # Find the house from the list of houses in the entire community
    # NOTE: finds the first house that matches with Community & Seciton & Lot.
    # there shouldn't be multiple homes with same commuty-section-lot but
    # if there are multiple, then handle it (later)
    for house in all_houses:
        if house["BLOCKNUMBER"] is None or house["BLOCKNUMBER"] == "":
            if house["LOTNUMBER"] == lot_number:
                house_number = house["HOUSENUMBER"]
        elif house["BLOCKNUMBER"] == section and house["LOTNUMBER"] == lot_number:
            house_number = house["HOUSENUMBER"]

    if house_number is None: return ""
    return house_number


"""
GET house details
Makes a GET request to /authorization to get access_token
"""
async def get_ihms_house_data(community: str, house_number: str) -> IHMSHouseData:
    IHMS_api_endpoint = "https://api.ecimarksystems.com/rest/EVA"
    IHMS_company_code = "001"
    url = f"{IHMS_api_endpoint}/companies/{IHMS_company_code}/developments/{community}/houses/{house_number}"
    access_token = await get_access_token()
    headers = {
        "Content-Type": "application/json",
        "Authorization": access_token
    }

    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(url, headers=headers, timeout=10.0)
            response.raise_for_status()  # raises for HTTP errors
            data = response.json()
            return IHMSHouseData(**data)  # always return Pydantic object
        except httpx.RequestError as e:
            raise RuntimeError(f"Request failed: {e}")
        except httpx.HTTPStatusError as e:
            raise RuntimeError(f"API returned status {e.response.status_code}: {e.response.text}")
        except Exception as e:
            raise RuntimeError(f"Failed to parse IHMS data: {e}")


"""
GET ACCESSTOKEN FROM IHMS 
Client-id & Client-Secret are from IHMS Developer account
"""
# TODO: save the access_token and get a new one only after it expires
async def get_access_token():
    print("GOING TO GET ACCESSTOKEN FROM IHMS")
    url = "https://api.ecimarksystems.com/accesstoken"
    
    # Form data parameters
    data = {    # this is the body in REST/postman
        "client_id": settings.CLIENT_ID,
        "client_secret": settings.CLIENT_SECRET,
        "grant_type": "client_credentials"
    }
    
    # Headers (if needed)
    headers = {
        "Content-Type": "application/x-www-form-urlencoded"
    }
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                url=url,
                data=data,
                headers=headers,
                timeout=10.0
            )
            
            if response.status_code == 200 and response.json()["access_token"]:
                return response.json()["access_token"]
            else:
                return {"error": f"API returned status code {response.status_code}", "details": response.text}
        except httpx.RequestError as e:
            return {"error": f"Request failed: {str(e)}"}


