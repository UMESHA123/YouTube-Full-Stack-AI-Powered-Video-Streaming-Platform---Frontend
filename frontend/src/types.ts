export interface User {
  id: string;
  name: string;
  avatar: string;
  subscribers: string;
  banner: string;
  description: string;
}

export interface Comment {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  text: string;
  likes: number;
  timestamp: string;
}

export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
  channelId: string;
  channelName: string;
  channelAvatar: string;
  views: string;
  uploadedAt: string;
  duration: string;
  category: string;
}

export interface Tweet {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  content: string;
  timestamp: string;
  likes: number;
  isTweet: boolean; // specific flag to distinguish in mixed feeds
}

export type FeedItem = Video | Tweet;

export interface ChannelAnalytics {
  totalVideos: number;
  totalViews: number;
  subscribersGained: number;
  activePlaylists: number;
}