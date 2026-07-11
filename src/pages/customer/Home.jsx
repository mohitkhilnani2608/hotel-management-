import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Utensils } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { useRestaurant } from '../../context/RestaurantContext';

export const Home = () => {
  const { menuItems } = useRestaurant();
  const navigate = useNavigate();

  const featuredItems = menuItems.slice(0, 3);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate('/booking');
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/hero_restaurant_1783794161083.png" 
            alt="Restaurant Interior" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
        </div>
        
        <div className="container relative z-10 mx-auto px-6 flex flex-col items-center text-center mt-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="text-white/80 uppercase tracking-[0.3em] text-sm font-medium mb-6 block">
              Taste the Extraordinary
            </span>
            <h1 className="text-5xl md:text-7xl font-serif text-white mb-6 leading-tight max-w-4xl">
              Culinary Artistry in <br/><span className="italic text-white/90">Quiet Luxury</span>
            </h1>
            <p className="text-lg text-white/80 max-w-2xl mx-auto mb-12 font-light">
              Experience a sanctuary of flavors where modern gastronomy meets timeless elegance.
            </p>
          </motion.div>

          {/* Quick Reservation Search */}
          <motion.form 
            onSubmit={handleSearch}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-background/95 backdrop-blur-md p-4 rounded-2xl flex flex-col md:flex-row gap-4 w-full max-w-4xl shadow-luxury border border-white/20"
          >
            <div className="flex-1 text-left">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1 mb-1 block">Date</label>
              <Input type="date" className="bg-transparent border-none shadow-none focus-visible:ring-0 px-2" required />
            </div>
            <div className="w-px bg-border hidden md:block"></div>
            <div className="flex-1 text-left">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1 mb-1 block">Time</label>
              <Select className="bg-transparent border-none shadow-none focus-visible:ring-0 px-2" required>
                <option value="18:00">6:00 PM</option>
                <option value="19:00">7:00 PM</option>
                <option value="20:00">8:00 PM</option>
                <option value="21:00">9:00 PM</option>
              </Select>
            </div>
            <div className="w-px bg-border hidden md:block"></div>
            <div className="flex-1 text-left">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1 mb-1 block">Guests</label>
              <Select className="bg-transparent border-none shadow-none focus-visible:ring-0 px-2" required>
                <option value="2">2 People</option>
                <option value="3">3 People</option>
                <option value="4">4 People</option>
                <option value="5+">5+ People</option>
              </Select>
            </div>
            <Button type="submit" size="lg" className="md:w-auto h-auto rounded-xl px-8">
              Find Table
            </Button>
          </motion.form>
        </div>
      </section>

      {/* Featured Menu */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-end mb-16">
            <div className="max-w-2xl">
              <h2 className="text-4xl font-serif mb-4">Chef's Signatures</h2>
              <p className="text-muted-foreground text-lg">Curated selections that define the AuraDine experience.</p>
            </div>
            <Link to="/menu" className="hidden md:flex items-center gap-2 font-medium hover:text-primary transition-colors pb-2">
              View Full Menu <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredItems.map((item, index) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group cursor-pointer"
                onClick={() => navigate('/menu')}
              >
                <div className="relative overflow-hidden rounded-2xl aspect-[4/5] mb-6">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-2xl font-serif group-hover:text-primary transition-colors">{item.name}</h3>
                  <span className="text-lg font-medium">${item.price}</span>
                </div>
                <p className="text-muted-foreground line-clamp-2">{item.description}</p>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-12 text-center md:hidden">
            <Button variant="outline" size="lg" onClick={() => navigate('/menu')} className="w-full">
              View Full Menu
            </Button>
          </div>
        </div>
      </section>
      
      {/* Testimonial / Atmosphere */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <Utensils className="w-12 h-12 mx-auto text-primary/40 mb-8" />
          <h2 className="text-3xl md:text-4xl font-serif italic leading-relaxed mb-8">
            "A revelation in modern dining. The attention to detail, both in the ambiance and on the plate, makes every visit to AuraDine an unforgettable experience."
          </h2>
          <div className="flex items-center justify-center gap-1 text-primary mb-4">
            {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-current" />)}
          </div>
          <p className="font-medium uppercase tracking-widest text-sm text-muted-foreground">The Culinary Review</p>
        </div>
      </section>

      {/* Gallery Sneak Peek */}
      <section className="py-24 bg-card/30 border-t border-white/5">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-end mb-16">
            <div className="max-w-2xl">
              <h2 className="text-4xl font-serif mb-4">The Atmosphere</h2>
              <p className="text-muted-foreground text-lg">A glimpse into our sanctuary.</p>
            </div>
            <Link to="/gallery" className="hidden md:flex items-center gap-2 font-medium hover:text-primary transition-colors pb-2">
              View Gallery <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, margin: "-50px" }} className="col-span-2 row-span-2 overflow-hidden rounded-2xl">
              <img src="/images/gallery_interior_1783794261138.png" alt="Interior" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            </motion.div>
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, margin: "-50px", delay: 0.1 }} className="overflow-hidden rounded-2xl aspect-square">
              <img src="/images/gallery_drinks_1783794249464.png" alt="Drinks" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            </motion.div>
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, margin: "-50px", delay: 0.2 }} className="overflow-hidden rounded-2xl aspect-square">
              <img src="/images/menu_ribeye_1783794197166.png" alt="Food" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            </motion.div>
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, margin: "-50px", delay: 0.3 }} className="col-span-2 overflow-hidden rounded-2xl aspect-[2/1]">
              <img src="/images/about_cellar_1783794187524.png" alt="Details" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            </motion.div>
          </div>
          <div className="mt-12 text-center md:hidden">
            <Button variant="outline" size="lg" onClick={() => navigate('/gallery')} className="w-full">
              View Gallery
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-serif mb-6">Join Our Inner Circle</h2>
            <p className="text-muted-foreground text-lg mb-10 max-w-2xl mx-auto">
              Subscribe to receive exclusive invitations to private tasting events, seasonal menu previews, and culinary insights from Chef Alexandre.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto" onSubmit={(e) => { e.preventDefault(); alert('Successfully subscribed to the newsletter!'); }}>
              <Input type="email" placeholder="Enter your email address" className="flex-1 bg-card/50 border-white/10 h-12" required />
              <Button type="submit" size="lg" className="h-12 px-8">Subscribe</Button>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
