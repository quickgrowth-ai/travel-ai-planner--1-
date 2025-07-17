import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { TripProvider } from '@/contexts/TripContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { Toaster } from '@/components/ui/toaster';
import MainApp from '@/components/MainApp';
import './App.css';

function App() {
  return (
    <Router>
      <LanguageProvider>
        <AuthProvider>
          <TripProvider>
            <MainApp />
            <Toaster />
          </TripProvider>
        </AuthProvider>
      </LanguageProvider>
    </Router>
  );
}

export default App;