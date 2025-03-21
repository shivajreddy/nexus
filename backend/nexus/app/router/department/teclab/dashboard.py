from typing import List
from datetime import datetime
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

# Monthly Ticker Data
# @router.get("/current-year-ticker-data", response_model=dict, dependencies=[Depends(get_current_user_data)])
# def get_current_year_ticker_data():
#     pass
# @router.get("/previous-month-ticker-data", response_model=dict, dependencies=[Depends(get_current_user_data)])
# def get_previous_month_ticker_data():
#     pass
# @router.get("/current-month-ticker-data", response_model=dict, dependencies=[Depends(get_current_user_data)])
@router.get("/ticker-data", response_model=dict, dependencies=[Depends(get_current_user_data)])
def get_current_month_ticker_data():
    all_docs = list(projects_coll.find())

    current_year = datetime.today().year
    current_month = datetime.today().month
    print("current_year", current_year)
    print("current_month", current_month)

    filtered_docs = []  # docs that have contract_date of current_year
    filtered_p_teclab_epc_data: List[EPCData] = []

    for doc in all_docs:
        # Remove MongoDB's `_id` field from the document
        project = {k: v for (k, v) in doc.items() if k != "_id"}

        p_teclab_epc_data: EPCData = EPCData(**project["teclab_data"]["epc_data"])

        # Filter for lots from current_year and onwards i.e., skip anything before current_year
        if not p_teclab_epc_data.contract_date:
            continue
        if p_teclab_epc_data.contract_date and p_teclab_epc_data.contract_date.year < current_year:
            continue

        filtered_docs.append(project)
        filtered_p_teclab_epc_data.append(p_teclab_epc_data)

    total_projects_current_year = len(filtered_p_teclab_epc_data)
    total_projects_current_month = len([p for p in filtered_p_teclab_epc_data if p.contract_date.month == current_month])
    total_projects_previous_month = len([p for p in filtered_p_teclab_epc_data if p.contract_date.month == current_month - 1])

    print("total_projects_current_year", total_projects_current_year)
    print("total_projects_current_month", total_projects_current_month)
    print("total_projects_previous_month", total_projects_previous_month)

    # Drafting
    drafting_values = []
    for p in filtered_p_teclab_epc_data:
        if not p.drafting_assigned_on or not p.drafting_finished: continue
        days_taken_to_draft = (p.drafting_finished - p.drafting_assigned_on).days
        drafting_values.append(days_taken_to_draft)
    drafting_min = min(drafting_values)
    drafting_max = max(drafting_values)
    drafting_avg = sum(drafting_values) // len(drafting_values)

    drafting_min_previous_month = 0
    drafting_min_current_month = 0
    drafting_min_current_year = 0

    drafting_max_previous_month = 0
    drafting_max_current_month = 0
    drafting_max_current_year = 0

    drafting_avg_previous_month = 0
    drafting_avg_current_month = 0
    drafting_avg_current_year = 0

    # Engineering
    engineering_values = []
    for p in filtered_p_teclab_epc_data:
        if not p.engineering_sent or not p.engineering_received: continue
        days_taken_to_engineer = (p.engineering_received - p.engineering_sent).days
        engineering_values.append(days_taken_to_engineer)
    engineering_min = min(engineering_values)
    engineering_max = max(engineering_values)
    engineering_avg = sum(engineering_values) // len(engineering_values)

    engineering_min_previous_month = 0
    engineering_min_current_month = 0
    engineering_min_current_year = 0

    engineering_max_previous_month = 0
    engineering_max_current_month = 0
    engineering_max_current_year = 0

    engineering_avg_previous_month = 0
    engineering_avg_current_month = 0
    engineering_avg_current_year = 0

    # Plat
    plat_min_previous_month = 0
    plat_min_current_month = 0
    plat_min_current_year = 0

    plat_max_previous_month = 0
    plat_max_current_month = 0
    plat_max_current_year = 0

    plat_avg_previous_month = 0
    plat_avg_current_month = 0
    plat_avg_current_year = 0

    # Permitting
    permitting_min_previous_month = 0
    permitting_min_current_month = 0
    permitting_min_current_year = 0

    permitting_max_previous_month = 0
    permitting_max_current_month = 0
    permitting_max_current_year = 0

    permitting_avg_previous_month = 0
    permitting_avg_current_month = 0
    permitting_avg_current_year = 0

    # BBP Posted
    bbp_posted_min_previous_month = 0
    bbp_posted_min_current_month = 0
    bbp_posted_min_current_year = 0

    bbp_posted_max_previous_month = 0
    bbp_posted_max_current_month = 0
    bbp_posted_max_current_year = 0

    bbp_posted_avg_previous_month = 0
    bbp_posted_avg_current_month = 0
    bbp_posted_avg_current_year = 0

    res = {
    "CURRENT MONTH": {
        "total": total_projects_current_month,
        "breakdown": {
            "Drafting": {
                "MIN": drafting_min_current_month,
                "MAX": drafting_max_current_month,
                "VAL": drafting_avg_current_month,
            },
            "Engineering": {
                "MIN": engineering_min_current_month,
                "MAX": engineering_max_current_month,
                "VAL": engineering_avg_current_month,
            },
            "Plat": {
                "MIN": plat_min_current_month,
                "MAX": plat_max_current_month,
                "VAL": plat_avg_current_month,
            },
            "Permitting": {
                "MIN": permitting_min_current_month,
                "MAX": permitting_max_current_month,
                "VAL": permitting_avg_current_month,
            },
            "BBP Posted": {
                "MIN": bbp_posted_min_current_month,
                "MAX": bbp_posted_max_current_month,
                "VAL": bbp_posted_avg_current_month,
            },
        },
    },
    "PREVIOUS MONTH": {
        "total": total_projects_previous_month,
        "breakdown": {
            "Drafting": {
                "MIN": drafting_min_previous_month,
                "MAX": drafting_max_previous_month,
                "VAL": drafting_avg_previous_month,
            },
            "Engineering": {
                "MIN": engineering_min_previous_month,
                "MAX": engineering_max_previous_month,
                "VAL": engineering_avg_previous_month,
            },
            "Plat": {
                "MIN": plat_min_previous_month,
                "MAX": plat_max_previous_month,
                "VAL": plat_avg_previous_month,
            },
            "Permitting": {
                "MIN": permitting_min_previous_month,
                "MAX": permitting_max_previous_month,
                "VAL": permitting_avg_previous_month,
            },
            "BBP Posted": {
                "MIN": bbp_posted_min_previous_month,
                "MAX": bbp_posted_max_previous_month,
                "VAL": bbp_posted_avg_previous_month,
            },
        },
    },
    "CURRENT YEAR": {
        "total": total_projects_current_year,
        "breakdown": {
            "Drafting": {
                "MIN": drafting_min_current_year,
                "MAX": drafting_max_current_year,
                "VAL": drafting_avg_current_year,
            },
            "Engineering": {
                "MIN": engineering_min_current_year,
                "MAX": engineering_max_current_year,
                "VAL": engineering_avg_current_year,
            },
            "Plat": {
                "MIN": plat_min_current_year,
                "MAX": plat_max_current_year,
                "VAL": plat_avg_current_year,
            },
            "Permitting": {
                "MIN": permitting_min_current_year,
                "MAX": permitting_max_current_year,
                "VAL": permitting_avg_current_year,
            },
            "BBP Posted": {
                "MIN": bbp_posted_min_current_year,
                "MAX": bbp_posted_max_current_year,
                "VAL": bbp_posted_avg_current_year,
            },
        },
    },
    }
    print(res)
    return res

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

    # print("counties_map:", counties_map)
    return counties_map


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

    # print("Projects count", count)
    # print("counties_map.len", len(counties_map))
    return counties_map

