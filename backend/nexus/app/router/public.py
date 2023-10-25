from fastapi import APIRouter

"""
All public end points - visible to out of eagle
"""

router = APIRouter(prefix="/public")


@router.get('/test')
def test_public():
    return {"Public testing route works"}
