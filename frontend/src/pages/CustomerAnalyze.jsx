import { useState } from 'react';
import { analyzeCustomer } from '../services/api';
import './CustomerAnalyze.css';

function CustomerAnalyze() {
  const [recency, setRecency] = useState('');
  const [frequency, setFrequency] = useState('');
  const [monetary, setMonetary] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setResult(null);
    try {
      const response = await analyzeCustomer({
        recency: Number(recency),
        frequency: Number(frequency),
        monetary: Number(monetary),
      });
      setResult(response.data);
    } catch (err) {
      setError('Failed to analyze customer');
    }
  }

  return (
    <div className="analyze-page">
      <h1>Analyze a Customer</h1>
      <form onSubmit={handleSubmit} className="analyze-form">
        <label>
          Recency (days since last purchase)
          <input type="number" value={recency} onChange={(e) => setRecency(e.target.value)} required />
        </label>
        <label>
          Frequency (number of orders)
          <input type="number" value={frequency} onChange={(e) => setFrequency(e.target.value)} required />
        </label>
        <label>
          Monetary (total spend)
          <input type="number" value={monetary} onChange={(e) => setMonetary(e.target.value)} required />
        </label>
        <button type="submit">Analyze</button>
      </form>

      {error && <p className="error">{error}</p>}

      {result && (
        <div className="result-card">
          <h2>{result.segment}</h2>
          <p>Cluster ID: {result.cluster_id}</p>
          <p>Anomaly: {result.anomaly ? 'Yes' : 'No'}</p>
          <p>Anomaly Score: {result.anomaly_score}</p>
          <p className="action">Recommended Action: {result.recommended_action}</p>
        </div>
      )}
    </div>
  );
}

export default CustomerAnalyze;