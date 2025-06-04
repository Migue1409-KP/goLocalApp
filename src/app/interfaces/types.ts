export interface City {
  id: string;
  name: string;
  state: {
    id: string;
    name: string;
  };
}

export interface Category {
  id: string;
  name: string;
}

export interface BusinessPayload {
  name: string;
  description: string;
  locationId: string;
  userId: string;
  categories: string[];
}