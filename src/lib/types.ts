// Category type
export interface Category {
  id: string;
  name: string;
  description?: string;
  restaurant_id: string;
  menu_items?: MenuItem[]; 
  menuItems?: MenuItem[];  // use snake_case exactly as API returns
  created_at?: string;
  updated_at?: string;
}
  
  // MenuItem type
  export interface MenuItem {
    id: string;
    name: string;
    description?: string;
    price: number;
    image?: string;
    isAvailable: boolean;
    categoryId: string;
    createdAt?: string;
    updatedAt?: string;
  }
  
  
export interface Restaurant {
  slug: string;
  id: string;
  name: string;
  description?: string;
  address?: string;
  phone?: string;
  whatsapp?: string;
  instagram?: string;
  categories: Category[];
  settings?: {
    isGrid?: boolean;
    facebook?: string;
    isOrder?:boolean;
  } | null;
}



export type Membership = {
  id: string;
  restaurant_id: string;
  status: string;
  startDate: string;
  endDate: string;
  restaurant: Restaurant;
};
  // Loading state type for tracking async operations
  export interface LoadingState {
    [key: string]: string | boolean;
  }