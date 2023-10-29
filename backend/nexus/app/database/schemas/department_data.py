from pydantic import BaseModel

"""
All schema for `department-data` collection
Each collection holds all the data that relates only to that department
Key -> 'department_name'
"""


# :: TEC-LAB ::
class Product(BaseModel):
    product_name: str


class UpdateProduct(BaseModel):
    target_product_name: str
    new_product_name: str


class CoreModel(BaseModel):
    core_model_name: str


class UpdateCoreModel(BaseModel):
    target_core_model_name: str
    new_core_model_name: str


class Elevations(BaseModel):
    elevation_name: str


class UpdateElevation(BaseModel):
    target_elevation_name: str
    new_elevation_name: str


# :: SALES ::

class B(BaseModel):
    pass
