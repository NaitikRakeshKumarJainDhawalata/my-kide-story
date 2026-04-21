import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Category } from '../../types';
import { cn } from '../../lib/utils';

interface CategoryCardProps {
  category: Category;
  className?: string;
  count?: number;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category, className, count }) => {
  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      className={cn("group block relative overflow-hidden rounded-[32px] shadow-sm hover:shadow-xl transition-all aspect-[4/3] bg-gradient-to-br min-h-[160px]", className)}
    >
      <Link to={`/categories/${category.slug}`} className="absolute inset-0">
        <img 
          src={category.imageUrl || 'https://picsum.photos/seed/category/800/600'} 
          alt={category.name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          referrerPolicy="no-referrer"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-6">
          <h3 className="text-white font-display font-bold text-2xl tracking-tight mb-1 group-hover:translate-x-2 transition-transform">
            {category.name}
          </h3>
          {count !== undefined && (
            <p className="text-white/80 font-medium text-sm group-hover:translate-x-2 transition-transform delay-75">
              {count} {count === 1 ? 'Story' : 'Stories'}
            </p>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
