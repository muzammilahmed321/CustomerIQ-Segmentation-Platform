from fastapi import APIRouter, HTTPException
from schemas import CustomerAnalyzeRequest, CustomerAnalyzeResponse, SimilarCustomerRequest
from model_loader import models
from utils.preprocessing import preprocess_customer_data

router = APIRouter()

@router.post("/api/customer/analyze", response_model=CustomerAnalyzeResponse)
def analyze_customer(data: CustomerAnalyzeRequest):
    scaled = preprocess_customer_data(data.recency, data.frequency, data.monetary, models["scaler"])
    cluster_id = int(models["clustering_model"].predict(scaled)[0])
    anomaly_pred = models["anomaly_model"].predict(scaled)[0]
    anomaly_score = float(models["anomaly_model"].decision_function(scaled)[0])
    cluster_info = models["metadata"]["cluster_labels"][str(cluster_id)]
    return {
        "segment": cluster_info["name"],
        "cluster_id": cluster_id,
        "anomaly": bool(anomaly_pred == -1),
        "anomaly_score": round(anomaly_score, 4),
        "recommended_action": cluster_info["action"]
    }

@router.post("/api/customer/similar")
def find_similar_customers(data: SimilarCustomerRequest):
    df = models["customer_data"]
    customer_row = df[df["Customer ID"] == data.customer_id]
    if customer_row.empty:
        raise HTTPException(status_code=404, detail="Customer not found")
    idx = customer_row.index[0]
    scaled = models["scaler"].transform(
        df.loc[[idx], ["Recency_log", "Frequency_log", "Monetary_log"]]
    )
    distances, indices = models["knn_model"].kneighbors(scaled, n_neighbors=data.top_n + 1)
    similar_customers = []
    for dist, i in zip(distances[0], indices[0]):
        row = df.iloc[i]
        if int(row["Customer ID"]) == data.customer_id:
            continue
        similar_customers.append({
            "customer_id": int(row["Customer ID"]),
            "recency": float(row["Recency"]),
            "frequency": float(row["Frequency"]),
            "monetary": float(row["Monetary"]),
            "distance": round(float(dist), 4)
        })
    return {
        "customer_id": data.customer_id,
        "similar_customers": similar_customers[:data.top_n]
    }