import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { TripAPI, Trip as APITrip, CreateTripData } from '@/lib/tripAPI';

export interface Trip {
  id: string;
  user_id: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget: number;
  travelers: number;
  interests: string[];
  accommodationType: string;
  transportationMode: string;
  itinerary?: any[];
  created_at: string;
  updated_at: string;
  name: string;
}

interface TripItem {
  id: string;
  name: string;
  type: 'accommodation' | 'restaurant' | 'activity';
  description: string;
  location: string;
  rating: number;
  image: string;
}

interface TripContextType {
  trips: Trip[];
  currentTrip: Trip | null;
  loading: boolean;
  createTrip: (tripData: Omit<Trip, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<Trip>;
  updateTrip: (id: string, tripData: Partial<Trip>) => Promise<void>;
  deleteTrip: (id: string) => Promise<void>;
  setCurrentTrip: (trip: Trip | null) => void;
  loadTrips: () => Promise<void>;
  addItemToTrip: (tripId: string, item: TripItem) => void;
}

const TripContext = createContext<TripContextType | undefined>(undefined);

export const useTrip = () => {
  const context = useContext(TripContext);
  if (context === undefined) {
    throw new Error('useTrip must be used within a TripProvider');
  }
  return context;
};

export const useTripContext = useTrip;

interface TripProviderProps {
  children: ReactNode;
}

export const TripProvider: React.FC<TripProviderProps> = ({ children }) => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [currentTrip, setCurrentTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      loadTrips();
    } else {
      setTrips([]);
      setCurrentTrip(null);
    }
  }, [isAuthenticated, user]);

  const loadTrips = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await TripAPI.getUserTrips(user.id);
      
      if (error) {
        console.error('Error loading trips:', error);
        return;
      }
      
      const transformedTrips: Trip[] = (data || []).map(trip => ({
        id: trip.id!,
        user_id: trip.user_id,
        title: trip.title,
        name: trip.title,
        destination: trip.destination || 'Unknown',
        startDate: trip.start_date,
        endDate: trip.end_date,
        budget: trip.budget || 0,
        travelers: trip.travelers || 1,
        interests: trip.interests || [],
        accommodationType: trip.accommodation_type || 'hotel',
        transportationMode: trip.transportation_mode || 'car',
        itinerary: trip.itinerary || [],
        created_at: trip.created_at!,
        updated_at: trip.updated_at!
      }));
      
      setTrips(transformedTrips);
    } catch (error) {
      console.error('Error loading trips:', error);
    } finally {
      setLoading(false);
    }
  };

  const createTrip = async (tripData: Omit<Trip, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Trip> => {
    if (!user) {
      throw new Error('User must be authenticated to create trips');
    }

    setLoading(true);
    try {
      const createData: CreateTripData = {
        title: tripData.title || 'Untitled Trip',
        destination: tripData.destination || 'Unknown',
        start_date: tripData.startDate,
        end_date: tripData.endDate,
        budget: tripData.budget || 0,
        travelers: tripData.travelers || 1,
        interests: tripData.interests || [],
        accommodation_type: tripData.accommodationType || 'hotel',
        transportation_mode: tripData.transportationMode || 'car',
        status: 'draft'
      };

      const { data, error } = await TripAPI.createTrip(createData);
      
      if (error) {
        console.error('Error creating trip:', error);
        throw new Error(error.message || 'Failed to create trip');
      }
      
      if (!data) {
        throw new Error('No data returned from trip creation');
      }

      const newTrip: Trip = {
        id: data.id!,
        user_id: data.user_id,
        title: data.title,
        name: data.title,
        destination: data.destination || 'Unknown',
        startDate: data.start_date,
        endDate: data.end_date,
        budget: data.budget || 0,
        travelers: data.travelers || 1,
        interests: data.interests || [],
        accommodationType: data.accommodation_type || 'hotel',
        transportationMode: data.transportation_mode || 'car',
        itinerary: data.itinerary || [],
        created_at: data.created_at!,
        updated_at: data.updated_at!
      };

      setTrips(prev => [newTrip, ...prev]);
      return newTrip;
    } catch (error) {
      console.error('Error in createTrip:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateTrip = async (id: string, tripData: Partial<Trip>): Promise<void> => {
    if (!user) {
      throw new Error('User must be authenticated to update trips');
    }

    const updateData: Partial<APITrip> = {};
    if (tripData.title) updateData.title = tripData.title;
    if (tripData.destination) updateData.destination = tripData.destination;
    if (tripData.startDate) updateData.start_date = tripData.startDate;
    if (tripData.endDate) updateData.end_date = tripData.endDate;
    if (tripData.budget !== undefined) updateData.budget = tripData.budget;
    if (tripData.travelers !== undefined) updateData.travelers = tripData.travelers;
    if (tripData.interests) updateData.interests = tripData.interests;
    if (tripData.accommodationType) updateData.accommodation_type = tripData.accommodationType;
    if (tripData.transportationMode) updateData.transportation_mode = tripData.transportationMode;

    const { error } = await TripAPI.updateTrip(id, updateData);
    
    if (error) throw error;

    setTrips(prev => prev.map(trip => 
      trip.id === id ? { ...trip, ...tripData, updated_at: new Date().toISOString() } : trip
    ));

    if (currentTrip?.id === id) {
      setCurrentTrip(prev => prev ? { ...prev, ...tripData, updated_at: new Date().toISOString() } : null);
    }
  };

  const deleteTrip = async (id: string): Promise<void> => {
    if (!user) {
      throw new Error('User must be authenticated to delete trips');
    }

    const { error } = await TripAPI.deleteTrip(id);
    
    if (error) throw error;

    setTrips(prev => prev.filter(trip => trip.id !== id));
    if (currentTrip?.id === id) {
      setCurrentTrip(null);
    }
  };

  const addItemToTrip = (tripId: string, item: TripItem) => {
    console.log('Adding item to trip:', tripId, item);
  };

  const value = {
    trips,
    currentTrip,
    loading,
    createTrip,
    updateTrip,
    deleteTrip,
    setCurrentTrip,
    loadTrips,
    addItemToTrip
  };

  return (
    <TripContext.Provider value={value}>
      {children}
    </TripContext.Provider>
  );
};

export default TripProvider;