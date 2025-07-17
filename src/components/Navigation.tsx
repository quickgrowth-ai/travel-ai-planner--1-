import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, MessageCircle, BarChart3, MapPin, Menu, X, LogOut, Settings } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageSelector } from '@/components/LanguageSelector';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentPage, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const { user, logout } = useAuth();
  const { t } = useLanguage();

  const navItems = [
    { id: 'dashboard', label: t('dashboard'), icon: BarChart3 },
    { id: 'explore-canada', label: t('explore'), icon: MapPin },
    { id: 'planner', label: 'Planner', icon: Calendar },
    { id: 'chatbot', label: 'AI Chat', icon: MessageCircle },
  ];

  const handleNavClick = (page: string) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
  };

  const handleProfileClick = () => {
    onNavigate('user-profile');
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white/95 backdrop-blur-sm border-b border-blue-200 sticky top-0 z-40">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img 
              src="https://d64gsuwffb70l.cloudfront.net/68619901175d7c6ee1f37cfd_1752719278671_18257536.png" 
              alt="UniTravel Logo" 
              className="h-8 w-auto"
            />
          </div>

          {!isMobile && (
            <div className="flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    variant={currentPage === item.id ? 'default' : 'ghost'}
                    className={`flex items-center space-x-2 ${currentPage === item.id ? 'bg-blue-600 text-white hover:bg-blue-700' : 'text-blue-700 hover:bg-blue-50'}`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Button>
                );
              })}
            </div>
          )}

          <div className="flex items-center space-x-4">
            {user && (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600 hidden sm:block">
                  {t('welcomeBack').replace('!', '')}, {user.name}
                </span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="p-1 h-auto">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.profilePicture} />
                        <AvatarFallback className="text-xs">
                          {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem className="text-gray-600 cursor-default">
                      <div className="flex flex-col">
                        <span className="font-medium">{user.name}</span>
                        <span className="text-xs text-gray-500">{user.email}</span>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <div className="px-2 py-1.5">
                      <LanguageSelector className="w-full" />
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleProfileClick}>
                      <Settings className="h-4 w-4 mr-2" />
                      {t('profile')}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                      <LogOut className="h-4 w-4 mr-2" />
                      {t('logout')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}

            {isMobile && (
              <Button
                variant="ghost"
                size="sm"
                className="text-blue-700 p-2"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            )}
          </div>
        </div>

        {isMobile && mobileMenuOpen && (
          <div className="mt-3 pb-3 border-t border-blue-100">
            <div className="grid grid-cols-2 gap-2 pt-3">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    variant={currentPage === item.id ? 'default' : 'outline'}
                    className={`flex flex-col items-center space-y-1 h-16 ${currentPage === item.id ? 'bg-blue-600 text-white' : 'border-blue-300 text-blue-700 hover:bg-blue-50'}`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-xs">{item.label}</span>
                  </Button>
                );
              })}
            </div>
            {user && (
              <div className="mt-3 pt-3 border-t border-blue-100 space-y-2">
                <div className="px-2">
                  <LanguageSelector className="w-full" />
                </div>
                <Button 
                  onClick={handleProfileClick}
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  {t('profile')}
                </Button>
                <Button 
                  onClick={handleLogout} 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  {t('logout')}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;