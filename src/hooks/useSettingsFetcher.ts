import { useEffect } from 'react';
import { db } from '../firebase/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useAppStore } from '../store/useAppStore';

export function useSettingsFetcher() {
  const { setSettings } = useAppStore();

  useEffect(() => {
    async function fetchSettings() {
      try {
        const settingsDoc = await getDoc(doc(db, 'settings', 'global'));
        if (settingsDoc.exists()) {
          setSettings(settingsDoc.data() as any);
        } else {
          // Initialize default setting
          setSettings({
            heroImageUrl: 'https://picsum.photos/seed/story-hero/1200/500',
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
        }
      } catch (err) {
        console.error("Failed to fetch settings", err);
      }
    }
    fetchSettings();
  }, [setSettings]);
}
