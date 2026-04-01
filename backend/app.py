import os
import zipfile
from tensorflow.keras.models import load_model
import joblib

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE_DIR, "models")

print("📂 Model folder contents BEFORE:", os.listdir(MODEL_DIR))

# ================================
# 🔹 EXTRACT ZIP MODELS
# ================================
def extract_model(zip_name, target_name):
    zip_path = os.path.join(MODEL_DIR, zip_name)
    target_path = os.path.join(MODEL_DIR, target_name)

    if not os.path.exists(target_path):
        print(f"🔧 Extracting {zip_name}...")
        with zipfile.ZipFile(zip_path, 'r') as zip_ref:
            zip_ref.extractall(MODEL_DIR)

# extract all
extract_model("best_cnn.keras.zip", "best_cnn.keras")
extract_model("best_lstm.keras.zip", "best_lstm.keras")
extract_model("best_transformer.keras.zip", "best_transformer.keras")

print("📂 Model folder contents AFTER:", os.listdir(MODEL_DIR))

# ================================
# 🔹 LOAD MODELS
# ================================
cnn = load_model(os.path.join(MODEL_DIR, "best_cnn.keras"))
lstm = load_model(os.path.join(MODEL_DIR, "best_lstm.keras"))
transformer = load_model(os.path.join(MODEL_DIR, "best_transformer.keras"))

xgb_model = joblib.load(os.path.join(MODEL_DIR, "best_xgboost.pkl"))
scaler = joblib.load(os.path.join(MODEL_DIR, "scaler.pkl"))

print("✅ Models + Scaler loaded successfully")
from fastapi import FastAPI
import numpy as np
import joblib
from tensorflow.keras.models import load_model
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Credit Card Fraud Detection API")

# =====================================================
# 🔹 CORS
# =====================================================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =====================================================
# 🔹 BASE PATH
# =====================================================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE_DIR, "models")

# =====================================================
# 🔹 DEBUG (VERY IMPORTANT)
# =====================================================
print("📂 Model folder contents:", os.listdir(MODEL_DIR))

# =====================================================
# 🔹 LOAD MODELS


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
        features = np.array(data["features"], dtype=np.float32).reshape(1, -1)

        if features.shape[1] != 30:
            return {"error": f"Expected 30 features, got {features.shape[1]}"}

        # scaling
        features = scaler.transform(features)

        # reshape
        features_3d = features.reshape(1, features.shape[1], 1)

        # predictions
        cnn_prob = float(cnn.predict(features_3d, verbose=0)[0][0])
        lstm_prob = float(lstm.predict(features_3d, verbose=0)[0][0])
        transformer_prob = float(transformer.predict(features_3d, verbose=0)[0][0])

        # ensemble
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
        return {"error": str(e)}

