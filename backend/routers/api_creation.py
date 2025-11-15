import json
import os
from typing import Any, Dict, List

import httpx
import jwt
from db import get_db
from dotenv import load_dotenv
from fastapi import APIRouter, Depends, Header, HTTPException
from fastapi.responses import JSONResponse
from models import Project, Route, Test, Url, User
from pydantic import BaseModel
from sqlalchemy.orm import Session
from tomllib import load

from .model import api_tests

load_dotenv()

router = APIRouter(prefix="/api", tags=["api"])


class GenerateTestsRequest(BaseModel):
    prompt: str


class SaveTestsRequest(BaseModel):
    tests: List[Dict[str, Any]]
    project_id: int


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

    project = (
        db.query(Project)
        .filter(Project.project_id == request.project_id, Project.user_id == user_id)
        .first()
    )
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

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
            project_id=project.project_id,
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


class CreateProjectRequest(BaseModel):
    projectName: str
    businessLogic: str
    projectUrl: str


@router.post("/projects")
def create_project(
    request: CreateProjectRequest,
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

    new_project = Project(
        projectName=request.projectName,
        businessLogic=request.businessLogic,
        projectUrl=request.projectUrl,
        user_id=user_id,
    )
    db.add(new_project)
    db.commit()
    db.refresh(new_project)

    return new_project


@router.get("/projects/{project_id}")
def get_project(
    project_id: int,
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

    project = (
        db.query(Project)
        .filter(Project.project_id == project_id, Project.user_id == user_id)
        .first()
    )
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    return project


class UpdateProjectRequest(BaseModel):
    projectName: str
    businessLogic: str
    projectUrl: str


@router.put("/projects/{project_id}")
def update_project(
    project_id: int,
    request: UpdateProjectRequest,
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

    project = (
        db.query(Project)
        .filter(Project.project_id == project_id, Project.user_id == user_id)
        .first()
    )
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    project.projectName = request.projectName
    project.businessLogic = request.businessLogic
    project.projectUrl = request.projectUrl
    db.commit()
    db.refresh(project)

    return project


@router.delete("/projects/{project_id}")
def delete_project(
    project_id: int,
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

    project = (
        db.query(Project)
        .filter(Project.project_id == project_id, Project.user_id == user_id)
        .first()
    )
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    tests_to_delete = (
        db.query(Test)
        .filter(Test.project_id == project_id, Test.user_id == user_id)
        .all()
    )
    for test in tests_to_delete:
        db.delete(test)

    db.delete(project)
    db.commit()

    return {"message": "Project deleted successfully"}


class TestConnectionRequest(BaseModel):
    url: str


@router.post("/test-connection")
async def test_connection(request: TestConnectionRequest):
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(request.url, timeout=5)
            response.raise_for_status()  # Raise HTTPError for bad responses (4xx or 5xx)
            return JSONResponse({"message": "Connection successful"})
    except httpx.HTTPError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {e}")
