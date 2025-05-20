import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar.jsx';
import './channels.css';

const ChannelsPage = () => {
  const navigate = useNavigate();
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Token non trovato. Effettua il login.');
        }

        const response = await fetch('/channels/by-language/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Errore nel recupero dei canali.');
        }

        const data = await response.json();
        setChannels(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchChannels();
  }, []);

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

          {loading ? (
            <p>Caricamento in corso...</p>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : (
            <div className="channels-grid">
              {channels.map((channel) => (
                <div
                  key={channel.id}
                  className="channel-card"
                  onClick={() => handleChannelClick(channel.id)}
                >
                  <div className="channel-image">
                    {channel.image_url ? (
                      <img src={channel.image_url} alt={channel.nome} />
                    ) : (
                      <div className="channel-placeholder">📺</div>
                    )}
                  </div>
                  <div className="channel-info">
                    <h3>{channel.nome}</h3>
                    <p>{channel.descrizione}</p>
                    <div className="channel-stats">
                      <span>🌍 {channel.lingua}</span>
                      <span>⭐ {channel.rating}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
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
              <li>
                <a href="https://www.scuolapennywirton.it/">Sito ufficiale Penny Wirton</a>
              </li>
              <li>
                <a href="/chi-siamo">Chi siamo</a>
              </li>
              <li>
                <a href="/contatti">Contatti</a>
              </li>
              <li>
                <a href="/donazioni">Sostienici</a>
              </li>
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
