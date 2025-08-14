"""
All public end points - visible to out of eagle
"""

from fastapi import APIRouter

from app.database.database import eagle_data_coll


public_router = APIRouter(prefix="/public")


@public_router.get('/test')
def test_public():
    return {"Public testing route works"}


@public_router.get(path='/departments')
def get_all_departments():
    departments_doc = eagle_data_coll.find_one({"table_name": "departments"})
    if not departments_doc: return
    all_departments = departments_doc["departments_names"]
    return all_departments

"""
# Filter out all finished and released lots
@router.get('/live', response_model=List[dict], dependencies=[Depends(get_current_user_data)])
def get_all_lots():
    print("hello world")
    try:
        result = []
        for doc in projects_coll.find().sort("project_info.meta_info.created_at", -1):
            project = {k: v for (k, v) in doc.items() if k != "_id"}
            if doc["teclab_data"]["fosc_data"]["lot_status_started"] and\
                    not doc["teclab_data"]["fosc_data"]["lot_status_finished"]:
                final_object = {
                    "project_uid": doc["project_info"]["project_uid"],
                    "community": doc["project_info"]["community"],
                    "section_number": doc["project_info"]["section"],
                    "lot_number": doc["project_info"]["lot_number"]
                }
                final_object.update(project["teclab_data"]["fosc_data"])
                result.append(final_object)
        return result
    except Exception as e:
        # print("error: ", e)
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")
# """
