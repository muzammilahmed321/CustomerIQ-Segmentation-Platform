import { useState, useEffect } from 'react';
import { getSegments } from '../services/api';
import SegmentCard from '../components/SegmentCard';
import './Segments.css';

function Segments() {
  const [segments, setSegments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSegments();
  }, []);

  async function loadSegments() {
    try {
      const response = await getSegments();
      setSegments(response.data.segments);
    } catch (error) {
      console.error('Failed to load segments', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="segments-page">
      <h1>Customer Segments</h1>
      <div className="segments-grid">
        {segments.map((seg, i) => (
          <SegmentCard key={seg.cluster_id} segment={seg} index={i} />
        ))}
      </div>
    </div>
  );
}

export default Segments;