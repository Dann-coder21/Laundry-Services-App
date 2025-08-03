import React, { createContext, useState, useContext, ReactNode } from 'react';

// --- Type Definitions ---

// Defines a single item in our cart
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  icon: any; // Using `any` for flexibility with different icon packs
  serviceType: 'dryClean' | 'ironing' | 'washAndFold'; // Use a union type for service types
}

// Defines the shape of the data and functions our context will provide
interface CartContextType {
  cartItems: CartItem[];
  updateServiceItems: (serviceType: CartItem['serviceType'], items: Omit<CartItem, 'serviceType'>[]) => void;
  // --- NEW: Add the function signature for updating a single item's quantity ---
  updateItemQuantity: (itemId: string, serviceType: CartItem['serviceType'], newQuantity: number) => void;
  clearCart: () => void;
  // --- Calculated Values ---
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  totalItemsCount: number;
}

// --- Context Creation ---

// Create the context with a default value of `undefined`
const CartContext = createContext<CartContextType | undefined>(undefined);

// --- Provider Component ---

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // --- Core Cart Logic ---

  // This function adds/updates all items for a specific service at once
  const updateServiceItems = (serviceType: CartItem['serviceType'], items: Omit<CartItem, 'serviceType'>[]) => {
    // 1. Filter out all previous items of the *same service type* to avoid duplicates
    const otherServiceItems = cartItems.filter(item => item.serviceType !== serviceType);
    
    // 2. Filter for new items that actually have a quantity, and tag them with their service type
    const newServiceItems = items
      .filter(item => item.quantity > 0)
      .map(item => ({ ...item, serviceType }));
      
    // 3. Combine the lists and update the state
    setCartItems([...otherServiceItems, ...newServiceItems]);
  };

  // --- NEW: Implement the function to update a single item's quantity ---
  // This is used by the CartPage to modify the global state.
  const updateItemQuantity = (itemId: string, serviceType: CartItem['serviceType'], newQuantity: number) => {
    setCartItems(currentItems => {
      // If the new quantity is 0 or less, we remove the item from the cart
      if (newQuantity <= 0) {
        return currentItems.filter(item => !(item.id === itemId && item.serviceType === serviceType));
      }
      
      // Otherwise, we find the item and update its quantity
      return currentItems.map(item =>
        (item.id === itemId && item.serviceType === serviceType)
          ? { ...item, quantity: newQuantity }
          : item
      );
    });
  };


  const clearCart = () => {
    setCartItems([]);
  };

  // --- Memoized Calculations ---
  // These values will automatically recalculate whenever cartItems changes
  const subtotal = cartItems.reduce((sum, item) => sum + item.quantity * item.price, 0);
  const deliveryFee = subtotal > 0 ? 300 : 0; // Example: Add delivery fee only if there's a subtotal
  const taxRate = 0.16;
  const tax = subtotal * taxRate;
  const total = subtotal + deliveryFee + tax;
  const totalItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const value: CartContextType = {
    cartItems,
    updateServiceItems,
    updateItemQuantity, // --- NEW: Expose the new function through the context provider ---
    clearCart,
    subtotal,
    deliveryFee,
    tax,
    total,
    totalItemsCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// --- Custom Hook ---

// A clean, type-safe hook to consume the cart context in any component
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};