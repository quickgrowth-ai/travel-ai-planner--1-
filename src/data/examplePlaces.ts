export interface ExamplePlace {
  place_id: string;
  name: string;
  formatted_address: string;
  rating?: number;
  types: string[];
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
}

export const examplePlaces: ExamplePlace[] = [
  {
    place_id: 'ChIJpTvG15DL1IkRd8S0KlIApWM',
    name: 'CN Tower',
    formatted_address: '290 Bremner Blvd, Toronto, ON M5V 3L9, Canada',
    rating: 4.4,
    types: ['tourist_attraction', 'point_of_interest', 'establishment'],
    geometry: {
      location: {
        lat: 43.6426,
        lng: -79.3871
      }
    }
  },
  {
    place_id: 'ChIJgUbEo8cfqEwR5lP9_Wh_DaM',
    name: 'Niagara Falls',
    formatted_address: 'Niagara Falls, ON, Canada',
    rating: 4.7,
    types: ['natural_feature', 'tourist_attraction', 'point_of_interest'],
    geometry: {
      location: {
        lat: 43.0962,
        lng: -79.0377
      }
    }
  },
  {
    place_id: 'ChIJ21P2rgUrTI8Ris1fYjy3Ms4',
    name: 'Banff National Park',
    formatted_address: 'Banff, AB, Canada',
    rating: 4.8,
    types: ['park', 'tourist_attraction', 'point_of_interest'],
    geometry: {
      location: {
        lat: 51.4968,
        lng: -115.9281
      }
    }
  },
  {
    place_id: 'ChIJDbdkHFQayUwR7-8fITgxTmU',
    name: 'Parliament Hill',
    formatted_address: 'Ottawa, ON K1A 0A6, Canada',
    rating: 4.6,
    types: ['tourist_attraction', 'point_of_interest', 'establishment'],
    geometry: {
      location: {
        lat: 45.4215,
        lng: -75.7011
      }
    }
  },
  {
    place_id: 'ChIJd_Y0eVIpAFQR_MfyC_S7_xM',
    name: 'Stanley Park',
    formatted_address: 'Vancouver, BC, Canada',
    rating: 4.7,
    types: ['park', 'tourist_attraction', 'point_of_interest'],
    geometry: {
      location: {
        lat: 49.3017,
        lng: -123.1444
      }
    }
  },
  {
    place_id: 'ChIJFVVVVVVVVVVVVVVVVVVVVV1',
    name: 'Old Quebec',
    formatted_address: 'Quebec City, QC, Canada',
    rating: 4.8,
    types: ['neighborhood', 'tourist_attraction', 'point_of_interest'],
    geometry: {
      location: {
        lat: 46.8139,
        lng: -71.2080
      }
    }
  },
  {
    place_id: 'ChIJFVVVVVVVVVVVVVVVVVVVVV2',
    name: 'Whistler Mountain',
    formatted_address: 'Whistler, BC, Canada',
    rating: 4.6,
    types: ['tourist_attraction', 'point_of_interest', 'establishment'],
    geometry: {
      location: {
        lat: 50.1163,
        lng: -122.9574
      }
    }
  },
  {
    place_id: 'ChIJFVVVVVVVVVVVVVVVVVVVVV3',
    name: 'Royal Ontario Museum',
    formatted_address: '100 Queens Park, Toronto, ON M5S 2C6, Canada',
    rating: 4.3,
    types: ['museum', 'tourist_attraction', 'point_of_interest'],
    geometry: {
      location: {
        lat: 43.6677,
        lng: -79.3948
      }
    }
  }
];