from datetime import datetime
from typing import Optional
from fastapi import APIRouter
from app.database.schemas.department_data import EPCData
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

@router.get("/", response_model=dict)
def dev():
    return {"TEST" : "OK"}


@router.get("/ihms/epcdata", response_model=dict, dependencies=[Depends(get_current_user_data)])
async def get_epc_fields():
    community = "RB"
    section = "S7"
    lot_number = "28"
    try:
        # Make API call to IHMS
        house_number = await get_house_number(community, section, lot_number)
        print("::::HOUSE NUMBER::::", house_number)
        res = await get_house_data(community, house_number)
        # print(res)
        epc_data = extract_epc_data(res)
        return {"EPCDATA": epc_data}
    except httpx.ConnectError as e:
        # Handle connection errors
        raise HTTPException(status_code=503, detail=f"Service unavailable: {str(e)}")
    except httpx.TimeoutException:
        # Handle timeout errors
        raise HTTPException(status_code=504, detail="Request timed out")
    except Exception as e:
        # Handle other errors
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

def parse_date(value: str) -> Optional[datetime]:
    if not value:
        return None
    try:
        return datetime.strptime(value, "%m/%d/%Y")
    except ValueError:
        try:
            return datetime.strptime(value, "%Y-%m-%d")
        except ValueError:
            return None

def extract_epc_data(house_data: dict) -> EPCData:
    return EPCData(
        contract_date=parse_date(house_data.get("CONTRACT_DATE")),
        product_name=house_data.get("MODELCODE"),
        elevation_name=house_data.get("ELEVATIONCODE"),
        drafting_drafter=house_data.get("DRAFTEDBY"),
        drafting_notes=house_data.get("NOTES"),
        engineering_engineer=house_data.get("STRUCTURALCO"),
        engineering_sent=parse_date(house_data.get("ENGORDEREDDATE")),
        engineering_received=parse_date(house_data.get("ENGRECVDDATE")),
        plat_sent=parse_date(house_data.get("PLATORDEREDDATE")),
        plat_received=parse_date(house_data.get("PLATRECDATE")),
        permitting_submitted=parse_date(house_data.get("PERMIT_DATE")),
        permitting_notes=house_data.get("REMARKS"),
        homesiting_completed_on=parse_date(house_data.get("HOMESITERPRTDATE")),
    )

@router.get("/ihms/test", response_model=dict, dependencies=[Depends(get_current_user_data)])
async def test():
    community = "RB"
    section = "S7"
    lot_number = "28"
    try:
        # Make API call to IHMS
        house_number = await get_house_number(community, section, lot_number)
        print("::::HOUSE NUMBER is", house_number)
        res = await get_house_data(community, house_number)
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
async def get_house_number(community, section, lot_number):
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
                return {"error": f"API returned status code {response.status_code}", "details": response.text}
        except httpx.RequestError as e:
            return {"error": f"Request failed: {str(e)}"}

    # Find the house from the list of houses in the entire community
    # NOTE: finds the first house that matches with Community & Seciton & Lot.
    # there shouldn't be multiple homes with same commuty-section-lot but
    # if there are multiple, then handle it (later)
    for house in all_houses:
        if house["BLOCKNUMBER"] == section and house["LOTNUMBER"] == lot_number:
            house_number = house["HOUSENUMBER"]

    return house_number


"""
GET house details
Makes a GET request to /authorization to get access_token
"""
async def get_house_data(community, house_number):
    IHMS_api_endpoint = "https://api.ecimarksystems.com/rest/EVA"
    IHMS_company_code = "001"
    IHMS_development_code = community
    IHMS_house_code = house_number

    url = f"{IHMS_api_endpoint}/companies/{IHMS_company_code}/developments/{IHMS_development_code}/houses/{IHMS_house_code}"
    access_token = await get_access_token()
    headers = {
        "Content-Type" : "application/json",
        "Authorization": access_token
    }
    # print("::::MAKING REQUIEST TO", url, headers)

    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(
                url=url,
                headers=headers,
                timeout=10.0
            )
            # print("::::response::::", response)
            
            if response.status_code == 200:
                return response.json()
            else:
                return {"error": f"API returned status code {response.status_code}", "details": response.text}
        except httpx.RequestError as e:
            return {"error": f"Request failed: {str(e)}"}


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





@router.get("/newepcdata", response_model=dict)
def new_epc_data():
    # STEP 1: CONNECT TO IHMS
    print("STARTING IHMS CONNECTION")

    # Step 2: FILTER FOR THE TARGET PROJECT
    # STEP 3: GET ALL THE REQUIRED FIELDS FROM THE PROJECT
