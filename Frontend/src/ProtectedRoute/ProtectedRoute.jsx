// src/components/ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';

/**
 * Componente per proteggere le rotte che richiedono autenticazione
 * Reindirizza gli utenti non autenticati al login
 */
const ProtectedRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Funzione per verificare l'autenticazione dell'utente
    const checkAuth = async () => {
      setIsLoading(true);
      const token = localStorage.getItem('token');

      if (!token) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      try {
        // Verifica la validità del token con una chiamata al backend
        const response = await fetch('http://localhost:8000/me', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          // Token non valido o scaduto
          console.warn("Token non valido, reindirizzamento al login");
          localStorage.removeItem('token');
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Errore nella verifica dell'autenticazione:", error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Mostra un indicatore di caricamento mentre si verifica l'autenticazione
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-message">Verifica autenticazione...</div>
      </div>
    );
  }

  // Se autenticato, mostra il contenuto della rotta, altrimenti reindirizza al login
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;