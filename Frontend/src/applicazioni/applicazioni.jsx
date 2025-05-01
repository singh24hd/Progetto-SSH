import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar.jsx';
import "./applicazioni.css";

const AppsPage = () => {
  const navigate = useNavigate();
  const [apps] = useState([
    {
      id: 1,
      name: "Duolingo",
      description: "App gamificata per imparare l'italiano con lezioni brevi e divertenti",
      category: "Principiante - Intermedio",
      image_url: "/api/placeholder/300/200",
      rating: 4.7,
      price: "Gratis (con acquisti in app)"
    },
    {
      id: 2,
      name: "Babbel",
      description: "Corsi strutturati con focus su conversazione e grammatica",
      category: "Principiante - Avanzato",
      image_url: "/api/placeholder/300/200",
      rating: 4.5,
      price: "Abbonamento"
    },
    {
      id: 3,
      name: "Memrise",
      description: "App con video di madrelingua e tecniche di memorizzazione",
      category: "Principiante - Intermedio",
      image_url: "/api/placeholder/300/200",
      rating: 4.6,
      price: "Gratis (con premium)"
    },
    {
      id: 4,
      name: "Busuu",
      description: "Comunità di apprendimento con correzioni da madrelingua",
      category: "Principiante - Avanzato",
      image_url: "/api/placeholder/300/200",
      rating: 4.4,
      price: "Abbonamento"
    },
    {
      id: 5,
      name: "Anki",
      description: "Flashcard personalizzabili con sistema di ripetizione spaziata",
      category: "Tutti i livelli",
      image_url: "/api/placeholder/300/200",
      rating: 4.3,
      price: "Gratis"
    },
    {
      id: 6,
      name: "HelloTalk",
      description: "Chat con madrelingua italiani per pratica conversazionale",
      category: "Intermedio - Avanzato",
      image_url: "/api/placeholder/300/200",
      rating: 4.2,
      price: "Gratis (con premium)"
    }
  ]);

  const handleAppClick = (appId) => {
    navigate(`/app/${appId}`);
  };

  return (
    <div className="apps-page">
      <Navbar />
      
      <section className="apps-hero">
        <div className="hero-content">
          <h1>Applicazioni per Imparare</h1>
          <p>Scopri le migliori app per studiare l'italiano su smartphone e tablet</p>
        </div>
      </section>
      
      <section className="apps-section">
        <div className="container">
          <h2>Le nostre applicazioni consigliate</h2>
          <p className="section-description">
            Strumenti selezionati dai nostri insegnanti per aiutarti a praticare l'italiano ovunque
          </p>
          
          <div className="apps-grid">
            {apps.map(app => (
              <div 
                key={app.id} 
                className="app-card"
                onClick={() => handleAppClick(app.id)}
              >
                <div className="app-image">
                  {app.image_url ? (
                    <img src={app.image_url} alt={app.name} />
                  ) : (
                    <div className="app-placeholder">📱</div>
                  )}
                </div>
                <div className="app-info">
                  <h3>{app.name}</h3>
                  <div className="app-category">{app.category}</div>
                  <p>{app.description}</p>
                  <div className="app-details">
                    <span className="app-rating">⭐ {app.rating}/5</span>
                    <span className="app-price">{app.price}</span>
                  </div>
                </div>
              </div>
            ))}
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

export default AppsPage;