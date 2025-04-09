import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './signup.css';

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nome: '', cognome: '', data_nasc: '', luogo_nasc: '', nazionalità: '',
    telefono: '', email: '', indirizzo: '', cap: '', citta: '', prov: '',
    cod_fisc: '', hashed_password: '', codice_insegnante: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'cap' ? parseInt(value) || '' : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ruolo = formData.codice_insegnante === 'ABC123' ? 'insegnante' : 'studente';

    const body = {
      ...formData,
      ruolo,
    };

    try {
      const response = await fetch("http://localhost:8000/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Errore nella registrazione');
      }

      const data = await response.json();
      if (data.ruolo === "insegnante") {
        navigate("/homepage");
      } else {
        navigate("/homepage");
      }
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-form">
        <h2>Registrazione</h2>
        <form onSubmit={handleSubmit}>
          {[
            ["nome", "Nome"], ["cognome", "Cognome"], ["data_nasc", "Data di nascita", "date"],
            ["luogo_nasc", "Luogo di nascita"], ["nazionalità", "Nazionalità"],
            ["telefono", "Telefono"], ["email", "Email", "email"], ["indirizzo", "Indirizzo"],
            ["cap", "CAP"], ["citta", "Città"], ["prov", "Provincia"], ["cod_fisc", "Codice Fiscale"],
            ["hashed_password", "Password", "password"], ["codice_insegnante", "Codice Insegnante (opzionale)"]
          ].map(([name, placeholder, type = "text"]) => (
            <input key={name} type={type} name={name} placeholder={placeholder}
              value={formData[name]} onChange={handleChange} required={name !== 'codice_insegnante'}
              className="signup-input" />
          ))}
          <button className="signup-button" type="submit">Registrati</button>
        </form>
      </div>
    </div>
  );
}

export default Signup;
