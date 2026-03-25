"use client"
import { PlaylistType } from '@/types/types'
import { ListVideo } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'

const PublicPlaylistCard = ({playlist}: {playlist: PlaylistType}) => {
  const router = useRouter()
  return (
    <div key={playlist?._id} className="flex flex-col gap-2 group cursor-pointer" >
      {/* Thumbnail Container */}
      <div className="relative aspect-video rounded-xl overflow-hidden bg-[#2a2a2a]">
        <img
          src={playlist?.videos![0]?.thumbnail!}
          alt={playlist.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
        />
        {/* Overlay */}
        <div className="absolute top-0 right-0 bottom-0 w-[40%] bg-black/80 flex flex-col items-center justify-center text-white backdrop-blur-sm">
          <span className="text-lg font-bold mb-1">{playlist?.videos!.length}</span>
          <ListVideo className="w-6 h-6" />
        </div>
      </div>

      {/* Info */}
      <div className="flex gap-3 items-start mt-1">
        <div className="flex-1">
          <h3 className="text-base font-bold line-clamp-2 leading-tight text-white group-hover:text-blue-400 transition-colors">
            {playlist.name}
          </h3>
          <div onClick={() => router.push(`/playlist?list=PL&playlistId=${playlist?._id}`)} className="text-xs font-bold text-[#aaaaaa] mt-1 uppercase hover:text-white transition-colors">
            View full playlist
          </div>
        </div>
      </div>
    </div>
  )
}

export default PublicPlaylistCard