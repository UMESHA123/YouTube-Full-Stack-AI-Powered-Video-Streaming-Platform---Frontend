import React, { useState, useEffect, useRef } from 'react';
import { X, Image as ImageIcon, Upload } from 'lucide-react';

interface EditVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (title: string, description: string) => void;
  initialTitle: string;
  initialDescription: string;
}

export const EditVideoModal: React.FC<EditVideoModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialTitle,
  initialDescription,
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTitle(initialTitle);
    setDescription(initialDescription);
  }, [initialTitle, initialDescription, isOpen]);

 
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-[#1f1f1f] border border-[#303030] rounded-xl shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-[#303030]">
          <h2 className="text-xl font-semibold text-white">Edit Video Details</h2>
          <button 
            onClick={onClose} 
            className="p-1 text-gray-400 hover:text-white hover:bg-[#303030] rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 overflow-y-auto custom-scrollbar">
          
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#121212] border border-[#303030] text-white px-3 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all placeholder-gray-600"
              placeholder="Video title"
            />
          </div>
          
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              className="w-full bg-[#121212] border border-[#303030] text-white px-3 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all resize-none placeholder-gray-600"
              placeholder="Video description"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t border-[#303030] bg-[#1a1a1a] rounded-b-xl">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-[#303030] rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(title, description)}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};