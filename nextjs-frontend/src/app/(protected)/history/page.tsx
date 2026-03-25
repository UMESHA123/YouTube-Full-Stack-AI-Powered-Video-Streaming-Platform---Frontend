"use client"
import { ClearWatchHistory, GetWatchHistory, RemoveVideoFromWatchHistory } from '@/APIS';
import HistoryControls from '@/components/HistoryControls';
import HistoryItem from '@/components/HistoryItem';
import React, { useEffect, useState } from 'react'

const WatchHistory = () => {
    const [videos, setVideos] = useState<any[]>([]);

    useEffect(() => {
        const getUserWatchHistory = async () => {
            try {
                const response = await GetWatchHistory();
                if (response?.statusCode === 200) {
                    setVideos(() => [...response?.data])
                } else {
                    console.log("error while fetching the user watch history")
                }
            } catch (error) {
                console.log("error while fetching the user watch history: ", error);
            }
        }
        getUserWatchHistory();
    }, [])

    const removeVideoFromWatchHistoryHandler = async (videoId: string) => {
        try {
            const response = await RemoveVideoFromWatchHistory(videoId);
            if (response?.statusCode === 200) {
                setVideos([...videos.filter((video) => video?._id !== videoId)])
            } else {
                console.log("error while removing the video: ")
            }
        } catch (error) {
            console.log("removeVideoFromWatchHistoryHandler function: ", error);
        }
    }

    const clearAllWatchHistory = async () => {
        try {
            const response = await ClearWatchHistory();
            if (response?.statusCode === 200) {
                setVideos([])
            } else {
                console.log("error while clearing watch history the video: ")
            }
        } catch (error) {
            console.log("clearAllWatchHistory function: ", error);
        }
    }
    return (
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row">

            {/* Main History Feed */}
            <div className="flex-1">
                <h1 className="text-2xl font-bold mb-6 px-4 sm:px-0">Watch history</h1>

                <div className="flex flex-col">
                    <h2 className="text-base font-semibold mb-4 px-4 sm:px-0 mt-2">Today</h2>
                    <div className="flex flex-col px-2 sm:px-0">
                        {
                            videos?.length === 0 ? "Watch history is empty" : videos.map((video) => (
                                <HistoryItem key={video._id} video={video} removeVideoFromWatchHistoryHandler={removeVideoFromWatchHistoryHandler} />
                            ))
                        }
                    </div>
                </div>
            </div>

            {/* Right Side Controls (Desktop only) */}
            <HistoryControls clearAllWatchHistory={clearAllWatchHistory} />

        </div>
    )
}

export default WatchHistory