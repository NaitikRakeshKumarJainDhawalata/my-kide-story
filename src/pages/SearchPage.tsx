import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { Story } from '../types';
import { StoryCard } from '../components/ui/StoryCard';
import { Helmet } from 'react-helmet-async';
import { LoadingScreen } from '../components/ui/LoadingScreen';
import { Search } from 'lucide-react';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const qStr = searchParams.get('q') || '';
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!qStr.trim()) {
        setStories([]);
        setLoading(false);
        return;
      }
      
      setLoading(true);
      try {
        // Without full-text search API, we fetch recent stories 
        // and filter client-side for simple MVP functionality
        const sq = query(
          collection(db, 'stories'), 
          where('status', '==', 'published'),
          orderBy('createdAt', 'desc'),
          limit(100)
        );
        const snap = await getDocs(sq);
        const allStories = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Story);
        
        const term = qStr.toLowerCase();
        const filtered = allStories.filter(s => 
          s.title.toLowerCase().includes(term) || 
          s.metaDescription?.toLowerCase().includes(term) ||
          s.keywords?.toLowerCase().includes(term) ||
          s.language.toLowerCase() === term
        );
        
        setStories(filtered);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [qStr]);

  if (loading) return <LoadingScreen />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full">
      <Helmet>
        <title>Search: {qStr} - StoryTime</title>
      </Helmet>
      
      <div className="mb-10 text-center max-w-2xl mx-auto">
        <div className="inline-flex p-3 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-full mb-4">
          <Search size={32} />
        </div>
        <h1 className="text-3xl md:text-4xl font-display font-bold">
          {qStr ? `Results for "${qStr}"` : 'Search Stories'}
        </h1>
        <p className="text-slate-500 mt-2">Found {stories.length} stories</p>
      </div>

      {!qStr && (
        <div className="text-center text-slate-500 py-10">
          Enter a search term above to find stories
        </div>
      )}

      {qStr && stories.length === 0 && (
        <div className="text-center text-slate-500 py-10">
          No matches found. Try different keywords.
        </div>
      )}

      {stories.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stories.map(story => (
            <StoryCard key={story.id} story={story} />
          ))}
        </div>
      )}
    </div>
  );
}
