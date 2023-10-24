from pydantic import BaseModel

"""
All schema for `department-data` collection
Each collection holds all the data that relates only to that department
Key -> 'department_name'
"""


class DepartmentSpecificData(BaseModel):
    department_name: str
    department_data: any


# :: TEC-LAB ::

class A(BaseModel):
    pass


class CommunityName(BaseModel):
    community_name: str


# :: SALES ::

class B(BaseModel):
    pass
