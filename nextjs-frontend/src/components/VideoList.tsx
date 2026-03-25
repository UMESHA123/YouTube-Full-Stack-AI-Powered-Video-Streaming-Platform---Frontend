import React, { useState } from 'react';
import { Globe, Lock, Edit2, Play, Trash2, Pencil } from 'lucide-react';
import { useYoutubecontext } from '@/contextAPI/YoutubeContextAPI';
import { formatDate, formatDuration, formatNumber } from '@/utills';
import { EditVideoModal } from './model/EditVideoModal';
import { WatchVideoModal } from './model/WatchVideoModal';
import { EditThumbnailModal } from './model/EditThumbnailmodal';

interface Props {
  videos: any[];
  onDelete: (id: string) => void;
  onToggleVisibility: (id: string) => void;
  onEdit: (id: string, title: string, description: string) => void;
  onThumbnailEdit: (id: string, thumbnail: File) => void;
}
export const VideoList: React.FC<Props> = ({ videos, onDelete, onToggleVisibility, onEdit, onThumbnailEdit }) => {
    
    const [editingVideo, setEditingVideo] = useState<any | null>(null);
    const [editingThumbnail, setEditingThumbnail] = useState<any | null>(null)
//   const [watchingVideo, setWatchingVideo] = useState<Video | null>(null);
    const [currentVideo, setCurrentVideo] = useState<any>();
  const handleSaveEdit = (title: string, description: string) => {
    if (editingVideo) {
      onEdit(editingVideo._id, title, description);
      setEditingVideo(null);
    }
  };
    
  const handleThumbnailSave = (thumbnail: File) => {
    if(editingThumbnail){
      onThumbnailEdit(editingThumbnail?._id, thumbnail)
      setEditingThumbnail(null);
    }
  }
  return (
    <>
      <div className="bg-[#1f1f1f] rounded-xl border border-[#303030] shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-[#303030] flex justify-between items-center bg-[#1f1f1f]">
          <h2 className="text-lg font-semibold text-white">Recent Videos</h2>
          <button className="text-sm font-medium text-blue-400 hover:text-blue-300">See all</button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#1a1a1a] text-xs uppercase text-gray-400 font-semibold border-b border-[#303030]">
                <th className="px-6 py-3 min-w-[300px]">Video</th>
                <th className="px-6 py-3 w-32">Visibility</th>
                <th className="px-6 py-3 w-32">Date</th>
                <th className="px-6 py-3 w-24 text-right">Views</th>
                <th className="px-6 py-3 w-24 text-right">Comments</th>
                <th className="px-6 py-3 w-32 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#303030]">
              {videos.map((video) => (
                <tr key={video._id} className="group hover:bg-[#272727] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex gap-4">
                      {/* Thumbnail Container */}
                      <div className="relative shrink-0 w-32 h-20 bg-[#121212] rounded-lg overflow-hidden border border-[#303030] group-hover:border-[#404040] transition-colors">
                        <img 
                          src={video.thumbnail} 
                          alt={video.title} 
                          className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                        />
                        <div className="absolute bottom-1 right-1 px-1 py-0.5 bg-black/80 text-white text-[10px] font-medium rounded">
                          {formatDuration(video.duration)}
                        </div>
                        
                        {/* Play Overlay (Watch) */}
                        <div 
                          onClick={() => setCurrentVideo!(video)}
                          className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer z-10"
                        >
                          <Play className="w-8 h-8 text-white fill-white drop-shadow-lg" />
                        </div>

                        {/* Edit Thumbnail Button */}
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingThumbnail(video);
                          }}
                          className="absolute top-1 right-1 p-1 bg-black/70 hover:bg-blue-600 text-white rounded opacity-0 group-hover:opacity-100 transition-all z-20"
                          title="Edit thumbnail"
                        >
                          <Pencil className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="flex flex-col justify-center min-w-0">
                        <h3 
                          className="text-sm font-medium text-gray-100 truncate pr-4 cursor-pointer hover:text-blue-400 transition-colors" 
                          title={video.title}
                          onClick={() => setCurrentVideo!(video)}
                        >
                          {video.title}
                        </h3>
                        <p className="text-xs text-gray-400 mt-1 line-clamp-2" title={video.description}>
                          {video.description}
                        </p>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-1.5">
                            {video.isPublished ? (
                                <Globe className="w-3.5 h-3.5 text-green-400" />
                            ) : (
                                <Lock className="w-3.5 h-3.5 text-gray-400" />
                            )}
                            <span className={`text-xs font-medium ${video.isPublished ? 'text-green-400' : 'text-gray-400'}`}>
                                {video.isPublished ? 'Public' : 'Private'}
                            </span>
                        </div>
                        <button
                          onClick={() => onToggleVisibility(video._id)}
                          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#1f1f1f] ${
                            video.isPublished ? 'bg-green-600' : 'bg-gray-600'
                          }`}
                          title={`Toggle to ${video.isPublished ? 'Private' : 'Public'}`}
                        >
                          <span
                            className={`${
                              video.isPublished ? 'translate-x-4.5' : 'translate-x-0.5'
                            } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                          />
                        </button>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-200">{formatDate(video.createdAt)}</span>
                      <span className="text-xs text-gray-500">Published</span>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <span className="text-sm text-gray-200">{formatNumber(video.views)}</span>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <span className="text-sm text-gray-500">-</span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                        <button 
                            onClick={() => setEditingVideo(video)}
                            className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-900/20 rounded-lg transition-all"
                            title="Edit details"
                        >
                            <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                            onClick={() => onDelete(video._id)}
                            className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-all"
                            title="Delete video"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <EditVideoModal
        isOpen={!!editingVideo}
        onClose={() => setEditingVideo(null)}
        onSave={handleSaveEdit}
        initialTitle={editingVideo?.title || ''}
        initialDescription={editingVideo?.description || ''}
      />

      {/* isThumbnailOpen,
  onThumbnailClose,
  onThumbnailSave, */}
      <EditThumbnailModal
        isThumbnailOpen={!!editingThumbnail}
        onThumbnailClose={() => setEditingThumbnail!(null)}
        onThumbnailSave={handleThumbnailSave}
        initialThumbnail={editingThumbnail?.thumbnail}
      />
      <WatchVideoModal
        isOpen={!!currentVideo}
        onClose={() => setCurrentVideo!(null)}
        videoUrl={currentVideo?.videoFile || ''}
        title={currentVideo?.title || ''}
      />
    </>
  );
};