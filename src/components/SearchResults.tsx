import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Star, Clock, DollarSign, MapPin, Plus } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { getCorrectImageForPlace, getFallbackImage } from '@/lib/imageValidation';
import { useState, useEffect } from 'react';
import { TripSelectionDialog } from '@/components/TripSelectionDialog';
import { PlaceResult } from '@/lib/googleMaps';

interface SearchResult {
  id: string;
  name: string;
  description: string;
  type: 'attraction' | 'restaurant' | 'hotel' | 'activity';
  rating: number;
  location: string;
  duration?: string;
  price?: string;
  image: string;
  placeId?: string;
  photos?: any[];
}

interface SearchResultsProps {
  results: SearchResult[];
  loading: boolean;
  error: string | null;
  hasMore?: boolean;
  onLoadMore?: () => void;
  loadingProgress?: number;
}

const SearchResultCard = ({ result }: { result: SearchResult }) => {
  const [currentImage, setCurrentImage] = useState<string>(getFallbackImage());
  const [imageLoading, setImageLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { t } = useLanguage();
  const isMobile = useIsMobile();

  useEffect(() => {
    const loadCorrectImage = async () => {
      setImageLoading(true);
      try {
        const correctImage = await getCorrectImageForPlace({
          name: result.name,
          image: result.image,
          placeId: result.placeId || result.id,
          photos: result.photos || []
        });
        
        setCurrentImage(correctImage);
      } catch (error) {
        console.error('Error loading image for search result:', result.name, error);
        setCurrentImage(getFallbackImage());
      } finally {
        setImageLoading(false);
      }
    };

    loadCorrectImage();
  }, [result.id, result.image, result.placeId, result.photos]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'attraction': return 'bg-blue-100 text-blue-800';
      case 'restaurant': return 'bg-green-100 text-green-800';
      case 'hotel': return 'bg-purple-100 text-purple-800';
      case 'activity': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleImageError = () => {
    setCurrentImage(getFallbackImage());
    setImageLoading(false);
  };

  const placeData: PlaceResult = {
    name: result.name,
    address: result.location,
    placeId: result.placeId || result.id,
    description: result.description,
    rating: result.rating,
    image: currentImage
  };

  return (
    <>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <div className={`relative ${isMobile ? 'h-40' : 'h-48'}`}>
          {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <div className={`animate-pulse text-gray-400 ${isMobile ? 'text-xs' : 'text-sm'}`}>{t('loading')}</div>
            </div>
          )}
          <img 
            src={currentImage}
            alt={result.name}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              imageLoading ? 'opacity-0' : 'opacity-100'
            }`}
            onError={handleImageError}
            onLoad={() => setImageLoading(false)}
          />
          <Badge className={`absolute top-2 right-2 ${getTypeColor(result.type)} ${isMobile ? 'text-xs px-2 py-1' : ''}`}>
            {t(result.type as any)}
          </Badge>
        </div>
        
        <CardHeader className={`pb-2 ${isMobile ? 'p-3' : ''}`}>
          <CardTitle className={`${isMobile ? 'text-base' : 'text-lg'}`}>{result.name}</CardTitle>
          <div className={`flex items-center gap-2 md:gap-4 ${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground`}>
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 md:h-4 md:w-4 fill-yellow-400 text-yellow-400" />
              <span>{result.rating}</span>
            </div>
            <div className="flex items-center gap-1 flex-1 min-w-0">
              <MapPin className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
              <span className="truncate">{result.location}</span>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className={`pt-0 ${isMobile ? 'p-3 pt-0' : ''}`}>
          <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground mb-3 md:mb-4 line-clamp-2`}>{result.description}</p>
          
          <div className={`flex items-center justify-between mb-3 md:mb-4 ${isMobile ? 'text-xs' : 'text-sm'}`}>
            {result.duration && (
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3 md:h-4 md:w-4" />
                <span>{result.duration}</span>
              </div>
            )}
            {result.price && (
              <div className="flex items-center gap-1">
                <DollarSign className="h-3 w-3 md:h-4 md:w-4" />
                <span>{result.price}</span>
              </div>
            )}
          </div>
          
          <Button 
            onClick={() => setDialogOpen(true)}
            className={`w-full ${isMobile ? 'h-9 text-sm' : ''}`}
            size={isMobile ? 'sm' : 'default'}
          >
            <Plus className="h-3 w-3 md:h-4 md:w-4 mr-2" />
            {t('addToTrip')}
          </Button>
        </CardContent>
      </Card>
      
      <TripSelectionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        place={placeData}
        onSuccess={() => {}}
      />
    </>
  );
};

const SearchResults = ({ results, loading, error, hasMore, onLoadMore, loadingProgress = 0 }: SearchResultsProps) => {
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  
  if (loading) {
    return (
      <div className="space-y-4 md:space-y-6">
        <Card className={`${isMobile ? 'p-4' : 'p-6'}`}>
          <div className="text-center mb-4">
            <h3 className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold mb-2`}>{t('searchingForPlaces')}</h3>
            <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground mb-4`}>
              {t('searchingForPlaces')}
            </p>
            <Progress value={loadingProgress} className="w-full" />
          </div>
        </Card>
        
        <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'}`}>
          {[...Array(isMobile ? 3 : 6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className={`${isMobile ? 'h-40' : 'h-48'} bg-gray-200 rounded-t-lg`}></div>
              <CardContent className={`${isMobile ? 'p-3' : 'p-4'}`}>
                <div className={`${isMobile ? 'h-3' : 'h-4'} bg-gray-200 rounded mb-2`}></div>
                <div className={`${isMobile ? 'h-2' : 'h-3'} bg-gray-200 rounded mb-4`}></div>
                <div className={`${isMobile ? 'h-7' : 'h-8'} bg-gray-200 rounded`}></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className={`${isMobile ? 'p-4' : 'p-6'} text-center`}>
        <p className={`text-red-600 mb-4 ${isMobile ? 'text-sm' : 'text-base'}`}>{error}</p>
        <Button onClick={() => window.location.reload()} size={isMobile ? 'sm' : 'default'}>{t('tryAgain')}</Button>
      </Card>
    );
  }

  if (results.length === 0) {
    return (
      <Card className={`${isMobile ? 'p-4' : 'p-6'} text-center`}>
        <p className={`text-muted-foreground ${isMobile ? 'text-sm' : 'text-base'}`}>{t('noResultsFound')}</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'}`}>
        {results.map((result) => (
          <SearchResultCard key={result.id} result={result} />
        ))}
      </div>
      
      {hasMore && onLoadMore && (
        <div className="flex justify-center">
          <Button 
            onClick={onLoadMore} 
            variant="outline" 
            size={isMobile ? 'default' : 'lg'}
            className={isMobile ? 'w-full max-w-sm' : ''}
          >
            {t('generateMoreOptions')}
          </Button>
        </div>
      )}
    </div>
  );
};

export default SearchResults;