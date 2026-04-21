import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import { Story } from '../../types';

interface FeaturedSliderProps {
  stories: Story[];
}

export function FeaturedSlider({ stories }: FeaturedSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (stories.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % stories.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [stories.length]);

  if (!stories.length) return null;

  const handleNext = () => setCurrentIndex((prev) => (prev + 1) % stories.length);
  const handlePrev = () => setCurrentIndex((prev) => (prev - 1 + stories.length) % stories.length);

  return (
    <div className="relative w-full aspect-[16/9] md:aspect-[21/9] rounded-3xl overflow-hidden shadow-lg group">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          <img
            src={stories[currentIndex].bannerImageUrl || 'https://picsum.photos/seed/hero/1200/600'}
            alt={stories[currentIndex].title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent">
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
              <div className="max-w-3xl">
                <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-white text-xs font-bold mb-4 uppercase tracking-wider">
                  Featured Story
                </span>
                <Link to={`/story/${stories[currentIndex].slug}`}>
                  <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-4 leading-tight hover:underline decoration-indigo-500 underline-offset-8">
                    {stories[currentIndex].title}
                  </h2>
                </Link>
                <p className="text-slate-200 text-sm md:text-lg line-clamp-2 md:line-clamp-3 mb-6 font-medium">
                  {stories[currentIndex].metaDescription}
                </p>
                <Link 
                  to={`/story/${stories[currentIndex].slug}`}
                  className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-full font-bold transition-all shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-1"
                >
                  <BookOpen size={20} /> Read Story
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {stories.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/30 text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/50"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/30 text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/50"
          >
            <ChevronRight size={24} />
          </button>
          
          <div className="absolute bottom-6 right-6 flex gap-2">
            {stories.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`h-2 rounded-full transition-all ${
                  i === currentIndex ? 'w-8 bg-white' : 'w-2 bg-white/50 hover:bg-white/70'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
