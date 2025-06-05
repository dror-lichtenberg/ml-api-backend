# general imports
from fastapi import FastAPI
from app.utils.logger import log
from app.utils.register import register_model, get_all_model_metadata
from fastapi.middleware.cors import CORSMiddleware

# models included
from app.routes import predict_income

log("info", "🔥 Starting ML API Backend...")

app = FastAPI(
    title="ML API Backend",
    description="Scalable FastAPI backend for multiple ML models",
    version="0.1.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Wide open for dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register models
log("info", "🔍 About to register predict_income model...")
register_model(app=app, model_name="predict_income", route_module=predict_income, endpoint="predict_income")
log("info", "✅ predict_income model registered!")

@app.get("/models")
def list_models():
    try:
        log("info", "Fetching all model metadata")
        return get_all_model_metadata()
    except Exception as e:
        log("exception", "🔥 /models failed", exc=e)
