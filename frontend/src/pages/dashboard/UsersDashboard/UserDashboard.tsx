import { Outlet } from 'react-router-dom';
import UserAside from './aside/UserAside';
import './UserDashboard.css';

const UserDashboard = () => {
  return (
    <div className="user-dashboard">
      <UserAside />
      <main className="user-content">
        <Outlet />
      </main>
    </div>
  );
};

export default UserDashboard;