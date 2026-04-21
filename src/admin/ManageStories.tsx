import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, orderBy, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { Story } from '../types';
import { LoadingScreen } from '../components/ui/LoadingScreen';
import { Edit2, Trash2, Plus, Eye, Clock } from 'lucide-react';
import { format } from 'date-fns';

export default function ManageStories() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStories = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'stories'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      setStories(snap.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Story));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this story?')) {
      await deleteDoc(doc(db, 'stories', id));
      fetchStories();
    }
  };

  if (loading) return <LoadingScreen />;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-display font-bold">Manage Stories</h1>
        <Link 
          to="/admin/stories/add" 
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-medium transition"
        >
          <Plus size={20} /> Add New Story
        </Link>
      </div>
      
      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
                <th className="p-4 font-semibold text-slate-600 dark:text-slate-300">Title</th>
                <th className="p-4 font-semibold text-slate-600 dark:text-slate-300">Category</th>
                <th className="p-4 font-semibold text-slate-600 dark:text-slate-300">Language</th>
                <th className="p-4 font-semibold text-slate-600 dark:text-slate-300">Status</th>
                <th className="p-4 font-semibold text-slate-600 dark:text-slate-300">Stats</th>
                <th className="p-4 font-semibold text-slate-600 dark:text-slate-300 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {stories.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">No stories found. Add one!</td>
                </tr>
              ) : stories.map(story => (
                <tr key={story.id} className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="p-4 font-medium max-w-xs truncate">{story.title}</td>
                  <td className="p-4"><span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded-md text-xs">{story.categoryId}</span></td>
                  <td className="p-4"><span className="px-2 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-md text-xs font-semibold">{story.language}</span></td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-md text-xs font-semibold ${story.status === 'published' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'}`}>
                      {story.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1"><Eye size={14} /> {story.viewCount}</span>
                      <span className="flex items-center gap-1"><Clock size={14} /> {format(story.createdAt, 'MMM d, yy')}</span>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                       <Link to={`/admin/stories/edit/${story.id}`} className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg">
                          <Edit2 size={18} />
                       </Link>
                       <button onClick={() => handleDelete(story.id)} className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
                          <Trash2 size={18} />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
