from typing import Annotated

from fastapi import APIRouter, Depends

from app.database import db
from app.oauth2 import get_current_user_data
from app.schema import User

"""
API endpoint related to company data
"""

router = APIRouter(prefix="/eagle")


@router.get('/departments')
def get_all_departments(current_user_data: Annotated[User, Depends(get_current_user_data)]):
    eagle_coll = db["eagle"]
    all_docs = []
    for doc in list(eagle_coll.find()):
        data = {k: v for (k, v) in doc.items() if k != "_id"}
        all_docs.append(data)
    return all_docs

