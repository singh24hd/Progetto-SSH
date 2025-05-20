import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../../Navbar/Navbar';
import './studenti-list.css'

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [languageFilter, setLanguageFilter] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [levelFilter, setLevelFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Set up authorization header for API requests
  const getAuthHeader = () => {
    const token = localStorage.getItem('token'); // Assuming you store your token in localStorage
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  useEffect(() => {
    // Load students when component mounts
    setLoading(true);
    setError(null);
    
    axios.get('http://localhost:8000/students', getAuthHeader())
      .then(res => {
        // Debug the response structure
        console.log("API Response:", res);
        
        // Make sure we're working with an array
        let studentArray = Array.isArray(res.data) ? res.data : [];
        
        // If the data is not an array, check if it might be nested
        if (!Array.isArray(res.data) && res.data && typeof res.data === 'object') {
          // Look for potential array properties in the response
          const possibleArrays = Object.values(res.data).filter(Array.isArray);
          if (possibleArrays.length > 0) {
            // Use the first array found
            studentArray = possibleArrays[0];
            console.log("Found nested array:", studentArray);
          }
        }
        
        // Process student data to add full_name field
        const processedStudents = studentArray.map(student => ({
          ...student,
          full_name: `${student.nome} ${student.cognome}`,
          language: student.lingua_madre,
          city: student.citta
        }));
        
        setStudents(processedStudents);
        setFiltered(processedStudents);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching students:", error);
        // Log detailed error information
        if (error.response) {
          console.error("Response error:", error.response.data);
          console.error("Status code:", error.response.status);
        }
        if (error.response?.status === 401) {
          alert("Sessione scaduta. Effettuare nuovamente il login.");
          // Redirect to login page if appropriate
          window.location.href = '/login';
        }
        setError("Errore nel caricamento degli studenti");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let result = students;

    if (search.trim()) {
      const keyword = search.toLowerCase();
      result = result.filter(s => s.full_name.toLowerCase().includes(keyword));
    }

    if (languageFilter) result = result.filter(s => s.language === languageFilter);
    if (cityFilter) result = result.filter(s => s.city === cityFilter);
    if (levelFilter) result = result.filter(s => s.livello_italiano === levelFilter);

    setFiltered(result);
  }, [search, languageFilter, cityFilter, levelFilter, students]);

  const AggiungiStud = (id) => {
    axios.put(`http://localhost:8000/aggiungiStud/${id}`, null, getAuthHeader())
      .then(() => {
        alert("Studente aggiunto con successo alla tua lista!");
        // Ricarica la lista studenti
        axios.get('http://localhost:8000/students', getAuthHeader())
          .then(res => {
            const processed = res.data.map(s => ({
              ...s,
              full_name: `${s.nome} ${s.cognome}`
            }));
            setStudents(processed);
            setFiltered(processed);
          });
      })
      .catch(error => {
        console.error("Errore nell'aggiunta:", error);
        if (error.response?.status === 401) {
          alert("Sessione scaduta. Effettua il login!");
          window.location.href = '/login';
        } else {
          alert("Operazione fallita: " + (error.response?.data?.detail || "Errore sconosciuto"));
        }
      });
  };

  const handleDelete = (id) => {
    if (!window.confirm("Sei sicuro di voler cancellare questo studente?")) return;
    
    axios.delete(`http://localhost:8000/users/${id}`, getAuthHeader())
      .then(() => {
        setStudents(students.filter(s => s.id !== id));
        alert("Studente eliminato con successo!");
      })
      .catch(error => {
        console.error("Error deleting student:", error);
        alert("Errore durante l'eliminazione dello studente.");
        
        if (error.response?.status === 401) {
          alert("Sessione scaduta. Effettuare nuovamente il login.");
          window.location.href = '/login';
        }
      });
  };

  const handleEdit = (id) => {
    // Navigate to edit page
    window.location.href = `/edit-student/${id}`;
  };

  const uniqueValues = (field) => [...new Set(students.map(s => s[field]).filter(Boolean))];

  if (loading) return <div className="loading">Caricamento...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="features">
      <Navbar />
      <h2>Gestione Studenti</h2>
      <div className="select-group" style={{ marginBottom: '2rem' }}>
        <input className="select-input" type="text" placeholder="Cerca per nome..."
          value={search} onChange={e => setSearch(e.target.value)} />

        <select className="select-input" value={languageFilter} onChange={e => setLanguageFilter(e.target.value)}>
          <option value="">Lingua Madre</option>
          {uniqueValues('language').map((lang, i) => (
            <option key={i} value={lang}>{lang}</option>
          ))}
        </select>

        <select className="select-input" value={cityFilter} onChange={e => setCityFilter(e.target.value)}>
          <option value="">Città</option>
          {uniqueValues('city').map((city, i) => (
            <option key={i} value={city}>{city}</option>
          ))}
        </select>

        <select className="select-input" value={levelFilter} onChange={e => setLevelFilter(e.target.value)}>
          <option value="">Livello Italiano</option>
          {uniqueValues('livello_italiano').map((level, i) => (
            <option key={i} value={level}>{level}</option>
          ))}
        </select>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff' }}>
          <thead>
            <tr style={{ backgroundColor: '#005b96', color: 'white' }}>
              <th style={th}>Nome</th>
              <th style={th}>Email</th>
              <th style={th}>Lingua Madre</th>
              <th style={th}>Città</th>
              <th style={th}>Livello Italiano</th>
              <th style={th}>Azioni</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map(student => (
                <tr key={student.id}>
                  <td style={td}>{student.full_name}</td>
                  <td style={td}>{student.email}</td>
                  <td style={td}>{student.language}</td>
                  <td style={td}>{student.city}</td>
                  <td style={td}>{student.livello_italiano}</td>
                  <td style={td}>
                    <button className="nav-button" onClick={() => handleEdit(student.id)}>
                      Modifica
                    </button>
                    <button className="nav-button" style={{ marginLeft: '0.5rem', backgroundColor: '#f44336', border: 'none' }} onClick={() => handleDelete(student.id)}>
                      Elimina
                    </button>
                    <button className="nav-button" style={{ marginLeft: '0.5rem', backgroundColor: '#42f566', border: 'none' }} onClick={() => AggiungiStud(student.id)}>
                      Aggiungi
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td style={td} colSpan="6">Nessuno studente trovato.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-logo">
            <h3>Scuola Digitale</h3>
            <p>Un progetto della Scuola Penny Wirton</p>
          </div>
          
          <div className="footer-links">
            <h4>Collegamenti utili</h4>
            <ul>
              <li><a href="https://www.scuolapennywirton.it/">Sito ufficiale Penny Wirton</a></li>
              <li><a href="/chi-siamo">Chi siamo</a></li>
              <li><a href="/contatti">Contatti</a></li>
              <li><a href="/donazioni">Sostienici</a></li>
            </ul>
          </div>
          
          <div className="footer-info">
            <h4>Contatti</h4>
            <p>Email: info@scuoladigitale.it</p>
            <p>Telefono: +39 06 123456</p>
            <p>Indirizzo: Via Roma 123, Roma</p>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Scuola Penny Wirton. Tutti i diritti riservati.</p>
        </div>
        </footer>
    </div>
  );
};

const th = {
  padding: '1rem',
  textAlign: 'left',
};

const td = {
  padding: '1rem',
  borderBottom: '1px solid #ddd',
};

export default StudentList;