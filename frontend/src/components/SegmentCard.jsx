import './SegmentCard.css';

const COLORS = ['#ff6b5b', '#8b7fff', '#ffb347', '#5be0c9'];

function SegmentCard({ segment, index }) {
  const color = COLORS[index % COLORS.length];
  return (
    <div className="segment-card">
      <div className="segment-top">
        <span className="segment-dot" style={{ background: color, color }} />
        <span className="segment-pct">{segment.percentage}%</span>
      </div>
      <h3>{segment.name}</h3>
      <p className="segment-count">{segment.customer_count.toLocaleString()} customers</p>
      <div className="segment-metrics">
        <div>
          <span>Recency</span>
          <strong>{segment.avg_recency}d</strong>
        </div>
        <div>
          <span>Frequency</span>
          <strong>{segment.avg_frequency}</strong>
        </div>
        <div>
          <span>Monetary</span>
          <strong>${segment.avg_monetary.toLocaleString()}</strong>
        </div>
      </div>
      <p className="segment-action">{segment.action}</p>
    </div>
  );
}

export default SegmentCard;