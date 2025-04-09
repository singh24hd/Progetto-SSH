import React, { useState } from "react";
import emailjs from "emailjs-com";
import "./verificaemail.css";

function VerificaEmail() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");

  const generateOTP = () => {
    // Funzione per generare un OTP casuale
    return Math.floor(100000 + Math.random() * 900000); // OTP di 6 cifre
  };

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handleOtpChange = (e) => setOtp(e.target.value);

  const sendVerificationEmail = (e) => {
    e.preventDefault();

    // Genera un OTP casuale
    const generatedOtp = generateOTP();
    setOtp(generatedOtp);

    const templateParams = {
      otp: generatedOtp, // Codice OTP generato
      email: email, // L'email dell'utente
    };

    // Invia l'email tramite EmailJS
    emailjs
      .send(
        "service_your_service_id", // Sostituisci con il tuo ID del servizio
        "template_your_template_id", // Sostituisci con il tuo ID del template
        templateParams,
        "user_your_user_id" // Sostituisci con il tuo user ID
      )
      .then(
        (response) => {
          setMessage("Email di verifica inviata con successo!");
          console.log("Success:", response);
        },
        (error) => {
          setMessage("Errore nell'invio dell'email.");
          console.log("Error:", error);
        }
      );
  };

  return (
    <div className="log">
      <div className="log-form">
        <h2>Verifica l'Email</h2>
        <h5>Inserisci il tuo indirizzo email:</h5>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={handleEmailChange}
        />
        <h5>Inserisci il codice OTP:</h5>
        <input
          type="text"
          placeholder="OTP"
          value={otp}
          onChange={handleOtpChange}
        />
        <button className="button" onClick={sendVerificationEmail}>
          Invia email di verifica
        </button>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
}

export default VerificaEmail;
