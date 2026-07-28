import { useState } from 'react';
import { usersAPI } from '../../Features/usersAPI';
import { followersAPI } from '../../Features/followersAPI';
import UserCard from './UserCard';
import './UserSearch.css';

interface UserSearchProps {
  token: string;
}

const UserSearch = ({ token }: UserSearchProps) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await usersAPI.searchUsers(token, query);
      setResults(res.data);
    } catch (err: any) {
      setError(err.message || 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleFollowToggle = async (userId: number, currentStatus: boolean) => {
    try {
      if (currentStatus) {
        await followersAPI.unfollow(token, userId);
      } else {
        await followersAPI.follow(token, userId);
      }
      setResults(prev =>
        prev.map(u =>
          u.userId === userId ? { ...u, isFollowed: !currentStatus } : u
        )
      );
    } catch (error) {
      console.error('Follow toggle error', error);
    }
  };

  return (
    <div className="user-search">
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Search users by name or username..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search-input"
        />
        <button type="submit" className="search-btn">Search</button>
      </form>
      {loading && <p>Searching...</p>}
      {error && <div className="search-error">{error}</div>}
      {results.length === 0 && !loading && query && (
        <p className="search-empty">No users found</p>
      )}
      <div className="search-results">
        {results.map((user) => (
          <UserCard
            key={user.userId}
            user={user}
            onFollowToggle={() => handleFollowToggle(user.userId, user.isFollowed)}
          />
        ))}
      </div>
    </div>
  );
};

export default UserSearch;