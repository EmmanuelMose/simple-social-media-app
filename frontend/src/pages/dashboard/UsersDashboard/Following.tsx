import { useState, useEffect } from 'react';
import { followersAPI } from '../../../Features/followersAPI';
import { usersAPI } from '../../../Features/usersAPI';
import { useAuth } from '../../../context/AuthContext';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import ErrorMessage from '../../../components/common/ErrorMessage';
import UserCard from '../../../components/users/UserCard';
import './Following.css';

const Following = () => {
  const { user } = useAuth();
  const [following, setFollowing] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token') || '';

  useEffect(() => {
    if (!user) return;
    const fetchFollowing = async () => {
      try {
        setLoading(true);
        const res = await followersAPI.getFollowing(token, user.userId);
        const followingIds = res.data.map((f: any) => f.followingId);
        const userPromises = followingIds.map((id: number) => usersAPI.getProfile(token, id));
        const userResults = await Promise.all(userPromises);
        setFollowing(userResults);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchFollowing();
  }, [user, token]);

  const handleUnfollow = async (userId: number) => {
    try {
      await followersAPI.unfollow(token, userId);
      setFollowing(prev => prev.filter(u => u.userId !== userId));
    } catch (err: any) {
      alert('Failed to unfollow: ' + err.message);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="following">
      <h1>Following</h1>
      {following.length === 0 ? (
        <p className="empty-msg">You are not following anyone yet.</p>
      ) : (
        following.map(u => (
          <UserCard
            key={u.userId}
            user={{
              userId: u.userId,
              fullName: u.fullName,
              username: u.username,
              avatar: u.avatar,
              bio: u.bio,
              isFollowed: true,
            }}
            onFollowToggle={() => handleUnfollow(u.userId)}
          />
        ))
      )}
    </div>
  );
};

export default Following;