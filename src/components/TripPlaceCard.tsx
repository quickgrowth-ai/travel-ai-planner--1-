import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar, Clock, Star, ExternalLink, Trash2, ChevronDown, ChevronUp, Globe, Sparkles } from 'lucide-react';
import { TripItem } from '@/lib/tripAPI';
import { getPlaceDetails } from '@/lib/googleMaps';
import { supabase } from '@/lib/supabase';
import { useIsMobile } from '@/hooks/use-mobile';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface TripPlaceCardProps {
  item: TripItem;
  onDelete: (id: string) => void;
}

const TripPlaceCard: React.FC<TripPlaceCardProps> = ({ item, onDelete }) => {
  const [expanded, setExpanded] = useState(false);
  const [placeDetails, setPlaceDetails] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [aiSummary, setAiSummary] = useState<string>('');
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiError, setAiError] = useState<string>('');
  const isMobile = useIsMobile();

  useEffect(() => {
    if (expanded && item.place_id && !placeDetails) {
      loadPlaceDetails();
    }
    if (expanded && item.title && !aiSummary && !aiError) {
      generateAISummary();
    }
  }, [expanded, item.place_id, item.title]);

  const loadPlaceDetails = async () => {
    if (!item.place_id) return;
    
    setLoading(true);
    try {
      const details = await getPlaceDetails(item.place_id);
      setPlaceDetails(details);
    } catch (error) {
      console.error('Error loading place details:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateAISummary = async () => {
    if (!item.title) return;
    
    setLoadingAI(true);
    setAiError('');
    
    try {
      const requestBody = {
        placeId: item.place_id || '',
        placeName: item.title,
        location: item.location || '',
        type: item.type || ''
      };

      const { data, error } = await supabase.functions.invoke('place-summary', {
        body: requestBody
      });

      if (error) {
        throw new Error(`Function error: ${error.message}`);
      }
      
      if (data?.error) {
        throw new Error(data.error);
      }
      
      if (data?.summary) {
        setAiSummary(data.summary);
      } else {
        throw new Error('No summary returned from function');
      }
    } catch (error) {
      console.error('Error generating AI summary:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setAiError(`AI summary unavailable: ${errorMessage}`);
    } finally {
      setLoadingAI(false);
    }
  };

  const handleDelete = () => {
    onDelete(item.id!);
  };

  const formatOperatingHours = (hours: string) => {
    if (!hours) return null;
    return hours.split(',').map((hour, index) => (
      <div key={index} className={`${isMobile ? 'text-xs' : 'text-xs'} text-gray-600`}>{hour.trim()}</div>
    ));
  };

  return (
    <Card className={`${isMobile ? 'p-3' : 'p-4'} bg-white border border-blue-200 hover:shadow-md transition-shadow`}>
      <div className={`space-y-${isMobile ? '2' : '3'}`}>
        <div className="flex items-start justify-between">
          <h4 className={`font-medium text-gray-800 ${isMobile ? 'text-sm pr-2' : 'text-sm'} line-clamp-2`}>{item.title}</h4>
          <div className="flex items-center gap-1 flex-shrink-0">
            <Badge variant="outline" className={`${isMobile ? 'text-xs px-1' : 'text-xs'} capitalize`}>
              {item.type}
            </Badge>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`${isMobile ? 'h-6 w-6 p-0' : 'h-6 w-6 p-0'} text-red-500 hover:text-red-700`}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className={isMobile ? 'w-[90vw] max-w-md' : ''}>
                <AlertDialogHeader>
                  <AlertDialogTitle className={isMobile ? 'text-lg' : ''}>Remove Place</AlertDialogTitle>
                  <AlertDialogDescription className={isMobile ? 'text-sm' : ''}>
                    Are you sure you want to remove "{item.title}" from your trip? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className={isMobile ? 'flex-col gap-2' : ''}>
                  <AlertDialogCancel className={isMobile ? 'w-full' : ''}>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className={`bg-red-600 hover:bg-red-700 ${isMobile ? 'w-full' : ''}`}>
                    Remove
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        
        {item.location && (
          <p className={`${isMobile ? 'text-xs' : 'text-xs'} text-gray-600 flex items-center gap-1 line-clamp-1`}>
            <MapPin className="h-3 w-3 flex-shrink-0" />
            {item.location}
          </p>
        )}
        
        {item.notes && (
          <p className={`${isMobile ? 'text-xs' : 'text-xs'} text-gray-600 line-clamp-2`}>{item.notes}</p>
        )}
        
        {item.day_number && (
          <div className={`flex items-center gap-2 ${isMobile ? 'text-xs' : 'text-xs'} text-blue-600`}>
            <Calendar className="h-3 w-3" />
            <span>Day {item.day_number}</span>
            {item.scheduled_time && (
              <span>at {item.scheduled_time}</span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setExpanded(!expanded)}
            className={`${isMobile ? 'text-xs h-7 px-2' : 'text-xs h-7'}`}
          >
            {expanded ? (
              <>
                <ChevronUp className="h-3 w-3 mr-1" />
                {isMobile ? 'Less' : 'Show Less'}
              </>
            ) : (
              <>
                <ChevronDown className="h-3 w-3 mr-1" />
                {isMobile ? 'More' : 'Learn More'}
              </>
            )}
          </Button>
        </div>

        {expanded && (
          <div className={`mt-${isMobile ? '3' : '4'} pt-${isMobile ? '3' : '4'} border-t border-gray-200 space-y-${isMobile ? '2' : '3'}`}>
            {loading && (
              <div className={`${isMobile ? 'text-xs' : 'text-xs'} text-gray-500`}>Loading details...</div>
            )}
            
            {/* AI Generated Summary */}
            <div className={`${isMobile ? 'text-xs' : 'text-xs'} text-gray-700`}>
              <div className="flex items-center gap-1 mb-2">
                <Sparkles className="h-3 w-3 text-purple-600" />
                <strong className="text-purple-600">What's Special:</strong>
              </div>
              {loadingAI ? (
                <div className={`bg-purple-50 ${isMobile ? 'p-2' : 'p-3'} rounded-md`}>
                  <div className="text-purple-600">Generating insights...</div>
                </div>
              ) : aiError ? (
                <div className={`bg-yellow-50 ${isMobile ? 'p-2' : 'p-3'} rounded-md border-l-4 border-yellow-400`}>
                  <p className={`text-yellow-700 ${isMobile ? 'text-xs' : 'text-xs'}`}>{aiError}</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={generateAISummary}
                    className={`mt-2 ${isMobile ? 'text-xs h-6' : 'text-xs h-6'}`}
                  >
                    Try Again
                  </Button>
                </div>
              ) : aiSummary ? (
                <div className={`bg-purple-50 ${isMobile ? 'p-2' : 'p-3'} rounded-md border-l-4 border-purple-400`}>
                  <p className="text-gray-700 leading-relaxed">{aiSummary}</p>
                </div>
              ) : null}
            </div>
            
            {item.place_id && (
              <div className={`${isMobile ? 'text-xs' : 'text-xs'} text-gray-600`}>
                <strong>Place ID:</strong> {item.place_id}
              </div>
            )}
            
            {item.ai_description && (
              <div className={`${isMobile ? 'text-xs' : 'text-xs'} text-gray-700`}>
                <strong>Description:</strong>
                <p className={`mt-1 bg-blue-50 ${isMobile ? 'p-2' : 'p-2'} rounded`}>{item.ai_description}</p>
              </div>
            )}
            
            {(item.website || placeDetails?.websiteUri) && (
              <div className="flex items-center gap-2">
                <Globe className="h-3 w-3 text-blue-600" />
                <a
                  href={item.website || placeDetails?.websiteUri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${isMobile ? 'text-xs' : 'text-xs'} text-blue-600 hover:underline flex items-center gap-1`}
                >
                  Visit Website
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            )}
            
            {item.operating_hours && (
              <div className={`${isMobile ? 'text-xs' : 'text-xs'} text-gray-700`}>
                <strong>Operating Hours:</strong>
                <div className={`mt-1 bg-gray-50 ${isMobile ? 'p-2' : 'p-2'} rounded`}>
                  {formatOperatingHours(item.operating_hours)}
                </div>
              </div>
            )}
            
            {(item.rating || placeDetails?.rating) && (
              <div className={`flex items-center gap-1 ${isMobile ? 'text-xs' : 'text-xs'}`}>
                <Star className="h-3 w-3 text-yellow-500 fill-current" />
                <span>{item.rating || placeDetails?.rating}/5</span>
                {placeDetails?.rating && (
                  <span className="text-gray-500 ml-1">Google Rating</span>
                )}
              </div>
            )}
            
            {(item.image_url || placeDetails?.image) && (
              <div className="mt-3">
                <img
                  src={item.image_url || placeDetails?.image}
                  alt={item.title}
                  className={`w-full ${isMobile ? 'h-32' : 'h-40'} object-cover rounded-md shadow-sm`}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
            
            {placeDetails?.address && placeDetails.address !== item.location && (
              <div className={`${isMobile ? 'text-xs' : 'text-xs'} text-gray-600`}>
                <strong>Full Address:</strong>
                <p className="mt-1">{placeDetails.address}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default TripPlaceCard;