import joblib
import numpy as np
from app.core.config import MODEL_PATH

model = joblib.load(MODEL_PATH + "best_income_model_v0.pkl")

def predict_income(data: dict):
    X = np.array([list(data.values())])
    prediction = model.predict(X)[0]  # returns either '<=50K' or '>50K'
    return prediction
