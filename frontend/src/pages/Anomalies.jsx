import { useState, useEffect } from 'react';
import { getAnomalies } from '../services/api';
import AnomalyTable from '../components/AnomalyTable';
import './Anomalies.css';

function Anomalies() {
  const [anomalies, setAnomalies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnomalies();
  }, []);

  async function loadAnomalies() {
    try {
      const response = await getAnomalies();
      setAnomalies(response.data.anomalies);
    } catch (error) {
      console.error('Failed to load anomalies', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="anomalies-page">
      <h1>Behavioral Anomalies</h1>
      <p className="subtitle">{anomalies.length} customers flagged for unusual purchasing behavior</p>
      <div className="table-wrap">
        <AnomalyTable anomalies={anomalies} />
      </div>
    </div>
  );
}

export default Anomalies;