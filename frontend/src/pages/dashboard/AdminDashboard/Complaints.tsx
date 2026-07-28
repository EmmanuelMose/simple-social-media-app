import { useState, useEffect } from 'react';
import { adminAPI, type Complaint } from '../../../Features/adminAPI';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import ErrorMessage from '../../../components/common/ErrorMessage';
import './Complaints.css';

const Complaints = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const token = localStorage.getItem('token') || '';
  const limit = 10;

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const res = await adminAPI.getComplaints(token, page, limit);
      setComplaints(res.data.complaints);
      setTotal(res.data.total);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [page, token]);

  const handleResolve = async (complaintId: number, status: 'resolved' | 'dismissed') => {
    try {
      await adminAPI.resolveComplaint(token, complaintId, status);
      setComplaints(prev =>
        prev.map(c => (c.complaintId === complaintId ? { ...c, status } : c))
      );
    } catch (err: any) {
      alert('Failed to resolve complaint: ' + err.message);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="complaints">
      <h1>Complaints</h1>
      <div className="complaints-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>User ID</th>
              <th>Complaint</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {complaints.map(c => (
              <tr key={c.complaintId}>
                <td>{c.complaintId}</td>
                <td>{c.userId}</td>
                <td>{c.complaint}</td>
                <td>
                  <span className={`status-badge status-${c.status}`}>
                    {c.status}
                  </span>
                </td>
                <td>
                  {c.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleResolve(c.complaintId, 'resolved')}
                        className="resolve-btn"
                      >
                        Resolve
                      </button>
                      <button
                        onClick={() => handleResolve(c.complaintId, 'dismissed')}
                        className="dismiss-btn"
                      >
                        Dismiss
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="pagination">
        <button
          disabled={page === 1}
          onClick={() => setPage(p => p - 1)}
        >
          Previous
        </button>
        <span>Page {page}</span>
        <button
          disabled={page * limit >= total}
          onClick={() => setPage(p => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Complaints;