import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { TripAPI, Trip } from '@/lib/tripAPI';
import { Trash2, Eye, Calendar, MapPin, Users, DollarSign, MoreVertical } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import TripView from './TripView';

interface TripManagerProps {
  onViewTrip?: (trip: Trip) => void;
}

const TripManager: React.FC<TripManagerProps> = ({ onViewTrip }) => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'detail'>('list');

  useEffect(() => {
    if (user) {
      loadTrips();
    }
  }, [user]);

  const loadTrips = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await TripAPI.getUserTrips(user.id);
      if (error) throw error;
      setTrips(data || []);
    } catch (error) {
      console.error('Error loading trips:', error);
      setTrips([]);
      toast({
        title: t('error'),
        description: t('loadTripsError'),
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTrip = async (tripId: string) => {
    try {
      const { error } = await TripAPI.deleteTrip(tripId);
      if (error) throw error;
      
      setTrips(prevTrips => prevTrips.filter(trip => trip.id !== tripId));
      toast({
        title: t('tripDeleted'),
        description: t('tripDeletedDesc')
      });
    } catch (error) {
      toast({
        title: t('error'),
        description: t('deleteError'),
        variant: 'destructive'
      });
    }
  };

  const handleViewTrip = (trip: Trip) => {
    setSelectedTrip(trip);
    setViewMode('detail');
    if (onViewTrip) {
      onViewTrip(trip);
    }
  };

  const handleBackToList = () => {
    setSelectedTrip(null);
    setViewMode('list');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: isMobile ? undefined : 'numeric'
    });
  };

  if (!user) return null;

  if (viewMode === 'detail' && selectedTrip) {
    const tripForView = {
      ...selectedTrip,
      title: selectedTrip.title || selectedTrip.trip_name || t('untitledTrip'),
      startDate: selectedTrip.start_date,
      endDate: selectedTrip.end_date,
      accommodationType: selectedTrip.accommodation_type || 'hotel',
      transportationMode: selectedTrip.transportation_mode || 'car'
    };

    return (
      <div className="space-y-4">
        <Button onClick={handleBackToList} variant="outline" size={isMobile ? 'sm' : 'default'}>
          ← {t('backToTrips')}
        </Button>
        <TripView trip={tripForView} />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className={isMobile ? 'p-4 pb-2' : ''}>
        <CardTitle className={`flex items-center gap-2 ${isMobile ? 'text-lg' : 'text-xl'}`}>
          <Calendar className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'}`} />
          {isMobile ? `${t('trips')} (${(trips || []).length})` : `${t('manageTrips')} (${(trips || []).length})`}
        </CardTitle>
        <CardDescription className={isMobile ? 'text-sm' : ''}>
          {t('viewManageTrips')}
        </CardDescription>
      </CardHeader>
      <CardContent className={isMobile ? 'p-4 pt-2' : ''}>
        {loading ? (
          <div className="text-center py-8">
            <p className={isMobile ? 'text-sm' : ''}>{t('loadingTrips')}</p>
          </div>
        ) : !trips || trips.length === 0 ? (
          <div className="text-center py-8">
            <p className={`text-gray-500 ${isMobile ? 'text-sm' : ''}`}>{t('noTripsFound')}</p>
          </div>
        ) : (
          <div className={`space-y-${isMobile ? '3' : '4'}`}>
            {trips.map((trip) => (
              <div key={trip.id} className={`border border-gray-200 rounded-lg ${isMobile ? 'p-3' : 'p-4'} hover:shadow-md transition-shadow`}>
                <div className={`flex ${isMobile ? 'flex-col' : 'justify-between items-start'}`}>
                  <div className="flex-1">
                    <div className={`flex ${isMobile ? 'justify-between items-start' : 'items-center'} mb-2`}>
                      <h3 className={`font-medium text-gray-800 ${isMobile ? 'text-sm pr-2' : ''}`}>
                        {trip.title || trip.trip_name || t('untitledTrip')}
                      </h3>
                      {isMobile && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewTrip(trip)}>
                              <Eye className="h-4 w-4 mr-2" />
                              {t('view')}
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => trip.id && handleDeleteTrip(trip.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              {t('delete')}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                    
                    <div className={`grid ${isMobile ? 'grid-cols-1 gap-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3'} text-sm text-gray-600`}>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate">{trip.destination || 'Unknown'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate">{formatDate(trip.start_date)} - {formatDate(trip.end_date)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 flex-shrink-0" />
                        <span>{trip.travelers || 1} {trip.travelers === 1 ? t('traveler') : t('travelers')}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4 flex-shrink-0" />
                        <span>${trip.budget || 0} CAD</span>
                      </div>
                    </div>
                    
                    {trip.description && (
                      <p className={`text-gray-600 mt-2 ${isMobile ? 'text-xs line-clamp-2' : 'text-sm'}`}>{trip.description}</p>
                    )}
                  </div>
                  
                  {!isMobile && (
                    <div className="flex gap-2 ml-4">
                      <Button
                        onClick={() => handleViewTrip(trip)}
                        size="sm"
                        variant="outline"
                        className="bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        {t('view')}
                      </Button>
                      <Button
                        onClick={() => trip.id && handleDeleteTrip(trip.id)}
                        size="sm"
                        variant="destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TripManager;