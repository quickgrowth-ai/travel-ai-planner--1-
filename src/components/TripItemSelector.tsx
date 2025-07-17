import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, ExternalLink, Plus, Bot, MapPin } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';
import { useTripContext } from '@/contexts/TripContext';

interface Trip {
  id: string;
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
}

interface TripItemSelectorProps {
  trips: Trip[];
  onAddItemToTrip: (tripId: string, itemId: string) => void;
  onNavigate?: (page: string) => void;
}

const TripItemSelector: React.FC<TripItemSelectorProps> = ({ trips, onAddItemToTrip, onNavigate }) => {
  const { tripItems, removeFromTrip } = useAppContext();
  const { trips: contextTrips, tripItems: contextTripItems } = useTripContext();
  const [selectedTrip, setSelectedTrip] = React.useState<string>('');

  // Combine items from both contexts
  const allTripItems = React.useMemo(() => {
    const appItems = tripItems.map(item => ({ ...item, source: 'chatbot' }));
    const contextItems = contextTrips.flatMap(trip => 
      trip.items?.map(item => ({ 
        ...item, 
        source: 'explore',
        addedAt: new Date()
      })) || []
    );
    return [...appItems, ...contextItems];
  }, [tripItems, contextTrips]);

  const handleVisitWebsite = (website: string) => {
    window.open(website, '_blank', 'noopener,noreferrer');
  };

  const handleAddToTrip = (itemId: string) => {
    if (!selectedTrip) {
      alert('Please select a trip first');
      return;
    }
    onAddItemToTrip(selectedTrip, itemId);
  };

  const handleRemoveItem = (itemId: string, source: string) => {
    if (source === 'chatbot') {
      removeFromTrip(itemId);
    }
    // For explore items, they're managed by TripContext automatically
  };

  return (
    <Card className="border-blue-200 shadow-lg">
      <CardHeader className="bg-blue-50">
        <CardTitle className="text-gray-800 text-lg">🍁 Trip Items</CardTitle>
        <CardDescription>
          {allTripItems.length === 0 ? 'No items added yet' : `${allTripItems.length} item${allTripItems.length !== 1 ? 's' : ''} available`}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        {trips.length > 0 && (
          <div className="mb-4">
            <label className="text-sm font-medium text-gray-700 mb-2 block">Select Trip to Add Items:</label>
            <Select onValueChange={setSelectedTrip}>
              <SelectTrigger className="border-blue-200">
                <SelectValue placeholder="Choose a trip" />
              </SelectTrigger>
              <SelectContent>
                {trips.map((trip) => (
                  <SelectItem key={trip.id} value={trip.id}>
                    {trip.name} - {trip.destination}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {allTripItems.length === 0 ? (
          <div className="text-center py-8 space-y-4">
            <p className="text-gray-500">No items added yet</p>
            <div className="flex flex-col gap-2">
              <Button 
                onClick={() => onNavigate?.('chatbot')}
                variant="outline" 
                className="flex items-center gap-2 text-blue-600 border-blue-200 hover:bg-blue-50"
              >
                <Bot className="h-4 w-4" />
                Use AI Chatbot
              </Button>
              <Button 
                onClick={() => onNavigate?.('explore-canada')}
                variant="outline" 
                className="flex items-center gap-2 text-green-600 border-green-200 hover:bg-green-50"
              >
                <MapPin className="h-4 w-4" />
                Explore Canada
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {allTripItems.map((item) => (
              <div key={`${item.id}-${item.source}`} className="border border-blue-200 rounded-lg p-3">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-gray-800 text-sm">{item.name}</h4>
                    {item.source === 'chatbot' ? (
                      <Bot className="h-3 w-3 text-blue-500" title="Added via AI Chatbot" />
                    ) : (
                      <MapPin className="h-3 w-3 text-green-500" title="Added via Explore Canada" />
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleRemoveItem(item.id, item.source)}
                    className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
                <p className="text-xs text-gray-600 mb-2">{item.description}</p>
                {item.address && (
                  <p className="text-xs text-gray-500 mb-2">{item.address}</p>
                )}
                {item.rating && (
                  <p className="text-xs text-yellow-600 mb-2">⭐ {item.rating}/5</p>
                )}
                {item.image && (
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-full h-20 object-cover rounded mb-2"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                )}
                <div className="flex gap-2">
                  {item.website && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleVisitWebsite(item.website!)}
                      className="flex-1 text-xs flex items-center gap-1 text-blue-600 border-blue-200 hover:bg-blue-50"
                    >
                      <ExternalLink className="h-3 w-3" />
                      Website
                    </Button>
                  )}
                  {trips.length > 0 && (
                    <Button
                      size="sm"
                      onClick={() => handleAddToTrip(item.id)}
                      className="flex-1 text-xs bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add to Trip
                    </Button>
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

export default TripItemSelector;