from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="DenialDefender API", version="0.1.0")

class DenialRequest(BaseModel):
    denial_text: str

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.post("/api/generate")
async def generate_appeal(request: DenialRequest):
    # Skeleton route
    return {
        "status": "success",
        "appeal": "This is a placeholder generated appeal. Qwen2.5-72B integration coming in Day 2."
    }
