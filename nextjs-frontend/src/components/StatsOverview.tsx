import { DashboardData } from '@/types/types';
import { formatNumber } from '@/utills';
import { Eye, ThumbsUp, TrendingUp, Users } from 'lucide-react';
import React from 'react'

interface Props {
  data: DashboardData;
}


const StatsOverview : React.FC<Props> = ({ data }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div className="bg-[#1f1f1f] p-6 rounded-xl border border-[#303030] shadow-sm hover:border-[#404040] transition-colors">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-400">Total Subscribers</h3>
          <div className="p-2 bg-blue-900/20 text-blue-400 rounded-lg">
            <Users className="w-5 h-5" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">{formatNumber(data?.totalSubscribers)}</span>
        </div>
        <p className="text-xs text-gray-500 mt-1">Lifetime</p>
      </div>

      <div className="bg-[#1f1f1f] p-6 rounded-xl border border-[#303030] shadow-sm hover:border-[#404040] transition-colors">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-400">Total Views</h3>
           <div className="p-2 bg-green-900/20 text-green-400 rounded-lg">
            <Eye className="w-5 h-5" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">{formatNumber(data?.totalVideoViews)}</span>
        </div>
         <p className="text-xs text-gray-500 mt-1">Across all videos</p>
      </div>

      <div className="bg-[#1f1f1f] p-6 rounded-xl border border-[#303030] shadow-sm hover:border-[#404040] transition-colors">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-400">Total Likes</h3>
           <div className="p-2 bg-red-900/20 text-red-400 rounded-lg">
            <ThumbsUp className="w-5 h-5" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">{formatNumber(data?.totalLikes)}</span>
        </div>
         <p className="text-xs text-gray-500 mt-1">Lifetime engagement</p>
      </div>

      <div className="bg-[#1f1f1f] p-6 rounded-xl border border-[#303030] shadow-sm hover:border-[#404040] transition-colors">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-400">Total Videos</h3>
           <div className="p-2 bg-purple-900/20 text-purple-400 rounded-lg">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">{data?.totalVideos}</span>
        </div>
         <p className="text-xs text-gray-500 mt-1">Videos uploaded</p>
      </div>
    </div>
  )
}

export default StatsOverview