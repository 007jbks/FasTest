from tomllib import load
from .model import api_tests
from fastapi import APIRouter, Depends, HTTPException, Header
from models import User, Test, Url, Route
from sqlalchemy.orm import Session
from pydantic import BaseModel
from db import get_db
import json
import jwt
import os
from dotenv import load_dotenv
from typing import Dict, Any


load_dotenv()
router = APIRouter(prefix="/history", tags=["history"])


@router.get("/url")
def get_all_urls(
    token: str = Header(...),
    db: Session = Depends(get_db),
):
    try:
        user_id = jwt.decode(token, os.environ["jwt_secret"], algorithms=["HS256"])[
            "id"
        ]
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    urls = (
        db.query(Url)
        .join(Test, Test.url_id == Url.url_id)
        .filter(Test.user_id == user_id)
        .distinct()
        .all()
    )
    return urls


class UrlId(BaseModel):
    id: int


@router.post("/tests")
def get_tests_for_url(
    url_id: UrlId,
    token: str = Header(...),
    db: Session = Depends(get_db),
):
    try:
        user_id = jwt.decode(token, os.environ["jwt_secret"], algorithms=["HS256"])[
            "id"
        ]
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    tests = (
        db.query(Test).filter(Test.user_id == user_id, Test.url_id == url_id.id).all()
    )
    return tests


class EditTestRequest(BaseModel):
    body: Dict[str, Any]


@router.put("/test/{test_id}")
def edit_test(
    test_id: int,
    request: EditTestRequest,
    token: str = Header(...),
    db: Session = Depends(get_db),
):
    try:
        user_id = jwt.decode(token, os.environ["jwt_secret"], algorithms=["HS256"])[
            "id"
        ]
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    test = db.query(Test).filter(Test.id == test_id, Test.user_id == user_id).first()
    if not test:
        raise HTTPException(status_code=404, detail="Test not found")

    test.body = json.dumps(request.body)
    db.commit()
    db.refresh(test)

    return test
