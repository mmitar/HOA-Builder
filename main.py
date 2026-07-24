from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def root():
    return {"message": "Hello, World!"}

communities = []

@app.get("/communities")
def get_communities():
    return communities

@app.post("/communities")
def create_community(community: str):
    communities.append(community)
    # Here you would typically add logic to save the community to a database
    return communities