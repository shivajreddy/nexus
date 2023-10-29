import datetime
from typing import Annotated

from fastapi import APIRouter, Depends

from app.database.database import projects_coll, department_data_coll, eagle_data_coll
from app.security.oauth2 import get_current_user_data
from app.database.schemas.user import User

"""
TECLAB/EPC endpoint
"""

router = APIRouter(prefix="/department/teclab/epc")


# TODO
# this would look at the projects documents in the projects collection
@router.get('/live')
def get_collection():
    result = []
    for doc in list(projects_coll.find()):
        data = {k: v for (k, v) in doc.items() if k != "_id"}
        result.append(data)
    return {"all": result}


@router.patch('/')
def update_lot(lot_code: str):
    return {"successfully updated"}
