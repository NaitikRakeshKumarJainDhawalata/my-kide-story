import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { Settings } from '../types';
import { Save } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export default function SettingsPanel() {
  const { setSettings: setGlobalSettings } = useAppStore();
  const [formData, setFormData] = useState<Settings>({
    heroImageUrl: '',
    socialLinks: {
      youtube: { url: '', enabled: false },
      instagram: { url: '', enabled: false },
      telegram: { url: '', enabled: false },
      facebook: { url: '', enabled: false }
    },
    ads: {
      header: '',
      content: '',
      sidebar: '',
      footer: ''
    },
    updatedAt: Date.now()
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      const docRef = doc(db, 'settings', 'global');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setFormData(docSnap.data() as Settings);
      }
    }
    load();
  }, []);

  const handleSocialChange = (platform: keyof Settings['socialLinks'], field: 'url' | 'enabled', value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: {
          ...prev.socialLinks[platform],
          [field]: value
        }
      }
    }));
  };

  const handleAdsChange = (position: keyof Settings['ads'], value: string) => {
    setFormData(prev => ({
      ...prev,
      ads: { ...prev.ads, [position]: value }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = { ...formData, updatedAt: Date.now() };
      await setDoc(doc(db, 'settings', 'global'), updated);
      setGlobalSettings(updated);
      alert('Settings saved successfully!');
    } catch (err) {
      console.error(err);
      alert('Error saving settings.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto pb-24">
      <h1 className="text-3xl font-display font-bold mb-8">Platform Settings</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Global Hero */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
          <h2 className="text-xl font-bold mb-4">Homepage Configuration</h2>
          <div>
            <label className="block text-sm font-medium mb-2">Fallback Hero Image URL (1200x600)</label>
            <input 
              type="url" 
              value={formData.heroImageUrl} 
              onChange={e => setFormData(p => ({...p, heroImageUrl: e.target.value}))} 
              className="w-full px-4 py-2 border rounded-xl dark:border-slate-600 bg-transparent" 
              placeholder="https://..."
            />
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
          <h2 className="text-xl font-bold mb-6">Social Media presence</h2>
          <div className="space-y-4">
            {(['youtube', 'instagram', 'facebook', 'telegram'] as const).map((platform) => (
              <div key={platform} className="flex flex-col md:flex-row items-center gap-4 p-4 border border-slate-100 dark:border-slate-700 rounded-2xl">
                <div className="w-full md:w-32 font-medium capitalize">{platform}</div>
                <div className="flex-1 w-full">
                  <input 
                    type="url" 
                    placeholder={`${platform} profile URL`}
                    value={formData.socialLinks[platform].url}
                    onChange={e => handleSocialChange(platform, 'url', e.target.value)}
                    className="w-full px-4 py-2 border rounded-xl dark:border-slate-600 bg-transparent"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium">Enable</label>
                  <input 
                    type="checkbox"
                    checked={formData.socialLinks[platform].enabled}
                    onChange={e => handleSocialChange(platform, 'enabled', e.target.checked)}
                    className="w-5 h-5 accent-indigo-600"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AdSense configuration */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
          <h2 className="text-xl font-bold mb-2">AdSense Configuration</h2>
          <p className="text-slate-500 text-sm mb-6">Paste your AdSense slot IDs or data-ad-client code arrays here to render them automatically.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(['header', 'content', 'sidebar', 'footer'] as const).map(pos => (
              <div key={pos}>
                <label className="block text-sm font-medium mb-2 capitalize">{pos} Ad Code / Slot ID</label>
                <textarea 
                  rows={3}
                  value={formData.ads[pos]}
                  onChange={e => handleAdsChange(pos, e.target.value)}
                  className="w-full px-4 py-2 border rounded-xl dark:border-slate-600 bg-transparent font-mono text-sm"
                  placeholder="<!-- AdSense Code -->"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end relative">
          <button 
            type="submit" 
            disabled={saving}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold transition shadow-lg disabled:opacity-50"
          >
            <Save size={20} /> {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
