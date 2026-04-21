import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { Story } from '../types';
import { StoryCard } from '../components/ui/StoryCard';
import { Helmet } from 'react-helmet-async';
import { LoadingScreen } from '../components/ui/LoadingScreen';
import { TrendingUp } from 'lucide-react';

export default function TrendingPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const sq = query(
          collection(db, 'stories'), 
          where('status', '==', 'published'),
          orderBy('viewCount', 'desc'),
          limit(20)
        );
        const sSnap = await getDocs(sq);
        setStories(sSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Story));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <LoadingScreen />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full bg-gradient-to-b from-orange-50 to-transparent dark:from-orange-950/20">
      <Helmet>
        <title>Trending Stories - StoryTime</title>
      </Helmet>
      
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400 rounded-2xl">
          <TrendingUp size={32} />
        </div>
        <h1 className="text-4xl font-display font-black tracking-tight">Trending Now</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {stories.map(story => (
          <StoryCard key={story.id} story={story} />
        ))}
      </div>
    </div>
  );
}
