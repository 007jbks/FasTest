import json
import os
from typing import Any, Dict

import jwt
from db import get_db
from dotenv import load_dotenv
from fastapi import APIRouter, Depends, Header, HTTPException
from models import Project, Route, Test, Url, User
from pydantic import BaseModel
from sqlalchemy.orm import Session
from tomllib import load

from .model import api_tests

load_dotenv()
router = APIRouter(prefix="/history", tags=["history"])


class ProjectId(BaseModel):
    id: int


@router.get("/url")
def get_all_urls(
    project_id: ProjectId,
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
        .filter(Test.user_id == user_id, Test.project_id == project_id.id)
        .distinct()
        .all()
    )
    return urls


class UrlId(BaseModel):
    id: int
    project_id: int


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
        db.query(Test)
        .filter(
            Test.user_id == user_id,
            Test.url_id == url_id.id,
            Test.project_id == url_id.project_id,
        )
        .all()
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
