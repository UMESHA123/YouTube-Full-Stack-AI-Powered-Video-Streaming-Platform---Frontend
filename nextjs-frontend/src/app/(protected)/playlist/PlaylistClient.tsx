"use client"

import { DeleteLikedVideo, GetLikedVideos, GetPlaylistById, GetUserPlaylists, getWatchLaterVideos } from '@/APIS';
import PlaylistView from '@/components/PlaylistView';
import { useYoutubecontext } from '@/contextAPI/YoutubeContextAPI';
import { PlaylistType } from '@/types/types';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const PlaylistClient =  () => {

    const searchParams = useSearchParams();
    const list = searchParams.get('list');

    const { videoPlaylist, setVideoPlaylist, loginUserDetails } = useYoutubecontext()
    const [loading, setLoading] = useState(false);
    const [playlistName, setPlaylistName] = useState<string>("")

    useEffect(() => {
        const getLikedVideosHandler = async () => {
            try {
                setLoading(true)
                const response = await GetLikedVideos();
                if (response?.statusCode === 200) {
                    setVideoPlaylist([...response?.data])
                }
            } catch (error) {
                console.log("getLikedVideosHandler error: ", error)
            }finally{
                setLoading(false)
            }
        }

        const getAllWatchLaterVideos = async () => {
            try {
                setLoading(true);
                const response = await getWatchLaterVideos();
                if (response.statusCode === 200) {
                    setVideoPlaylist(() => [...response?.data])
                } else {
                    console.log("getAllWatchLaterVideos error from response")
                }
            } catch (error) {
                console.log("getAllWatchLaterVideos error: ", error);
            }finally{
                setLoading(false)
            }
        }
        const getAllPlaylistVideo = async () => {
            try {
                const playlistId = searchParams.get('playlistId') as string;
                setLoading(true);
                const response = await GetPlaylistById(playlistId);
                if(response?.statusCode === 200){
                    setPlaylistName(response?.data?.playlistName)
                    setVideoPlaylist(() => [...response?.data?.videos]);
                }else{
                    console.log("getAllPlaylistVideo error from response")
                }
            } catch (error) {
                console.log("getAllPlaylistVideo error: ", error);
            }finally{
                setLoading(false);
            }
        }

        list === "LL" ? getLikedVideosHandler() : list === "WL" ? getAllWatchLaterVideos() : list === "PL" ? getAllPlaylistVideo() : ""
    }, [loginUserDetails?._id, list ]);

    
    return (
        <React.Fragment>
            {
                (list === "WL" ? <PlaylistView videos={videoPlaylist} playlistType={"Watch later"} loading={loading} /> : list === "LL" ? <PlaylistView videos={videoPlaylist} playlistType={'Liked videos'} loading={loading}/> : list==='PL'? <PlaylistView videos={videoPlaylist} playlistType={playlistName} loading={loading} />:"")
            }
        </React.Fragment>
    )
}



export default PlaylistClient