import UserSearch from '../components/users/UserSearch';
import './ExplorePage.css';

const ExplorePage = () => {
  const token = localStorage.getItem('token') || '';

  return (
    <div className="explore-page">
      <h1>Explore Users</h1>
      <UserSearch token={token} />
    </div>
  );
};

export default ExplorePage;