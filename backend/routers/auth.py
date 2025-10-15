from fastapi import APIRouter


router = APIRouter(prefix="/auth",tags=["auth"])

@router.get("/working")
def test():
    return {"message":"working"}
