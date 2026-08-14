import React, { createContext, useState, useContext, useEffect } from 'react';
import { subHours, addDays } from 'date-fns';

const initialTables = [
  { id: 'T1', number: '1', capacity: 2, status: 'Available', type: 'Window', location: 'Main Dining' },
  { id: 'T2', number: '2', capacity: 2, status: 'Available', type: 'Standard', location: 'Main Dining' },
  { id: 'T3', number: '3', capacity: 4, status: 'Available', type: 'Booth', location: 'Main Dining' },
  { id: 'T4', number: '4', capacity: 4, status: 'Available', type: 'Booth', location: 'Main Dining' },
  { id: 'T5', number: '5', capacity: 6, status: 'Available', type: 'Round', location: 'Main Dining' },
  { id: 'T6', number: '6', capacity: 2, status: 'Available', type: 'Bar', location: 'Bar Area' },
  { id: 'T7', number: '7', capacity: 2, status: 'Available', type: 'Bar', location: 'Bar Area' },
  { id: 'T8', number: '8', capacity: 8, status: 'Available', type: 'Private', location: 'Private Room' },
  { id: 'T9', number: '9', capacity: 4, status: 'Available', type: 'Patio', location: 'Outdoor' },
  { id: 'T10', number: '10', capacity: 4, status: 'Available', type: 'Patio', location: 'Outdoor' },
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

const RestaurantContext = createContext();

export const RestaurantProvider = ({ children }) => {
  const [tables, setTables] = useState(initialTables);
  const [menuItems] = useState(initialMenu);
  const [reservations, setReservations] = useState([]);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loungeBookings, setLoungeBookings] = useState([]);
  const [customer, setCustomer] = useState(null);
  const [staffUser, setStaffUser] = useState(null);

  const [analytics, setAnalytics] = useState({
    totalRevenue: 0,
    netProfit: 0,
    orderCount: 0,
    reservationCount: 0,
    loungeCount: 0,
    totalCustomers: 0
  });

  useEffect(() => {
    const savedCustomer = localStorage.getItem('customerData');

    if (savedCustomer) {
      setCustomer(JSON.parse(savedCustomer));
    }

    const savedStaff = localStorage.getItem('staffData');

    if (savedStaff) {
      setStaffUser(JSON.parse(savedStaff));
    }
  }, []);

  const fetchBackendData = async () => {
    try {
      const [resReq, loungeReq, ordersReq] = await Promise.all([
        fetch('/api/reservations'),
        fetch('/api/lounge-bookings'),
        fetch('/api/orders')
      ]);

      const resAnalytics = await fetch('/api/analytics');

      if (resAnalytics.ok) {
        const dataAnalytics = await resAnalytics.json();
        setAnalytics(dataAnalytics);
      }

      if (resReq.ok) {
        const resData = await resReq.json();

        setReservations(resData);

        setTables(prevTables => {
          return prevTables.map(table => {
            const isSeated = resData.some(
              r => r.tableId === table.id && r.status === 'Seated'
            );

            if (isSeated) return { ...table, status: 'Seated' };

            if (table.status === 'Dirty') return table;

            return { ...table, status: 'Available' };
          });
        });
      }

      if (loungeReq.ok) {
        setLoungeBookings(await loungeReq.json());
      }

      if (ordersReq.ok) {
        setOrders(await ordersReq.json());
      }

    } catch (error) {
      console.error('Error fetching backend data:', error);
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
        return prev.map(i =>
          i.id === item.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }

      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId) => {
    setCart(prev => prev.filter(i => i.id !== itemId));
  };

  const updateQuantity = (itemId, quantity) => {
    setCart(prev =>
      prev.map(i =>
        i.id === itemId
          ? { ...i, quantity }
          : i
      )
    );
  };

  const clearCart = () => setCart([]);

  const placeOrder = async () => {
    if (!customer) {
      setAuthModalOpen(true);
      throw new Error("Must be logged in to place an order");
    }

    const cartTotal = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const activeSeatedRes = reservations.find(r =>
      (
        r.customerId === customer.id ||
        r.guestName.toLowerCase() === customer.name.toLowerCase()
      ) &&
      r.status === 'Seated'
    );

    const tableId = activeSeatedRes
      ? activeSeatedRes.tableId
      : null;

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          total: cartTotal,
          items: cart,
          customerId: customer?.id || null,
          tableId: tableId
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

  const fetchActiveTableOrder = async (tableId) => {
    try {
      const res = await fetch(
        `/api/orders/active-table/${tableId}`
      );

      if (res.ok) {
        return await res.json();
      }

      return null;

    } catch (e) {
      console.error(
        "Failed to fetch active table order:",
        e
      );

      return null;
    }
  };

  const createTableOrder = async (
    tableId,
    items,
    customerId = null
  ) => {
    const total = items.reduce(
      (sum, item) =>
        sum + item.price * item.quantity,
      0
    );

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          total,
          items,
          customerId,
          tableId
        })
      });

      if (res.ok) {
        fetchBackendData();
        return await res.json();
      }

      return null;

    } catch (e) {
      console.error(
        "Failed to create table order:",
        e
      );

      return null;
    }
  };

  const updateTableOrderItems = async (
    orderId,
    items
  ) => {
    const total = items.reduce(
      (sum, item) =>
        sum + item.price * item.quantity,
      0
    );

    try {
      const res = await fetch(
        `/api/orders/${orderId}/items`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            total,
            items
          })
        }
      );

      if (res.ok) {
        fetchBackendData();
        return await res.json();
      }

      return null;

    } catch (e) {
      console.error(
        "Failed to update table order items:",
        e
      );

      return null;
    }
  };

  const settleTableOrder = async (
    orderId,
    tableId
  ) => {
    try {
      const orderRes = await fetch(
        `/api/orders/${orderId}/status`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            status: 'Completed'
          })
        }
      );

      if (!orderRes.ok) return false;

      const activeRes = reservations.find(
        r =>
          r.tableId === tableId &&
          r.status === 'Seated'
      );

      if (activeRes) {
        await updateReservationStatus(
          activeRes.id,
          'Completed',
          tableId
        );
      }

      updateTableStatus(
        tableId,
        'Dirty'
      );

      fetchBackendData();

      return true;

    } catch (e) {
      console.error(
        "Failed to settle table order:",
        e
      );

      return false;
    }
  };

  const updateOrderStatus = async (
    orderId,
    status
  ) => {
    try {
      const response = await fetch(
        `/api/orders/${orderId}/status`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ status })
        }
      );

      if (response.ok) {
        fetchBackendData();
      }

    } catch (e) {
      console.error(
        'Failed to update order status',
        e
      );
    }
  };

  const updateTableStatus = (
    tableId,
    newStatus
  ) => {
    setTables(
      tables.map(t =>
        t.id === tableId
          ? { ...t, status: newStatus }
          : t
      )
    );
  };

  const addReservation = async (
    reservation
  ) => {
    try {
      const response = await fetch(
        '/api/reservations',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ...reservation,
            customerId: customer?.id || null
          })
        }
      );

      if (response.ok) {
        fetchBackendData();
      }

    } catch (e) {
      console.error(e);
    }
  };

  const addLoungeBooking = async (
    booking
  ) => {
    try {
      const response = await fetch(
        '/api/lounge-bookings',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(booking)
        }
      );

      if (response.ok) {
        fetchBackendData();
      }

    } catch (e) {
      console.error(e);
    }
  };

  const updateReservationStatus = async (
    reservationId,
    newStatus,
    tableId = null
  ) => {

    setReservations(
      reservations.map(res => {
        if (res.id === reservationId) {
          const updated = {
            ...res,
            status: newStatus
          };

          if (tableId !== null) {
            updated.tableId = tableId;
          }

          return updated;
        }

        return res;
      })
    );

    const resObj = reservations.find(
      r => r.id === reservationId
    );

    const targetTableId =
      tableId !== null
        ? tableId
        : resObj?.tableId;

    if (targetTableId) {
      if (newStatus === 'Seated') {
        updateTableStatus(
          targetTableId,
          'Seated'
        );
      }

      if (newStatus === 'Completed') {
        updateTableStatus(
          targetTableId,
          'Dirty'
        );
      }

      if (
        newStatus === 'Canceled' &&
        resObj?.status === 'Seated'
      ) {
        updateTableStatus(
          targetTableId,
          'Dirty'
        );
      }
    }

    try {
      const response = await fetch(
        `/api/reservations/${reservationId}/status`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            status: newStatus,
            tableId:
              tableId !== null
                ? tableId
                : undefined
          })
        }
      );

      if (response.ok) {
        fetchBackendData();
      }

    } catch (e) {
      console.error(
        'Failed to update reservation status',
        e
      );
    }
  };

  const loginCustomer = async (
    email,
    password
  ) => {

    const res = await fetch(
      '/api/customers/login',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          password
        })
      }
    );

    let data;

    const contentType =
      res.headers.get("content-type");

    if (
      contentType &&
      contentType.includes("application/json")
    ) {
      data = await res.json();
    } else {
      const text = await res.text();

      console.error(
        "Non-JSON response from server:",
        text
      );

      throw new Error(
        "Server error: Did not receive JSON. The server might be down or misconfigured."
      );
    }

    if (!res.ok) {
      throw new Error(
        data.error || 'Login failed'
      );
    }

    setCustomer(data);

    localStorage.setItem(
      'customerData',
      JSON.stringify(data)
    );
  };

  const registerCustomer = async (
    name,
    email,
    password
  ) => {

    const res = await fetch(
      '/api/customers/register',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          email,
          password
        })
      }
    );

    let data;

    const contentType =
      res.headers.get("content-type");

    if (
      contentType &&
      contentType.includes("application/json")
    ) {
      data = await res.json();
    } else {
      const text = await res.text();

      console.error(
        "Non-JSON response from server:",
        text
      );

      throw new Error(
        "Server error: Did not receive JSON. The server might be down or misconfigured."
      );
    }

    if (!res.ok) {
      throw new Error(
        data.error || 'Registration failed'
      );
    }

    setCustomer(data);

    localStorage.setItem(
      'customerData',
      JSON.stringify(data)
    );
  };

  const logoutCustomer = () => {
    setCustomer(null);

    localStorage.removeItem(
      'customerData'
    );
  };

  // ============================================
  // STAFF LOGIN
  // ============================================

  const loginStaff = async (
    email,
    password
  ) => {

    const res = await fetch(
      '/api/staff/login',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password
        })
      }
    );

    let data;

    const contentType =
      res.headers.get("content-type");

    if (
      contentType &&
      contentType.includes("application/json")
    ) {
      data = await res.json();
    } else {
      const text = await res.text();

      console.error(
        "Non-JSON response from server:",
        text
      );

      throw new Error(
        "Server error: Did not receive JSON."
      );
    }

    if (!res.ok) {
      throw new Error(
        data.error || 'Login failed'
      );
    }

    setStaffUser(data);

    localStorage.setItem(
      'staffData',
      JSON.stringify(data)
    );
  };

  const registerStaff = async (
    name,
    email,
    password,
    role
  ) => {

    const res = await fetch(
      '/api/staff/register',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          email: email.trim().toLowerCase(),
          password,
          role
        })
      }
    );

    let data;

    const contentType =
      res.headers.get("content-type");

    if (
      contentType &&
      contentType.includes("application/json")
    ) {
      data = await res.json();
    } else {
      const text = await res.text();

      console.error(
        "Non-JSON response from server:",
        text
      );

      throw new Error(
        "Server error: Did not receive JSON."
      );
    }

    if (!res.ok) {
      throw new Error(
        data.error || 'Registration failed'
      );
    }

    setStaffUser(data);

    localStorage.setItem(
      'staffData',
      JSON.stringify(data)
    );
  };

  const logoutStaff = () => {
    setStaffUser(null);

    localStorage.removeItem(
      'staffData'
    );

    localStorage.removeItem(
      'ownerAuth'
    );

    localStorage.removeItem(
      'staffAuth'
    );
  };

  // ============================================
  // CHANGE STAFF PASSWORD
  // ============================================

  const changeStaffPassword = async (
    email,
    currentPassword,
    newPassword
  ) => {

    const res = await fetch(
      '/api/staff/change-password',
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          currentPassword,
          newPassword
        })
      }
    );

    let data;

    const contentType =
      res.headers.get("content-type");

    if (
      contentType &&
      contentType.includes("application/json")
    ) {
      data = await res.json();
    } else {
      const text = await res.text();

      console.error(
        "Non-JSON response from server:",
        text
      );

      throw new Error(
        "Server error: Did not receive JSON."
      );
    }

    if (!res.ok) {
      throw new Error(
        data.error ||
        'Failed to change password'
      );
    }

    return data;
  };

  // ============================================
  // FORGOT PASSWORD - REQUEST OTP
  // ============================================

  const requestStaffPasswordReset = async (
    email
  ) => {

    const normalizedEmail =
      email.trim().toLowerCase();

    const res = await fetch(
      'http://localhost:5005/api/staff/forgot-password',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: normalizedEmail
        })
      }
    );

    let data;

    const contentType =
      res.headers.get("content-type");

    if (
      contentType &&
      contentType.includes("application/json")
    ) {
      data = await res.json();
    } else {
      const text = await res.text();

      console.error(
        "Non-JSON response from server:",
        text
      );

      throw new Error(
        "Server error: Did not receive JSON."
      );
    }

    if (!res.ok) {
      throw new Error(
        data.error ||
        data.message ||
        'Failed to request password reset'
      );
    }

    return data;
  };

  // ============================================
  // FORGOT PASSWORD - VERIFY OTP
  // ============================================

  const verifyStaffResetOtp = async (
    email,
    otp
  ) => {

    const normalizedEmail =
      email.trim().toLowerCase();

    const res = await fetch(
      'http://localhost:5005/api/staff/verify-reset-otp',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: normalizedEmail,
          otp: otp.trim()
        })
      }
    );

    let data;

    const contentType =
      res.headers.get("content-type");

    if (
      contentType &&
      contentType.includes("application/json")
    ) {
      data = await res.json();
    } else {
      const text = await res.text();

      console.error(
        "Non-JSON response from server:",
        text
      );

      throw new Error(
        "Server error: Did not receive JSON."
      );
    }

    if (!res.ok) {
      throw new Error(
        data.error ||
        data.message ||
        'Invalid reset code'
      );
    }

    return data;
  };

  // ============================================
  // FORGOT PASSWORD - RESET PASSWORD
  // ============================================

  const resetStaffPassword = async (
    email,
    newPassword
  ) => {

    const normalizedEmail =
      email.trim().toLowerCase();

    const res = await fetch(
      'http://localhost:5005/api/staff/reset-password',
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: normalizedEmail,
          newPassword
        })
      }
    );

    let data;

    const contentType =
      res.headers.get("content-type");

    if (
      contentType &&
      contentType.includes("application/json")
    ) {
      data = await res.json();
    } else {
      const text = await res.text();

      console.error(
        "Non-JSON response from server:",
        text
      );

      throw new Error(
        "Server error: Did not receive JSON."
      );
    }

    if (!res.ok) {
      throw new Error(
        data.error ||
        data.message ||
        'Failed to reset password'
      );
    }

    return data;
  };

  const itemSales = {};

  orders.forEach(order => {
    (order.items || []).forEach(item => {

      if (!itemSales[item.name]) {
        itemSales[item.name] = {
          sales: 0,
          revenue: 0
        };
      }

      itemSales[item.name].sales +=
        item.quantity;

      itemSales[item.name].revenue +=
        item.price * item.quantity;
    });
  });

  const dynamicTopSellingItems =
    Object.keys(itemSales)
      .map((name, idx) => ({
        name,
        sales: itemSales[name].sales,
        revenue: itemSales[name].revenue,
        fill: `hsl(var(--primary) / ${1 - (idx * 0.15)})`
      }))
      .sort(
        (a, b) => b.revenue - a.revenue
      )
      .slice(0, 5);

  const monthlyData = {};

  orders.forEach(order => {

    const date = new Date(
      order.createdAt || Date.now()
    );

    const month =
      date.toLocaleString(
        'default',
        { month: 'short' }
      );

    if (!monthlyData[month]) {
      monthlyData[month] = {
        month,
        revenue: 0,
        profit: 0
      };
    }

    monthlyData[month].revenue +=
      order.total;

    monthlyData[month].profit +=
      order.total * 0.3;
  });

  const dynamicMonthlyRevenueData =
    Object.values(monthlyData);

  return (
    <RestaurantContext.Provider
      value={{
        tables,
        menuItems,
        reservations,
        loungeBookings,
        orders,
        cart,
        analytics,

        monthlyRevenueData:
          dynamicMonthlyRevenueData,

        topSellingItems:
          dynamicTopSellingItems,

        customer,

        updateTableStatus,
        addReservation,
        addLoungeBooking,
        updateReservationStatus,

        addToCart,
        removeFromCart,
        updateQuantity,

        cartTotal: cart.reduce(
          (total, item) =>
            total +
            (item.price * item.quantity),
          0
        ),

        placeOrder,

        loginCustomer,
        registerCustomer,
        logoutCustomer,

        staffUser,
        loginStaff,
        registerStaff,
        logoutStaff,

        updateOrderStatus,
        fetchBackendData,

        authModalOpen,
        setAuthModalOpen,

        fetchActiveTableOrder,
        createTableOrder,
        updateTableOrderItems,
        settleTableOrder,

        changeStaffPassword,

        // Forgot Password
        requestStaffPasswordReset,
        verifyStaffResetOtp,
        resetStaffPassword
      }}
    >
      {children}
    </RestaurantContext.Provider>
  );
};

export const useRestaurant = () =>
  useContext(RestaurantContext);