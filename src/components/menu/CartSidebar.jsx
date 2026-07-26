import React, { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { Button } from '../ui/Button';

export const CartSidebar = ({ isOpen, onClose }) => {
  const { cart, removeFromCart, placeOrder } = useRestaurant();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  if (!isOpen) return null;

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    setIsSubmitting(true);
    try {
      const success = await placeOrder();
      if (success) {
        alert('Order placed successfully!');
        onClose();
      } else {
        alert('Failed to place order. Please try again.');
      }
    } catch (e) {
      if (e.message !== "Must be logged in to place an order") {
        alert('Failed to place order. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm transition-opacity">
      <div className="w-full max-w-md bg-background border-l border-border shadow-2xl h-full flex flex-col">
        <div className="p-6 border-b border-border flex justify-between items-center">
          <h2 className="text-xl font-serif font-bold">Your Order</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">✕</button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
          {cart.length === 0 ? (
            <p className="text-muted-foreground text-center mt-10">Your cart is empty.</p>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex justify-between items-center bg-muted/20 p-4 rounded-lg">
                <div>
                  <h4 className="font-medium text-foreground">{item.name}</h4>
                  <p className="text-sm text-muted-foreground">Qty: {item.quantity} × ${item.price}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-semibold">${item.price * item.quantity}</span>
                  <button onClick={() => removeFromCart(item.id)} className="text-destructive hover:text-destructive/80 text-sm">Remove</button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-6 border-t border-border bg-muted/10">
          <div className="flex justify-between items-center mb-6">
            <span className="text-lg font-medium">Total</span>
            <span className="text-xl font-serif font-bold">${total.toFixed(2)}</span>
          </div>
          <Button 
            className="w-full" 
            disabled={cart.length === 0 || isSubmitting}
            onClick={handleCheckout}
          >
            {isSubmitting ? 'Processing...' : 'Place Order'}
          </Button>
        </div>
      </div>
    </div>
  );
};
