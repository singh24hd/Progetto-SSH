import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditStudent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState({
    nome: '',
    cognome: '',
    email: '',
    telefono: '',
    indirizzo: '',
    cap: '',
    citta: '',
    prov: '',
    lingua_madre: '',
    lingua_secondaria: '',
    livello_italiano: '',
    cod_fisc: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');

  // Set up authorization header for API requests
  const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  useEffect(() => {
    // Fetch student details
    const fetchStudent = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // First try a direct endpoint for single student if available
        try {
          const res = await axios.get(`/studenti/${id}`, getAuthHeader());
          if (res.data) {
            setStudent(res.data);
            setLoading(false);
            return;
          }
        } catch (directErr) {
          console.log("Direct student endpoint not available, falling back to list", directErr);
          // Continue to fallback method
        }
        
        // Fallback: filter from the list
        const res = await axios.get(`/studenti-list`, getAuthHeader());
        
        // Process API response - this assumes it returns an array
        const studentArray = Array.isArray(res.data) ? res.data : [];
        const foundStudent = studentArray.find(s => s.id === parseInt(id));
        
        if (foundStudent) {
          setStudent(foundStudent);
        } else {
          setError('Studente non trovato');
        }
      } catch (err) {
        console.error('Error fetching student:', err);
        setError('Errore nel caricamento dei dati dello studente');
        
        if (err.response?.status === 401) {
          alert('Sessione scaduta. Effettuare nuovamente il login.');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudent(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      setSuccess('');
      
      // Send update request to the backend
      await axios.put(`/studenti/${id}`, student, getAuthHeader());
      
      setSuccess('Studente aggiornato con successo!');
      // Redirect after success
      setTimeout(() => navigate('/studenti'), 2000);
      
    } catch (err) {
      console.error('Error updating student:', err);
      setError(err.response?.data?.detail || 'Errore nell\'aggiornamento dello studente');
      
      if (err.response?.status === 401) {
        alert('Sessione scaduta. Effettuare nuovamente il login.');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Caricamento...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="features">
      <h2>Modifica Studente</h2>
      
      {success && <div className="success-message">{success}</div>}
      
      <form onSubmit={handleSubmit} className="edit-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="nome">Nome</label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={student.nome || ''}
              onChange={handleChange}
              required
              className="form-control"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="cognome">Cognome</label>
            <input
              type="text"
              id="cognome"
              name="cognome"
              value={student.cognome || ''}
              onChange={handleChange}
              required
              className="form-control"
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
              value={student.email || ''}
              onChange={handleChange}
              required
              className="form-control"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="telefono">Telefono</label>
            <input
              type="tel"
              id="telefono"
              name="telefono"
              value={student.telefono || ''}
              onChange={handleChange}
              required
              className="form-control"
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
              value={student.indirizzo || ''}
              onChange={handleChange}
              required
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label htmlFor="cap">CAP</label>
            <input
              type="text"
              id="cap"
              name="cap"
              value={student.cap || ''}
              onChange={handleChange}
              required
              className="form-control"
            />
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="citta">Città</label>
            <input
              type="text"
              id="citta"
              name="citta"
              value={student.citta || ''}
              onChange={handleChange}
              required
              className="form-control"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="prov">Provincia</label>
            <input
              type="text"
              id="prov"
              name="prov"
              value={student.prov || ''}
              onChange={handleChange}
              required
              className="form-control"
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
              value={student.lingua_madre || ''}
              onChange={handleChange}
              required
              className="form-control"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="lingua_secondaria">Lingua Secondaria</label>
            <input
              type="text"
              id="lingua_secondaria"
              name="lingua_secondaria"
              value={student.lingua_secondaria || ''}
              onChange={handleChange}
              className="form-control"
            />
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="livello_italiano">Livello Italiano</label>
            <select
              id="livello_italiano"
              name="livello_italiano"
              value={student.livello_italiano || ''}
              onChange={handleChange}
              required
              className="form-control"
            >
              <option value="">Seleziona Livello</option>
              <option value="A1">A1</option>
              <option value="A2">A2</option>
              <option value="B1">B1</option>
              <option value="B2">B2</option>
              <option value="C1">C1</option>
              <option value="C2">C2</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="cod_fisc">Codice Fiscale</label>
            <input
              type="text"
              id="cod_fisc"
              name="cod_fisc"
              value={student.cod_fisc || ''}
              onChange={handleChange}
              required
              className="form-control"
            />
          </div>
        </div>
        
        <div className="form-buttons">
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Salvataggio...' : 'Salva Modifiche'}
          </button>
          <button 
            type="button" 
            className="cancel-button" 
            onClick={() => navigate('/studenti')}
            disabled={loading}
          >
            Annulla
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditStudent;