from fastapi import FastAPI
from database import create_db_and_tables
from routers.community import router as community_router

app = FastAPI(on_startup=[create_db_and_tables])

app.include_router(community_router)

@app.get("/")
def root():
    return {"message": "Hello, World!"}