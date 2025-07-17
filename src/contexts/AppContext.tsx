import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from '@/components/ui/use-toast';

interface TripItem {
  id: string;
  name: string;
  description: string;
  address?: string;
  rating?: number;
  image?: string;
  website?: string;
  addedAt: Date;
}

interface AppContextType {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  tripItems: TripItem[];
  addToTrip: (item: Omit<TripItem, 'id' | 'addedAt'>) => void;
  removeFromTrip: (id: string) => void;
  selectedLocation: string;
  setSelectedLocation: (location: string) => void;
}

const defaultAppContext: AppContextType = {
  sidebarOpen: false,
  toggleSidebar: () => {},
  tripItems: [],
  addToTrip: () => {},
  removeFromTrip: () => {},
  selectedLocation: '',
  setSelectedLocation: () => {},
};

const AppContext = createContext<AppContextType>(defaultAppContext);

export const useAppContext = () => useContext(AppContext);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tripItems, setTripItems] = useState<TripItem[]>([]);
  const [selectedLocation, setSelectedLocation] = useState('');

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  const addToTrip = (item: Omit<TripItem, 'id' | 'addedAt'>) => {
    const newItem: TripItem = {
      ...item,
      id: uuidv4(),
      addedAt: new Date()
    };
    setTripItems(prev => [...prev, newItem]);
    toast({
      title: "Added to Trip! 🍁",
      description: `${item.name} has been added to your trip planner.`,
    });
  };

  const removeFromTrip = (id: string) => {
    setTripItems(prev => prev.filter(item => item.id !== id));
    toast({
      title: "Removed from Trip",
      description: "Item has been removed from your trip planner.",
    });
  };

  return (
    <AppContext.Provider
      value={{
        sidebarOpen,
        toggleSidebar,
        tripItems,
        addToTrip,
        removeFromTrip,
        selectedLocation,
        setSelectedLocation,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
