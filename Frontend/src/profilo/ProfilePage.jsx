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
      try {
        const token = localStorage.getItem('token');  // Recupera il token da localStorage
        console.log("Token letto da localStorage:", token);
        
        if (!token) {
          console.error('Token non trovato!');
          return;
        }
  
        const response = await fetch('http://localhost:8000/me', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,  // Invia il token nel formato Bearer
          },
        });
  
        if (!response.ok) {
          throw new Error('Errore nel recupero dei dati utente');
        }
  
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error('Errore nel recupero dei dati utente:', error);
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
