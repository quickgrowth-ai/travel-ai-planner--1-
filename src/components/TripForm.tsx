import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useTrip } from '@/contexts/TripContext';
import { useToast } from '@/hooks/use-toast';

interface TripFormProps {
  onCreateTrip?: () => void;
}

const TripForm: React.FC<TripFormProps> = ({ onCreateTrip }) => {
  const { createTrip } = useTrip();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    destination: '',
    startDate: '',
    endDate: '',
    budget: '',
    travelers: 1,
    interests: [] as string[],
    accommodationType: 'hotel',
    transportationMode: 'car'
  });

  const interestOptions = [
    'Nature & Wildlife',
    'Cultural Sites',
    'Adventure Sports',
    'Food & Dining',
    'Museums & Art',
    'Nightlife',
    'Shopping',
    'Photography'
  ];

  const handleInterestChange = (interest: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      interests: checked 
        ? [...prev.interests, interest]
        : prev.interests.filter(i => i !== interest)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const budgetValue = parseFloat(formData.budget) || 0;
      
      await createTrip({
        title: formData.title,
        name: formData.title,
        destination: formData.destination,
        startDate: formData.startDate,
        endDate: formData.endDate,
        budget: budgetValue,
        travelers: formData.travelers,
        interests: formData.interests,
        accommodationType: formData.accommodationType,
        transportationMode: formData.transportationMode
      });
      
      toast({
        title: 'Trip created!',
        description: 'Your trip has been created successfully.'
      });
      
      // Reset form
      setFormData({
        title: '',
        destination: '',
        startDate: '',
        endDate: '',
        budget: '',
        travelers: 1,
        interests: [],
        accommodationType: 'hotel',
        transportationMode: 'car'
      });
      
      if (onCreateTrip) {
        onCreateTrip();
      }
    } catch (error) {
      console.error('Error creating trip:', error);
      toast({
        title: 'Error',
        description: 'Failed to create trip. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-blue-200 shadow-lg">
      <CardHeader className="bg-blue-50">
        <CardTitle className="text-gray-800">Create New Trip</CardTitle>
        <CardDescription>Plan your perfect Canadian adventure</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Trip Title</Label>
              <Input
                id="title"
                placeholder="My Canadian Adventure"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="destination">Destination</Label>
              <Input
                id="destination"
                placeholder="Toronto, Ontario"
                value={formData.destination}
                onChange={(e) => setFormData({...formData, destination: e.target.value})}
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="budget">Budget (CAD)</Label>
              <Input
                id="budget"
                type="number"
                step="0.01"
                min="0"
                placeholder="2000.00"
                value={formData.budget}
                onChange={(e) => setFormData({...formData, budget: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="travelers">Number of Travelers</Label>
              <Input
                id="travelers"
                type="number"
                min="1"
                value={formData.travelers}
                onChange={(e) => setFormData({...formData, travelers: parseInt(e.target.value) || 1})}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="accommodation">Accommodation Type</Label>
              <Select value={formData.accommodationType} onValueChange={(value) => setFormData({...formData, accommodationType: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select accommodation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hotel">Hotel</SelectItem>
                  <SelectItem value="hostel">Hostel</SelectItem>
                  <SelectItem value="airbnb">Airbnb</SelectItem>
                  <SelectItem value="camping">Camping</SelectItem>
                  <SelectItem value="resort">Resort</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="transportation">Transportation Mode</Label>
              <Select value={formData.transportationMode} onValueChange={(value) => setFormData({...formData, transportationMode: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select transportation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="car">Car</SelectItem>
                  <SelectItem value="plane">Plane</SelectItem>
                  <SelectItem value="train">Train</SelectItem>
                  <SelectItem value="bus">Bus</SelectItem>
                  <SelectItem value="rv">RV</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Interests</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {interestOptions.map((interest) => (
                <div key={interest} className="flex items-center space-x-2">
                  <Checkbox
                    id={interest}
                    checked={formData.interests.includes(interest)}
                    onCheckedChange={(checked) => handleInterestChange(interest, checked as boolean)}
                  />
                  <Label htmlFor={interest} className="text-sm">{interest}</Label>
                </div>
              ))}
            </div>
          </div>
          
          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
            {loading ? 'Creating Trip...' : 'Create Trip'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default TripForm;