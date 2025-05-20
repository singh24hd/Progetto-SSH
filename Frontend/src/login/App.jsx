// src/pages/LoginPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/authService';
import './App.css'; // Assicurati di avere questo file CSS

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Controlla se l'utente è già autenticato
  useEffect(() => {
    const checkAuthentication = async () => {
      const isAuthenticated = await AuthService.isAuthenticated();
      if (isAuthenticated) {
        // Se già autenticato, reindirizza alla home
        navigate('/homepage');
      }
    };

    checkAuthentication();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { success, error } = await AuthService.login(formData.email, formData.password);
      
      if (success) {
        navigate('/homepage'); // Reindirizza alla home dopo il login
      } else {
        setError(error || 'Credenziali non valide. Riprova.');
      }
    } catch (err) {
      setError('Si è verificato un errore durante il login. Riprova più tardi.');
      console.error('Errore login:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form-container">
        <h2 className="login-title">Accedi</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="Inserisci la tua email"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="Inserisci la tua password"
            />
          </div>
          
          <button 
            type="submit" 
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? 'Accesso in corso...' : 'Accedi'}
          </button>
        </form>
        
        <div className="login-footer">
          <p>Non hai un account? <span className="register-link" onClick={() => navigate('/singup')}>Registrati</span></p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;