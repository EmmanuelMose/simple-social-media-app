import { useState, useEffect } from 'react';
import { adminAPI, type User } from '../../../Features/adminAPI';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import ErrorMessage from '../../../components/common/ErrorMessage';
import './ManageUsers.css';

const ManageUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const token = localStorage.getItem('token') || '';
  const limit = 10;

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await adminAPI.getAllUsers(token, page, limit);
      setUsers(res.data.users);
      setTotal(res.data.total);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, token]);

  const handleRoleChange = async (userId: number, newRole: 'user' | 'admin') => {
    try {
      await adminAPI.updateUserRole(token, userId, newRole);
      setUsers(prev =>
        prev.map(u => (u.userId === userId ? { ...u, role: newRole } : u))
      );
    } catch (err: any) {
      alert('Failed to update role: ' + err.message);
    }
  };

  const handleDelete = async (userId: number) => {
    if (!window.confirm('Delete this user permanently?')) return;
    try {
      await adminAPI.deleteUser(token, userId);
      setUsers(prev => prev.filter(u => u.userId !== userId));
    } catch (err: any) {
      alert('Failed to delete user: ' + err.message);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="manage-users">
      <h1>Manage Users</h1>
      <div className="user-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.userId}>
                <td>{user.userId}</td>
                <td>{user.fullName}</td>
                <td>{user.email}</td>
                <td>
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.userId, e.target.value as 'user' | 'admin')}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td>
                  <button onClick={() => handleDelete(user.userId)} className="delete-btn">
                    Delete
                  </button>
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

export default ManageUsers;