import csv
import os
from datetime import datetime
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from typing import List, Annotated

from pydantic import BaseModel

from app.database.schemas.project import ContractInfo, ProjectInfo, ProjectMetaInfo, SalesProjectData
from fastapi import APIRouter, Depends, status, HTTPException

from app.database.database import projects_coll 
from app.database.schemas.department_data import CORData, UpdateTECLabData, EPCData
from app.database.schemas.user import User
from app.email.utils import send_email_with_given_message_and_attachment
from app.router.utils.find_project import find_project
from app.security.oauth2 import get_current_user_data

"""
Endpoing: /department/teclab/dashboard
Purpose:
  - API for all dashboards
"""

router = APIRouter(prefix="/department/teclab/dashboard")

class EngineerData(BaseModel):
    engineer: str   # name of the engineer
    projects: int   # no. of projects handled by this engineer, for a given time frame

@router.get("/engineer-data", response_model=dict)
# @router.get("/engineer-data", response_model=dict, dependencies=[Depends(get_current_user_data)])
def get_live_lots():
    # No year is given implies to use the current year

    # Retrieve all documents from the collection
    all_docs = list(projects_coll.find())
    print(len(all_docs))

    filtered_lots = []

    engineers_map = {}

    for doc in all_docs:
        # Remove MongoDB's `_id` field from the document
        project = {k: v for (k, v) in doc.items() if k != "_id"}

        p_teclab_epc_data: EPCData = EPCData(**project["teclab_data"]["epc_data"])

        # Skip the released lots
        # if p_teclab_epc_data.lot_status_released:
            # continue

        # Skip lots without a contract date
        # if p_epc_data.contract_date is None:
            # continue

        # Filter for lots from 2025 and onwards i.e., skip anything before 2025
        if p_teclab_epc_data.contract_date and p_teclab_epc_data.contract_date.year < 2025:
            continue

        if p_teclab_epc_data.engineering_engineer not in engineers_map:
            engineers_map[p_teclab_epc_data.engineering_engineer] = 0
        engineers_map[p_teclab_epc_data.engineering_engineer] += 1

    return engineers_map

