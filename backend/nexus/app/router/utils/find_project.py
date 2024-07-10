from fastapi import APIRouter, HTTPException, status
from app.database.database import projects_coll


def find_project(project_uid: str):
    target_project = None
    for doc in list(projects_coll.find()):
        project = {k: v for (k, v) in doc.items() if k != "_id"}
        if project["project_info"]["project_uid"] == project_uid:
            target_project = project
            continue

    if not target_project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=f"{project_uid} not found"
        )

    return target_project
