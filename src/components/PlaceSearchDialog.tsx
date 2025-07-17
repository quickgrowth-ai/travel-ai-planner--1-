import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, MapPin, Star, Plus } from 'lucide-react';
import { examplePlaces } from '@/data/examplePlaces';

interface PlaceSearchDialogProps {
  onPlaceSelect: (place: any) => void;
  trigger: React.ReactNode;
}

const PlaceSearchDialog: React.FC<PlaceSearchDialogProps> = ({ onPlaceSelect, trigger }) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPlaces, setFilteredPlaces] = useState(examplePlaces);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredPlaces(examplePlaces);
      return;
    }
    
    const filtered = examplePlaces.filter(place => 
      place.name.toLowerCase().includes(query.toLowerCase()) ||
      place.description.toLowerCase().includes(query.toLowerCase()) ||
      place.location.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredPlaces(filtered);
  };

  const handlePlaceSelect = (place: any) => {
    onPlaceSelect({
      name: place.name,
      place_id: place.placeId,
      description: place.description,
      location: place.location
    });
    setOpen(false);
    setSearchQuery('');
    setFilteredPlaces(examplePlaces);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Search Places</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search for places, attractions, restaurants..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-3">
              {filteredPlaces.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No places found matching your search.</p>
              ) : (
                filteredPlaces.map((place) => (
                  <Card key={place.placeId} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-medium text-gray-800">{place.name}</h3>
                          {place.rating && (
                            <div className="flex items-center gap-1 text-sm text-yellow-600">
                              <Star className="h-3 w-3 fill-current" />
                              <span>{place.rating}</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                          <MapPin className="h-3 w-3" />
                          <span>{place.location}</span>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-3">{place.description}</p>
                        
                        <div className="text-xs text-gray-500 font-mono bg-gray-50 p-2 rounded">
                          Place ID: {place.placeId}
                        </div>
                      </div>
                      
                      <Button
                        onClick={() => handlePlaceSelect(place)}
                        size="sm"
                        className="ml-4 bg-blue-600 hover:bg-blue-700"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Select
                      </Button>
                    </div>
                    
                    {place.image && (
                      <img 
                        src={place.image} 
                        alt={place.name}
                        className="w-full h-32 object-cover rounded mt-3"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    )}
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PlaceSearchDialog;