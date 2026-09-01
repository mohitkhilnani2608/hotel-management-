import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Notebook, ChefHat, Bell, Search, LineChart, Package, LogOut, KeyRound } from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useRestaurant } from '../../context/RestaurantContext';
import { Dialog, DialogHeader, DialogTitle, DialogDescription } from '../ui/Dialog';

export const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { staffUser, logoutStaff, changeStaffPassword } = useRestaurant();

  const isOwner = staffUser?.role === 'Admin';

  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Table Matrix', path: '/admin/matrix', icon: LayoutDashboard },
    { name: 'Kitchen & Tasks', path: '/admin/tasks', icon: ChefHat },
    { name: 'Reservations', path: '/admin/reservations', icon: Notebook },
    { name: 'Inventory', path: '/admin/inventory', icon: Package },
  ];

  if (isOwner) {
    navItems.push({ name: 'Guests', path: '/admin/guests', icon: Users });
    navItems.push({ name: 'Analytics & Reports', path: '/admin/analytics', icon: LineChart });
  }

  const handleChangePasswordSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    
    if (newPassword !== confirmPassword) {
      setErrorMessage('New passwords do not match.');
      return;
    }

    if (newPassword.length < 4) {
      setErrorMessage('Password must be at least 4 characters long.');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await changeStaffPassword(staffUser.email, currentPassword, newPassword);
      setSuccessMessage('Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        setIsChangePasswordOpen(false);
        setSuccessMessage('');
      }, 1500);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to update password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/20 flex font-sans text-foreground">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r flex flex-col shrink-0">
        <div className="h-20 flex items-center px-6 border-b">
          <Link to="/" className="text-2xl font-serif font-bold tracking-tight">
            AuraDine<span className="text-primary">.</span>
          </Link>
          <span className="ml-2 text-xs font-medium uppercase tracking-wider text-muted-foreground mt-1">Admin</span>
        </div>
        
        <nav className="flex-1 py-6 px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium ${
                  isActive 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <Icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center font-serif text-lg">
                {staffUser?.name ? staffUser.name.charAt(0).toUpperCase() : 'S'}
              </div>
              <div className="text-sm">
                <p className="font-medium">{staffUser?.name || 'Staff Member'}</p>
                <p className="text-muted-foreground text-xs">{staffUser?.email || 'staff@auradine.com'}</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-muted-foreground hover:text-primary"
                onClick={() => {
                  setErrorMessage('');
                  setSuccessMessage('');
                  setIsChangePasswordOpen(true);
                }}
                title="Change Password"
              >
                <KeyRound className="h-5 w-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-muted-foreground hover:text-destructive"
                onClick={() => {
                  logoutStaff();
                  navigate('/');
                }}
                title="Log Out"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-20 bg-card border-b flex items-center justify-between px-8 shrink-0">
          <div className="w-96 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search reservations, tables, guests..." 
              className="pl-9 bg-muted/50 border-transparent focus:bg-background"
            />
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-muted-foreground hover:text-foreground transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-card"></span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-8">
          <Outlet />
        </main>
      </div>

      {/* Change Password Dialog */}
      <Dialog open={isChangePasswordOpen} onOpenChange={(open) => !open && setIsChangePasswordOpen(false)}>
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">Change Password</DialogTitle>
          <DialogDescription>
            Enter your current password and your new password twice to confirm changes.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleChangePasswordSubmit} className="space-y-4 py-4">
          {errorMessage && (
            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg border border-destructive/20 font-medium">
              {errorMessage}
            </div>
          )}
          {successMessage && (
            <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm p-3 rounded-lg border border-green-200 dark:border-green-800 font-medium">
              {successMessage}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium">Current Password</label>
            <Input 
              type="password" 
              required 
              value={currentPassword} 
              onChange={(e) => setCurrentPassword(e.target.value)} 
              placeholder="••••••••"
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">New Password</label>
            <Input 
              type="password" 
              required 
              value={newPassword} 
              onChange={(e) => setNewPassword(e.target.value)} 
              placeholder="••••••••"
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Confirm New Password</label>
            <Input 
              type="password" 
              required 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              placeholder="••••••••"
              disabled={isSubmitting}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsChangePasswordOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-primary text-primary-foreground"
            >
              {isSubmitting ? 'Updating...' : 'Update Password'}
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
};
