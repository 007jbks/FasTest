from hashlib import algorithms_available
from tomllib import load
from .model import api_tests
from fastapi import APIRouter, Depends, HTTPException, Header
from models import User, Test
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
    tests = api_tests(prompt)
    tests = json.loads(tests)
    new_test = Test(body=json.dumps(tests), user_id=user_id)
    db.add(new_test)
    db.commit()
    db.refresh(new_test)
    return tests
