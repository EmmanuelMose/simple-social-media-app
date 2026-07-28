import { Link } from 'react-router-dom';
import './UserCard.css';

interface UserCardProps {
  user: {
    userId: number;
    fullName: string;
    username: string;
    avatar: string | null;
    bio?: string | null;
    isFollowed?: boolean;
  };
  onFollowToggle?: () => void;
}

const UserCard = ({ user, onFollowToggle }: UserCardProps) => {
  return (
    <div className="user-card">
      <img
        src={user.avatar || 'https://ui-avatars.com/api/?name=' + user.fullName}
        alt={user.fullName}
        className="user-card-avatar"
      />
      <div className="user-card-info">
        <Link to={`/profile/${user.userId}`} className="user-card-name">
          {user.fullName}
        </Link>
        <span className="user-card-username">@{user.username}</span>
        {user.bio && <p className="user-card-bio">{user.bio}</p>}
      </div>
      {onFollowToggle && (
        <button className="user-card-follow" onClick={onFollowToggle}>
          {user.isFollowed ? 'Unfollow' : 'Follow'}
        </button>
      )}
    </div>
  );
};

export default UserCard;