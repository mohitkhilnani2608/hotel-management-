import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const images = [
  { id: 1, src: '/images/menu_ribeye_1783794197166.png', category: 'Food' },
  { id: 2, src: '/images/gallery_drinks_1783794249464.png', category: 'Drinks' },
  { id: 3, src: '/images/gallery_interior_1783794261138.png', category: 'Interior' },
  { id: 4, src: '/images/menu_scallops_1783794234659.png', category: 'Food' },
  { id: 5, src: '/images/gal_drinks_1_1783794838150.png', category: 'Drinks' },
  { id: 6, src: '/images/gal_int_1_1783794818247.png', category: 'Interior' },
  { id: 7, src: '/images/menu_arancini_1783794216460.png', category: 'Food' },
  { id: 8, src: '/images/about_cellar_1783794187524.png', category: 'Interior' },
  { id: 9, src: '/images/menu_tartare_1783794747676.png', category: 'Food' },
  { id: 10, src: '/images/menu_martini_1783794807600.png', category: 'Drinks' },
  { id: 11, src: '/images/menu_risotto_1783794759409.png', category: 'Food' },
  { id: 12, src: '/images/menu_tart_1783794768451.png', category: 'Food' },
];

const categories = ['All', 'Food', 'Drinks', 'Interior'];

export const Gallery = () => {
  const [filter, setFilter] = useState('All');

  const filteredImages = filter === 'All' 
    ? images 
    : images.filter(img => img.category === filter);

  return (
    <div className="pt-32 pb-24 min-h-screen">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-primary uppercase tracking-[0.2em] text-sm font-medium mb-4 block">
            Visual Journey
          </span>
          <h1 className="text-5xl md:text-7xl font-serif mb-6 leading-tight">
            The Gallery
          </h1>
        </motion.div>

        <div className="flex justify-center gap-4 mb-12 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                filter === cat 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-white/5 hover:bg-white/10 text-muted-foreground'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {filteredImages.map((img) => (
              <motion.div
                key={img.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="group relative overflow-hidden rounded-xl aspect-square"
              >
                <img 
                  src={img.src} 
                  alt={img.category} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center backdrop-blur-[2px]">
                  <span className="text-white font-serif text-2xl tracking-wide uppercase">{img.category}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};
