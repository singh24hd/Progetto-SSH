import React, { useState } from "react";
import emailjs from "emailjs-com";
import "./verificaemail.css";

function VerificaEmail() {
  const [email, setEmail] = useState("");
  const [otpInput, setOtpInput] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState(null);
  const [message, setMessage] = useState("");
  const [step, setStep] = useState(1); // 1 = inserimento email, 2 = verifica OTP

  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // OTP a 6 cifre come stringa
  };

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handleOtpInputChange = (e) => setOtpInput(e.target.value);

  const sendVerificationEmail = (e) => {
    e.preventDefault();
    const otp = generateOTP();
    setGeneratedOtp(otp);

    const templateParams = {
      otp: otp,
      email: email,
    };

    emailjs
      .send(
        "service_5c5lxug",      // <-- Sostituisci con il tuo ID
        "template_d7vkehf",    // <-- Sostituisci con il tuo ID
        templateParams,
        "mBZatMGQrNYu-zw1p"             // <-- Sostituisci con il tuo ID
      )
      .then(
        (response) => {
          setMessage("OTP inviato all'email con successo!");
          setStep(2); // Passa al secondo step (verifica OTP)
          console.log("Success:", response);
        },
        (error) => {
          setMessage("Errore nell'invio dell'email.");
          console.log("Error:", error);
        }
      );
  };

  const verifyOtp = (e) => {
    e.preventDefault();
    if (otpInput === generatedOtp) {
      setMessage("Verifica completata con successo!");
      setTimeout(() => {
        navigate("/homepage"); // Reindirizza dopo un breve ritardo
      }, 1000); // opzionale: 1 secondo di delay per mostrare il messaggio
    } else {
      setMessage("OTP non valido. Riprova.");
    }
  };
  return (
    <div className="log">
      <div className="log-form">
        <h2>Verifica l'Email</h2>

        {step === 1 && (
          <>
            <h5>Inserisci il tuo indirizzo email:</h5>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={handleEmailChange}
              className="form-input"
            />
            <button className="form-button" onClick={sendVerificationEmail}>
              Invia email di verifica
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <h5>Inserisci il codice OTP ricevuto:</h5>
            <input
              type="text"
              placeholder="OTP"
              value={otpInput}
              onChange={handleOtpInputChange}
              className="form-input"
            />
            <button className="form-button" onClick={verifyOtp}>
              Verifica OTP
            </button>
          </>
        )}

        {message && <p>{message}</p>}
      </div>
    </div>
  );
}

export default VerificaEmail;
