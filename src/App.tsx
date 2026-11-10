import React, { useState, useEffect } from 'react';
import { CanteenItem, CartItem, OrderBooking, OrderStatus } from './types/canteen';
import { INITIAL_CANTEEN_ITEMS, CANTEEN_RECIPIENT_NAME, CANTEEN_MOMO_NUMBER } from './data/canteenData';
import { AmbientCanteenBackdrop } from './components/AmbientCanteenBackdrop';
import { TopBar } from './components/TopBar';
import { CanteenHero } from './components/CanteenHero';
import { MenuCatalog } from './components/MenuCatalog';
import { ItemDetailModal } from './components/ItemDetailModal';
import { CartCheckoutDrawer } from './components/CartCheckoutDrawer';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { PreBookSection } from './components/PreBookSection';
import { MomoPayGuide } from './components/MomoPayGuide';
import { StaffDashboard } from './components/StaffDashboard';
import { StaffLoginModal } from './components/StaffLoginModal';
import { MyOrdersModal } from './components/MyOrdersModal';
import { CanteenFooter } from './components/CanteenFooter';
import { sound } from './utils/sound';

export default function App() {
  // Canteen items state (with initial seed and local storage sync)
  const [items, setItems] = useState<CanteenItem[]>(() => {
    try {
      const saved = localStorage.getItem('canteen_items_v1');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_CANTEEN_ITEMS;
  });

  // Cart state
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('canteen_cart_v1');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [];
  });

  // Orders state
  const [orders, setOrders] = useState<OrderBooking[]>(() => {
    try {
      const saved = localStorage.getItem('canteen_orders_v1');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    // Initial sample order so staff mode & my orders aren't blank
    return [
      {
        id: 'ord-sample-1',
        tokenNumber: 'CAN-1042',
        items: [
          {
            item: INITIAL_CANTEEN_ITEMS[0],
            quantity: 1,
            selectedSide: 'Extra Plantains',
            spiceLevel: 'Medium'
          },
          {
            item: INITIAL_CANTEEN_ITEMS[7], // African Tea
            quantity: 1
          }
        ],
        totalRwf: 3800,
        orderType: 'prebook',
        pickupTime: 'Today at 12:30 PM (Lunch Break)',
        scheduledSlot: '12:30 PM (Lunch Break)',
        destinationType: 'counter_pickup',
        customerName: 'Aline Umutoni',
        customerPhone: '0788123456',
        paymentMethod: 'momo',
        momoNumber: CANTEEN_MOMO_NUMBER,
        momoReceiver: CANTEEN_RECIPIENT_NAME,
        momoTransactionRef: 'MP261031.1145.A81290',
        paymentStatus: 'verified',
        orderStatus: 'cooking',
        createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
      }
    ];
  });

  // Modals and UI state
  const [selectedItemForModal, setSelectedItemForModal] = useState<CanteenItem | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMyOrdersOpen, setIsMyOrdersOpen] = useState(false);
  const [isWallModeOpen, setIsWallModeOpen] = useState(false);
  const [latestCreatedOrder, setLatestCreatedOrder] = useState<OrderBooking | null>(null);

  // Staff Authentication State
  const [isStaffAuthenticated, setIsStaffAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem('canteen_staff_auth') === 'true';
    } catch {
      return false;
    }
  });
  const [isStaffMode, setIsStaffMode] = useState(false);
  const [isStaffLoginModalOpen, setIsStaffLoginModalOpen] = useState(false);

  // Prebooking preset slots
  const [presetSlot, setPresetSlot] = useState<string>('');

  // Persist items
  useEffect(() => {
    try {
      localStorage.setItem('canteen_items_v1', JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items]);

  // Persist cart
  useEffect(() => {
    try {
      localStorage.setItem('canteen_cart_v1', JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  // Persist orders
  useEffect(() => {
    try {
      localStorage.setItem('canteen_orders_v1', JSON.stringify(orders));
    } catch {
      // ignore
    }
  }, [orders]);

  // Cart calculations
  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalCartAmount = cart.reduce((sum, item) => sum + item.item.priceRwf * item.quantity, 0);

  // Handlers for Cart
  const handleAddToCart = (
    item: CanteenItem,
    quantity = 1,
    side?: string,
    spice?: string,
    notes?: string
  ) => {
    setCart((prev) => {
      const existingIdx = prev.findIndex(
        (ci) =>
          ci.item.id === item.id &&
          ci.selectedSide === side &&
          ci.spiceLevel === spice &&
          ci.specialInstructions === notes
      );

      if (existingIdx >= 0) {
        const next = [...prev];
        next[existingIdx].quantity += quantity;
        return next;
      } else {
        return [
          ...prev,
          {
            item,
            quantity,
            selectedSide: side,
            spiceLevel: spice,
            specialInstructions: notes,
          },
        ];
      }
    });
  };

  const handleUpdateCartQuantity = (index: number, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveCartItem(index);
      return;
    }
    setCart((prev) => {
      const next = [...prev];
      next[index].quantity = newQty;
      return next;
    });
  };

  const handleRemoveCartItem = (index: number) => {
    sound.playPop();
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Order created handler
  const handleOrderCreated = (newOrder: OrderBooking) => {
    setOrders((prev) => [newOrder, ...prev]);
    setLatestCreatedOrder(newOrder);
    setCart([]);
  };

  // Staff Authentication & Management
  const handleStaffClick = () => {
    if (isStaffAuthenticated) {
      setIsStaffMode(!isStaffMode);
    } else {
      setIsStaffLoginModalOpen(true);
    }
  };

  const handleStaffLoginSuccess = () => {
    setIsStaffAuthenticated(true);
    setIsStaffMode(true);
    try {
      localStorage.setItem('canteen_staff_auth', 'true');
    } catch {
      // ignore
    }
  };

  const handleStaffLogout = () => {
    setIsStaffAuthenticated(false);
    setIsStaffMode(false);
    try {
      localStorage.removeItem('canteen_staff_auth');
    } catch {
      // ignore
    }
  };

  const handleUpdateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, orderStatus: status, updatedAt: new Date().toISOString() } : ord))
    );
  };

  const handleVerifyPayment = (orderId: string) => {
    sound.playSuccess();
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, paymentStatus: 'verified', updatedAt: new Date().toISOString() } : ord))
    );
  };

  const handleToggleItemAvailability = (itemId: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, isAvailable: !item.isAvailable } : item))
    );
  };

  // Navigation scroll helper
  const handleNavigateSection = (sectionId: string) => {
    if (sectionId === 'menu') {
      const el = document.getElementById('menu-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (sectionId === 'booking') {
      const el = document.getElementById('booking-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (sectionId === 'momo') {
      const el = document.getElementById('momo-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleStartBookingSlot = (slot: string) => {
    setPresetSlot(slot);
    setIsCartOpen(true);
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col relative selection:bg-amber-500 selection:text-stone-950">
      
      {/* 
        Background Living Gallery of All Available Items & Their Costs
        Requested: "and on background has all images of available items in canteen and its cost"
      */}
      <AmbientCanteenBackdrop
        items={items}
        onSelectItem={(item) => setSelectedItemForModal(item)}
        isOpenWallMode={isWallModeOpen}
        onToggleWallMode={() => setIsWallModeOpen(!isWallModeOpen)}
      />

      {/* Main Foreground Container */}
      <div className="relative z-10 flex flex-col flex-1">
        
        {/* Top Bar with Staff Authentication Gate */}
        <TopBar
          totalCartItems={totalCartCount}
          totalCartAmount={totalCartAmount}
          onOpenCart={() => setIsCartOpen(true)}
          onNavigateSection={handleNavigateSection}
          isStaffMode={isStaffMode}
          isStaffAuthenticated={isStaffAuthenticated}
          onStaffClick={handleStaffClick}
          activeOrdersCount={orders.filter(o => o.orderStatus !== 'collected').length}
          onOpenActiveOrders={() => setIsMyOrdersOpen(true)}
        />

        {/* Canteen Staff / Kitchen Manager Dashboard (Protected by Login) */}
        {isStaffMode && isStaffAuthenticated && (
          <StaffDashboard
            orders={orders}
            items={items}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onVerifyPayment={handleVerifyPayment}
            onToggleItemAvailability={handleToggleItemAvailability}
            onClose={() => setIsStaffMode(false)}
            onLogout={handleStaffLogout}
          />
        )}

        <main className="flex-1">
          {/* Hero Section with MoMo Merchant Credentials */}
          <CanteenHero
            onExploreMenu={() => handleNavigateSection('menu')}
            onOpenBooking={() => handleNavigateSection('booking')}
            onOpenWallView={() => setIsWallModeOpen(true)}
          />

          {/* Menu Catalog with Pricing & Direct Add to Tray */}
          <MenuCatalog
            items={items}
            onAddToCart={(item, side, spice, notes) => handleAddToCart(item, 1, side, spice, notes)}
            onOpenItemModal={(item) => setSelectedItemForModal(item)}
          />

          {/* Meal Pre-Booking Schedule Section */}
          <PreBookSection onStartBooking={handleStartBookingSlot} />

          {/* MoMo Pay and Cash Payment Guide */}
          <MomoPayGuide />
        </main>

        {/* Footer */}
        <CanteenFooter
          onNavigateSection={handleNavigateSection}
          onOpenWallView={() => setIsWallModeOpen(true)}
        />
      </div>

      {/* Staff Login Modal (Requires username: bizimana, password: bizimana123) */}
      <StaffLoginModal
        isOpen={isStaffLoginModalOpen}
        onClose={() => setIsStaffLoginModalOpen(false)}
        onLoginSuccess={handleStaffLoginSuccess}
      />

      {/* Item Customization Modal */}
      <ItemDetailModal
        item={selectedItemForModal}
        onClose={() => setSelectedItemForModal(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Cart & Checkout Slide-Over Drawer */}
      <CartCheckoutDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        onOrderCreated={handleOrderCreated}
        presetOrderType={presetSlot ? 'prebook' : 'immediate'}
        presetTimeSlot={presetSlot}
      />

      {/* Order Token / Success Modal */}
      <OrderSuccessModal
        order={latestCreatedOrder}
        onClose={() => setLatestCreatedOrder(null)}
        onViewOrders={() => setIsMyOrdersOpen(true)}
      />

      {/* My Orders / Active Tokens Modal */}
      <MyOrdersModal
        isOpen={isMyOrdersOpen}
        onClose={() => setIsMyOrdersOpen(false)}
        orders={orders}
        onSelectOrder={(ord) => setLatestCreatedOrder(ord)}
      />

    </div>
  );
}
