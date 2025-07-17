import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Clock, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { supabase } from '@/lib/supabase';
import { Trip } from '@/lib/tripAPI';

interface TripItem {
  id: string;
  trip_id: string;
  place_id?: string;
  day_number?: number;
  scheduled_time?: string;
  notes?: string;
  title?: string;
  type?: string;
  location?: string;
  created_at: string;
}

interface TripPlace {
  id: string;
  title: string;
  type: string;
  location?: string;
  place_id?: string;
}

interface TripSchedulerProps {
  trip: Trip;
}

const TripScheduler: React.FC<TripSchedulerProps> = ({ trip }) => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [items, setItems] = useState<TripItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [tripPlaces, setTripPlaces] = useState<TripPlace[]>([]);
  const [newItem, setNewItem] = useState({
    selected_place_id: '',
    day_number: 1,
    scheduled_time: '',
    notes: ''
  });

  const tripDays = React.useMemo(() => {
    const start = new Date(trip.start_date);
    const end = new Date(trip.end_date);
    const days = [];
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      days.push(new Date(d));
    }
    return days;
  }, [trip.start_date, trip.end_date]);

  useEffect(() => {
    loadTripItems();
    loadTripPlaces();
  }, [trip.id]);

  const loadTripPlaces = async () => {
    try {
      const { data, error } = await supabase
        .from('trip_items')
        .select('*')
        .eq('trip_id', trip.id);
      
      if (error) throw error;
      
      const unscheduledPlaces = (data || []).filter(item => 
        !item.day_number || !item.scheduled_time
      );
      
      const places: TripPlace[] = unscheduledPlaces.map(item => ({
        id: item.id,
        title: item.title || 'Unnamed Place',
        type: item.type || 'activity',
        location: item.location,
        place_id: item.place_id
      }));
      
      setTripPlaces(places);
    } catch (error) {
      console.error('Error loading trip places:', error);
    }
  };

  const loadTripItems = async () => {
    if (!trip.id) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('trip_items')
        .select('*')
        .eq('trip_id', trip.id)
        .not('day_number', 'is', null)
        .not('scheduled_time', 'is', null)
        .order('day_number', { ascending: true })
        .order('scheduled_time', { ascending: true });
      
      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Error loading trip items:', error);
      toast({
        title: 'Error',
        description: 'Failed to load trip items',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const schedulePlace = async () => {
    if (!newItem.selected_place_id || !trip.id) return;
    
    try {
      const { error } = await supabase
        .from('trip_items')
        .update({
          day_number: newItem.day_number,
          scheduled_time: newItem.scheduled_time || null,
          notes: newItem.notes || null
        })
        .eq('id', newItem.selected_place_id);
      
      if (error) throw error;
      
      await loadTripItems();
      await loadTripPlaces();
      
      setNewItem({
        selected_place_id: '',
        day_number: 1,
        scheduled_time: '',
        notes: ''
      });
      
      toast({
        title: 'Success',
        description: 'Place scheduled successfully'
      });
    } catch (error) {
      console.error('Error scheduling place:', error);
      toast({
        title: 'Error',
        description: 'Failed to schedule place',
        variant: 'destructive'
      });
    }
  };

  const unscheduleItem = async (itemId: string) => {
    try {
      const { error } = await supabase
        .from('trip_items')
        .update({
          day_number: null,
          scheduled_time: null,
          notes: null
        })
        .eq('id', itemId);
      
      if (error) throw error;
      
      await loadTripItems();
      await loadTripPlaces();
      
      toast({
        title: 'Success',
        description: 'Place unscheduled successfully'
      });
    } catch (error) {
      console.error('Error unscheduling item:', error);
      toast({
        title: 'Error',
        description: 'Failed to unschedule place',
        variant: 'destructive'
      });
    }
  };

  const getItemsForDay = (dayNumber: number) => {
    return items.filter(item => item.day_number === dayNumber);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: isMobile ? 'short' : 'long',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className={`space-y-${isMobile ? '4' : '6'}`}>
      <Card>
        <CardHeader className={isMobile ? 'p-4 pb-2' : ''}>
          <CardTitle className={`flex items-center gap-2 ${isMobile ? 'text-lg' : ''}`}>
            <Plus className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'}`} />
            {isMobile ? 'Schedule' : 'Schedule Activity'}
          </CardTitle>
        </CardHeader>
        <CardContent className={`space-y-4 ${isMobile ? 'p-4 pt-2' : ''}`}>
          <div className={`grid ${isMobile ? 'grid-cols-1 gap-3' : 'grid-cols-1 md:grid-cols-3 gap-4'}`}>
            <Select
              value={newItem.selected_place_id}
              onValueChange={(value) => setNewItem(prev => ({ ...prev, selected_place_id: value }))}
            >
              <SelectTrigger className={isMobile ? 'h-10' : ''}>
                <SelectValue placeholder={isMobile ? 'Select place' : 'Select place to schedule'} />
              </SelectTrigger>
              <SelectContent>
                {tripPlaces.map((place) => (
                  <SelectItem key={place.id} value={place.id}>
                    {place.title} ({place.type})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select
              value={newItem.day_number.toString()}
              onValueChange={(value) => setNewItem(prev => ({ ...prev, day_number: parseInt(value) }))}
            >
              <SelectTrigger className={isMobile ? 'h-10' : ''}>
                <SelectValue placeholder="Select day" />
              </SelectTrigger>
              <SelectContent>
                {tripDays.map((day, index) => (
                  <SelectItem key={index} value={(index + 1).toString()}>
                    Day {index + 1} - {formatDate(day)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Input
              type="time"
              value={newItem.scheduled_time}
              onChange={(e) => setNewItem(prev => ({ ...prev, scheduled_time: e.target.value }))}
              placeholder="Select time"
              className={isMobile ? 'h-10' : ''}
            />
          </div>
          
          <Textarea
            placeholder="Notes (optional)"
            value={newItem.notes}
            onChange={(e) => setNewItem(prev => ({ ...prev, notes: e.target.value }))}
            className={`resize-none ${isMobile ? 'min-h-[80px]' : ''}`}
          />
          
          <Button onClick={schedulePlace} disabled={!newItem.selected_place_id} size={isMobile ? 'sm' : 'default'}>
            <Plus className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} mr-2`} />
            {isMobile ? 'Schedule' : 'Schedule Place'}
          </Button>
        </CardContent>
      </Card>

      <div className={`space-y-${isMobile ? '3' : '4'}`}>
        {tripDays.map((day, dayIndex) => {
          const dayNumber = dayIndex + 1;
          const dayItems = getItemsForDay(dayNumber);
          
          return (
            <Card key={dayIndex}>
              <CardHeader className={isMobile ? 'p-4 pb-2' : ''}>
                <CardTitle className={`flex items-center gap-2 ${isMobile ? 'text-base' : ''}`}>
                  <Calendar className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'}`} />
                  Day {dayNumber} - {formatDate(day)}
                  <Badge variant="secondary" className={isMobile ? 'text-xs' : ''}>{dayItems.length} activities</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className={isMobile ? 'p-4 pt-2' : ''}>
                {dayItems.length === 0 ? (
                  <p className={`text-gray-500 text-center py-4 ${isMobile ? 'text-sm' : ''}`}>No activities scheduled for this day</p>
                ) : (
                  <div className={`space-y-${isMobile ? '2' : '3'}`}>
                    {dayItems.map((item) => (
                      <div key={item.id} className={`flex items-start gap-3 ${isMobile ? 'p-3' : 'p-4'} border rounded-lg bg-white shadow-sm`}>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className={`font-medium text-gray-900 truncate ${isMobile ? 'text-sm' : ''}`}>{item.title}</h4>
                            {item.type && (
                              <Badge variant="outline" className={`${isMobile ? 'text-xs px-1' : 'text-xs'} capitalize flex-shrink-0`}>
                                {item.type}
                              </Badge>
                            )}
                          </div>
                          
                          <div className={`space-y-1 ${isMobile ? 'text-xs' : 'text-sm'} text-gray-600`}>
                            {item.scheduled_time && (
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span className="font-medium">{item.scheduled_time}</span>
                              </div>
                            )}
                            {item.location && (
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                <span className="truncate">{item.location}</span>
                              </div>
                            )}
                            {item.notes && (
                              <p className={`text-gray-500 ${isMobile ? 'text-xs' : 'text-xs'}`}>{item.notes}</p>
                            )}
                          </div>
                        </div>
                        
                        <Button
                          onClick={() => unscheduleItem(item.id)}
                          size={isMobile ? 'sm' : 'sm'}
                          variant="outline"
                          className="flex-shrink-0"
                        >
                          {isMobile ? 'Remove' : 'Unschedule'}
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default TripScheduler;