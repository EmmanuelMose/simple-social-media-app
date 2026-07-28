import { NavLink, useNavigate } from 'react-router-dom';
import { adminDrawerData } from './AdminDrawerData';
import './AdminAside.css';

const AdminAside = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <aside className="admin-aside">
      <div className="aside-header">
        <h2>Admin Panel</h2>
      </div>
      <nav className="aside-nav">
        {adminDrawerData.map((item) => (
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

export default AdminAside;