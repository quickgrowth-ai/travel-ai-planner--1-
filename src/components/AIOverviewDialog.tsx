import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, ExternalLink } from 'lucide-react';

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

interface AIOverviewDialogProps {
  place: Place | null;
  isOpen: boolean;
  onClose: () => void;
  overview: string;
  loading: boolean;
}

const AIOverviewDialog: React.FC<AIOverviewDialogProps> = ({ 
  place, 
  isOpen, 
  onClose, 
  overview, 
  loading 
}) => {
  if (!place) return null;

  const handleVisitWebsite = () => {
    if (place.websiteUri) {
      window.open(place.websiteUri, '_blank');
    } else {
      const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(place.name + ' ' + place.location)}`;
      window.open(searchUrl, '_blank');
    }
  };

  const handleResearchMore = () => {
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(place.name + ' ' + place.location + ' information reviews')}`;
    window.open(searchUrl, '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[90vh] sm:max-h-[80vh] overflow-y-auto m-2 sm:m-0">
        <DialogHeader className="pb-2 sm:pb-4">
          <DialogTitle className="text-lg sm:text-xl font-bold text-gray-800 pr-8">
            {place.name}
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base text-gray-600">
            {place.location}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-3 sm:space-y-4">
          <div 
            className="h-32 sm:h-48 bg-cover bg-center rounded-lg" 
            style={{backgroundImage: `url(${place.image})`}}
          />
          
          {loading ? (
            <div className="flex items-center justify-center py-6 sm:py-8">
              <Loader2 className="h-5 w-5 sm:h-6 sm:w-6 animate-spin text-blue-600" />
              <span className="ml-2 text-sm sm:text-base text-gray-600">Generating AI overview...</span>
            </div>
          ) : (
            <div className="prose prose-sm max-w-none">
              <div className="whitespace-pre-wrap text-gray-700 text-sm sm:text-base leading-relaxed">
                {overview || 'No overview available.'}
              </div>
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row gap-2 pt-3 sm:pt-4 border-t">
            <Button
              onClick={handleVisitWebsite}
              className="bg-blue-600 hover:bg-blue-700 text-sm sm:text-base h-9 sm:h-10"
            >
              <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
              <span className="hidden sm:inline">Visit Official Website</span>
              <span className="sm:hidden">Visit Website</span>
            </Button>
            <Button
              onClick={handleResearchMore}
              variant="outline"
              className="border-blue-300 text-blue-700 hover:bg-blue-50 text-sm sm:text-base h-9 sm:h-10"
            >
              <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
              <span className="hidden sm:inline">Research More</span>
              <span className="sm:hidden">Research</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AIOverviewDialog;