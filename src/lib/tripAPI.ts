import { supabase } from './supabase';

export interface Trip {
  id?: string;
  user_id: string;
  title: string;
  trip_name: string;
  description?: string;
  destination: string;
  start_date: string;
  end_date: string;
  budget?: number;
  travelers?: number;
  interests?: string[];
  accommodation_type?: string;
  transportation_mode?: string;
  itinerary?: any[];
  status: 'draft' | 'planned' | 'active' | 'completed';
  created_at?: string;
  updated_at?: string;
}

export interface TripItem {
  id?: string;
  trip_id: string;
  type: 'accommodation' | 'activity' | 'restaurant' | 'transport';
  title: string;
  location?: string;
  day_number?: number;
  scheduled_time?: string;
  notes?: string;
  place_id?: string;
  ai_description?: string;
  website?: string;
  operating_hours?: string;
  rating?: number;
  image_url?: string;
  created_at?: string;
}

export interface CreateTripData {
  title: string;
  trip_name?: string;
  description?: string;
  destination: string;
  start_date: string;
  end_date: string;
  budget?: number;
  travelers?: number;
  interests?: string[];
  accommodation_type?: string;
  transportation_mode?: string;
  status?: 'draft' | 'planned' | 'active' | 'completed';
}

export class TripAPI {
  static async ensureUserExists(userId: string): Promise<void> {
    try {
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('id', userId)
        .single();
      
      if (!existingUser) {
        await supabase
          .from('users')
          .insert({ id: userId })
          .single();
      }
    } catch (error) {
      console.error('Error ensuring user exists:', error);
    }
  }

  static async createTrip(tripData: CreateTripData): Promise<{ data: Trip | null; error: any }> {
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session?.user) {
        return { data: null, error: 'User not authenticated' };
      }

      await this.ensureUserExists(session.user.id);

      const { data, error } = await supabase
        .from('saved_trips')
        .insert({
          user_id: session.user.id,
          trip_name: tripData.title || tripData.trip_name || 'Untitled Trip',
          description: tripData.description || '',
          destination: tripData.destination || 'Unknown',
          start_date: tripData.start_date,
          end_date: tripData.end_date,
          budget: tripData.budget || 0,
          travelers: tripData.travelers || 1,
          interests: tripData.interests || [],
          accommodation_type: tripData.accommodation_type || 'hotel',
          transportation_mode: tripData.transportation_mode || 'car',
          itinerary: [],
          status: tripData.status || 'draft'
        })
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        return { data: null, error };
      }

      const transformedData = {
        ...data,
        title: data.trip_name
      };

      return { data: transformedData, error: null };
    } catch (error) {
      console.error('TripAPI createTrip error:', error);
      return { data: null, error };
    }
  }

  static async getUserTrips(userId: string): Promise<{ data: Trip[] | null; error: any }> {
    try {
      if (!userId) {
        return { data: [], error: null };
      }

      const { data, error } = await supabase
        .from('saved_trips')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('getUserTrips error:', error);
        return { data: [], error };
      }

      const transformedData = (data || []).map(trip => ({
        ...trip,
        title: trip.trip_name || 'Untitled Trip'
      }));

      return { data: transformedData, error: null };
    } catch (error) {
      console.error('getUserTrips catch error:', error);
      return { data: [], error };
    }
  }

  static async updateTrip(tripId: string, tripData: Partial<Trip>): Promise<{ error: any }> {
    try {
      if (!tripId) {
        return { error: 'Trip ID is required' };
      }

      const updateData: any = {};
      if (tripData.title) updateData.trip_name = tripData.title;
      if (tripData.description !== undefined) updateData.description = tripData.description;
      if (tripData.destination) updateData.destination = tripData.destination;
      if (tripData.start_date) updateData.start_date = tripData.start_date;
      if (tripData.end_date) updateData.end_date = tripData.end_date;
      if (tripData.budget !== undefined) updateData.budget = tripData.budget;
      if (tripData.travelers !== undefined) updateData.travelers = tripData.travelers;
      if (tripData.interests) updateData.interests = tripData.interests;
      if (tripData.accommodation_type) updateData.accommodation_type = tripData.accommodation_type;
      if (tripData.transportation_mode) updateData.transportation_mode = tripData.transportation_mode;
      if (tripData.status) updateData.status = tripData.status;

      const { error } = await supabase
        .from('saved_trips')
        .update(updateData)
        .eq('id', tripId);

      return { error };
    } catch (error) {
      console.error('updateTrip error:', error);
      return { error };
    }
  }

  static async deleteTrip(tripId: string): Promise<{ error: any }> {
    try {
      if (!tripId) {
        return { error: 'Trip ID is required' };
      }

      const { error } = await supabase
        .from('saved_trips')
        .delete()
        .eq('id', tripId);

      return { error };
    } catch (error) {
      console.error('deleteTrip error:', error);
      return { error };
    }
  }

  static async createTripItem(item: Omit<TripItem, 'id' | 'created_at'>): Promise<{ data: TripItem | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('trip_items')
        .insert(item)
        .select()
        .single();

      return { data, error };
    } catch (error) {
      console.error('createTripItem error:', error);
      return { data: null, error };
    }
  }

  static async getTripItems(tripId: string): Promise<{ data: TripItem[] | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('trip_items')
        .select('*')
        .eq('trip_id', tripId)
        .order('day_number', { ascending: true })
        .order('scheduled_time', { ascending: true });

      return { data, error };
    } catch (error) {
      console.error('getTripItems error:', error);
      return { data: [], error };
    }
  }

  static async updateTripItem(itemId: string, updates: Partial<TripItem>): Promise<{ error: any }> {
    try {
      const { error } = await supabase
        .from('trip_items')
        .update(updates)
        .eq('id', itemId);

      return { error };
    } catch (error) {
      console.error('updateTripItem error:', error);
      return { error };
    }
  }

  static async deleteTripItem(itemId: string): Promise<{ error: any }> {
    try {
      const { error } = await supabase
        .from('trip_items')
        .delete()
        .eq('id', itemId);

      return { error };
    } catch (error) {
      console.error('deleteTripItem error:', error);
      return { error };
    }
  }

  // Test database connection
  static async testConnection(): Promise<{ success: boolean; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('saved_trips')
        .select('count')
        .limit(1);
      
      if (error) {
        console.error('Database connection test failed:', error);
        return { success: false, error: error.message };
      }
      
      return { success: true };
    } catch (error) {
      console.error('Database connection test error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
}