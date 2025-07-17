import { isPlaceholderImage, validateImageUrl, getCorrectImageForPlace } from './imageValidation';

const GOOGLE_MAPS_API_KEY = 'AIzaSyAafwiNIfzNUWI4F3eJh_zdjcq_dfemUfM';

export interface PlaceResult {
  name: string;
  description: string;
  image?: string;
  rating?: number;
  address: string;
  placeId: string;
  addressComponents?: any[];
  websiteUri?: string;
  type?: string;
  photos?: any[];
}

let searchOffset = 0;
let usedPlaceIds = new Set<string>();
let nextPageToken: string | null = null;

const FALLBACK_IMAGE = 'https://d64gsuwffb70l.cloudfront.net/68619901175d7c6ee1f37cfd_1752447463013_42820a5d.png';

const isValidPlace = (place: any, category: string): boolean => {
  if (!place.id) return false;
  if (!place.displayName?.text || place.displayName.text.trim().length === 0) return false;
  if (!place.formattedAddress || place.formattedAddress.trim().length === 0) return false;
  
  const unwantedTypes = ['locality', 'political', 'administrative_area_level_1', 'administrative_area_level_2', 'country', 'postal_code'];
  
  if (place.types) {
    const hasOnlyUnwantedTypes = place.types.every(type => unwantedTypes.includes(type));
    if (hasOnlyUnwantedTypes) return false;
  }
  
  const name = place.displayName?.text?.toLowerCase() || '';
  const genericPatterns = [/^(unnamed|untitled|generic)/i, /^\d+\s+(street|avenue|road|drive)$/i];
  
  return !genericPatterns.some(pattern => pattern.test(name));
};

export const searchPlacesForLocation = async (
  location: string, 
  category: string, 
  useNextPage: boolean = false,
  onProgress?: (loadedCount: number, totalCount: number) => void
): Promise<PlaceResult[]> => {
  const categoryQueries = {
    'attraction': [
      `tourist attraction in ${location}`,
      `things to do in ${location}`,
      `landmarks in ${location}`,
      `points of interest in ${location}`,
      `sightseeing in ${location}`,
      `museums in ${location}`,
      `parks in ${location}`,
      `historic sites in ${location}`
    ],
    'restaurant': [
      `restaurant in ${location}`,
      `dining in ${location}`,
      `food in ${location}`,
      `cafe in ${location}`,
      `bar in ${location}`,
      `pub in ${location}`
    ],
    'hotel': [
      `hotel in ${location}`,
      `accommodation in ${location}`,
      `lodging in ${location}`,
      `bed and breakfast in ${location}`,
      `inn in ${location}`
    ],
    'activity': [
      `activities in ${location}`,
      `recreation in ${location}`,
      `entertainment in ${location}`,
      `outdoor activities in ${location}`,
      `sports in ${location}`,
      `adventure in ${location}`
    ],
    'all': [
      `places to visit in ${location}`,
      `attractions in ${location}`,
      `restaurants in ${location}`,
      `hotels in ${location}`,
      `tourist attractions in ${location}`,
      `things to do in ${location}`,
      `points of interest in ${location}`,
      `activities in ${location}`
    ]
  };
  
  const queries = categoryQueries[category] || categoryQueries['all'];
  const allResults: PlaceResult[] = [];
  const maxResultsPerQuery = 20;
  const expectedTotal = queries.length * maxResultsPerQuery;
  
  try {
    onProgress?.(0, expectedTotal);
    
    for (let i = 0; i < queries.length; i++) {
      const query = queries[i];
      
      const url = 'https://places.googleapis.com/v1/places:searchText';
      const requestBody: any = {
        textQuery: query,
        maxResultCount: maxResultsPerQuery,
        locationRestriction: {
          rectangle: {
            low: { latitude: 41.6765559, longitude: -141.00187 },
            high: { latitude: 83.23324, longitude: -52.6480987 }
          }
        }
      };

      if (useNextPage && nextPageToken && i === 0) {
        requestBody.pageToken = nextPageToken;
      }
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': GOOGLE_MAPS_API_KEY,
          'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.rating,places.photos,places.websiteUri,places.types,nextPageToken'
        },
        body: JSON.stringify(requestBody)
      });

      if (response.ok) {
        const data = await response.json();
        if (i === 0) nextPageToken = data.nextPageToken || null;
        
        if (data.places) {
          for (let j = 0; j < data.places.length; j++) {
            const place = data.places[j];
            
            if (!isValidPlace(place, category) || usedPlaceIds.has(place.id)) {
              continue;
            }
            
            const placeData = {
              name: place.displayName?.text || 'Unknown Place',
              description: place.formattedAddress || '',
              image: '',
              rating: place.rating || 4.0,
              address: place.formattedAddress || '',
              placeId: place.id,
              websiteUri: place.websiteUri,
              type: category,
              photos: place.photos || []
            };
            
            placeData.image = await getCorrectImageForPlace({
              ...placeData,
              placeId: place.id,
              photos: place.photos || []
            });
            
            usedPlaceIds.add(place.id);
            allResults.push(placeData);
            
            onProgress?.(allResults.length, expectedTotal);
          }
        }
      }
      
      if (i < queries.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    onProgress?.(allResults.length, allResults.length);
    return allResults;
  } catch (error) {
    console.error('Error searching places for location:', error);
    onProgress?.(allResults.length, allResults.length);
    return allResults;
  }
};

export const searchCanadianPlaces = searchPlacesForLocation;
export const searchPlaces = searchPlacesForLocation;

export const getPlaceDetails = async (placeId: string): Promise<PlaceResult | null> => {
  try {
    const url = `https://places.googleapis.com/v1/places/${placeId}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': GOOGLE_MAPS_API_KEY,
        'X-Goog-FieldMask': 'id,displayName,formattedAddress,rating,photos,websiteUri,addressComponents'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    const placeData = {
      name: data.displayName?.text || 'Unknown Place',
      description: data.formattedAddress || '',
      image: '',
      rating: data.rating,
      address: data.formattedAddress || '',
      placeId: placeId,
      addressComponents: data.addressComponents || [],
      websiteUri: data.websiteUri,
      photos: data.photos || []
    };
    
    placeData.image = await getCorrectImageForPlace({
      ...placeData,
      placeId: placeId,
      photos: data.photos || []
    });

    return placeData;
  } catch (error) {
    console.error('Error fetching place details:', error);
    return null;
  }
};

export const resetSearchState = () => {
  searchOffset = 0;
  usedPlaceIds.clear();
  nextPageToken = null;
};