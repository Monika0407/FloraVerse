export enum UserRole {
  BUYER = 'buyer',
  SELLER = 'seller',
  ADMIN = 'admin',
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  password?: string;
  preferences?: {
    indoorOutdoor: 'Indoor' | 'Outdoor' | 'Both';
    sunlight: 'Low' | 'Medium' | 'High';
    experience: 'Beginner' | 'Intermediate' | 'Expert';
    location: string;
  };
}

export enum ProductCategory {
  PLANTS = 'Plants',
  SEEDS = 'Seeds',
  FERTILIZERS = 'Fertilizers',
  TOOLS = 'Tools',
}

export interface Product {
  id: string;
  sellerId: string;
  name: string;
  category: ProductCategory;
  description: string;
  price: number;
  quantityAvailable: number;
  imageUrl: string;
  tags?: {
    isIndoor: boolean;
    isOutdoor: boolean;
    sunlight: 'Low' | 'Medium' | 'High';
    maintenance: 'Low' | 'Medium' | 'High';
    season: string;
  };
}

export interface CartItem extends Product {
  quantityOrdered: number;
}

export interface DeliveryAddress {
  name: string;
  phone: string;
  addressLine: string;
  city: string;
  pincode: string;
}

export interface Notification {
  id: string;
  sellerId: string;
  buyerName: string;
  productName: string;
  quantity: number;
  totalPrice: number;
  date: string;
  deliveryAddress?: DeliveryAddress;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  image?: string; // base64
}

export interface WeatherData {
  temp: number;
  condition: 'Sunny' | 'Cloudy' | 'Rainy';
  humidity: number;
}
