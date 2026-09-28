from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Enable cross-origin requests so Vercel frontend can call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "Sarkar Seva Cloud Backend Active"}

@app.get("/api/scheme/eligibility")
def check_eligibility():
    return {
        "status": "Eligible",
        "scheme": "Housing Scheme",
        "verified_data": {"identity": "Verified", "income": "Below Threshold"}
    }