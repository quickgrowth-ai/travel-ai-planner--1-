const GOOGLE_MAPS_API_KEY = 'AIzaSyAIZaoyQwdzn7hx9d_LH-1ZtPRUphsiS3Q';

export const isPlaceholderImage = (imageUrl: string): boolean => {
  if (!imageUrl) return true;
  
  const placeholderPatterns = [
    '68619901175d7c6ee1f37cfd_1752385313567_413e1cb6.png',
    '68619901175d7c6ee1f37cfd_1752447078293_bb2808f7.png',
    '68619901175d7c6ee1f37cfd_1752447463013_42820a5d.png',
    '68619901175d7c6ee1f37cfd_1752448135739_732005f4.png',
    'placeholder',
    'no-image',
    'default-image'
  ];
  
  return placeholderPatterns.some(pattern => imageUrl.includes(pattern));
};

export const validateImageUrl = async (url: string): Promise<boolean> => {
  if (!url || isPlaceholderImage(url)) return false;
  
  return new Promise((resolve) => {
    const img = new Image();
    const timeout = setTimeout(() => resolve(false), 5000);
    
    img.onload = () => {
      clearTimeout(timeout);
      resolve(img.width > 1 && img.height > 1);
    };
    
    img.onerror = () => {
      clearTimeout(timeout);
      resolve(false);
    };
    
    img.src = url;
  });
};

export const getFallbackImage = (): string => {
  return 'https://d64gsuwffb70l.cloudfront.net/68619901175d7c6ee1f37cfd_1752451527967_e3e5db07.png';
};

export const getCorrectImageForPlace = async (place: any): Promise<string> => {
  // First priority: Use photos array from Google Places API
  if (place.photos && place.photos.length > 0) {
    for (const photo of place.photos) {
      if (photo.name) {
        try {
          const photoUrl = `https://places.googleapis.com/v1/${photo.name}/media?maxHeightPx=800&maxWidthPx=800&key=${GOOGLE_MAPS_API_KEY}`;
          console.log('Trying photo URL:', photoUrl, 'for place:', place.name);
          
          // Test if the image loads successfully
          const isValid = await validateImageUrl(photoUrl);
          if (isValid) {
            console.log('Valid photo found for:', place.name);
            return photoUrl;
          }
        } catch (error) {
          console.error('Error validating photo for', place.name, ':', error);
          continue;
        }
      }
    }
  }
  
  // Second priority: If place has existing valid image that's not placeholder
  if (place.image && !isPlaceholderImage(place.image)) {
    try {
      const isValid = await validateImageUrl(place.image);
      if (isValid) {
        console.log('Using existing valid image for:', place.name);
        return place.image;
      }
    } catch (error) {
      console.error('Error validating existing image for', place.name, ':', error);
    }
  }
  
  // Return fallback image as last resort
  console.log('Using fallback image for:', place.name);
  return getFallbackImage();
};