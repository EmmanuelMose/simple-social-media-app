import { useState, useEffect } from 'react';
import { adminAPI, type ResultPost } from '../../../Features/adminAPI';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import ErrorMessage from '../../../components/common/ErrorMessage';
import './ViewResults.css';

const ViewResults = () => {
  const [results, setResults] = useState<ResultPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token') || '';

  useEffect(() => {
    adminAPI.getResults(token)
      .then(res => setResults(res.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="view-results">
      <h1>Top Posts</h1>
      <div className="results-table">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Content</th>
              <th>Likes</th>
              <th>Comments</th>
              <th>Total Engagement</th>
            </tr>
          </thead>
          <tbody>
            {results.map((post, index) => (
              <tr key={post.postId}>
                <td>{index + 1}</td>
                <td>{post.content}</td>
                <td>{post.likes}</td>
                <td>{post.comments}</td>
                <td>{post.totalEngagement}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewResults;