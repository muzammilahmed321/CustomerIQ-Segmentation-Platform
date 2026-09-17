import './AnomalyTable.css';

function AnomalyTable({ anomalies }) {
  return (
    <table className="anomaly-table">
      <thead>
        <tr>
          <th>Customer ID</th>
          <th>Recency</th>
          <th>Frequency</th>
          <th>Monetary</th>
          <th>Anomaly Score</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {anomalies.map((a, i) => {
          const score = a.anomaly_score;
          const status = score < -0.1 ? 'Critical' : score < -0.02 ? 'High' : 'Medium';
          const statusClass = status.toLowerCase();
          return (
            <tr key={a['Customer ID']} style={{ animationDelay: `${i * 0.03}s` }}>
              <td>{a['Customer ID']}</td>
              <td>{a.Recency}</td>
              <td>{a.Frequency}</td>
              <td>${a.Monetary}</td>
              <td>{score.toFixed(3)}</td>
              <td><span className={`badge ${statusClass}`}>{status}</span></td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default AnomalyTable;