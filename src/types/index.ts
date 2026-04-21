export interface Category {
  id: string; // The Firestore doc ID
  name: string;
  slug: string;
  theme: string;
  imageUrl: string;
  status: 'active' | 'inactive';
  createdAt: number;
  updatedAt: number;
}

export interface Story {
  id: string;
  title: string;
  slug: string;
  categoryId: string;
  theme: string;
  language: string; // 'Hindi' | 'English'
  bannerImageUrl: string;
  thumbnailUrl: string;
  content: string; // HTML or Markdown
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  readingTime: number;
  viewCount: number;
  status: 'published' | 'draft';
  createdAt: number;
  updatedAt: number;
}

export interface Settings {
  heroImageUrl: string;
  socialLinks: {
    youtube: { url: string; enabled: boolean };
    instagram: { url: string; enabled: boolean };
    telegram: { url: string; enabled: boolean };
    facebook: { url: string; enabled: boolean };
  };
  ads: {
    header: string;
    content: string;
    sidebar: string;
    footer: string;
  };
  updatedAt: number;
}
