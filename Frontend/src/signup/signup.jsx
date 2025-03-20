import { Link } from 'react-router-dom'
import './signup.css';

function Signup() {
  return (
    <>
      <div className="signup-container">
        <div className="signup-form">
          <h2 className="signup-title">Registrati</h2>
          <div className="signup-fields">
            
            <input type="text" placeholder="Nome" className="signup-input" required />
            <input type="text" placeholder="Cognome" className="signup-input" required />
            <input type="date" placeholder="Data di Nascita" className="signup-input" required />
            <input type="text" placeholder="Luogo di Nascita" className="signup-input" required />
            <input type="text" placeholder="Nazionalità" className="signup-input" required />
            <input type="tel" placeholder="Telefono" className="signup-input" required />
            <input type="email" placeholder="Email" className="signup-input" required />
            <input type="text" placeholder="Indirizzo" className="signup-input" required />
            <input type="text" placeholder="CAP" className="signup-input" required />
            <input type="text" placeholder="Città" className="signup-input" required />
            <input type="text" placeholder="Provincia" className="signup-input" required />
            <input type="text" placeholder="Codice Fiscale" className="signup-input" required />
            
            <Link to="/verificaemail">
            <button className="signup-button">Registrati</button>
            </Link>
            
          </div>
        </div>
      </div>
    </>
  );
}

export default Signup;
