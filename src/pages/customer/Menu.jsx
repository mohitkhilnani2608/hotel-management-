import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Filter, Leaf, ShoppingCart } from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { CartSidebar } from '../../components/menu/CartSidebar';

export const Menu = () => {
  const { menuItems, addToCart, cart } = useRestaurant();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showVeganOnly, setShowVeganOnly] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const categories = ['All', 'Starters', 'Mains', 'Desserts'];

  const filteredMenu = menuItems.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesDiet = showVeganOnly ? item.dietary.includes('Vegetarian') || item.dietary.includes('Vegan') : true;
    return matchesCategory && matchesDiet;
  });

  return (
    <div className="pt-24 pb-24 min-h-screen bg-muted/10 relative">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex justify-end mb-4">
          <Button variant="outline" className="relative" onClick={() => setIsCartOpen(true)}>
            <ShoppingCart className="w-4 h-4 mr-2" />
            Cart
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            )}
          </Button>
        </div>
        <div className="mb-12 text-center max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-serif mb-4">Our Menu</h1>
          <p className="text-muted-foreground text-lg">
            Sourced locally, crafted with passion. Explore our seasonal offerings designed to delight the senses.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-64 shrink-0">
            <div className="sticky top-28 space-y-8">
              <div>
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Filter className="w-4 h-4" /> Categories
                </h3>
                <div className="flex flex-col gap-2">
                  {categories.map(category => (
                    <button
                      key={category}
                      //onClick={() => setSelectedCategory(category)}
                      className={`text-left px-4 py-2 rounded-lg transition-colors ${
                        selectedCategory === category 
                          ? 'bg-primary text-primary-foreground font-medium' 
                          : 'hover:bg-muted text-muted-foreground'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Leaf className="w-4 h-4" /> Dietary Preferences
                </h3>
                <label className="flex items-center gap-3 cursor-pointer p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <input 
                    type="checkbox" 
                    className="accent-primary w-4 h-4"
                    checked={showVeganOnly}
                    //onChange={(e) => setShowVeganOnly(e.target.checked)}
                  />
                  <span className="text-sm font-medium">Vegetarian / Vegan</span>
                </label>
              </div>
            </div>
          </aside>

          {/* Menu Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredMenu.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-card border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col"
                >
                  <div className="aspect-[4/3] overflow-hidden relative">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-3 right-3 flex gap-2 flex-wrap justify-end">
                      {item.dietary.map(diet => (
                        <Badge key={diet} variant="secondary" className="bg-background/90 backdrop-blur text-xs">
                          {diet}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex justify-between items-start mb-2 gap-4">
                      <h3 className="font-serif text-xl font-medium">{item.name}</h3>
                      <span className="font-medium text-lg shrink-0">${item.price}</span>
                    </div>
                    <p className="text-muted-foreground text-sm mb-6 flex-1">{item.description}</p>
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      onClick={() => {
                        addToCart(item);
                        setIsCartOpen(true);
                      }}
                    >
                      Add to Cart
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredMenu.length === 0 && (
              <div className="text-center py-24 bg-card border border-dashed rounded-2xl">
                <p className="text-muted-foreground">No menu items found matching your filters.</p>
                <Button 
                  variant="link" 
                  onClick={() => { setSelectedCategory('All'); setShowVeganOnly(false); }}
                  className="mt-2"
                >
                  Clear all filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
};
