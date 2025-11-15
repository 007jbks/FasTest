from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


from db import Base, engine, get_db
from routers import api_creation, auth, dashboard, history
from sqlalchemy.orm import Session

Base.metadata.create_all(bind=engine)


app.include_router(auth.router)
app.include_router(api_creation.router)
app.include_router(history.router)
app.include_router(dashboard.router)
