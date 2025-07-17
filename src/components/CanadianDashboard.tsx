import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Thermometer, Calendar, Users, Mountain, Waves } from 'lucide-react';
import FeaturedDestinations from './FeaturedDestinations';
import DestinationDetails from './DestinationDetails';
import { useIsMobile } from '@/hooks/use-mobile';
import { useTripContext } from '@/contexts/TripContext';
import { useAuth } from '@/contexts/AuthContext';

interface CanadianDashboardProps {
  onNavigate: (page: string, searchQuery?: string) => void;
}

const CanadianDashboard: React.FC<CanadianDashboardProps> = ({ onNavigate }) => {
  const [selectedDestination, setSelectedDestination] = useState<any>(null);
  const { trips } = useTripContext();
  const { user } = useAuth();
  const isMobile = useIsMobile();

  // Calculate dashboard stats
  const totalTravelers = trips.reduce((sum, trip) => sum + (trip.travelers || 0), 0);
  const completedTrips = trips.filter(trip => trip.completed).length;
  const canadianProvinces = 13; // 10 provinces + 3 territories

  const quickStats = [
    { label: 'Provinces to Explore', value: canadianProvinces.toString(), icon: MapPin },
    { label: 'Planned Trips', value: trips.length.toString(), icon: Calendar },
    { label: 'Travel Companions', value: totalTravelers.toString(), icon: Users },
    { label: 'Destinations Visited', value: completedTrips.toString(), icon: Mountain }
  ];

  const handleDestinationClick = (destination: any) => {
    setSelectedDestination(destination);
  };

  const handleBackToDashboard = () => {
    setSelectedDestination(null);
  };

  if (selectedDestination) {
    return (
      <DestinationDetails 
        destination={selectedDestination} 
        onBack={handleBackToDashboard}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 p-2 md:p-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header with Logo */}
        <div className="mb-4 md:mb-8">
          <div className="flex items-center space-x-2 mb-2 md:mb-4">
            <img 
              src="https://d64gsuwffb70l.cloudfront.net/68619901175d7c6ee1f37cfd_1752382798136_dffddc01.png" 
              alt="UniTravel Tech Logo" 
              className={`${isMobile ? 'h-6' : 'h-8'} w-auto`}
            />
            <h1 className={`${isMobile ? 'text-xl' : 'text-3xl'} font-bold text-gray-800`}>Welcome to UniTravel Tech</h1>
          </div>
          <p className={`text-gray-600 ${isMobile ? 'text-sm' : ''}`}>Your gateway to exploring Canada's natural beauty and rich culture</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mb-4 md:mb-8">
          {quickStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="border-blue-200">
                <CardContent className={`${isMobile ? 'p-3' : 'p-4'} text-center`}>
                  <Icon className={`${isMobile ? 'h-6 w-6' : 'h-8 w-8'} text-blue-600 mx-auto mb-2`} />
                  <div className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold text-gray-800`}>{stat.value}</div>
                  <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-600`}>{stat.label}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Featured Destinations */}
        <div className="mb-4 md:mb-8">
          <FeaturedDestinations onNavigate={onNavigate} />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <Card className="border-blue-200 hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <Calendar className={`${isMobile ? 'h-10 w-10' : 'h-12 w-12'} text-blue-600 mx-auto mb-2`} />
              <CardTitle className={`text-gray-800 ${isMobile ? 'text-base' : ''}`}>Plan New Trip</CardTitle>
              <CardDescription className={isMobile ? 'text-sm' : ''}>Create your next Canadian adventure</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button 
                onClick={() => onNavigate('planner')}
                className="bg-blue-600 hover:bg-blue-700 text-white w-full"
                size={isMobile ? 'sm' : 'default'}
              >
                Start Planning
              </Button>
            </CardContent>
          </Card>

          <Card className="border-blue-200 hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <Waves className={`${isMobile ? 'h-10 w-10' : 'h-12 w-12'} text-blue-600 mx-auto mb-2`} />
              <CardTitle className={`text-gray-800 ${isMobile ? 'text-base' : ''}`}>AI Travel Assistant</CardTitle>
              <CardDescription className={isMobile ? 'text-sm' : ''}>Get personalized recommendations</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button 
                onClick={() => onNavigate('chatbot')}
                className="bg-blue-600 hover:bg-blue-700 text-white w-full"
                size={isMobile ? 'sm' : 'default'}
              >
                Chat with AI
              </Button>
            </CardContent>
          </Card>

          <Card className="border-blue-200 hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <MapPin className={`${isMobile ? 'h-10 w-10' : 'h-12 w-12'} text-blue-600 mx-auto mb-2`} />
              <CardTitle className={`text-gray-800 ${isMobile ? 'text-base' : ''}`}>Explore Canada</CardTitle>
              <CardDescription className={isMobile ? 'text-sm' : ''}>Discover hidden gems nationwide</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button 
                onClick={() => onNavigate('explore-canada')}
                variant="outline"
                className="border-blue-300 text-blue-700 hover:bg-blue-50 w-full"
                size={isMobile ? 'sm' : 'default'}
              >
                Explore Now
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Canadian Culture Section */}
        <Card className="mt-4 md:mt-8 border-blue-200">
          <CardHeader>
            <CardTitle className={`text-gray-800 flex items-center space-x-2 ${isMobile ? 'text-base' : ''}`}>
              <span>🍁 Experience True Canadian Culture</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div>
                <h4 className={`font-medium text-blue-700 mb-2 ${isMobile ? 'text-sm' : ''}`}>Must-Try Canadian Experiences:</h4>
                <ul className={`space-y-1 text-gray-600 ${isMobile ? 'text-sm' : ''}`}>
                  <li>• Maple syrup tasting in Quebec</li>
                  <li>• Ice hockey game in Toronto</li>
                  <li>• Northern Lights in Yukon</li>
                  <li>• Poutine in Montreal</li>
                </ul>
              </div>
              <div>
                <h4 className={`font-medium text-blue-700 mb-2 ${isMobile ? 'text-sm' : ''}`}>Seasonal Highlights:</h4>
                <ul className={`space-y-1 text-gray-600 ${isMobile ? 'text-sm' : ''}`}>
                  <li>• Winter: Skiing in Whistler</li>
                  <li>• Spring: Tulip Festival in Ottawa</li>
                  <li>• Summer: Stampede in Calgary</li>
                  <li>• Fall: Changing leaves in Muskoka</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CanadianDashboard;