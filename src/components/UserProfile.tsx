import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { User } from 'lucide-react';
import TripManager from './TripManager';

const UserProfile: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  if (!user) return null;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <Card className="border-blue-200">
        <CardHeader className="bg-blue-50">
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <User className="h-5 w-5" />
            {t('profile')} - {user.email}
          </CardTitle>
          <CardDescription>
            {t('welcomeBack')} {t('viewManageTrips')}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Name:</span>
              <p className="text-gray-600">{user.name}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Email:</span>
              <p className="text-gray-600">{user.email}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Provider:</span>
              <p className="text-gray-600 capitalize">{user.provider}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <TripManager />
    </div>
  );
};

export default UserProfile;