import React, { useState, useEffect } from 'react';
import './ProfilePage.css';

const ProfilePage = () => {
  // Stato iniziale con tutti i campi vuoti
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
    cod_fisc: ''
  });

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      console.log("Token usato:", token); // Debug
    
      try {
        const response = await fetch('http://localhost:8000/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
    
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
    
        const data = await response.json();
        console.log("Dati utente:", data); // Debug
        setUser(data);
        
      } catch (error) {
        console.error("Errore fetch:", error);
        localStorage.removeItem('token'); // Pulizia token non valido
        navigate('/login');
      }
    };
  
    fetchUserData();
  }, []);

  return (
    <div className="signup-container">
      <div className="signup-form">
        <h2 className="signup-title">Profilo Personale</h2>
        <div className="signup-fields">
          <div><strong>Nome:</strong> {user.nome}</div>
          <div><strong>Cognome:</strong> {user.cognome}</div>
          <div><strong>Data di Nascita:</strong> {user.data_nasc}</div>
          <div><strong>Luogo di Nascita:</strong> {user.luogo_nasc}</div>
          <div><strong>Nazionalità:</strong> {user.nazionalità}</div>
          <div><strong>Telefono:</strong> {user.telefono}</div>
          <div><strong>Email:</strong> {user.email}</div>
          <div><strong>Indirizzo:</strong> {user.indirizzo}</div>
          <div><strong>CAP:</strong> {user.cap}</div>
          <div><strong>Città:</strong> {user.citta}</div>
          <div><strong>Provincia:</strong> {user.prov}</div>
          <div><strong>Codice Fiscale:</strong> {user.cod_fisc}</div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
