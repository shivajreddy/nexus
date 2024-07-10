from typing import List, Optional

from pydantic import BaseModel


class User(BaseModel):
    username: str
    security: 'UserSecurityDetails'
    user_info: 'UserInfo'


class UserSecurityDetails(BaseModel):
    roles: List[int] = []
    hashed_password: str
    verified: bool = False
    created_at: Optional[str] = None


class UserInfo(BaseModel):
    first_name: str
    last_name: str
    department: str
    job_title: str
    work_phone: Optional[str] = ""
    personal_phone: Optional[str] = ""
    teams: List[str] = []


class NewUserSchema(BaseModel):
    username: str
    plain_password: str

    roles: List[int] = []

    name: str = ""
    email: str = ""
    verified: bool = False

    first_name: str = ""
    last_name: str = ""
    department: str = ""
    job_title: str = ""
