import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./LoginPage/LoginPage";
import RegisterPage from "./RegisterPage/RegisterPage";
import ForgotPasswordPage from "./ForgotPasswordPage/ForgotPasswordPage";
import LandingPage from './LandingPage/LandingPage';
import SettingsPage from './SettingsPage/SettingsPage';
import ResetPasswordPage from './ResetPasswordPage/ResetPasswordPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/register" replace />} />
        <Route path="/register-page" element={<RegisterPage />} />
        <Route path="/login-page" element={<LoginPage />} />
        <Route path="/forgot-password-page" element={<ForgotPasswordPage />} />
        <Route path="/landing-page" element={<LandingPage />} />
        <Route path="/account-page" element={<SettingsPage />} />
        <Route path="/reset-password-page" element={<ResetPasswordPage />} />
      </Routes>
    </Router>
  );
}

export default App
