import json
import os
from datetime import datetime, timedelta
from sys import prefix

import jwt
from db import get_db
from fastapi import APIRouter, Depends, Header, HTTPException
from models import Route, Test, Url, User
from pydantic import BaseModel
from sqlalchemy.orm import Session
from tomllib import load

from .model import api_tests

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/")
def get_dashboard_stats(
    token: str = Header(...),
    db: Session = Depends(get_db),
):
    # ---- AUTH ----
    try:
        user_id = jwt.decode(token, os.environ["jwt_secret"], algorithms=["HS256"])[
            "id"
        ]
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    # ---- USER ----
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    project_ids = [p.project_id for p in user.projects]

    # ---- TOTAL TESTS ----
    total_tests = db.query(Test).filter(Test.project_id.in_(project_ids)).count()

    # ---- TOTAL PROJECTS (not URLs) ----
    total_projects = len(project_ids)

    # ---- TOTAL ROUTES ----
    total_routes = db.query(Route).filter(Route.project_id.in_(project_ids)).count()

    # ---- WEEKLY TESTS ----
    one_week_ago = datetime.utcnow() - timedelta(days=7)
    weekly_tests = (
        db.query(Test)
        .filter(Test.project_id.in_(project_ids), Test.created_at >= one_week_ago)
        .all()
    )

    daily_counts = {
        (one_week_ago + timedelta(days=i)).strftime("%Y-%m-%d"): 0 for i in range(8)
    }

    for test in weekly_tests:
        day = test.created_at.strftime("%Y-%m-%d")
        if day in daily_counts:
            daily_counts[day] += 1

    return {
        "total_tests": total_tests,
        "total_projects": total_projects,
        "total_routes": total_routes,
        "weekly_tests": daily_counts,
    }
