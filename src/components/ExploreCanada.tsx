import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import LocationSelector from './LocationSelector';
import ExploreCanadaRest from './ExploreCanadaRest';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { useLanguage } from '@/contexts/LanguageContext';
import { searchPlacesForLocation, PlaceResult, resetSearchState } from '@/lib/googleMaps';
import { canadianProvinces } from '@/data/canadianLocations';

interface ExploreCanadaProps {
  onNavigate?: (page: string) => void;
  initialSearchQuery?: string;
}

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
}

const ExploreCanada: React.FC<ExploreCanadaProps> = ({ onNavigate, initialSearchQuery }) => {
  const { t } = useLanguage();
  const [places, setPlaces] = useState<Place[]>([]);
  const [allPlaces, setAllPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchProgress, setSearchProgress] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [aiOverview, setAiOverview] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState('all-provinces');
  const [selectedCity, setSelectedCity] = useState('all-cities');
  const [displayedCount, setDisplayedCount] = useState(10);
  const [hasMore, setHasMore] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const abortControllerRef = useRef<AbortController | null>(null);
  const currentLocationRef = useRef<string>('');
  const isInitialLoadRef = useRef<boolean>(true);

  useEffect(() => {
    if (loading) {
      startTimeRef.current = Date.now();
      setSearchProgress(10);
      
      progressIntervalRef.current = setInterval(() => {
        const elapsed = Date.now() - startTimeRef.current;
        const progress = Math.min(90, 10 + (elapsed / 2500) * 80);
        setSearchProgress(progress);
      }, 50);
    } else {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      setSearchProgress(100);
      setTimeout(() => {
        setSearchProgress(0);
        isInitialLoadRef.current = false;
      }, 500);
    }

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [loading]);

  const convertPlaceResult = (placeResult: PlaceResult, type: string): Place => {
    const imageUrl = placeResult.image || 'https://d64gsuwffb70l.cloudfront.net/68619901175d7c6ee1f37cfd_1752447078293_bb2808f7.png';
    return {
      id: placeResult.placeId,
      name: placeResult.name,
      location: placeResult.address,
      description: placeResult.description,
      rating: placeResult.rating || 4.0,
      type: type,
      image: imageUrl,
      websiteUri: placeResult.websiteUri,
      placeId: placeResult.placeId
    };
  };

  const buildLocationQuery = (): string => {
    if (selectedProvince === 'all-provinces') {
      return 'Canada';
    }
    
    const province = canadianProvinces.find(p => p.id === selectedProvince);
    if (selectedCity && selectedCity !== 'all-cities') {
      return `${selectedCity}, ${province?.name}, Canada`;
    }
    
    return `${province?.name}, Canada`;
  };

  const loadPlacesForLocation = async () => {
    const locationQuery = buildLocationQuery();
    
    if (!isInitialLoadRef.current && currentLocationRef.current === locationQuery) {
      return;
    }
    
    if (loading && currentLocationRef.current !== locationQuery) {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      setSearchProgress(0);
    }
    
    abortControllerRef.current = new AbortController();
    currentLocationRef.current = locationQuery;
    
    setLoading(true);
    resetSearchState();
    
    try {
      const [attractions, restaurants, hotels, activities] = await Promise.all([
        searchPlacesForLocation(locationQuery, 'attraction', false),
        searchPlacesForLocation(locationQuery, 'restaurant', false),
        searchPlacesForLocation(locationQuery, 'hotel', false),
        searchPlacesForLocation(locationQuery, 'activity', false)
      ]);

      if (abortControllerRef.current?.signal.aborted) {
        return;
      }

      const allPlacesData: Place[] = [
        ...attractions.map(place => convertPlaceResult(place, 'attraction')),
        ...restaurants.map(place => convertPlaceResult(place, 'restaurant')),
        ...hotels.map(place => convertPlaceResult(place, 'hotel')),
        ...activities.map(place => convertPlaceResult(place, 'activity'))
      ];

      setAllPlaces(allPlacesData);
      
      const initialPlaces = allPlacesData.slice(0, 10);
      setPlaces(initialPlaces);
      setDisplayedCount(10);
      setHasMore(allPlacesData.length > 10);
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return;
      }
      console.error('Error loading places:', error);
      toast({
        title: t('error'),
        description: "Failed to load places. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlacesForLocation();
  }, [selectedProvince, selectedCity]);

  const getLocationDisplayText = (): string => {
    if (selectedProvince === 'all-provinces') {
      return t('allOfCanada');
    }
    
    const province = canadianProvinces.find(p => p.id === selectedProvince);
    if (selectedCity && selectedCity !== 'all-cities') {
      return `${selectedCity}, ${province?.name}`;
    }
    
    return province?.name || 'Canada';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 p-2 md:p-4">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-4 md:mb-8">
          {onNavigate && (
            <Button 
              onClick={() => onNavigate('dashboard')}
              variant="ghost" 
              className="mb-4 text-blue-600 hover:text-blue-800"
              size={isMobile ? 'sm' : 'default'}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('backToDashboard')}
            </Button>
          )}
          
          <div className="text-center mb-4 md:mb-6">
            <h1 className={`${isMobile ? 'text-2xl' : 'text-4xl'} font-bold text-gray-800 mb-2`}>{t('exploreCanada')}</h1>
            <p className={`text-gray-600 ${isMobile ? 'text-sm' : 'text-lg'}`}>
              {t('discoverAmazing')} {getLocationDisplayText()}
            </p>
          </div>

          <LocationSelector
            selectedProvince={selectedProvince}
            selectedCity={selectedCity}
            onProvinceChange={setSelectedProvince}
            onCityChange={setSelectedCity}
          />
        </div>

        <ExploreCanadaRest
          places={places}
          allPlaces={allPlaces}
          loading={loading}
          loadingMore={loadingMore}
          searchProgress={searchProgress}
          selectedCategory={selectedCategory}
          selectedPlace={selectedPlace}
          aiOverview={aiOverview}
          aiLoading={aiLoading}
          selectedProvince={selectedProvince}
          selectedCity={selectedCity}
          displayedCount={displayedCount}
          hasMore={hasMore}
          setSelectedCategory={setSelectedCategory}
          setSelectedPlace={setSelectedPlace}
          setAiOverview={setAiOverview}
          setAiLoading={setAiLoading}
          setPlaces={setPlaces}
          setDisplayedCount={setDisplayedCount}
          setHasMore={setHasMore}
          setLoadingMore={setLoadingMore}
        />
      </div>
    </div>
  );
};

export default ExploreCanada;