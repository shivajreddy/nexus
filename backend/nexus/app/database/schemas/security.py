from datetime import datetime
from typing import List

from pydantic import BaseModel

from app.database.schemas.user import User


class LoginResponse(BaseModel):
    user: User
    access_token: str


class RefreshTokenData(BaseModel):
    username: str
    created_at: str
    exp: datetime


class AccessTokenData(BaseModel):
    username: str
    roles: List[int]
    created_at: str
    exp: datetime
