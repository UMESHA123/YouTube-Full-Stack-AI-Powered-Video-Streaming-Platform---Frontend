"use client"
import { getUserById, ToggleSubscription } from "@/APIS";
import { useYoutubecontext } from "@/contextAPI/YoutubeContextAPI";
import { TabItem } from "@/types/types";
import { handleGetSubscribedStatus } from "@/utills";
import { ChevronRight, Search } from "lucide-react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface UserType {
  _id: string;
  username: string;
  email: string;
  fullName: string;
  avatar: string;
  coverImage: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  subscribersCount?: number;
  videosCount?: number;
}

export default function UserLayout({
  children,
  content,
}: {
  children: React.ReactNode;
  content: React.ReactNode;
}) {
  const params = useParams();
  const userId = params.userId as string;
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<UserType>({
    _id: '',
    username: '',
    email: '',
    fullName: '',
    avatar: '',
    coverImage: '',
    createdAt: '',
    updatedAt: '',
    __v: 0,
    subscribersCount: 0,
    videosCount: 0,
  });

  const tabs: TabItem[] = [
    // { id: 'home', label: 'Home' },
    { id: 'videos', label: 'videos' },
    // { id: 'shorts', label: 'Shorts' },
    { id: 'playlists', label: 'playlists' },
    { id: 'community', label: 'tweet' },
  ];

  const { subscribeStatus, setSubscribeStatus } = useYoutubecontext();
  useEffect(() => {
    const getUserByIdData = async () => {
      try {
        const response = await getUserById(userId);
        console.log("response: ", response.data)
        if (response?.statusCode === 200) {
          console.log("response: --->", response.data)
          setUser(response?.data);
        } else {
          console.log("error while fetching the user by id:");
        }
      } catch (error) {
        console.log("error in getuserbyiddata: ", error);
      }
    }
    getUserByIdData()
  }, [userId])

  console.log("user", userId)

   const handleToggleSubscription = async (channelId: string) => {
          try {
              const response = await ToggleSubscription(channelId);
              if(response?.statusCode === 201 && response?.data?.isSubscribed===true) {
                  console.log("Subscription toggled successfully");
                  handleGetSubscribedStatus(channelId, setSubscribeStatus)
              }else{
                  console.log("Error in toggling subscription");
                  handleGetSubscribedStatus(channelId, setSubscribeStatus);
              }
          } catch (error) {
              console.log("error while toggling the subscription: ", error);
          }
      }
      
      
      useEffect(() => {
          if (user?._id) {
              handleGetSubscribedStatus(user._id, setSubscribeStatus);
          }
      }, [setSubscribeStatus, user?._id]);
  return (

    <>{
      user ?
        <div className="max-w-[1500px] mx-auto">
          <div className="flex flex-col">
            {/* Banner */}
            <div className="w-full aspect-[6/1] md:aspect-[5/1] xl:aspect-[6/1] overflow-hidden rounded-xl mb-6">
              <img src={user.coverImage || user?.avatar} alt="Channel Banner" className="w-full h-full object-cover" />
            </div>

            {/* Info Section */}
            <div className="flex flex-col md:flex-row gap-6 px-2 md:px-0 mb-4">
              <div className="flex-shrink-0 mx-auto md:mx-0">
                <img
                  src={user.avatar}
                  alt={user.fullName}
                  className="w-32 h-32 rounded-full object-cover"
                />
              </div>

              <div className="flex flex-col flex-1 items-center md:items-start text-center md:text-left">
                <h1 className="text-2xl md:text-4xl font-bold mb-2">{user.fullName}</h1>
                <div className="flex flex-wrap justify-center md:justify-start gap-2 text-[#aaaaaa] text-sm mb-3">
                  <span>{user?.subscribersCount ?? 0} subscribers</span>
                  <span>•</span>
                  <span>{user?.videosCount ?? 0} videos</span>
                </div>

                <div className="flex items-center gap-1 text-[#aaaaaa] text-sm mb-4 cursor-pointer hover:text-white max-w-2xl">
                  <p className="line-clamp-1">{user.username}</p>
                  <ChevronRight className="w-4 h-4" />
                </div>

                <div className="flex gap-3">
                  <button onClick={() => handleToggleSubscription(user._id)} className="px-6 py-2 bg-white text-black font-medium rounded-full hover:bg-[#d9d9d9] transition-colors">
                    {subscribeStatus ? 'Unsubscribe' : 'Subscribe'}
                  </button>
                  <button className="px-4 py-2 bg-[#272727] text-white font-medium rounded-full hover:bg-[#3f3f3f] border border-[#3f3f3f] transition-colors">
                    Join
                  </button>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="sticky top-14 bg-[#0f0f0f] z-30 pt-2 border-b border-[#3f3f3f] mt-2">
              <div className="flex items-center gap-1 md:gap-6 overflow-x-auto no-scrollbar">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => router.push(`/public/${userId}/${tab?.label}`)}
                    className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-[3px] transition-colors ${pathname.split('/').includes(tab?.label)
                      ? 'text-white border-white'
                      : 'text-[#aaaaaa] border-transparent hover:text-white'
                      }`}
                  >
                    {tab.label}
                  </button>
                ))}
                <div className="flex-1"></div>
                <button className="p-2 hover:bg-[#272727] rounded-full mr-2">
                  <Search className="w-5 h-5 text-[#aaaaaa]" />
                </button>
              </div>
            </div>
          </div>
          <div className="mt-6">{content ?? children}</div>
        </div> : "Loading...."
    }</>
  );
}
