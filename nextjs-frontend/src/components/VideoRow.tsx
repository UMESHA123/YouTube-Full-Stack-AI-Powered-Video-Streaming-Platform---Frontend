"use client"
import { DeleteLikedVideo, removeVideoFromWatchLater } from '@/APIS'
import { useYoutubecontext } from '@/contextAPI/YoutubeContextAPI'
import { VideoPlaylist } from '@/types/types'
import { timeAgo, triggerToast } from '@/utills'
import { MoreVertical, Play, X } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import React from 'react'

type VideoRowType = {
    video: VideoPlaylist;
    index: number;

}

const VideoRow: React.FC<VideoRowType> = ({ video, index }) => {
    const router = useRouter()
    const searchParams = useSearchParams();
    const list = searchParams.get('list');
    const { setVideoPlaylist, videoPlaylist, setToastMessage, setShowToast } = useYoutubecontext()

    const onDeleteHandler = async (videoId: string) => {
        if (list === 'WL') {
            try {
                const response = await removeVideoFromWatchLater(videoId);
                if (response?.statusCode === 200) {
                    triggerToast('video removed', setToastMessage, setShowToast)
                    setVideoPlaylist(videoPlaylist.filter(video => video?._id !== videoId))
                } else {
                    triggerToast("Failed to delete video.", setToastMessage, setShowToast)
                }
            } catch (error) {
                console.log('onDeleteHandler WL error: ', error)
            }
        }
        if (list === 'LL') {
            try {
                const response: any = await DeleteLikedVideo(videoId)
                console.log(": response", response)
                if (response?.data?.statusCode === 200) {
                    setVideoPlaylist(videoPlaylist.filter(video => video?._id !== videoId))
                    triggerToast("Video deleted successful.", setToastMessage, setShowToast)
                } else {
                    console.log("error while deleting the liked video");
                    triggerToast("Failed to delete video.", setToastMessage, setShowToast)
                }
            } catch (error) {
                console.log("onDeleteHandler LL error: ", error);
            }
        }
    }
    return (
        <div className="group flex gap-2 md:gap-4 p-2 rounded-xl hover:bg-[#272727] cursor-pointer transition-colors w-full">
            {/* Index / Play Icon */}
            <div onClick={() => router.push(`/watch?v=${video?._id}`)} className="hidden md:flex w-6 items-center justify-center text-gray-400 text-sm font-medium shrink-0">
                <span className="group-hover:hidden">{index + 1}</span>
                <Play size={14} className="hidden group-hover:block text-white" fill="currentColor" />
            </div>

            {/* Thumbnail */}
            <div onClick={() => router.push(`/watch?v=${video?._id}`)} className="relative w-40 h-[90px] md:w-40 md:h-[90px] shrink-0 rounded-lg overflow-hidden bg-gray-800">
                <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs font-medium px-1 rounded">
                    {video.duration}
                </div>
            </div>

            {/* Details */}
            <div onClick={() => router.push(`/watch?v=${video?._id}`)} className="flex flex-col justify-center flex-1 min-w-0">
                <h3 className="text-white text-sm md:text-base font-semibold line-clamp-2 leading-tight mb-1">
                    {video.title}
                </h3>
                <div className="flex flex-col md:flex-row md:items-center text-xs md:text-sm text-gray-400 gap-1">
                    <span className="hover:text-white transition-colors">{video.owner?.fullName}</span>
                    <span className="hidden md:inline">•</span>
                    <span className="line-clamp-1">{video.views} views • {timeAgo(video?.createdAt)}</span>
                </div>
            </div>

            {/* Actions */}
            {/* <div className="flex items-center justify-center w-10 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-2 hover:bg-gray-600 rounded-full text-white">
                    <MoreVertical size={20} />
                </button>
            </div> */}
            <div className="flex flex-col items-center justify-center w-10 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => onDeleteHandler(video?._id)} className="p-2 text-white hover:bg-[#3f3f3f] rounded-full" title="Remove from watch history">
                    <X size={20} />
                </button>
                <button className="p-2 text-white hover:bg-[#3f3f3f] rounded-full" title="More actions">
                    <MoreVertical size={20} />
                </button>
            </div>
        </div>
    )
}

export default VideoRow