import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Book, FolderTree, Settings, LogOut } from 'lucide-react';
import { auth } from '../firebase/firebase';
import { signOut } from 'firebase/auth';
import { Helmet } from 'react-helmet-async';
import { cn } from '../lib/utils';

export default function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Stories', path: '/admin/stories', icon: Book },
    { name: 'Categories', path: '/admin/categories', icon: FolderTree },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 w-full text-slate-900 dark:text-slate-100 font-sans">
      <Helmet>
        <title>Admin Dashboard</title>
      </Helmet>
      
      {/* Sidebar */}
      <div className="w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col hidden md:flex">
        <div className="p-6">
          <h2 className="text-xl font-display font-bold text-indigo-600 dark:text-indigo-400">Admin Panel</h2>
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === '/admin'}
              className={({ isActive }) => cn(
                "group flex items-center px-3 py-2 text-sm font-medium rounded-xl transition-colors",
                isActive 
                  ? "bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300" 
                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"
              )}
            >
              <item.icon className="mr-3 flex-shrink-0 h-5 w-5" />
              {item.name}
            </NavLink>
          ))}
        </nav>
        
        <div className="p-4 border-t border-slate-200 dark:border-slate-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
          >
            <LogOut className="mr-3 flex-shrink-0 h-5 w-5" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}
