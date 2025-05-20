import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar.jsx';
import "./dashbord.css";

const DashBoard = () => {
  const navigate = useNavigate();


  return (
    <div className="dashbord">
      <Navbar />
      <section className="selzione-studente">
        <div className="about-content">
          
      
        </div>
      </section>
      
      <section className="studneti-presi">
        <h2>Le esperienze dei nostri studenti</h2>
        <div className="testimonials-container">
          <div className="testimonial">
            <p>"Grazie alla Scuola Digitale, posso continuare a studiare italiano anche quando non sono a lezione. I video consigliati in arabo mi hanno aiutato tantissimo!"</p>
            <p className="testimonial-author">- Fatima, dalla Siria</p>
          </div>
          
          <div className="testimonial">
            <p>"Le applicazioni consigliate sono molto utili e divertenti. Ora studio italiano ogni giorno sul mio telefono durante il viaggio verso il lavoro."</p>
            <p className="testimonial-author">- Andrei, dalla Romania</p>
          </div>
          
          <div className="testimonial">
            <p>"I materiali sono perfetti per il mio livello. È come avere un insegnante che sa esattamente di cosa ho bisogno per migliorare il mio italiano."</p>
            <p className="testimonial-author">- Mei, dalla Cina</p>
          </div>
        </div>
      </section>
      
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-logo">
            <h3>Scuola Digitale</h3>
            <p>Un progetto della Scuola Penny Wirton</p>
          </div>
          
          <div className="footer-links">
            <h4>Collegamenti utili</h4>
            <ul>
              <li><a href="https://www.scuolapennywirton.it/">Sito ufficiale Penny Wirton</a></li>
              <li><a href="/chi-siamo">Chi siamo</a></li>
              <li><a href="/contatti">Contatti</a></li>
              <li><a href="/donazioni">Sostienici</a></li>
            </ul>
          </div>
          
          <div className="footer-info">
            <h4>Contatti</h4>
            <p>Email: info@scuoladigitale.it</p>
            <p>Telefono: +39 06 123456</p>
            <p>Indirizzo: Via Roma 123, Roma</p>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Scuola Penny Wirton. Tutti i diritti riservati.</p>
        </div>
        </footer>
      </div>
  );
};

export default DashBoard;