import { GetSubScribedChannels } from "@/APIS";
import { useYoutubecontext } from "@/contextAPI/YoutubeContextAPI";
import { SubscriptionType } from "@/types/types";
import { ChevronRight, Clock, History, Home, Library, Plus, ThumbsUp } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";

const SideBar = () => {
  const { setIsUploadModalOpen, isSidebarOpen, loginUserDetails } = useYoutubecontext();
  const pathname = usePathname();
  const [subscriptions, setSubscriptions] = React.useState<SubscriptionType[]>([]);
  const [showAllSubscriptions, setShowAllSubscriptions] = React.useState(false);

  type SubscribedChannelResponseItem = {
    channel: {
      _id: string;
      username: string;
      avatar: string;
    };
    subscribedAt: string;
  };

  const mainItems = [{ icon: <Home size={24} />, label: "Home", path: "/" }];
  const youItems = [
    { icon: <History size={24} />, label: "History", path: "/history" },
    { icon: <Clock size={24} />, label: "Watch later", path: "/playlist?list=WL" },
    { icon: <ThumbsUp size={24} />, label: "Liked videos", path: "/playlist?list=LL" },
  ];

  useEffect(() => {
    try {
      const fetchData = async () => {
      const data = await GetSubScribedChannels();
      console.log("Fetched data:", data);
      if(data?.statusCode === 200){
        const mappedSubscriptions = ((data?.data || []) as SubscribedChannelResponseItem[]).map((item) => ({
          _id: item?.channel?._id,
          username: item?.channel?.username,
          avatar: item?.channel?.avatar,
          subscribedAt: item?.subscribedAt,
        }));
        setSubscriptions(mappedSubscriptions);
      }else{
        console.log("error while fetching the user subscribed channels:")
      }
    };
    fetchData();
    } catch (error) {
        console.log("Error fetching user subscribed channels:", error);
    }
  }, [loginUserDetails?._id]);

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path.split("?")[0]);
  };

  const visibleSubscriptions = showAllSubscriptions
    ? subscriptions
    : subscriptions.slice(0, 10);

  if (!isSidebarOpen) {
    return (
      <aside className="fixed left-0 top-14 bottom-0 w-[72px] bg-[#0f0f0f] z-20 flex flex-col items-center py-4 gap-2 overflow-y-auto scrollbar-custom md:flex">
        {mainItems.map((item, index) => (
          <Link href={item.path} key={index}>
            <div
              className={`flex flex-col items-center gap-1 p-4 rounded-lg w-16 cursor-pointer transition-colors group ${isActive(item.path) ? "bg-[#272727] text-white" : "hover:bg-[#272727] text-gray-300"}`}
            >
              {item.icon}
              <span className="text-[10px] whitespace-nowrap overflow-hidden text-ellipsis w-full text-center">
                {item.label}
              </span>
            </div>
          </Link>
        ))}
        <button
          type="button"
          onClick={() => setIsUploadModalOpen(true)}
          className="flex flex-col items-center gap-1 p-4 rounded-lg hover:bg-[#272727] w-16 cursor-pointer transition-colors text-gray-300"
        >
          <Plus size={24} />
          <span className="text-[10px]">Create</span>
        </button>
        <div className="flex flex-col items-center gap-1 p-4 rounded-lg hover:bg-[#272727] w-16 cursor-pointer transition-colors text-gray-300">
          <Library size={24} />
          <span className="text-[10px]">You</span>
        </div>
      </aside>
    );
  }
  return (
    <aside className="fixed left-0 top-14 bottom-0 w-60 bg-[#0f0f0f] z-20 overflow-y-auto scrollbar-custom hover:overflow-y-auto pb-4 px-3 border-r border-[#272727] hidden md:block">
      <div className="py-3 border-b border-[#272727]">
        {mainItems.map((item, index) => (
          <Link href={item.path} key={index}>
            <div
              className={`flex items-center gap-5 px-3 py-2.5 rounded-lg cursor-pointer mb-1 ${isActive(item.path) ? "bg-[#272727] font-medium text-white" : "hover:bg-[#272727] text-gray-300"}`}
            >
              <div>{item.icon}</div>
              <span className="text-sm">{item.label}</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Create Action (Sidebar specific) */}
      <div className="py-3 border-b border-[#272727]">
        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#272727] text-left transition-colors group"
        >
          <div className="p-1.5 bg-[#272727] group-hover:bg-[#3f3f3f] rounded-full border border-[#3f3f3f]">
            <Plus size={20} className="text-white" />
          </div>
          <span className="text-sm font-medium">Create New Video</span>
        </button>
      </div>

      {/* You Section */}
      <div className="py-3 border-b border-[#272727]">
        <div className="flex items-center gap-2 px-3 py-1.5 mb-1 hover:bg-[#272727] rounded-lg cursor-pointer group">
          <span className="text-base font-semibold group-hover:text-white">You</span>
          <ChevronRight size={16} className="text-gray-400 group-hover:text-white" />
        </div>
        {youItems.map((item, index) => (
          <Link href={item.path} key={index}>
            <div className="flex items-center gap-5 px-3 py-2.5 rounded-lg hover:bg-[#272727] cursor-pointer">
              <div className="text-gray-300">{item.icon}</div>
              <span className="text-sm text-white">{item.label}</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Subscriptions */}
      <div className="py-3">
        <h3 className="px-3 py-1.5 text-base font-semibold mb-1">Subscriptions</h3>
        {visibleSubscriptions.map((sub: SubscriptionType) => (
          <Link href={`/public/${sub._id}/`} key={sub._id}>
            <div className="flex items-center gap-4 px-3 py-2.5 rounded-lg hover:bg-[#272727] cursor-pointer">
              <div className="relative">
                <img src={sub.avatar} alt={sub.username} className="w-6 h-6 rounded-full object-cover" />
              </div>
              <span className="text-sm text-gray-100 truncate flex-1">{sub.username}</span>
            </div>
          </Link>
        ))}
        {!showAllSubscriptions && subscriptions.length > 10 && (
          <button
            type="button"
            onClick={() => setShowAllSubscriptions(true)}
            className="w-full flex items-center gap-5 px-3 py-2.5 rounded-lg hover:bg-[#272727] cursor-pointer mt-1 text-gray-300"
          >
            <div className="w-6 flex justify-center">
              <ChevronRight size={20} />
            </div>
            <span className="text-sm">Show more</span>
          </button>
        )}
        <Link href="/subscribers">
          <div className="flex items-center gap-5 px-3 py-2.5 rounded-lg hover:bg-[#272727] cursor-pointer mt-1 text-gray-300">
            <div className="w-6 flex justify-center">
              <ChevronRight size={20} />
            </div>
            <span className="text-sm">Subscribers analytics</span>
          </div>
        </Link>
      </div>
    </aside>
  )
}

export default SideBar
