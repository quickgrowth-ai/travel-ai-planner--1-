import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar, MessageCircle, TrendingUp, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useIsMobile } from '@/hooks/use-mobile';
import SearchSection from './SearchSection';
import SearchResults from './SearchResults';
import ConnectionTest from './ConnectionTest';
import useChatGPTSearch from '@/hooks/useChatGPTSearch';
import { Separator } from '@/components/ui/separator';

interface DashboardProps {
  onNavigate?: (page: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { searchLocation, loadMore, loading, results, error, hasMore, loadingProgress } = useChatGPTSearch();
  const [hasSearched, setHasSearched] = useState(false);
  const [showConnectionTest, setShowConnectionTest] = useState(false);
  const { t } = useLanguage();
  const isMobile = useIsMobile();

  const handleSearch = (location: string, query?: string) => {
    setHasSearched(true);
    searchLocation(location, query);
  };

  const quickActions = [
    {
      title: t('explore'),
      description: 'Discover amazing Canadian destinations',
      icon: MapPin,
      action: () => onNavigate?.('explore-canada'),
      color: 'bg-blue-500'
    },
    {
      title: t('planTrip'),
      description: 'Create your perfect Canadian itinerary',
      icon: Calendar,
      action: () => onNavigate?.('planner'),
      color: 'bg-green-500'
    },
    {
      title: 'AI Assistant',
      description: 'Get personalized travel recommendations',
      icon: MessageCircle,
      action: () => onNavigate?.('chatbot'),
      color: 'bg-purple-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 p-2 md:p-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-6 md:mb-8">
          <div className="flex items-center justify-center space-x-2 mb-3 md:mb-4">
            <img 
              src="https://d64gsuwffb70l.cloudfront.net/68619901175d7c6ee1f37cfd_1752719278671_18257536.png" 
              alt="UniTravel Tech Logo" 
              className="h-6 md:h-8 w-auto"
            />
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{t('dashboard')}</h1>
          </div>
          <p className="text-gray-600 text-sm md:text-base">{t('welcomeBack')}</p>
          
          {/* Connection Test Toggle */}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowConnectionTest(!showConnectionTest)}
            className="mt-2"
          >
            <AlertCircle className="w-4 h-4 mr-2" />
            {showConnectionTest ? 'Hide' : 'Show'} Connection Status
          </Button>
        </div>

        {/* Connection Test */}
        {showConnectionTest && (
          <div className="mb-6 md:mb-8">
            <ConnectionTest />
          </div>
        )}

        {/* Quick Actions */}
        <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'md:grid-cols-3 gap-6'} mb-6 md:mb-8`}>
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Card key={index} className="border-blue-200 hover:shadow-lg transition-shadow cursor-pointer" onClick={action.action}>
                <CardHeader className={`pb-3 ${isMobile ? 'py-4' : ''}`}>
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${action.color} text-white`}>
                      <Icon className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'}`} />
                    </div>
                    <CardTitle className={`${isMobile ? 'text-base' : 'text-lg'}`}>{action.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className={isMobile ? 'pt-0 pb-4' : ''}>
                  <p className={`text-gray-600 ${isMobile ? 'text-xs' : 'text-sm'}`}>{action.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Search Section */}
        <Card className="border-blue-200 shadow-lg mb-6 md:mb-8">
          <CardHeader className="bg-blue-50">
            <CardTitle className={`flex items-center gap-2 ${isMobile ? 'text-base' : 'text-lg'}`}>
              <TrendingUp className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'}`} />
              {t('searchCanadianDestinations')}
            </CardTitle>
          </CardHeader>
          <CardContent className={`${isMobile ? 'p-4' : 'p-6'}`}>
            <SearchSection 
              onSearch={handleSearch}
              loading={loading}
              searchProgress={loadingProgress}
            />
          </CardContent>
        </Card>
        
        {hasSearched && (
          <>
            <Separator className="my-6 md:my-8" />
            <SearchResults 
              results={results}
              loading={loading}
              error={error}
              hasMore={hasMore}
              onLoadMore={loadMore}
              loadingProgress={loadingProgress}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;