export interface Address {
  _id: string;
  user?: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  isDefault: boolean;
  created?: string;
  updated?: string;
}
