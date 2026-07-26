import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Calendar, Clock, Users } from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';

export const TableBooking = () => {
  const navigate = useNavigate();
  const { addReservation, customer, setAuthModalOpen } = useRestaurant();
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    date: '', time: '19:00', partySize: '2',
    specialRequests: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if (!customer && step === 1) {
      setAuthModalOpen(true);
      return;
    }
    
    // Auto fill if customer is present and we're moving to step 2
    if (customer && step === 1 && !formData.firstName) {
      const parts = customer.name.split(' ');
      setFormData(prev => ({
        ...prev,
        firstName: parts[0] || '',
        lastName: parts.slice(1).join(' ') || '',
        email: customer.email || ''
      }));
    }
    
    setStep(s => s + 1);
  };
  const handleBack = () => setStep(s => s - 1);

  const handleSubmit = (e) => {
    e.preventDefault();
    addReservation({
      guestName: `${formData.firstName} ${formData.lastName}`,
      partySize: parseInt(formData.partySize, 10),
      tableId: null, // Host will assign
      date: formData.date,
      time: formData.time,
    });
    setStep(3); // Success step
  };

  return (
    <div className="pt-24 pb-16 min-h-screen bg-muted/20">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-serif">Reserve a Table</h1>
          <p className="text-muted-foreground mt-2">Join us for an unforgettable dining experience.</p>
        </div>

        {step === 3 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card border rounded-2xl p-12 text-center max-w-2xl mx-auto shadow-sm"
          >
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="h-10 w-10" />
            </div>
            <h2 className="text-3xl font-serif mb-4">Reservation Confirmed!</h2>
            <p className="text-muted-foreground mb-8 text-lg">
              Thank you, {formData.firstName}. We look forward to serving you on {new Date(formData.date).toLocaleDateString()} at {formData.time}.
            </p>
            <Button size="lg" onClick={() => navigate('/dashboard')}>
              View My Reservations
            </Button>
          </motion.div>
        ) : (
          <div className="bg-card border rounded-2xl shadow-sm overflow-hidden">
            <div className="flex flex-col md:flex-row">
              {/* Form Side */}
              <div className="flex-1 p-8 md:p-12">
                <div className="flex items-center justify-between mb-8 relative">
                  {['Details', 'Guest Info'].map((label, i) => (
                    <div key={label} className="flex flex-col items-center gap-2 relative z-10 bg-card px-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${step === i + 1 ? 'bg-primary text-primary-foreground' : step > i + 1 ? 'bg-primary/20 text-primary' : 'bg-muted border text-muted-foreground'}`}>
                        {step > i + 1 ? <Check className="h-4 w-4" /> : i + 1}
                      </div>
                      <span className={`text-xs font-medium ${step >= i + 1 ? 'text-foreground' : 'text-muted-foreground'}`}>{label}</span>
                    </div>
                  ))}
                  <div className="absolute top-4 left-12 right-12 h-px bg-border -z-0"></div>
                </div>

                <form onSubmit={step === 2 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }}>
                  {step === 1 && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium flex items-center gap-2"><Calendar className="w-4 h-4 text-muted-foreground"/> Date</label>
                          <Input required type="date" name="date" value={formData.date} onChange={handleChange} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center gap-2"><Clock className="w-4 h-4 text-muted-foreground"/> Time</label>
                            <Select required name="time" value={formData.time} onChange={handleChange}>
                              <option value="17:00">5:00 PM</option>
                              <option value="17:30">5:30 PM</option>
                              <option value="18:00">6:00 PM</option>
                              <option value="18:30">6:30 PM</option>
                              <option value="19:00">7:00 PM</option>
                              <option value="19:30">7:30 PM</option>
                              <option value="20:00">8:00 PM</option>
                              <option value="20:30">8:30 PM</option>
                              <option value="21:00">9:00 PM</option>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center gap-2"><Users className="w-4 h-4 text-muted-foreground"/> Party Size</label>
                            <Select required name="partySize" value={formData.partySize} onChange={handleChange}>
                              {[...Array(10)].map((_, i) => (
                                <option key={i+1} value={i+1}>{i+1} {i === 0 ? 'Person' : 'People'}</option>
                              ))}
                            </Select>
                          </div>
                        </div>
                      </div>
                      <Button type="submit" size="lg" className="w-full">Continue</Button>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">First Name</label>
                          <Input required name="firstName" value={formData.firstName} onChange={handleChange} />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Last Name</label>
                          <Input required name="lastName" value={formData.lastName} onChange={handleChange} />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <label className="text-sm font-medium">Email Address</label>
                          <Input required type="email" name="email" value={formData.email} onChange={handleChange} />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <label className="text-sm font-medium">Phone Number</label>
                          <Input required type="tel" name="phone" value={formData.phone} onChange={handleChange} />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <label className="text-sm font-medium">Special Requests (Optional)</label>
                          <textarea 
                            name="specialRequests" 
                            value={formData.specialRequests} 
                            onChange={handleChange}
                            className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            placeholder="Allergies, anniversaries, seating preferences..."
                          />
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <Button type="button" variant="outline" onClick={handleBack} size="lg" className="flex-1">Back</Button>
                        <Button type="submit" size="lg" className="flex-1">Confirm Reservation</Button>
                      </div>
                    </motion.div>
                  )}
                </form>
              </div>
              
              {/* Image Side */}
              <div className="hidden md:block w-1/3 bg-muted relative">
                <img 
                  src="/images/hero_restaurant_1783794161083.png" 
                  alt="Dining Table" 
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
