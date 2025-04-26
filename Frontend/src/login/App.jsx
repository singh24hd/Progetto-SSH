import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './App.css';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      setError('');
      
      // Validazione di base
      if (!email || !password) {
        setError('Email e password sono obbligatorie');
        return;
      }

      const response = await fetch('http://localhost:8000/login', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: email.trim(),
          password: password 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.detail || 'Login fallito');
        console.error('Errore login:', data);
        return;
      }

      // Debug completo della risposta
      console.log('Risposta login:', {
        status: response.status,
        data: data,
        headers: Object.fromEntries(response.headers.entries())
      });

      // Salvataggio sicuro del token
      if (data.access_token) {
        localStorage.setItem('token', data.access_token);
        console.log('Token JWT salvato:', {
          token: data.access_token,
          role: data.role,
          expiry: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 ore
        });
        
        // Reindirizzamento basato sul ruolo
        const redirectPath = data.role === 'student' 
          ? '/homepage' 
          : '/teacher-dashboard';
        
        navigate(redirectPath, { replace: true });
      } else {
        throw new Error('Token non ricevuto dal server');
      }
    } catch (error) {
      console.error('Errore durante il login:', error);
      setError('Errore di connessione al server');
      localStorage.removeItem('token'); // Pulizia in caso di errore
    }
  };

  return (
    <div className="log">
      <div className="log-form">
        <h2>Log in</h2>
        
        {error && (
          <div className="error-message" style={{ color: 'red', marginBottom: '15px' }}>
            {error}
          </div>
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="username"
          required
        />
        
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />
        
        <div style={{ marginTop: '20px' }}>
          <button 
            className="button" 
            onClick={handleLogin}
            disabled={!email || !password}
          >
            Log in
          </button>

          <Link to="/signup" style={{ marginLeft: '10px' }}>
            <button className="button">Sign Up</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;