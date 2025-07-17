import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Settings } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useIsMobile } from '@/hooks/use-mobile';
import TripManager from './TripManager';
import TripForm from './TripForm';

const TripPlanner: React.FC = () => {
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState('manage');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleTripCreated = () => {
    setRefreshTrigger(prev => prev + 1);
    setActiveTab('manage');
  };

  return (
    <div className={`container mx-auto px-2 md:px-4 py-4 md:py-8 max-w-6xl`}>
      <div className={`mb-6 md:mb-8`}>
        <h1 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold text-gray-900 mb-2`}>{t('tripPlanner')}</h1>
        <p className={`text-gray-600 ${isMobile ? 'text-sm' : 'text-base'}`}>{t('planManageSchedule')}</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className={`grid w-full grid-cols-2 ${isMobile ? 'h-12' : ''}`}>
          <TabsTrigger value="manage" className={`flex items-center gap-2 ${isMobile ? 'text-sm px-3' : ''}`}>
            <Settings className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
            {isMobile ? t('manage') : t('manageTrips')}
          </TabsTrigger>
          <TabsTrigger value="create" className={`flex items-center gap-2 ${isMobile ? 'text-sm px-3' : ''}`}>
            <Plus className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
            {isMobile ? t('create') : t('createTrip')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="manage" className={`${isMobile ? 'mt-4' : 'mt-6'}`}>
          <TripManager key={refreshTrigger} />
        </TabsContent>

        <TabsContent value="create" className={`${isMobile ? 'mt-4' : 'mt-6'}`}>
          <Card>
            <CardHeader className={isMobile ? 'p-4 pb-2' : ''}>
              <CardTitle className={`flex items-center gap-2 ${isMobile ? 'text-lg' : 'text-xl'}`}>
                <Plus className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'}`} />
                {t('createNewTrip')}
              </CardTitle>
              <CardDescription className={isMobile ? 'text-sm' : ''}>
                {t('planNextAdventure')}
              </CardDescription>
            </CardHeader>
            <CardContent className={isMobile ? 'p-4 pt-2' : ''}>
              <TripForm onTripCreated={handleTripCreated} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TripPlanner;