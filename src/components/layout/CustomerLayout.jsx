import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';
import { CustomerAuthModal } from '../auth/CustomerAuthModal';
import { StaffLoginModal } from '../auth/StaffLoginModal';
import { useRestaurant } from '../../context/RestaurantContext';

export const CustomerLayout = () => {
  const { customer, logoutCustomer } = useRestaurant();
  const location = useLocation();
  const navigate = useNavigate();
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Menu', path: '/menu' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Reservations', path: '/booking' },
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans text-foreground bg-background selection:bg-primary/20">
      <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border transition-all duration-300">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="text-2xl font-serif font-bold tracking-tight">
            AuraDine<span className="text-primary">.</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-primary ${location.pathname === link.path ? 'text-foreground' : 'text-muted-foreground'}`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              className="text-muted-foreground hover:text-foreground hidden sm:block"
              onClick={() => setIsStaffModalOpen(true)}
            >
              Staff
            </Button>
            
            {customer ? (
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium hidden sm:inline-block">Hi, {customer.name}</span>
                <Button variant="outline" size="sm" onClick={logoutCustomer}>Logout</Button>
              </div>
            ) : (
              <Button variant="outline" size="sm" onClick={() => setIsCustomerModalOpen(true)}>Login / Sign Up</Button>
            )}
            
            <Link to="/booking">
              <Button variant="default">Book a Table</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <CustomerAuthModal
        isOpen={isCustomerModalOpen}
        onClose={() => setIsCustomerModalOpen(false)}
      />

      <StaffLoginModal
        isOpen={isStaffModalOpen}
        onClose={() => setIsStaffModalOpen(false)}
      />

      <footer className="bg-foreground text-background py-16">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="text-3xl font-serif font-bold tracking-tight mb-4 inline-block">
              AuraDine<span className="text-primary">.</span>
            </Link>
            <p className="text-muted max-w-sm mt-4 leading-relaxed">
              Experience culinary excellence in an atmosphere of quiet luxury. A sanctuary for taste and elegance.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-6 uppercase tracking-wider text-sm">Experience</h4>
            <ul className="space-y-4 text-muted">
              <li><Link to="/about" className="hover:text-primary transition-colors">Our Story</Link></li>
              <li><Link to="/menu" className="hover:text-primary transition-colors">Our Menu</Link></li>
              <li><Link to="/gallery" className="hover:text-primary transition-colors">Gallery</Link></li>
              <li><Link to="/booking" className="hover:text-primary transition-colors">Reservations</Link></li>
              <li><Link to="/private-events" className="hover:text-primary transition-colors">Private Dining</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-6 uppercase tracking-wider text-sm">Contact</h4>
            <ul className="space-y-4 text-muted">
              <li>123 Culinary Way, NY 10012</li>
              <li>+1 (555) 123-4567</li>
              <li>reservations@auradine.com</li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto px-6 mt-16 pt-8 border-t border-muted/20 text-sm text-muted/60 flex flex-col md:flex-row justify-between items-center">
          <p>© {new Date().getFullYear()} AuraDine. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
