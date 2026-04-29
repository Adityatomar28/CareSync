import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import Register from './pages/Register';
import DashboardLayout from './pages/DashboardLayout';
import DashboardHome from './pages/DashboardHome';
import Medications from './pages/Medications';
import Appointments from './pages/Appointments';
import Symptoms from './pages/Symptoms';
import CalendarView from './pages/CalendarView';
import Chat from './pages/Chat';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/dashboard" element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route index element={<DashboardHome />} />
              <Route path="calendar" element={<CalendarView />} />
              <Route path="chat" element={<Chat />} />
              <Route path="symptoms" element={<Symptoms />} />
              <Route path="medications" element={<Medications />} />
              <Route path="appointments" element={<Appointments />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
