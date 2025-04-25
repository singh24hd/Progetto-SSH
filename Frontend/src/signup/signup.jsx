import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import emailjs from 'emailjs-com';
import './signup.css';

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nome: '', cognome: '', data_nasc: '', luogo_nasc: '', nazionalità: '',
    telefono: '', email: '', indirizzo: '', cap: '', citta: '', prov: '',
    cod_fisc: '', hashed_password: '', codice_insegnante: ''
  });

  // Stato per la gestione dell'OTP
  const [otpInput, setOtpInput] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState(null);
  const [message, setMessage] = useState("");
  const [showOtpField, setShowOtpField] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'cap' ? parseInt(value) || '' : value
    }));
  };

  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const sendVerificationEmail = async () => {
    const otp = generateOTP();
    setGeneratedOtp(otp);

    const templateParams = {
      otp: otp,
      email: formData.email,
    };

    try {
      await emailjs.send(
        "service_5c5lxug",
        "template_d7vkehf",
        templateParams,
        "mBZatMGQrNYu-zw1p"
      );
      setMessage("OTP inviato all'email con successo!");
      setShowOtpField(true);
    } catch (error) {
      setMessage("Errore nell'invio dell'email.");
      console.error("Error:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Se l'OTP non è ancora stato verificato
    if (showOtpField && otpInput !== generatedOtp) {
      setMessage("Per favore, verifica il codice OTP prima di procedere.");
      return;
    }

    // Se non è ancora stato inviato l'OTP
    if (!showOtpField) {
      await sendVerificationEmail();
      return;
    }

    // Se l'OTP è corretto, procedi con la registrazione
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

      navigate("/homepage");
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
            <input
              key={name}
              type={type}
              name={name}
              placeholder={placeholder}
              value={formData[name]}
              onChange={handleChange}
              required={name !== 'codice_insegnante'}
              className="signup-input"
            />
          ))}

          {showOtpField && (
            <div className="otp-field">
              <input
                type="text"
                placeholder="Inserisci OTP"
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value)}
                className="signup-input"
              />
              <p className="otp-message">Controlla la tua email per il codice OTP</p>
            </div>
          )}

          {message && <p className="message">{message}</p>}

          <button className="signup-button" type="submit">
            {showOtpField ? "Completa Registrazione" : "Registrati"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Signup;