import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, User, ExternalLink, Plus, Star } from 'lucide-react';
import { searchPlaces as searchPlacesAPI, PlaceResult } from '@/lib/googleMaps';
import { useAppContext } from '@/contexts/AppContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/lib/supabase';
import { TripSelectionDialog } from '@/components/TripSelectionDialog';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  places?: PlaceResult[];
  hasError?: boolean;
}

const Chatbot = () => {
  const { addToTrip } = useAppContext();
  const { t } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: t('aiGreeting'),
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<PlaceResult | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleAddToTrip = (place: PlaceResult) => {
    setSelectedPlace(place);
    setDialogOpen(true);
  };

  const handleTripSelectionSuccess = () => {
    // Dialog handles the success message via toast
  };

  const handleVisitWebsite = (website: string) => {
    window.open(website, '_blank', 'noopener,noreferrer');
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const query = input;
    setInput('');
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('chatbot-search', {
        body: { query, location: 'Canada', type: 'chat' }
      });

      if (data?.response) {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: data.response,
          isUser: false,
          timestamp: new Date(),
          places: data.places || [],
          hasError: data.error ? true : false
        };
        setMessages(prev => [...prev, botMessage]);
        
        if (data.shouldAddToTrip && data.places && data.places.length > 0) {
          const firstPlace = data.places[0];
          handleAddToTrip({
            name: firstPlace.name,
            description: firstPlace.description || firstPlace.address,
            address: firstPlace.address,
            rating: firstPlace.rating,
            image: firstPlace.image,
            websiteUri: firstPlace.websiteUri,
            placeId: firstPlace.id
          });
        }
      } else {
        const results = await searchPlacesAPI(query);
        
        let responseText = results.length > 0 
          ? `${t('greatFound')} ${results.length} ${t('canadianGems')} "${query}"! 🇨🇦`
          : `${t('couldntFind')} "${query}" ${t('inCanada')} ${t('trySearching')}`;

        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: responseText,
          isUser: false,
          timestamp: new Date(),
          places: results
        };

        setMessages(prev => [...prev, botMessage]);
      }
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: t('aiServiceUnavailable'),
        isUser: false,
        timestamp: new Date(),
        hasError: true
      };
      setMessages(prev => [...prev, errorMessage]);
      
      try {
        const results = await searchPlacesAPI(query);
        if (results.length > 0) {
          const fallbackMessage: Message = {
            id: (Date.now() + 2).toString(),
            content: `${t('placesFoundFor')} "${query}" ${t('inCanada')}`,
            isUser: false,
            timestamp: new Date(),
            places: results
          };
          setMessages(prev => [...prev, fallbackMessage]);
        }
      } catch (fallbackError) {
        console.error('Fallback search also failed:', fallbackError);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 p-2 sm:p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-4 sm:mb-6">
          <div className="flex items-center justify-center space-x-2 mb-2 sm:mb-4">
            <img 
              src="https://d64gsuwffb70l.cloudfront.net/68619901175d7c6ee1f37cfd_1752382798136_dffddc01.png" 
              alt="UniTravel Tech Logo" 
              className="h-6 sm:h-8 w-auto"
            />
            <h1 className="text-xl sm:text-3xl font-bold text-gray-800">{t('aiTravelAssistant')}</h1>
          </div>
          <p className="text-sm sm:text-base text-gray-600 px-4">{t('discoverCanadaAI')}</p>
        </div>

        <Card className="h-[calc(100vh-200px)] sm:h-[500px] flex flex-col border-blue-200 shadow-lg">
          <div className="p-3 sm:p-4 border-b border-blue-200 bg-blue-50">
            <h2 className="text-base sm:text-lg font-semibold flex items-center gap-2 text-gray-800">
              <span>🍁</span>
              <span className="truncate">{t('canadianTravelAssistant')}</span>
            </h2>
            <p className="text-xs sm:text-sm text-blue-600 mt-1 hidden sm:block">{t('discoverCanadaCoast')}</p>
          </div>
          
          <ScrollArea className="flex-1 p-2 sm:p-4" ref={scrollRef}>
            <div className="space-y-3 sm:space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] sm:max-w-[80%] p-2 sm:p-3 rounded-lg ${message.isUser ? 'bg-blue-600 text-white' : message.hasError ? 'bg-amber-50 text-gray-900 border border-amber-200' : 'bg-blue-50 text-gray-900 border border-blue-200'}`}>
                    <div className="flex items-start gap-2">
                      {!message.isUser && <span className="text-base sm:text-lg">🍁</span>}
                      {message.isUser && <User className="h-3 w-3 sm:h-4 sm:w-4 mt-0.5 flex-shrink-0" />}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm whitespace-pre-line break-words">{message.content}</p>
                        
                        {message.places && message.places.length > 0 && (
                          <div className="mt-2 sm:mt-3 space-y-2">
                            {message.places.map((place, index) => (
                              <div key={index} className="bg-white p-2 sm:p-3 rounded border border-blue-200">
                                <div className="flex items-start justify-between mb-1 sm:mb-2">
                                  <h4 className="font-medium text-gray-800 text-xs sm:text-sm truncate pr-2">{place.name}</h4>
                                  {place.rating && (
                                    <div className="flex items-center gap-1 text-xs text-yellow-600 flex-shrink-0">
                                      <Star className="h-3 w-3 fill-current" />
                                      <span>{place.rating}</span>
                                    </div>
                                  )}
                                </div>
                                <p className="text-xs text-gray-600 mb-2 line-clamp-2">{place.description}</p>
                                {place.image && (
                                  <img 
                                    src={place.image} 
                                    alt={place.name}
                                    className="w-full h-20 sm:h-24 object-cover rounded mb-2"
                                    onError={(e) => {
                                      e.currentTarget.style.display = 'none';
                                    }}
                                  />
                                )}
                                <div className="flex gap-1 sm:gap-2 flex-wrap">
                                  {place.websiteUri && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleVisitWebsite(place.websiteUri!)}
                                      className="flex items-center gap-1 text-xs text-blue-600 border-blue-200 hover:bg-blue-50 h-7 px-2"
                                    >
                                      <ExternalLink className="h-3 w-3" />
                                      <span className="hidden sm:inline">{t('website')}</span>
                                    </Button>
                                  )}
                                  <Button
                                    size="sm"
                                    onClick={() => handleAddToTrip(place)}
                                    className="flex items-center gap-1 text-xs bg-blue-600 hover:bg-blue-700 text-white h-7 px-2"
                                  >
                                    <Plus className="h-3 w-3" />
                                    <span className="hidden sm:inline">{t('addToTrip')}</span>
                                    <span className="sm:hidden">Add</span>
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-blue-50 border border-blue-200 p-2 sm:p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span>🍁</span>
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          
          <div className="p-2 sm:p-4 border-t border-blue-200 bg-blue-50">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t('askAboutDestinations')}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                disabled={loading}
                className="border-blue-200 focus:border-blue-400 text-sm h-9 sm:h-10"
              />
              <Button 
                onClick={handleSend} 
                disabled={loading || !input.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white h-9 sm:h-10 px-3 sm:px-4"
              >
                <Send className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>

      <TripSelectionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        place={selectedPlace}
        onSuccess={handleTripSelectionSuccess}
      />
    </div>
  );
};

export default Chatbot;