import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, documentId } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { Story } from '../types';
import { StoryCard } from '../components/ui/StoryCard';
import { Helmet } from 'react-helmet-async';
import { useAppStore } from '../store/useAppStore';
import { LoadingScreen } from '../components/ui/LoadingScreen';
import { BookmarkX } from 'lucide-react';

export default function BookmarksPage() {
  const { bookmarks } = useAppStore();
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (bookmarks.length === 0) {
        setStories([]);
        setLoading(false);
        return;
      }
      
      try {
        // Firestore `in` query limits array length to 10
        // We'll chunk them
        const chunkArray = (arr: string[], size: number) => {
          const chunks = [];
          for (let i = 0; i < arr.length; i += size) {
            chunks.push(arr.slice(i, i + size));
          }
          return chunks;
        };

        const chunks = chunkArray(bookmarks, 10);
        let fetchedStories: Story[] = [];

        for (const chunk of chunks) {
          const q = query(collection(db, 'stories'), where(documentId(), 'in', chunk));
          const snap = await getDocs(q);
          const st = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Story);
          fetchedStories = [...fetchedStories, ...st];
        }
        
        setStories(fetchedStories);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [bookmarks]);

  if (loading) return <LoadingScreen />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full">
      <Helmet>
        <title>My Bookmarks - StoryTime</title>
      </Helmet>

      <h1 className="text-4xl font-display font-medium mb-8">My Bookmarks</h1>

      {stories.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-20 text-slate-500 text-center">
          <BookmarkX size={64} className="opacity-20 mb-4" />
          <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">No bookmarks yet</h2>
          <p>Stories you save will appear here for easy access later.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stories.map(story => (
             <StoryCard key={story.id} story={story} />
          ))}
        </div>
      )}
    </div>
  );
}
