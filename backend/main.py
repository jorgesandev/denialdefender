from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI
from dotenv import load_dotenv
import os

# Load the .env file
load_dotenv()

app = FastAPI(title="DenialDefender API", version="0.1.0")

# Allow your Next.js frontend to talk to this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_methods=["*"],
    allow_headers=["*"],
)

# Connect to the Language Model on Port 8000
llm_client = OpenAI(
    base_url=os.getenv("VLLM_LLM_URL", "http://localhost:8000/v1"),
    api_key="dummy", # vLLM doesn't check this by default
)

# Connect to the Vision Model on Port 8001
vl_client = OpenAI(
    base_url=os.getenv("VLLM_VL_URL", "http://localhost:8001/v1"),
    api_key="dummy",
)

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.post("/api/generate")
async def generate_appeal(denial_pdf: UploadFile = File(...), chart_text: str = ""):
    # Right now, this just proves the API can receive a file.
    # In Block 3, we will add the ingest logic here.
    return {
        "status": "success",
        "filename_received": denial_pdf.filename,
        "appeal": "Pipeline scaffolding complete. Models are online. Retrieval coming next."
    }