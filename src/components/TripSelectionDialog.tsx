import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTrip } from '@/contexts/TripContext';
import { PlaceResult } from '@/lib/googleMaps';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

interface TripSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  place: PlaceResult | null;
  onSuccess: () => void;
}

const TripSelectionDialog = ({ open, onOpenChange, place, onSuccess }: TripSelectionDialogProps) => {
  const [selectedTripId, setSelectedTripId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const { trips } = useTrip();
  const { toast } = useToast();

  const selectedTrip = trips.find(trip => trip.id === selectedTripId);

  const handleAddToTrip = async () => {
    if (!selectedTripId || !place) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('trip_items')
        .insert([{
          trip_id: selectedTripId,
          title: place.name,
          type: 'activity',
          location: place.address,
          place_id: place.placeId || null,
          notes: place.description || null
        }]);
      
      if (error) throw error;
      
      toast({
        title: 'Added to Trip!',
        description: `"${place.name}" has been added to "${selectedTrip?.title}" and is available for scheduling`,
      });

      onSuccess();
      onOpenChange(false);
      setSelectedTripId('');
    } catch (error) {
      console.error('Error adding to trip:', error);
      toast({
        title: 'Error',
        description: 'Failed to add place to trip. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-md mx-2 sm:mx-0">
        <DialogHeader className="pb-2 sm:pb-4">
          <DialogTitle className="text-lg sm:text-xl pr-8">Add to Trip</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 sm:space-y-4">
          <p className="text-sm text-gray-600">
            Add <strong className="break-words">{place?.name}</strong> to your trip:
          </p>
          
          <div className="space-y-2">
            <Label htmlFor="trip-select" className="text-sm font-medium">Select Trip</Label>
            <Select value={selectedTripId} onValueChange={setSelectedTripId}>
              <SelectTrigger id="trip-select" className="h-9 sm:h-10">
                <SelectValue placeholder="Select a trip" />
              </SelectTrigger>
              <SelectContent>
                {trips.map((trip) => (
                  <SelectItem key={trip.id} value={trip.id} className="text-sm">
                    <div className="truncate">
                      {trip.title} - {trip.destination}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {place?.placeId && (
            <div className="text-xs text-gray-500 font-mono bg-gray-50 p-2 rounded break-all">
              Place ID: {place.placeId}
            </div>
          )}

          {trips.length === 0 && (
            <p className="text-sm text-amber-600 bg-amber-50 p-3 rounded">
              You don't have any trips yet. Create a trip first to add places to it.
            </p>
          )}

          <p className="text-xs text-gray-500 bg-blue-50 p-2 rounded">
            Note: After adding, you can schedule this place using the "Schedule Activity" section in your trip.
          </p>
        </div>
        <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0 pt-4">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)} 
            disabled={loading}
            className="w-full sm:w-auto order-2 sm:order-1 h-9 sm:h-10"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleAddToTrip} 
            disabled={!selectedTripId || trips.length === 0 || loading}
            className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto order-1 sm:order-2 h-9 sm:h-10"
          >
            {loading ? 'Adding...' : 'Add to Trip'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export { TripSelectionDialog };
export default TripSelectionDialog;