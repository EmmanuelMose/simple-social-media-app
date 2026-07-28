import { useState, useEffect } from 'react';
import { usersAPI, type UserProfile as UserProfileType } from '../../Features/usersAPI';
import { type Post } from '../../Features/postsAPI';
import { followersAPI } from '../../Features/followersAPI';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import './UserProfile.css';

interface UserProfileProps {
  userId: number;
  token: string;
}

const UserProfile = ({ userId, token }: UserProfileProps) => {
  const [profile, setProfile] = useState<UserProfileType | null>(null);
  const [] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFollowing, setIsFollowing] = useState(false);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const profileData = await usersAPI.getProfile(token, userId);
      setProfile(profileData);
      setIsFollowing(profileData.isFollowed || false);
    } catch (err: any) {
      setError(err.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [userId, token]);

  const handleFollowToggle = async () => {
    try {
      if (isFollowing) {
        await followersAPI.unfollow(token, userId);
        setIsFollowing(false);
        setProfile(prev => prev ? { ...prev, followersCount: prev.followersCount - 1 } : null);
      } else {
        await followersAPI.follow(token, userId);
        setIsFollowing(true);
        setProfile(prev => prev ? { ...prev, followersCount: prev.followersCount + 1 } : null);
      }
    } catch (error) {
      console.error('Follow toggle error', error);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!profile) return <ErrorMessage message="Profile not found" />;

  return (
    <div className="user-profile">
      <div className="profile-header">
        <img
          src={profile.avatar || 'https://ui-avatars.com/api/?name=' + profile.fullName}
          alt={profile.fullName}
          className="profile-avatar-large"
        />
        <div className="profile-info">
          <h1>{profile.fullName}</h1>
          <p className="profile-username">@{profile.username}</p>
          {profile.bio && <p className="profile-bio">{profile.bio}</p>}
          <div className="profile-stats">
            <span><strong>{profile.postsCount}</strong> posts</span>
            <span><strong>{profile.followersCount}</strong> followers</span>
            <span><strong>{profile.followingCount}</strong> following</span>
            <span><strong>{profile.viewCount || 0}</strong> profile views</span>
          </div>
          <button
            className={`follow-btn ${isFollowing ? 'following' : ''}`}
            onClick={handleFollowToggle}
          >
            {isFollowing ? 'Unfollow' : 'Follow'}
          </button>
        </div>
      </div>

      <div className="profile-posts">
        <h2>Posts</h2>
        {/* We need a way to get posts by user; we'll implement in postsAPI later */}
        <p className="placeholder-text">User posts will appear here.</p>
      </div>
    </div>
  );
};

export default UserProfile;