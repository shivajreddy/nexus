import datetime
from typing import Annotated

from fastapi import APIRouter, Depends

from app.database.database import projects_coll, department_data_coll, users_coll
from app.database.schemas.project import Project, DepartmentSpecificTecLab, DepartmentSpecificSales
from app.security.oauth2 import get_current_user_data
from app.database.schemas.user import User

"""
TECLAB endpoint
"""

router = APIRouter(prefix="/department/teclab")


@router.get('/')
def test_teclab():
    return {"hi"}


@router.get('/elevations', dependencies=[Depends(get_current_user_data)])
def get_all_elevation_names():
    teclab_doc = department_data_coll.find_one({"department_name": "TEC Lab"})
    return teclab_doc["data"]["elevations"]["all_elevation_names"]


@router.get('/drafters', dependencies=[Depends(get_current_user_data)])
def get_all_drafters_names():
    teclab_doc = department_data_coll.find_one({"department_name": "TEC Lab"})
    all_teams = teclab_doc["data"]["teams"]
    drafting_team = None
    for team in all_teams:
        if team["team_name"] == "Drafting":
            drafting_team = team
    return drafting_team["team_members"]

