from fastapi import APIRouter


"""
Endpoint: /test
Purpose:
  - Testing
"""

router = APIRouter(prefix="/test")

@router.get("/", response_model=dict)
def test():
    return {"TEST" : "OK"}
