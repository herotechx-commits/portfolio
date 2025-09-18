"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Preloader } from "@/components/preloader";
import { TransparentBentoGrid } from "@/components/transparent-bento-grid";
import { ExpandableBentoGridItem } from "@/components/expandable-bento-grid-item";
import { BentoItem } from "@/types";
import { items } from "@/components/data";
import { cn } from "@/lib/utils";
import { CardContext } from "@/components/card-context";

export default function Home() {
  const [showPreloader, setShowPreloader] = useState(true);
    const handlePreloaderComplete = () => {
      setShowPreloader(false);
    };
  
  return (
    <CardContext.Provider value={{ onCardClose: () => {}, currentIndex: null }}>
      <AnimatePresence>
        {showPreloader && (
          <Preloader onComplete={handlePreloaderComplete} />
        )}
      </AnimatePresence>
      
      {!showPreloader && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 min-h-screen flex items-center justify-center p-4"
        >
          <TransparentBentoGrid className="max-w-6xl mt-20 md:mt-56 mx-auto md:auto-rows-[20rem]">
            {items.map((item: BentoItem, i: number) => (
              <ExpandableBentoGridItem
                key={i}
                title={item.title}
                description={item.description}
                header={item.header}
                content={item.content}
                className={cn("[&>p:text-lg]", item.className)}
                icon={item.icon}
                index={i}
              />
            ))}
          </TransparentBentoGrid>
        </motion.div>
      )}
    </CardContext.Provider>
  )
}
