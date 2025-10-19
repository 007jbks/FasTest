from .model import api_tests
from fastapi import APIRouter, Depends, HTTPException
from models import User
import jwt
from sqlalchemy.orm import Session
from pydantic import BaseModel
from db import get_db
import json


router = APIRouter(prefix="/api", tags=["api"])


@router.post("/api")
def get_tests(prompt: str, db: Session = Depends(get_db)):
    tests = api_tests(prompt)
    tests = json.loads(tests)
    return tests
