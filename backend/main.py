from fastapi.middleware.cors import CORSMiddleware
from routers import dashboard
from fastapi import FastAPI
from routers import auth, api_creation, history
from db import get_db, engine, Base
from sqlalchemy.orm import Session

# Base.metadata.drop_all(bind=engine)  # this is for testing i must remove this later

Base.metadata.create_all(bind=engine)
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(api_creation.router)
app.include_router(history.router)
app.include_router(dashboard.router)
