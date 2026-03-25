import React from 'react';
import { X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
  title: string;
}

export const WatchVideoModal: React.FC<Props> = ({ isOpen, onClose, videoUrl, title }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-5xl bg-[#0f0f0f] border border-[#303030] rounded-xl shadow-2xl overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-[#303030] bg-[#1a1a1a]">
          <h3 className="text-lg font-medium text-white truncate pr-4">{title}</h3>
          <button 
            onClick={onClose} 
            className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-[#303030] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="relative aspect-video bg-black group">
          <video 
            src={videoUrl} 
            controls 
            autoPlay 
            className="w-full h-full outline-none" 
          />
        </div>
      </div>
    </div>
  );
};