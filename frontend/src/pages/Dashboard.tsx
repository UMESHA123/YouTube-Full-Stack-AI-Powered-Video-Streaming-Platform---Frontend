import React, { useState, useContext, useEffect } from 'react';
import { MOCK_VIDEOS } from '../constants';
import { Upload, PlusSquare, Twitter, BarChart3, Edit2, Trash2, Save, X, MoreVertical, Search, Lock, Mail, User, ListMusic, Sparkles, Image as ImageIcon, Check, Video as VideoIcon } from 'lucide-react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { UploadContext, AuthContext } from '../App';
import { generateThumbnailPrompts } from '../services/geminiService';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { startUpload } = useContext(UploadContext);
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'overview' | 'content' | 'playlists' | 'settings' | 'tweets'>('overview');
  
  // Modal States
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  
  // Channel Details (Local state to allow editing without affecting global mock immediately)
  const [channelDetails, setChannelDetails] = useState(currentUser || { name: '', description: '' });
  const [tweetText, setTweetText] = useState('');

  // Upload Flow State
  const [uploadStep, setUploadStep] = useState<'select' | 'details'>('select');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [videoTitle, setVideoTitle] = useState('');
  const [videoDesc, setVideoDesc] = useState('');
  
  // GenAI Thumbnail State
  const [thumbnailPrompt, setThumbnailPrompt] = useState('');
  const [generatedThumbnails, setGeneratedThumbnails] = useState<string[]>([]);
  const [isGeneratingThumbs, setIsGeneratingThumbs] = useState(false);
  const [selectedThumbnail, setSelectedThumbnail] = useState<string | null>(null);

  // Playlist State
  const [playlistName, setPlaylistName] = useState('');
  const [playlistDesc, setPlaylistDesc] = useState('');

  // Protect Route
  useEffect(() => {
      if (!currentUser) {
          navigate('/signin');
      } else {
          setChannelDetails(currentUser);
      }
  }, [currentUser, navigate]);

  if (!currentUser) return null;

  // Mock analytics data
  const data = [
    { name: 'Mon', views: 4000 },
    { name: 'Tue', views: 3000 },
    { name: 'Wed', views: 2000 },
    { name: 'Thu', views: 2780 },
    { name: 'Fri', views: 1890 },
    { name: 'Sat', views: 2390 },
    { name: 'Sun', views: 3490 },
  ];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          setUploadedFile(file);
          setVideoTitle(file.name.replace(/\.[^/.]+$/, ""));
          setUploadStep('details');
          
          // Trigger the global progress bar
          startUpload(file.name);
      }
  };

  const handleGenerateThumbnails = async () => {
      if (!thumbnailPrompt.trim()) return;
      setIsGeneratingThumbs(true);
      
      // Simulate GenAI Call
      try {
          // In a real app with Imagen, we would call generateImages.
          // Here we use a text prompt helper to verify we can call Gemini, then simulate image results.
          await generateThumbnailPrompts(videoTitle, thumbnailPrompt);
          
          // Mock results using picsum with seeds based on prompt length
          const mockImages = [
              `https://picsum.photos/seed/${thumbnailPrompt.length}1/320/180`,
              `https://picsum.photos/seed/${thumbnailPrompt.length}2/320/180`,
              `https://picsum.photos/seed/${thumbnailPrompt.length}3/320/180`
          ];
          setGeneratedThumbnails(mockImages);
      } catch (e) {
          console.error(e);
      } finally {
          setIsGeneratingThumbs(false);
      }
  };

  const handlePublish = () => {
      alert("Video Published Successfully!");
      setShowUploadModal(false);
      setUploadStep('select');
      setUploadedFile(null);
      setGeneratedThumbnails([]);
      setSelectedThumbnail(null);
      setVideoTitle('');
  };

  const handleCreatePlaylist = () => {
      if (!playlistName.trim()) return;
      alert(`Playlist "${playlistName}" created!`);
      setShowPlaylistModal(false);
      setPlaylistName('');
      setPlaylistDesc('');
  };

  const OverviewTab = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
        <div className="col-span-1 lg:col-span-2 bg-[#1f1f1f] p-6 rounded-xl border border-gray-800">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <BarChart3 className="text-blue-400" /> Channel Analytics
            </h2>
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-[#161616] p-4 rounded-lg">
                    <p className="text-gray-400 text-sm">Total Views</p>
                    <p className="text-2xl font-bold">1.4M</p>
                </div>
                <div className="bg-[#161616] p-4 rounded-lg">
                    <p className="text-gray-400 text-sm">Subscribers</p>
                    <p className="text-2xl font-bold">+12.5K</p>
                </div>
                <div className="bg-[#161616] p-4 rounded-lg">
                    <p className="text-gray-400 text-sm">Revenue</p>
                    <p className="text-2xl font-bold">$3,240</p>
                </div>
            </div>
            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <XAxis dataKey="name" stroke="#555" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#333', border: 'none', borderRadius: '8px' }}
                            cursor={{fill: '#ffffff10'}}
                        />
                        <Bar dataKey="views" fill="#3b82f6" radius={[4, 4, 0, 0]}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#3b82f6' : '#60a5fa'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
        <div className="col-span-1 space-y-6">
            <div className="bg-[#1f1f1f] p-6 rounded-xl border border-gray-800">
                <h3 className="font-semibold mb-4">Quick Actions</h3>
                <div className="space-y-3">
                    <button onClick={() => setShowUploadModal(true)} className="w-full flex items-center gap-3 p-3 bg-[#2a2a2a] hover:bg-[#333] rounded-lg transition-colors text-left">
                        <div className="p-2 bg-red-600/20 text-red-500 rounded-full"><Upload size={20} /></div>
                        <div>
                            <div className="font-medium">Upload Video</div>
                            <div className="text-xs text-gray-400">Drag and drop files</div>
                        </div>
                    </button>
                    <button onClick={() => setActiveTab('tweets')} className="w-full flex items-center gap-3 p-3 bg-[#2a2a2a] hover:bg-[#333] rounded-lg transition-colors text-left">
                        <div className="p-2 bg-blue-600/20 text-blue-500 rounded-full"><Twitter size={20} /></div>
                        <div>
                            <div className="font-medium">Post Tweet</div>
                            <div className="text-xs text-gray-400">Share updates</div>
                        </div>
                    </button>
                    <button onClick={() => setShowPlaylistModal(true)} className="w-full flex items-center gap-3 p-3 bg-[#2a2a2a] hover:bg-[#333] rounded-lg transition-colors text-left">
                        <div className="p-2 bg-green-600/20 text-green-500 rounded-full"><PlusSquare size={20} /></div>
                        <div>
                            <div className="font-medium">New Playlist</div>
                            <div className="text-xs text-gray-400">Curate content</div>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    </div>
  );

  const ContentTab = () => (
      <div className="bg-[#1f1f1f] rounded-xl border border-gray-800 overflow-hidden">
          <div className="p-4 border-b border-gray-800 flex justify-between items-center">
              <h3 className="font-bold">Channel Content</h3>
              <div className="flex gap-2">
                  <button className="flex items-center gap-1 text-sm text-gray-400 hover:text-white"><Search size={16}/> Filter</button>
              </div>
          </div>
          <table className="w-full text-left border-collapse">
              <thead className="bg-[#161616] text-xs uppercase text-gray-400">
                  <tr>
                      <th className="p-4">Video</th>
                      <th className="p-4">Visibility</th>
                      <th className="p-4">Date</th>
                      <th className="p-4">Views</th>
                      <th className="p-4 text-right">Actions</th>
                  </tr>
              </thead>
              <tbody className="text-sm">
                  {MOCK_VIDEOS.map((video) => (
                      <tr key={video.id} className="border-b border-gray-800 hover:bg-[#2a2a2a] transition-colors">
                          <td className="p-4">
                              <div className="flex gap-3">
                                  <img src={video.thumbnail} className="w-24 h-14 object-cover rounded" alt="" />
                                  <div className="flex flex-col justify-center">
                                      <span className="font-medium line-clamp-1">{video.title}</span>
                                      <span className="text-gray-500 text-xs line-clamp-1">{video.description}</span>
                                  </div>
                              </div>
                          </td>
                          <td className="p-4 text-green-400">Public</td>
                          <td className="p-4 text-gray-400">{video.uploadedAt}</td>
                          <td className="p-4">{video.views}</td>
                          <td className="p-4 text-right">
                              <div className="flex justify-end gap-2">
                                  <button className="p-2 hover:bg-gray-700 rounded text-blue-400"><Edit2 size={16}/></button>
                                  <button className="p-2 hover:bg-gray-700 rounded text-red-400"><Trash2 size={16}/></button>
                              </div>
                          </td>
                      </tr>
                  ))}
              </tbody>
          </table>
      </div>
  );

  const SettingsTab = () => (
      <div className="max-w-2xl mx-auto bg-[#1f1f1f] p-8 rounded-xl border border-gray-800">
          <h2 className="text-xl font-bold mb-6">Channel Customization</h2>
          <div className="space-y-6">
              <div className="flex flex-col gap-2">
                  <label className="text-sm text-gray-400">Channel Name</label>
                  <div className="flex items-center gap-3 bg-[#121212] border border-gray-700 rounded-lg px-3 py-2">
                      <User size={18} className="text-gray-500" />
                      <input 
                        type="text" 
                        value={channelDetails.name} 
                        onChange={(e) => setChannelDetails({...channelDetails, name: e.target.value})}
                        className="bg-transparent w-full outline-none text-white" 
                      />
                  </div>
              </div>

              <div className="flex flex-col gap-2">
                  <label className="text-sm text-gray-400">Description</label>
                  <textarea 
                    value={channelDetails.description}
                    onChange={(e) => setChannelDetails({...channelDetails, description: e.target.value})}
                    rows={4}
                    className="bg-[#121212] border border-gray-700 rounded-lg px-3 py-2 outline-none text-white resize-none"
                  />
              </div>

              <div className="flex flex-col gap-2">
                  <label className="text-sm text-gray-400">Account Password</label>
                  <div className="flex items-center gap-3 bg-[#121212] border border-gray-700 rounded-lg px-3 py-2">
                      <Lock size={18} className="text-gray-500" />
                      <input type="password" value="********" readOnly className="bg-transparent w-full outline-none text-white" />
                      <button className="text-xs text-blue-400">Change</button>
                  </div>
              </div>
              
              <div className="pt-4 border-t border-gray-800 flex justify-end">
                  <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-full font-medium">
                      <Save size={18} /> Save Changes
                  </button>
              </div>
          </div>
      </div>
  );

  const TweetTab = () => (
      <div className="max-w-xl mx-auto">
          <div className="bg-[#1f1f1f] rounded-xl border border-gray-800 p-4">
              <div className="flex gap-3">
                  <img src={currentUser.avatar} alt="" className="w-10 h-10 rounded-full" />
                  <div className="flex-1">
                      <textarea 
                        value={tweetText}
                        onChange={(e) => setTweetText(e.target.value)}
                        placeholder="What's happening?" 
                        className="w-full bg-transparent outline-none text-lg placeholder-gray-500 resize-none min-h-[120px]"
                      />
                      <div className="border-t border-gray-700 pt-3 flex justify-between items-center">
                          <div className="flex gap-2 text-blue-400">
                               <button className="p-2 hover:bg-blue-900/30 rounded-full"><Upload size={18}/></button>
                               <button className="p-2 hover:bg-blue-900/30 rounded-full"><BarChart3 size={18}/></button>
                          </div>
                          <button 
                            disabled={!tweetText.trim()}
                            onClick={() => { setTweetText(''); alert('Tweet Posted!'); }}
                            className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:hover:bg-blue-500 text-white px-5 py-2 rounded-full font-bold transition-colors"
                          >
                              Post
                          </button>
                      </div>
                  </div>
              </div>
          </div>
          <div className="mt-8">
              <h3 className="text-gray-400 mb-4 font-semibold">Your Recent Tweets</h3>
              <div className="bg-[#16181c] border border-gray-800 rounded-xl p-4 mb-4">
                   <p className="text-gray-300">Just dropped a new video on React Performance! Check it out.</p>
                   <span className="text-gray-500 text-xs mt-2 block">1 hour ago</span>
              </div>
          </div>
      </div>
  );

  const PlaylistTab = () => (
      <div className="space-y-6">
          <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Your Playlists</h2>
              <button 
                onClick={() => setShowPlaylistModal(true)}
                className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-full text-sm font-bold hover:bg-gray-200"
              >
                  <PlusSquare size={18} /> New Playlist
              </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1,2,3].map(i => (
                  <div key={i} className="group cursor-pointer">
                      <div className="relative aspect-video bg-gray-800 rounded-xl overflow-hidden mb-2">
                         <div className="absolute inset-0 flex items-center justify-center bg-black/50 group-hover:bg-black/40 transition-colors">
                             <ListMusic size={32} />
                         </div>
                         <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-black/60 flex items-center justify-center text-xs font-bold">
                             8 Videos
                         </div>
                      </div>
                      <h3 className="font-bold text-sm">Tech Tutorials {i}</h3>
                      <p className="text-xs text-gray-400">Updated today</p>
                  </div>
              ))}
          </div>
      </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="flex bg-[#1f1f1f] p-1 rounded-lg border border-gray-800 overflow-x-auto">
              {[
                {id: 'overview', label: 'Overview', icon: BarChart3},
                {id: 'content', label: 'Content', icon: VideoIcon},
                {id: 'playlists', label: 'Playlists', icon: ListMusic},
                {id: 'tweets', label: 'Tweets', icon: Twitter},
                {id: 'settings', label: 'Settings', icon: Edit2},
              ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-white text-black shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}
                  >
                      {React.createElement(tab.icon, {size: 16})} {tab.label}
                  </button>
              ))}
          </div>
      </div>

      <div className="min-h-[500px]">
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'content' && <ContentTab />}
        {activeTab === 'settings' && <SettingsTab />}
        {activeTab === 'tweets' && <TweetTab />}
        {activeTab === 'playlists' && <PlaylistTab />}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
          <div className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-4">
              <div className="bg-[#1f1f1f] w-full max-w-4xl rounded-2xl border border-gray-700 shadow-2xl overflow-hidden animate-scale-up max-h-[90vh] overflow-y-auto">
                  <div className="p-4 border-b border-gray-700 flex justify-between items-center sticky top-0 bg-[#1f1f1f] z-10">
                      <h2 className="text-lg font-bold">{uploadStep === 'select' ? 'Upload Videos' : 'Video Details'}</h2>
                      <button onClick={() => setShowUploadModal(false)} className="hover:bg-gray-700 p-2 rounded-full"><X size={20}/></button>
                  </div>
                  
                  {uploadStep === 'select' ? (
                    <div className="p-10 flex flex-col items-center justify-center text-center h-[400px]">
                        <div className="w-32 h-32 bg-[#121212] rounded-full flex items-center justify-center mb-6 animate-pulse">
                            <Upload size={48} className="text-gray-500" />
                        </div>
                        <h3 className="text-xl font-medium mb-2">Drag and drop video files to upload</h3>
                        <p className="text-gray-400 text-sm mb-6">Your videos will be private until you publish them.</p>
                        <input 
                            type="file" 
                            id="file-upload" 
                            className="hidden" 
                            accept="video/*"
                            onChange={handleFileSelect}
                        />
                        <label 
                            htmlFor="file-upload"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-md font-medium cursor-pointer"
                        >
                            Select Files
                        </label>
                    </div>
                  ) : (
                    <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Details Form */}
                        <div className="space-y-4">
                             <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-gray-300">Title</label>
                                <input 
                                    type="text" 
                                    value={videoTitle}
                                    onChange={(e) => setVideoTitle(e.target.value)}
                                    className="bg-[#121212] border border-gray-700 rounded-lg p-3 outline-none text-white focus:border-blue-500"
                                />
                             </div>
                             <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-gray-300">Description</label>
                                <textarea 
                                    rows={5}
                                    value={videoDesc}
                                    onChange={(e) => setVideoDesc(e.target.value)}
                                    className="bg-[#121212] border border-gray-700 rounded-lg p-3 outline-none text-white focus:border-blue-500 resize-none"
                                />
                             </div>
                        </div>

                        {/* GenAI Thumbnail Section */}
                        <div className="bg-[#161616] rounded-xl p-4 border border-gray-800">
                             <h3 className="font-semibold mb-3 flex items-center gap-2 text-purple-400">
                                 <Sparkles size={18} /> AI Thumbnail Generator
                             </h3>
                             <p className="text-xs text-gray-400 mb-4">Describe the image you want, and AI will generate options.</p>
                             
                             <div className="flex gap-2 mb-4">
                                 <input 
                                    type="text" 
                                    placeholder="E.g., A futuristic robot holding a glowing orb"
                                    value={thumbnailPrompt}
                                    onChange={(e) => setThumbnailPrompt(e.target.value)}
                                    className="flex-1 bg-[#0f0f0f] border border-gray-700 rounded-lg px-3 py-2 text-sm outline-none"
                                 />
                                 <button 
                                    onClick={handleGenerateThumbnails}
                                    disabled={isGeneratingThumbs || !thumbnailPrompt}
                                    className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-medium"
                                 >
                                    {isGeneratingThumbs ? 'Generating...' : 'Generate'}
                                 </button>
                             </div>

                             <div className="grid grid-cols-3 gap-2 h-[120px]">
                                 {isGeneratingThumbs ? (
                                     [1,2,3].map(i => (
                                         <div key={i} className="bg-gray-800 rounded-lg animate-pulse"></div>
                                     ))
                                 ) : generatedThumbnails.length > 0 ? (
                                     generatedThumbnails.map((url, i) => (
                                         <div 
                                            key={i} 
                                            onClick={() => setSelectedThumbnail(url)}
                                            className={`relative rounded-lg overflow-hidden cursor-pointer border-2 ${selectedThumbnail === url ? 'border-purple-500' : 'border-transparent hover:border-gray-500'}`}
                                         >
                                             <img src={url} alt="Generated" className="w-full h-full object-cover" />
                                             {selectedThumbnail === url && (
                                                 <div className="absolute inset-0 bg-purple-500/20 flex items-center justify-center">
                                                     <div className="bg-purple-500 p-1 rounded-full"><Check size={12} className="text-white"/></div>
                                                 </div>
                                             )}
                                         </div>
                                     ))
                                 ) : (
                                     <div className="col-span-3 flex flex-col items-center justify-center text-gray-600 border border-dashed border-gray-700 rounded-lg">
                                         <ImageIcon size={24} className="mb-2"/>
                                         <span className="text-xs">No thumbnails generated yet</span>
                                     </div>
                                 )}
                             </div>
                        </div>

                        <div className="col-span-1 lg:col-span-2 flex justify-end gap-3 pt-4 border-t border-gray-700">
                             <button onClick={() => setUploadStep('select')} className="px-6 py-2 hover:bg-gray-800 rounded-md font-medium text-gray-300">Back</button>
                             <button 
                                onClick={handlePublish}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-md font-bold"
                             >
                                 Publish
                             </button>
                        </div>
                    </div>
                  )}
              </div>
          </div>
      )}

      {/* Create Playlist Modal */}
      {showPlaylistModal && (
          <div className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-4">
              <div className="bg-[#1f1f1f] w-full max-w-md rounded-xl border border-gray-700 shadow-2xl p-6 animate-scale-up">
                  <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-bold">Create New Playlist</h2>
                      <button onClick={() => setShowPlaylistModal(false)} className="hover:bg-gray-700 p-1 rounded-full"><X size={20}/></button>
                  </div>
                  <div className="space-y-4">
                      <div className="flex flex-col gap-2">
                          <label className="text-sm font-medium text-gray-300">Name</label>
                          <input 
                            type="text" 
                            placeholder="Enter playlist title..."
                            value={playlistName}
                            onChange={(e) => setPlaylistName(e.target.value)}
                            className="bg-[#121212] border border-gray-700 rounded-lg p-3 outline-none text-white focus:border-blue-500"
                          />
                      </div>
                      <div className="flex flex-col gap-2">
                          <label className="text-sm font-medium text-gray-300">Description (optional)</label>
                          <textarea 
                            rows={3}
                            placeholder="What is this playlist about?"
                            value={playlistDesc}
                            onChange={(e) => setPlaylistDesc(e.target.value)}
                            className="bg-[#121212] border border-gray-700 rounded-lg p-3 outline-none text-white focus:border-blue-500 resize-none"
                          />
                      </div>
                      <div className="flex flex-col gap-2">
                          <label className="text-sm font-medium text-gray-300">Visibility</label>
                          <select className="bg-[#121212] border border-gray-700 rounded-lg p-3 outline-none text-white">
                              <option>Public</option>
                              <option>Private</option>
                              <option>Unlisted</option>
                          </select>
                      </div>
                  </div>
                  <div className="mt-8 flex justify-end gap-3">
                      <button onClick={() => setShowPlaylistModal(false)} className="px-4 py-2 hover:text-white text-gray-400 font-medium">Cancel</button>
                      <button 
                        onClick={handleCreatePlaylist}
                        className="bg-white text-black hover:bg-gray-200 px-6 py-2 rounded-full font-bold"
                      >
                          Create
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default Dashboard;