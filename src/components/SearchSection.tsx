import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Search, MapPin } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useIsMobile } from '@/hooks/use-mobile';

interface SearchSectionProps {
  onSearch: (location: string, query?: string) => void;
  loading: boolean;
  searchProgress?: number;
}

const SearchSection = ({ onSearch, loading, searchProgress = 0 }: SearchSectionProps) => {
  const [location, setLocation] = useState('');
  const [specificQuery, setSpecificQuery] = useState('');
  const { t } = useLanguage();
  const isMobile = useIsMobile();

  const handleSearch = () => {
    if (location.trim()) {
      onSearch(location.trim(), specificQuery.trim() || undefined);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardContent className={`${isMobile ? 'p-4' : 'p-6'}`}>
        <div className="space-y-4">
          <div className="text-center">
            <h2 className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold mb-2`}>{t('findPerfectDestination')}</h2>
            <p className={`text-muted-foreground ${isMobile ? 'text-sm' : 'text-base'}`}>{t('searchForPlaces')}</p>
          </div>
          
          <div className={`flex ${isMobile ? 'flex-col' : 'flex-col sm:flex-row'} gap-3`}>
            <div className="flex-1 relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('enterLocationPlaceholder')}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onKeyPress={handleKeyPress}
                className={`pl-10 ${isMobile ? 'h-12 text-base' : ''}`}
              />
            </div>
            
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('specificSearchPlaceholder')}
                value={specificQuery}
                onChange={(e) => setSpecificQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className={`pl-10 ${isMobile ? 'h-12 text-base' : ''}`}
              />
            </div>
            
            <Button 
              onClick={handleSearch} 
              disabled={!location.trim() || loading}
              className={`${isMobile ? 'h-12 text-base font-medium' : 'px-8'}`}
            >
              {loading ? t('searching') : t('search')}
            </Button>
          </div>
          
          {loading && (
            <div className="space-y-2">
              <div className={`flex justify-between ${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground`}>
                <span>{t('searchingForPlaces')}</span>
                <span>{Math.round(searchProgress)}%</span>
              </div>
              <Progress value={searchProgress} className="w-full" />
            </div>
          )}
          
          <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground text-center`}>
            {t('searchExamples')}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SearchSection;