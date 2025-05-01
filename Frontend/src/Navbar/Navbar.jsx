// src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthService from '../services/authService';
import './Navbar.css'; // Crea questo file CSS per lo stile della navbar

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthStatus = async () => {
      const authenticated = await AuthService.isAuthenticated();
      setIsAuthenticated(authenticated);
      
      if (authenticated) {
        setUserRole(AuthService.getRole());
      }
    };

    checkAuthStatus();
  }, []);

  const handleLogout = () => {
    AuthService.logout();
    setIsAuthenticated(false);
    setUserRole(null);
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">AppScuola</Link>
      </div>
      
      <div className="navbar-menu">
        {isAuthenticated ? (
          <>
            <Link to="/" className="navbar-item">Home</Link>
            <Link to="/profile-page" className="navbar-item">Profilo</Link>
            
            {/* Link specifici per il ruolo */}
            {userRole === 'student' && (
              <>
                <Link to="/channels" className="navbar-item">Channels</Link>
                <Link to="/application" className="navbar-item">Application</Link>
              </>
            )}
            
            {userRole === 'teacher' && (
              <>
                <Link to="/dashboard" className="navbar-item">Dashboard</Link>
                <Link to="/manage-courses" className="navbar-item">Gestione Corsi</Link>
              </>
            )}
            
          </>
        ) : (
          <>
            <Link to="/login" className="navbar-item">Login</Link>
            <Link to="/singup" className="navbar-item">Registrati</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;