import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, doc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { Category } from '../types';
import { generateSlug } from '../lib/utils';
import { Trash2, Edit2, Plus, Save, X } from 'lucide-react';
import { LoadingScreen } from '../components/ui/LoadingScreen';

export default function ManageCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<Partial<Category>>({
    name: '',
    slug: '',
    theme: 'theme-default',
    imageUrl: '',
    status: 'active'
  });

  const fetchCats = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, 'categories'));
      setCategories(snap.docs.map(d => ({ id: d.id, ...d.data() }) as Category));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCats(); }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      let newData = { ...prev, [name]: value };
      if (name === 'name' && !editingId) {
        newData.slug = generateSlug(value);
      }
      return newData;
    });
  };

  const handleEdit = (cat: Category) => {
    setEditingId(cat.id);
    setFormData(cat);
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({ name: '', slug: '', theme: 'theme-default', imageUrl: '', status: 'active' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const now = Date.now();
    try {
      if (editingId) {
        await updateDoc(doc(db, 'categories', editingId), { ...formData, updatedAt: now });
      } else {
        await addDoc(collection(db, 'categories'), { ...formData, createdAt: now, updatedAt: now });
      }
      handleCancel();
      fetchCats();
    } catch (err) {
      console.error(err);
      alert('Failed to save');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Delete category?")) {
      await deleteDoc(doc(db, 'categories', id));
      fetchCats();
    }
  };

  if (loading) return <LoadingScreen />;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-display font-bold mb-8">Manage Categories</h1>

      {/* Editor Form */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 mb-8">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          {editingId ? <><Edit2 size={20} /> Edit Category</> : <><Plus size={20} /> Add New Category</>}
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
           <div>
             <label className="block text-xs font-medium mb-1">Name</label>
             <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg bg-transparent" />
           </div>
           <div>
             <label className="block text-xs font-medium mb-1">Slug</label>
             <input required type="text" name="slug" value={formData.slug} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg bg-transparent" />
           </div>
           <div>
             <label className="block text-xs font-medium mb-1">Theme</label>
             <select name="theme" value={formData.theme} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg bg-transparent">
               <option value="theme-default">Default Theme</option>
               <option value="theme-kids">Kids Theme</option>
               <option value="theme-horror">Horror Theme</option>
               <option value="theme-moral">Moral Theme</option>
               <option value="theme-royal">Royal Theme</option>
             </select>
           </div>
           <div>
             <label className="block text-xs font-medium mb-1">Status</label>
             <select name="status" value={formData.status} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg bg-transparent">
               <option value="active">Active</option>
               <option value="inactive">Inactive</option>
             </select>
           </div>
           <div>
             <label className="block text-xs font-medium mb-1">Image URL (800x600)</label>
             <input required type="url" name="imageUrl" value={formData.imageUrl} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg bg-transparent" placeholder="https://..." />
           </div>
           
           <div className="lg:col-span-5 flex justify-end gap-2 mt-4">
              {editingId && (
                <button type="button" onClick={handleCancel} className="px-4 py-2 border rounded-lg flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-700">
                  <X size={16} /> Cancel
                </button>
              )}
              <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg flex items-center gap-2 hover:bg-indigo-700">
                <Save size={16} /> Save Category
              </button>
           </div>
        </form>
      </div>

      {/* List */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map(cat => (
          <div key={cat.id} className={`p-4 rounded-2xl border border-slate-100 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 relative overflow-hidden ${cat.theme}`}>
            <div className="relative z-10">
              <h3 className="font-bold text-lg mb-1">{cat.name}</h3>
              <p className="text-xs mb-4 opacity-70">/{cat.slug} • {cat.status}</p>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(cat)} className="p-1.5 bg-white/50 hover:bg-white/80 dark:bg-black/20 dark:hover:bg-black/40 rounded-md transition"><Edit2 size={16} /></button>
                <button onClick={() => handleDelete(cat.id)} className="p-1.5 bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/50 dark:text-red-400 rounded-md transition"><Trash2 size={16} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
