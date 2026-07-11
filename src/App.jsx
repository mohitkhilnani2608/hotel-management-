import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { RestaurantProvider } from './context/RestaurantContext';

// Layouts
import { CustomerLayout } from './components/layout/CustomerLayout';
import { AdminLayout } from './components/layout/AdminLayout';

import { Home } from './pages/customer/Home';
import { About } from './pages/customer/About';
import { Menu } from './pages/customer/Menu';
import { Gallery } from './pages/customer/Gallery';
import { TableBooking } from './pages/customer/TableBooking';
import { PrivateEvents } from './pages/customer/PrivateEvents';
import { GuestDashboard } from './pages/customer/GuestDashboard';

// Admin Pages
import { Dashboard } from './pages/admin/Dashboard';
import { TableMatrix } from './pages/admin/TableMatrix';
import { Reservations } from './pages/admin/Reservations';
import { StaffTasks } from './pages/admin/StaffTasks';
import { OwnerAnalytics } from './pages/admin/OwnerAnalytics';
import { Inventory } from './pages/admin/Inventory';

function App() {
  return (
    <RestaurantProvider>
      <BrowserRouter>
        <Routes>
          {/* Customer Routes */}
          <Route path="/" element={<CustomerLayout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="menu" element={<Menu />} />
            <Route path="gallery" element={<Gallery />} />
            <Route path="booking" element={<TableBooking />} />
            <Route path="private-events" element={<PrivateEvents />} />
            <Route path="dashboard" element={<GuestDashboard />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="matrix" element={<TableMatrix />} />
            <Route path="reservations" element={<Reservations />} />
            <Route path="tasks" element={<StaffTasks />} />
            <Route path="analytics" element={<OwnerAnalytics />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </RestaurantProvider>
  );
}

export default App;
