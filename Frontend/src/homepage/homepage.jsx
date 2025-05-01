import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar.jsx';
import "./HomePage.css";

const HomePage = () => {
  const navigate = useNavigate();
  const [language, setLanguage] = useState('');
  const [level, setLevel] = useState('');

  const handleStartLearning = () => {
    if (language && level) {
      navigate(`/risorse?lingua=${language}&livello=${level}`);
    } else {
      alert('Per favore, seleziona la tua lingua madre e il livello di italiano.');
    }
  };

  return (
    <div className="home-page">
      <Navbar />
      
      <section className="hero">
        <div className="hero-content">
          <h1>Benvenuti a Scuola Digitale</h1>
          <h2>Il portale digitale della Scuola Penny Wirton</h2>
          <p>Impara l'italiano gratuitamente con risorse personalizzate in base al tuo livello e alla tua lingua madre</p>
          
          <div className="start-learning">
            <div className="select-group">
              <select 
                value={language} 
                onChange={(e) => setLanguage(e.target.value)}
                className="select-input"
              >
                <option value="">Seleziona la tua lingua madre</option>
                <option value="english">English</option>
                <option value="français">Français</option>
                <option value="español">Español</option>
                <option value="العربية">العربية</option>
                <option value="中文">中文</option>
                <option value="українська">Українська</option>
                <option value="română">Română</option>
                <option value="বাংলা">বাংলা</option>
                <option value="altro">Altro</option>
              </select>
              
              <select 
                value={level} 
                onChange={(e) => setLevel(e.target.value)}
                className="select-input"
              >
                <option value="">Seleziona il tuo livello di italiano</option>
                <option value="A1">Principiante (A1)</option>
                <option value="A2">Elementare (A2)</option>
                <option value="B1">Intermedio (B1)</option>
                <option value="B2">Intermedio superiore (B2)</option>
                <option value="C1">Avanzato (C1)</option>
              </select>
            </div>
            
            <button onClick={handleStartLearning} className="start-button">
              Inizia a imparare →
            </button>
          </div>
        </div>
      </section>
      
      <section className="features">
        <h2>Come funziona la nostra piattaforma</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <span className="icon-text">🌍</span>
            </div>
            <h3>Contenuti personalizzati</h3>
            <p>Risorse didattiche selezionate in base alla tua lingua madre e al tuo livello di italiano</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <span className="icon-text">📺</span>
            </div>
            <h3>Video lezioni</h3>
            <p>Video tutorial su YouTube selezionati dai nostri insegnanti per migliorare le tue competenze linguistiche</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <span className="icon-text">📱</span>
            </div>
            <h3>App consigliate</h3>
            <p>Applicazioni interattive per praticare l'italiano a casa o in movimento</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <span className="icon-text">📚</span>
            </div>
            <h3>Materiale didattico</h3>
            <p>Esercizi, schede grammaticali e letture per tutti i livelli</p>
          </div>
        </div>
      </section>
      
      <section className="about">
        <div className="about-content">
          <div className="about-text">
            <h2>Chi siamo</h2>
            <p>La <strong>Scuola Penny Wirton</strong> è un'associazione che offre corsi gratuiti di italiano per stranieri, fondata da Eraldo Affinati e Anna Luce Lenzi.</p>
            <p>La nostra missione è promuovere l'integrazione attraverso l'insegnamento della lingua italiana con un approccio personalizzato, senza classi e con insegnamento uno a uno.</p>
            <p>Con <strong>Scuola Digitale</strong>, portiamo questa filosofia online, offrendo risorse didattiche personalizzate per continuare l'apprendimento dell'italiano anche a casa.</p>
            <a href="https://www.scuolapennywirton.it/" target="_blank" rel="noopener noreferrer" className="learn-more">
              Scopri di più sulla Scuola Penny Wirton
            </a>
          </div>
          
          <div className="about-image">
            <img src="/api/placeholder/500/400" alt="Scuola Penny Wirton" />
          </div>
        </div>
      </section>
      
      <section className="testimonials">
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

export default HomePage;