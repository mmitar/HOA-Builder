import os

from fastapi import FastAPI
from database import initialize_database, seed_data
from routers.community import router as community_router
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

env = os.environ.get("Environment", "DEV").upper()  # Default to DEV if not set
seed = True if env == "DEV" else False  # Seed data only in DEV environment

async def startup_event() -> None:
    initialize_database(seed=seed)
    
app = FastAPI(on_startup=[startup_event])

# Add CORS middleware first, before routes
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(community_router)

if __name__ == "__main__":
    # Allows us to just run `python main.py` to start the server instead of using `uvicorn main:app --reload`
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)