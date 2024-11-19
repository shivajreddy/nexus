from fastapi import APIRouter, Depends, HTTPException, status

from app.database.database import projects_coll, department_data_coll, users_coll, eagle_data_coll
from app.database.schemas.department_data import CoreModel, UpdateCoreModel, Product, UpdateProduct, Elevation, \
    UpdateElevation
from app.database.schemas.project import Project, TecLabProjectData, SalesProjectData
from app.security.oauth2 import get_current_user_data, HasRequiredRoles
from app.database.schemas.user import User

"""
TECLAB endpoint
"""

router = APIRouter(prefix="/department/teclab")


# :: Products ::
@router.get('/products', dependencies=[Depends(get_current_user_data)])
def get_all_products():
    teclab_doc = department_data_coll.find_one({"department_name": "TEC Lab"})

    products = teclab_doc["data"]["products"]
    all_products_names = products["all_products_names"]
    return all_products_names


@router.post('/products', dependencies=[Depends(get_current_user_data)])
def add_new_product(new_product: Product):
    teclab_doc = department_data_coll.find_one({"department_name": "TEC Lab"})

    products = teclab_doc["data"]["products"]
    all_products_names = products["all_products_names"]

    if new_product.product_name in all_products_names:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail=f"{new_product.product_name} already exists"
        )

    # Step 2: Update the MongoDB document
    department_data_coll.update_one(
        {"department_name": "TEC Lab"},
        {"$push": {"data.products.all_products_names": new_product.product_name}}
    )
    return {"result": f"Product '{new_product.product_name}' added successfully"}


@router.patch('/products', dependencies=[Depends(get_current_user_data)])
def update_product(product: UpdateProduct):
    teclab_doc = department_data_coll.find_one({"department_name": "TEC Lab"})

    products = teclab_doc["data"]["products"]
    all_products_names = products["all_products_names"]

    if product.target_product_name not in all_products_names:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail=f"{product.target_product_name} doesn't exist"
        )

    # find the index of the target
    index_to_update = all_products_names.index(product.target_product_name)

    department_data_coll.update_one(
        {"department_name": "TEC Lab"},
        {"$set": {f"data.products.all_products_names.{index_to_update}": product.new_product_name}}
    )

    return {"result": f"Product '{product.target_product_name}' updated successfully"}


@router.delete('/products', dependencies=[Depends(get_current_user_data)])
def delete_product(product: Product):
    teclab_doc = department_data_coll.find_one({"department_name": "TEC Lab"})

    products = teclab_doc["data"]["products"]
    all_products_names = products["all_products_names"]

    if product.product_name not in all_products_names:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail=f"{product.product_name} doesn't exist"
        )

    # Step 2: Update the MongoDB document
    department_data_coll.update_one(
        {"department_name": "TEC Lab"},
        {"$pull": {"data.products.all_products_names": product.product_name}}
    )
    return {"result": f"Product '{product.product_name}' deleted successfully"}


# :: core-models ::
@router.get('/core-models', dependencies=[Depends(get_current_user_data)])
def get_all_core_models():
    teclab_doc = department_data_coll.find_one({"department_name": "TEC Lab"})

    core_models = teclab_doc["data"]["core_models"]
    all_core_models_names = core_models["all_core_models_names"]
    return all_core_models_names


# :: elevations ::
@router.get('/elevations', dependencies=[Depends(get_current_user_data)])
def get_all_elevation_names():
    teclab_doc = department_data_coll.find_one({"department_name": "TEC Lab"})
    return teclab_doc["data"]["elevations"]["all_elevations_names"]


@router.post('/elevations', dependencies=[Depends(get_current_user_data)])
def add_new_elevation(new_elevation: Elevation):
    teclab_doc = department_data_coll.find_one({"department_name": "TEC Lab"})

    elevations = teclab_doc["data"]["elevations"]
    all_elevations_names = elevations["all_elevations_names"]

    if new_elevation.elevation_name in all_elevations_names:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail=f"{new_elevation.elevation_name} already exists"
        )

    # Step 2: Update the MongoDB document
    department_data_coll.update_one(
        {"department_name": "TEC Lab"},
        {"$push": {"data.elevations.all_elevations_names": new_elevation.elevation_name}}
    )
    return {"result": f"Elevation '{new_elevation.elevation_name}' added successfully"}


@router.patch('/elevations', dependencies=[Depends(get_current_user_data)])
def update_elevation(elevation: UpdateElevation):
    teclab_doc = department_data_coll.find_one({"department_name": "TEC Lab"})

    elevations = teclab_doc["data"]["elevations"]
    all_elevations_names = elevations["all_elevations_names"]

    if elevation.target_elevation_name not in all_elevations_names:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail=f"{elevation.target_elevation_name} doesn't exist"
        )

    # find the index of the target
    index_to_update = all_elevations_names.index(elevation.target_elevation_name)

    department_data_coll.update_one(
        {"department_name": "TEC Lab"},
        {"$set": {f"data.elevations.all_elevations_names.{index_to_update}": elevation.target_elevation_name}}
    )

    return {"result": f"Elevation '{elevation.target_elevation_name}' updated successfully"}


@router.delete('/elevations', dependencies=[Depends(get_current_user_data)])
def delete_elevation(elevation: Elevation):
    teclab_doc = department_data_coll.find_one({"department_name": "TEC Lab"})

    elevations = teclab_doc["data"]["elevations"]
    all_elevations_names = elevations["all_elevations_names"]

    if elevation.target_elevation_name not in all_elevations_names:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail=f"{elevation.target_elevation_name} doesn't exist"
        )

    # Step 2: Update the MongoDB document
    department_data_coll.update_one(
        {"department_name": "TEC Lab"},
        {"$pull": {"data.elevations.all_elevations_names": elevation.elevation_name}}
    )
    return {"result": f"Elevation '{elevation.elevation_name}' deleted successfully"}


# :: drafters ::
@router.get('/drafters', dependencies=[Depends(get_current_user_data)])
def get_all_drafters_names():
    teclab_doc = department_data_coll.find_one({"department_name": "TEC Lab"})
    all_teams = teclab_doc["data"]["teams"]
    # drafting_team = None
    for team in all_teams:
        if team["team_name"] == "Drafting":
            # drafting_team = team
            return team["team_members"]


# :: Home-Siting drafters ::
@router.get('/homesiting-drafters', dependencies=[Depends(get_current_user_data)])
def get_all_homesiting_drafters_names():
    teclab_doc = department_data_coll.find_one({"department_name": "TEC Lab"})
    all_teams = teclab_doc["data"]["teams"]
    for team in all_teams:
        # print(team["team_name"])
        if team["team_name"] == "HomeSite Drafting":
            return team["team_members"]


# :: Field Ops members ::
@router.get('/fieldops-members', dependencies=[Depends(get_current_user_data)])
def get_all_field_ops_members_names():
    teclab_doc = department_data_coll.find_one({"department_name": "TEC Lab"})
    all_teams = teclab_doc["data"]["teams"]
    for team in all_teams:
        print(team["team_name"])
        if team["team_name"] == "Field Ops":
            return team["team_members"]