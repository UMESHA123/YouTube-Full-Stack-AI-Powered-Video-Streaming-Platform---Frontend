import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MOCK_VIDEOS, CURRENT_USER, MOCK_TWEETS } from '../constants';
import { Bell, ChevronRight, Search, ListMusic, Play, ArrowLeft, MessageCircle, Repeat2, Heart, Share } from 'lucide-react';

const Channel = () => {
  const { channelId } = useParams();
  const navigate = useNavigate();
  // In a real app, fetch channel details by ID. Using current user or first video's channel for mock.
  const isMe = channelId === 'me' || channelId === CURRENT_USER.id;
  const channelUser = isMe ? CURRENT_USER : { 
      id: 'c1', 
      name: 'Tech Master', 
      avatar: MOCK_VIDEOS[0].channelAvatar, 
      subscribers: '500K', 
      banner: 'https://picsum.photos/seed/banner2/1200/250', 
      description: 'The best tech reviews and tutorials on the planet.'
  };

  const [activeTab, setActiveTab] = useState('videos');
  const [selectedPlaylist, setSelectedPlaylist] = useState<any | null>(null);
  
  const channelVideos = MOCK_VIDEOS; // Filter by channel in real app

  // Mock Playlists Data
  const playlists = [
      { id: 'p1', title: 'React Tutorials', count: 5, thumbnail: MOCK_VIDEOS[0].thumbnail, videos: [MOCK_VIDEOS[0], MOCK_VIDEOS[2]] },
      { id: 'p2', title: 'Tech Reviews', count: 12, thumbnail: MOCK_VIDEOS[1].thumbnail, videos: [MOCK_VIDEOS[1], MOCK_VIDEOS[4]] },
      { id: 'p3', title: 'Live Streams', count: 8, thumbnail: MOCK_VIDEOS[3].thumbnail, videos: [MOCK_VIDEOS[3]] },
  ];

  const handleTabChange = (tab: string) => {
      setActiveTab(tab.toLowerCase());
      setSelectedPlaylist(null);
  };

  return (
    <div className="w-full">
      {/* Banner */}
      <div className="h-40 sm:h-60 w-full overflow-hidden">
          <img src={channelUser.banner} alt="Banner" className="w-full h-full object-cover" />
      </div>

      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <img src={channelUser.avatar} alt="Avatar" className="w-32 h-32 rounded-full border-4 border-[#0f0f0f] -mt-4 sm:-mt-0" />
            <div className="flex-1 text-center sm:text-left">
                <h1 className="text-3xl font-bold">{channelUser.name}</h1>
                <div className="text-gray-400 text-sm mt-1 flex flex-wrap justify-center sm:justify-start gap-2">
                    <span>@{channelUser.name.replace(' ', '')}</span>
                    <span>•</span>
                    <span>{channelUser.subscribers} subscribers</span>
                    <span>•</span>
                    <span>124 videos</span>
                </div>
                <p className="text-gray-400 text-sm mt-2 max-w-2xl flex items-center justify-center sm:justify-start gap-1 cursor-pointer hover:text-gray-200">
                    {channelUser.description} <ChevronRight size={14} />
                </p>
                <div className="mt-4 flex gap-3 justify-center sm:justify-start">
                    <button className="bg-white text-black px-6 py-2 rounded-full font-medium hover:bg-gray-200 transition-colors">
                        Subscribe
                    </button>
                    <button className="border border-gray-700 px-4 py-2 rounded-full font-medium hover:bg-gray-800 transition-colors">
                        Join
                    </button>
                    <button className="bg-gray-800 p-2 rounded-full hover:bg-gray-700">
                         <Bell size={20} />
                    </button>
                </div>
            </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 border-b border-gray-700 mt-8 overflow-x-auto">
            {['Home', 'Videos', 'Shorts', 'Playlists', 'Community'].map(tab => (
                <button 
                    key={tab}
                    onClick={() => handleTabChange(tab)}
                    className={`pb-3 px-2 text-sm font-medium uppercase tracking-wide border-b-2 transition-colors ${activeTab === tab.toLowerCase() ? 'border-white text-white' : 'border-transparent text-gray-400 hover:text-gray-200'}`}
                >
                    {tab}
                </button>
            ))}
            <button className="ml-auto hover:text-white text-gray-400"><Search size={20}/></button>
        </div>

        {/* Content Area */}
        <div className="py-6 min-h-[400px]">
            {(activeTab === 'videos' || activeTab === 'home') && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in">
                    {channelVideos.map(v => (
                        <div key={v.id} className="flex flex-col gap-2 group cursor-pointer" onClick={() => navigate(`/watch/${v.id}`)}>
                            <div className="relative rounded-xl overflow-hidden aspect-video">
                                <img src={v.thumbnail} alt={v.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                <span className="absolute bottom-1 right-1 bg-black/80 text-xs px-1 rounded">{v.duration}</span>
                            </div>
                            <h4 className="font-bold text-sm line-clamp-2 group-hover:text-blue-400">{v.title}</h4>
                            <div className="text-xs text-gray-400">{v.views} views • {v.uploadedAt}</div>
                        </div>
                    ))}
                </div>
            )}

            {activeTab === 'shorts' && (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 animate-fade-in">
                    {channelVideos.map(v => (
                        <div key={v.id} className="flex flex-col gap-2 group cursor-pointer" onClick={() => navigate(`/watch/${v.id}`)}>
                             <div className="relative rounded-xl overflow-hidden aspect-[9/16]">
                                <img src={v.thumbnail} alt={v.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60"></div>
                                <span className="absolute bottom-2 left-2 text-white font-bold text-sm line-clamp-2 pr-2">{v.title}</span>
                             </div>
                             <div className="text-xs text-gray-400">{v.views} views</div>
                        </div>
                    ))}
                </div>
            )}

            {activeTab === 'playlists' && (
                <div className="animate-fade-in">
                    {!selectedPlaylist ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {playlists.map(pl => (
                                <div key={pl.id} className="group cursor-pointer" onClick={() => setSelectedPlaylist(pl)}>
                                    <div className="relative aspect-video bg-gray-800 rounded-xl overflow-hidden mb-3">
                                        <img src={pl.thumbnail} alt={pl.title} className="w-full h-full object-cover group-hover:opacity-80 transition-opacity" />
                                        <div className="absolute right-0 top-0 bottom-0 w-2/5 bg-black/80 flex flex-col items-center justify-center text-white backdrop-blur-sm">
                                            <span className="font-bold text-lg">{pl.count}</span>
                                            <ListMusic size={24} className="mt-1" />
                                        </div>
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Play size={40} className="fill-white text-white drop-shadow-lg" />
                                        </div>
                                    </div>
                                    <h3 className="font-bold text-base">{pl.title}</h3>
                                    <p className="text-xs text-gray-400 font-semibold uppercase">View full playlist</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div>
                            <button onClick={() => setSelectedPlaylist(null)} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6">
                                <ArrowLeft size={18} /> Back to Playlists
                            </button>
                            <div className="flex flex-col lg:flex-row gap-8">
                                {/* Playlist Info Card */}
                                <div className="w-full lg:w-80 flex-shrink-0">
                                    <div className="bg-gradient-to-b from-gray-800 to-[#0f0f0f] p-6 rounded-2xl border border-gray-700 sticky top-20">
                                        <div className="aspect-video rounded-xl overflow-hidden mb-4 shadow-lg">
                                            <img src={selectedPlaylist.thumbnail} alt="" className="w-full h-full object-cover" />
                                        </div>
                                        <h2 className="text-2xl font-bold mb-2">{selectedPlaylist.title}</h2>
                                        <p className="text-gray-400 text-sm mb-4">{channelUser.name} • {selectedPlaylist.count} videos</p>
                                        <div className="flex gap-2">
                                            <button className="flex-1 bg-white text-black py-2 rounded-full font-bold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                                                <Play size={16} className="fill-black" /> Play All
                                            </button>
                                            <button className="p-2 bg-[#2a2a2a] rounded-full hover:bg-[#3a3a3a]"><Share size={20}/></button>
                                        </div>
                                    </div>
                                </div>
                                {/* Playlist Videos */}
                                <div className="flex-1 space-y-2">
                                    {selectedPlaylist.videos.map((v: any, idx: number) => (
                                        <div key={v.id} className="flex gap-4 p-3 hover:bg-[#1f1f1f] rounded-xl transition-colors cursor-pointer group" onClick={() => navigate(`/watch/${v.id}`)}>
                                            <span className="text-gray-500 font-medium self-center w-6 text-center">{idx + 1}</span>
                                            <div className="relative w-40 aspect-video rounded-lg overflow-hidden flex-shrink-0">
                                                <img src={v.thumbnail} alt="" className="w-full h-full object-cover" />
                                                <span className="absolute bottom-1 right-1 bg-black/80 text-xs px-1 rounded">{v.duration}</span>
                                            </div>
                                            <div className="flex flex-col justify-center min-w-0">
                                                <h4 className="font-bold text-sm md:text-base line-clamp-2 group-hover:text-blue-400 transition-colors">{v.title}</h4>
                                                <p className="text-xs text-gray-400 mt-1">{v.channelName} • {v.views} views</p>
                                            </div>
                                        </div>
                                    ))}
                                    {/* Mock extra videos to fill list if needed */}
                                    {Array.from({length: 3}).map((_, i) => (
                                         <div key={i} className="flex gap-4 p-3 hover:bg-[#1f1f1f] rounded-xl transition-colors cursor-pointer group opacity-50">
                                            <span className="text-gray-500 font-medium self-center w-6 text-center">{selectedPlaylist.videos.length + i + 1}</span>
                                            <div className="relative w-40 aspect-video rounded-lg overflow-hidden flex-shrink-0 bg-gray-800"></div>
                                            <div className="flex flex-col justify-center min-w-0">
                                                <div className="h-4 bg-gray-800 rounded w-3/4 mb-2"></div>
                                                <div className="h-3 bg-gray-800 rounded w-1/2"></div>
                                            </div>
                                         </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'community' && (
                <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
                    {MOCK_TWEETS.map(tweet => (
                        <div key={tweet.id} className="bg-[#16181c] border border-gray-800 rounded-xl p-5 hover:bg-[#1c1f24] transition-colors">
                            <div className="flex gap-4">
                                <img src={channelUser.avatar} alt="" className="w-12 h-12 rounded-full object-cover" />
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-bold">{channelUser.name}</span>
                                        <span className="text-gray-500 text-sm">@{channelUser.name.replace(' ','')} · {tweet.timestamp}</span>
                                    </div>
                                    <p className="text-sm md:text-base text-gray-200 mb-3">{tweet.content}</p>
                                    <div className="flex gap-6 text-gray-500">
                                        <button className="flex items-center gap-2 hover:text-blue-400 text-sm"><MessageCircle size={18}/> 12</button>
                                        <button className="flex items-center gap-2 hover:text-green-400 text-sm"><Repeat2 size={18}/> 4</button>
                                        <button className="flex items-center gap-2 hover:text-red-400 text-sm"><Heart size={18}/> {tweet.likes}</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Channel;