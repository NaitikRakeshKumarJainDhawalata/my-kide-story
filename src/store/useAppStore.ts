import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Settings } from '../types';

interface AppState {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  setDarkMode: (isDark: boolean) => void;
  
  settings: Settings | null;
  setSettings: (settings: Settings | null) => void;
  
  bookmarks: string[];
  toggleBookmark: (storyId: string) => void;
  
  readingProgress: Record<string, number>;
  setReadingProgress: (storyId: string, progress: number) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      isDarkMode: false,
      toggleDarkMode: () => set((state) => {
        const newMode = !state.isDarkMode;
        if (newMode) document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
        return { isDarkMode: newMode };
      }),
      setDarkMode: (isDark) => set(() => {
        if (isDark) document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
        return { isDarkMode: isDark };
      }),
      
      settings: null,
      setSettings: (settings) => set({ settings }),
      
      bookmarks: [],
      toggleBookmark: (storyId) => set((state) => {
        const isBookmarked = state.bookmarks.includes(storyId);
        return {
          bookmarks: isBookmarked 
            ? state.bookmarks.filter(id => id !== storyId)
            : [...state.bookmarks, storyId]
        };
      }),
      
      readingProgress: {},
      setReadingProgress: (storyId, progress) => set((state) => ({
        readingProgress: { ...state.readingProgress, [storyId]: progress }
      })),
    }),
    {
      name: 'story-app-storage',
      partialize: (state) => ({ 
        isDarkMode: state.isDarkMode,
        bookmarks: state.bookmarks,
        readingProgress: state.readingProgress,
      }), // only persist these fields
    }
  )
);
