import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, collection, query, where, getDocs, updateDoc, increment } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { Story, Category } from '../types';
import { Helmet } from 'react-helmet-async';
import { LoadingScreen } from '../components/ui/LoadingScreen';
import { AdBanner } from '../components/ui/AdBanner';
import { Clock, Eye, Share2, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, Bookmark, BookmarkCheck } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export default function StoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const [story, setStory] = useState<Story | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [fontSize, setFontSize] = useState(112); // percentage
  const [loading, setLoading] = useState(true);
  
  const { bookmarks, toggleBookmark, readingProgress, setReadingProgress } = useAppStore();

  useEffect(() => {
    async function loadStory() {
      try {
        if (!slug) return;
        setLoading(true);
        // Find story
        const sq = query(collection(db, 'stories'), where('slug', '==', slug), where('status', '==', 'published'));
        const sn = await getDocs(sq);
        
        if (!sn.empty) {
          const st = { id: sn.docs[0].id, ...sn.docs[0].data() } as Story;
          setStory(st);
          
          // Increment views
          await updateDoc(doc(db, 'stories', st.id), {
            viewCount: increment(1)
          });
          
          // Fetch its category
          const cat = await getDocs(query(collection(db, 'categories'), where('name', '==', st.categoryId))); // assuming categoryId actually stores name or ID. Usually we store ID. Let's do a simple lookup. Defaulting to searching by ID.
          // Wait, the relation is categoryId.
          // Let's directly get the doc if categoryId is docId.
          // But I'll do a robust check
          if (st.categoryId) {
             const cq = query(collection(db, 'categories'), where('slug', '==', st.categoryId.toLowerCase().replace(/\\s+/g, '-'))); // if admin stored name
             const cats = await getDocs(cq);
             if(!cats.empty) setCategory({ id: cats.docs[0].id, ...cats.docs[0].data() } as Category);
          }
          
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadStory();
  }, [slug]);

  // Scroll Progress logic
  useEffect(() => {
    if (!story) return;
    
    const handleScroll = () => {
      const scrollPos = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollPos / docHeight) * 100 : 0;
      setReadingProgress(story.id, progress);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [story, setReadingProgress]);

  if (loading) return <LoadingScreen />;

  if (!story) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center p-20">
        <h1 className="text-3xl font-bold mb-4">Story Not Found</h1>
        <Link to="/" className="text-indigo-600 hover:underline">Return to Home</Link>
      </div>
    );
  }

  const isBookmarked = bookmarks.includes(story.id);
  const currentProgress = readingProgress[story.id] || 0;

  return (
    <div className={`w-full ${story.theme || 'theme-default'} min-h-screen pb-20`}>
      <Helmet>
        <title>{story.metaTitle || story.title} - StoryTime</title>
        <meta name="description" content={story.metaDescription || story.content.substring(0, 150)} />
        {story.keywords && <meta name="keywords" content={story.keywords} />}
        <link rel="canonical" href={window.location.href} />
        {/* Open Graph  */}
        <meta property="og:title" content={story.metaTitle || story.title} />
        <meta property="og:description" content={story.metaDescription} />
        <meta property="og:image" content={story.bannerImageUrl || story.thumbnailUrl} />
      </Helmet>

      {/* Progress Bar */}
      <div 
        className="fixed top-0 left-0 h-1 bg-indigo-600 dark:bg-indigo-400 z-50 transition-all duration-100 ease-out"
        style={{ width: `${currentProgress}%` }}
      />

      {/* Banner */}
      <div className="w-full h-[40vh] md:h-[60vh] relative">
        <img 
          src={story.bannerImageUrl || 'https://picsum.photos/seed/story-banner/1200/600'} 
          alt={story.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent">
          <div className="max-w-4xl mx-auto h-full px-4 flex flex-col justify-end pb-12">
            <div className="flex gap-3 mb-4">
               {category && (
                <span className="px-3 py-1 bg-indigo-600 text-white text-sm font-semibold rounded-full">
                  {category.name}
                </span>
               )}
               <span className="px-3 py-1 bg-white/20 backdrop-blur text-white text-sm font-semibold rounded-full">
                 {story.language}
               </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-4 leading-tight">
              {story.title}
            </h1>
            <div className="flex items-center text-slate-300 gap-6 text-sm font-medium">
              <div className="flex items-center gap-2">
                <Clock size={16} /> <span>{story.readingTime} min read</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye size={16} /> <span>{story.viewCount} views</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-6 relative z-10">
        <AdBanner slotId="header-slot" />
      </div>

      {/* Story Controls & Content */}
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-6 mb-8">
          <div className="flex items-center gap-4">
             <button onClick={() => setFontSize(f => Math.max(80, f - 10))} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full text-slate-600 dark:text-slate-300 transition" aria-label="Decrease font size">
                <ZoomOut size={20} />
             </button>
             <button onClick={() => setFontSize(f => Math.min(200, f + 10))} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full text-slate-600 dark:text-slate-300 transition" aria-label="Increase font size">
                <ZoomIn size={20} />
             </button>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => toggleBookmark(story.id)}
              className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition"
            >
              {isBookmarked ? <BookmarkCheck size={20} className="fill-current" /> : <Bookmark size={20} />}
              <span className="hidden sm:inline">{isBookmarked ? 'Saved' : 'Save'}</span>
            </button>
            <button className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition" aria-label="Share">
              <Share2 size={20} />
              <span className="hidden sm:inline">Share</span>
            </button>
          </div>
        </div>

        <div 
          className="prose prose-lg dark:prose-invert max-w-none text-slate-800 dark:text-slate-200"
          style={{ fontSize: `${fontSize}%`, lineHeight: 1.8 }}
          dangerouslySetInnerHTML={{ __html: story.content }}
        />

        <div className="mt-16 py-8 border-t border-slate-200 dark:border-slate-700">
           <AdBanner slotId="footer-article-slot" format="rectangle" />
        </div>
      </div>
    </div>
  );
}
