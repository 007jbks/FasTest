from sys import prefix
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
from datetime import datetime, timedelta


router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/")
def get_dashboard_stats(
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

    total_tests = db.query(Test).filter(Test.user_id == user_id).count()
    total_urls = (
        db.query(Url).join(Test).filter(Test.user_id == user_id).distinct().count()
    )
    total_routes = (
        db.query(Route).join(Test).filter(Test.user_id == user_id).distinct().count()
    )

    one_week_ago = datetime.utcnow() - timedelta(days=7)
    weekly_tests = (
        db.query(Test)
        .filter(Test.user_id == user_id, Test.created_at >= one_week_ago)
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
        "total_urls": total_urls,
        "total_routes": total_routes,
        "weekly_tests": daily_counts,
    }
