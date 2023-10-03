from fastapi import APIRouter, HTTPException, status
from app.database import eagle_data_coll

"""
All public end points
"""

router = APIRouter(prefix="/public")


@router.get('/departments')
def get_all_departments_unprotected():
    departments_doc = eagle_data_coll.find_one({"table_name": "departments"})

    if not departments_doc:
        raise HTTPException(
            status_code=status.HTTP_204_NO_CONTENT, detail="Document is empty"
        )

    all_departments = departments_doc["data"]
    all_department_names = []
    for item in all_departments:
        all_department_names.append(item["department_name"])
    return all_department_names
