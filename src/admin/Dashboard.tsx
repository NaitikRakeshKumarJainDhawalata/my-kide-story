import React, { useEffect, useState } from 'react';
import { collection, query, getDocs, where } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { BookOpen, FolderTree, Eye, TrendingUp } from 'lucide-react';
import { LoadingScreen } from '../components/ui/LoadingScreen';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalStories: 0,
    totalCategories: 0,
    totalViews: 0,
    publishedStories: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const storiesSnap = await getDocs(collection(db, 'stories'));
        let totalViews = 0;
        let publishedCount = 0;
        
        storiesSnap.forEach(doc => {
          const data = doc.data();
          if (data.viewCount) totalViews += data.viewCount;
          if (data.status === 'published') publishedCount++;
        });

        const categoriesSnap = await getDocs(collection(db, 'categories'));

        setStats({
          totalStories: storiesSnap.size,
          totalCategories: categoriesSnap.size,
          totalViews,
          publishedStories: publishedCount
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) return <LoadingScreen />;

  const statCards = [
    { name: 'Total Stories', value: stats.totalStories, icon: BookOpen, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/40' },
    { name: 'Published Stories', value: stats.publishedStories, icon: TrendingUp, color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/40' },
    { name: 'Total Categories', value: stats.totalCategories, icon: FolderTree, color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-900/40' },
    { name: 'Total Views', value: stats.totalViews, icon: Eye, color: 'text-orange-500', bg: 'bg-orange-100 dark:bg-orange-900/40' },
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-display font-bold mb-8">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map(stat => (
          <div key={stat.name} className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center gap-4">
             <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color}`}>
                <stat.icon size={28} />
             </div>
             <div>
               <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.name}</p>
               <p className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value.toLocaleString()}</p>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}
