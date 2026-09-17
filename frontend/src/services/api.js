import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const getHealth = () => api.get('/api/model/health');
export const getMetrics = () => api.get('/api/model/metrics');
export const getSegments = () => api.get('/api/segments');
export const getSegment = (clusterId) => api.get(`/api/segments/${clusterId}`);
export const getAnomalies = () => api.get('/api/anomalies');
export const getAnomaly = (customerId) => api.get(`/api/anomalies/${customerId}`);
export const getCustomers = (page = 1, limit = 20) => api.get(`/api/customers?page=${page}&limit=${limit}`);
export const getCustomer = (customerId) => api.get(`/api/customers/${customerId}`);
export const analyzeCustomer = (data) => api.post('/api/customer/analyze', data);
export const findSimilarCustomers = (data) => api.post('/api/customer/similar', data);

export default api;