import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './login/App.jsx';
import SignUpPage from './signup/signup.jsx';
import HomePage from './homepage/homepage.jsx'
import ProfilePage from './profilo/ProfilePage.jsx';
import AttendancePage from './attendance/AttendancePage.jsx';
import Applicazioni from './applicazioni/applicazioni.jsx';
import Channels from './channels/channels.jsx';
import ProtectedRoute from './ProtectedRoute/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotte pubbliche */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/singup" element={<SignUpPage />} />
        
        {/* Rotte protette: richiedono autenticazione */}
        <Route element={<ProtectedRoute />}>
          <Route path="/homepage" element={<HomePage />} />
          <Route path="/profile-page" element={<ProfilePage />} />
          <Route path="/attendance-page" element={<AttendancePage />} />
          <Route path="/application" element={<Applicazioni />} />
          <Route path="/channels" element={<Channels />} />
          {/* Aggiungi altre rotte protette qui */}
        </Route>
        
        {/* Rotta di fallback - reindirizza alla home o al login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
