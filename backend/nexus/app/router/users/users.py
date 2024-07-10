from typing import Annotated

from fastapi import APIRouter, Depends

from app.database.database import users_coll
from app.security.oauth2 import get_current_user_data
from app.database.schemas.user import User

"""
API endpoint related to users data
"""

router = APIRouter(prefix="/users")


@router.get("/all")
async def get_all_users(
        current_user_data: Annotated[User, Depends(get_current_user_data)]
):
    print(f"you are, {current_user_data}")
    result = []
    for doc in list(users_coll.find()):
        data = {k: v for (k, v) in doc.items() if k != "_id"}
        result.append(data)
    return result
