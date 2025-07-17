import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Loader2, RefreshCw } from 'lucide-react';
import PlaceCard from './PlaceCard';
import { useIsMobile } from '@/hooks/use-mobile';
import { searchPlacesForLocation, resetSearchState } from '@/lib/googleMaps';
import { canadianProvinces } from '@/data/canadianLocations';
import { isPlaceholderImage, getCorrectImageForPlace } from '@/lib/imageValidation';

interface Place {
  id: string;
  name: string;
  location: string;
  description: string;
  rating: number;
  type: string;
  image: string;
  websiteUri?: string;
  placeId: string;
  photos?: any[];
}

interface ExploreCanadaContentProps {
  loading: boolean;
  loadingMore: boolean;
  filteredPlaces: Place[];
  selectedCategory: string;
  selectedProvince: string;
  selectedCity: string;
  categories: Array<{id: string; label: string}>;
  onCategoryChange: (category: string) => void;
  onGenerateMore: () => void;
  onAddToTrip: (place: Place) => void;
  onGetAIOverview: (place: Place) => void;
  onPlacesUpdate: (places: Place[]) => void;
  searchProgress?: number;
  hasMore?: boolean;
}

const ExploreCanadaContent: React.FC<ExploreCanadaContentProps> = ({
  loading,
  loadingMore,
  filteredPlaces,
  selectedCategory,
  selectedProvince,
  selectedCity,
  categories,
  onCategoryChange,
  onGenerateMore,
  onAddToTrip,
  onGetAIOverview,
  onPlacesUpdate,
  searchProgress = 0,
  hasMore = true
}) => {
  const isMobile = useIsMobile();
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [categoryProgress, setCategoryProgress] = useState(0);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  // Smooth progress animation for category loading
  useEffect(() => {
    if (categoryLoading) {
      startTimeRef.current = Date.now();
      setCategoryProgress(0);
      
      progressIntervalRef.current = setInterval(() => {
        const elapsed = Date.now() - startTimeRef.current;
        const progress = Math.min(90, (elapsed / 4000) * 100);
        setCategoryProgress(progress);
      }, 50);
    } else {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      setCategoryProgress(100);
      setTimeout(() => setCategoryProgress(0), 500);
    }

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [categoryLoading]);

  const sortPlacesByImage = (places: Place[]) => {
    return places.sort((a, b) => {
      const aIsPlaceholder = isPlaceholderImage(a.image);
      const bIsPlaceholder = isPlaceholderImage(b.image);
      
      if (aIsPlaceholder && !bIsPlaceholder) return 1;
      if (!aIsPlaceholder && bIsPlaceholder) return -1;
      
      return b.rating - a.rating;
    });
  };

  const handleCategoryChange = async (category: string) => {
    onCategoryChange(category);
  };

  const getLocationDisplayName = () => {
    if (selectedProvince === 'all-provinces') {
      return 'All of Canada';
    }
    
    const province = canadianProvinces.find(p => p.id === selectedProvince);
    if (selectedCity && selectedCity !== 'all-cities') {
      return `${selectedCity}, ${province?.name}`;
    }
    
    return province?.name || 'Canada';
  };

  const sortedFilteredPlaces = sortPlacesByImage([...filteredPlaces]);
  const isLoading = loading || categoryLoading;
  const currentProgress = loading ? searchProgress : categoryProgress;

  return (
    <>
      <div className={`flex ${isMobile ? 'flex-wrap' : 'flex-wrap'} gap-2 mb-4 md:mb-6 justify-center`}>
        {categories.map(category => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? 'default' : 'outline'}
            onClick={() => handleCategoryChange(category.id)}
            disabled={categoryLoading}
            className={`${selectedCategory === category.id ? 'bg-blue-600 hover:bg-blue-700' : 'border-blue-300 text-blue-700 hover:bg-blue-50'} ${isMobile ? 'text-xs px-3 py-1' : ''}`}
            size={isMobile ? 'sm' : 'default'}
          >
            {categoryLoading && selectedCategory === category.id ? (
              <Loader2 className="h-3 w-3 animate-spin mr-1" />
            ) : null}
            {category.label}
          </Button>
        ))}
      </div>

      {isLoading && (
        <div className="flex flex-col items-center py-12 space-y-4">
          <div className="flex items-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className={`ml-2 text-gray-600 ${isMobile ? 'text-sm' : ''}`}>
              {categoryLoading ? `Searching for ${categories.find(c => c.id === selectedCategory)?.label.toLowerCase()} in ${getLocationDisplayName()}...` : `Discovering amazing places in ${getLocationDisplayName()}...`}
            </span>
          </div>
          <div className="w-full max-w-md space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Loading places...</span>
              <span>{Math.round(currentProgress)}%</span>
            </div>
            <Progress value={currentProgress} className="w-full" />
          </div>
        </div>
      )}

      {!isLoading && sortedFilteredPlaces.length > 0 && (
        <>
          <div className={`grid ${isMobile ? 'grid-cols-1' : 'md:grid-cols-2 lg:grid-cols-3'} gap-4 md:gap-6 mb-6 md:mb-8`}>
            {sortedFilteredPlaces.map((place) => (
              <PlaceCard
                key={place.id}
                place={place}
                onAddToTrip={onAddToTrip}
                onGetAIOverview={onGetAIOverview}
              />
            ))}
          </div>
          
          {hasMore && (
            <div className="text-center">
              <Button
                onClick={onGenerateMore}
                disabled={loadingMore}
                className="bg-green-600 hover:bg-green-700"
                size={isMobile ? 'sm' : 'default'}
              >
                {loadingMore ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                Generate More Options
              </Button>
            </div>
          )}
        </>
      )}

      {!isLoading && sortedFilteredPlaces.length === 0 && (
        <Card className="border-blue-200">
          <CardContent className={`${isMobile ? 'p-4' : 'p-8'} text-center`}>
            <p className={`text-gray-600 ${isMobile ? 'text-sm' : ''}`}>
              We searched extensively but couldn't find {selectedCategory === 'all' ? 'places' : categories.find(c => c.id === selectedCategory)?.label.toLowerCase()} in {getLocationDisplayName()}.
            </p>
            <p className={`text-gray-500 mt-2 ${isMobile ? 'text-xs' : 'text-sm'}`}>
              Try selecting a different category or location, or check back later as we're constantly updating our database.
            </p>
            <Button 
              onClick={() => handleCategoryChange('all')}
              className="mt-4 bg-blue-600 hover:bg-blue-700"
              size={isMobile ? 'sm' : 'default'}
            >
              Show All Categories
            </Button>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default ExploreCanadaContent;