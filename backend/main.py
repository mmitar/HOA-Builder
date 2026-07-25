from fastapi import FastAPI
from database import create_db_and_tables
from routers.community import router as community_router
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI(on_startup=[create_db_and_tables])

app.include_router(community_router)

@app.get("/", status_code=200)
def root():
    return {"message": "Hello, World!"}

origins_whitelist = ["http://localhost"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins_whitelist,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if __name__ == "__main__":
    # Allows us to just run `python main.py` to start the server instead of using `uvicorn main:app --reload`
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)