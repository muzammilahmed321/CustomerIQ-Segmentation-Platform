import joblib
import json
import pandas as pd
from config import MODELS_DIR, DATA_PATH

def load_models():
    clustering_model = joblib.load(f"{MODELS_DIR}/clustering_model_v1.pkl")
    scaler = joblib.load(f"{MODELS_DIR}/scaler_v1.pkl")
    anomaly_model = joblib.load(f"{MODELS_DIR}/anomaly_model_v1.pkl")
    knn_model = joblib.load(f"{MODELS_DIR}/knn_model_v1.pkl")
    with open(f"{MODELS_DIR}/metadata.json") as f:
        metadata = json.load(f)
    customer_data = pd.read_csv(DATA_PATH)
    return {
        "clustering_model": clustering_model,
        "scaler": scaler,
        "anomaly_model": anomaly_model,
        "knn_model": knn_model,
        "metadata": metadata,
        "customer_data": customer_data
    }

models = load_models()