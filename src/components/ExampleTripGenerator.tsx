import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Calendar, MapPin, Clock, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { TripAPI } from '@/lib/tripAPI';
import { supabase } from '@/lib/supabase';

interface ExampleTripGeneratorProps {
  onTripCreated?: () => void;
}

const ExampleTripGenerator: React.FC<ExampleTripGeneratorProps> = ({ onTripCreated }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [generating, setGenerating] = useState(false);

  const generateExampleTrip = async () => {
    if (!user) return;
    
    setGenerating(true);
    try {
      // Create example trip
      const startDate = new Date();
      startDate.setDate(startDate.getDate() + 7); // Start in 7 days
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 4); // 5-day trip

      const { data: trip, error: tripError } = await TripAPI.createTrip({
        title: 'Toronto Explorer - Sample Trip',
        description: 'A sample 5-day trip exploring Toronto\'s best attractions, restaurants, and experiences.',
        destination: 'Toronto, Ontario, Canada',
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
        budget: 2500,
        travelers: 2,
        interests: ['Culture', 'Food', 'Sightseeing', 'Entertainment'],
        accommodation_type: 'hotel',
        transportation_mode: 'public_transit',
        status: 'planned'
      });

      if (tripError || !trip?.id) {
        throw new Error('Failed to create example trip');
      }

      // Add example activities for each day
      const exampleActivities = [
        // Day 1
        {
          name: 'CN Tower Visit',
          type: 'activity',
          day_number: 1,
          scheduled_time: '10:00',
          place_id: 'ChIJuzKRRs00K4gRPHq8NyKaWiE',
          notes: 'Book tickets in advance for EdgeWalk experience'
        },
        {
          name: 'Lunch at St. Lawrence Market',
          type: 'restaurant',
          day_number: 1,
          scheduled_time: '13:00',
          place_id: 'ChIJL3yqx800K4gRBQCKaLDHGQQ',
          notes: 'Try the famous peameal bacon sandwich'
        },
        {
          name: 'Ripley\'s Aquarium',
          type: 'activity',
          day_number: 1,
          scheduled_time: '15:30',
          place_id: 'ChIJtWvOl9Y0K4gRZOaVgr6kKQQ',
          notes: 'Great for families, allow 2-3 hours'
        },
        // Day 2
        {
          name: 'Casa Loma Castle',
          type: 'activity',
          day_number: 2,
          scheduled_time: '09:30',
          place_id: 'ChIJzxcfI6w0K4gRVvdQ1HQF8xA',
          notes: 'Explore the gardens and castle grounds'
        },
        {
          name: 'Kensington Market Exploration',
          type: 'activity',
          day_number: 2,
          scheduled_time: '14:00',
          place_id: 'ChIJzxcfI6w0K4gRVvdQ1HQF8xA',
          notes: 'Vintage shopping and street food'
        },
        // Day 3
        {
          name: 'Toronto Islands Ferry',
          type: 'transport',
          day_number: 3,
          scheduled_time: '10:00',
          place_id: 'ChIJzxcfI6w0K4gRVvdQ1HQF8xA',
          notes: 'Take ferry to Centre Island'
        },
        {
          name: 'Centreville Amusement Park',
          type: 'activity',
          day_number: 3,
          scheduled_time: '11:00',
          place_id: 'ChIJzxcfI6w0K4gRVvdQ1HQF8xA',
          notes: 'Perfect for families with children'
        },
        // Day 4
        {
          name: 'Royal Ontario Museum',
          type: 'activity',
          day_number: 4,
          scheduled_time: '10:00',
          place_id: 'ChIJzxcfI6w0K4gRVvdQ1HQF8xA',
          notes: 'Check out the dinosaur exhibits'
        },
        {
          name: 'Distillery District',
          type: 'activity',
          day_number: 4,
          scheduled_time: '15:00',
          place_id: 'ChIJzxcfI6w0K4gRVvdQ1HQF8xA',
          notes: 'Historic cobblestone streets and artisan shops'
        },
        // Day 5
        {
          name: 'Harbourfront Centre',
          type: 'activity',
          day_number: 5,
          scheduled_time: '10:00',
          place_id: 'ChIJzxcfI6w0K4gRVvdQ1HQF8xA',
          notes: 'Waterfront views and cultural events'
        },
        {
          name: 'Farewell Dinner at 360 Restaurant',
          type: 'restaurant',
          day_number: 5,
          scheduled_time: '19:00',
          place_id: 'ChIJzxcfI6w0K4gRVvdQ1HQF8xA',
          notes: 'Rotating restaurant with panoramic city views'
        }
      ];

      // Insert all activities
      for (const activity of exampleActivities) {
        await supabase
          .from('trip_items')
          .insert({
            trip_id: trip.id,
            ...activity
          });
      }

      toast({
        title: 'Example Trip Created!',
        description: 'A sample Toronto trip with scheduled activities has been created.'
      });

      if (onTripCreated) {
        onTripCreated();
      }
    } catch (error) {
      console.error('Error creating example trip:', error);
      toast({
        title: 'Error',
        description: 'Failed to create example trip. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Card className="border-dashed border-2 border-blue-200 bg-blue-50/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-800">
          <Sparkles className="h-5 w-5" />
          Try Our Example Trip
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-blue-600" />
            <span>Toronto, Ontario</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-blue-600" />
            <span>5 days</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-blue-600" />
            <span>2 travelers</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-blue-600" />
            <span>12 scheduled activities</span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">CN Tower</Badge>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">Casa Loma</Badge>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">Toronto Islands</Badge>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">ROM</Badge>
        </div>
        
        <p className="text-sm text-gray-600">
          Generate a complete sample trip with daily schedules, time slots, and place IDs. 
          Perfect for exploring the scheduling features!
        </p>
        
        <Button 
          onClick={generateExampleTrip} 
          disabled={generating || !user}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          <Sparkles className="h-4 w-4 mr-2" />
          {generating ? 'Creating Example Trip...' : 'Generate Example Trip'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ExampleTripGenerator;