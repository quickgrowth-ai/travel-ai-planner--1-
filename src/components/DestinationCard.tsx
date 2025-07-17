import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { getCorrectImageForPlace, getFallbackImage } from '@/lib/imageValidation';

interface DestinationCardProps {
  name: string;
  country: string;
  image: string;
  onClick: () => void;
  placeId?: string;
  photos?: any[];
}

const DestinationCard: React.FC<DestinationCardProps> = ({ name, country, image, onClick, placeId, photos }) => {
  const [currentImage, setCurrentImage] = useState<string>(getFallbackImage());
  const [imageLoading, setImageLoading] = useState(true);

  useEffect(() => {
    const loadCorrectImage = async () => {
      setImageLoading(true);
      try {
        console.log('Loading image for destination:', name, 'with photos:', photos?.length || 0);
        
        const correctImage = await getCorrectImageForPlace({
          name,
          image,
          placeId: placeId || '',
          photos: photos || []
        });
        
        console.log('Got image for destination', name, ':', correctImage);
        setCurrentImage(correctImage);
      } catch (error) {
        console.error('Error loading image for destination:', name, error);
        setCurrentImage(getFallbackImage());
      } finally {
        setImageLoading(false);
      }
    };

    loadCorrectImage();
  }, [name, image, placeId, photos]);

  const handleImageError = () => {
    console.warn('Image failed to load for destination:', name);
    setCurrentImage(getFallbackImage());
    setImageLoading(false);
  };

  return (
    <Card className="cursor-pointer hover:shadow-lg transition-shadow duration-200" onClick={onClick}>
      <CardContent className="p-0">
        <div className="relative">
          <div className="h-32 bg-gray-200 relative overflow-hidden">
            {imageLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <div className="animate-pulse text-gray-400 text-sm">Loading...</div>
              </div>
            )}
            <img 
              src={currentImage}
              alt={name}
              className={`w-full h-full object-cover rounded-t-lg transition-opacity duration-300 ${
                imageLoading ? 'opacity-0' : 'opacity-100'
              }`}
              onError={handleImageError}
              onLoad={() => setImageLoading(false)}
              loading="lazy"
            />
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-lg text-gray-800">{name}</h3>
            <p className="text-gray-600 text-sm">{country}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DestinationCard;