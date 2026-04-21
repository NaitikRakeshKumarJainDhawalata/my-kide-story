import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export default function NotFoundPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center py-20 px-4 text-center">
      <Helmet>
        <title>Page Not Found - StoryTime</title>
      </Helmet>
      
      <div className="text-9xl font-display font-black text-slate-200 dark:text-slate-800 mb-4 tracking-tighter">
        404
      </div>
      <h1 className="text-3xl font-bold mb-4">Oops! Story not found</h1>
      <p className="text-slate-500 max-w-md mx-auto mb-8">
        The story or page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      
      <Link 
        to="/" 
        className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-semibold transition-colors"
      >
        <Home size={20} />
        Back to Home
      </Link>
    </div>
  );
}
