from db import get_db
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from models import User
from sqlalchemy.orm import Session
import jwt
from dotenv import load_dotenv
import os
import bcrypt

load_dotenv()

secret = os.environ["jwt_secret"]

router = APIRouter(prefix="/auth", tags=["auth"])


class Signup(BaseModel):
    username: str
    email: str
    password: str


class Login(BaseModel):
    email: str
    password: str


@router.post("/signup")
def signup(user: Signup, db: Session = Depends(get_db)):
    prev = db.query(User).filter(User.email == user.email).first()
    if prev:
        raise HTTPException(
            status_code=400, detail="User with same email already exists"
        )
    hashed_pw = bcrypt.hashpw(user.password.encode("utf-8"), bcrypt.gensalt())
    new_user = User(
        username=user.username, email=user.email, password=hashed_pw.decode("utf-8")
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token: str | None = jwt.encode({"id": new_user.id}, secret, algorithm="HS256")
    return {"token": token}


@router.post("/login")
def login(user: Login, db: Session = Depends(get_db)):
    check_user = db.query(User).filter(User.email == user.email).first()
    if not check_user:
        raise HTTPException(status_code=404, detail="User not found")
    result = bcrypt.checkpw(
        user.password.encode("utf-8"), check_user.password.encode("utf-8")
    )
    if not result:
        raise HTTPException(status_code=400, detail="Incorrect Password")
    token = jwt.encode({"id": check_user.id}, secret, algorithm="HS256")
    return {"token": token}
