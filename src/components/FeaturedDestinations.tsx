import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Mountain } from 'lucide-react';

interface FeaturedDestinationsProps {
  onNavigate: (page: string, searchQuery?: string) => void;
}

const FeaturedDestinations: React.FC<FeaturedDestinationsProps> = ({ onNavigate }) => {
  const [destinations, setDestinations] = useState<any[]>([]);

  const canadianCities = [
    { name: 'Toronto', province: 'Ontario', searchQuery: 'Toronto Ontario Canada' },
    { name: 'Vancouver', province: 'British Columbia', searchQuery: 'Vancouver British Columbia Canada' },
    { name: 'Montreal', province: 'Quebec', searchQuery: 'Montreal Quebec Canada' },
    { name: 'Calgary', province: 'Alberta', searchQuery: 'Calgary Alberta Canada' },
    { name: 'Ottawa', province: 'Ontario', searchQuery: 'Ottawa Ontario Canada' },
    { name: 'Edmonton', province: 'Alberta', searchQuery: 'Edmonton Alberta Canada' },
    { name: 'Quebec City', province: 'Quebec', searchQuery: 'Quebec City Quebec Canada' },
    { name: 'Winnipeg', province: 'Manitoba', searchQuery: 'Winnipeg Manitoba Canada' },
    { name: 'Halifax', province: 'Nova Scotia', searchQuery: 'Halifax Nova Scotia Canada' },
    { name: 'Victoria', province: 'British Columbia', searchQuery: 'Victoria British Columbia Canada' },
    { name: 'Saskatoon', province: 'Saskatchewan', searchQuery: 'Saskatoon Saskatchewan Canada' },
    { name: 'Regina', province: 'Saskatchewan', searchQuery: 'Regina Saskatchewan Canada' }
  ];

  const getRandomCities = () => {
    const shuffled = [...canadianCities].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  };

  useEffect(() => {
    setDestinations(getRandomCities());
  }, []);

  const handleCityClick = (city: any) => {
    // Navigate to explore page with the city search query
    onNavigate('explore-canada', city.searchQuery);
  };

  return (
    <Card className="border-blue-200">
      <CardContent className="p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Mountain className="h-5 w-5 text-blue-600" />
          <span className="font-bold text-gray-800">Featured Canadian Cities</span>
        </div>
        <p className="text-gray-600 mb-6">Explore popular destinations across Canada</p>
        <div className="grid md:grid-cols-3 gap-4">
          {destinations.map((city, index) => (
            <Button
              key={index}
              variant="outline"
              className="h-auto p-4 flex flex-col items-center space-y-2 border-blue-200 hover:border-blue-400 hover:bg-blue-50 transition-colors"
              onClick={() => handleCityClick(city)}
            >
              <MapPin className="h-6 w-6 text-blue-600" />
              <div className="text-center">
                <div className="font-semibold text-gray-800">{city.name}</div>
                <div className="text-sm text-gray-600">{city.province}</div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default FeaturedDestinations;