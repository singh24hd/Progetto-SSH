import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './signup.css';

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
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
    hashed_password: '' // You'll need to add a password field to your form
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'cap' ? parseInt(value) || '' : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {

      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Registration failed');
      }
      
      const data = await response.json();
      console.log('Registration successful:', data);
      
      // Redirect to email verification page
      navigate('/verificaemail');
      
    } catch (err) {
      console.error('Error during registration:', err);
      setError(err.message || 'Si è verificato un errore. Riprova più tardi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="signup-container">
        <div className="signup-form">
          <h2 className="signup-title">Registrati</h2>
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleSubmit} className="signup-fields">
            <input 
              type="text" 
              name="nome" 
              placeholder="Nome" 
              className="signup-input" 
              value={formData.nome}
              onChange={handleChange}
              required 
            />
            <input 
              type="text" 
              name="cognome" 
              placeholder="Cognome" 
              className="signup-input" 
              value={formData.cognome}
              onChange={handleChange}
              required 
            />
            <input 
              type="date" 
              name="data_nasc" 
              placeholder="Data di Nascita" 
              className="signup-input" 
              value={formData.data_nasc}
              onChange={handleChange}
              required 
            />
            <input 
              type="text" 
              name="luogo_nasc" 
              placeholder="Luogo di Nascita" 
              className="signup-input" 
              value={formData.luogo_nasc}
              onChange={handleChange}
              required 
            />
            <input 
              type="text" 
              name="nazionalità" 
              placeholder="Nazionalità" 
              className="signup-input" 
              value={formData.nazionalità}
              onChange={handleChange}
              required 
            />
            <input 
              type="tel" 
              name="telefono" 
              placeholder="Telefono" 
              className="signup-input" 
              value={formData.telefono}
              onChange={handleChange}
              required 
            />
            <input 
              type="email" 
              name="email" 
              placeholder="Email" 
              className="signup-input" 
              value={formData.email}
              onChange={handleChange}
              required 
            />
            <input 
              type="text" 
              name="indirizzo" 
              placeholder="Indirizzo" 
              className="signup-input" 
              value={formData.indirizzo}
              onChange={handleChange}
              required 
            />
            <input 
              type="text" 
              name="cap" 
              placeholder="CAP" 
              className="signup-input" 
              value={formData.cap}
              onChange={handleChange}
              required 
            />
            <input 
              type="text" 
              name="citta" 
              placeholder="Città" 
              className="signup-input" 
              value={formData.citta}
              onChange={handleChange}
              required 
            />
            <input 
              type="text" 
              name="prov" 
              placeholder="Provincia" 
              className="signup-input" 
              value={formData.prov}
              onChange={handleChange}
              required 
            />
            <input 
              type="text" 
              name="cod_fisc" 
              placeholder="Codice Fiscale" 
              className="signup-input" 
              value={formData.cod_fisc}
              onChange={handleChange}
              required 
            />
            <input 
              type="password" 
              name="hashed_password" 
              placeholder="Password" 
              className="signup-input" 
              value={formData.hashed_password}
              onChange={handleChange}
              required 
            />
            
            <button 
              type="submit" 
              className="signup-button" 
              disabled={loading}
            >
              {loading ? 'Registrazione in corso...' : 'Registrati'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Signup;