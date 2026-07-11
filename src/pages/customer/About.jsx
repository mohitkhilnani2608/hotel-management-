import React from 'react';
import { motion } from 'framer-motion';

export const About = () => {
  return (
    <div className="pt-32 pb-24 min-h-screen">
      <div className="container mx-auto px-6 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-24"
        >
          <span className="text-primary uppercase tracking-[0.2em] text-sm font-medium mb-4 block">
            Our Story
          </span>
          <h1 className="text-5xl md:text-7xl font-serif mb-6 leading-tight">
            The Vision Behind <br /><span className="italic text-primary/90">AuraDine</span>
          </h1>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-32">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <img 
              src="/images/about_chef_1783794175154.png" 
              alt="Chef Alexandre" 
              className="rounded-2xl shadow-luxury w-full object-cover aspect-[3/4]"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <h2 className="text-3xl font-serif">Meet Chef Alexandre</h2>
            <p className="text-muted-foreground leading-relaxed text-lg font-light">
              With over two decades of culinary mastery acquired in the most demanding kitchens of Paris and Tokyo, Chef Alexandre brings a philosophy of uncompromised excellence to AuraDine.
            </p>
            <p className="text-muted-foreground leading-relaxed text-lg font-light">
              "Cooking is not merely about sustenance; it is the most intimate form of art. We craft memories, one plate at a time."
            </p>
            <div className="pt-6 border-t border-white/10">
              <span className="font-serif italic text-2xl text-primary/80">Alexandre</span>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="space-y-6 order-2 md:order-1"
          >
            <h2 className="text-3xl font-serif">A Sanctuary of Taste</h2>
            <p className="text-muted-foreground leading-relaxed text-lg font-light">
              AuraDine was conceived as an escape from the relentless pace of the modern world. Our space is meticulously designed to foster intimacy, conversation, and an unparalleled focus on the culinary journey.
            </p>
            <p className="text-muted-foreground leading-relaxed text-lg font-light">
              Every detail, from the ambient acoustics to the weight of the cutlery, has been chosen to enhance your experience of quiet luxury.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="order-1 md:order-2"
          >
            <img 
              src="/images/about_cellar_1783794187524.png" 
              alt="Wine Cellar" 
              className="rounded-2xl shadow-luxury w-full object-cover aspect-[4/3]"
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};
