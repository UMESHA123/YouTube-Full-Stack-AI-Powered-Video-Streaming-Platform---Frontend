// import { Video, User, Comment, Tweet } from './types';
import type { Video, User, Comment, Tweet } from './types';


export const CURRENT_USER: User = {
  id: 'u1',
  name: 'Creative Creator',
  avatar: 'https://picsum.photos/seed/user1/100/100',
  subscribers: '1.2M',
  banner: 'https://picsum.photos/seed/banner1/1200/300',
  description: 'Tech enthusiast, coder, and filmmaker sharing the journey.',
};

export const MOCK_VIDEOS: Video[] = [
  {
    id: 'v1',
    title: 'Building a React App in 10 Minutes',
    description: 'Learn how to quickly scaffold and build a React application using modern tools. We cover hooks, state management, and styling.',
    thumbnail: 'https://picsum.photos/seed/v1/640/360',
    videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    channelId: 'c1',
    channelName: 'Tech Master',
    channelAvatar: 'https://picsum.photos/seed/c1/100/100',
    views: '120K',
    uploadedAt: '2 days ago',
    duration: '10:05',
    category: 'Tech',
  },
  {
    id: 'v2',
    title: 'Nature Documentary: The Hidden Forest',
    description: 'Explore the depths of the amazon rainforest and discover species you never knew existed.',
    thumbnail: 'https://picsum.photos/seed/v2/640/360',
    videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    channelId: 'c2',
    channelName: 'Earth Planet',
    channelAvatar: 'https://picsum.photos/seed/c2/100/100',
    views: '1.5M',
    uploadedAt: '1 week ago',
    duration: '45:20',
    category: 'Nature',
  },
  {
    id: 'v3',
    title: 'Top 10 Coding Mistakes Beginners Make',
    description: 'Avoid these common pitfalls when starting your programming journey. Tips from a senior engineer.',
    thumbnail: 'https://picsum.photos/seed/v3/640/360',
    videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    channelId: 'c1',
    channelName: 'Tech Master',
    channelAvatar: 'https://picsum.photos/seed/c1/100/100',
    views: '340K',
    uploadedAt: '3 weeks ago',
    duration: '12:30',
    category: 'Education',
  },
  {
    id: 'v4',
    title: 'Delicious Pasta Recipe',
    description: 'Cook the most authentic Italian pasta with simple ingredients found in your kitchen.',
    thumbnail: 'https://picsum.photos/seed/v4/640/360',
    videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    channelId: 'c3',
    channelName: 'Chef Mario',
    channelAvatar: 'https://picsum.photos/seed/c3/100/100',
    views: '890K',
    uploadedAt: '1 month ago',
    duration: '08:15',
    category: 'Food',
  },
  {
    id: 'v5',
    title: 'Future of AI: Gemini & Beyond',
    description: 'A deep dive into the capabilities of large language models and what they mean for the future of software.',
    thumbnail: 'https://picsum.photos/seed/v5/640/360',
    videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    channelId: 'c4',
    channelName: 'AI Insider',
    channelAvatar: 'https://picsum.photos/seed/c4/100/100',
    views: '2.1M',
    uploadedAt: '5 days ago',
    duration: '15:00',
    category: 'Tech',
  }
];

export const MOCK_COMMENTS: Comment[] = [
  { id: 'cm1', userId: 'u2', username: 'Alice Dev', avatar: 'https://picsum.photos/seed/u2/50/50', text: 'This tutorial was incredibly helpful! Thanks for sharing.', likes: 120, timestamp: '2 days ago' },
  { id: 'cm2', userId: 'u3', username: 'Bob Coder', avatar: 'https://picsum.photos/seed/u3/50/50', text: 'I disagree with the point about state management, but great video otherwise.', likes: 45, timestamp: '1 day ago' },
  { id: 'cm3', userId: 'u4', username: 'Charlie', avatar: 'https://picsum.photos/seed/u4/50/50', text: 'Can you make a video about Next.js next?', likes: 89, timestamp: '5 hours ago' },
  { id: 'cm4', userId: 'u5', username: 'Dave', avatar: 'https://picsum.photos/seed/u5/50/50', text: 'Audio quality could be better.', likes: 12, timestamp: '1 hour ago' },
  { id: 'cm5', userId: 'u6', username: 'Eve', avatar: 'https://picsum.photos/seed/u6/50/50', text: 'Best explanation I have seen so far. Subscribed!', likes: 230, timestamp: '30 mins ago' },
];

export const MOCK_TWEETS: Tweet[] = [
  { id: 't1', userId: 'u1', username: 'Creative Creator', avatar: 'https://picsum.photos/seed/user1/100/100', content: 'Just dropped a new video on React Performance! Check it out.', timestamp: '1 hour ago', likes: 540, isTweet: true },
  { id: 't2', userId: 'c4', username: 'AI Insider', avatar: 'https://picsum.photos/seed/c4/100/100', content: 'The new Gemini model is mind-blowing. The reasoning capabilities are off the charts. 🚀', timestamp: '3 hours ago', likes: 1200, isTweet: true },
];