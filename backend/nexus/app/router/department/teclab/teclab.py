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


@router.get('/setup-teclab')
async def setup_teclab():
    pass


@router.get('/setup-department-data')
async def setup_departments():
    department_data_coll.create_index('department_name', unique=True)
    users_coll.create_index('username', unique=True)
    return {"done setting up department data"}
