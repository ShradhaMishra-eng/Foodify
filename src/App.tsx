/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { FeaturedDishes } from './components/FeaturedDishes';
import { MenuSection } from './components/MenuSection';
import { CartDrawer } from './components/CartDrawer';
import { PaymentModal } from './components/PaymentModal';
import { OrderTokenModal } from './components/OrderTokenModal';
import { OrdersView } from './components/OrdersView';
import { AdminKDSModal } from './components/AdminKDSModal';
import { UserProfileModal } from './components/UserProfileModal';
import { Footer } from './components/Footer';

import {
  INITIAL_MENU_ITEMS,
  SAMPLE_USERS,
  INITIAL_LIVE_ORDERS,
} from './data/menuData';
import {
  FoodItem,
  CartItem,
  OrderToken,
  UserProfile,
  MealCategory,
  OrderStatus,
} from './types/canteen';

export default function App() {
  // Menu items state (admin-manageable)
  const [menuItems, setMenuItems] = useState<FoodItem[]>(() => {
    const saved = localStorage.getItem('mjpru_canteen_menu');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_MENU_ITEMS;
      }
    }
    return INITIAL_MENU_ITEMS;
  });

  // Current active user
  const [currentUser, setCurrentUser] = useState<UserProfile>(SAMPLE_USERS[0]);

  // Cart state
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('mjpru_canteen_cart');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  // Orders state
  const [orders, setOrders] = useState<OrderToken[]>(() => {
    const saved = localStorage.getItem('mjpru_canteen_orders');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_LIVE_ORDERS;
      }
    }
    return INITIAL_LIVE_ORDERS;
  });

  // Navigation tab: 'home' | 'menu-all' | 'breakfast' | 'lunch' | 'snacks' | 'beverages' | 'orders'
  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedCategory, setSelectedCategory] = useState<MealCategory>('all');

  // Modals state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [pendingCheckoutDetails, setPendingCheckoutDetails] = useState<{
    discountCode?: string;
    discountAmount: number;
    pickupTime: string;
    counterPreference: string;
  }>({
    discountAmount: 0,
    pickupTime: 'Immediate (~8 mins)',
    counterPreference: 'Auto-assigned by meal',
  });
  const [activeTokenModal, setActiveTokenModal] = useState<OrderToken | null>(null);
  const [isKdsOpen, setIsKdsOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  // Quick toast message
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('mjpru_canteen_menu', JSON.stringify(menuItems));
  }, [menuItems]);

  useEffect(() => {
    localStorage.setItem('mjpru_canteen_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('mjpru_canteen_orders', JSON.stringify(orders));
  }, [orders]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2400);
  };

  // Cart item counts mapping for cards
  const cartItemCounts = cart.reduce((acc, item) => {
    acc[item.food.id] = item.quantity;
    return acc;
  }, {} as Record<string, number>);

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const activeOrdersCount = orders.filter(
    (o) => o.orderStatus !== 'Collected' && o.orderStatus !== 'Cancelled'
  ).length;

  // Cart Actions
  const handleAddToCart = (food: FoodItem, note?: string) => {
    if (!food.isAvailable) return;

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((i) => i.food.id === food.id);
      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += 1;
        if (note) updated[existingIndex].specialNote = note;
        return updated;
      }
      return [...prevCart, { food, quantity: 1, specialNote: note }];
    });

    showToast(`Added ${food.name} to tray`);
  };

  const handleUpdateQuantity = (itemId: string, delta: number) => {
    setCart((prevCart) => {
      return prevCart
        .map((item) => {
          if (item.food.id === itemId) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const handleRemoveItem = (itemId: string) => {
    setCart((prev) => prev.filter((i) => i.food.id !== itemId));
    showToast('Item removed from tray');
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Checkout flow
  const handleProceedToCheckout = (details: {
    discountCode?: string;
    discountAmount: number;
    pickupTime: string;
    counterPreference: string;
  }) => {
    setPendingCheckoutDetails(details);
    setIsCartOpen(false);
    setIsPaymentOpen(true);
  };

  const handlePaymentSuccess = (newOrder: OrderToken) => {
    setOrders((prev) => [newOrder, ...prev]);
    setCart([]);
    setIsPaymentOpen(false);
    setActiveTokenModal(newOrder);
    showToast(`Order confirmed! Token #${newOrder.id} generated`);
  };

  const handleDeductWallet = (amount: number) => {
    setCurrentUser((prev) => ({
      ...prev,
      walletBalance: Math.max(0, prev.walletBalance - amount),
    }));
  };

  const handleTopUpWallet = (amount: number) => {
    setCurrentUser((prev) => ({
      ...prev,
      walletBalance: prev.walletBalance + amount,
    }));
    showToast(`₹${amount} added to Campus Card wallet`);
  };

  // Reorder functionality
  const handleReorder = (items: { food: FoodItem; quantity: number }[]) => {
    setCart((prevCart) => {
      const updated = [...prevCart];
      items.forEach(({ food, quantity }) => {
        const idx = updated.findIndex((i) => i.food.id === food.id);
        if (idx > -1) {
          updated[idx].quantity += quantity;
        } else {
          updated.push({ food, quantity });
        }
      });
      return updated;
    });
    setIsCartOpen(true);
    showToast('Items added to cart from past order');
  };

  // Admin KDS actions
  const handleUpdateOrderStatus = (orderId: string, nextStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          return {
            ...order,
            orderStatus: nextStatus,
            estimatedMinutes: nextStatus === 'Ready for Pickup' ? 0 : order.estimatedMinutes,
          };
        }
        return order;
      })
    );
    showToast(`Token ${orderId} marked as ${nextStatus}`);
  };

  const handleToggleItemAvailability = (itemId: string) => {
    setMenuItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          return { ...item, isAvailable: !item.isAvailable };
        }
        return item;
      })
    );
  };

  const handleUpdateItemPrice = (itemId: string, newPrice: number) => {
    setMenuItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          return { ...item, price: newPrice };
        }
        return item;
      })
    );
    showToast('Menu price updated');
  };

  const handleAddNewDish = (newDish: FoodItem) => {
    setMenuItems((prev) => [newDish, ...prev]);
    showToast(`New dish ${newDish.name} added to menu`);
  };

  // Nav handler
  const handleNavSelect = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'breakfast' || tab === 'lunch' || tab === 'snacks') {
      setSelectedCategory(tab as MealCategory);
      const menuEl = document.getElementById('canteen-menu');
      if (menuEl) {
        menuEl.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (tab === 'menu-all') {
      setSelectedCategory('all');
      const menuEl = document.getElementById('canteen-menu');
      if (menuEl) {
        menuEl.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (tab === 'beverages') {
      setSelectedCategory('beverages');
      const menuEl = document.getElementById('canteen-menu');
      if (menuEl) {
        menuEl.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (tab === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-blue-900 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        cartItemCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        activeTab={activeTab}
        onSelectNav={handleNavSelect}
        currentUser={currentUser}
        onOpenUserModal={() => setIsUserModalOpen(true)}
        onOpenKDS={() => setIsKdsOpen(true)}
        activeOrdersCount={activeOrdersCount}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'orders' ? (
          <OrdersView
            orders={orders}
            onOpenOrderToken={(order) => setActiveTokenModal(order)}
            onReorder={handleReorder}
            onExploreMenu={() => handleNavSelect('menu-all')}
          />
        ) : (
          <>
            {/* Hero Section */}
            <HeroSection
              onExploreMenu={() => handleNavSelect('menu-all')}
              onOrderNow={() => {
                const el = document.getElementById('canteen-menu');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              openKdsScreen={() => setIsKdsOpen(true)}
            />

            {/* Featured Food Section */}
            <FeaturedDishes
              items={menuItems}
              cartItemCounts={cartItemCounts}
              onAddToCart={handleAddToCart}
              onUpdateQuantity={handleUpdateQuantity}
              onViewAllMenu={() => handleNavSelect('menu-all')}
            />

            {/* Dynamic Categorized Menu Explorer */}
            <MenuSection
              items={menuItems}
              cartItemCounts={cartItemCounts}
              onAddToCart={handleAddToCart}
              onUpdateQuantity={handleUpdateQuantity}
              selectedCategory={selectedCategory}
              onSelectCategory={(cat) => setSelectedCategory(cat)}
            />
          </>
        )}
      </main>

      {/* Footer */}
      <Footer
        onSelectNav={handleNavSelect}
        onOpenKDS={() => setIsKdsOpen(true)}
      />

      {/* Floating Action for Mobile Cart if items > 0 */}
      {cart.length > 0 && !isCartOpen && (
        <div className="fixed bottom-4 left-4 right-4 z-30 sm:hidden">
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="w-full bg-blue-900 text-white font-bold px-4 py-3.5 rounded-xl shadow-lg flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-500 text-white text-xs flex items-center justify-center font-extrabold">
                {totalCartCount}
              </span>
              <span className="text-sm">View Tray</span>
            </div>
            <span className="text-sm font-extrabold">
              ₹{cart.reduce((a, b) => a + b.food.price * b.quantity, 0)} →
            </span>
          </button>
        </div>
      )}

      {/* Modals & Drawers */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onProceedToCheckout={handleProceedToCheckout}
        currentUser={currentUser}
      />

      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        cart={cart}
        orderDetails={pendingCheckoutDetails}
        currentUser={currentUser}
        onPaymentSuccess={handlePaymentSuccess}
        onDeductWallet={handleDeductWallet}
      />

      <OrderTokenModal
        order={activeTokenModal}
        onClose={() => setActiveTokenModal(null)}
        onViewMyOrders={() => {
          setActiveTokenModal(null);
          setActiveTab('orders');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      <AdminKDSModal
        isOpen={isKdsOpen}
        onClose={() => setIsKdsOpen(false)}
        orders={orders}
        menuItems={menuItems}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        onToggleItemAvailability={handleToggleItemAvailability}
        onUpdateItemPrice={handleUpdateItemPrice}
        onAddNewDish={handleAddNewDish}
      />

      <UserProfileModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        currentUser={currentUser}
        onSelectUser={(u) => {
          setCurrentUser(u);
          setIsUserModalOpen(false);
          showToast(`Switched profile to ${u.name} (${u.role})`);
        }}
        onTopUpWallet={handleTopUpWallet}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-150">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
