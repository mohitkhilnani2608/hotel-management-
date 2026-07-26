import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Notebook, ChefHat, Bell, Search, Utensils, LineChart, Package, LogOut } from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

export const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isOwner = localStorage.getItem('ownerAuth') === 'true';

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
                M
              </div>
              <div className="text-sm">
                <p className="font-medium">{isOwner ? 'Owner' : 'Staff'}</p>
                <p className="text-muted-foreground text-xs">{isOwner ? 'admin@auradine.com' : 'staff@auradine.com'}</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-muted-foreground hover:text-destructive"
              onClick={() => {
                localStorage.removeItem('staffAuth');
                localStorage.removeItem('ownerAuth');
                navigate('/');
              }}
              title="Log Out"
            >
              <LogOut className="h-5 w-5" />
            </Button>
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
    </div>
  );
};
