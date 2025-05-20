// src/services/authService.js

/**
 * Servizio per gestire l'autenticazione e le operazioni correlate
 */
const BASE_URL = 'http://localhost:8000';

const AuthService = {
  /**
   * Effettua il login dell'utente
   * @param {string} email - Email dell'utente
   * @param {string} password - Password dell'utente
   * @returns {Promise<{ success: boolean, data?: any, error?: string }>}
   */
  login: async (email, password) => {
    try {
      const response = await fetch(`${BASE_URL}/login`, {
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
    window.location.href = '/login';
  },

  /**
   * Verifica se l'utente è autenticato
   * @returns {Promise<false | object>} False se non autenticato, altrimenti i dati utente
   */
  isAuthenticated: async () => {
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
      const response = await fetch(`${BASE_URL}/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.detail || 'Autenticazione fallita');
      }

      return await response.json();
    } catch (error) {
      console.error('Errore di autenticazione:', error);
      localStorage.removeItem('token');
      return false;
    }
  },

  /**
   * Ottiene il token di accesso corrente
   * @returns {string|null}
   */
  getToken: () => localStorage.getItem('token'),

  /**
   * Ottiene il ruolo dell'utente corrente
   * @returns {string|null}
   */
  getRole: () => localStorage.getItem('role'),
};

export default AuthService;
