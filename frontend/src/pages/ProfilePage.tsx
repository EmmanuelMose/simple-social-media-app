import { useParams } from 'react-router-dom';
import UserProfile from '../components/users/UserProfile';
import './ProfilePage.css';

const ProfilePage = () => {
  const { userId } = useParams<{ userId: string }>();
  const token = localStorage.getItem('token') || '';

  if (!userId) return <div>User not found</div>;

  return (
    <div className="profile-page">
      <UserProfile userId={parseInt(userId)} token={token} />
    </div>
  );
};

export default ProfilePage;