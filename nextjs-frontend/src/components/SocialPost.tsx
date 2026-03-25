import { SocialTweet } from '@/types/types'
import { timeAgo } from '@/utills'
import { Bot } from 'lucide-react'
import React from 'react'

type SocialPostType = {
    tweet: SocialTweet
}

const SocialPost: React.FC<SocialPostType> = ({tweet}) => {
  return (
    <div className="border border-[#333] rounded-xl p-4 mb-6 bg-[#1a1a1a]">
        <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
                <img src={tweet?.owner?.avatar} className="w-6 h-6 rounded-full" alt={tweet?.owner?.fullName || "no user avatar found"} />
                <span className="text-xs font-bold text-white">{tweet?.owner?.username || tweet?.owner?.fullName}</span>
                <span className="text-[10px] text-gray-500">• {timeAgo(tweet?.createdAt)}</span>
            </div>
            <div className="text-blue-400">
                <Bot className="w-4 h-4" /> {/* Using Bot as twitter/social icon placeholder */}
            </div>
        </div>
        <p className="text-sm text-gray-200 mb-2">{tweet?.content}</p>
    </div>
  )
}

export default SocialPost