import { PlaylistType } from "@/types/types";
import { Check, Edit2, ListVideo, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const PrivatePlaylistCard = ({ playlist, editPlaylistData, setEditPlaylistData, updatePlaylistData, deletePlaylist }: { playlist: PlaylistType, editPlaylistData: { name: string; description: string }, setEditPlaylistData: React.Dispatch<React.SetStateAction<{ name: string; description: string }>>, updatePlaylistData: (playlistId: string, setIsRenaming: React.Dispatch<React.SetStateAction<boolean>>) => {} , deletePlaylist: (playlistId: string) => void}) => {
  const [isRenaming, setIsRenaming] = useState(false);
  const [newTitle, setNewTitle] = useState(playlist?.name);

  const router = useRouter()

  return (
    <div className="flex flex-col gap-2 group cursor-pointer" >
      {/* Thumbnail Container */}
      <div className="relative aspect-video rounded-xl overflow-hidden bg-[#2a2a2a]">
        <img
          src={playlist?.videos?.[0]?.thumbnail}
          alt={playlist?.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
        />
        {/* Overlay */}
        <div className="absolute top-0 right-0 bottom-0 w-[40%] bg-black/80 flex flex-col items-center justify-center text-white backdrop-blur-sm">
          <span className="text-lg font-bold mb-1">{playlist?.videos?.length}</span>
          <ListVideo className="w-6 h-6" />
        </div>

        {playlist?._id && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <button
               onClick={() => deletePlaylist?.(playlist._id)}
              className="p-2 bg-red-600 rounded-full hover:bg-red-700 text-white shadow-lg"
              title="Delete Playlist"
            >
              <Trash2 className="w-5 h-5" />
            </button>
            
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex gap-3 items-start mt-1">
        <div className="flex-1">
          {isRenaming ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={editPlaylistData?.name}
                onChange={(e) => setEditPlaylistData({...editPlaylistData, name: e.target.value})}
                className="bg-[#1f1f1f] border border-[#3f3f3f] rounded px-2 py-1 text-sm text-white w-full focus:outline-none focus:border-blue-500"
                autoFocus
              />
              <input
                type="text"
                value={editPlaylistData?.description}
                onChange={(e) => setEditPlaylistData({...editPlaylistData, description: e.target.value})}
                className="bg-[#1f1f1f] border border-[#3f3f3f] rounded px-2 py-1 text-sm text-white w-full focus:outline-none focus:border-blue-500"
                autoFocus
              />
              <button onClick={() => updatePlaylistData(playlist?._id, setIsRenaming)} className="text-green-500 hover:text-green-400">
                <Check className="w-4 h-4" />
              </button>
              <button  className="text-green-500 hover:text-green-400">
                 <X  onClick={() => setIsRenaming(false)} className="w-4 h-4" />
              </button>
             
              {/* <button
              //  onClick={() => onDelete?.(playlist.id)}
              className="p-2 bg-red-600 rounded-full hover:bg-red-700 text-white shadow-lg"
              title="Delete Playlist"
            >
              <X className="w-5 h-5" />
            </button> */}
            </div>
          ) : (
            <>
              <div className="flex justify-between items-start group/title">
                <h3 className="text-base font-bold line-clamp-2 leading-tight text-white group-hover:text-blue-400 transition-colors">
                  {playlist.name}
                </h3>

                {/* {playlist?._id && (
                <button 
                  onClick={() => setIsRenaming(true)}
                  className="p-1 text-[#aaaaaa] hover:text-white opacity-0 group-hover/title:opacity-100 transition-opacity"
                  title="Rename Playlist"
                >
                 
                </button>
              )}
               */}
                
              </div>
              <div className="flex justify-between items-start group/title">
                <h3 className="text-base line-clamp-2 leading-tight text-white transition-colors">
                  {playlist.description.substring(0, 30)+"..."}
                </h3>

                {playlist?._id && (
                  <button
                    onClick={() => setIsRenaming(true)}
                    className="p-1 text-[#aaaaaa] hover:text-white opacity-0 group-hover/title:opacity-100 transition-opacity"
                    title="Rename Playlist"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                )}

              </div></>

          )}

          <div onClick={() => router.push(`/playlist?list=PL&playlistId=${playlist?._id}`)} className="text-xs font-bold text-[#aaaaaa] mt-1 uppercase hover:text-white transition-colors">
            View full playlist
          </div>
        </div>
      </div>
    </div>
  );
};
