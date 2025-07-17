import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, MapPin, Users, DollarSign, Plane, Hotel, Clock, Star, ExternalLink } from 'lucide-react';
import { Trip } from '@/contexts/TripContext';
import { TripAPI, TripItem } from '@/lib/tripAPI';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import TripScheduler from './TripScheduler';
import TripPlaceCard from './TripPlaceCard';

interface TripViewProps {
  trip: Trip;
}

const TripView: React.FC<TripViewProps> = ({ trip }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [tripItems, setTripItems] = useState<TripItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (trip.id) {
      loadTripItems();
    }
  }, [trip.id]);

  const loadTripItems = async () => {
    if (!trip.id) return;
    setLoading(true);
    try {
      const { data, error } = await TripAPI.getTripItems(trip.id);
      if (error) throw error;
      setTripItems(data || []);
    } catch (error) {
      console.error('Error loading trip items:', error);
      toast({
        title: 'Error',
        description: 'Failed to load trip places',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePlace = async (itemId: string) => {
    try {
      const { error } = await TripAPI.deleteTripItem(itemId);
      if (error) throw error;
      
      setTripItems(prev => prev.filter(item => item.id !== itemId));
      toast({
        title: 'Success',
        description: 'Place removed from trip'
      });
    } catch (error) {
      console.error('Error deleting place:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove place from trip',
        variant: 'destructive'
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: isMobile ? 'numeric' : 'numeric',
      month: isMobile ? 'short' : 'long',
      day: 'numeric'
    });
  };

  const getDuration = () => {
    const start = new Date(trip.startDate);
    const end = new Date(trip.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const tripForScheduler = {
    ...trip,
    id: trip.id,
    start_date: trip.startDate,
    end_date: trip.endDate
  };

  const placesCount = tripItems.length;

  return (
    <div className={`space-y-${isMobile ? '4' : '6'}`}>
      <Card className="border-blue-200 shadow-lg">
        <CardHeader className={`bg-blue-50 ${isMobile ? 'p-4' : ''}`}>
          <CardTitle className={`${isMobile ? 'text-lg' : 'text-2xl'} text-gray-800`}>{trip.title}</CardTitle>
          <CardDescription className={`${isMobile ? 'text-sm' : 'text-lg'}`}>
            <MapPin className={`inline ${isMobile ? 'h-3 w-3' : 'h-4 w-4'} mr-1`} />
            {trip.destination}
          </CardDescription>
        </CardHeader>
        <CardContent className={isMobile ? 'p-4' : 'p-6'}>
          <div className={`grid ${isMobile ? 'grid-cols-2 gap-3' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4'} mb-6`}>
            <div className="flex items-center space-x-2">
              <Calendar className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} text-blue-600`} />
              <div>
                <p className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium`}>Duration</p>
                <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-600`}>{getDuration()} days</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Users className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} text-blue-600`} />
              <div>
                <p className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium`}>Travelers</p>
                <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-600`}>{trip.travelers} people</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <DollarSign className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} text-blue-600`} />
              <div>
                <p className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium`}>Budget</p>
                <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-600`}>${trip.budget} CAD</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Hotel className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} text-blue-600`} />
              <div>
                <p className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium`}>Stay</p>
                <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-600 capitalize`}>{trip.accommodationType}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} text-green-600`} />
              <div>
                <p className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium`}>Places</p>
                <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-600`}>{placesCount}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className={`grid w-full grid-cols-3 ${isMobile ? 'h-12' : ''}`}>
          <TabsTrigger value="overview" className={isMobile ? 'text-xs px-2' : ''}>
            {isMobile ? 'Info' : 'Overview'}
          </TabsTrigger>
          <TabsTrigger value="places" className={isMobile ? 'text-xs px-2' : ''}>
            {isMobile ? `Places (${placesCount})` : `Places (${placesCount})`}
          </TabsTrigger>
          <TabsTrigger value="schedule" className={isMobile ? 'text-xs px-2' : ''}>
            {isMobile ? (
              <Clock className="h-3 w-3" />
            ) : (
              <>
                <Clock className="h-4 w-4 mr-2" />
                Schedule
              </>
            )}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className={`space-y-${isMobile ? '4' : '6'} ${isMobile ? 'mt-4' : ''}`}>
          <Card>
            <CardContent className={isMobile ? 'p-4' : 'p-6'}>
              <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-1 md:grid-cols-2 gap-6'}`}>
                <div>
                  <h3 className={`font-medium text-gray-800 mb-3 ${isMobile ? 'text-sm' : ''}`}>Travel Dates</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-600`}>Start:</span>
                      <span className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium`}>{formatDate(trip.startDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-600`}>End:</span>
                      <span className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium`}>{formatDate(trip.endDate)}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className={`font-medium text-gray-800 mb-3 ${isMobile ? 'text-sm' : ''}`}>Transportation</h3>
                  <div className="flex items-center space-x-2">
                    <Plane className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} text-blue-600`} />
                    <span className={`${isMobile ? 'text-xs' : 'text-sm'} capitalize`}>{trip.transportationMode}</span>
                  </div>
                </div>
              </div>

              {trip.interests && trip.interests.length > 0 && (
                <div className="mt-6">
                  <h3 className={`font-medium text-gray-800 mb-3 ${isMobile ? 'text-sm' : ''}`}>Interests</h3>
                  <div className="flex flex-wrap gap-2">
                    {trip.interests.map((interest, index) => (
                      <Badge key={index} variant="secondary" className={`bg-blue-100 text-blue-800 ${isMobile ? 'text-xs px-2 py-1' : ''}`}>
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="places" className={`space-y-4 ${isMobile ? 'mt-4' : ''}`}>
          <Card>
            <CardHeader className={isMobile ? 'p-4 pb-2' : ''}>
              <CardTitle className={isMobile ? 'text-lg' : ''}>Trip Places ({placesCount})</CardTitle>
              <CardDescription className={isMobile ? 'text-sm' : ''}>
                Places you've added to this trip
              </CardDescription>
            </CardHeader>
            <CardContent className={isMobile ? 'p-4 pt-2' : ''}>
              {loading ? (
                <div className="text-center py-8">
                  <p className={isMobile ? 'text-sm' : ''}>Loading places...</p>
                </div>
              ) : tripItems.length === 0 ? (
                <div className="text-center py-8">
                  <p className={`text-gray-500 ${isMobile ? 'text-sm' : ''}`}>No places added yet. Use the search to add places to your trip!</p>
                </div>
              ) : (
                <div className={`grid ${isMobile ? 'grid-cols-1 gap-3' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'}`}>
                  {tripItems.map((item) => (
                    <TripPlaceCard
                      key={item.id}
                      item={item}
                      onDelete={handleDeletePlace}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="schedule" className={isMobile ? 'mt-4' : ''}>
          <TripScheduler trip={tripForScheduler} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TripView;