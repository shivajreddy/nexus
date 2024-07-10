# :: Company wide ::
from pydantic import BaseModel

"""
All schema for `eagle-data` collection
Each collection holds all the data that relates only to that department
Key -> 'department_name'
"""

"""
list of communities,
list of eagle departments,
Things like this belong in this collection. but as of now since the above two
are just a list of strings, i am not creating any schema(types). but in the 
future when adding more complex data to this collection. must create schemas.
"""


class Community(BaseModel):
    community_name: str


class UpdateCommunity(BaseModel):
    target_community_name: str
    new_community_name: str


class Engineer(BaseModel):
    engineer_name: str


class UpdateEngineer(BaseModel):
    target_engineer_name: str
    new_engineer_name: str


class PlatEngineer(BaseModel):
    plat_engineer_name: str


class UpdatePlatEngineer(BaseModel):
    target_plat_engineer_name: str
    new_plat_engineer_name: str


class County(BaseModel):
    county_name: str


class UpdateCounty(BaseModel):
    target_county_name: str
    new_county_name: str
