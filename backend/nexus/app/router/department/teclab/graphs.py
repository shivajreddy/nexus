from typing import Dict, List
from collections import defaultdict
from datetime import datetime, timedelta
import calendar
from pydantic import BaseModel

from fastapi import APIRouter, Depends

from app.database.database import projects_coll 
from app.database.schemas.project import ContractInfo, ProjectInfo, ProjectMetaInfo, SalesProjectData, Project
from app.database.schemas.department_data import EPCData
from app.security.oauth2 import get_current_user_data

"""
Endpoint: /department/teclab/graphs
Purpose:
  - API for all graphs
"""

router = APIRouter(prefix="/department/teclab/graphs")

@router.get("/test", response_model=dict)
def get_current_month_ticker_data():
    today = datetime.today()
    graph_start_date = today.replace(day=1)
    next_month = (graph_start_date.replace(day=28) + timedelta(days=4)).replace(day=1)
    graph_end_date = next_month  # exclusive
    total_days = (graph_end_date - graph_start_date).days
    counter = {}
    for date in range(total_days):
        counter[date] = 0

    # Retrieve all documents from the collection
    all_docs = list(projects_coll.find())
    # print(len(all_docs))

    filtered_projects = []  # only projects that are with in the graph_start_date & graph_end_date

    for doc in all_docs:
        # Remove MongoDB's `_id` field from the document
        project = {k: v for (k, v) in doc.items() if k != "_id"}
        p_meta_info = ProjectMetaInfo(**project["meta_info"])
        p_contract_info = ContractInfo(**project["contract_info"])
        p_project_info: ProjectInfo = ProjectInfo(**project["project_info"])
        p_sales_data = SalesProjectData(**project["sales_data"])
        # p_teclab_cor_data = CORData(**project["teclab_data"]["cor_data"])
        p_teclab_epc_data: EPCData = EPCData(**project["teclab_data"]["epc_data"])
        # p_teclab_fosc_data = CORData(**project["teclab_data"]["fosc_data"])

        # Filter for lots with "contract_date" from 2025 and onwards i.e., skip anything before 2025
        if p_teclab_epc_data.contract_date and p_teclab_epc_data.contract_date < graph_start_date:
            continue
        if p_teclab_epc_data.contract_date and p_teclab_epc_data.contract_date > graph_end_date:
            continue

        filtered_projects.append(p_teclab_epc_data)

        # Skip the released lots
        # if p_teclab_epc_data.lot_status_released:
            # continue

        # Skip lots without a contract date
        # if p_epc_data.contract_date is None:
            # continue

    # return {"GRAPHS" : "TEST OKAY"}
    return {"RESULT": filtered_projects}

