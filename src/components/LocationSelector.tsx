import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { canadianProvinces, getProvinceCities } from '@/data/canadianLocations';

interface LocationSelectorProps {
  selectedProvince: string;
  selectedCity: string;
  onProvinceChange: (province: string) => void;
  onCityChange: (city: string) => void;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({
  selectedProvince,
  selectedCity,
  onProvinceChange,
  onCityChange
}) => {
  const { t } = useLanguage();
  const availableCities = getProvinceCities(selectedProvince);
  const isAllCanada = selectedProvince === 'all';

  const handleProvinceChange = (value: string) => {
    onProvinceChange(value);
    onCityChange(''); // Reset city when province changes
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('provinceTerritory')}
        </label>
        <Select value={selectedProvince} onValueChange={handleProvinceChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a province or territory" />
          </SelectTrigger>
          <SelectContent>
            {canadianProvinces.map((province) => (
              <SelectItem key={province.id} value={province.id}>
                {province.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {!isAllCanada && (
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('city')}
          </label>
          <Select 
            value={selectedCity} 
            onValueChange={onCityChange}
            disabled={!selectedProvince || selectedProvince === 'all'}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a city" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-cities">
                {t('allCitiesIn')} {canadianProvinces.find(p => p.id === selectedProvince)?.name}
              </SelectItem>
              {availableCities.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
};

export default LocationSelector;