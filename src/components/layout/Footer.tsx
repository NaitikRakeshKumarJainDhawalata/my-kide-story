import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Youtube, Instagram, Facebook, Send } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export function Footer() {
  const { settings } = useAppStore();

  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 pt-12 pb-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl text-white">
                <BookOpen size={24} />
              </div>
              <span className="font-display font-bold text-xl text-slate-900 dark:text-white">
                StoryTime
              </span>
            </Link>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm mb-6 leading-relaxed">
              A magical place for kids to read, discover, and learn through delightful stories in English and Hindi.
            </p>
            <div className="flex flex-wrap gap-4">
              {settings?.socialLinks?.youtube?.enabled && (
                <a href={settings.socialLinks.youtube.url} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-red-500 hover:scale-110 transition-transform">
                  <Youtube size={20} />
                </a>
              )}
              {settings?.socialLinks?.instagram?.enabled && (
                <a href={settings.socialLinks.instagram.url} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-pink-500 hover:scale-110 transition-transform">
                  <Instagram size={20} />
                </a>
              )}
              {settings?.socialLinks?.facebook?.enabled && (
                <a href={settings.socialLinks.facebook.url} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-blue-500 hover:scale-110 transition-transform">
                  <Facebook size={20} />
                </a>
              )}
              {settings?.socialLinks?.telegram?.enabled && (
                <a href={settings.socialLinks.telegram.url} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-sky-500 hover:scale-110 transition-transform">
                  <Send size={20} />
                </a>
              )}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4 uppercase text-sm tracking-wider">Explore</h3>
            <ul className="space-y-3">
              <li><Link to="/categories" className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Categories</Link></li>
              <li><Link to="/trending" className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Trending Stories</Link></li>
              <li><Link to="/bookmarks" className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">My Bookmarks</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4 uppercase text-sm tracking-wider">Legal</h3>
            <ul className="space-y-3">
              <li><Link to="/privacy" className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Terms of Service</Link></li>
              <li><Link to="/disclaimer" className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Disclaimer</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-200 dark:border-slate-800 text-center">
          <p className="text-sm text-slate-400 dark:text-slate-500">
            © {new Date().getFullYear()} StoryTime. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
