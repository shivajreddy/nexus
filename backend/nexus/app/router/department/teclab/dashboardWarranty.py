from app.settings.config import settings

from typing import Dict, List, Required
from collections import defaultdict
from datetime import datetime, timedelta
import calendar
from pydantic import BaseModel
import httpx

from fastapi import APIRouter, Depends, HTTPException

from app.database.database import projects_coll 
from app.database.schemas.department_data import EPCData
from app.database.schemas.project import Project
from app.security.oauth2 import get_current_user_data
from app.settings.config import Settings

"""
Endpoing: /department/warranty/dashboard
Purpose:
  - API for all warranty dashboards
"""

router = APIRouter(prefix="/department/warranty/dashboard")

@router.get("/test", response_model=dict, dependencies=[Depends(get_current_user_data)])
async def test():
    community = "RB"
    section = "S7"
    lot_number = "28"
    try:
        # Make API call to IHMS
        house_number = await get_house_number(community, section, lot_number)
        print("::::HOUSE NUMBER is", house_number)
        res = await get_house_data(community, house_number)
        print(res)
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
async def get_access_token():
    url = "https://api.ecimarksystems.com/accesstoken"
    
    # Form data parameters
    data = {    # this is the body in REST/postman
        "client_id": settings.CLIENT_ID,
        "client_secret": settings.CLIENT_SECRET,
        # "client_id": "3f2d0026-d00f-4e41-b82e-f2d784478f5c",
        # "client_secret": "0bb5ef88-b6a4-418e-9a90-8912eac5bb09",
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

