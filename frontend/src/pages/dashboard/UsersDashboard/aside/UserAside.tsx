import { NavLink, useNavigate } from 'react-router-dom';
import { userDrawerData } from './UserDrawerData';
import './UserAside.css';

const UserAside = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <aside className="user-aside">
      <div className="aside-header">
        <h2>My Dashboard</h2>
      </div>
      <nav className="aside-nav">
        {userDrawerData.map((item) => (
          <NavLink
            key={item.id}
            to={item.link}
            className={({ isActive }) => `aside-link ${isActive ? 'active' : ''}`}
            onClick={(e) => {
              if (item.id === 'logout') {
                e.preventDefault();
                handleLogout();
              }
            }}
          >
            <item.icon size={20} />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default UserAside;