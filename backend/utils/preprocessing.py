import numpy as np

def preprocess_customer_data(recency, frequency, monetary, scaler):
    recency_log = np.log1p(recency)
    frequency_log = np.log1p(frequency)
    monetary_log = np.log1p(monetary)
    features = np.array([[recency_log, frequency_log, monetary_log]])
    scaled = scaler.transform(features)
    return scaled