import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { Category, Story } from '../types';
import { StoryCard } from '../components/ui/StoryCard';
import { Helmet } from 'react-helmet-async';
import { LoadingScreen } from '../components/ui/LoadingScreen';

export default function CategoryDetails() {
  const { slug } = useParams<{slug: string}>();
  const [category, setCategory] = useState<Category | null>(null);
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        if (!slug) return;
        const cq = query(collection(db, 'categories'), where('slug', '==', slug));
        const cSnap = await getDocs(cq);
        
        if (!cSnap.empty) {
          const cat = { id: cSnap.docs[0].id, ...cSnap.docs[0].data() } as Category;
          setCategory(cat);
          
          const sq = query(
            collection(db, 'stories'), 
            where('categoryId', '==', cat.name), // based on name relation
            where('status', '==', 'published')
          );
          const sSnap = await getDocs(sq);
          setStories(sSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Story));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  if (loading) return <LoadingScreen />;

  if (!category) return (
    <div className="flex-1 flex flex-col items-center justify-center p-20">
      <h1 className="text-3xl font-bold mb-4">Category Not Found</h1>
      <Link to="/categories" className="text-indigo-600 hover:underline">All Categories</Link>
    </div>
  );

  return (
    <div className={`flex-1 ${category.theme || 'theme-default'}`}>
      <Helmet>
        <title>{category.name} Stories - StoryTime</title>
      </Helmet>
      
      {/* Header */}
      <div className="w-full h-64 relative overflow-hidden flex items-end">
        <img 
          src={category.imageUrl} 
          alt={category.name}
          className="absolute inset-0 w-full h-full object-cover blur-sm brightness-50 scale-105"
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-10">
          <h1 className="text-5xl font-display font-medium text-white mb-2">{category.name}</h1>
          <p className="text-white/80 font-medium">{stories.length} stories found</p>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10 -mt-6">
        {stories.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-12 text-center shadow-sm">
            <h2 className="text-xl font-semibold mb-2">No stories yet!</h2>
            <p className="text-slate-500">Check back later for magical stories in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {stories.map(story => (
              <StoryCard key={story.id} story={story} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
