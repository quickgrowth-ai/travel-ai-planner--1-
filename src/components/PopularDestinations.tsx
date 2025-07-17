import React from 'react';
import DestinationCard from './DestinationCard';
import { Button } from '@/components/ui/button';

interface PopularDestinationsProps {
  onDestinationSelect: (destination: string) => void;
}

const PopularDestinations: React.FC<PopularDestinationsProps> = ({ onDestinationSelect }) => {
  const destinations = [
    { 
      name: 'Toronto', 
      country: 'Canada', 
      image: 'https://images.unsplash.com/photo-1517935706615-2717063c2225?w=400&h=300&fit=crop' 
    },
    { 
      name: 'Montreal', 
      country: 'Canada', 
      image: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=400&h=300&fit=crop' 
    },
    { 
      name: 'Canmore', 
      country: 'Canada', 
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop' 
    },
    { 
      name: 'Victoria', 
      country: 'Canada', 
      image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop' 
    },
    { 
      name: 'Quebec City', 
      country: 'Canada', 
      image: 'https://images.unsplash.com/photo-1518904618719-1f0e4d1e8e4c?w=400&h=300&fit=crop' 
    },
    { 
      name: 'Vancouver', 
      country: 'Canada', 
      image: 'https://images.unsplash.com/photo-1549880338-65ddcdfd017b?w=400&h=300&fit=crop' 
    }
  ];

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-semibold text-center mb-8 text-gray-800">
        Or get started with a popular Canadian destination
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
        {destinations.map((destination) => (
          <DestinationCard
            key={destination.name}
            name={destination.name}
            country={destination.country}
            image={destination.image}
            onClick={() => onDestinationSelect(destination.name)}
          />
        ))}
      </div>
      
      <div className="text-right">
        <Button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full">
          Next
        </Button>
      </div>
    </div>
  );
};

export default PopularDestinations;