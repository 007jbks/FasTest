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
from typing import List, Dict, Any

load_dotenv()

router = APIRouter(prefix="/api", tags=["api"])


class GenerateTestsRequest(BaseModel):
    prompt: str


class SaveTestsRequest(BaseModel):
    tests: List[Dict[str, Any]]


@router.post("/generate-tests")
def generate_tests_only(
    request: GenerateTestsRequest,
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
        raise HTTPException(status_code=404, detail="No such user found")
    tests_str = api_tests(request.prompt)
    tests = json.loads(tests_str)
    return tests


@router.post("/save-tests")
def save_tests(
    request: SaveTestsRequest, token: str = Header(...), db: Session = Depends(get_db)
):
    try:
        user_id = jwt.decode(token, os.environ["jwt_secret"], algorithms=["HS256"])[
            "id"
        ]
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="No such user found")

    for test in request.tests:
        url_name = test.get("base_url")
        if not url_name:
            raise HTTPException(status_code=400, detail="Test is missing base_url")

        url = db.query(Url).filter(Url.urlname == url_name).first()
        if not url:
            new_url = Url(urlname=url_name)
            db.add(new_url)
            db.commit()
            db.refresh(new_url)
            url = new_url

        route_name = test.get("route")
        if not route_name:
            raise HTTPException(status_code=400, detail="Test is missing route")

        route = db.query(Route).filter(Route.routename == route_name).first()
        if not route:
            new_route = Route(routename=route_name)
            db.add(new_route)
            db.commit()
            db.refresh(new_route)
            route = new_route

        new_test = Test(
            body=json.dumps(test),
            user_id=user_id,
            route_id=route.route_id,
            url_id=url.url_id,
        )
        db.add(new_test)
        db.commit()
        db.refresh(new_test)

    return {"message": "Tests saved successfully"}


class UpdateTestRequest(BaseModel):
    test: Dict[str, Any]


@router.put("/tests/{test_id}")
def update_test(
    test_id: int,
    request: UpdateTestRequest,
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
        raise HTTPException(status_code=404, detail="No such user found")

    db_test = db.query(Test).filter(Test.id == test_id, Test.user_id == user_id).first()
    if not db_test:
        raise HTTPException(status_code=404, detail="Test not found")

    db_test.body = json.dumps(request.test)
    db.commit()
    db.refresh(db_test)
    return {"message": "Test updated successfully", "test": json.loads(db_test.body)}


@router.delete("/tests/{test_id}")
def delete_test(test_id: int, token: str = Header(...), db: Session = Depends(get_db)):
    try:
        user_id = jwt.decode(token, os.environ["jwt_secret"], algorithms=["HS256"])[
            "id"
        ]
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="No such user found")

    db_test = db.query(Test).filter(Test.id == test_id, Test.user_id == user_id).first()
    if not db_test:
        raise HTTPException(status_code=404, detail="Test not found")

    db.delete(db_test)
    db.commit()
    return {"message": "Test deleted successfully"}


@router.delete("/urls/{url_id}")
def delete_url(url_id: int, token: str = Header(...), db: Session = Depends(get_db)):
    try:
        user_id = jwt.decode(token, os.environ["jwt_secret"], algorithms=["HS256"])[
            "id"
        ]
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    tests_to_delete = (
        db.query(Test).filter(Test.url_id == url_id, Test.user_id == user_id).all()
    )
    for test in tests_to_delete:
        db.delete(test)

    other_tests = db.query(Test).filter(Test.url_id == url_id).count()
    if other_tests == 0:
        url_to_delete = db.query(Url).filter(Url.url_id == url_id).first()
        if url_to_delete:
            db.delete(url_to_delete)

    db.commit()

    return {
        "message": f"URL and all associated tests for the current user have been deleted."
    }


@router.delete("/routes/{route_name}/urls/{url_id}")
def delete_route(
    route_name: str,
    url_id: int,
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

    route = db.query(Route).filter(Route.routename == route_name).first()
    if not route:
        raise HTTPException(status_code=404, detail="Route not found")

    tests_to_delete = (
        db.query(Test)
        .filter(
            Test.route_id == route.route_id,
            Test.url_id == url_id,
            Test.user_id == user_id,
        )
        .all()
    )

    for test in tests_to_delete:
        db.delete(test)

    other_tests = db.query(Test).filter(Test.route_id == route.route_id).count()
    if other_tests == 0:
        db.delete(route)

    db.commit()

    return {
        "message": f"Route and all associated tests for the current user have been deleted."
    }
