from pydantic import BaseModel

class CustomerAnalyzeRequest(BaseModel):
    recency: int
    frequency: int
    monetary: float

class CustomerAnalyzeResponse(BaseModel):
    segment: str
    cluster_id: int
    anomaly: bool
    anomaly_score: float
    recommended_action: str

class SimilarCustomerRequest(BaseModel):
    customer_id: int
    top_n: int = 5

class SimilarCustomer(BaseModel):
    customer_id: int
    recency: float
    frequency: float
    monetary: float
    distance: float