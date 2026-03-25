"use client"
import { PlusSquare } from "lucide-react";
import { useState } from "react";

export const CreatePlaylistCard = ({ createPlaylist, createPlaylistData, setCreatePlaylistData } : {createPlaylist : () => {}, createPlaylistData: {name: string, description: string},setCreatePlaylistData: React.Dispatch<React.SetStateAction<{name: string, description: string}>>}) => {
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = () => {
    if (createPlaylist?.name.trim()) {
      createPlaylist();
      setCreatePlaylistData({name: "", description: ""})
      setIsCreating(false);
    }
  };

  if (isCreating) {
    return (
      <div className="flex flex-col gap-2 h-full">
        <div className="aspect-video rounded-xl bg-[#1f1f1f] border border-[#3f3f3f] p-4 flex flex-col justify-center items-center gap-3">
          <h4 className="font-bold text-white">New Playlist</h4>
          <input
            type="text"
            placeholder="Playlist name"
            value={createPlaylistData?.name}
            onChange={(e) => setCreatePlaylistData({...createPlaylistData, name:e.target.value})}
            className="w-full bg-[#0f0f0f] border border-[#3f3f3f] rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
          />
          <input
            type="text"
            placeholder="Playlist description"
            value={createPlaylistData?.description}
            onChange={(e) => setCreatePlaylistData({...createPlaylistData, description:e.target.value})}
            className="w-full bg-[#0f0f0f] border border-[#3f3f3f] rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
          />
          <div className="flex gap-2 w-full">
            <button
              onClick={() => setIsCreating(false)}
              className="flex-1 py-1.5 text-xs text-[#aaaaaa] hover:text-white bg-[#272727] rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              className="flex-1 py-1.5 text-xs text-white bg-blue-600 hover:bg-blue-500 rounded font-medium"
            >
              Create
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={() => setIsCreating(true)}
      className="flex flex-col gap-2 cursor-pointer group h-full"
    >
      <div className="aspect-video rounded-xl overflow-hidden bg-[#1f1f1f] border-2 border-dashed border-[#3f3f3f] group-hover:border-blue-500 transition-colors flex flex-col items-center justify-center text-[#aaaaaa] group-hover:text-blue-500">
        <PlusSquare className="w-10 h-10 mb-2" />
        <span className="font-medium">Create Playlist</span>
      </div>
    </div>
  );
};
