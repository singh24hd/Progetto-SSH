// src/components/Signup.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import emailjs from 'emailjs-com';
import './signup.css';

function Signup() {
  const navigate = useNavigate();
  const [userType, setUserType] = useState('student');
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
    hashed_password: '', 
    codice_insegnante: '',
    lingua_madre: '',
    lingua_secondaria: '',
    livello_italiano: '',
    ruolo: 'studente' // Default role
  });

  // Stato per la gestione dell'OTP
  const [otpInput, setOtpInput] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);

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
    // Basic form validation
    if (!formData.email || !formData.nome || !formData.cognome || !formData.hashed_password) {
      setMessage("Compila tutti i campi obbligatori");
      setMessageType("error");
      return false;
    }
    
    const otp = generateOTP();
    setGeneratedOtp(otp);

    const templateParams = {
      otp: otp,
      email: formData.email,
      nome: formData.nome
    };

    try {
      await emailjs.send(
        "service_5c5lxug",
        "template_d7vkehf",
        templateParams,
        "mBZatMGQrNYu-zw1p"
      );
      setMessage("OTP inviato all'email con successo!");
      setMessageType("success");
      setIsOtpSent(true);
      return true;
    } catch (error) {
      setMessage("Errore nell'invio dell'email.");
      setMessageType("error");
      console.error("Error:", error);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Se l'OTP non è ancora stato inviato
    if (!isOtpSent) {
      await sendVerificationEmail();
      return;
    }

    // Se l'OTP è stato inviato ma non corrisponde
    if (otpInput !== generatedOtp) {
      setMessage("Codice OTP non valido. Riprova.");
      setMessageType("error");
      return;
    }

    // Set the role based on user type
    const updatedFormData = {
      ...formData,
      ruolo: userType === 'teacher' ? 'insegnante' : 'studente',
      // Ensure cap is an integer
      cap: parseInt(formData.cap) || 0
    };

    try {
      console.log("Sending registration data:", updatedFormData);
      
      const response = await fetch("http://localhost:8000/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedFormData),
        //credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Registration failed:", errorData);
        throw new Error(errorData.detail || 'Errore nella registrazione');
      }

      // Registration successful
      const userData = await response.json();
      console.log("Registration successful:", userData);
      
      // Redirect to homepage or login page
      navigate("/login");
    } catch (err) {
      console.error("Registration error:", err);
      setMessage(err.message);
      setMessageType("error");
    }
  };

  const renderStudentFields = () => (
    <>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="nome">Nome</label>
          <input
            type="text"
            id="nome"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            required
            className="signup-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="cognome">Cognome</label>
          <input
            type="text"
            id="cognome"
            name="cognome"
            value={formData.cognome}
            onChange={handleChange}
            required
            className="signup-input"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="data_nasc">Data di nascita</label>
          <input
            type="date"
            id="data_nasc"
            name="data_nasc"
            value={formData.data_nasc}
            onChange={handleChange}
            required
            className="signup-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="luogo_nasc">Luogo di nascita</label>
          <input
            type="text"
            id="luogo_nasc"
            name="luogo_nasc"
            value={formData.luogo_nasc}
            onChange={handleChange}
            required
            className="signup-input"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="nazionalità">Nazionalità</label>
          <input
            type="text"
            id="nazionalità"
            name="nazionalità"
            value={formData.nazionalità}
            onChange={handleChange}
            required
            className="signup-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="telefono">Telefono</label>
          <input
            type="tel"
            id="telefono"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            required
            className="signup-input"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="signup-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="hashed_password">Password</label>
          <input
            type="password"
            id="hashed_password"
            name="hashed_password"
            value={formData.hashed_password}
            onChange={handleChange}
            required
            className="signup-input"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="indirizzo">Indirizzo</label>
          <input
            type="text"
            id="indirizzo"
            name="indirizzo"
            value={formData.indirizzo}
            onChange={handleChange}
            required
            className="signup-input"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="cap">CAP</label>
          <input
            type="text"
            id="cap"
            name="cap"
            value={formData.cap}
            onChange={handleChange}
            required
            className="signup-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="citta">Città</label>
          <input
            type="text"
            id="citta"
            name="citta"
            value={formData.citta}
            onChange={handleChange}
            required
            className="signup-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="prov">Provincia</label>
          <input
            type="text"
            id="prov"
            name="prov"
            value={formData.prov}
            onChange={handleChange}
            required
            className="signup-input"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="cod_fisc">Codice Fiscale</label>
          <input
            type="text"
            id="cod_fisc"
            name="cod_fisc"
            value={formData.cod_fisc}
            onChange={handleChange}
            required
            className="signup-input"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="lingua_madre">Lingua Madre</label>
          <input
            type="text"
            id="lingua_madre"
            name="lingua_madre"
            value={formData.lingua_madre}
            onChange={handleChange}
            required
            className="signup-input"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="lingua_secondaria">Lingua secondaria</label>
          <input
            type="text"
            id="lingua_secondaria"
            name="lingua_secondaria"
            value={formData.lingua_secondaria}
            onChange={handleChange}
            required
            className="signup-input"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="livello_italiano">Livello Italiano</label>
          <input
            type="text"
            id="livello_italiano"
            name="livello_italiano"
            value={formData.livello_italiano}
            onChange={handleChange}
            required
            className="signup-input"
          />
        </div>
      </div>
    </>
  );

  const renderTeacherFields = () => (
    <>
      {renderStudentFields()}
      
      <div className="teacher-code">
        <h3>Informazioni Insegnante</h3>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="codice_insegnante">Codice Insegnante</label>
            <input
              type="text"
              id="codice_insegnante"
              name="codice_insegnante"
              value={formData.codice_insegnante}
              onChange={handleChange}
              required
              className="signup-input"
              placeholder="Inserisci il codice fornito dalla scuola"
            />
          </div>
        </div>
      </div>
    </>
  );

  const renderOtpSection = () => (
    <div className="otp-section">
      <h2>Verifica Email</h2>
      <p>Abbiamo inviato un codice di verifica all'indirizzo email: {formData.email}</p>
      
      <div className="otp-field">
        <label htmlFor="otp">Inserisci il codice di verifica</label>
        <input
          type="text"
          id="otp"
          className="otp-input"
          placeholder="000000"
          value={otpInput}
          onChange={(e) => setOtpInput(e.target.value)}
          maxLength={6}
        />
        <p className="otp-message">Il codice scadrà tra 10 minuti</p>
      </div>
      
      <button className="signup-button" onClick={handleSubmit}>
        Verifica e Completa Registrazione
      </button>
    </div>
  );

  return (
    <div className="signup-container">
      {!isOtpSent ? (
        <>
          <div className="signup-header">
            <h1>Registrati</h1>
            <p>Unisciti alla nostra piattaforma di apprendimento</p>
          </div>

          <div className="signup-tab-container">
            <button 
              className={`signup-tab ${userType === 'student' ? 'active' : ''}`}
              onClick={() => setUserType('student')}
            >
              Studente
            </button>
            <button 
              className={`signup-tab ${userType === 'teacher' ? 'active' : ''}`}
              onClick={() => setUserType('teacher')}
            >
              Insegnante
            </button>
          </div>

          <div className="signup-form-container">
            <div className="signup-form">
              <h2>{userType === 'student' ? 'Registrazione Studente' : 'Registrazione Insegnante'}</h2>
              
              {message && <p className={`message ${messageType === 'error' ? 'error-message' : 'success-message'}`}>{message}</p>}
              
              <form onSubmit={handleSubmit}>
                {userType === 'student' ? renderStudentFields() : renderTeacherFields()}
                
                <button className="signup-button" type="submit">
                  Continua
                </button>
              </form>
            </div>
            
            <div className="login-link">
              Hai già un account? <Link to="/login">Accedi qui</Link>
            </div>
          </div>
        </>
      ) : (
        renderOtpSection()
      )}
    </div>
  );
}

export default Signup;