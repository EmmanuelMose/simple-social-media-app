import { useState, useEffect } from 'react';
import { adminAPI, type Analytics as AnalyticsData } from '../../../Features/adminAPI';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import ErrorMessage from '../../../components/common/ErrorMessage';
import './Analytics.css';

const Analytics = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token') || '';

  useEffect(() => {
    adminAPI.getAnalytics(token)
      .then(res => setData(res.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="analytics">
      <h1>Analytics</h1>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Users</h3>
          <p>{data?.totalUsers || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Total Posts</h3>
          <p>{data?.totalPosts || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Total Comments</h3>
          <p>{data?.totalComments || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Total Complaints</h3>
          <p>{data?.totalComplaints || 0}</p>
        </div>
      </div>
    </div>
  );
};

export default Analytics;