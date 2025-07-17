import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MapPin, Star, Globe, Thermometer } from 'lucide-react';
import { PlaceResult } from '@/lib/googleMaps';

interface DestinationDetailsProps {
  destination: any;
  onBack: () => void;
}

const DestinationDetails: React.FC<DestinationDetailsProps> = ({ destination, onBack }) => {
  const renderPlaceCard = (place: PlaceResult, index: number) => {
    // Convert object to plain object to avoid React error #31
    const plainPlace = {
      name: place.name || '',
      description: place.description || '',
      image: place.image || '',
      rating: place.rating || 0,
      address: place.address || '',
      placeId: place.placeId || '',
      websiteUri: place.websiteUri || '',
      type: place.type || ''
    };

    return (
      <Card key={index} className="border-blue-100 hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          {plainPlace.image && (
            <div className="h-32 bg-cover bg-center rounded-lg mb-3" 
                 style={{backgroundImage: `url(${plainPlace.image})`}}>
            </div>
          )}
          <h4 className="font-semibold text-gray-800 mb-1">{plainPlace.name}</h4>
          <p className="text-sm text-gray-600 mb-2">{plainPlace.address}</p>
          {plainPlace.rating > 0 && (
            <div className="flex items-center space-x-1 mb-2">
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
              <span className="text-sm">{plainPlace.rating}</span>
            </div>
          )}
          {plainPlace.websiteUri && (
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full text-xs"
              onClick={() => window.open(plainPlace.websiteUri, '_blank')}
            >
              <Globe className="h-3 w-3 mr-1" />
              Visit Website
            </Button>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderSection = (title: string, items: PlaceResult[], icon: React.ReactNode) => (
    <Card className="border-blue-200">
      <CardHeader className="bg-blue-50">
        <CardTitle className="text-gray-800 flex items-center space-x-2">
          {icon}
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items && items.map((item, index) => renderPlaceCard(item, index))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 p-4">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-6">
          <Button 
            onClick={onBack}
            variant="outline"
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div className="relative h-64 rounded-lg overflow-hidden mb-6">
            <div 
              className="w-full h-full bg-cover bg-center"
              style={{backgroundImage: `url(${destination.image})`}}
            >
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
                <div className="p-6 text-white">
                  <h1 className="text-4xl font-bold mb-2">{destination.name}</h1>
                  <p className="text-xl mb-2">{destination.province}</p>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Thermometer className="h-4 w-4" />
                      <span>{destination.temperature}</span>
                    </div>
                    <Badge variant="secondary" className="bg-white/20 text-white">
                      {destination.season}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3">Popular Activities</h2>
            <div className="flex flex-wrap gap-2">
              {destination.activities && destination.activities.map((activity: string, index: number) => (
                <Badge key={index} variant="outline" className="border-blue-300 text-blue-700">
                  {activity}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {destination.attractions && destination.attractions.length > 0 && 
            renderSection('Top Attractions', destination.attractions, <MapPin className="h-5 w-5 text-blue-600" />)
          }
          
          {destination.restaurants && destination.restaurants.length > 0 && 
            renderSection('Restaurants', destination.restaurants, <span className="text-blue-600">🍽️</span>)
          }
          
          {destination.hotels && destination.hotels.length > 0 && 
            renderSection('Hotels', destination.hotels, <span className="text-blue-600">🏨</span>)
          }
          
          {destination.activities && destination.activities.length > 0 && 
            renderSection('Activities', destination.activities, <span className="text-blue-600">🎯</span>)
          }
        </div>
      </div>
    </div>
  );
};

export default DestinationDetails;