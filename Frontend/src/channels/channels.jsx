import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar.jsx';
import './channels.css';

const ChannelsPage = () => {
  const navigate = useNavigate();
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [voting, setVoting] = useState({});
  const [votedChannels, setVotedChannels] = useState(() => {
    const saved = localStorage.getItem('votedChannels');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Token non trovato. Effettua il login.');
        }

        const response = await fetch('http://localhost:8000/channels/by-language/', {
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

  const handleVote = async (channelId, increment) => {
    if (votedChannels.includes(channelId)) {
      setError('Hai già votato per questo canale');
      return;
    }

    try {
      setVoting(prev => ({...prev, [channelId]: true}));
      
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/channels/${channelId}/rate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ increment }),
      });

      if (!response.ok) throw new Error('Errore durante la votazione');

      setChannels(prevChannels => 
        prevChannels.map(channel => 
          channel.id === channelId ? {...channel, rating: channel.rating + increment} : channel
        )
      );
      
      const newVotedChannels = [...votedChannels, channelId];
      setVotedChannels(newVotedChannels);
      localStorage.setItem('votedChannels', JSON.stringify(newVotedChannels));
    } catch (err) {
      setError(err.message);
    } finally {
      setVoting(prev => ({...prev, [channelId]: false}));
    }
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
                >
                  <div className="channel-image">
                    {channel.image_url ? (
                      <img src={channel.image_url} alt={channel.nome} />
                    ) : (
                      <div className="channel-placeholder">📺</div>
                    )}
                  </div>
                  <div className="channel-info">
                    <h3>
                      <a
                        href={channel.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="channel-link"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {channel.nome}
                      </a>
                    </h3>
                    <p>{channel.descrizione}</p>
                    <div className="channel-stats">
                      <span>🌍 {channel.lingua}</span>
                      <div className="rating-controls">
                        <button
                          onClick={() => handleVote(channel.id, -1)}
                          disabled={voting[channel.id] || votedChannels.includes(channel.id)}
                          className="vote-button"
                        >
                          👎
                        </button>
                        <span className="rating-value">⭐ {channel.rating}</span>
                        <button
                          onClick={() => handleVote(channel.id, 1)}
                          disabled={voting[channel.id] || votedChannels.includes(channel.id)}
                          className="vote-button"
                        >
                          👍
                        </button>
                      </div>
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

          <div className="footer-social">
            <h4>Seguici sui social</h4>
            <div className="social-icons">
              <a href="#"><i className="fab fa-facebook"></i></a>
              <a href="#"><i className="fab fa-twitter"></i></a>
              <a href="#"><i className="fab fa-instagram"></i></a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Scuola Penny Wirton. Tutti i diritti riservati.</p>
          <p>
            <a href="/privacy">Privacy Policy</a> | 
            <a href="/termini">Termini d'uso</a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ChannelsPage;