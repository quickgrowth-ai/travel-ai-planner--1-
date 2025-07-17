import { useState, useRef, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { searchPlacesForLocation } from '@/lib/googleMaps';

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

const useChatGPTSearch = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [allResults, setAllResults] = useState<SearchResult[]>([]);
  const [displayedCount, setDisplayedCount] = useState(10);
  const [hasMore, setHasMore] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const abortControllerRef = useRef<AbortController | null>(null);
  const currentLocationRef = useRef<string>('');
  const isSearchCompleteRef = useRef<boolean>(false);

  useEffect(() => {
    if (loading) {
      startTimeRef.current = Date.now();
      setLoadingProgress(5);
      isSearchCompleteRef.current = false;
      
      progressIntervalRef.current = setInterval(() => {
        const elapsed = Date.now() - startTimeRef.current;
        const progress = Math.min(90, 5 + (elapsed / 3000) * 85);
        setLoadingProgress(progress);
      }, 100);
    } else {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      setLoadingProgress(100);
      isSearchCompleteRef.current = true;
      setTimeout(() => setLoadingProgress(0), 1000);
    }

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [loading]);

  const searchLocation = async (location: string, query?: string) => {
    if (isSearchCompleteRef.current && currentLocationRef.current === location && !query) {
      return;
    }

    if (loading && currentLocationRef.current !== location) {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      setLoadingProgress(0);
    }
    
    abortControllerRef.current = new AbortController();
    currentLocationRef.current = location;
    
    setLoading(true);
    setError(null);
    setResults([]);
    setAllResults([]);
    setDisplayedCount(10);
    setHasMore(false);
    
    try {
      // Use Google Places API directly for consistent results
      const placesResults = await searchPlacesForLocation(location, 'all', false);
      
      if (abortControllerRef.current.signal.aborted) {
        return;
      }
      
      // Convert Places API results to SearchResult format
      const allSearchResults = placesResults.map((place, index) => ({
        id: place.placeId || `place-${index}`,
        name: place.name,
        description: place.description || place.address,
        type: (place.type as any) || 'attraction',
        rating: place.rating || 4.0,
        location: place.address,
        image: place.image || 'https://d64gsuwffb70l.cloudfront.net/68619901175d7c6ee1f37cfd_1752447463013_42820a5d.png',
        placeId: place.placeId,
        photos: place.photos || []
      }));
      
      if (abortControllerRef.current.signal.aborted) {
        return;
      }
      
      setAllResults(allSearchResults);
      const initialResults = allSearchResults.slice(0, 10);
      setResults(initialResults);
      setDisplayedCount(10);
      setHasMore(allSearchResults.length > 10);
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return;
      }
      setError(err instanceof Error ? err.message : 'Failed to search for recommendations. Please try again.');
      setResults([]);
      setAllResults([]);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    const nextCount = displayedCount + 10;
    const moreResults = allResults.slice(0, nextCount);
    setResults(moreResults);
    setDisplayedCount(nextCount);
    setHasMore(allResults.length > nextCount);
  };

  return {
    searchLocation,
    loadMore,
    loading,
    results,
    error,
    hasMore,
    loadingProgress
  };
};

export default useChatGPTSearch;