from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
import pandas as pd
import joblib
import os
from app.utils.logger import log

router = APIRouter()

# Load model
model_path = os.path.join(os.path.dirname(__file__), "..", "models", "best_income_model_v0.pkl")
try:
    log("info", "🧪 Loading model")
    model = joblib.load(model_path)
except Exception as e:
    raise RuntimeError(f"Model could not be loaded: {e}")

# Input schema using model's original column names (with hyphens)
class IncomeInput(BaseModel):
    age: int
    fnlwgt: int
    education_num: int = Field(alias="education-num")
    capital_gain: int = Field(alias="capital-gain")
    capital_loss: int = Field(alias="capital-loss")
    hours_per_week: int = Field(alias="hours-per-week")
    workclass: str
    education: str
    marital_status: str = Field(alias="marital-status")
    occupation: str
    relationship: str
    race: str
    sex: str
    native_country: str = Field(alias="native-country")

    class Config:
        allow_population_by_field_name = True

@router.post("/predict_income")
async def predict_income(input_data: IncomeInput):
    try:
        input_df = pd.DataFrame([input_data.dict(by_alias=True)])
        log("info", f"📥 Input DataFrame:\n{input_df.dtypes.to_string()}")
        
        prediction = model.predict(input_df)
        return {"prediction": prediction.tolist()}
    except Exception as e:
        log("exception", "❌ Failed to predict income", exc=e)
        raise HTTPException(status_code=500, detail=str(e))

MODEL_METADATA = {
    "name": "Income Prediction",
    "description": "Predicts whether income is >50K based on census data.",
    "input_schema": IncomeInput.schema(),
    "output_schema": {"prediction": "List[str]"},
    "example_input": {
        "age": 39,
        "workclass": "State-gov",
        "fnlwgt": 77516,
        "education": "Bachelors",
        "education-num": 13,
        "marital-status": "Never-married",
        "occupation": "Adm-clerical",
        "relationship": "Not-in-family",
        "race": "White",
        "sex": "Male",
        "capital-gain": 2174,
        "capital-loss": 0,
        "hours-per-week": 40,
        "native-country": "United-States"
    },
    "valid_values": {
        "workclass": ['Private', 'Self-emp-not-inc', 'Self-emp-inc', 'Federal-gov', 'Local-gov', 'State-gov', 'Without-pay', 'Never-worked'],
        "education": ['Bachelors', 'Some-college', '11th', 'HS-grad', 'Prof-school', 'Assoc-acdm', 'Assoc-voc', '9th', '7th-8th', '12th', 'Masters', '1st-4th', '10th', 'Doctorate', '5th-6th', 'Preschool'],
        "marital-status": ['Married-civ-spouse', 'Divorced', 'Never-married', 'Separated', 'Widowed', 'Married-spouse-absent', 'Married-AF-spouse'],
        "occupation": ['Tech-support', 'Craft-repair', 'Other-service', 'Sales', 'Exec-managerial', 'Prof-specialty', 'Handlers-cleaners', 'Machine-op-inspct', 'Adm-clerical', 'Farming-fishing', 'Transport-moving', 'Priv-house-serv', 'Protective-serv', 'Armed-Forces'],
        "relationship": ['Wife', 'Own-child', 'Husband', 'Not-in-family', 'Other-relative', 'Unmarried'],
        "race": ['White', 'Asian-Pac-Islander', 'Amer-Indian-Eskimo', 'Other', 'Black'],
        "sex": ['Male', 'Female'],
        "native-country": ['United-States', 'Cambodia', 'England', 'Puerto-Rico', 'Canada', 'Germany', 'Outlying-US(Guam-USVI-etc)', 'India', 'Japan', 'Greece', 'South', 'China', 'Cuba', 'Iran', 'Honduras', 'Philippines', 'Italy', 'Poland', 'Jamaica', 'Vietnam', 'Mexico', 'Portugal', 'Ireland', 'France', 'Dominican-Republic', 'Laos', 'Ecuador', 'Taiwan', 'Haiti', 'Columbia', 'Hungary', 'Guatemala', 'Nicaragua', 'Scotland', 'Thailand', 'Yugoslavia', 'El-Salvador', 'Trinadad&Tobago', 'Peru', 'Hong', 'Holand-Netherlands']
    }
}


