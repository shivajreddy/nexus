from typing import List, Optional

from pydantic import BaseModel


class UserSecurityDetails(BaseModel):
    roles: List[int] = []
    hashed_password: str
    verified: bool = False
    created_at: Optional[str] = None


class User(BaseModel):
    username: str
    security: 'UserSecurityDetails'


class NewUserSchema(BaseModel):
    username: str
    plain_password: str

    roles: List[int] = []

    name: str = ""
    email: str = ""
    verified: bool = False
