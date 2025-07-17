import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Calendar, MessageCircle } from 'lucide-react';

interface LandingPageProps {
  onNavigate: (page: string) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-blue-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img 
              src="https://d64gsuwffb70l.cloudfront.net/68619901175d7c6ee1f37cfd_1752382798136_dffddc01.png" 
              alt="UniTravel Tech Logo" 
              className="h-10 w-auto"
            />
          </div>
          <Button 
            onClick={() => onNavigate('dashboard')}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Get Started
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-transparent"></div>
        <div className="container mx-auto text-center relative z-10">
          <h1 className="text-5xl font-bold text-gray-800 mb-6">
            Discover Canada's Beauty
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            From the Rocky Mountains to the Atlantic shores, plan your perfect Canadian adventure with AI-powered recommendations.
          </p>
          <Button 
            onClick={() => onNavigate('dashboard')}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
          >
            Start Planning Your Journey
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-white/50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Everything You Need for Your Canadian Adventure
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-blue-200 hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <Calendar className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle className="text-gray-800">Trip Planner</CardTitle>
                <CardDescription>
                  Create detailed itineraries for your Canadian journey
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button 
                  onClick={() => onNavigate('planner')}
                  variant="outline" 
                  className="border-blue-300 text-blue-700 hover:bg-blue-50"
                >
                  Plan Your Trip
                </Button>
              </CardContent>
            </Card>

            <Card className="border-blue-200 hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <MessageCircle className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle className="text-gray-800">AI Travel Assistant</CardTitle>
                <CardDescription>
                  Get personalized recommendations from our AI chatbot
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button 
                  onClick={() => onNavigate('chatbot')}
                  variant="outline" 
                  className="border-blue-300 text-blue-700 hover:bg-blue-50"
                >
                  Chat with AI
                </Button>
              </CardContent>
            </Card>

            <Card className="border-blue-200 hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <MapPin className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle className="text-gray-800">Explore Destinations</CardTitle>
                <CardDescription>
                  Discover hidden gems across Canada's provinces
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button 
                  onClick={() => onNavigate('dashboard')}
                  variant="outline" 
                  className="border-blue-300 text-blue-700 hover:bg-blue-50"
                >
                  Explore Now
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <img 
              src="https://d64gsuwffb70l.cloudfront.net/68619901175d7c6ee1f37cfd_1752382798136_dffddc01.png" 
              alt="UniTravel Tech Logo" 
              className="h-6 w-auto"
            />
          </div>
          <p className="text-gray-300">
            Proudly Canadian • Explore the True North Strong and Free
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;