from fastapi import APIRouter
from model_loader import models

router = APIRouter()

@router.get("/api/model/health")
def health_check():
    return {
        "status": "healthy",
        "clustering_model": "loaded" if models["clustering_model"] else "not loaded",
        "anomaly_model": "loaded" if models["anomaly_model"] else "not loaded",
        "scaler": "loaded" if models["scaler"] else "not loaded",
        "knn_model": "loaded" if models["knn_model"] else "not loaded"
    }

@router.get("/api/model/metrics")
def model_metrics():
    metadata = models["metadata"]
    return {
        "model_version": metadata["model_version"],
        "n_clusters": metadata["n_clusters"],
        "features_used": metadata["features"],
        "silhouette_score": metadata["silhouette_score"],
        "davies_bouldin_index": metadata["davies_bouldin_index"],
        "calinski_harabasz_score": metadata["calinski_harabasz_score"]
    }