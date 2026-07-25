import React, { createContext, useState, useContext, useEffect } from 'react';
import { subHours, addDays } from 'date-fns';

const initialTables = [
  { id: 'T1', number: '1', capacity: 2, status: 'Available', type: 'Window', location: 'Main Dining' },
  { id: 'T2', number: '2', capacity: 2, status: 'Seated', type: 'Standard', location: 'Main Dining' },
  { id: 'T3', number: '3', capacity: 4, status: 'Available', type: 'Booth', location: 'Main Dining' },
  { id: 'T4', number: '4', capacity: 4, status: 'Dirty', type: 'Booth', location: 'Main Dining' },
  { id: 'T5', number: '5', capacity: 6, status: 'Available', type: 'Round', location: 'Main Dining' },
  { id: 'T6', number: '6', capacity: 2, status: 'Available', type: 'Bar', location: 'Bar Area' },
  { id: 'T7', number: '7', capacity: 2, status: 'Seated', type: 'Bar', location: 'Bar Area' },
  { id: 'T8', number: '8', capacity: 8, status: 'Available', type: 'Private', location: 'Private Room' },
  { id: 'T9', number: '9', capacity: 4, status: 'Available', type: 'Patio', location: 'Outdoor' },
  { id: 'T10', number: '10', capacity: 4, status: 'Seated', type: 'Patio', location: 'Outdoor' },
];

const initialMenu = [
  { id: 'M1', name: 'Truffle Arancini', description: 'Crispy risotto balls, black truffle, fontina', price: 18, category: 'Starters', dietary: ['Vegetarian'], image: '/images/menu_arancini_1783794216460.png' },
  { id: 'M2', name: 'Wagyu Beef Tartare', description: 'Quail egg, capers, toasted brioche', price: 26, category: 'Starters', dietary: [], image: '/images/menu_tartare_1783794747676.png' },
  { id: 'M3', name: 'Pan-Seared Scallops', description: 'Cauliflower purée, pancetta crisp, brown butter', price: 38, category: 'Mains', dietary: ['Gluten-Free'], image: '/images/menu_scallops_1783794234659.png' },
  { id: 'M4', name: 'Dry-Aged Ribeye', description: '24oz bone-in, roasted garlic, chimichurri', price: 85, category: 'Mains', dietary: ['Gluten-Free'], image: '/images/menu_ribeye_1783794197166.png' },
  { id: 'M5', name: 'Mushroom Risotto', description: 'Wild mushrooms, parmesan foam, truffle oil', price: 32, category: 'Mains', dietary: ['Vegetarian', 'Gluten-Free'], image: '/images/menu_risotto_1783794759409.png' },
  { id: 'M6', name: 'Dark Chocolate Tart', description: 'Sea salt, raspberry coulis, vanilla bean gelato', price: 14, category: 'Desserts', dietary: ['Vegetarian'], image: '/images/menu_tart_1783794768451.png' },
  { id: 'M7', name: 'Burrata & Heirloom Tomato', description: 'Aged balsamic, basil oil, micro greens', price: 22, category: 'Starters', dietary: ['Vegetarian', 'Gluten-Free'], image: '/images/menu_burrata_1783794777906.png' },
  { id: 'M8', name: 'Miso Glazed Black Cod', description: 'Bok choy, ginger dashi, enoki mushrooms', price: 42, category: 'Mains', dietary: ['Gluten-Free'], image: '/images/menu_cod_1783794788575.png' },
  { id: 'M9', name: 'Lemon Basil Panna Cotta', description: 'Fresh berries, almond crumble, mint', price: 12, category: 'Desserts', dietary: ['Vegetarian'], image: '/images/menu_pannacotta_1783794797930.png' },
  { id: 'M10', name: 'Aura Signature Martini', description: 'Vodka, dry vermouth, blue cheese olive', price: 18, category: 'Drinks', dietary: ['Vegan'], image: '/images/menu_martini_1783794807600.png' },
  { id: 'M11', name: 'Smoked Old Fashioned', description: 'Bourbon, hickory smoke, orange peel', price: 20, category: 'Drinks', dietary: ['Vegan'], image: '/images/gallery_drinks_1783794249464.png' },
];

const now = new Date();

const initialReservations = [
  { id: 'R1001', guestName: 'Eleanor Vance', partySize: 2, tableId: 'T2', date: now, time: '19:00', status: 'Seated' },
  { id: 'R1002', guestName: 'Hugh Crain', partySize: 4, tableId: 'T10', date: now, time: '19:30', status: 'Seated' },
  { id: 'R1003', guestName: 'Theodora', partySize: 6, tableId: null, date: now, time: '20:00', status: 'Confirmed' },
  { id: 'R1004', guestName: 'Luke Sanderson', partySize: 2, tableId: null, date: addDays(now, 1), time: '18:30', status: 'Confirmed' },
  { id: 'R1005', guestName: 'Dr. Montague', partySize: 8, tableId: 'T8', date: subHours(now, 2), time: '17:00', status: 'Completed' },
];

const monthlyRevenueData = [
  { month: 'Jan', revenue: 125000, foodCost: 35000, laborCost: 40000, profit: 50000 },
  { month: 'Feb', revenue: 118000, foodCost: 33000, laborCost: 40000, profit: 45000 },
  { month: 'Mar', revenue: 142000, foodCost: 39000, laborCost: 42000, profit: 61000 },
  { month: 'Apr', revenue: 135000, foodCost: 38000, laborCost: 42000, profit: 55000 },
  { month: 'May', revenue: 156000, foodCost: 42000, laborCost: 45000, profit: 69000 },
  { month: 'Jun', revenue: 168000, foodCost: 45000, laborCost: 48000, profit: 75000 },
];

const topSellingItems = [
  { name: 'Dry-Aged Ribeye', sales: 420, revenue: 35700, fill: 'hsl(var(--primary))' },
  { name: 'Pan-Seared Scallops', sales: 385, revenue: 14630, fill: 'hsl(var(--primary) / 0.8)' },
  { name: 'Wagyu Beef Tartare', sales: 310, revenue: 8060, fill: 'hsl(var(--primary) / 0.6)' },
  { name: 'Truffle Arancini', sales: 290, revenue: 5220, fill: 'hsl(var(--primary) / 0.4)' },
];

const RestaurantContext = createContext();

export const RestaurantProvider = ({ children }) => {
  const [tables, setTables] = useState(initialTables);
  const [menuItems] = useState(initialMenu);
  const [reservations, setReservations] = useState([]);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loungeBookings, setLoungeBookings] = useState([]);
  const [customer, setCustomer] = useState(null);
  const [analytics, setAnalytics] = useState({
    totalRevenue: 0,
    netProfit: 0,
    orderCount: 0,
    reservationCount: 0,
    loungeCount: 0,
    totalCustomers: 0
  });

  const fetchBackendData = async () => {
    try {
      const [resReq, loungeReq, ordersReq] = await Promise.all([
        fetch('/api/reservations'),
        fetch('/api/lounge-bookings'),
        fetch('/api/orders')
      ]);
      const resAnalytics = await fetch('/api/analytics');
      const dataAnalytics = await resAnalytics.json();
      setAnalytics(dataAnalytics);

      if (resReq.ok) setReservations(await resReq.json());
      if (loungeReq.ok) setLoungeBookings(await loungeReq.json());
      if (ordersReq.ok) setOrders(await ordersReq.json());

      // Initialize customer from localStorage if exists
      const storedCustomer = localStorage.getItem('customerData');
      if (storedCustomer) {
        setCustomer(JSON.parse(storedCustomer));
      }
    } catch (error) {
      console.error('Error fetching backend data:', error);
      // Fallback to initial if backend is not running
      setReservations(initialReservations);
    }
  };

  useEffect(() => {
    fetchBackendData();
  }, []);

  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId) => {
    setCart(prev => prev.filter(i => i.id !== itemId));
  };

  const clearCart = () => setCart([]);

  const placeOrder = async () => {
    if (cart.length === 0) return;
    const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          total: cartTotal, 
          items: cart,
          customerId: customer?.id || null 
        })
      });
      if (response.ok) {
        clearCart();
        fetchBackendData();
        return true;
      }
      return false;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const updateTableStatus = (tableId, newStatus) => {
    setTables(tables.map(t => t.id === tableId ? { ...t, status: newStatus } : t));
  };

  const addReservation = async (reservation) => {
    try {
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...reservation,
          customerId: customer?.id || null
        })
      });
      if (response.ok) {
        fetchBackendData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const addLoungeBooking = async (booking) => {
    try {
      const response = await fetch('/api/lounge-bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(booking)
      });
      if (response.ok) {
        fetchBackendData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const updateReservationStatus = (reservationId, newStatus, tableId = null) => {
    setReservations(reservations.map(res => {
      if (res.id === reservationId) {
        const updated = { ...res, status: newStatus };
        if (tableId) updated.tableId = tableId;
        return updated;
      }
      return res;
    }));
    
    // Auto-update table status
    const res = reservations.find(r => r.id === reservationId);
    const targetTableId = tableId || res?.tableId;
    
    if (targetTableId) {
      if (newStatus === 'Seated') updateTableStatus(targetTableId, 'Seated');
      if (newStatus === 'Completed') updateTableStatus(targetTableId, 'Dirty');
      if (newStatus === 'Canceled' && res?.status === 'Seated') updateTableStatus(targetTableId, 'Dirty');
    }
  };

  const loginCustomer = async (email, password) => {
    const res = await fetch('/api/customers/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    setCustomer(data);
    localStorage.setItem('customerData', JSON.stringify(data));
  };

  const registerCustomer = async (name, email, password) => {
    const res = await fetch('/api/customers/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    setCustomer(data);
    localStorage.setItem('customerData', JSON.stringify(data));
  };

  const logoutCustomer = () => {
    setCustomer(null);
    localStorage.removeItem('customerData');
  };

  return (
    <RestaurantContext.Provider value={{
      tables,
      menuItems,
      reservations,
      loungeBookings,
      orders,
      cart,
      analytics,
      monthlyRevenueData,
      topSellingItems,
      customer,
      updateTableStatus,
      addReservation,
      addLoungeBooking,
      updateReservationStatus,
      addToCart,
      removeFromCart,
      clearCart,
      placeOrder,
      fetchBackendData,
      loginCustomer,
      registerCustomer,
      logoutCustomer
    }}>
      {children}
    </RestaurantContext.Provider>
  );
};

export const useRestaurant = () => useContext(RestaurantContext);
