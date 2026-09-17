from fastapi import APIRouter, HTTPException
from model_loader import models

router = APIRouter()

@router.get('/api/segments')
def get_segments():
    df = models["customer_data"]
    cluster_labels = models["metadata"]["cluster_labels"]
    total = len(df)
    segments = []
    for cluster_id, info in cluster_labels.items():
        cluster_df = df[df["Cluster"] == int(cluster_id)]
        segments.append({
            "cluster_id": int(cluster_id),
            "name": info["name"],
            "action": info["action"],
            "customer_count": len(cluster_df),
            "percentage": round(len(cluster_df) / total * 100, 1),
            "avg_recency": round(cluster_df["Recency"].mean(), 1),
            "avg_frequency": round(cluster_df["Frequency"].mean(), 1),
            "avg_monetary": round(cluster_df["Monetary"].mean(), 2)
        })
    return {"total_customers": total, "segments": segments}

@router.get('/api/segments/{cluster_id}')
def get_segment(cluster_id: int):
    df = models["customer_data"]
    cluster_labels = models["metadata"]["cluster_labels"]
    if str(cluster_id) not in cluster_labels:
        raise HTTPException(status_code=404, detail="Segment not found")
    cluster_df = df[df["Cluster"] == cluster_id]
    info = cluster_labels[str(cluster_id)]
    return {
        "cluster_id": cluster_id,
        "name": info["name"],
        "action": info["action"],
        "customer_count": len(cluster_df),
        "avg_recency": round(cluster_df["Recency"].mean(), 1),
        "avg_frequency": round(cluster_df["Frequency"].mean(), 1),
        "avg_monetary": round(cluster_df["Monetary"].mean(), 2),
        "sample_customers": cluster_df.head(10)[["Customer ID", "Recency", "Frequency", "Monetary"]].to_dict(orient="records")
    }