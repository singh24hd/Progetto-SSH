import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './App.css'; // Se hai un CSS dedicato

function LoginPage() {
  const [email, setEmail] = useState('');  // Cambiato da username a email
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:8000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),  // Passiamo email al posto di username
      });

      if (!response.ok) {
        alert("Login failed");
        return;
      }

      const data = await response.json();

      // Salviamo il token o info utente se necessario
      localStorage.setItem("token", data.access_token);

      if (data.role === 'student') {
        navigate('/homepage');
      } else if (data.role === 'teacher') {
        navigate('/teacher-dashboard');
      } else {
        alert("Unknown role");
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Error logging in');
    }
  };

  return (
    <div className="log">
      <div className="log-form">
        <h2>Log in</h2>
        <input
          type="email"  // Cambiato il tipo da text a email per una validazione del formato email
          placeholder="Email"
          value={email}  // Utilizziamo email invece di username
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <div>
          <button className="button" onClick={handleLogin}>
            Log in
          </button>

          <Link to="/signup">
            <button className="button">Sign Up</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
