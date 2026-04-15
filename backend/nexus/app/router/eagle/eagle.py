
from fastapi import APIRouter, Depends, HTTPException
from starlette import status

from app.database.database import eagle_data_coll
from app.database.schemas.eagle_data import Community, UpdateCommunity, Engineer, UpdateEngineer, PlatEngineer, \
    UpdatePlatEngineer, County, UpdateCounty, CommunityCode, UpdateCommunityCode, RenameCommunityCode
from app.security.oauth2 import get_current_user_data, HasRequiredRoles

"""
API endpoint related to eagle data
"""

router = APIRouter(prefix="/eagle")


# :: /departments
@router.get(path='/departments', dependencies=[Depends(get_current_user_data)])
def get_all_departments():
    departments_doc = eagle_data_coll.find_one({"table_name": "departments"})
    if departments_doc is None: return []
    all_departments = departments_doc["departments_names"]
    return all_departments if all_departments is not None else None


# :: /communities
# get all community names
@router.get('/communities', dependencies=[Depends(get_current_user_data)])
def get_all_communities():
    communities_doc = eagle_data_coll.find_one({"table_name": "communities"})
    if communities_doc is None: return []
    return communities_doc["all_communities_names"]


# add a new community
@router.post("/communities", dependencies=[Depends(HasRequiredRoles(required_roles=[101]))])
def add_new_community(new_community: Community):
    communities_doc = eagle_data_coll.find_one({"table_name": "communities"})
    if communities_doc is None: return []
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
    if communities_doc is None: return []
    all_communities_names = communities_doc["all_communities_names"]
    return {"added": all_communities_names}


# update a community
@router.patch("/communities", dependencies=[Depends(HasRequiredRoles(required_roles=[101]))])
def update_community(target_community: UpdateCommunity):
    communities_doc = eagle_data_coll.find_one({"table_name": "communities"})
    if communities_doc is None: return []
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
    if communities_doc is None: return []
    all_communities_names = communities_doc["all_communities_names"]
    return {"Updated. now": all_communities_names}


# delete a community
@router.delete("/communities", dependencies=[Depends(HasRequiredRoles(required_roles=[101]))])
def delete_community(target_community: Community):
    communities_doc = eagle_data_coll.find_one({"table_name": "communities"})
    if communities_doc is None: return []
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
    if communities_doc is None: return []
    all_communities_names = communities_doc["all_communities_names"]
    return {"deleted. now": all_communities_names}


# :: engineers ::
# get all engineers
@router.get('/engineers', dependencies=[Depends(get_current_user_data)])
def get_all_engineers():
    engineers_doc = eagle_data_coll.find_one({"table_name": "engineers"})
    if not engineers_doc: return []
    return engineers_doc["all_engineers_names"]


# add a new engineer
@router.post("/engineers", dependencies=[Depends(HasRequiredRoles(required_roles=[101]))])
def add_new_engineer(new_engineer: Engineer):
    engineers_doc = eagle_data_coll.find_one({"table_name": "engineers"})
    if not engineers_doc: return []
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
    if not engineers_doc: return []
    all_engineers_names = engineers_doc["all_engineers_names"]
    return {"added": all_engineers_names}


# update a engineer
@router.patch("/engineers", dependencies=[Depends(HasRequiredRoles(required_roles=[101]))])
def update_engineer(target_engineer: UpdateEngineer):
    engineers_doc = eagle_data_coll.find_one({"table_name": "engineers"})
    if not engineers_doc: return []
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
    if not engineers_doc: return []
    all_engineers_names = engineers_doc["all_engineers_names"]
    return {"Updated. now": all_engineers_names}


# delete a engineer
@router.delete("/engineers", dependencies=[Depends(HasRequiredRoles(required_roles=[101]))])
def delete_engineer(target_engineer: Engineer):
    engineers_doc = eagle_data_coll.find_one({"table_name": "engineers"})
    if not engineers_doc: return []
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
    if not engineers_doc: return []
    all_engineers_names = engineers_doc["all_engineers_names"]
    return {"deleted. now": all_engineers_names}


# :: plat-engineer ::
# get all plat - engineers
@router.get('/plat-engineers', dependencies=[Depends(get_current_user_data)])
def get_all_plat_engineers():
    plat_engineers_doc = eagle_data_coll.find_one({"table_name": "plat_engineers"})
    if not plat_engineers_doc: return []
    return plat_engineers_doc["all_plat_engineers_names"]


# add a new plat-engineer
@router.post("/plat-engineers", dependencies=[Depends(HasRequiredRoles(required_roles=[101]))])
def add_new_plat_engineer(new_plat_engineer: PlatEngineer):
    plat_engineer_doc = eagle_data_coll.find_one({"table_name": "plat_engineers"})
    if not plat_engineer_doc: return []
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
    if not plat_engineer_doc: return []
    all_plat_engineers_names = plat_engineer_doc["all_plat_engineers_names"]
    return {"added": all_plat_engineers_names}


# update a plat-engineer
@router.patch("/plat-engineers", dependencies=[Depends(HasRequiredRoles(required_roles=[101]))])
def update_plat_engineer(target_plat_engineer: UpdatePlatEngineer):
    plat_engineer_doc = eagle_data_coll.find_one({"table_name": "plat_engineers"})
    if not plat_engineer_doc: return []
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
    if not plat_engineer_doc: return []
    all_plat_engineers_names = plat_engineer_doc["all_plat_engineers_names"]
    return {"Updated. now": all_plat_engineers_names}


# delete a plat-engineer
@router.delete("/plat-engineers", dependencies=[Depends(HasRequiredRoles(required_roles=[101]))])
def delete_plat_engineer(target_plat_engineer: PlatEngineer):
    plat_engineer_doc = eagle_data_coll.find_one({"table_name": "plat_engineers"})
    if not plat_engineer_doc: return []
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
    if not plat_engineer_doc: return []
    all_plat_engineers_names = plat_engineer_doc["all_plat_engineers_names"]
    return {"deleted. now": all_plat_engineers_names}


# :: counties ::
@router.get('/counties', dependencies=[Depends(get_current_user_data)])
def get_all_counties():
    counties_doc = eagle_data_coll.find_one({"table_name": "counties"})
    if not counties_doc: return []
    return counties_doc["all_counties_names"]


# add a new county
@router.post("/counties", dependencies=[Depends(HasRequiredRoles(required_roles=[101]))])
def add_new_county(new_county: County):
    county_doc = eagle_data_coll.find_one({"table_name": "counties"})
    if not county_doc: return []
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
    if not county_doc: return []
    all_counties_names = county_doc["all_counties_names"]
    return {"added": all_counties_names}


# update a county
@router.patch("/counties", dependencies=[Depends(HasRequiredRoles(required_roles=[101]))])
def update_county(target_county: UpdateCounty):
    counties_doc = eagle_data_coll.find_one({"table_name": "counties"})
    if not counties_doc: return []
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
    if not counties_doc: return []
    all_counties_names = counties_doc["all_counties_names"]
    return {"Updated. now": all_counties_names}


# delete a county
@router.delete("/counties", dependencies=[Depends(HasRequiredRoles(required_roles=[101]))])
def delete_county(target_county: County):
    counties_doc = eagle_data_coll.find_one({"table_name": "counties"})
    if not counties_doc: return []
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
    if not counties_doc: return []
    all_counties_names = counties_doc["all_counties_names"]
    return {"deleted. now": all_counties_names}


# :: community-codes ::
# Stored inside the communities document: {"table_name": "communities", "community_codes": [["name", "code"], ...]}
# Helper to normalize the raw array-of-arrays into [{community_name, community_code}] dicts

def _raw_codes_to_list(raw: list) -> list[dict]:
    result = []
    for entry in raw:
        if isinstance(entry, list) and len(entry) == 2:
            result.append({"community_name": entry[0], "community_code": entry[1]})
        elif isinstance(entry, dict):
            result.append(entry)
    return result


def _get_communities_doc():
    doc = eagle_data_coll.find_one({"table_name": "communities"})
    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="communities document not found")
    return doc


@router.get("/community-codes", dependencies=[Depends(get_current_user_data)])
def get_all_community_codes():
    doc = _get_communities_doc()
    raw = doc.get("community_codes", [])
    return _raw_codes_to_list(raw)


@router.post("/community-codes", dependencies=[Depends(HasRequiredRoles(required_roles=[101]))])
def add_community_code(new_entry: CommunityCode):
    doc = _get_communities_doc()
    raw = doc.get("community_codes", [])
    codes = _raw_codes_to_list(raw)
    existing_names = [c["community_name"] for c in codes]

    if new_entry.community_name in existing_names:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Code for '{new_entry.community_name}' already exists"
        )

    eagle_data_coll.update_one(
        {"table_name": "communities"},
        {"$push": {"community_codes": [new_entry.community_name, new_entry.community_code]}}
    )
    doc = _get_communities_doc()
    return _raw_codes_to_list(doc.get("community_codes", []))


@router.patch("/community-codes", dependencies=[Depends(HasRequiredRoles(required_roles=[101]))])
def update_community_code(update: UpdateCommunityCode):
    doc = _get_communities_doc()
    raw = doc.get("community_codes", [])
    codes = _raw_codes_to_list(raw)
    names = [c["community_name"] for c in codes]

    if update.target_community_name not in names:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"'{update.target_community_name}' not found in community codes"
        )

    idx = names.index(update.target_community_name)
    eagle_data_coll.update_one(
        {"table_name": "communities"},
        {"$set": {f"community_codes.{idx}.1": update.new_community_code}}
    )
    doc = _get_communities_doc()
    return _raw_codes_to_list(doc.get("community_codes", []))


@router.patch("/community-codes/rename", dependencies=[Depends(HasRequiredRoles(required_roles=[101]))])
def rename_community_code(rename: RenameCommunityCode):
    doc = _get_communities_doc()
    raw = doc.get("community_codes", [])
    codes = _raw_codes_to_list(raw)
    names = [c["community_name"] for c in codes]

    if rename.target_community_name not in names:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"'{rename.target_community_name}' not found in community codes"
        )

    idx = names.index(rename.target_community_name)
    eagle_data_coll.update_one(
        {"table_name": "communities"},
        {"$set": {
            f"community_codes.{idx}.0": rename.new_community_name,
            f"community_codes.{idx}.1": rename.new_community_code,
        }}
    )
    doc = _get_communities_doc()
    return _raw_codes_to_list(doc.get("community_codes", []))


@router.delete("/community-codes", dependencies=[Depends(HasRequiredRoles(required_roles=[101]))])
def delete_community_code(target: CommunityCode):
    doc = _get_communities_doc()
    raw = doc.get("community_codes", [])
    codes = _raw_codes_to_list(raw)
    names = [c["community_name"] for c in codes]

    if target.community_name not in names:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"'{target.community_name}' not found in community codes"
        )

    # $pull on arrays-of-arrays requires matching the exact element
    idx = names.index(target.community_name)
    original_entry = raw[idx]
    eagle_data_coll.update_one(
        {"table_name": "communities"},
        {"$pull": {"community_codes": original_entry}}
    )
    doc = _get_communities_doc()
    return _raw_codes_to_list(doc.get("community_codes", []))
