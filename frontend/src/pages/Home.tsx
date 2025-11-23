import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Video, Tweet, FeedItem } from '../types';
import { MOCK_VIDEOS, MOCK_TWEETS } from '../constants';
import { Twitter, MoreVertical, CheckCircle2, Heart, MessageCircle, Repeat2, Share } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<FeedItem[]>([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    // Initial load: mix videos and tweets
    loadMoreData();
  }, []);

  const loadMoreData = () => {
    // Simulate pagination by duplicating mock data
    const newVideos = MOCK_VIDEOS.map(v => ({ ...v, id: v.id + Date.now() }));
    const newTweets = MOCK_TWEETS.map(t => ({ ...t, id: t.id + Date.now() }));
    
    // Interleave pattern: 3 videos, 1 tweet, repeat
    const mixed: FeedItem[] = [];
    let tIdx = 0;
    for (let i = 0; i < newVideos.length; i++) {
        mixed.push(newVideos[i]);
        if ((i + 1) % 3 === 0 && tIdx < newTweets.length) {
            mixed.push(newTweets[tIdx % newTweets.length]);
            tIdx++;
        }
    }
    setItems(prev => [...prev, ...mixed]);
  };
  
  return (
    <div className="p-4 md:p-6">
      {/* Filter Tags */}
      <div className="flex gap-3 mb-6 overflow-x-auto pb-2 no-scrollbar sticky top-14 bg-[#0f0f0f] z-10 py-2">
        {["All", "Tech", "Nature", "Cooking", "AI", "Live", "Gaming", "Music", "Recently Uploaded", "New to you"].map((tag, i) => (
            <button key={i} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${i===0 ? 'bg-white text-black' : 'bg-gray-800 hover:bg-gray-700 text-gray-200'}`}>
                {tag}
            </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-8 gap-x-4">
        {items.map((item) => {
          if ('isTweet' in item) {
             // Render Tweet Card
             return (
                 <div key={item.id} className="col-span-1 bg-[#16181c] border border-gray-800 rounded-xl p-5 flex flex-col gap-3 hover:bg-[#1c1f24] transition-all duration-200 hover:shadow-lg hover:shadow-blue-900/10">
                    <div className="flex justify-between items-start">
                         <div className="flex gap-3">
                             <img src={item.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                             <div className="flex flex-col">
                                 <div className="flex items-center gap-1">
                                     <span className="font-bold text-sm text-white">{item.username}</span>
                                     <CheckCircle2 size={14} className="text-blue-400 fill-current" />
                                 </div>
                                 <span className="text-xs text-gray-500">@handle · {item.timestamp}</span>
                             </div>
                         </div>
                         <div className="p-2 hover:bg-blue-900/20 rounded-full transition-colors">
                            <Twitter size={18} className="text-blue-400" />
                         </div>
                    </div>
                    <p className="text-sm leading-relaxed text-gray-100">{item.content}</p>
                    <div className="border-t border-gray-700 mt-2 pt-3 flex justify-between text-gray-500 text-xs">
                        <button className="flex items-center gap-1 hover:text-blue-400 group">
                            <MessageCircle size={16} className="group-hover:bg-blue-900/20 rounded-full p-0.5" /> 12
                        </button>
                        <button className="flex items-center gap-1 hover:text-green-400 group">
                            <Repeat2 size={16} className="group-hover:bg-green-900/20 rounded-full p-0.5" /> 4
                        </button>
                        <button className="flex items-center gap-1 hover:text-red-400 group">
                            <Heart size={16} className="group-hover:bg-red-900/20 rounded-full p-0.5" /> {item.likes}
                        </button>
                        <button className="flex items-center gap-1 hover:text-blue-400 group">
                            <Share size={16} className="group-hover:bg-blue-900/20 rounded-full p-0.5" />
                        </button>
                    </div>
                 </div>
             );
          } else {
             // Render Video Card
             return (
                 <div key={item.id} className="flex flex-col gap-2 group cursor-pointer" onClick={() => navigate(`/watch/${item.id}`)}>
                    <div className="relative rounded-xl overflow-hidden aspect-video bg-gray-900">
                        <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-out" />
                        <span className="absolute bottom-2 right-2 bg-black/80 text-white px-1.5 py-0.5 rounded text-xs font-bold">{item.duration}</span>
                    </div>
                    <div className="flex gap-3 mt-1">
                        <img 
                            src={item.channelAvatar} 
                            alt="" 
                            className="w-9 h-9 rounded-full mt-1 hover:opacity-80 transition-opacity flex-shrink-0" 
                            onClick={(e) => { e.stopPropagation(); navigate(`/channel/${item.channelId}`); }}
                        />
                        <div className="flex flex-col min-w-0">
                            <h3 className="font-bold text-base leading-snug line-clamp-2 mb-1 group-hover:text-white text-gray-100 transition-colors">{item.title}</h3>
                            <p className="text-sm text-gray-400 hover:text-white transition-colors" onClick={(e) => { e.stopPropagation(); navigate(`/channel/${item.channelId}`); }}>{item.channelName}</p>
                            <p className="text-sm text-gray-400">{item.views} views • {item.uploadedAt}</p>
                        </div>
                        <button className="ml-auto self-start opacity-0 group-hover:opacity-100 hover:bg-gray-800 p-1 rounded-full transition-all">
                            <MoreVertical size={18} />
                        </button>
                    </div>
                 </div>
             );
          }
        })}
      </div>

      <div className="mt-12 flex justify-center pb-8">
          <button onClick={loadMoreData} className="px-8 py-3 bg-[#2a2a2a] hover:bg-[#333] rounded-full font-medium transition-colors text-sm border border-gray-700">
              Load More Videos
          </button>
      </div>
    </div>
  );
};

export default Home;