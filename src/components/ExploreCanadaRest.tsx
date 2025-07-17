import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useTrip } from '@/contexts/TripContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { useLanguage } from '@/contexts/LanguageContext';
import ExploreCanadaContent from './ExploreCanadaContent';
import AIOverviewDialog from './AIOverviewDialog';
import { TripSelectionDialog } from './TripSelectionDialog';
import { canadianProvinces } from '@/data/canadianLocations';
import { PlaceResult } from '@/lib/googleMaps';

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

interface ExploreCanadaRestProps {
  places: Place[];
  allPlaces: Place[];
  loading: boolean;
  loadingMore: boolean;
  searchProgress: number;
  selectedCategory: string;
  selectedPlace: Place | null;
  aiOverview: string;
  aiLoading: boolean;
  selectedProvince: string;
  selectedCity: string;
  displayedCount: number;
  hasMore: boolean;
  setSelectedCategory: (category: string) => void;
  setSelectedPlace: (place: Place | null) => void;
  setAiOverview: (overview: string) => void;
  setAiLoading: (loading: boolean) => void;
  setPlaces: (places: Place[]) => void;
  setDisplayedCount: (count: number) => void;
  setHasMore: (hasMore: boolean) => void;
  setLoadingMore: (loading: boolean) => void;
}

const ExploreCanadaRest: React.FC<ExploreCanadaRestProps> = ({
  places,
  allPlaces,
  loading,
  loadingMore,
  searchProgress,
  selectedCategory,
  selectedPlace,
  aiOverview,
  aiLoading,
  selectedProvince,
  selectedCity,
  displayedCount,
  hasMore,
  setSelectedCategory,
  setSelectedPlace,
  setAiOverview,
  setAiLoading,
  setPlaces,
  setDisplayedCount,
  setHasMore,
  setLoadingMore
}) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { trips } = useTrip();
  const isMobile = useIsMobile();
  const [tripDialogOpen, setTripDialogOpen] = useState(false);
  const [selectedPlaceForTrip, setSelectedPlaceForTrip] = useState<PlaceResult | null>(null);

  const generateMoreOptions = async () => {
    setLoadingMore(true);
    try {
      const nextCount = displayedCount + 10;
      const filteredAllPlaces = selectedCategory === 'all' 
        ? allPlaces 
        : allPlaces.filter(place => place.type === selectedCategory);
      
      const moreResults = filteredAllPlaces.slice(0, nextCount);
      setPlaces(moreResults);
      setDisplayedCount(nextCount);
      setHasMore(filteredAllPlaces.length > nextCount);
      
      toast({
        title: "Success!",
        description: `Showing ${moreResults.length} places.`
      });
    } catch (error) {
      console.error('Error generating more options:', error);
      toast({
        title: t('error'),
        description: "Failed to load more places. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoadingMore(false);
    }
  };

  const handleAddToTrip = (place: Place) => {
    if (trips.length === 0) {
      toast({
        title: "No Trip Found",
        description: "Please create a trip first in the Trip Planner.",
        variant: "destructive"
      });
      return;
    }

    // Convert Place to PlaceResult for the dialog
    const placeResult: PlaceResult = {
      name: place.name,
      description: place.description,
      address: place.location,
      rating: place.rating,
      image: place.image,
      websiteUri: place.websiteUri,
      placeId: place.placeId
    };

    setSelectedPlaceForTrip(placeResult);
    setTripDialogOpen(true);
  };

  const handleTripSelectionSuccess = () => {
    // Dialog handles the success message via toast
  };

  const handleGetAIOverview = (place: Place) => {
    setSelectedPlace(place);
    setAiLoading(true);
    setTimeout(() => {
      setAiOverview(`${place.name} is a remarkable destination in ${place.location}. This location offers unique experiences for visitors.`);
      setAiLoading(false);
    }, 1500);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    
    // Filter places based on category
    const filteredPlaces = category === 'all' 
      ? allPlaces 
      : allPlaces.filter(place => place.type === category);
    
    // Reset to show first 10 results
    const initialPlaces = filteredPlaces.slice(0, 10);
    setPlaces(initialPlaces);
    setDisplayedCount(10);
    setHasMore(filteredPlaces.length > 10);
  };

  const categories = [
    { id: 'all', label: t('allPlaces') },
    { id: 'attraction', label: t('attractions') },
    { id: 'restaurant', label: t('restaurants') },
    { id: 'hotel', label: t('hotels') },
    { id: 'activity', label: t('activities') }
  ];

  const filteredPlaces = selectedCategory === 'all' 
    ? places 
    : places.filter(place => place.type === selectedCategory);

  return (
    <>
      <ExploreCanadaContent
        loading={loading}
        loadingMore={loadingMore}
        filteredPlaces={filteredPlaces}
        selectedCategory={selectedCategory}
        selectedProvince={selectedProvince}
        selectedCity={selectedCity}
        categories={categories}
        onCategoryChange={handleCategoryChange}
        onGenerateMore={generateMoreOptions}
        onAddToTrip={handleAddToTrip}
        onGetAIOverview={handleGetAIOverview}
        onPlacesUpdate={setPlaces}
        searchProgress={searchProgress}
        hasMore={hasMore}
      />
      
      <AIOverviewDialog
        place={selectedPlace}
        isOpen={!!selectedPlace}
        onClose={() => setSelectedPlace(null)}
        overview={aiOverview}
        loading={aiLoading}
      />

      <TripSelectionDialog
        open={tripDialogOpen}
        onOpenChange={setTripDialogOpen}
        place={selectedPlaceForTrip}
        onSuccess={handleTripSelectionSuccess}
      />
    </>
  );
};

export default ExploreCanadaRest;