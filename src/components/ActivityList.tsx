import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, Star } from 'lucide-react';

interface Activity {
  id: string;
  name: string;
  description: string;
  image: string;
  rating: number;
  duration: string;
  type: 'attraction' | 'restaurant' | 'hotel' | 'activity';
  location: string;
  price?: string;
}

interface ActivityListProps {
  destination: string;
  onSaveItem: (item: Activity) => void;
  savedItems: string[];
}

const ActivityList: React.FC<ActivityListProps> = ({ destination, onSaveItem, savedItems }) => {
  const getActivitiesForDestination = (dest: string): Activity[] => {
    const activities: Record<string, Activity[]> = {
      'Toronto': [
        {
          id: 'tor-act-1',
          name: 'CN Tower EdgeWalk',
          description: 'Walk around the outside of the CN Tower 116 stories above ground',
          image: 'https://images.unsplash.com/photo-1517935706615-2717063c2225?w=400&h=300&fit=crop',
          rating: 4.8,
          duration: '1.5 hours',
          type: 'activity',
          location: 'Downtown Toronto',
          price: '$225'
        },
        {
          id: 'tor-act-2',
          name: 'Casa Loma',
          description: 'Gothic Revival castle with gardens and secret passages',
          image: 'https://images.unsplash.com/photo-1554072675-66db59dba46f?w=400&h=300&fit=crop',
          rating: 4.3,
          duration: '2-3 hours',
          type: 'attraction',
          location: 'Midtown Toronto',
          price: '$30'
        },
        {
          id: 'tor-act-3',
          name: 'Harbourfront Centre',
          description: 'Cultural hub with festivals, art galleries, and lakefront views',
          image: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=400&h=300&fit=crop',
          rating: 4.2,
          duration: '2-4 hours',
          type: 'activity',
          location: 'Harbourfront',
          price: 'Free'
        },
        {
          id: 'tor-act-4',
          name: 'Ripley\'s Aquarium',
          description: 'Underwater tunnel and interactive marine exhibits',
          image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop',
          rating: 4.4,
          duration: '2-3 hours',
          type: 'attraction',
          location: 'Downtown Toronto',
          price: '$39'
        }
      ],
      'Montreal': [
        {
          id: 'mtl-act-1',
          name: 'Notre-Dame Basilica',
          description: 'Stunning Gothic Revival architecture with light shows',
          image: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=400&h=300&fit=crop',
          rating: 4.7,
          duration: '1-2 hours',
          type: 'attraction',
          location: 'Old Montreal',
          price: '$15'
        },
        {
          id: 'mtl-act-2',
          name: 'La Ronde Amusement Park',
          description: 'Thrilling rides and attractions on Île Sainte-Hélène',
          image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
          rating: 4.1,
          duration: '4-6 hours',
          type: 'activity',
          location: 'Île Sainte-Hélène',
          price: '$45'
        },
        {
          id: 'mtl-act-3',
          name: 'Jean-Talon Market',
          description: 'Vibrant farmers market with local Quebec produce',
          image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop',
          rating: 4.5,
          duration: '1-2 hours',
          type: 'activity',
          location: 'Little Italy',
          price: 'Free'
        }
      ],
      'Vancouver': [
        {
          id: 'van-act-1',
          name: 'Capilano Suspension Bridge',
          description: 'Walk across the famous suspension bridge through treetops',
          image: 'https://images.unsplash.com/photo-1549880338-65ddcdfd017b?w=400&h=300&fit=crop',
          rating: 4.3,
          duration: '2-3 hours',
          type: 'activity',
          location: 'North Vancouver',
          price: '$59'
        },
        {
          id: 'van-act-2',
          name: 'Grouse Mountain',
          description: 'Skyride to mountaintop with wildlife refuge and views',
          image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
          rating: 4.4,
          duration: '3-4 hours',
          type: 'activity',
          location: 'North Vancouver',
          price: '$65'
        },
        {
          id: 'van-act-3',
          name: 'VanDusen Botanical Garden',
          description: 'Beautiful botanical garden with diverse plant collections',
          image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop',
          rating: 4.6,
          duration: '2-3 hours',
          type: 'attraction',
          location: 'Shaughnessy',
          price: '$12'
        }
      ],
      'Quebec City': [
        {
          id: 'qc-act-1',
          name: 'Old Quebec Walking Tour',
          description: 'Explore UNESCO World Heritage cobblestone streets',
          image: 'https://images.unsplash.com/photo-1518904618719-1f0e4d1e8e4c?w=400&h=300&fit=crop',
          rating: 4.8,
          duration: '2-3 hours',
          type: 'activity',
          location: 'Old Quebec',
          price: '$25'
        },
        {
          id: 'qc-act-2',
          name: 'Château Frontenac',
          description: 'Iconic castle hotel and Quebec City landmark',
          image: 'https://images.unsplash.com/photo-1518904618719-1f0e4d1e8e4c?w=400&h=300&fit=crop',
          rating: 4.7,
          duration: '1 hour',
          type: 'attraction',
          location: 'Old Quebec',
          price: 'Free'
        }
      ],
      'Victoria': [
        {
          id: 'vic-act-1',
          name: 'Butchart Gardens',
          description: 'World-famous floral gardens with seasonal displays',
          image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop',
          rating: 4.8,
          duration: '3-4 hours',
          type: 'attraction',
          location: 'Brentwood Bay',
          price: '$35'
        },
        {
          id: 'vic-act-2',
          name: 'Inner Harbour',
          description: 'Scenic waterfront with street performers and shops',
          image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop',
          rating: 4.5,
          duration: '2-3 hours',
          type: 'activity',
          location: 'Downtown Victoria',
          price: 'Free'
        }
      ],
      'Canmore': [
        {
          id: 'can-act-1',
          name: 'Grassi Lakes Trail',
          description: 'Easy hike to turquoise alpine lakes with mountain views',
          image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
          rating: 4.6,
          duration: '2-3 hours',
          type: 'activity',
          location: 'Canmore',
          price: 'Free'
        },
        {
          id: 'can-act-2',
          name: 'Canmore Nordic Centre',
          description: 'Olympic legacy site with hiking and biking trails',
          image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
          rating: 4.4,
          duration: '2-4 hours',
          type: 'activity',
          location: 'Canmore',
          price: '$10'
        }
      ]
    };
    
    return activities[dest] || [];
  };

  const activities = getActivitiesForDestination(destination);

  if (activities.length === 0) {
    return (
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          Popular Activities in {destination}
        </h2>
        <div className="text-center py-8 bg-white rounded-lg shadow-sm">
          <p className="text-gray-600">Activities coming soon for {destination}!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        Popular Activities in {destination}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activities.map((activity) => (
          <Card key={activity.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="p-0">
              <img 
                src={activity.image} 
                alt={activity.name}
                className="w-full h-48 object-cover rounded-t-lg"
              />
            </CardHeader>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <CardTitle className="text-lg">{activity.name}</CardTitle>
                <Badge variant="secondary">{activity.type}</Badge>
              </div>
              
              <p className="text-gray-600 text-sm mb-3">{activity.description}</p>
              
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span>{activity.rating}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{activity.duration}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{activity.location}</span>
                </div>
              </div>
              
              {activity.price && (
                <p className="text-green-600 font-semibold mb-3">{activity.price}</p>
              )}
              
              <Button 
                onClick={() => onSaveItem(activity)}
                disabled={savedItems.includes(activity.id)}
                className="w-full"
                variant={savedItems.includes(activity.id) ? "secondary" : "default"}
              >
                {savedItems.includes(activity.id) ? 'Saved' : 'Save to Itinerary'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ActivityList;