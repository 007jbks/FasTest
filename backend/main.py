from fastapi import FastAPI
from routers import auth
from mongo import connect
app = FastAPI()
connect()

app.include_router(auth.router)

@app.get("/")
def hello():
    return {"message": "hello world"}
