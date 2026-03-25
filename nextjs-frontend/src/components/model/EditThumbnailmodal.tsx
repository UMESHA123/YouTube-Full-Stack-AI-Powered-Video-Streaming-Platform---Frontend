import React, { useState, useEffect, useRef } from 'react';
import { X, Image as ImageIcon, Upload } from 'lucide-react';

interface EditVideoModalProps {
  isThumbnailOpen: boolean;
  onThumbnailClose: () => void;
  onThumbnailSave: (thumbnail: File) => void;
  initialThumbnail: string;
}

export const EditThumbnailModal: React.FC<EditVideoModalProps> = ({
  isThumbnailOpen,
  onThumbnailClose,
  onThumbnailSave,
  initialThumbnail,
}) => {
  
//   const [thumbnail, setThumbnail] = useState(initialThumbnail);
  const [thumbnail, setThumbnail] = useState<File|null>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [thumbnailPreview, setThmbnailPreview] = useState(initialThumbnail)
  // console.log(initialThumbnail)

    useEffect(() => {
      setThmbnailPreview(initialThumbnail);
      setThumbnail(null)
    }, [initialThumbnail]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setThmbnailPreview(objectUrl)
      setThumbnail(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };
 useEffect(() => {
  console.log("thumbnail: ", thumbnail)
 })
  if (!isThumbnailOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-[#1f1f1f] border border-[#303030] rounded-xl shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-[#303030]">
          <h2 className="text-xl font-semibold text-white">Edit Video Details</h2>
          <button 
            onClick={onThumbnailClose} 
            className="p-1 text-gray-400 hover:text-white hover:bg-[#303030] rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 overflow-y-auto custom-scrollbar">
          {/* Thumbnail Preview & Edit */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">Thumbnail</label>
            <div className="flex gap-4 items-start">
               {/* Clickable Preview Area */}
               <div 
                  className="relative w-40 aspect-video bg-[#121212] rounded-lg overflow-hidden border border-[#303030] shrink-0 group cursor-pointer"
                  onClick={triggerFileInput}
               >
                  <img src={thumbnailPreview} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity text-white">
                      <Upload className="w-6 h-6 mb-1" />
                      <span className="text-[10px] font-medium">Change</span>
                  </div>
               </div>

               {/* Upload Controls */}
               <div className="flex-1">
                 <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                 />
                 <div className="flex flex-col gap-3">
                    <button
                        onClick={triggerFileInput}
                        className="flex items-center justify-center gap-2 w-full bg-[#272727] hover:bg-[#323232] text-white px-4 py-2.5 rounded-lg border border-[#303030] transition-colors text-sm font-medium group"
                    >
                        <ImageIcon className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                        Select from computer
                    </button>
                    <p className="text-[10px] text-gray-500 leading-relaxed">
                        Select an image file (JPG, PNG) from your device.
                        <br />
                        <span className="text-gray-600">Recommended resolution: 1280x720 (16:9).</span>
                    </p>
                 </div>
               </div>
            </div>
          </div>

        </div>

        <div className="flex justify-end gap-3 p-6 border-t border-[#303030] bg-[#1a1a1a] rounded-b-xl">
          <button
            onClick={onThumbnailClose}
            className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-[#303030] rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onThumbnailSave(thumbnail!)}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};