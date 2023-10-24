# :: Company wide ::
from pydantic import BaseModel

"""
All schema for `eagle-data` collection
Each collection holds all the data that relates only to that department
Key -> 'department_name'
"""


class CompanyWideData(BaseModel):
    all_communities: [str]
    all_engineers: [str]
    all_plat_engineers: [str]


class EagleDepartment(BaseException):
    department_name: str
