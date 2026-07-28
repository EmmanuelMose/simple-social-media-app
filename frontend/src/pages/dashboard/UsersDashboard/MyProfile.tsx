import { useState, useEffect } from 'react';
import { usersAPI } from '../../../Features/usersAPI';
import { useAuth } from '../../../context/AuthContext';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import ErrorMessage from '../../../components/common/ErrorMessage';
import './MyProfile.css';

const MyProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState('');
  const token = localStorage.getItem('token') || '';

  useEffect(() => {
    if (!user) return;
    fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await usersAPI.getProfile(token, user!.userId);
      setProfile(data);
      setFullName(data.fullName);
      setBio(data.bio || '');
      setAvatar(data.avatar || '');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updated = await usersAPI.updateProfile(token, { fullName, bio, avatar });
      setProfile(updated.data);
      setEditMode(false);
    } catch (err: any) {
      alert('Update failed: ' + err.message);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!profile) return <ErrorMessage message="Profile not found" />;

  return (
    <div className="my-profile">
      <h1>My Profile</h1>
      {!editMode ? (
        <div className="profile-view">
          <img
            src={profile.avatar || 'https://ui-avatars.com/api/?name=' + profile.fullName}
            alt={profile.fullName}
            className="profile-avatar"
          />
          <div className="profile-details">
            <p><strong>Username:</strong> {profile.username}</p>
            <p><strong>Full Name:</strong> {profile.fullName}</p>
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Bio:</strong> {profile.bio || 'No bio yet'}</p>
            <p><strong>Followers:</strong> {profile.followersCount}</p>
            <p><strong>Following:</strong> {profile.followingCount}</p>
            <p><strong>Posts:</strong> {profile.postsCount}</p>
            <button onClick={() => setEditMode(true)} className="edit-btn">
              Edit Profile
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleUpdate} className="profile-edit-form">
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
            />
          </div>
          <div className="form-group">
            <label>Avatar URL</label>
            <input
              type="text"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              placeholder="https://example.com/avatar.jpg"
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="save-btn">Save</button>
            <button type="button" onClick={() => setEditMode(false)} className="cancel-btn">
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default MyProfile;