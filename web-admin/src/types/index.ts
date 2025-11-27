export interface User {
  id: number;
  email: string;
  full_name: string;
  role: string;
  avatar_url?: string;
  phone?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface Category {
  id: number;
  name: string;
  image_url: string;
  created_at?: string;
}

export interface Product {
  id: number;
  name: string;
  sku: string;
  description: string;
  price: number;
  compare_price?: number;
  category_id: number;
  brand_id?: number;
  image_url: string;
  images?: string[];
  created_at?: string;
}

export interface Brand {
  id: number;
  name: string;
  logo_url: string;
}

export interface Order {
  id: number;
  user_id: number;
  total_amount: number;
  status: string;
  created_at: string;
  items?: OrderItem[];
  users?: {
    full_name: string;
    email: string;
  };
}

export interface OrderItem {
  id: number;
  product_id: number;
  quantity: number;
  price: number;
  product?: Product;
}
