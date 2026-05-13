import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">
        <span className="nav-bracket">[</span>AUTH<span className="nav-bracket">]</span>
      </Link>

      <div className="nav-links">
        {user ? (
          <>
            <span className="nav-role">{user.role}</span>
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
            
            <Link to="/upload" className="nav-link">Upload Image</Link>

            {user.role === 'admin' && (
              <Link to="/admin" className="nav-link nav-admin">Admin</Link>
            )}
            <Link to="/profile" className="nav-link">Profile</Link>
            <button className="nav-logout" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login"  className="nav-link">Login</Link>
            <Link to="/signup" className="nav-link nav-signup">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;