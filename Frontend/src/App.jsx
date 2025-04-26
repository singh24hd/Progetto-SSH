import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './login/App.jsx';
import SignUpPage from './signup/signup.jsx';
import HomePage from './homepage/homepage.jsx'
import ProfilePage from './profilo/ProfilePage.jsx';
import AttendancePage from './attendance/AttendancePage.jsx';
import Applicazioni from './applicazioni/applicazioni.jsx';
import Channels from './channels/channels.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<h1>Home Page</h1>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/homepage" element={<HomePage />} />
        <Route path="/profilepage" element={<ProfilePage />} />
        <Route path="/attendance" element={<AttendancePage />} />
        <Route path="/applicazioni" element={<Applicazioni />} />
        <Route path="/channels" element={<Channels />} />
        

      </Routes>
    </Router>
  );
}

export default App;
