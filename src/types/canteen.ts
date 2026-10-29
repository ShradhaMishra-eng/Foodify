export type MealCategory = 'all' | 'breakfast' | 'lunch' | 'snacks' | 'beverages';

export type DietType = 'all' | 'veg' | 'non-veg';

export interface FoodItem {
  id: string;
  name: string;
  hindiName: string;
  description: string;
  category: 'breakfast' | 'lunch' | 'snacks' | 'beverages';
  isVeg: boolean;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  prepTime: number; // in minutes
  calories?: string;
  image: string;
  isAvailable: boolean;
  isPopular?: boolean;
  counter: string;
  tags: string[];
}

export interface CartItem {
  food: FoodItem;
  quantity: number;
  specialNote?: string;
  spiceLevel?: 'Mild' | 'Medium' | 'Spicy';
}

export type OrderStatus = 'Order Placed' | 'Kitchen Preparing' | 'Ready for Pickup' | 'Collected' | 'Cancelled';

export interface OrderToken {
  id: string; // e.g. "MJPRU-2491"
  timestamp: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  discountCode?: string;
  canteenTax: number;
  total: number;
  paymentMethod: 'UPI' | 'Campus Smart Card' | 'Cash at Counter';
  paymentReference?: string;
  paymentStatus: 'Completed' | 'Pending at Counter';
  orderStatus: OrderStatus;
  pickupCounter: string;
  estimatedMinutes: number;
  customerName: string;
  customerRole: 'Student' | 'Faculty' | 'Staff' | 'Admin';
  studentRollNo: string;
  pickupCode: string;
}

export interface UserProfile {
  name: string;
  email: string;
  role: 'Student' | 'Faculty' | 'Staff' | 'Admin';
  campusId: string;
  department: string;
  walletBalance: number;
  avatarInitials: string;
}
