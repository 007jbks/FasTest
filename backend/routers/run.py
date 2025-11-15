import json
import os

import httpx
import jwt
from db import get_db
from fastapi import APIRouter, Depends, Header, HTTPException
from models import Project, Route, Test, User
from sqlalchemy.orm import Session

router = APIRouter(prefix="/api", tags=["api"])


@router.post("/run-tests/{project_id}/{route_id}")
async def run_tests(
    project_id: int,
    route_id: int,
    token: str = Header(...),
    db: Session = Depends(get_db),
):
    # --- AUTH ---
    try:
        user_id = jwt.decode(token, os.environ["jwt_secret"], algorithms=["HS256"])[
            "id"
        ]
    except:
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

    route = (
        db.query(Route)
        .filter(Route.route_id == route_id, Route.project_id == project_id)
        .first()
    )

    if not route:
        raise HTTPException(status_code=404, detail="Route not found")

    tests = (
        db.query(Test)
        .filter(Test.project_id == project_id, Test.route_id == route_id)
        .all()
    )

    results = []

    # --- RUNNING TESTS ---
    async with httpx.AsyncClient() as client:
        for t in tests:
            test_body = json.loads(t.body)

            req_method = test_body["request_method"]
            req_headers = test_body.get("request_headers", {})
            req_body = test_body.get("request_body", {})
            expected_status = test_body["expected_status_code"]
            expected_body = test_body.get("expected_response_body", {})

            url = project.projectUrl + route.routename

            try:
                response = await client.request(
                    req_method, url, headers=req_headers, json=req_body, timeout=10
                )

                actual_status = response.status_code
                try:
                    actual_json = response.json()
                except:
                    actual_json = response.text

                passed = (
                    actual_status == expected_status and actual_json == expected_body
                )

                results.append(
                    {
                        "test_id": t.id,
                        "name": test_body.get("test_name", "Unnamed test"),
                        "passed": passed,
                        "expected_status": expected_status,
                        "actual_status": actual_status,
                        "expected_body": expected_body,
                        "actual_body": actual_json,
                    }
                )

            except Exception as e:
                results.append(
                    {
                        "test_id": t.id,
                        "name": test_body.get("test_name", "Unnamed test"),
                        "passed": False,
                        "error": str(e),
                    }
                )

    return {"results": results}


@router.post("/run-test/{test_id}")
async def run_single_test(
    test_id: int, token: str = Header(...), db: Session = Depends(get_db)
):
    # ---- AUTH ----
    try:
        user_id = jwt.decode(token, os.environ["jwt_secret"], algorithms=["HS256"])[
            "id"
        ]
    except:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # ---- LOAD TEST ----
    test = db.query(Test).filter(Test.id == test_id, Test.user_id == user_id).first()

    if not test:
        raise HTTPException(status_code=404, detail="Test not found")

    project = db.query(Project).filter(Project.project_id == test.project_id).first()
    route = db.query(Route).filter(Route.route_id == test.route_id).first()

    if not project or not route:
        raise HTTPException(status_code=404, detail="Related project/route missing")

    test_data = json.loads(test.body)

    req_method = test_data["request_method"]
    req_headers = test_data.get("request_headers", {})
    req_body = test_data.get("request_body", {})
    expected_status = test_data["expected_status_code"]
    expected_body = test_data.get("expected_response_body", {})

    url = project.projectUrl + route.routename

    # ---- RUN THE TEST ----
    async with httpx.AsyncClient() as client:
        try:
            response = await client.request(
                req_method, url, headers=req_headers, json=req_body, timeout=10
            )

            actual_status = response.status_code

            try:
                actual_json = response.json()
            except:
                actual_json = response.text

            passed = actual_status == expected_status and actual_json == expected_body

        except Exception as e:
            passed = False
            actual_status = None
            actual_json = str(e)

    # ---- SAVE RESULT ----
    result = TestResult(
        test_id=test.id,
        passed=passed,
        actual_status=actual_status,
        actual_body=json.dumps(actual_json),
    )
    db.add(result)
    db.commit()

    # ---- RETURN RESULT ----
    return {
        "test_id": test.id,
        "name": test_data.get("test_name", "Unnamed Test"),
        "passed": passed,
        "expected_status": expected_status,
        "actual_status": actual_status,
        "expected_body": expected_body,
        "actual_body": actual_json,
    }
