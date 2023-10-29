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


@router.get('/')
async def test_epc(
        current_user_data: Annotated[User, Depends(get_current_user_data)]
):
    return {"testing epc route ok"}


# this would look at the projects documents in the projects collection
@router.get('/live')
def get_collection():
    result = []
    for doc in list(projects_coll.find()):
        data = {k: v for (k, v) in doc.items() if k != "_id"}
        result.append(data)
    return {"all": result}



@router.get('/elevations', dependencies=[Depends(get_current_user_data)])
def get_all_core_models():
    core_models_doc = eagle_data_coll.find_one({"table_name": "core_models"})
    return core_models_doc["all_core_model_names"]
