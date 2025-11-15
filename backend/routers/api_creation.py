import json
import os
from typing import Any, Dict, List

import httpx
import jwt
from db import get_db
from dotenv import load_dotenv
from fastapi import APIRouter, Depends, Header, HTTPException
from fastapi.responses import JSONResponse
from models import Project, Route, Test, TestResult, User
from pydantic import BaseModel
from sqlalchemy import func, literal_column
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


@router.post("/run-tests/{project_id}/{route_id}")
async def run_route_tests(
    project_id: int,
    route_id: int,
    token: str = Header(...),
    db: Session = Depends(get_db),
):
    # ---------------- AUTH -----------------
    try:
        user_id = jwt.decode(token, os.environ["jwt_secret"], algorithms=["HS256"])[
            "id"
        ]
    except:
        raise HTTPException(status_code=401, detail="Invalid token")

    # ---------------- VALIDATE PROJECT -----------------
    project = (
        db.query(Project)
        .filter(Project.project_id == project_id, Project.user_id == user_id)
        .first()
    )
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    # ---------------- VALIDATE ROUTE -----------------
    route = (
        db.query(Route)
        .filter(Route.route_id == route_id, Route.project_id == project_id)
        .first()
    )
    if not route:
        raise HTTPException(status_code=404, detail="Route not found")

    # ---------------- GET TESTS -----------------
    tests = (
        db.query(Test)
        .filter(Test.project_id == project_id, Test.route_id == route_id)
        .all()
    )

    results = []
    passed_count = 0
    pending_results = []

    async with httpx.AsyncClient() as client:
        for t in tests:
            # --------- FIX: SAFE JSON PARSE ---------
            raw = t.body
            if isinstance(raw, str):
                try:
                    body = json.loads(raw)
                except:
                    raise HTTPException(
                        status_code=500,
                        detail=f"Stored JSON for test {t.id} is invalid",
                    )
            elif isinstance(raw, dict):
                body = raw
            else:
                raise HTTPException(
                    status_code=500,
                    detail=f"Stored test body for test {t.id} is not valid JSON",
                )

            # --------- SAFE KEY ACCESS ----------
            expected = body.get("expected_status_code")
            req_method = body.get("request_method")
            req_headers = body.get("request_headers", {})
            req_body = body.get("request_body", {})

            if expected is None or req_method is None:
                raise HTTPException(
                    status_code=400,
                    detail=f"Test {t.id} missing 'expected_status_code' or 'request_method'",
                )

            url = f"{project.projectUrl.rstrip('/')}/{route.routename.lstrip('/')}"

            try:
                response = await client.request(
                    req_method,
                    url,
                    headers=req_headers,
                    json=req_body,
                    timeout=10,
                )
                actual = response.status_code
                actual_body = response.text
                passed = actual == expected

            except Exception as e:
                actual = None
                actual_body = str(e)
                passed = False

            # Store result safely
            pending_results.append(
                TestResult(
                    test_id=t.id,
                    passed=passed,
                    actual_status=actual,
                    actual_body=actual_body,
                )
            )

            if passed:
                passed_count += 1

            results.append(
                {
                    "test_id": t.id,
                    "passed": passed,
                    "expected_status": expected,
                    "actual_status": actual,
                }
            )

    # Single commit
    db.add_all(pending_results)
    db.commit()

    total = len(tests)
    percentage = (passed_count / total * 100) if total > 0 else 0

    return {
        "route_id": route_id,
        "total_tests": total,
        "passed": passed_count,
        "percentage": percentage,
        "results": results,
    }


@router.post("/run-test/{test_id}")
async def run_single_test(
    test_id: int,
    token: str = Header(...),
    db: Session = Depends(get_db),
):
    # ---------------- AUTH -----------------
    try:
        user_id = jwt.decode(token, os.environ["jwt_secret"], algorithms=["HS256"])[
            "id"
        ]
    except:
        raise HTTPException(status_code=401, detail="Invalid token")

    test = db.query(Test).filter(Test.id == test_id).first()
    if not test:
        raise HTTPException(status_code=404, detail="Test not found")

    project = db.query(Project).filter(Project.project_id == test.project_id).first()
    route = db.query(Route).filter(Route.route_id == test.route_id).first()

    # ---------------- SAFE JSON PARSE -----------------
    raw = test.body
    if isinstance(raw, str):
        try:
            body = json.loads(raw)
        except:
            raise HTTPException(status_code=500, detail="Stored JSON is invalid")
    elif isinstance(raw, dict):
        body = raw
    else:
        raise HTTPException(status_code=500, detail="Stored body is not valid JSON")

    expected = body.get("expected_status_code")
    req_method = body.get("request_method")
    req_headers = body.get("request_headers", {})
    req_body = body.get("request_body", {})

    if expected is None or req_method is None:
        raise HTTPException(
            status_code=400,
            detail="Missing expected_status_code or request_method",
        )

    url = f"{project.projectUrl.rstrip('/')}/{route.routename.lstrip('/')}"

    # ---------------- RUN REQUEST -----------------
    async with httpx.AsyncClient() as client:
        try:
            response = await client.request(
                req_method,
                url,
                headers=req_headers,
                json=req_body,
                timeout=10,
            )
            actual = response.status_code
            actual_body = response.text
            passed = actual == expected
        except Exception as e:
            actual = None
            actual_body = str(e)
            passed = False

    # ---------------- STORE RESULT -----------------
    db.add(
        TestResult(
            test_id=test.id,
            passed=passed,
            actual_status=actual,
            actual_body=actual_body,
        )
    )
    db.commit()

    # ---------------- RECALC PASS RATE -----------------
    total = db.query(Test).filter(Test.route_id == route.route_id).count()

    passed_tests = (
        db.query(TestResult)
        .join(Test, Test.id == TestResult.test_id)
        .filter(Test.route_id == route.route_id, TestResult.passed == True)
        .count()
    )

    percentage = (passed_tests / total * 100) if total > 0 else 0

    return {
        "test_id": test_id,
        "passed": passed,
        "expected_status": expected,
        "actual_status": actual,
        "actual_body": actual_body,
        "percentage_after_run": percentage,
    }


@router.get("/project-test-stats/{project_id}")
def project_stats(
    project_id: int, token: str = Header(...), db: Session = Depends(get_db)
):
    # AUTH
    try:
        user_id = jwt.decode(token, os.environ["jwt_secret"], algorithms=["HS256"])[
            "id"
        ]
    except:
        raise HTTPException(status_code=401, detail="Invalid token")

    # Ensure project exists and belongs to user
    project = (
        db.query(Project)
        .filter(Project.project_id == project_id, Project.user_id == user_id)
        .first()
    )
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    # Total tests
    total_tests = db.query(Test).filter(Test.project_id == project_id).count()

    if total_tests == 0:
        return {
            "project_id": project_id,
            "total_tests": 0,
            "passed_tests": 0,
            "percentage": 0,
        }

    # Subquery → Latest run per test
    latest = (
        db.query(TestResult.test_id, func.max(TestResult.created_at).label("latest"))
        .join(Test, Test.id == TestResult.test_id)
        .filter(Test.project_id == project_id)
        .group_by(TestResult.test_id)
        .subquery()
    )

    # Join latest results back to TestResult
    latest_results = (
        db.query(TestResult)
        .join(
            latest,
            (latest.c.test_id == TestResult.test_id)
            & (latest.c.latest == TestResult.created_at),
        )
        .all()
    )

    # Count passes (only latest)
    passed_tests = sum(1 for r in latest_results if r.passed)

    percentage = round(passed_tests / total_tests * 100, 2)

    return {
        "project_id": project_id,
        "total_tests": total_tests,
        "passed_tests": passed_tests,
        "percentage": percentage,
    }


@router.get("/routes-passed-stats/{project_id}")
def project_routes_stats(
    project_id: int, token: str = Header(...), db: Session = Depends(get_db)
):
    # AUTH
    try:
        user_id = jwt.decode(token, os.environ["jwt_secret"], algorithms=["HS256"])[
            "id"
        ]
    except:
        raise HTTPException(status_code=401, detail="Invalid token")

    # verify project
    project = (
        db.query(Project)
        .filter(Project.project_id == project_id, Project.user_id == user_id)
        .first()
    )
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    # fetch tests for project
    tests = db.query(Test).filter(Test.project_id == project_id).all()

    # get *latest result* per test
    latest_results = (
        db.query(TestResult)
        .join(
            db.query(
                TestResult.test_id, func.max(TestResult.created_at).label("latest")
            )
            .group_by(TestResult.test_id)
            .subquery(),
            (TestResult.test_id == literal_column("anon_1.test_id"))
            & (TestResult.created_at == literal_column("anon_1.latest")),
        )
        .all()
    )

    # map test_id → passed
    result_map = {r.test_id: r.passed for r in latest_results}

    # group tests by route
    route_stats = {}
    for t in tests:
        if t.route_id not in route_stats:
            route_stats[t.route_id] = {
                "total": 0,
                "passed": 0,
            }

        route_stats[t.route_id]["total"] += 1
        if result_map.get(t.id) is True:
            route_stats[t.route_id]["passed"] += 1

    # build response
    output = []
    for route_id, stats_row in route_stats.items():
        route = db.query(Route).filter(Route.route_id == route_id).first()
        total = stats_row["total"]
        passed = stats_row["passed"]
        percent = round((passed / total * 100), 2) if total else 0

        output.append(
            {
                "route_id": route_id,
                "routename": route.routename,
                "total_tests": total,
                "passed_tests": passed,
                "percentage": percent,
            }
        )

    return {"project_id": project_id, "routes": output}


@router.get("/test-status/{test_id}")
def test_status(test_id: int, token: str = Header(...), db: Session = Depends(get_db)):
    # AUTH
    try:
        user_id = jwt.decode(token, os.environ["jwt_secret"], algorithms=["HS256"])[
            "id"
        ]
    except:
        raise HTTPException(status_code=401, detail="Invalid token")

    test = db.query(Test).filter(Test.id == test_id).first()
    if not test:
        raise HTTPException(status_code=404, detail="Test not found")

    # Get latest result
    result = (
        db.query(TestResult)
        .filter(TestResult.test_id == test_id)
        .order_by(TestResult.created_at.desc())
        .first()
    )

    if not result:
        return {"test_id": test_id, "has_run": False}

    return {
        "test_id": test_id,
        "passed": result.passed,
        "actual_status": result.actual_status,
        "actual_body": result.actual_body,
        "created_at": result.created_at,
    }
