import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Calendar, Clock, MapPin, Plus, X, Save } from 'lucide-react';

interface ItineraryItem {
  id: string;
  name: string;
  time: string;
  duration: string;
  type: 'attraction' | 'restaurant' | 'hotel' | 'activity';
}

interface ItineraryBuilderProps {
  destination: string;
  savedItems: any[];
}

const ItineraryBuilder: React.FC<ItineraryBuilderProps> = ({ destination, savedItems }) => {
  const [itinerary, setItinerary] = useState<ItineraryItem[]>([]);
  const [tripName, setTripName] = useState(`${destination} Adventure`);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const addToItinerary = (item: any) => {
    const newItem: ItineraryItem = {
      id: Date.now().toString(),
      name: item.name,
      time: '09:00',
      duration: item.duration || '2 hours',
      type: item.type || 'attraction'
    };
    setItinerary([...itinerary, newItem]);
  };

  const removeFromItinerary = (id: string) => {
    setItinerary(itinerary.filter(item => item.id !== id));
  };

  const updateTime = (id: string, time: string) => {
    setItinerary(itinerary.map(item => 
      item.id === id ? { ...item, time } : item
    ));
  };

  const saveItinerary = () => {
    const itineraryData = {
      name: tripName,
      destination,
      date: selectedDate,
      items: itinerary
    };
    console.log('Saving itinerary:', itineraryData);
    // Here you would typically save to backend
    alert('Itinerary saved successfully!');
  };

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-800">
          <Calendar className="h-5 w-5" />
          Build Your Itinerary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Saved Items */}
          <div>
            <h3 className="font-semibold mb-4">Saved Recommendations</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {savedItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-sm text-gray-600">{item.duration}</p>
                  </div>
                  <Button 
                    size="sm" 
                    onClick={() => addToItinerary(item)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {savedItems.length === 0 && (
                <p className="text-gray-500 text-center py-8">No saved items yet. Add some recommendations first!</p>
              )}
            </div>
          </div>

          {/* Itinerary Builder */}
          <div>
            <div className="mb-4">
              <Input
                value={tripName}
                onChange={(e) => setTripName(e.target.value)}
                className="font-semibold text-lg mb-2"
                placeholder="Trip name"
              />
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="mb-4"
              />
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {itinerary.map((item, index) => (
                <div key={item.id} className="flex items-center gap-3 p-3 bg-white border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="font-medium">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <Input
                          type="time"
                          value={item.time}
                          onChange={(e) => updateTime(item.id, e.target.value)}
                          className="w-20 h-6 text-xs"
                        />
                      </div>
                      <span>{item.duration}</span>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => removeFromItinerary(item.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {itinerary.length === 0 && (
                <p className="text-gray-500 text-center py-8">Your itinerary is empty. Add items from your saved recommendations!</p>
              )}
            </div>

            {itinerary.length > 0 && (
              <Button 
                onClick={saveItinerary}
                className="w-full mt-4 bg-green-600 hover:bg-green-700"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Itinerary
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ItineraryBuilder;