export interface HeaderProps {
  toggleSidebar: () => void;
  onCreateClick: () => void;
}

export interface LoginUserDetailsResponse {
  _id: string;
  username: string;
  email: string;
  fullName: string;
  avatar: string;
  coverImage: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// TODO -> update the video type(add created and updated at fields)
export interface Video {
  _id: string;
  videoFile: string;
  thumbnail: string;
  title: string;
  duration: string;
  views: number;
  isLive?: boolean;
  owner: {
    _id: string;
    fullName: string;
    avatar: string;
  };
  createdAt: string;
  updatedAt: string;
}
export interface VideoPlay {
  createdAt: string;
  description: string;
  duration: string;
  ispublished: string;
  likes: number;
  owner: {
    avatar: string;
    username: string;
    _id: string;
  };
  thumbnail: string;
  title: string;
  updatedAt: string;
  videoFile: string;
  views: number;
  isLive?: boolean;
  __v: number;
  _id: string;
}
export interface UploadState {
  isActive: boolean;
  progress: number;
  isComplete: boolean;
  data: {
    title: string;
    description: string;
    videoFile?: File | null;
    thumbnailFile?: File | null;
  } | null;
}

export interface PlaylistType {
  _id: string;
  name: string;
  description: string;
  videos?: [
    {
      _id: string;
      videoFile: string;
      thumbnail: string;
      title: string;
      description: string;
      duration: string;
      views: number;
      isPublished: string;
      owner: string;
      createdAt: string;
      updatedAt: string;
      __v: number;
    }
  ];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface VideoPlaylist {
  _id: string;
  videoFile: string;
  videoId: string;
  thumbnail: string;
  title: string;
  description: string;
  duration: number;
  views: number;
  isPublished: boolean;
  isLive?: boolean;
  owner: {
    _id: string;
    username: string;
    fullName: string;
    avatar: string;
  };
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  // text: string;
  title: string;
  summary: string;
  keywords: [string]

}

export interface SocialTweet{
    _id: string;
    content: string;
    owner: {
        _id: string;
        username: string;
        fullName: string;
        avatar: string;
    }
    createdAt: string;
    updatedAt: string;
    __v: number
}

export interface Comment {
  _id: string;
  content: string;
  video: string;
  parentComment?: string | null;
  repliesCount?: number;
  owner: {
    _id: string;
    username: string;
    fullName: string;
    avatar: string;
  };
  createdAt: string;
  updatedAt: string;
}
export interface DashboardData {
  totalSubscribers: number;
  totalVideoViews: number;
  totalLikes: number;
  totalVideos: number;
}


export interface Channel {
  name: string;
  handle: string;
  subscribers: string;
  videosCount: number;
  description: string;
  avatar: string;
  banner: string;
}

export interface TabItem {
  id: string;
  label: string;
  isActive?: boolean;
}
export interface PublishVideoData {
    videoFile: File | null;
    thumbnail: File | null;
    title: string;
    description: string;
}

export interface PlaylistType {
  _id: string;
  name: string;
  description: string;
  videos?: [{
    _id: string;
    videoFile: string;
    thumbnail: string;
    title: string;
    description: string;
    duration: string;
    views: number;
    isPublished: string;
    owner: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  }];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface CommunityFeedPost {
  _id: string;
  content: string;
  owner: {
    _id: string;
    username: string;
    fullName: string;
    avatar: string;
  }
  repostOf?: {
    _id: string;
    content: string;
    owner: {
      _id: string;
      username: string;
      fullName: string;
      avatar: string;
    };
  } | null;
  comments: TweetComment[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface TweetComment {
  _id: string;
  content: string;
  owner: {
    _id: string;
    username: string;
    fullName: string;
    avatar: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ChannelVideoGridType {
  _id: string;
  videoFile: string;
  thumbnail: string;
  title: string;
  duration: string;
  views: number;
  owner: {
    _id: string;
    fullName: string;
    avatar: string;
  }
}

export interface SubscriptionType {
  _id: string;
  username: string;
  avatar: string;
  subscribedAt: string;
}

export interface Notification {
  _id: string;
  user: string;
  type: string;
  video?: {
    _id: string;
    thumbnail: string;
    title: string;
    videoFile: string;
  } | null;
  channel: {
    _id: string;
    username: string;
    avatar: string;
  };
  streamTitle?: string;
  streamUrl?: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ChartDataPoint {
  date: string;
  subscribers: number;
  views: number;
  likes: number;
  uploads: number;
}
