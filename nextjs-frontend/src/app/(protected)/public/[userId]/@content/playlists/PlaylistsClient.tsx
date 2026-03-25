
"use client"
import React, { useEffect, useState } from 'react'
import { Props } from '../../types';
import { PlaylistType } from '@/types/types';
import { GetUserPlaylists } from '@/APIS';
import PublicPlaylistCard from '@/components/PublicPlaylistCard';
import { useParams } from 'next/navigation';

const PublicPlaylistClient = () => {
    const params = useParams();
    const userId = params.userId as string;
    console.log(userId)
    const [playlists, setPlaylists] = useState<PlaylistType[]>([])

    useEffect(() => {
        const getUserPlaylist = async (userId: string) => {
            try {
                const response = await GetUserPlaylists(userId);
                if (response?.statusCode === 200) {
                    setPlaylists(response?.data?.map((item: any) => ({ ...item, videos: item.videos.filter((subItem: any) => subItem !== null) })))
                } else {
                    console.log(" error while fetching the user playlist")
                }
            } catch (error) {
                console.log("error in get user playlist useffect: ", error);
            }
        }
        getUserPlaylist(userId)
    }, [userId]);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8 pb-10">
            {playlists
                .filter((playlist) => playlist?.videos?.length! > 0)
                .map((playlist) => (
                    <PublicPlaylistCard key={playlist?._id} playlist={playlist} />
                ))}
        </div>
    )
}

export default PublicPlaylistClient