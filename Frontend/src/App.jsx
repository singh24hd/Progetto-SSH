import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './login/App.jsx';
import SignUpPage from './signup/signup.jsx';
import HomePage from './homepage/homepage.jsx'
import ProfilePage from './profilo/ProfilePage.jsx';
import AttendancePage from './attendance/AttendancePage.jsx';
import Applicazioni from './applicazioni/applicazioni.jsx';
import Channels from './channels/channels.jsx';
import ProtectedRoute from './ProtectedRoute/ProtectedRoute';
import DashBoard from './dashbord/dashbord.jsx';
import StudnetiList from './dashbord/studenti-list/studenti-list.jsx';
import EditStudent from './dashbord/studenti-list/EditStudent.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        <Route path="/login" element={<LoginPage />} />
        <Route path="/singup" element={<SignUpPage />} />
        
        
        <Route element={<ProtectedRoute />}>
          <Route path="/homepage" element={<HomePage />} />
          <Route path="/profile-page" element={<ProfilePage />} />
          <Route path="/attendance-page" element={<AttendancePage />} />
          <Route path="/application" element={<Applicazioni />} />
          <Route path="/channels" element={<Channels />} />
          <Route path="/dashboard" element={<DashBoard/>} />
          <Route path="/studenti-list" element={<StudnetiList/>} />
          <Route path="/edit-student/:id" element={<EditStudent />} />
          
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
