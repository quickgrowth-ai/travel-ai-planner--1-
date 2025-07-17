import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ExternalLink, Plus, Star } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { PlaceResult } from '@/lib/googleMaps';

interface PlaceCardProps {
  place: PlaceResult;
  onAddToTrip: (place: PlaceResult) => void;
  onGetAIOverview?: (place: PlaceResult) => void;
}

const PlaceCard = ({ place, onAddToTrip, onGetAIOverview }: PlaceCardProps) => {
  const { t } = useLanguage();
  
  const handleVisitWebsite = (website: string) => {
    window.open(website, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card className="p-4 bg-white border border-blue-200">
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <h4 className="font-medium text-gray-800 text-sm">{place.name}</h4>
          {place.rating && (
            <div className="flex items-center gap-1 text-xs text-yellow-600">
              <Star className="h-3 w-3 fill-current" />
              <span>{place.rating}</span>
            </div>
          )}
        </div>
        
        <p className="text-xs text-gray-600 line-clamp-2">{place.description}</p>
        
        {place.image && (
          <img 
            src={place.image} 
            alt={place.name}
            className="w-full h-24 object-cover rounded"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        )}
        
        <div className="flex gap-2">
          {place.websiteUri && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleVisitWebsite(place.websiteUri!)}
              className="flex items-center gap-1 text-xs text-blue-600 border-blue-200 hover:bg-blue-50"
            >
              <ExternalLink className="h-3 w-3" />
              {t('website')}
            </Button>
          )}
          <Button
            size="sm"
            onClick={() => onAddToTrip(place)}
            className="flex items-center gap-1 text-xs bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="h-3 w-3" />
            {t('addToTrip')}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default PlaceCard;