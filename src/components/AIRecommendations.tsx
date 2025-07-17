import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Sparkles, MapPin, Clock, Star, Heart, Plus } from 'lucide-react';
import { searchPlacesForLocation } from '@/lib/googleMaps';

interface Recommendation {
  id: string;
  name: string;
  description: string;
  image: string;
  rating: number;
  duration: string;
  type: 'attraction' | 'restaurant' | 'hotel' | 'activity';
}

interface AIRecommendationsProps {
  destination: string;
  onSaveItem: (item: Recommendation) => void;
  savedItems: string[];
}

const AIRecommendations: React.FC<AIRecommendationsProps> = ({ destination, onSaveItem, savedItems }) => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [displayedRecommendations, setDisplayedRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<string>('all');
  const [displayedCount, setDisplayedCount] = useState(10);
  const [hasMore, setHasMore] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  // Smooth progress animation
  useEffect(() => {
    if (loading) {
      startTimeRef.current = Date.now();
      setLoadingProgress(0);
      
      progressIntervalRef.current = setInterval(() => {
        const elapsed = Date.now() - startTimeRef.current;
        const progress = Math.min(90, (elapsed / 4000) * 100);
        setLoadingProgress(progress);
      }, 50);
    } else {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      setLoadingProgress(100);
      setTimeout(() => setLoadingProgress(0), 500);
    }

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [loading]);

  const generateCanadianRecommendations = async (dest: string) => {
    setLoading(true);
    
    try {
      const placesResults = await searchPlacesForLocation(dest, 'all', false);
      
      const convertedRecommendations: Recommendation[] = placesResults.map((place, index) => ({
        id: place.placeId || `place-${index}`,
        name: place.name,
        description: place.description || place.address,
        image: place.image || 'https://d64gsuwffb70l.cloudfront.net/68619901175d7c6ee1f37cfd_1752447463013_42820a5d.png',
        rating: place.rating || 4.0,
        duration: '1-2 hours',
        type: (place.type as any) || 'attraction'
      }));
      
      setRecommendations(convertedRecommendations);
      
      const initialResults = convertedRecommendations.slice(0, 10);
      setDisplayedRecommendations(initialResults);
      setDisplayedCount(10);
      setHasMore(convertedRecommendations.length > 10);
    } catch (error) {
      console.error('Error generating recommendations:', error);
      setRecommendations([]);
      setDisplayedRecommendations([]);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    const nextCount = displayedCount + 10;
    const moreResults = recommendations.slice(0, nextCount);
    setDisplayedRecommendations(moreResults);
    setDisplayedCount(nextCount);
    setHasMore(recommendations.length > nextCount);
  };

  useEffect(() => {
    if (destination) {
      generateCanadianRecommendations(destination);
    }
  }, [destination]);

  const filteredRecommendations = filter === 'all' 
    ? displayedRecommendations 
    : displayedRecommendations.filter(rec => rec.type === filter);

  const handleSave = (item: Recommendation) => {
    onSaveItem(item);
  };

  if (loading) {
    return (
      <Card className="mt-4 sm:mt-8">
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="flex items-center gap-2 text-green-800 text-base sm:text-lg">
            <Sparkles className="h-4 w-4 sm:h-5 sm:w-5" />
            Loading Places...
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-center mb-4">
            <p className="text-xs sm:text-sm text-muted-foreground mb-4">
              Searching for recommendations in {destination}
            </p>
            <Progress value={loadingProgress} className="w-full h-2" />
          </div>
          <div className="space-y-3 sm:space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-3 sm:h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-2 sm:h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!recommendations.length) return null;

  return (
    <Card className="mt-4 sm:mt-8">
      <CardHeader className="pb-3 sm:pb-6">
        <CardTitle className="flex items-center gap-2 text-green-800 text-base sm:text-lg">
          <Sparkles className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="truncate">AI Recommendations for {destination}, Canada</span>
        </CardTitle>
        <div className="flex gap-1 sm:gap-2 mt-3 sm:mt-4 overflow-x-auto pb-2">
          <Button 
            variant={filter === 'all' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setFilter('all')}
            className="text-xs sm:text-sm h-7 sm:h-8 px-2 sm:px-3 whitespace-nowrap"
          >
            All
          </Button>
          <Button 
            variant={filter === 'attraction' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setFilter('attraction')}
            className="text-xs sm:text-sm h-7 sm:h-8 px-2 sm:px-3 whitespace-nowrap"
          >
            Attractions
          </Button>
          <Button 
            variant={filter === 'restaurant' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setFilter('restaurant')}
            className="text-xs sm:text-sm h-7 sm:h-8 px-2 sm:px-3 whitespace-nowrap"
          >
            Restaurants
          </Button>
          <Button 
            variant={filter === 'activity' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setFilter('activity')}
            className="text-xs sm:text-sm h-7 sm:h-8 px-2 sm:px-3 whitespace-nowrap"
          >
            Activities
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            {filteredRecommendations.map((rec) => (
              <div key={rec.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <img 
                  src={rec.image} 
                  alt={rec.name}
                  className="w-full h-32 sm:h-48 object-cover"
                />
                <div className="p-3 sm:p-4">
                  <h3 className="font-semibold text-sm sm:text-lg mb-1 sm:mb-2 line-clamp-1">{rec.name}</h3>
                  <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3 line-clamp-2">{rec.description}</p>
                  <div className="flex items-center justify-between text-xs sm:text-sm mb-2 sm:mb-3">
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500 fill-current" />
                      <span>{rec.rating}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-500">
                      <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="text-xs">{rec.duration}</span>
                    </div>
                  </div>
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700 text-xs sm:text-sm h-7 sm:h-9"
                    onClick={() => handleSave(rec)}
                    disabled={savedItems.includes(rec.id)}
                  >
                    {savedItems.includes(rec.id) ? (
                      <Heart className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 fill-current" />
                    ) : (
                      <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    )}
                    {savedItems.includes(rec.id) ? 'Saved' : 'Save'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          {hasMore && (
            <div className="flex justify-center">
              <Button onClick={loadMore} variant="outline" size="sm" className="text-xs sm:text-sm">
                Generate More Options
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AIRecommendations;