from typing import Dict, List
from collections import defaultdict
from datetime import datetime, timedelta
import calendar
from pydantic import BaseModel

from fastapi import APIRouter, Depends

from app.database.database import projects_coll 
from app.database.schemas.department_data import EPCData
from app.database.schemas.project import Project
from app.security.oauth2 import get_current_user_data

"""
Endpoing: /department/teclab/graphs
Purpose:
  - API for all graphs
"""

router = APIRouter(prefix="/department/teclab/graphs")

@router.get("/test", response_model=dict)
def get_current_month_ticker_data():
    return {"GRAPHS" : "TEST OKAY"}

