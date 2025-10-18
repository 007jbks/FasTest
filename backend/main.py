from fastapi import FastAPI
from routers import auth
from db import get_db, engine, Base
from sqlalchemy.orm import Session

Base.metadata.drop_all(bind=engine)

Base.metadata.create_all(bind=engine)
app = FastAPI()

app.include_router(auth.router)


@app.get("/")
async def hello():
    return {"message": "Hello world!"}
