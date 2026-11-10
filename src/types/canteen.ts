export type CategoryType = 
  | 'all' 
  | 'meals' 
  | 'brochettes' 
  | 'bakery_breakfast' 
  | 'beverages' 
  | 'combos';

export interface CanteenItem {
  id: string;
  name: string;
  category: 'meals' | 'brochettes' | 'bakery_breakfast' | 'beverages' | 'combos';
  priceRwf: number;
  description: string;
  prepTimeMins: number;
  calories?: number;
  rating: number;
  isAvailable: boolean;
  isSpecial?: boolean;
  image: string;
  tags: string[];
  dietary?: string; // e.g. "Halal", "Vegetarian", "High Protein", "Spicy"
  customOptions?: {
    sides?: string[];
    spiciness?: ('Mild' | 'Medium' | 'Hot pili-pili')[];
  };
}

export interface CartItem {
  item: CanteenItem;
  quantity: number;
  selectedSide?: string;
  spiceLevel?: string;
  specialInstructions?: string;
}

export type OrderType = 'immediate' | 'prebook';
export type DestinationType = 'counter_pickup' | 'dine_in_table' | 'room_delivery';
export type PaymentMethod = 'momo' | 'cash';
export type PaymentStatus = 'pending_verification' | 'verified' | 'cash_on_pickup';
export type OrderStatus = 'placed' | 'confirmed' | 'cooking' | 'ready' | 'collected' | 'cancelled';

export interface OrderBooking {
  id: string;
  tokenNumber: string;
  items: CartItem[];
  totalRwf: number;
  orderType: OrderType;
  pickupTime: string; // e.g. "Ready in ~15 mins" or "Today at 12:30 PM"
  scheduledSlot?: string;
  destinationType: DestinationType;
  tableOrRoomNumber?: string;
  customerName: string;
  customerPhone: string;
  notes?: string;
  paymentMethod: PaymentMethod;
  momoNumber: string;
  momoReceiver: string;
  momoTransactionRef?: string;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  createdAt: string;
  updatedAt: string;
}
