import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, addDoc, updateDoc, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { Category, Story } from '../types';
import { generateSlug } from '../lib/utils';
import { Save, ArrowLeft } from 'lucide-react';

export default function AddEditStory() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState<Partial<Story>>({
    title: '',
    slug: '',
    categoryId: '',
    theme: 'theme-default',
    language: 'English',
    bannerImageUrl: '',
    thumbnailUrl: '',
    content: '',
    metaTitle: '',
    metaDescription: '',
    keywords: '',
    readingTime: 5,
    status: 'draft',
    viewCount: 0,
  });

  useEffect(() => {
    async function loadData() {
      // load categories
      const cSnap = await getDocs(collection(db, 'categories'));
      setCategories(cSnap.docs.map(d => ({ id: d.id, ...d.data() }) as Category));

      if (isEdit) {
        const docRef = doc(db, 'stories', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setFormData(docSnap.data() as Story);
        }
      }
    }
    loadData();
  }, [id, isEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      let newData = { ...prev, [name]: value };
      if (name === 'title' && !isEdit) {
        newData.slug = generateSlug(value);
      }
      return newData;
    });
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const catName = e.target.value;
    const cat = categories.find(c => c.name === catName);
    setFormData(prev => ({
      ...prev,
      categoryId: catName,
      theme: cat?.theme || 'theme-default'
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const now = Date.now();
      if (isEdit) {
        await updateDoc(doc(db, 'stories', id), {
          ...formData,
          readingTime: Number(formData.readingTime),
          updatedAt: now
        });
      } else {
        await addDoc(collection(db, 'stories'), {
          ...formData,
          readingTime: Number(formData.readingTime),
          createdAt: now,
          updatedAt: now
        });
      }
      navigate('/admin/stories');
    } catch (err) {
      console.error(err);
      alert('Error saving story. Check console.');
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-3xl font-display font-bold">{isEdit ? 'Edit Story' : 'Create New Story'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Title <span className="text-red-500">*</span></label>
            <input required type="text" name="title" value={formData.title} onChange={handleChange} className="w-full px-4 py-2 border rounded-xl dark:border-slate-600 bg-transparent" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Slug (SEO Friendly) <span className="text-red-500">*</span></label>
            <input required type="text" name="slug" value={formData.slug} onChange={handleChange} className="w-full px-4 py-2 border rounded-xl dark:border-slate-600 bg-transparent" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Category <span className="text-red-500">*</span></label>
            <select required name="categoryId" value={formData.categoryId} onChange={handleCategoryChange} className="w-full px-4 py-2 border rounded-xl dark:border-slate-600 bg-transparent">
              <option value="" disabled>Select Category</option>
              {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Language</label>
            <select name="language" value={formData.language} onChange={handleChange} className="w-full px-4 py-2 border rounded-xl dark:border-slate-600 bg-transparent">
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Status</label>
            <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-2 border rounded-xl dark:border-slate-600 bg-transparent">
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Banner Image URL (1200x600)</label>
            <input type="url" name="bannerImageUrl" value={formData.bannerImageUrl} onChange={handleChange} className="w-full px-4 py-2 border rounded-xl dark:border-slate-600 bg-transparent" placeholder="https://picsum.photos/seed/..." />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Thumbnail URL (600x400)</label>
            <input type="url" name="thumbnailUrl" value={formData.thumbnailUrl} onChange={handleChange} className="w-full px-4 py-2 border rounded-xl dark:border-slate-600 bg-transparent" placeholder="https://picsum.photos/seed/..." />
          </div>
        </div>

        <div>
           <label className="block text-sm font-medium mb-2">Story Content (HTML supported) <span className="text-red-500">*</span></label>
           <textarea required name="content" value={formData.content} onChange={handleChange} rows={12} className="w-full px-4 py-3 border rounded-xl dark:border-slate-600 bg-transparent font-mono text-sm" placeholder="<p>Once upon a time...</p>" />
        </div>

        <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
          <h3 className="text-lg font-bold mb-4 font-display">SEO Metadata</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2">Meta Title</label>
              <input type="text" name="metaTitle" value={formData.metaTitle} onChange={handleChange} className="w-full px-4 py-2 border rounded-xl dark:border-slate-600 bg-transparent" />
            </div>
            <div>
               <label className="block text-sm font-medium mb-2">Keywords (comma separated)</label>
               <input type="text" name="keywords" value={formData.keywords} onChange={handleChange} className="w-full px-4 py-2 border rounded-xl dark:border-slate-600 bg-transparent" />
            </div>
          </div>
          <div>
             <label className="block text-sm font-medium mb-2">Meta Description</label>
             <textarea name="metaDescription" value={formData.metaDescription} onChange={handleChange} rows={2} className="w-full px-4 py-2 border rounded-xl dark:border-slate-600 bg-transparent" />
          </div>
          <div className="mt-6">
             <label className="block text-sm font-medium mb-2">Reading Time (mins)</label>
             <input type="number" min="1" name="readingTime" value={formData.readingTime} onChange={handleChange} className="w-32 px-4 py-2 border rounded-xl dark:border-slate-600 bg-transparent" />
          </div>
        </div>

        <div className="flex justify-end pt-6">
          <button type="submit" className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold transition shadow-lg">
            <Save size={20} /> Save Story
          </button>
        </div>
      </form>
    </div>
  );
}
