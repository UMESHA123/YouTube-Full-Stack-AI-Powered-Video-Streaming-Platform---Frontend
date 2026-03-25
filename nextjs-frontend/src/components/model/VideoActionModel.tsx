"use client"
import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Globe, Lock, Plus, X } from 'lucide-react';
import { PlaylistType, VideoPlay } from '@/types/types';
import { createPortal } from 'react-dom';
import Toast from './Toast';
import { triggerToast } from '@/utills';
import { useYoutubecontext } from '@/contextAPI/YoutubeContextAPI';
import { AddVideoToPlaylist, CreatePlaylist, GetUserPlaylists } from '@/APIS';

interface AddVideoPlaylist {
    playlistId: string,
    videoId: string
}

const VideoActionModel = ({ isModalOpen, setIsModalOpen, isCreating, setIsCreating, video }: { isModalOpen: boolean, setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>, isCreating: boolean, setIsCreating: React.Dispatch<React.SetStateAction<boolean>>, video: VideoPlay }) => {

    const { setToastMessage, setShowToast, loginUserDetails } = useYoutubecontext()
    const [playlists, setPlaylists] = useState<PlaylistType[]>([])
    const [selectedPlaylists, setSelectedPlaylists] = useState<AddVideoPlaylist[]>([])
    const [createPlaylistData, setCreatePlaylistData] = useState<{ name: string, description: string }>({
        name: "",
        description: ""
    })

    const togglePlaylist = (playlistId: string, videoId: string) => {

        if (selectedPlaylists.some(
            (item) => item.playlistId === playlistId && item.videoId === videoId
        )) {
            setSelectedPlaylists([...selectedPlaylists.filter(item => item.playlistId !== playlistId && item.videoId !== videoId)])
        } else {
            setSelectedPlaylists([...selectedPlaylists, { playlistId, videoId }])
        }
    };

    const addToPlaylistHandler = async () => {
        try {
            const response = await Promise.all(selectedPlaylists.map((item: AddVideoPlaylist) => AddVideoToPlaylist(item.playlistId, item?.videoId)))
            console.log("response: ", response)
            if (response.every((item: any) => item?.statusCode === 200)) {
                triggerToast('all videos add to playlist', setToastMessage, setShowToast)
            } else {
                triggerToast('facing some issue.', setToastMessage, setShowToast)
            }
        } catch (error) {
            console.log("addToPlaylistHandler error: ", error);
        }
    }

    const createPlaylist = async () => {
        try {
            const response = await CreatePlaylist({ name: createPlaylistData?.name, description: createPlaylistData?.description })
            if (response?.statusCode === 200) {
                console.log("success: ", response);
                setPlaylists((prevPlayList) => [...prevPlayList, response?.data])
                triggerToast("playlist created successfully", setToastMessage, setShowToast);
                setCreatePlaylistData({ name: "", description: "" })
            } else {
                triggerToast("Something went wrong", setToastMessage, setShowToast);
            }
        } catch (error) {
            console.log("error while creating a playlist: ", error);
        }
    }

    useEffect(() => {
    const getUserPlaylist = async (userId: string) => {
      try {
        const response = await GetUserPlaylists(userId);
        if (response?.statusCode === 200) {
          setPlaylists([...response?.data])
        } else {
          console.log(" error while fetching the user playlist")
        }
      } catch (error) {
        console.log("error in get user playlist useffect: ", error);
      }
    }
    getUserPlaylist(loginUserDetails?._id!)
  }, [loginUserDetails?._id, playlists.length]);

    return (
        <React.Fragment>
            <AnimatePresence>
                {isModalOpen && (
                    <div style={{ color: 'white' }} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ type: "spring", duration: 0.3 }}
                            className="bg-[#212121] w-full max-w-[320px] rounded-2xl shadow-2xl border border-[#3f3f3f] overflow-hidden flex flex-col max-h-[80vh]"
                        >
                            {!isCreating ? (
                                /* LIST VIEW */
                                <>
                                    <div className="flex items-center justify-between px-6 py-4 border-b border-[#3f3f3f]">
                                        <h3 className="text-base font-medium">Save to...</h3>
                                        <button
                                            onClick={() => setIsModalOpen(false)}
                                            className="p-1 hover:bg-[#3f3f3f] rounded-full transition-colors"
                                        >
                                            <X size={20} className="text-gray-400" />
                                        </button>
                                    </div>

                                    <div className="py-2 overflow-y-auto custom-scrollbar flex-1">
                                        {playlists.map((playlist) => (
                                            <label
                                                key={playlist._id}
                                                className="flex items-center gap-4 px-6 py-3 hover:bg-[#3f3f3f] cursor-pointer transition-colors group select-none"
                                            >
                                                <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${selectedPlaylists.some((item) => item.playlistId === playlist?._id) ? 'bg-[#3ea6ff] border-[#3ea6ff]' : 'border-gray-500 group-hover:border-gray-400'}`}>
                                                    {/* {playlist.checked && <Check size={14} className="text-black stroke-[3]" />} */}
                                                    {selectedPlaylists.some((item) => item.playlistId === playlist?._id) && <Check size={14} className="text-black stroke-[3]" />}
                                                </div>
                                                <input
                                                    type="checkbox"
                                                    className="hidden"
                                                    checked={selectedPlaylists.some((item) => item.playlistId === playlist?._id)}
                                                    onChange={() => togglePlaylist(playlist._id, video?._id!)}
                                                />
                                                <span className="flex-1 text-sm truncate">{playlist.name}</span>
                                                {/* {playlist.isPrivate ? ( */}
                                                {false ? (
                                                    <Lock size={14} className="text-gray-500 shrink-0" />
                                                ) : (
                                                    <Globe size={14} className="text-gray-500 shrink-0" />
                                                )}
                                            </label>
                                        ))}
                                        <div className='px-6'>
                                            <button
                                                onClick={() => addToPlaylistHandler()}
                                                className="flex items-center gap-3 w-full py-2 hover:bg-[#3f3f3f] rounded-lg px-2 -ml-2 transition-colors text-white"
                                            >
                                                <Plus size={20} />
                                                <span className="text-sm font-medium">{`Add to playlist${selectedPlaylists.length > 1 ? "'s" : ""}`}</span>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="px-6 py-4 border-t border-[#3f3f3f]">
                                        <button
                                            onClick={() => setIsCreating(true)}
                                            className="flex items-center gap-3 w-full py-2 hover:bg-[#3f3f3f] rounded-lg px-2 -ml-2 transition-colors text-white"
                                        >
                                            <Plus size={20} />
                                            <span className="text-sm font-medium">Create new playlist</span>
                                        </button>
                                    </div>
                                </>
                            ) : (
                                /* CREATE FORM VIEW */
                                <>
                                    <div className="flex items-center justify-between px-6 py-4">
                                        <h3 className="text-base font-medium">New playlist</h3>
                                        <button
                                            onClick={() => setIsModalOpen(false)}
                                            className="p-1 hover:bg-[#3f3f3f] rounded-full transition-colors"
                                        >
                                            <X size={20} className="text-gray-400" />
                                        </button>
                                    </div>

                                    <div className="px-6 py-2 space-y-5 flex-1 overflow-y-auto">
                                        <div className="space-y-1.5 group">
                                            <label className="text-xs text-gray-400 group-focus-within:text-[#3ea6ff] transition-colors">Name</label>
                                            <input
                                                type="text"
                                                value={createPlaylistData?.name}
                                                onChange={(e) => setCreatePlaylistData({ ...createPlaylistData, name: e.target.value })}
                                                placeholder="Enter playlist title..."
                                                autoFocus
                                                className="w-full bg-[#121212] border-b border-[#3f3f3f] focus:border-[#3ea6ff] outline-none py-1 text-sm transition-colors placeholder:text-gray-600"
                                            />
                                            <div className="flex justify-end text-[10px] text-gray-500">
                                                {createPlaylistData?.name.length}/150
                                            </div>
                                        </div>
                                        <div className="space-y-1.5 group">
                                            <label className="text-xs text-gray-400 group-focus-within:text-[#3ea6ff] transition-colors">Description</label>
                                            <textarea
                                                value={createPlaylistData?.description}
                                                onChange={(e) => setCreatePlaylistData({ ...createPlaylistData, description: e.target.value })}
                                                placeholder="Enter description..."
                                                className="w-full bg-[#121212] border-b border-[#3f3f3f] focus:border-[#3ea6ff] outline-none py-1 text-sm transition-colors resize-none h-24 placeholder:text-gray-600"
                                            />
                                        </div>
                                    </div>

                                    <div className="px-6 py-4 flex items-center justify-end gap-2 mt-2">
                                        <button
                                            onClick={() => setIsCreating(false)}
                                            className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={createPlaylist}
                                            disabled={!createPlaylistData.name.trim() || !createPlaylistData?.description.trim()}
                                            className="px-6 py-2 text-sm font-medium bg-[#3ea6ff] text-black rounded-full hover:bg-[#65b8ff] disabled:bg-[#3f3f3f] disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
                                        >
                                            Create
                                        </button>
                                    </div>
                                </>
                            )}
                        </motion.div>

                        {/* Backdrop Click to Close */}
                        <div className="absolute inset-0 -z-10" onClick={() => setIsModalOpen(false)} />
                    </div>
                )}
            </AnimatePresence>
            {
                createPortal(Toast(), document.body)
            }
        </React.Fragment>
    )
}

export default VideoActionModel