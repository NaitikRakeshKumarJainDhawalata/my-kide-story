import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Eye, Bookmark, BookmarkCheck } from 'lucide-react';
import { Story } from '../../types';
import { useAppStore } from '../../store/useAppStore';
import { cn } from '../../lib/utils';

interface StoryCardProps {
  story: Story;
  className?: string;
}

export const StoryCard: React.FC<StoryCardProps> = ({ story, className }) => {
  const { bookmarks, toggleBookmark } = useAppStore();
  const isBookmarked = bookmarks.includes(story.id);

  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className={cn("bg-white dark:bg-slate-800 rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden border border-slate-100 dark:border-slate-700 font-sans group flex flex-col", className)}
    >
      <div className="relative aspect-[3/2] overflow-hidden">
        <Link to={`/story/${story.slug}`}>
          <img 
            src={story.thumbnailUrl || 'https://picsum.photos/seed/story-thumb/600/400'} 
            alt={story.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            referrerPolicy="no-referrer"
            loading="lazy"
          />
        </Link>
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white/90 dark:bg-slate-900/90 text-indigo-600 dark:text-indigo-400 shadow-sm backdrop-blur-sm">
            {story.language}
          </span>
        </div>
        <button 
          onClick={(e) => {
            e.preventDefault();
            toggleBookmark(story.id);
          }}
          className="absolute top-3 right-3 p-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-full text-indigo-600 dark:text-indigo-400 hover:bg-white dark:hover:bg-slate-900 transition-colors shadow-sm z-10"
          aria-label="Bookmark"
        >
          {isBookmarked ? <BookmarkCheck size={18} className="fill-current" /> : <Bookmark size={18} />}
        </button>
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <Link to={`/story/${story.slug}`} className="flex-grow group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          <h3 className="font-display font-bold text-lg mb-2 text-slate-900 dark:text-slate-100 line-clamp-2">
            {story.title}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3 mb-4">
            {story.metaDescription}
          </p>
        </Link>
        
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mt-auto pt-4 border-t border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-1.5">
            <Clock size={14} />
            <span>{story.readingTime} min read</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Eye size={14} />
            <span>{story.viewCount} views</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
