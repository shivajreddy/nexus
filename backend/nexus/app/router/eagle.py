from typing import Annotated

from fastapi import APIRouter, Depends

from app.database import db, eagle_data_coll, users_coll
from app.oauth2 import get_current_user_data
from app.schema import User

"""
API endpoint related to company data
"""

router = APIRouter(prefix="/eagle")


@router.get('/departments')
def get_all_departments(current_user_data: Annotated[User, Depends(get_current_user_data)]):
    departments_doc = eagle_data_coll.find_one({"table_name": "departments"})
    all_departments = departments_doc["data"]
    return all_departments


@router.get("/users")
async def get_all_users(
        current_user_data: Annotated[User, Depends(get_current_user_data)]
):
    print(f"you are, {current_user_data}")
    result = []
    for doc in list(users_coll.find()):
        data = {k: v for (k, v) in doc.items() if k != "_id"}
        result.append(data)
    return result


@router.get("/test")
async def testing_protected_route(
        current_user_data: Annotated[User, Depends(get_current_user_data)]
):
    return f"you are, {current_user_data}"


# sample_data = {
#     # "_id": 1,
#     "table_name": "departments",
#     "data": [
#         {"department_name": "TEC Lab"},
#         {"department_name": "Sales"},
#         {"department_name": "Warranty"},
#         {"department_name": "Design"},
#         {"department_name": "TEC Lab"},
#     ]
# }
#
#
# @router.get('/setup')
# def set_up_eagle_data_coll():
#     # :: goal is to set up eagle-data collection
#     eagle_data_coll.insert_one(sample_data)
