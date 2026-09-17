from fastapi import APIRouter, HTTPException
from model_loader import models

router = APIRouter()

@router.get("/api/customers")
def get_customers(page: int = 1, limit: int = 20):
    df = models["customer_data"]
    start = (page - 1) * limit
    end = start + limit
    subset = df.iloc[start:end]
    return {
        "total_customers": len(df),
        "page": page,
        "limit": limit,
        "customers": subset.to_dict(orient="records")
    }

@router.get("/api/customers/{customer_id}")
def get_customer(customer_id: int):
    df = models["customer_data"]
    customer = df[df["Customer ID"] == customer_id]
    if customer.empty:
        raise HTTPException(status_code=404, detail="Customer not found")
    return customer.to_dict(orient="records")[0]