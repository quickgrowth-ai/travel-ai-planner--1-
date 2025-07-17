import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { MapPin, Camera } from 'lucide-react';
import { getCorrectImageForPlace, getFallbackImage } from '@/lib/imageValidation';

interface DestinationImage {
  id: string;
  url: string;
  title: string;
  description: string;
  placeId?: string;
  photos?: any[];
}

interface DestinationImageGalleryProps {
  destination: string;
  photos?: any[];
  placeId?: string;
}

const ImageCard = ({ image }: { image: DestinationImage }) => {
  const [currentImage, setCurrentImage] = useState<string>(getFallbackImage());
  const [imageLoading, setImageLoading] = useState(true);

  useEffect(() => {
    const loadCorrectImage = async () => {
      setImageLoading(true);
      try {
        const correctImage = await getCorrectImageForPlace({
          name: image.title,
          image: image.url,
          placeId: image.placeId || '',
          photos: image.photos || []
        });
        
        setCurrentImage(correctImage);
      } catch (error) {
        console.error('Error loading gallery image:', image.title, error);
        setCurrentImage(getFallbackImage());
      } finally {
        setImageLoading(false);
      }
    };

    loadCorrectImage();
  }, [image.id, image.url, image.placeId, image.photos]);

  const handleImageError = () => {
    setCurrentImage(getFallbackImage());
    setImageLoading(false);
  };

  return (
    <div className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
      {imageLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
          <div className="animate-pulse text-gray-400 text-sm">Loading...</div>
        </div>
      )}
      <img 
        src={currentImage}
        alt={image.title}
        className={`w-full h-48 object-cover group-hover:scale-105 transition-all duration-300 ${
          imageLoading ? 'opacity-0' : 'opacity-100'
        }`}
        onError={handleImageError}
        onLoad={() => setImageLoading(false)}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <h3 className="font-semibold text-lg mb-1">{image.title}</h3>
          <p className="text-sm text-gray-200">{image.description}</p>
        </div>
      </div>
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
          <MapPin className="h-4 w-4 text-white" />
        </div>
      </div>
    </div>
  );
};

const DestinationImageGallery: React.FC<DestinationImageGalleryProps> = ({ destination, photos, placeId }) => {
  const getCanadianDestinationImages = (dest: string): DestinationImage[] => {
    const canadianImages: { [key: string]: DestinationImage[] } = {
      'Toronto': [
        {
          id: '1',
          url: 'https://images.unsplash.com/photo-1517935706615-2717063c2225?w=600&h=400&fit=crop',
          title: 'CN Tower & Skyline',
          description: 'Iconic Toronto skyline with CN Tower dominating the view'
        },
        {
          id: '2', 
          url: 'https://images.unsplash.com/photo-1582650625119-3a31f8fa2699?w=600&h=400&fit=crop',
          title: 'Distillery District',
          description: 'Historic cobblestone streets and Victorian architecture'
        },
        {
          id: '3',
          url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&h=400&fit=crop',
          title: 'Casa Loma',
          description: 'Gothic Revival castle and gardens in midtown Toronto'
        }
      ],
      'Montreal': [
        {
          id: '1',
          url: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=600&h=400&fit=crop',
          title: 'Old Montreal',
          description: 'Historic French colonial architecture and cobblestone streets'
        },
        {
          id: '2', 
          url: 'https://images.unsplash.com/photo-1518904618719-1f0e4d1e8e4c?w=600&h=400&fit=crop',
          title: 'Notre-Dame Basilica',
          description: 'Stunning Gothic Revival basilica with intricate interior'
        }
      ],
      'Vancouver': [
        {
          id: '1',
          url: 'https://images.unsplash.com/photo-1549880338-65ddcdfd017b?w=600&h=400&fit=crop',
          title: 'Stanley Park Seawall',
          description: 'Scenic waterfront path with mountain and ocean views'
        },
        {
          id: '2', 
          url: 'https://images.unsplash.com/photo-1582650625119-3a31f8fa2699?w=600&h=400&fit=crop',
          title: 'Granville Island',
          description: 'Artisan markets, galleries, and waterfront dining'
        }
      ]
    };
    
    return canadianImages[dest] || [
      {
        id: '1',
        url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
        title: `${dest} Landscape`,
        description: 'Beautiful Canadian natural scenery and wilderness',
        placeId,
        photos
      },
      {
        id: '2', 
        url: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&h=400&fit=crop',
        title: `${dest} Downtown`,
        description: 'Charming Canadian city center and local architecture',
        placeId,
        photos
      }
    ];
  };

  const images = getCanadianDestinationImages(destination);

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-800">
          <Camera className="h-5 w-5" />
          Explore {destination}, Canada
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((image) => (
            <ImageCard key={image.id} image={image} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DestinationImageGallery;