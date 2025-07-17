import React from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import { TripProvider } from '@/contexts/TripContext';
import { AppProvider } from '@/contexts/AppContext';
import AppLayout from '@/components/AppLayout';
import { Toaster } from '@/components/ui/toaster';

const MainApp: React.FC = () => {
  return (
    <AuthProvider>
      <AppProvider>
        <TripProvider>
          <div className="min-h-screen bg-gray-50">
            <AppLayout />
            <Toaster />
          </div>
        </TripProvider>
      </AppProvider>
    </AuthProvider>
  );
};

export default MainApp;