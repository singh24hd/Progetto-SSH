// src/services/authService.js

/**
 * Servizio per gestire l'autenticazione e le operazioni correlate
 */
const AuthService = {
    /**
     * Effettua il login dell'utente
     * @param {string} email - Email dell'utente
     * @param {string} password - Password dell'utente
     * @returns {Promise} Promise con il risultato dell'operazione
     */
    login: async (email, password) => {
      try {
        const response = await fetch('http://localhost:8000/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });
  
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.detail || 'Login fallito');
        }
  
        const data = await response.json();
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('role', data.role);
        
        return { success: true, data };
      } catch (error) {
        console.error('Errore durante il login:', error);
        return { success: false, error: error.message };
      }
    },
  
    /**
     * Effettua il logout dell'utente rimuovendo i dati di sessione
     */
    logout: () => {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      // Reindirizza al login dopo il logout
      window.location.href = '/login';
    },
  
    /**
     * Verifica se l'utente è autenticato
     * @returns {Promise<boolean>} Promise che indica se l'utente è autenticato
     */
    isAuthenticated: async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        return false;
      }
  
      try {
        const response = await fetch('http://localhost:8000/me', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
  
        return response.ok;
      } catch (error) {
        console.error("Errore nella verifica dell'autenticazione:", error);
        return false;
      }
    },
  
    /**
     * Ottiene il token di accesso corrente
     * @returns {string|null} Il token di accesso o null se non autenticato
     */
    getToken: () => {
      return localStorage.getItem('token');
    },
  
    /**
     * Ottiene il ruolo dell'utente corrente
     * @returns {string|null} Il ruolo o null se non autenticato
     */
    getRole: () => {
      return localStorage.getItem('role');
    }
  };
  
  export default AuthService;