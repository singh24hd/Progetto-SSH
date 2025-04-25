import { useNavigate } from 'react-router-dom';
import "./HomePage.css"

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="nav-content">
        <div className="title">
          <h1 className="logo">Scuola Digitale</h1>
        </div>
        
        
        <div className="nav-buttons">
          <button
            onClick={() => navigate('/video')}
            className="nav-button"
          >
            Video
          </button>
          <button
            onClick={() => navigate('/channels')}
            className="nav-button"
          >
            Channels
          </button>
          <button
            onClick={() => navigate('/ProfilePage')}
            className="nav-button"
          >
            Profile
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;