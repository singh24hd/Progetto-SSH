import { useState } from 'react';
import { Line } from 'react-chartjs-2';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './HomePage.css';

const App = () => {
  const [activeSection, setActiveSection] = useState('main');
  const [showDropdown, setShowDropdown] = useState(false);
  const [posts, setPosts] = useState([
    { id: 1, content: 'Video lezione matematica', type: 'video', rating: 8 },
    { id: 2, content: 'App per esercizi storia', type: 'app', rating: 9 },
    { id: 3, content: 'Documento letteratura', type: 'doc', rating: 7 },
  ]);

  const attendanceData = {
    labels: ['Sett 1', 'Sett 2', 'Sett 3', 'Sett 4'],
    datasets: [
      {
        label: 'Presenze',
        data: [12, 15, 13, 14],
        borderColor: '#3B82F6',
        tension: 0.1,
      },
    ],
  };

  const stories = [
    { id: 1, teacher: 'Prof. Rossi', subject: 'Matematica' },
    { id: 2, teacher: 'Prof. Verdi', subject: 'Storia' },
    { id: 3, teacher: 'Prof. Bianchi', subject: 'Scienze' },
  ];

  const handleRate = (postId, rating) => {
    setPosts(posts.map(post => 
      post.id === postId ? { ...post, rating } : post
    ));
  };

  return (
    <div className="app-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-content">
          <h1 className="logo">Scuola Digitale</h1>
          <div className="dropdown-wrapper">
            <button 
              onClick={() => setShowDropdown(!showDropdown)}
              className="menu-button"
            >
              Menu ▾
            </button>
            {showDropdown && (
              <div className="dropdown-menu">
                <button
                  onClick={() => setActiveSection('profile')}
                  className="dropdown-item"
                >
                  Profilo
                </button>
                <button
                  onClick={() => setActiveSection('attendance')}
                  className="dropdown-item"
                >
                  Presenze
                </button>
                <button
                  onClick={() => setActiveSection('main')}
                  className="dropdown-item"
                >
                  Home
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        {activeSection === 'main' && (
          <div>
            {/* Stories */}
            <div className="stories-section">
              <h2 className="section-title">Lezioni in Evidenza</h2>
              <div className="stories-container">
                {stories.map(story => (
                  <div 
                    key={story.id}
                    className="story-item"
                  >
                    {story.teacher}
                  </div>
                ))}
              </div>
            </div>

            {/* Posts */}
            <div className="posts-container">
              {posts.map(post => (
                <div key={post.id} className="post-card">
                  <div className="post-content">{post.content}</div>
                  <div className="rating-container">
                    <select 
                      value={post.rating}
                      onChange={(e) => handleRate(post.id, parseInt(e.target.value))}
                      className="rating-select"
                    >
                      {[...Array(10).keys()].map(n => (
                        <option key={n+1} value={n+1}>{n+1}</option>
                      ))}
                    </select>
                    <span className="rating-value">★ {post.rating}/10</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'profile' && (
          <div className="profile-section">
            <h2 className="section-title">Profilo Studente</h2>
            <div className="profile-info">
              <p><span className="info-label">Nome:</span> Mario Rossi</p>
              <p><span className="info-label">Classe:</span> 3°A</p>
              <p><span className="info-label">Indirizzo:</span> Scientifico</p>
            </div>
          </div>
        )}

        {activeSection === 'attendance' && (
          <div className="attendance-section">
            <h2 className="section-title">Presenze</h2>
            <div className="attendance-grid">
              <div className="chart-container">
                <Line data={attendanceData} />
              </div>
              <div className="calendar-container">
                <Calendar className="custom-calendar" />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;