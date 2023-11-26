some old code of epc api, delete later if not needed
```python
@router.get('/live', response_model=List[dict], dependencies=[Depends(get_current_user_data)])
def get_all_lots():
    try:
        result = []
        for doc in projects_coll.find().sort("created_at", -1):
            project = {k: v for (k, v) in doc.items() if k != "_id"}
            if "project_uid" in project["project_info"]:
                final_object = {
                    "project_uid": doc["project_info"]["project_uid"],
                    "community": doc["project_info"]["community"],
                    "section_number": doc["project_info"]["section"],
                    "lot_number": doc["project_info"]["lot_number"]
                }
                if "teclab_data" in project and "epc_data" in project["teclab_data"]:
                    final_object.update(project["teclab_data"]["epc_data"])
                    result.append(final_object)
                else:
                    print("doc without epc_data", project)

            else:
                print(doc["_id"])
                print("doc without project_info or project_uid", project)
        return result
    except Exception as e:
        print("error: ", e)
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")

```