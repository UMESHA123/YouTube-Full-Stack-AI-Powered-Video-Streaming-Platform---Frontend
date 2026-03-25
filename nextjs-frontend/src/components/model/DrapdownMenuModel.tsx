"use client"
import React from 'react'
import { motion, AnimatePresence } from 'framer-motion';
import { addVideoToWatchLater } from '@/APIS';
import { triggerToast } from '@/utills';
import { Clock, ListPlus } from 'lucide-react';
import { VideoPlay } from '@/types/types';
import { useYoutubecontext } from '@/contextAPI/YoutubeContextAPI';

const DrapdownMenuModel = ({ isMenuOpen, handleOpenPlaylistModal, video }: { isMenuOpen: boolean, handleOpenPlaylistModal: () => void, video: VideoPlay }) => {

    const { setToastMessage, setShowToast } = useYoutubecontext()

    const handleWatchLater = async () => {
        try {
            const response = await addVideoToWatchLater(video?._id!);
            if (response?.statusCode === 200) {
                triggerToast('Added to Watch Later', setToastMessage, setShowToast);
            } else {
                triggerToast('Error while adding a video to watch-latter', setToastMessage, setShowToast);
            }
        } catch (error) {
            console.log("handleWatchLater error: ", error);
        }
    };

    
    return (
        <div>
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        transition={{ duration: 0.1 }}
                        className="absolute right-0 top-12 w-56 bg-[#282828] rounded-xl shadow-xl border border-[#3f3f3f] overflow-hidden z-50 py-2"
                        style={{ transformOrigin: 'top right' }}
                    >
                        <button
                            onClick={handleWatchLater}
                            className="w-full text-left px-4 py-3 hover:bg-[#3f3f3f] flex items-center gap-3 transition-colors"
                        >
                            <Clock size={20} className="text-white" />
                            <span className="text-sm font-medium">Watch later</span>
                        </button>
                        <button
                            onClick={() => handleOpenPlaylistModal()}
                            className="w-full text-left px-4 py-3 hover:bg-[#3f3f3f] flex items-center gap-3 transition-colors"
                        >
                            <ListPlus size={20} className="text-white" />
                            <span className="text-sm font-medium">Save to playlist</span>
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default DrapdownMenuModel