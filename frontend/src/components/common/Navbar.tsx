import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { authAPI } from '../../Features/authAPI';
import './Navbar.css';

interface User {
  userId: number;
  fullName: string;
}

const Navbar = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      authAPI.getMe(token)
        .then(res => setUser(res.data))
        .catch(() => {});
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/" className="logo">SocialApp</Link>
      </div>
      <div className="nav-right">
        {user ? (
          <>
            <Link to="/explore">Explore</Link>
            <Link to={`/profile/${user.userId}`}>{user.fullName}</Link>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;