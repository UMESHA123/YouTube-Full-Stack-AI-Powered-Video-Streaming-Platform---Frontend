export interface Subscription {
  id: string;
  name: string;
  avatar: string;
  isLive?: boolean;
}
export interface Category {
  id: string;
  label: string;
}


export const SUBSCRIPTIONS: Subscription[] = [
  { id: '1', name: 'Tech Master', avatar: 'https://picsum.photos/seed/avatar1/100/100', isLive: true },
  { id: '2', name: 'Earth Planet', avatar: 'https://picsum.photos/seed/avatar2/100/100' },
  { id: '3', name: 'Chef Mario', avatar: 'https://picsum.photos/seed/avatar3/100/100' },
  { id: '4', name: 'AI Insider', avatar: 'https://picsum.photos/seed/avatar4/100/100', isLive: true },
  { id: '5', name: 'Music Vibes', avatar: 'https://picsum.photos/seed/music/100/100' },
  { id: '6', name: 'Gaming Pro', avatar: 'https://picsum.photos/seed/gaming/100/100' },
];

export const CATEGORIES: Category[] = [
  { id: 'all', label: 'All' },
  { id: 'tech', label: 'Tech' },
  { id: 'nature', label: 'Nature' },
  { id: 'cooking', label: 'Cooking' },
  { id: 'ai', label: 'AI' },
  { id: 'live', label: 'Live' },
  { id: 'gaming', label: 'Gaming' },
  { id: 'music', label: 'Music' },
  { id: 'recent', label: 'Recently Uploaded' },
  { id: 'new', label: 'New to you' },
];
