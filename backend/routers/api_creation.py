from hashlib import algorithms_available
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

load_dotenv()

router = APIRouter(prefix="/api", tags=["api"])


@router.post("/create")
def get_tests(prompt: str, token: str = Header(...), db: Session = Depends(get_db)):
    user_id = jwt.decode(token, os.environ["jwt_secret"], algorithms=["HS256"])["id"]
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="No such user found")
    tests = api_tests(prompt)
    tests = json.loads(tests)
    for test in tests:
        url_name = test["base_url"]
        url = db.query(Url).filter(Url.urlname == url_name).first()
        if not url:
            new_url = Url(urlname=url_name)
            db.add(new_url)
            db.commit()
            db.refresh(new_url)
            url = new_url
        route_name = test["route"]
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

    return tests
