from fastapi import FastAPI
import numpy as np
import joblib
from tensorflow.keras.models import load_model
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Credit Card Fraud Detection API")

# =====================================================
# 🔹 CORS (Frontend support)
# =====================================================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =====================================================
# 🔹 LOAD MODELS
# =====================================================
cnn = load_model("models/best_cnn.keras")
lstm = load_model("models/best_lstm.keras")
transformer = load_model("models/best_transformer.keras")

xgb_model = joblib.load("models/best_xgboost.pkl")

# 🔥 LOAD SCALER (VERY IMPORTANT)
scaler = joblib.load("models/scaler.pkl")

print("✅ Models + Scaler loaded successfully")

# =====================================================
# 🔹 ROOT
# =====================================================
@app.get("/")
def home():
    return {"message": "Fraud Detection API running ✅"}

# =====================================================
# 🔹 PREDICT
# =====================================================
@app.post("/predict")
def predict(data: dict):
    if "features" not in data:
        return {"error": "Missing 'features' in request body"}

    try:
        # convert to numpy
        features = np.array(data["features"], dtype=np.float32).reshape(1, -1)

        # check feature size
        if features.shape[1] != 30:
            return {"error": f"Expected 30 features, got {features.shape[1]}"}

        # =====================================================
        # 🔹 APPLY SCALING (CRITICAL)
        # =====================================================
        features = scaler.transform(features)

        # reshape for DL models
        features_3d = features.reshape(1, features.shape[1], 1)

        # =====================================================
        # 🔹 BASE MODEL PREDICTIONS
        # =====================================================
        cnn_prob = float(cnn.predict(features_3d, verbose=0)[0][0])
        lstm_prob = float(lstm.predict(features_3d, verbose=0)[0][0])
        transformer_prob = float(transformer.predict(features_3d, verbose=0)[0][0])

        # =====================================================
        # 🔹 ENSEMBLE (XGBOOST)
        # =====================================================
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

    except Exception as e:
        return {"error": str(e)}}

