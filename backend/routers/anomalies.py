from fastapi import APIRouter, HTTPException
from model_loader import models

router = APIRouter()

@router.get('/api/anomalies')
def get_anomalies():
    df = models['customer_data']
    anomaly_df = df[df["anomaly"] == "Anomaly"].sort_values("anomaly_score")
    return {
        "total_anomalies": len(anomaly_df),
        "anomalies": anomaly_df[["Customer ID", "Recency", "Frequency", "Monetary", "anomaly_score"]].to_dict(orient="records")
    }

@router.get('/api/anomalies/{customer_id}')
def get_anomaly(customer_id: int):
    df = models['customer_data']
    customer = df[df["Customer ID"] == customer_id]
    if customer.empty:
        raise HTTPException(status_code=404, detail="Customer not found")
    row = customer.iloc[0]
    if row["anomaly"] != "Anomaly":
        raise HTTPException(status_code=404, detail="This customer is not flagged as an anomaly")
    return {
        "customer_id": int(customer_id),
        "recency": float(row["Recency"]),
        "frequency": float(row["Frequency"]),
        "monetary": float(row["Monetary"]),
        "anomaly_score": float(row["anomaly_score"])
    }