import csv
import os
from datetime import datetime
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from typing import List, Annotated

from app.database.schemas.project import (
    ContractInfo,
    ProjectInfo,
    ProjectMetaInfo,
    SalesProjectData,
)
from fastapi import APIRouter, Depends, status, HTTPException

from app.database.database import projects_coll
from app.database.schemas.department_data import UpdateTECLabData, EPCData
from app.database.schemas.user import User
from app.email.utils import send_email_with_given_message_and_attachment
from app.router.department.common.eci_marksystems import get_access_token
from app.router.utils.find_project import find_project
from app.security.oauth2 import get_current_user_data

from datetime import datetime
from typing import Optional
from fastapi import APIRouter
from pydantic import BaseModel
from app.logger import logger
from app.database.schemas.ihms_schema import IHMSHouseData, IHMSFilteredHouseData
from app.router.department.common.eci_marksystems import get_access_token
from app.router.utils import find_project
from app.settings.config import settings
from app.security.oauth2 import get_current_user_data

import httpx

from fastapi import Depends, HTTPException


"""
EAGLE/PIPELINE endpoint
"""

router = APIRouter(prefix="/department/eagle/pipeline")


async def get_ihms_data():
    IHMS_api_endpoint = "https://api.ecimarksystems.com/rest/EVA"

    # FILTERS
    IHMS_company_code = ["001", "116"]
    # IHMS_development_code = community

    # https://api.ecimarksystems.com/rest/EVA/companies/001/developments/RB/houses
    url = f"{IHMS_api_endpoint}/companies/{IHMS_company_code}/developments/{IHMS_development_code}/houses"
    # TODO: save the access_token and get a new one only after it expires
    access_token = await get_access_token()
    headers = {"Content-Type": "application/json", "Authorization": access_token}

    house_number = None
    all_houses = []

    # Get all the houses in the given community
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(url=url, headers=headers, timeout=10.0)
            # print("::::response::::", response)

            if response.status_code == 200:
                all_houses = response.json()
            else:
                logger.error(
                    f"API returned status code {response.status_code} \ndetails: {response.text}"
                )
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

    if house_number is None:
        return ""
    return house_number


# Live: Filter out all finished and released lots
@router.get(
    "/live", response_model=List[dict], dependencies=[Depends(get_current_user_data)]
)
def get_live_lots():
    # print("HERE @ /department/eagle/pipeline/live")
    try:
        result = []
        for doc in projects_coll.find().sort("project_info.meta_info.created_at", -1):
            project = {k: v for (k, v) in doc.items() if k != "_id"}
            if (
                not doc["teclab_data"]["epc_data"]["lot_status_finished"]
                and not doc["teclab_data"]["epc_data"]["lot_status_released"]
            ):
                final_object = {
                    "project_uid": doc["project_info"]["project_uid"],
                    "community": doc["project_info"]["community"],
                    "section_number": doc["project_info"]["section"],
                    "lot_number": doc["project_info"]["lot_number"],
                }
                final_object.update(project["teclab_data"]["epc_data"])
                result.append(final_object)
        return result
    except Exception as e:
        # print("error: ", e)
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")
