from pydantic import BaseModel

from fastapi import APIRouter, Depends

from app.database.database import projects_coll 
from app.database.schemas.department_data import EPCData
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

@router.get("/engineer-data", response_model=dict, dependencies=[Depends(get_current_user_data)])
def engineeer_data():
    all_docs = list(projects_coll.find())
    engineers_map = {}
    for doc in all_docs:
        # Remove MongoDB's `_id` field from the document
        project = {k: v for (k, v) in doc.items() if k != "_id"}

        p_teclab_epc_data: EPCData = EPCData(**project["teclab_data"]["epc_data"])

        # Filter for lots from 2025 and onwards i.e., skip anything before 2025
        if not p_teclab_epc_data.contract_date:
            continue
        if p_teclab_epc_data.contract_date and p_teclab_epc_data.contract_date.year < 2025:
            continue

        if p_teclab_epc_data.engineering_engineer == None:
            print("WAIT: ", project["project_info"]["project_id"])
        if p_teclab_epc_data.engineering_engineer not in engineers_map:
            engineers_map[p_teclab_epc_data.engineering_engineer] = 0
        engineers_map[p_teclab_epc_data.engineering_engineer] += 1

    return engineers_map


"""
Get the cycle time of engineers
"""
@router.get("/engineer-data-2", response_model=dict, dependencies=[Depends(get_current_user_data)])
def engineeer_data_2():
    all_docs = list(projects_coll.find())
    engineers_map = {}
    for doc in all_docs:
        # Remove MongoDB's `_id` field from the document
        project = {k: v for (k, v) in doc.items() if k != "_id"}

        p_teclab_epc_data: EPCData = EPCData(**project["teclab_data"]["epc_data"])

        # Filter for lots from 2025 and onwards i.e., skip anything before 2025
        if not p_teclab_epc_data.contract_date:
            continue
        if p_teclab_epc_data.contract_date and p_teclab_epc_data.contract_date.year < 2025:
            continue

        # FIX ERROR OF PROJECTS THAT don't have both the dates
        if not p_teclab_epc_data.engineering_sent or not p_teclab_epc_data.engineering_received:
            continue

        if p_teclab_epc_data.engineering_engineer == None:
            print("WAIT: ", project["project_info"]["project_id"])
        delta_time = p_teclab_epc_data.engineering_received - p_teclab_epc_data.engineering_sent
        delta_days = delta_time.days
        if p_teclab_epc_data.engineering_engineer not in engineers_map:
            engineers_map[p_teclab_epc_data.engineering_engineer] = [delta_days]
        engineers_map[p_teclab_epc_data.engineering_engineer].append(delta_days)

    # print(engineers_map)
    return engineers_map

@router.get("/county-data-2", response_model=dict, dependencies=[Depends(get_current_user_data)])
def county_data_2():
    all_docs = list(projects_coll.find())
    counties_map = {}
    count = 1 # TODO: delete it
    for doc in all_docs:
        # Remove MongoDB's `_id` field from the document
        project = {k: v for (k, v) in doc.items() if k != "_id"}

        p_teclab_epc_data: EPCData = EPCData(**project["teclab_data"]["epc_data"])

        # Filter for lots from 2025 and onwards i.e., skip anything before 2025
        if not p_teclab_epc_data.contract_date:
            continue

        if p_teclab_epc_data.contract_date and p_teclab_epc_data.contract_date.year < 2025:
            continue

        # ONLY FINISHED PROJECTS (i.e., on going projects are not considered)
        if not p_teclab_epc_data.permitting_submitted or not p_teclab_epc_data.permitting_received:
            continue
        # THIS IS NOT SUPPOSED TO BE EMPTY
        if p_teclab_epc_data.permitting_county_name == None or p_teclab_epc_data.permitting_county_name == "":
            print("WAIT: ", project["project_info"]["project_id"])

        count += 1

        delta_time = p_teclab_epc_data.permitting_received - p_teclab_epc_data.permitting_submitted
        delta_days = delta_time.days
        if p_teclab_epc_data.permitting_county_name not in counties_map:
            counties_map[p_teclab_epc_data.permitting_county_name] = [delta_days]
        counties_map[p_teclab_epc_data.permitting_county_name].append(delta_days)

    print("Projects count", count)  # 7
    print("counties_map.len", len(counties_map))    # 3
    return counties_map

@router.get("/county-data", response_model=dict, dependencies=[Depends(get_current_user_data)])
def county_data():
    all_docs = list(projects_coll.find())
    counties_map = {}
    for doc in all_docs:
        # Remove MongoDB's `_id` field from the document
        project = {k: v for (k, v) in doc.items() if k != "_id"}

        p_teclab_epc_data: EPCData = EPCData(**project["teclab_data"]["epc_data"])

        # Filter for lots from 2025 and onwards i.e., skip anything before 2025
        if not p_teclab_epc_data.contract_date:
            continue
        if p_teclab_epc_data.contract_date and p_teclab_epc_data.contract_date.year < 2025:
            continue

        # THIS IS NOT SUPPOSED TO BE EMPTY
        if p_teclab_epc_data.permitting_county_name == None or p_teclab_epc_data.permitting_county_name == "":
            print("WAIT: ", project["project_info"]["project_id"])

        if p_teclab_epc_data.permitting_county_name not in counties_map:
            counties_map[p_teclab_epc_data.permitting_county_name] = 0
        counties_map[p_teclab_epc_data.permitting_county_name] += 1

    print("counties_map:", counties_map)
    return counties_map

