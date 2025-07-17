import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import AuthScreen from '@/components/AuthScreen';
import Dashboard from '@/components/Dashboard';
import ExploreCanada from '@/components/ExploreCanada';
import TripPlanner from '@/components/TripPlanner';
import Chatbot from '@/components/Chatbot';
import UserProfile from '@/components/UserProfile';
import Navigation from '@/components/Navigation';
import { Loader2 } from 'lucide-react';

const AppLayout: React.FC = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const { t } = useLanguage();
  const [currentPage, setCurrentPage] = useState('dashboard');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">{t('loading')}</span>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <AuthScreen />;
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentPage} />;
      case 'explore-canada':
        return <ExploreCanada onNavigate={setCurrentPage} />;
      case 'planner':
        return <TripPlanner />;
      case 'chatbot':
        return <Chatbot />;
      case 'user-profile':
        return <UserProfile />;
      default:
        return <Dashboard onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />
      <main className="pt-16">
        {renderCurrentPage()}
      </main>
    </div>
  );
};

export default AppLayout;