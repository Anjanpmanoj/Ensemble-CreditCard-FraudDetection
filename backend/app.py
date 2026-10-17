import os
import zipfile
import traceback
import numpy as np
import joblib
import shap
from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from tensorflow.keras.models import load_model
from pydantic import BaseModel
from database import engine, SessionLocal
from db_models import Base, User, Transaction

Base.metadata.create_all(bind=engine)

# =====================================================
# 🔹 PYDANTIC MODELS
# =====================================================
class LoginInput(BaseModel):
    username: str
    password: str

class SignupInput(BaseModel):
    username: str
    password: str

# =====================================================
# 🔹 PATHS
# =====================================================
BASE_DIR  = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE_DIR, "models")

print("=" * 55)
print("🚀 CreditSaver API starting up...")
print(f"📁 BASE_DIR  : {BASE_DIR}")
print(f"📁 MODEL_DIR : {MODEL_DIR}")

# =====================================================
# 🔹 EXTRACT ZIPPED KERAS MODELS IF NEEDED
# =====================================================
def extract_if_needed(zip_name):
    zip_path     = os.path.join(MODEL_DIR, zip_name)
    extract_name = zip_name.replace(".zip", "")
    extract_path = os.path.join(MODEL_DIR, extract_name)

    if os.path.exists(extract_path):
        print(f"✅ Already extracted: {extract_name}")
        return True

    if not os.path.exists(zip_path):
        print(f"❌ ZIP not found: {zip_path}")
        return False

    try:
        print(f"🔧 Extracting {zip_name}...")
        with zipfile.ZipFile(zip_path, "r") as z:
            z.extractall(MODEL_DIR)
        print(f"✅ Extracted: {extract_name}")
        return True
    except Exception as e:
        print(f"❌ Failed to extract {zip_name}: {e}")
        return False

extract_if_needed("best_cnn.keras.zip")
extract_if_needed("best_lstm.keras.zip")
extract_if_needed("best_transformer.keras.zip")

# =====================================================
# 🔹 DEBUG: LIST MODEL FOLDER
# =====================================================
print("\n📂 Model folder contents:")
if os.path.exists(MODEL_DIR):
    for f in os.listdir(MODEL_DIR):
        fpath = os.path.join(MODEL_DIR, f)
        size  = os.path.getsize(fpath)
        print(f"   {f}  ({size:,} bytes)")
else:
    print(f"❌ MODEL_DIR does not exist: {MODEL_DIR}")

# =====================================================
# 🔹 LOAD MODELS
# =====================================================
def load_keras(name):
    path = os.path.join(MODEL_DIR, name)
    if not os.path.exists(path):
        print(f"❌ File missing: {path}")
        return None
    try:
        m = load_model(path)
        print(f"✅ Loaded: {name}")
        return m
    except Exception as e:
        print(f"❌ Failed to load {name}: {e}")
        traceback.print_exc()
        return None

def load_pkl(name):
    path = os.path.join(MODEL_DIR, name)
    if not os.path.exists(path):
        print(f"❌ File missing: {path}")
        return None
    try:
        m = joblib.load(path)
        print(f"✅ Loaded: {name}")
        return m
    except Exception as e:
        print(f"❌ Failed to load {name}: {e}")
        traceback.print_exc()
        return None

print("\n🔄 Loading models...")
cnn         = load_keras("best_cnn.keras")
lstm        = load_keras("best_lstm.keras")
transformer = load_keras("best_transformer.keras")
xgb_model   = load_pkl("best_xgboost.pkl")
scaler      = load_pkl("scaler.pkl")
explainer   = shap.TreeExplainer(xgb_model)

# =====================================================
# 🔹 STARTUP SUMMARY
# =====================================================
print("\n📊 Load summary:")
print(f"   CNN         : {'✅ ready' if cnn         else '❌ FAILED'}")
print(f"   LSTM        : {'✅ ready' if lstm        else '❌ FAILED'}")
print(f"   Transformer : {'✅ ready' if transformer else '❌ FAILED'}")
print(f"   XGBoost     : {'✅ ready' if xgb_model   else '❌ FAILED'}")
print(f"   Scaler      : {'✅ ready' if scaler      else '❌ FAILED'}")

all_loaded = all([cnn, lstm, transformer, xgb_model, scaler])
print(f"\n{'✅ All models loaded — API ready!' if all_loaded else '⚠️  Some models failed — /predict will return errors'}")
print("=" * 55)

# =====================================================
# 🔹 FASTAPI APP
# =====================================================
app = FastAPI(title="CreditSaver Fraud Detection API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =====================================================
# 🔹 ROOT
# =====================================================
@app.get("/")
def home():
    return {
        "message": "CreditSaver Fraud Detection API ✅",
        "models": {
            "cnn":         "loaded" if cnn         else "FAILED",
            "lstm":        "loaded" if lstm        else "FAILED",
            "transformer": "loaded" if transformer else "FAILED",
            "xgboost":     "loaded" if xgb_model   else "FAILED",
            "scaler":      "loaded" if scaler      else "FAILED",
        }
    }

# =====================================================
# 🔹 HEALTH CHECK
# =====================================================
@app.get("/health")
def health():
    ok = all([cnn, lstm, transformer, xgb_model, scaler])
    return {"status": "ok" if ok else "degraded", "all_models_loaded": ok}

# =====================================================
# 🔹 PREDICT
# =====================================================
@app.post("/predict")
async def predict(request: Request):

    # ── Parse body ──────────────────────────────────
    try:
        data = await request.json()
    except Exception as e:
        print(f"❌ Failed to parse request JSON: {e}")
        return {"error": f"Invalid JSON body: {e}"}

    print(f"\n📥 /predict called — keys received: {list(data.keys())}")

    if "features" not in data:
        print("❌ Missing 'features' key in request")
        return {"error": "Missing 'features' in request body"}

    # ── Validate models loaded ───────────────────────
    if not all([cnn, lstm, transformer, xgb_model, scaler]):
        print("❌ One or more models not loaded")
        return {"error": "One or more models failed to load at startup. Check server logs."}

    # ── Parse features ───────────────────────────────
    try:
        features = np.array(data["features"], dtype=np.float32).reshape(1, -1)
        print(f"✅ Features parsed — shape: {features.shape}")
    except Exception as e:
        print(f"❌ Failed to parse features: {e}")
        return {"error": f"Failed to parse features: {e}"}

    if features.shape[1] != 30:
        print(f"❌ Wrong feature count: {features.shape[1]}")
        return {"error": f"Expected 30 features, got {features.shape[1]}"}

    # ── Scale ────────────────────────────────────────
    try:
        features_scaled = scaler.transform(features)
        print(f"✅ Scaler applied — sample: {features_scaled[0][:3]}")
    except Exception as e:
        print(f"❌ Scaler failed: {e}")
        traceback.print_exc()
        return {"error": f"Scaler error: {e}"}

    # ── Reshape for DL models ────────────────────────
    features_3d = features_scaled.reshape(1, 30, 1)

    # ── CNN ──────────────────────────────────────────
    try:
        cnn_prob = float(cnn.predict(features_3d, verbose=0)[0][0])
        print(f"✅ CNN prob: {cnn_prob:.6f}")
    except Exception as e:
        print(f"❌ CNN prediction failed: {e}")
        traceback.print_exc()
        return {"error": f"CNN prediction failed: {e}"}

    # ── LSTM ─────────────────────────────────────────
    try:
        lstm_prob = float(lstm.predict(features_3d, verbose=0)[0][0])
        print(f"✅ LSTM prob: {lstm_prob:.6f}")
    except Exception as e:
        print(f"❌ LSTM prediction failed: {e}")
        traceback.print_exc()
        return {"error": f"LSTM prediction failed: {e}"}

    # ── Transformer ──────────────────────────────────
    try:
        transformer_prob = float(transformer.predict(features_3d, verbose=0)[0][0])
        print(f"✅ Transformer prob: {transformer_prob:.6f}")
    except Exception as e:
        print(f"❌ Transformer prediction failed: {e}")
        traceback.print_exc()
        return {"error": f"Transformer prediction failed: {e}"}

    # ── XGBoost ensemble ─────────────────────────────
    try:
        ensemble_input = np.array([[cnn_prob, lstm_prob, transformer_prob]])
        print(f"✅ Ensemble input: {ensemble_input}")

        final_pred  = int(xgb_model.predict(ensemble_input)[0])
        final_proba = float(xgb_model.predict_proba(ensemble_input)[0][1])
        print(f"✅ XGBoost — pred: {final_pred}  proba: {final_proba:.6f}")
    except Exception as e:
        print(f"❌ XGBoost prediction failed: {e}")
        traceback.print_exc()
        return {"error": f"XGBoost prediction failed: {e}"}
    final_label = "FRAUD 🚨" if final_pred == 1 else "NORMAL ✅"
    print(f"✅ Final decision: {final_label}\n")

    # ── Save to DB ───────────────────────────────────
    try:
        db = SessionLocal()
        txn = Transaction(
            user_id=data.get("user_id", 0),
            features=data["features"],
            prediction=final_label,
            cnn_prob=cnn_prob,
            lstm_prob=lstm_prob,
            transformer_prob=transformer_prob
        )
        db.add(txn)
        db.commit()
        db.close()
        print("✅ Transaction saved to DB")
    except Exception as e:
        print(f"⚠️ DB save failed (non-fatal): {e}")

    # ── SHAP ─────────────────────────────────────────
    try:
        shap_values  = explainer.shap_values(ensemble_input)
        feature_names = ["CNN", "LSTM", "Transformer"]
        shap_output  = dict(zip(feature_names, shap_values[0].tolist()))
    except Exception as e:
        print(f"⚠️ SHAP failed (non-fatal): {e}")
        shap_output = {}

    # ── Response ─────────────────────────────────────
    

    return {
        "cnn_prob":         cnn_prob,
        "lstm_prob":        lstm_prob,
        "transformer_prob": transformer_prob,
        "final_prediction": final_pred,
        "final_label":      final_label,
        "shap_values":      shap_output,
    }

# =====================================================
# 🔹 SIGNUP
# =====================================================
@app.post("/signup")
def signup(data: SignupInput):
    db = SessionLocal()
    try:
        existing = db.query(User).filter(User.username == data.username).first()
        if existing:
            raise HTTPException(status_code=400, detail="Username already exists")
        user = User(username=data.username, password=data.password)
        db.add(user)
        db.commit()
        return {"message": "User created successfully"}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Signup failed: {e}")
    finally:
        db.close()

# =====================================================
# 🔹 LOGIN
# =====================================================
@app.post("/login")
def login(data: LoginInput):
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.username == data.username).first()
        if not user or user.password != data.password:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        return {"user_id": user.id, "username": user.username}
    finally:
        db.close()

# =====================================================
# 🔹 HISTORY
# =====================================================
@app.get("/history/{user_id}")
def get_history(user_id: int):
    db = SessionLocal()
    try:
        txns = db.query(Transaction).filter(Transaction.user_id == user_id).all()
        return [
            {
                "id":               t.id,
                "prediction":       t.prediction,
                "cnn_prob":         t.cnn_prob,
                "lstm_prob":        t.lstm_prob,
                "transformer_prob": t.transformer_prob,
                "timestamp":        t.timestamp if hasattr(t, "timestamp") else None,
            }
            for t in txns
        ]
    finally:
        db.close()