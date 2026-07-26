import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRestaurant } from '../../context/RestaurantContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export const PrivateEvents = () => {
  const { addLoungeBooking, customer, setAuthModalOpen } = useRestaurant();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    date: '',
    guests: '',
    details: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!customer) {
      setAuthModalOpen(true);
      return;
    }
    
    addLoungeBooking({
      guestName: `${formData.firstName} ${formData.lastName}`,
      eventDetails: formData.details,
      guests: parseInt(formData.guests, 10),
      date: formData.date,
      time: '19:00' // Default evening time for events
    });
    setIsSubmitted(true);
  };

  return (
    <div className="pt-32 pb-24 min-h-screen">
      <div className="container mx-auto px-6 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-24"
        >
          <span className="text-primary uppercase tracking-[0.2em] text-sm font-medium mb-4 block">
            Exclusive Experiences
          </span>
          <h1 className="text-5xl md:text-7xl font-serif mb-6 leading-tight">
            Private Dining & Events
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Host your most important moments in a setting of unparalleled elegance. We offer tailored experiences for intimate gatherings, corporate dinners, and full restaurant buyouts.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start mb-32">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-12"
          >
            <div>
              <h2 className="text-3xl font-serif mb-4">The Obsidian Room</h2>
              <p className="text-muted-foreground mb-4">
                Our signature private dining room features a striking black marble table, dramatic lighting, and a dedicated sommelier. Perfect for executive dinners or milestone celebrations.
              </p>
              <ul className="text-sm text-primary flex gap-6 tracking-wider font-semibold">
                <li>CAPACITY: 14 GUESTS</li>
                <li>A/V EQUIPPED</li>
              </ul>
            </div>
            
            <div className="pt-8 border-t border-white/10">
              <h2 className="text-3xl font-serif mb-4">The Champagne Lounge</h2>
              <p className="text-muted-foreground mb-4">
                A semi-private, softly lit enclave ideal for cocktail receptions and casual networking, featuring plush velvet seating and direct bar access.
              </p>
              <ul className="text-sm text-primary flex gap-6 tracking-wider font-semibold">
                <li>CAPACITY: 30 GUESTS</li>
                <li>COCKTAIL STYLE</li>
              </ul>
            </div>

            <div className="pt-8 border-t border-white/10">
              <h2 className="text-3xl font-serif mb-4">Full Buyout</h2>
              <p className="text-muted-foreground mb-4">
                Secure the entirety of AuraDine for your wedding reception or major corporate event. Includes bespoke menu creation with Chef Alexandre.
              </p>
              <ul className="text-sm text-primary flex gap-6 tracking-wider font-semibold">
                <li>CAPACITY: 120 GUESTS</li>
                <li>CUSTOM MENU</li>
              </ul>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-card/50 backdrop-blur-md p-8 md:p-12 rounded-2xl border border-white/5 shadow-luxury"
          >
            <h3 className="text-2xl font-serif mb-6">Inquire About an Event</h3>
            {isSubmitted ? (
              <div className="text-center py-12">
                <h4 className="text-xl font-serif text-primary mb-2">Request Received</h4>
                <p className="text-muted-foreground">Thank you for your interest. Our event coordinator will be in touch shortly to finalize your booking.</p>
              </div>
            ) : (
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground uppercase tracking-wider font-medium">First Name</label>
                    <Input required name="firstName" value={formData.firstName || (customer ? customer.name.split(' ')[0] : '')} onChange={handleChange} placeholder="John" className="bg-background/50 border-white/10" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground uppercase tracking-wider font-medium">Last Name</label>
                    <Input required name="lastName" value={formData.lastName || (customer ? customer.name.split(' ').slice(1).join(' ') : '')} onChange={handleChange} placeholder="Doe" className="bg-background/50 border-white/10" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground uppercase tracking-wider font-medium">Email Address</label>
                  <Input required type="email" name="email" value={formData.email || (customer?.email || '')} onChange={handleChange} placeholder="john@example.com" className="bg-background/50 border-white/10" />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground uppercase tracking-wider font-medium">Desired Date</label>
                    <Input required type="date" name="date" value={formData.date} onChange={handleChange} className="bg-background/50 border-white/10" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground uppercase tracking-wider font-medium">Guest Count</label>
                    <Input required type="number" name="guests" value={formData.guests} onChange={handleChange} placeholder="20" className="bg-background/50 border-white/10" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground uppercase tracking-wider font-medium">Event Details</label>
                  <textarea 
                    name="details"
                    value={formData.details}
                    onChange={handleChange}
                    className="flex w-full rounded-md border border-white/10 bg-background/50 px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 min-h-[120px]"
                    placeholder="Tell us about the occasion..."
                  />
                </div>
                <Button type="submit" className="w-full text-lg h-12">Request Proposal</Button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};
