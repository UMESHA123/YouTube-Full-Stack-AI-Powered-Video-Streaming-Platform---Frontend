"use client";
import React, { useEffect, useState } from 'react'
import { useYoutubecontext } from '@/contextAPI/YoutubeContextAPI'
import { CreatePlaylist, DeletePlaylist, GetUserPlaylists, UpdatePlaylist } from '@/APIS';
import { useParams } from 'next/navigation';
import { PlaylistType } from '@/types/types';
import { CreatePlaylistCard } from '@/components/CreatePlaylistCard';
import { PrivatePlaylistCard } from '@/components/PlaylistCard';

const PlaylistClient = () => {
  // const {playlists, setPlaylists} = useYoutubecontext()
  const params = useParams();
  const userId = params.userId as string;

  const [playlists, setPlaylists] = useState<PlaylistType[]>([])
  const [editPlaylistData, setEditPlaylistData] = useState<{ name: string, description: string }>({ name: "", description: "" })
  const [createPlaylistData, setCreatePlaylistData] = useState<{ name: string, description: string }>({
    name: "",
    description: ""
  })

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

  const updatePlaylistData = async (playlistId: string, setIsRenaming: React.Dispatch<React.SetStateAction<boolean>>) => {
    try {
      const response = await UpdatePlaylist(playlistId, { name: editPlaylistData?.name, description: editPlaylistData?.description });
      if (response?.statusCode === 200) {
        console.log("success: ", response);
        setPlaylists(playlists.map((playlist) => {
          if (playlist?._id === playlistId) {
            return {
              ...playlist,
              name: response?.data?.name,
              description: response?.data?.description
            }
          }
          return playlist;
        }))
        setIsRenaming(false)
      } else {
        console.log("error while updating the data")
      }
    } catch (error) {
      console.log("error while updating the playlist details: ", error);
    }
  }

  const deletePlaylist = async (playlistId: string) => {
    try {
      const response = await DeletePlaylist(playlistId)
      if (response.statusCode === 200) {
        console.log("success: ", response)
        setPlaylists(playlists.filter((playlist) => playlist?._id !== playlistId))
      } else {
        console.log("error while deleting");
      }
    } catch (error) {
      console.log("error while deleting a playlist: ", error);
    }
  }

  const createPlaylist = async () => {
    try {
      const response = await CreatePlaylist({ name: createPlaylistData?.name, description: createPlaylistData?.description })
      if (response?.statusCode === 200) {
        console.log("success: ", response);
        setPlaylists((prevPlayList) => [...prevPlayList, response?.data])
        alert("playlist created successfully");
      } else {
        alert("Something went wrong");
      }
    } catch (error) {
      console.log("error while creating a playlist: ", error);
    }
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8 pb-10">
      {userId && <CreatePlaylistCard createPlaylist={createPlaylist} createPlaylistData={createPlaylistData} setCreatePlaylistData={setCreatePlaylistData} />}
      {playlists
        .filter((playlist) => playlist?.videos?.length! > 0)
        .map((playlist) => (
          <PrivatePlaylistCard
            key={playlist._id}
            playlist={playlist}
            editPlaylistData={editPlaylistData}
            setEditPlaylistData={setEditPlaylistData}
            updatePlaylistData={updatePlaylistData}
            deletePlaylist={deletePlaylist}
          />
        ))}
    </div>
  )
}

export default PlaylistClient;