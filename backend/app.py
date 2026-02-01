from fastapi import FastAPI
import numpy as np
import joblib
from tensorflow.keras.models import load_model
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Credit Card Fraud Detection API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Load CNN & LSTM (h5 works fine)
cnn = load_model("models/cnn_model.h5")
lstm = load_model("models/lstm_model.h5")

# ✅ Load Transformer from new format (fix)
transformer = load_model("models/transformer_model.keras")


# ✅ Load XGBoost
xgb_model = joblib.load("models/xgb_model.pkl")


@app.get("/")
def home():
    return {"message": "Fraud Detection API running ✅"}


@app.post("/predict")
def predict(data: dict):
    if "features" not in data:
        return {"error": "Missing 'features' in request body"}

    features = np.array(data["features"]).reshape(1, -1)

    if features.shape[1] != 30:
        return {"error": f"Expected 30 features, got {features.shape[1]}"}

    features_3d = features.reshape(1, features.shape[1], 1)

    cnn_prob = float(cnn.predict(features_3d, verbose=0)[0][0])
    lstm_prob = float(lstm.predict(features_3d, verbose=0)[0][0])
    transformer_prob = float(transformer.predict(features_3d, verbose=0)[0][0])

    ensemble_input = np.array([[cnn_prob, lstm_prob, transformer_prob]])
    final_pred = int(xgb_model.predict(ensemble_input)[0])

    final_label = "FRAUD 🚨" if final_pred == 1 else "NORMAL ✅"

    return {
        "cnn_prob": cnn_prob,
        "lstm_prob": lstm_prob,
        "transformer_prob": transformer_prob,
        "final_prediction": final_pred,
        "final_label": final_label
    }

