import './StatCard.css';

function StatCard({ label, value, trend, color }) {
  return (
    <div className="stat-card">
      <div className="stat-label">{label}</div>
      <div
        className="stat-value"
        style={color ? { background: color, WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' } : {}}
      >
        {value}
      </div>
      {trend && <div className="stat-trend">{trend}</div>}
    </div>
  );
}

export default StatCard;