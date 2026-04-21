import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { Story, Category } from '../types';
import { FeaturedSlider } from '../components/ui/FeaturedSlider';
import { StoryCard } from '../components/ui/StoryCard';
import { CategoryCard } from '../components/ui/CategoryCard';
import { AdBanner } from '../components/ui/AdBanner';
import { LoadingScreen } from '../components/ui/LoadingScreen';
import { Helmet } from 'react-helmet-async';
import { useAppStore } from '../store/useAppStore';

export default function HomePage() {
  const [featuredStories, setFeaturedStories] = useState<Story[]>([]);
  const [recentStories, setRecentStories] = useState<Story[]>([]);
  const [trendingStories, setTrendingStories] = useState<Story[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const { settings } = useAppStore();

  useEffect(() => {
    async function loadHomeData() {
      try {
        // Load categories
        const catQuery = query(collection(db, 'categories'), where('status', '==', 'active'));
        const catDocs = await getDocs(catQuery);
        const catsData = catDocs.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Category);
        setCategories(catsData);

        // Load published stories
        const storiesQuery = query(
          collection(db, 'stories'), 
          where('status', '==', 'published'),
          orderBy('createdAt', 'desc'),
          limit(20)
        );
        const storiesDocs = await getDocs(storiesQuery);
        const stData = storiesDocs.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Story);
        
        setRecentStories(stData.slice(0, 6)); // Fetch top 6 recent
        setFeaturedStories(stData.slice(0, 3)); // Use top 3 strictly for hero slider
        
        // Load trending based on viewCount
        const trendQuery = query(
          collection(db, 'stories'),
          where('status', '==', 'published'),
          orderBy('viewCount', 'desc'),
          limit(6)
        );
        const trendDocs = await getDocs(trendQuery);
        setTrendingStories(trendDocs.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Story));

      } catch (err) {
        console.error("Error loading home data", err);
      } finally {
        setLoading(false);
      }
    }
    loadHomeData();
  }, []);

  if (loading) return <LoadingScreen />;

  return (
    <div className="w-full">
      <Helmet>
        <title>StoryTime - Kids Friendly Story Platform</title>
        <meta name="description" content="Discover kids friendly stories in Hindi and English!" />
      </Helmet>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <FeaturedSlider stories={featuredStories} />
      </section>

      {/* AdBanner Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <AdBanner slotId="header-slot" format="auto" />
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex justify-between items-end mb-6">
            <h2 className="text-3xl font-display font-bold">Explore Categories</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </div>
        </section>
      )}

      {/* Recent Stories */}
      {recentStories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h2 className="text-3xl font-display font-bold mb-6">Recent Stories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentStories.map((story) => (
              <StoryCard key={story.id} story={story} />
            ))}
          </div>
        </section>
      )}
      
      {/* AdBanner Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <AdBanner slotId="in-article-slot" format="fluid" />
      </section>

      {/* Trending Stories */}
      {trendingStories.length > 0 && (
        <section className="bg-white/50 dark:bg-slate-900/50 py-16 mt-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-display font-bold mb-6">Trending Now</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {trendingStories.map((story) => (
                <StoryCard key={story.id} story={story} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
