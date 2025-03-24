from typing import List
from datetime import datetime, timedelta
from pydantic import BaseModel

from fastapi import APIRouter, Depends

from app.database.database import projects_coll 
from app.database.schemas.department_data import EPCData
from app.database.schemas.project import Project
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
    
    # Get current and previous month correctly
    current_date = datetime.today()
    first_day_of_current_month = current_date.replace(day=1)
    last_day_of_previous_month = first_day_of_current_month - timedelta(days=1)
    previous_month = last_day_of_previous_month.month
    previous_month_year = last_day_of_previous_month.year
    
    current_month_name = current_date.strftime("%B")
    previous_month_name = last_day_of_previous_month.strftime("%B")
    current_year_name = str(current_year)

    filtered_projects: List[Project] = []  # docs that have contract_date of current_year
    filtered_p_teclab_epc_data: List[EPCData] = []

    for doc in all_docs:
        # Remove MongoDB's `_id` field from the document
        project_raw = {k: v for (k, v) in doc.items() if k != "_id"}
        project: Project = Project(**project_raw)

        p_teclab_epc_data: EPCData = EPCData(**project_raw["teclab_data"]["epc_data"])

        # Filter for lots from current_year and onwards i.e., skip anything before current_year
        if not p_teclab_epc_data.contract_date:
            continue
        if p_teclab_epc_data.contract_date and p_teclab_epc_data.contract_date.year < current_year:
            continue

        filtered_projects.append(project)
        # if project.teclab_data.epc_data.drafting_assigned_on and project.teclab_data.epc_data.drafting_finished:
        #     days_taken_to_draft = (project.teclab_data.epc_data.drafting_finished - project.teclab_data.epc_data.drafting_assigned_on).days
        #     if days_taken_to_draft <= 0:
        #         print("ERROR: cant be -ve days", project.project_info)
        filtered_p_teclab_epc_data.append(p_teclab_epc_data)

    total_projects_current_year = len(filtered_p_teclab_epc_data)
    total_projects_current_month = len([p for p in filtered_p_teclab_epc_data if p.contract_date.month == current_month])
    total_projects_previous_month = len([p for p in filtered_p_teclab_epc_data if p.contract_date.month == previous_month and p.contract_date.year == previous_month_year])

    # Helper function to calculate min, max, avg for a specific time period
    def calculate_stats(data_values, projects, filter_func):
        filtered_values = [value for project, value in zip(projects, data_values) if filter_func(project)]
        if not filtered_values:
            return 0, 0, 0, 0
        return min(filtered_values), max(filtered_values), sum(filtered_values) // len(filtered_values), len(filtered_values)

    # Drafting calculations
    drafting_projects = []
    drafting_values = []
    for p in filtered_projects:
        if not p.teclab_data.epc_data.drafting_assigned_on or not p.teclab_data.epc_data.drafting_finished:
            continue
        days_taken_to_draft = (p.teclab_data.epc_data.drafting_finished - p.teclab_data.epc_data.drafting_assigned_on).days
        if days_taken_to_draft < 0:
            print("ERROR:Drafting:days_taken_to_draft cant be <= 0 days")
        drafting_projects.append(p)
        drafting_values.append(days_taken_to_draft)
    print("drafting values:::", drafting_values)

    # Calculate for different time periods
    drafting_min_current_year, drafting_max_current_year, drafting_avg_current_year, drafting_count_current_year = calculate_stats(
        drafting_values,    # drafting values from the filtered projects
        drafting_projects,  # we pass the filtered projects that are used to grab the drafting values
        lambda p: p.teclab_data.epc_data.drafting_finished.year == current_year
    )
    
    drafting_min_current_month, drafting_max_current_month, drafting_avg_current_month, drafting_count_current_month = calculate_stats(
        drafting_values, 
        drafting_projects,
        lambda p: p.teclab_data.epc_data.drafting_finished.year == current_year and p.teclab_data.epc_data.drafting_finished.month == current_month
    )
    
    drafting_min_previous_month, drafting_max_previous_month, drafting_avg_previous_month, drafting_count_previous_month = calculate_stats(
        drafting_values, 
        drafting_projects,
        lambda p: p.teclab_data.epc_data.drafting_finished.year == current_year and p.teclab_data.epc_data.drafting_finished.month == previous_month
    )

    # Engineering calculations
    engineering_values = []
    engineering_projects = []

    for p in filtered_projects:
        if not p.teclab_data.epc_data.engineering_sent or not p.teclab_data.epc_data.engineering_received:
            continue
        days_taken_to_engineer = (p.teclab_data.epc_data.engineering_received - p.teclab_data.epc_data.engineering_sent).days
        engineering_projects.append(p)
        engineering_values.append(days_taken_to_engineer)

    # Calculate for different time periods
    engineering_min_current_year, engineering_max_current_year, engineering_avg_current_year, engineering_count_current_year = calculate_stats(
        engineering_values, 
        engineering_projects,
        lambda p: p.teclab_data.epc_data.engineering_received.year == current_year
    )
    
    engineering_min_current_month, engineering_max_current_month, engineering_avg_current_month, engineering_count_current_month = calculate_stats(
        engineering_values, 
        engineering_projects,
        lambda p: p.teclab_data.epc_data.engineering_received.year == current_year and p.teclab_data.epc_data.engineering_received.month == current_month
    )
    
    engineering_min_previous_month, engineering_max_previous_month, engineering_avg_previous_month, engineering_count_previous_month = calculate_stats(
        engineering_values, 
        engineering_projects,
        lambda p: p.teclab_data.epc_data.engineering_received.year == current_year and p.teclab_data.epc_data.engineering_received.month == previous_month
    )

    # Plat calculations
    plat_values = []
    plat_projects = []
    for p in filtered_projects:
        if not p.teclab_data.epc_data.plat_sent or not p.teclab_data.epc_data.plat_received: 
            continue
        days_taken_for_plat = (p.teclab_data.epc_data.plat_received - p.teclab_data.epc_data.plat_sent).days
        plat_projects.append(p)
        plat_values.append(days_taken_for_plat)
    
    # Calculate for different time periods
    plat_min_current_year, plat_max_current_year, plat_avg_current_year, plat_count_current_year = calculate_stats(
        plat_values, 
        plat_projects,
        lambda p: p.teclab_data.epc_data.plat_received.year == current_year
    )
    
    plat_min_current_month, plat_max_current_month, plat_avg_current_month, plat_count_current_month = calculate_stats(
        plat_values, 
        plat_projects,
        lambda p: p.teclab_data.epc_data.plat_received.year == current_year and p.teclab_data.epc_data.plat_received.month == current_month
    )
    
    plat_min_previous_month, plat_max_previous_month, plat_avg_previous_month, plat_count_previous_month = calculate_stats(
        plat_values, 
        plat_projects,
        lambda p: p.teclab_data.epc_data.plat_received.year == current_year and p.teclab_data.epc_data.plat_received.month == previous_month
    )

    # Permitting calculations
    permitting_values = []
    permitting_projects = []
    for p in filtered_projects:
        if not p.teclab_data.epc_data.permitting_submitted or not p.teclab_data.epc_data.permitting_received: 
            continue
        days_taken_for_permitting = (p.teclab_data.epc_data.permitting_received - p.teclab_data.epc_data.permitting_submitted).days
        permitting_projects.append(p)
        permitting_values.append(days_taken_for_permitting)
    
    # Calculate for different time periods
    permitting_min_current_year, permitting_max_current_year, permitting_avg_current_year, permitting_count_current_year = calculate_stats(
        permitting_values, 
        permitting_projects,
        lambda p: p.teclab_data.epc_data.permitting_received.year == current_year
    )
    
    permitting_min_current_month, permitting_max_current_month, permitting_avg_current_month, permitting_count_current_month = calculate_stats(
        permitting_values, 
        permitting_projects,
        lambda p: p.teclab_data.epc_data.permitting_received.year == current_year and p.teclab_data.epc_data.permitting_received.month == current_month
    )
    
    permitting_min_previous_month, permitting_max_previous_month, permitting_avg_previous_month, permitting_count_previous_month = calculate_stats(
        permitting_values, 
        permitting_projects,
        lambda p: p.teclab_data.epc_data.permitting_received.year == current_year and p.teclab_data.epc_data.permitting_received.month == previous_month
    )

    # BBP Posted calculations
    bbp_posted_values = []
    bbp_posted_projects = []
    for p in filtered_projects:
        if not p.teclab_data.epc_data.contract_date or not p.teclab_data.epc_data.bbp_posted or not p.teclab_data.epc_data.permitting_received: 
            continue
        days_taken_for_bbp_posted = (p.teclab_data.epc_data.bbp_posted - p.teclab_data.epc_data.permitting_received).days
        bbp_posted_projects.append(p)
        bbp_posted_values.append(days_taken_for_bbp_posted)
    
    # Calculate for different time periods
    bbp_posted_min_current_year, bbp_posted_max_current_year, bbp_posted_avg_current_year, bbp_posted_count_current_year = calculate_stats(
        bbp_posted_values, 
        bbp_posted_projects,
        lambda p: p.teclab_data.epc_data.bbp_posted.year == current_year
    )
    
    bbp_posted_min_current_month, bbp_posted_max_current_month, bbp_posted_avg_current_month, bbp_posted_count_current_month = calculate_stats(
        bbp_posted_values, 
        bbp_posted_projects,
        lambda p: p.teclab_data.epc_data.bbp_posted.year == current_year and p.teclab_data.epc_data.bbp_posted.month == current_month
    )
    
    bbp_posted_min_previous_month, bbp_posted_max_previous_month, bbp_posted_avg_previous_month, bbp_posted_count_previous_month = calculate_stats(
        bbp_posted_values, 
        bbp_posted_projects,
        lambda p: p.teclab_data.epc_data.bbp_posted.year == current_year and p.teclab_data.epc_data.bbp_posted.month == previous_month
    )

    res = {
    "CURRENT MONTH": {
        "title" : current_month_name,
        "total": total_projects_current_month,
        "breakdown": {
            "Drafting": {
                "USER_MIN": 1,
                "USER_MAX": 20,
                "MIN": drafting_min_current_month,
                "MAX": drafting_max_current_month,
                "VAL": drafting_avg_current_month,
                "COUNT":drafting_count_current_month 
            },
            "Engineering": {
                "USER_MIN": 1,
                "USER_MAX": 8,
                "MIN": engineering_min_current_month,
                "MAX": engineering_max_current_month,
                "VAL": engineering_avg_current_month,
                "COUNT":engineering_count_current_month 
            },
            "Plat": {
                "USER_MIN": 1,
                "USER_MAX": 8,
                "MIN": plat_min_current_month,
                "MAX": plat_max_current_month,
                "VAL": plat_avg_current_month,
                "COUNT" :plat_count_current_month 
            },
            "Permitting": {
                "USER_MIN": 14,
                "USER_MAX": 28,
                "MIN": permitting_min_current_month,
                "MAX": permitting_max_current_month,
                "VAL": permitting_avg_current_month,
                "COUNT": permitting_count_current_month,
            },
            "BBP Posted": {
                "USER_MIN": 1,
                "USER_MAX": 5,
                "MIN": bbp_posted_min_current_month,
                "MAX": bbp_posted_max_current_month,
                "VAL": bbp_posted_avg_current_month,
                "COUNT": bbp_posted_count_current_month,
            },
        },
    },
    "PREVIOUS MONTH": {
        "title" : previous_month_name,
        "total": total_projects_previous_month,
        "breakdown": {
            "Drafting": {
                "USER_MIN": 1,
                "USER_MAX": 20,
                "MIN": drafting_min_previous_month,
                "MAX": drafting_max_previous_month,
                "VAL": drafting_avg_previous_month,
                "COUNT": drafting_count_previous_month,
            },
            "Engineering": {
                "USER_MIN": 1,
                "USER_MAX": 8,
                "MIN": engineering_min_previous_month,
                "MAX": engineering_max_previous_month,
                "VAL": engineering_avg_previous_month,
                "COUNT": engineering_count_previous_month,
            },
            "Plat": {
                "USER_MIN": 1,
                "USER_MAX": 8,
                "MIN": plat_min_previous_month,
                "MAX": plat_max_previous_month,
                "VAL": plat_avg_previous_month,
                "COUNT": plat_count_previous_month,
            },
            "Permitting": {
                "USER_MIN": 14,
                "USER_MAX": 28,
                "MIN": permitting_min_previous_month,
                "MAX": permitting_max_previous_month,
                "VAL": permitting_avg_previous_month,
                "COUNT": permitting_count_previous_month,
            },
            "BBP Posted": {
                "USER_MIN": 1,
                "USER_MAX": 5,
                "MIN": bbp_posted_min_previous_month,
                "MAX": bbp_posted_max_previous_month,
                "VAL": bbp_posted_avg_previous_month,
                "COUNT": bbp_posted_count_previous_month,
            },
        },
    },
    "CURRENT YEAR": {
        "title": current_year_name,
        "total": total_projects_current_year,
        "breakdown": {
            "Drafting": {
                "USER_MIN": 1,
                "USER_MAX": 20,
                "MIN": drafting_min_current_year,
                "MAX": drafting_max_current_year,
                "VAL": drafting_avg_current_year,
                "COUNT": drafting_count_current_year,
            },
            "Engineering": {
                "USER_MIN": 1,
                "USER_MAX": 8,
                "MIN": engineering_min_current_year,
                "MAX": engineering_max_current_year,
                "VAL": engineering_avg_current_year,
                "COUNT": engineering_count_current_year,
            },
            "Plat": {
                "USER_MIN": 1,
                "USER_MAX": 8,
                "MIN": plat_min_current_year,
                "MAX": plat_max_current_year,
                "VAL": plat_avg_current_year,
                "COUNT": plat_count_current_year,
            },
            "Permitting": {
                "USER_MIN": 14,
                "USER_MAX": 28,
                "MIN": permitting_min_current_year,
                "MAX": permitting_max_current_year,
                "VAL": permitting_avg_current_year,
                "COUNT": permitting_count_current_year,
            },
            "BBP Posted": {
                "USER_MIN": 1,
                "USER_MAX": 5,
                "MIN": bbp_posted_min_current_year,
                "MAX": bbp_posted_max_current_year,
                "VAL": bbp_posted_avg_current_year,
                "COUNT": bbp_posted_count_current_year,
            },
        },
    },
    }
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

