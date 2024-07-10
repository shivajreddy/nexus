from typing import List, Annotated

from fastapi import APIRouter, Depends, HTTPException
from starlette import status

from app.database.database import eagle_data_coll
from app.database.schemas.eagle_data import Community, UpdateCommunity, Engineer, UpdateEngineer, PlatEngineer, \
    UpdatePlatEngineer, County, UpdateCounty
from app.security.oauth2 import get_current_user_data, HasRequiredRoles

"""
API endpoint related to eagle data
"""

router = APIRouter(prefix="/eagle")


# :: /departments
@router.get(path='/departments', dependencies=[Depends(get_current_user_data)])
def get_all_departments():
    departments_doc = eagle_data_coll.find_one({"table_name": "departments"})
    all_departments = departments_doc["departments_names"]
    return all_departments


# :: /communities
# get all community names
@router.get('/communities', dependencies=[Depends(get_current_user_data)])
def get_all_communities():
    communities_doc = eagle_data_coll.find_one({"table_name": "communities"})
    return communities_doc["all_communities_names"]


# add a new community
@router.post("/communities", dependencies=[Depends(HasRequiredRoles(required_roles=[101]))])
def add_new_community(new_community: Community):
    communities_doc = eagle_data_coll.find_one({"table_name": "communities"})
    all_communities_names = communities_doc["all_communities_names"]

    new_community_name = new_community.community_name
    if new_community_name in all_communities_names:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail=f"{new_community_name} already exists"
        )

    # Update the document by pushing the new community name into the array
    eagle_data_coll.update_one(
        {"table_name": "communities"},
        {"$push": {"all_communities_names": new_community_name}}
    )
    communities_doc = eagle_data_coll.find_one({"table_name": "communities"})
    all_communities_names = communities_doc["all_communities_names"]
    return {"added": all_communities_names}


# update a community
@router.patch("/communities", dependencies=[Depends(HasRequiredRoles(required_roles=[101]))])
def delete_community(target_community: UpdateCommunity):
    communities_doc = eagle_data_coll.find_one({"table_name": "communities"})
    all_communities_names = communities_doc["all_communities_names"]

    target_community_name = target_community.target_community_name
    if target_community_name not in all_communities_names:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail=f"'{target_community_name}' doesn't exists"
        )
        # Find the index of the target community name in the array
    index_to_update = all_communities_names.index(target_community_name)

    # Update the community name at the specified index
    eagle_data_coll.update_one(
        {"table_name": "communities"},
        {"$set": {f"all_communities_names.{index_to_update}": target_community.new_community_name}},
    )

    communities_doc = eagle_data_coll.find_one({"table_name": "communities"})
    all_communities_names = communities_doc["all_communities_names"]
    return {"Updated. now": all_communities_names}


# delete a community
@router.delete("/communities", dependencies=[Depends(HasRequiredRoles(required_roles=[101]))])
def delete_community(target_community: Community):
    communities_doc = eagle_data_coll.find_one({"table_name": "communities"})
    all_communities_names = communities_doc["all_communities_names"]

    target_community_name = target_community.community_name
    if target_community_name not in all_communities_names:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail=f"{target_community_name} doesn't exists"
        )
    eagle_data_coll.update_one(
        {"table_name": "communities"},
        {"$pull": {"all_communities_names": target_community_name}}
    )
    communities_doc = eagle_data_coll.find_one({"table_name": "communities"})
    all_communities_names = communities_doc["all_communities_names"]
    return {"deleted. now": all_communities_names}


# :: engineers ::
# get all engineers
@router.get('/engineers', dependencies=[Depends(get_current_user_data)])
def get_all_engineers():
    engineers_doc = eagle_data_coll.find_one({"table_name": "engineers"})
    return engineers_doc["all_engineers_names"]


# add a new engineer
@router.post("/engineers", dependencies=[Depends(HasRequiredRoles(required_roles=[101]))])
def add_new_engineer(new_engineer: Engineer):
    engineers_doc = eagle_data_coll.find_one({"table_name": "engineers"})
    all_engineers_names = engineers_doc["all_engineers_names"]

    new_engineer_name = new_engineer.engineer_name
    if new_engineer_name in all_engineers_names:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail=f"{new_engineer_name} already exists"
        )

    # Update the document by pushing the new engineer name into the array
    eagle_data_coll.update_one(
        {"table_name": "engineers"},
        {"$push": {"all_engineers_names": new_engineer_name}}
    )
    engineers_doc = eagle_data_coll.find_one({"table_name": "engineers"})
    all_engineers_names = engineers_doc["all_engineers_names"]
    return {"added": all_engineers_names}


# update a engineer
@router.patch("/engineers", dependencies=[Depends(HasRequiredRoles(required_roles=[101]))])
def delete_engineer(target_engineer: UpdateEngineer):
    engineers_doc = eagle_data_coll.find_one({"table_name": "engineers"})
    all_engineers_names = engineers_doc["all_engineers_names"]

    target_engineer_name = target_engineer.target_engineer_name
    if target_engineer_name not in all_engineers_names:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail=f"'{target_engineer_name}' doesn't exists"
        )
        # Find the index of the target engineer name in the array
    index_to_update = all_engineers_names.index(target_engineer_name)

    # Update the engineer name at the specified index
    eagle_data_coll.update_one(
        {"table_name": "engineers"},
        {"$set": {f"all_engineers_names.{index_to_update}": target_engineer.new_engineer_name}},
    )

    engineers_doc = eagle_data_coll.find_one({"table_name": "engineers"})
    all_engineers_names = engineers_doc["all_engineers_names"]
    return {"Updated. now": all_engineers_names}


# delete a engineer
@router.delete("/engineers", dependencies=[Depends(HasRequiredRoles(required_roles=[101]))])
def delete_engineer(target_engineer: Engineer):
    engineers_doc = eagle_data_coll.find_one({"table_name": "engineers"})
    all_engineers_names = engineers_doc["all_engineers_names"]

    target_engineer_name = target_engineer.engineer_name
    if target_engineer_name not in all_engineers_names:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail=f"{target_engineer_name} doesn't exists"
        )
    eagle_data_coll.update_one(
        {"table_name": "engineers"},
        {"$pull": {"all_engineers_names": target_engineer_name}}
    )
    engineers_doc = eagle_data_coll.find_one({"table_name": "engineers"})
    all_engineers_names = engineers_doc["all_engineers_names"]
    return {"deleted. now": all_engineers_names}


# :: plat-engineer ::
# get all plat - engineers
@router.get('/plat-engineers', dependencies=[Depends(get_current_user_data)])
def get_all_plat_engineers():
    plat_engineers_doc = eagle_data_coll.find_one({"table_name": "plat_engineers"})
    return plat_engineers_doc["all_plat_engineers_names"]


# add a new plat-engineer
@router.post("/plat-engineers", dependencies=[Depends(HasRequiredRoles(required_roles=[101]))])
def add_new_plat_engineer(new_plat_engineer: PlatEngineer):
    plat_engineer_doc = eagle_data_coll.find_one({"table_name": "plat_engineers"})
    all_plat_engineers_names = plat_engineer_doc["all_plat_engineers_names"]

    new_plat_engineer_name = new_plat_engineer.plat_engineer_name
    if new_plat_engineer_name in all_plat_engineers_names:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail=f"{new_plat_engineer_name} already exists"
        )

    # Update the document by pushing the new plat-engineer name into the array
    eagle_data_coll.update_one(
        {"table_name": "plat_engineers"},
        {"$push": {"all_plat_engineers_names": new_plat_engineer_name}}
    )
    plat_engineer_doc = eagle_data_coll.find_one({"table_name": "plat_engineers"})
    all_plat_engineers_names = plat_engineer_doc["all_plat_engineers_names"]
    return {"added": all_plat_engineers_names}


# update a plat-engineer
@router.patch("/plat-engineers", dependencies=[Depends(HasRequiredRoles(required_roles=[101]))])
def delete_plat_engineer(target_plat_engineer: UpdatePlatEngineer):
    plat_engineer_doc = eagle_data_coll.find_one({"table_name": "plat_engineers"})
    all_plat_engineers_names = plat_engineer_doc["all_plat_engineers_names"]

    target_plat_engineer_name = target_plat_engineer.target_plat_engineer_name
    if target_plat_engineer_name not in all_plat_engineers_names:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail=f"'{target_plat_engineer_name}' doesn't exists"
        )
        # Find the index of the target plat-engineer name in the array
    index_to_update = all_plat_engineers_names.index(target_plat_engineer_name)

    # Update the plat-engineer name at the specified index
    eagle_data_coll.update_one(
        {"table_name": "plat_engineers"},
        {"$set": {f"all_plat_engineers_names.{index_to_update}": target_plat_engineer.new_plat_engineer_name}},
    )

    plat_engineer_doc = eagle_data_coll.find_one({"table_name": "plat_engineers"})
    all_plat_engineers_names = plat_engineer_doc["all_plat_engineers_names"]
    return {"Updated. now": all_plat_engineers_names}


# delete a plat-engineer
@router.delete("/plat-engineers", dependencies=[Depends(HasRequiredRoles(required_roles=[101]))])
def delete_plat_engineer(target_plat_engineer: PlatEngineer):
    plat_engineer_doc = eagle_data_coll.find_one({"table_name": "plat_engineers"})
    all_plat_engineers_names = plat_engineer_doc["all_plat_engineers_names"]

    target_plat_engineer_name = target_plat_engineer.plat_engineer_name
    if target_plat_engineer_name not in all_plat_engineers_names:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail=f"{target_plat_engineer_name} doesn't exists"
        )
    eagle_data_coll.update_one(
        {"table_name": "plat_engineers"},
        {"$pull": {"all_plat_engineers_names": target_plat_engineer_name}}
    )
    plat_engineer_doc = eagle_data_coll.find_one({"table_name": "plat_engineers"})
    all_plat_engineers_names = plat_engineer_doc["all_plat_engineers_names"]
    return {"deleted. now": all_plat_engineers_names}


# :: counties ::
@router.get('/counties', dependencies=[Depends(get_current_user_data)])
def get_all_counties():
    counties_doc = eagle_data_coll.find_one({"table_name": "counties"})
    return counties_doc["all_counties_names"]


# add a new county
@router.post("/counties", dependencies=[Depends(HasRequiredRoles(required_roles=[101]))])
def add_new_county(new_county: County):
    county_doc = eagle_data_coll.find_one({"table_name": "counties"})
    all_counties_names = county_doc["all_counties_names"]

    new_county_name = new_county.county_name
    if new_county_name in all_counties_names:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail=f"{new_county_name} already exists"
        )

    # Update the document by pushing the new counties name into the array
    eagle_data_coll.update_one(
        {"table_name": "counties"},
        {"$push": {"all_counties_names": new_county_name}}
    )
    county_doc = eagle_data_coll.find_one({"table_name": "counties"})
    all_counties_names = county_doc["all_counties_names"]
    return {"added": all_counties_names}


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
