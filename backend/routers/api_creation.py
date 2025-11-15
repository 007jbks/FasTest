import json
import os
from typing import Any, Dict, List

import httpx
import jwt
from db import get_db
from dotenv import load_dotenv
from fastapi import APIRouter, Depends, Header, HTTPException
from fastapi.responses import JSONResponse
from models import Project, Route, Test, User
from pydantic import BaseModel
from sqlalchemy.orm import Session

from .model import api_tests

load_dotenv()

router = APIRouter(prefix="/api", tags=["api"])


class GenerateTestsRequest(BaseModel):
    prompt: str


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

    if not db.query(User).filter(User.id == user_id).first():
        raise HTTPException(status_code=404, detail="User not found")

    tests_str = api_tests(request.prompt)
    tests = json.loads(tests_str)

    return tests


# ----------------------------
# SAVE TESTS
# ----------------------------


class SaveTestsRequest(BaseModel):
    tests: List[Dict[str, Any]]
    project_id: int


@router.post("/save-tests")
def save_tests(
    request: SaveTestsRequest,
    token: str = Header(...),
    db: Session = Depends(get_db),
):
    # -------- Validate Token --------
    try:
        user_id = jwt.decode(token, os.environ["jwt_secret"], algorithms=["HS256"])[
            "id"
        ]
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    # -------- Validate User --------
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # -------- Validate Project --------
    project = (
        db.query(Project)
        .filter(Project.project_id == request.project_id, Project.user_id == user_id)
        .first()
    )
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    # -------- Create or find routes for all tests --------
    route_cache = {}

    for t in request.tests:
        route_name = t.get("route")
        method = t.get("method", "GET")
        body = t.get("body")

        if not body:
            raise HTTPException(status_code=400, detail="Test body missing")

        if not route_name:
            route_name = "default"

        # ------ Use cache so we don't re-query DB for each test ------
        if route_name not in route_cache:
            route = (
                db.query(Route)
                .filter(
                    Route.routename == route_name,
                    Route.project_id == project.project_id,
                )
                .first()
            )

            # If route does not exist → create it
            if not route:
                route = Route(
                    routename=route_name,
                    method=method,
                    project_id=project.project_id,
                )
                db.add(route)
                db.commit()
                db.refresh(route)

            route_cache[route_name] = route

        # -------- Create test --------
        route_obj = route_cache[route_name]
        new_test = Test(
            body=json.dumps(body),
            route_id=route_obj.route_id,
            project_id=project.project_id,
            user_id=user_id,
        )

        db.add(new_test)
        db.commit()

    return {"message": "Tests saved successfully"}


# ----------------------------
# UPDATE TEST
# ----------------------------


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

    db_test = db.query(Test).filter(Test.id == test_id, Test.user_id == user_id).first()

    if not db_test:
        raise HTTPException(status_code=404, detail="Test not found")

    db_test.body = json.dumps(request.test)
    db.commit()
    db.refresh(db_test)

    return {"message": "Test updated", "test": json.loads(db_test.body)}


# ----------------------------
# DELETE TEST
# ----------------------------


@router.delete("/tests/{test_id}")
def delete_test(
    test_id: int,
    token: str = Header(...),
    db: Session = Depends(get_db),
):
    try:
        user_id = jwt.decode(token, os.environ["jwt_secret"], algorithms=["HS256"])[
            "id"
        ]
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    db_test = db.query(Test).filter(Test.id == test_id, Test.user_id == user_id).first()

    if not db_test:
        raise HTTPException(status_code=404, detail="Test not found")

    db.delete(db_test)
    db.commit()

    return {"message": "Test deleted"}


# ----------------------------
# PROJECT CRUD
# ----------------------------


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

    for t in tests_to_delete:
        db.delete(t)

    db.delete(project)
    db.commit()

    return {"message": "Project deleted successfully"}


# ----------------------------
# TEST CONNECTION
# ----------------------------


class TestConnectionRequest(BaseModel):
    url: str


@router.post("/test-connection")
async def test_connection(request: TestConnectionRequest):
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(request.url, timeout=5)
            response.raise_for_status()
            return {"message": "Connection successful"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ----------------------------
# PROJECT STATS (FIXED)
# ----------------------------


@router.get("/projects-with-stats")
def get_all_projects_with_stats(
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

    projects = db.query(Project).filter(Project.user_id == user_id).all()

    result = []

    for p in projects:
        tests = db.query(Test).filter(Test.project_id == p.project_id).all()
        total_tests = len(tests)

        # FIX: No ".passed"
        passed_tests = 0
        pass_percentage = 0

        result.append(
            {
                "id": p.project_id,
                "name": p.projectName,
                "description": p.businessLogic,
                "totalTests": total_tests,
                "passPercentage": pass_percentage,
            }
        )

    return {"projects": result}


# ----------------------------
# GET ROUTES
# ----------------------------


@router.get("/projects/{project_id}/routes")
def get_routes_for_project(
    project_id: int, token: str = Header(...), db: Session = Depends(get_db)
):
    try:
        user_id = jwt.decode(token, os.environ["jwt_secret"], algorithms=["HS256"])[
            "id"
        ]
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    project = (
        db.query(Project)
        .filter(Project.project_id == project_id, Project.user_id == user_id)
        .first()
    )

    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    routes = db.query(Route).filter(Route.project_id == project_id).all()

    result = []
    for r in routes:
        tests = db.query(Test).filter(Test.route_id == r.route_id).all()
        total_tests = len(tests)

        # FIX: no passed count
        passed_tests = 0
        pass_percentage = 0

        result.append(
            {
                "id": r.route_id,
                "routename": r.routename,
                "method": "AUTO",
                "description": "Route description",
                "totalTests": total_tests,
                "passPercentage": pass_percentage,
            }
        )

    return {"routes": result}


# ----------------------------
# GET TESTS FOR ROUTE
# ----------------------------


@router.get("/routes/{route_id}/tests")
def get_tests_for_route(
    route_id: int,
    token: str = Header(...),
    db: Session = Depends(get_db),
):
    try:
        user_id = jwt.decode(token, os.environ["jwt_secret"], algorithms=["HS256"])[
            "id"
        ]
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    route = (
        db.query(Route)
        .join(Project)
        .filter(Route.route_id == route_id, Project.user_id == user_id)
        .first()
    )

    if not route:
        raise HTTPException(status_code=404, detail="Route not found")

    tests = db.query(Test).filter(Test.route_id == route_id).all()

    results = []
    for t in tests:
        results.append(
            {
                "id": t.id,
                "body": json.loads(t.body),
                "passed": False,  # FIX
            }
        )

    return {"tests": results}


class UpdateRouteRequest(BaseModel):
    routename: str
    method: str


@router.put("/routes/{route_id}")
def update_route(
    route_id: int,
    request: UpdateRouteRequest,
    token: str = Header(...),
    db: Session = Depends(get_db),
):
    # AUTH
    try:
        user_id = jwt.decode(token, os.environ["jwt_secret"], algorithms=["HS256"])[
            "id"
        ]
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    # Get route + ensure user owns project
    route = (
        db.query(Route)
        .join(Project, Route.project_id == Project.project_id)
        .filter(Route.route_id == route_id, Project.user_id == user_id)
        .first()
    )

    if not route:
        raise HTTPException(status_code=404, detail="Route not found")

    # Update fields
    route.routename = request.routename
    route.method = request.method

    db.commit()
    db.refresh(route)

    return {
        "message": "Route updated successfully",
        "route": {
            "id": route.route_id,
            "routename": route.routename,
            "method": route.method,
        },
    }


@router.delete("/routes/{route_id}")
def delete_route(
    route_id: int, token: str = Header(...), db: Session = Depends(get_db)
):
    # AUTH
    try:
        user_id = jwt.decode(token, os.environ["jwt_secret"], algorithms=["HS256"])[
            "id"
        ]
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    # Validate route
    route = (
        db.query(Route)
        .join(Project, Route.project_id == Project.project_id)
        .filter(Route.route_id == route_id, Project.user_id == user_id)
        .first()
    )

    if not route:
        raise HTTPException(status_code=404, detail="Route not found")

    # Delete all tests that belong to this route
    tests = db.query(Test).filter(Test.route_id == route_id).all()
    for t in tests:
        db.delete(t)

    # Delete the route
    db.delete(route)
    db.commit()

    return {"message": "Route deleted successfully"}
