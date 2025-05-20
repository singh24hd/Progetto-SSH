import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProfilePage.css';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    nome: '',
    cognome: '',
    data_nasc: '',
    luogo_nasc: '',
    nazionalità: '',
    telefono: '',
    email: '',
    indirizzo: '',
    cap: '',
    citta: '',
    prov: '',
    cod_fisc: '',
    role: '',
    lingua_madre: '',
    lingua_secondaria: '',
    livello_italiano: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.error("No token found");
        navigate('/login');
        return;
      }
      
      try {
        const response = await fetch('http://localhost:8000/me', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          credentials: 'include' // Include cookies if any
        });
        
        if (response.status === 401) {
          // Unauthorized - token invalid or expired
          console.error("Unauthorized access - redirecting to login");
          localStorage.removeItem('token');
          navigate('/login');
          return;
        }
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("User data retrieved:", data);
        setUser(data);
        setError(null);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Failed to load profile data. Please try again later.");
        
        // Only redirect to login for authentication errors
        if (error.message.includes('401')) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserData();
  }, [navigate]);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch (e) {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <div className="signup-container">
        <div className="signup-form">
          <h2 className="signup-title">Caricamento profilo...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="signup-container">
        <div className="signup-form">
          <h2 className="signup-title">Errore</h2>
          <div className="error-message">{error}</div>
          <button 
            className="button" 
            onClick={() => navigate('/login')}
          >
            Torna al login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="signup-container">
      <div className="signup-form">
        <h2 className="signup-title">Profilo Personale</h2>
        <div className="signup-fields">
          <div><strong>Nome:</strong> {user.nome}</div>
          <div><strong>Cognome:</strong> {user.cognome}</div>
          <div><strong>Data di Nascita:</strong> {formatDate(user.data_nasc)}</div>
          <div><strong>Luogo di Nascita:</strong> {user.luogo_nasc}</div>
          <div><strong>Nazionalità:</strong> {user.nazionalità}</div>
          <div><strong>Telefono:</strong> {user.telefono}</div>
          <div><strong>Email:</strong> {user.email}</div>
          <div><strong>Indirizzo:</strong> {user.indirizzo}</div>
          <div><strong>CAP:</strong> {user.cap}</div>
          <div><strong>Città:</strong> {user.citta}</div>
          <div><strong>Provincia:</strong> {user.prov}</div>
          <div><strong>Codice Fiscale:</strong> {user.cod_fisc}</div>
          <div><strong>Ruolo:</strong> {user.role === 'student' ? 'Studente' : 'Insegnante'}</div>
          <div><strong>Lingua Madre:</strong> {user.lingua_madre}</div>
          <div><strong>Lingua Secondaria:</strong> {user.lingua_secondaria}</div>
          <div><strong>Livello Italiano:</strong> {user.livello_italiano}</div>
        </div>
        <div className="button-container">
          <button 
            className="button"
            onClick={() => navigate('/homepage')}
          >
            Home
          </button>
          <button 
            className="button" 
            onClick={() => {
              localStorage.removeItem('token');
              navigate('/login');
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;