from fastapi import FastAPI, Request
from app.services.predict_income import predict_income

app = FastAPI()

@app.post("/api/predict_income")
async def handle_predict(request: Request):
    data = await request.json()
    prediction = predict_income(data)
    return {"prediction": prediction}
