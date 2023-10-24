import datetime
from typing import Annotated

from fastapi import APIRouter, Depends

from app.database.database import projects_coll, department_data_coll
from app.database.schemas.project import Project, DepartmentSpecificTecLab, DepartmentSpecificSales
from app.security.oauth2 import get_current_user_data
from app.database.schemas.schema import User

"""
TECLAB endpoint
"""

router = APIRouter(prefix="/department/teclab")


@router.get('/')
async def test_r():
    return "department/teclab"


@router.get('/')
def testing():
    return "hello"
