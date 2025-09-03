import { createContext, useContext, useReducer, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  language: 'en' | 'sw';
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
}

interface Address {
  id: string;
  label: string;
  street: string;
  city: string;
  region: string;
  postalCode: string;
  isDefault: boolean;
}

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }>;
}

interface Prescription {
  id: string;
  name: string;
  uploadDate: string;
  status: 'pending' | 'approved' | 'expired';
  expiryDate: string;
  image: string;
}

interface WishlistItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  inStock: boolean;
}

interface UserState {
  user: User | null;
  addresses: Address[];
  orders: Order[];
  prescriptions: Prescription[];
  wishlist: WishlistItem[];
  isLoggedIn: boolean;
}

type UserAction =
  | { type: 'LOGIN'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_PROFILE'; payload: Partial<User> }
  | { type: 'ADD_ADDRESS'; payload: Address }
  | { type: 'UPDATE_ADDRESS'; payload: Address }
  | { type: 'DELETE_ADDRESS'; payload: string }
  | { type: 'SET_DEFAULT_ADDRESS'; payload: string }
  | { type: 'ADD_TO_WISHLIST'; payload: WishlistItem }
  | { type: 'REMOVE_FROM_WISHLIST'; payload: string };

const initialState: UserState = {
  user: {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+255 123 456 789',
    language: 'en',
    notifications: {
      email: true,
      sms: true,
      push: false,
    },
  },
  addresses: [
    {
      id: '1',
      label: 'Home',
      street: '123 Lumumba Street',
      city: 'Mbeya',
      region: 'Mbeya',
      postalCode: '53111',
      isDefault: true,
    },
    {
      id: '2',
      label: 'Office',
      street: '456 Market Street',
      city: 'Mbeya',
      region: 'Mbeya',
      postalCode: '53112',
      isDefault: false,
    },
  ],
  orders: [
    {
      id: '1',
      orderNumber: 'ORD-2024-001',
      date: '2024-01-15',
      status: 'delivered',
      total: 85000,
      items: [
        {
          id: '1',
          name: 'Panadol Extra',
          price: 2500,
          quantity: 2,
          image: '/placeholder.svg',
        },
        {
          id: '2',
          name: 'Blood Pressure Monitor',
          price: 80000,
          quantity: 1,
          image: '/placeholder.svg',
        },
      ],
    },
    {
      id: '2',
      orderNumber: 'ORD-2024-002',
      date: '2024-01-20',
      status: 'shipped',
      total: 15000,
      items: [
        {
          id: '3',
          name: 'Vitamin C Tablets',
          price: 15000,
          quantity: 1,
          image: '/placeholder.svg',
        },
      ],
    },
  ],
  prescriptions: [
    {
      id: '1',
      name: 'Prescription for Hypertension',
      uploadDate: '2024-01-10',
      status: 'approved',
      expiryDate: '2024-07-10',
      image: '/placeholder.svg',
    },
    {
      id: '2',
      name: 'Diabetes Medication',
      uploadDate: '2024-01-18',
      status: 'pending',
      expiryDate: '2024-07-18',
      image: '/placeholder.svg',
    },
  ],
  wishlist: [
    {
      id: '1',
      name: 'Digital Thermometer',
      price: 25000,
      image: '/placeholder.svg',
      inStock: true,
    },
    {
      id: '2',
      name: 'First Aid Kit',
      price: 35000,
      originalPrice: 40000,
      image: '/placeholder.svg',
      inStock: true,
    },
  ],
  isLoggedIn: true,
};

function userReducer(state: UserState, action: UserAction): UserState {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, user: action.payload, isLoggedIn: true };
    case 'LOGOUT':
      return { ...state, user: null, isLoggedIn: false };
    case 'UPDATE_PROFILE':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      };
    case 'ADD_ADDRESS':
      return {
        ...state,
        addresses: [...state.addresses, action.payload],
      };
    case 'UPDATE_ADDRESS':
      return {
        ...state,
        addresses: state.addresses.map((addr) =>
          addr.id === action.payload.id ? action.payload : addr
        ),
      };
    case 'DELETE_ADDRESS':
      return {
        ...state,
        addresses: state.addresses.filter((addr) => addr.id !== action.payload),
      };
    case 'SET_DEFAULT_ADDRESS':
      return {
        ...state,
        addresses: state.addresses.map((addr) => ({
          ...addr,
          isDefault: addr.id === action.payload,
        })),
      };
    case 'ADD_TO_WISHLIST':
      return {
        ...state,
        wishlist: [...state.wishlist, action.payload],
      };
    case 'REMOVE_FROM_WISHLIST':
      return {
        ...state,
        wishlist: state.wishlist.filter((item) => item.id !== action.payload),
      };
    default:
      return state;
  }
}

const UserContext = createContext<{
  state: UserState;
  dispatch: React.Dispatch<UserAction>;
} | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(userReducer, initialState);

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

export type { User, Address, Order, Prescription, WishlistItem, UserAction };