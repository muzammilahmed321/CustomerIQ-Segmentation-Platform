import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { getSegments, getAnomalies, getMetrics } from '../services/api';
import StatCard from '../components/StatCard';
import SegmentCard from '../components/SegmentCard';
import './Dashboard.css';

const COLORS = ['#ff6b5b', '#8b7fff', '#ffb347', '#5be0c9'];

function Dashboard() {
  const [segments, setSegments] = useState([]);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [totalAnomalies, setTotalAnomalies] = useState(0);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    try {
      const segmentsData = await getSegments();
      const anomalyData = await getAnomalies();
      const metricsData = await getMetrics();
      setSegments(segmentsData.data.segments);
      setTotalCustomers(segmentsData.data.total_customers);
      setTotalAnomalies(anomalyData.data.total_anomalies);
      setMetrics(metricsData.data);
    } catch (error) {
      console.error('there is some problem here', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="loading">Loading...</div>;

  const pieData = segments.map((s) => ({ name: s.name, value: s.customer_count }));
  const barData = segments.map((s) => ({ name: s.name.split(' ')[0], Monetary: s.avg_monetary }));

  return (
    <div className="dashboard">
      <div className="page-head">
        <h1>Overview</h1>
        <p>Live segmentation and anomaly summary across your customer base</p>
      </div>

      <div className="stats-row">
        {segments.map((seg, i) => (
          <StatCard
            key={seg.cluster_id}
            label={seg.name}
            value={seg.customer_count.toLocaleString()}
            trend={`${seg.percentage}% of base`}
            color={COLORS[i % COLORS.length]}
          />
        ))}
      </div>

      <div className="stats-row secondary">
        <StatCard label="Total Customers" value={totalCustomers.toLocaleString()} />
        <StatCard label="Flagged Anomalies" value={totalAnomalies} trend={`${((totalAnomalies / totalCustomers) * 100).toFixed(1)}% of base`} />
        {metrics && <StatCard label="Silhouette Score" value={metrics.silhouette_score} />}
      </div>

      <div className="chart-grid">
        <div className="chart-section">
          <h2>Segment Distribution</h2>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3}>
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} stroke="none" />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: '#1c1730', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#f2eefb' }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-section">
          <h2>Avg. Spend by Segment</h2>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
              <XAxis dataKey="name" tick={{ fill: '#9b93b5', fontSize: 12 }} />
              <YAxis tick={{ fill: '#9b93b5', fontSize: 12 }} />
              <Tooltip contentStyle={{ background: '#1c1730', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#f2eefb' }} />
              <Bar dataKey="Monetary" radius={[4, 4, 0, 0]}>
                {barData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <h2 className="section-title">Segments</h2>
      <div className="segments-grid">
        {segments.map((seg, i) => (
          <SegmentCard key={seg.cluster_id} segment={seg} index={i} />
        ))}
      </div>
    </div>
  );
}

export default Dashboard;