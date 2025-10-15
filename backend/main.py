from fastapi import FastAPI
from contextlib import asynccontextmanager
from routers import auth
from mongo import connect_to_mongo, close_mongo_connection

@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_to_mongo()
    yield
    await close_mongo_connection()

app = FastAPI(lifespan=lifespan)

app.include_router(auth.router)

@app.get("/")
def hello():
    return {"message": "hello world"}
