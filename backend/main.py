from fastapi import FastAPI
from contextlib import asynccontextmanager
from routers import auth
from mongo import connect_to_mongo, close_mongo_connection, get_database

@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_to_mongo()
    yield
    await close_mongo_connection()

db = None
app = FastAPI(lifespan=lifespan)
try:
    db = get_database()
    print("DB connected")
except Exception as e:
    print(f"Error while connecting to db ,  {e}")

app.include_router(auth.router)

@app.get("/")
def hello():
    return {"message": "hello world"}
