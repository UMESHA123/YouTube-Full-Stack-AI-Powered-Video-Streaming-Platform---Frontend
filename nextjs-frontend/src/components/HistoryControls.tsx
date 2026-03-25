import { PauseCircle, Search, Settings, Trash2 } from 'lucide-react'
import React from 'react'

interface HistoryControllerProps {
    clearAllWatchHistory: () => {}
}

const HistoryControls: React.FC<HistoryControllerProps> = ({clearAllWatchHistory}) => {
  return (
    <div className="hidden lg:block w-[350px] flex-shrink-0 pl-8 ml-4">
      <div className="sticky top-20">
        <div className="relative mb-6">
          <input 
            type="text" 
            placeholder="Search watch history" 
            className="w-full bg-[#0f0f0f] border-b border-[#717171] text-white py-2 pl-8 focus:border-white outline-none placeholder-[#aaaaaa] text-sm"
          />
          <Search size={18} className="absolute left-0 top-2 text-[#aaaaaa]" />
        </div>

        <div className="flex flex-col space-y-2">
            <div onClick={() => clearAllWatchHistory()} className="group flex items-center px-4 py-2 rounded-full cursor-pointer hover:bg-[#272727] text-white">
                <Trash2 size={20} className="mr-3 text-[#aaaaaa] group-hover:text-white" />
                <span className="text-sm font-medium">Clear all watch history</span>
            </div>
            <div className="group flex items-center px-4 py-2 rounded-full cursor-pointer hover:bg-[#272727] text-white">
                <PauseCircle size={20} className="mr-3 text-[#aaaaaa] group-hover:text-white" />
                <span className="text-sm font-medium">Pause watch history</span>
            </div>
             <div className="group flex items-center px-4 py-2 rounded-full cursor-pointer hover:bg-[#272727] text-white">
                <Settings size={20} className="mr-3 text-[#aaaaaa] group-hover:text-white" />
                <span className="text-sm font-medium">Manage all history</span>
            </div>
        </div>

        <div className="mt-8 px-4">
            <a href="#" className="text-blue-400 text-sm hover:text-blue-300 font-medium">Comments</a>
            <div className="mt-2 text-[#aaaaaa] text-xs">
                <p>See comments on videos you've watched.</p>
            </div>
            
            <a href="#" className="block mt-4 text-blue-400 text-sm hover:text-blue-300 font-medium">Community posts</a>
             <div className="mt-2 text-[#aaaaaa] text-xs">
                <p>See posts you've liked or voted on.</p>
            </div>
             <a href="#" className="block mt-4 text-blue-400 text-sm hover:text-blue-300 font-medium">Live chat</a>
             <div className="mt-2 text-[#aaaaaa] text-xs">
                <p>See your live chat messages.</p>
            </div>
        </div>
      </div>
    </div>
  )
}

export default HistoryControls