
from fastapi import APIRouter, Depends, HTTPException, status

from app.database.database import projects_coll, department_data_coll, users_coll, eagle_data_coll
from app.database.schemas.department_data import CoreModel
from app.database.schemas.project import Project, DepartmentSpecificTecLab, DepartmentSpecificSales
from app.security.oauth2 import get_current_user_data, HasRequiredRoles
from app.database.schemas.user import User

"""
TECLAB endpoint
"""

router = APIRouter(prefix="/department/teclab")


# :: core-models ::
@router.get('/core-models', dependencies=[Depends(get_current_user_data)])
def get_all_core_models():
    core_models_doc = eagle_data_coll.find_one({"table_name": "core_models"})
    return core_models_doc["all_core_model_names"]


# add a new core-model
@router.post("/core-models", dependencies=[Depends(HasRequiredRoles(required_roles=[101]))])
def add_new_core_model(new_core_model: CoreModel):
    teclab_doc = department_data_coll.find_one({"department_name": "TEC Lab"})

    core_models = teclab_doc["data"]["core_models"]
    all_core_models_names = core_models["all_core_models_names"]

    new_core_model_name = new_core_model.core_model_name
    if new_core_model_name in all_core_models_names:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail=f"{new_core_model_name} already exists"
        )

    # Update the document by pushing  new counties name into the array
    # ? TODO -
    department_data_coll.update_one({"department_name": "TEC Lab"},
                                    {}
                                    )
    eagle_data_coll.update_one(
        {"table_name": "counties"},
        {"$push": {"all_core_models_names": new_core_model_name}}
    )
    core_models_doc = eagle_data_coll.find_one({"table_name": "counties"})
    all_core_models_names = core_models_doc["all_core_models_names"]
    return {"added": all_core_models_names}


# update a county
@router.patch("/counties", dependencies=[Depends(HasRequiredRoles(required_roles=[101]))])
def delete_county(target_county: UpdateCounty):
    counties_doc = eagle_data_coll.find_one({"table_name": "counties"})
    all_counties_names = counties_doc["all_counties_names"]

    target_county_name = target_county.target_county_name
    if target_county_name not in all_counties_names:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail=f"'{target_county_name}' doesn't exists"
        )
        # Find the index of the target county name in the array
    index_to_update = all_counties_names.index(target_county_name)

    # Update the county name at the specified index
    eagle_data_coll.update_one(
        {"table_name": "counties"},
        {"$set": {f"all_counties_names.{index_to_update}": target_county.new_county_name}},
    )

    counties_doc = eagle_data_coll.find_one({"table_name": "counties"})
    all_counties_names = counties_doc["all_counties_names"]
    return {"Updated. now": all_counties_names}


# delete a county
@router.delete("/counties", dependencies=[Depends(HasRequiredRoles(required_roles=[101]))])
def delete_county(target_county: County):
    counties_doc = eagle_data_coll.find_one({"table_name": "counties"})
    all_counties_names = counties_doc["all_counties_names"]

    target_county_name = target_county.county_name
    if target_county_name not in all_counties_names:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail=f"{target_county_name} doesn't exists"
        )
    eagle_data_coll.update_one(
        {"table_name": "counties"},
        {"$pull": {"all_counties_names": target_county_name}}
    )
    counties_doc = eagle_data_coll.find_one({"table_name": "counties"})
    all_counties_names = counties_doc["all_counties_names"]
    return {"deleted. now": all_counties_names}


# :: elevations ::
@router.get('/elevations', dependencies=[Depends(get_current_user_data)])
def get_all_elevation_names():
    teclab_doc = department_data_coll.find_one({"department_name": "TEC Lab"})
    return teclab_doc["data"]["elevations"]["all_elevation_names"]


# :: drafters ::
@router.get('/drafters', dependencies=[Depends(get_current_user_data)])
def get_all_drafters_names():
    teclab_doc = department_data_coll.find_one({"department_name": "TEC Lab"})
    all_teams = teclab_doc["data"]["teams"]
    drafting_team = None
    for team in all_teams:
        if team["team_name"] == "Drafting":
            drafting_team = team
    return drafting_team["team_members"]
