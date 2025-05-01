import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar.jsx';
import "./channels.css";

const ChannelsPage = () => {
  const navigate = useNavigate();
  const [channels] = useState([
    {
      id: 1,
      name: "Italiano per Principianti",
      description: "Lezioni base di italiano per livelli A1-A2",
      image_url: "/api/placeholder/300/200",
      subscribers_count: 12500,
      videos_count: 120
    },
    {
      id: 2,
      name: "Conversazione Italiana",
      description: "Esercizi di conversazione per livelli B1-B2",
      image_url: "/api/placeholder/300/200",
      subscribers_count: 8700,
      videos_count: 85
    },
    {
      id: 3,
      name: "Grammatica Avanzata",
      description: "Approfondimenti grammaticali per livello C1",
      image_url: "/api/placeholder/300/200",
      subscribers_count: 4300,
      videos_count: 65
    },
    {
      id: 4,
      name: "Cultura Italiana",
      description: "Video sulla cultura e tradizioni italiane",
      image_url: "/api/placeholder/300/200",
      subscribers_count: 15600,
      videos_count: 95
    },
    {
      id: 5,
      name: "Preparazione CILS",
      description: "Materiali per la preparazione all'esame CILS",
      image_url: "/api/placeholder/300/200",
      subscribers_count: 6800,
      videos_count: 42
    },
    {
      id: 6,
      name: "Italiano per il Lavoro",
      description: "Vocabolario e situazioni lavorative",
      image_url: "/api/placeholder/300/200",
      subscribers_count: 9100,
      videos_count: 78
    }
  ]);

  const handleChannelClick = (channelId) => {
    navigate(`/channel/${channelId}`);
  };

  return (
    <div className="channels-page">
      <Navbar />
      
      <section className="channels-hero">
        <div className="hero-content">
          <h1>Canali Didattici</h1>
          <p>Scopri la nostra selezione di canali YouTube per imparare l'italiano</p>
        </div>
      </section>
      
      <section className="channels-section">
        <div className="container">
          <h2>I nostri canali consigliati</h2>
          <p className="section-description">
            Video selezionati dai nostri insegnanti per aiutarti a migliorare il tuo italiano
          </p>
          
          <div className="channels-grid">
            {channels.map(channel => (
              <div 
                key={channel.id} 
                className="channel-card"
                onClick={() => handleChannelClick(channel.id)}
              >
                <div className="channel-image">
                  {channel.image_url ? (
                    <img src={channel.image_url} alt={channel.name} />
                  ) : (
                    <div className="channel-placeholder">📺</div>
                  )}
                </div>
                <div className="channel-info">
                  <h3>{channel.name}</h3>
                  <p>{channel.description}</p>
                  <div className="channel-stats">
                    <span>👥 {channel.subscribers_count.toLocaleString()}</span>
                    <span>📹 {channel.videos_count}</span>
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

export default ChannelsPage;