import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { Category } from '../types';
import { CategoryCard } from '../components/ui/CategoryCard';
import { Helmet } from 'react-helmet-async';
import { LoadingScreen } from '../components/ui/LoadingScreen';

export default function CategoryList() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const catQuery = query(collection(db, 'categories'), where('status', '==', 'active'));
        const snap = await getDocs(catQuery);
        setCategories(snap.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Category));
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1">
      <Helmet>
        <title>All Categories - StoryTime</title>
      </Helmet>
      
      <h1 className="text-4xl font-display font-bold mb-8">Story Categories</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((cat) => (
          <CategoryCard key={cat.id} category={cat} />
        ))}
      </div>
    </div>
  );
}
