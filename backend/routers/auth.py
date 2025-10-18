from db import get_db
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from models import User
from sqlalchemy.orm import Session
import jwt
from dotenv import load_dotenv
import os

load_dotenv()

secret = os.environ["jwt_secret"]

router = APIRouter(prefix="/auth", tags=["auth"])


class Signup(BaseModel):
    username: str
    email: str
    password: str


@router.get("/working")
def test():
    return {"message": "working"}


@router.post("/signup")
def signup(user: Signup, db: Session = Depends(get_db)):
    prev = db.query(User).filter(User.email == user.email).first()
    if prev:
        raise HTTPException(
            status_code=400, detail="User with same email already exists"
        )
    new_user = User(username=user.username, email=user.email, password=user.password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token: str | None = jwt.encode({"id": new_user.id}, secret, algorithm="HS256")
    return {"token": token}
