from typing import Annotated

from fastapi import APIRouter, Depends

from app.database.database import projects_coll
from app.security.oauth2 import get_current_user_data
from app.database.schemas.schema import User

"""
EPC endpoint
"""

router = APIRouter(prefix="/teclab/epc")


@router.get('/')
async def test_epc(
        current_user_data: Annotated[User, Depends(get_current_user_data)]
):
    return {"testing epc route ok"}


# :: Setup database (delete after setup)

sample_data = {
    # "_id": 1,
    "project_uid": "PV-05-1",

    # company-wide-data
    "contract_date": "",
    "contract_type": "",
    "customer_data": "",

    # department-specific-data
    "dept_pvt_teclab": {  # TEC-LAB
        "drafter": "user-id",
        "assigned_on": "",
        "completed_on": ""
    },

    "dept_pvt_sales": {  # SALES
        "salesman": "user-id",
        "sale_completed_on": "",
        "lifestyles_completed_on": ""
    },
}


@router.get('/setup')
def set_up_projects_collection():
    # :: goal is to set up eagle-data collection
    projects_coll.insert_one()
