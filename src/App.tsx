import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { RootLayout } from './components/layout/RootLayout';
import { LoadingScreen } from './components/ui/LoadingScreen';
import { useAuth } from './hooks/useAuth';
import { useSettingsFetcher } from './hooks/useSettingsFetcher';

// Lazy loaded pages to handle code-splitting
const HomePage = React.lazy(() => import('./pages/HomePage'));
const CategoryList = React.lazy(() => import('./pages/CategoryList'));
const CategoryDetails = React.lazy(() => import('./pages/CategoryDetails'));
const StoryPage = React.lazy(() => import('./pages/StoryPage'));
const TrendingPage = React.lazy(() => import('./pages/TrendingPage'));
const BookmarksPage = React.lazy(() => import('./pages/BookmarksPage'));
const SearchPage = React.lazy(() => import('./pages/SearchPage'));
const NotFoundPage = React.lazy(() => import('./pages/NotFoundPage'));

// Admin Pages
const AdminLayout = React.lazy(() => import('./admin/AdminLayout'));
const Dashboard = React.lazy(() => import('./admin/Dashboard'));
const ManageStories = React.lazy(() => import('./admin/ManageStories'));
const AddEditStory = React.lazy(() => import('./admin/AddEditStory'));
const ManageCategories = React.lazy(() => import('./admin/ManageCategories'));
const SettingsPanel = React.lazy(() => import('./admin/SettingsPanel'));
const AdminLogin = React.lazy(() => import('./admin/AdminLogin'));

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUser, isAdmin, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (!currentUser || !isAdmin) return <Navigate to="/admin/login" replace />;
  return <>{children}</>;
};

export default function App() {
  useSettingsFetcher(); // Fetch global settings on mount

  return (
    <HelmetProvider>
      <BrowserRouter>
        <Suspense fallback={<LoadingScreen />}>
          <Routes>
            {/* Public Routes */}
            <Route element={<RootLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/categories" element={<CategoryList />} />
              <Route path="/categories/:slug" element={<CategoryDetails />} />
              <Route path="/story/:slug" element={<StoryPage />} />
              <Route path="/trending" element={<TrendingPage />} />
              <Route path="/bookmarks" element={<BookmarksPage />} />
              <Route path="/search" element={<SearchPage />} />
              
              {/* Legal Pages (Stubs for now) */}
              <Route path="/privacy" element={<div className="p-12 text-center">Privacy Policy Content</div>} />
              <Route path="/terms" element={<div className="p-12 text-center">Terms of Service Content</div>} />
              <Route path="/disclaimer" element={<div className="p-12 text-center">Disclaimer Content</div>} />
              
              <Route path="*" element={<NotFoundPage />} />
            </Route>

            {/* Admin Auth */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Protected Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Dashboard />} />
              <Route path="stories" element={<ManageStories />} />
              <Route path="stories/add" element={<AddEditStory />} />
              <Route path="stories/edit/:id" element={<AddEditStory />} />
              <Route path="categories" element={<ManageCategories />} />
              <Route path="settings" element={<SettingsPanel />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </HelmetProvider>
  );
}
