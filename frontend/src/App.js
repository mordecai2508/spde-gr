import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './utils/AuthContext';
import Login from './components/pages/Login';
import Students from './components/pages/Students';
import RiskChart from './components/RiskChart';  // Embed in dashboard
import ErrorBoundary from './utils/ErrorBoundary';

function App() {
  return (
    <AuthProvider>
      <Router>
        <ErrorBoundary>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/students" element={<Students />} />
            {/* Protected routes with auth check */}
            <Route path="/dashboard" element={<><RiskChart data={[]} /> <Students /></>} />
          </Routes>
        </ErrorBoundary>
      </Router>
    </AuthProvider>
  );
}

export default App;