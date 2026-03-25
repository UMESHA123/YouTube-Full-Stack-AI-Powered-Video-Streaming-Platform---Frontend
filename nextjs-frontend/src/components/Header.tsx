"use client";
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Menu, Search, Mic, Bell, Plus, Radio } from 'lucide-react';
import { useYoutubecontext } from '@/contextAPI/YoutubeContextAPI';
import { usePathname, useRouter } from 'next/navigation';
import UploadModel from './model/UploadModel';
// import ProfileDrapdown from './model/ProfileDrapdown';
import ProfileDrapdown from './model/ProfileDrapdown';
import { Notification } from '@/types/types';
import { logInUserDetails } from '@/utills';
import { deleteNotification, getMyNotifications, getMyNotificationsPagination, markAllNotificationsAsRead, markNotificationAsRead, StartLiveStream } from '@/APIS';
import NotificationDropdown from './NotificationDropDown';

type SpeechRecognitionAlternativeLike = {
  transcript: string;
};

type SpeechRecognitionResultLike = {
  0: SpeechRecognitionAlternativeLike;
};

type SpeechRecognitionResultListLike = {
  0: SpeechRecognitionResultLike;
};

type SpeechRecognitionEventLike = {
  results: SpeechRecognitionResultListLike;
};

type SpeechRecognitionErrorEventLike = {
  error: string;
};

type BrowserSpeechRecognition = {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

type BrowserSpeechRecognitionConstructor = new () => BrowserSpeechRecognition;

declare global {
  interface Window {
    SpeechRecognition?: BrowserSpeechRecognitionConstructor;
    webkitSpeechRecognition?: BrowserSpeechRecognitionConstructor;
  }
}

// interface HeaderProps {
//   toggleSidebar: () => void;
// }

const Header = () => {
  const { searchQuery, setSearchQuery, isUploadModalOpen, setIsUploadModalOpen, setIsSidebarOpen, isSidebarOpen, loginUserDetails, setLoginUserDetails, notifications, setNotifications } = useYoutubecontext();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [notificationPage, setNotificationPage] = useState(1);
  const [notificationTotalPages, setNotificationTotalPages] = useState(1);
  const [isNotificationsLoading, setIsNotificationsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<BrowserSpeechRecognition | null>(null);

  const router = useRouter();
  const pathname = usePathname()
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const profileTriggerRef = useRef<HTMLButtonElement>(null);
  const notifDropdownRef = useRef<HTMLDivElement>(null);
  const notifTriggerRef = useRef<HTMLButtonElement>(null);

  const notificationCount = notifications.filter((n) => !n.isRead).length;

  const toggleProfile = useCallback(() => {
    setIsProfileOpen(prev => !prev);
  }, []);

  const toggleDropdown = useCallback(() => {
    setIsDropdownOpen(prev => !prev);
    if (isProfileOpen) setIsProfileOpen(false);
  }, [isProfileOpen]);



  useEffect(() => {
    console.log("call")
    const getCurrentUser = async () => {
      await logInUserDetails(setLoginUserDetails)
    }
    if (pathname !== "/signin") {
      getCurrentUser();
    }
  }, [pathname, setLoginUserDetails])

  useEffect(() => {
    if (!loginUserDetails?._id) return;
    const getMyNotificationsHandler = async () => {
      try {
        const response = await getMyNotifications();
        if (response?.statusCode === 200) {
          setNotifications([...(response.data || [])]);
        }
      } catch (error) {
        console.log("error while fetching the my notification", error);
      }
    };
    getMyNotificationsHandler();
  }, [loginUserDetails?._id, setNotifications]);

  const fetchNotificationsPage = useCallback(
    async (page: number) => {
      try {
        setIsNotificationsLoading(true);
        const response = await getMyNotificationsPagination(page, 5);
        const payload = response?.data;
        if (response?.statusCode === 200 && payload) {
          setNotifications([...(payload.notifications || [])]);
          setNotificationPage(payload.page || page);
          setNotificationTotalPages(payload.totalPages || 1);
        }
      } catch (error) {
        console.log("error while fetching notification page:", error);
      } finally {
        setIsNotificationsLoading(false);
      }
    },
    [setNotifications]
  );

  useEffect(() => {
    if (!isDropdownOpen || !loginUserDetails?._id) return;
    fetchNotificationsPage(1);
  }, [fetchNotificationsPage, isDropdownOpen, loginUserDetails?._id]);

  const markNotificationAsReadHandler = async (notificationId: string) => {
    try {
      const response = await markNotificationAsRead(notificationId);
      if (response.statusCode === 200) {
        console.log("Marked notification as read successfully:", response.data);
        // Update the local state to reflect the change
        setNotifications(prev => prev.map(notification => notification?._id === notificationId ? { ...notification, isRead: true } : notification));
      } else {
        console.log("Failed to mark notification as read:", response.data);
      }
    } catch (error) {
      console.log("error while marking notification as read: ", error);
    }
  }

  const markAllNotificationsAsReadHandler = async () => {
    try {
      const response = await markAllNotificationsAsRead();
      if (response.statusCode === 200) {
        console.log("Marked all notifications as read successfully:", response.data);
        // Update the local state to reflect the change
        setNotifications(prev => prev.map(notification => ({ ...notification, isRead: true })));
      } else {
        console.log("Failed to mark all notifications as read:", response.data);
      }
    } catch (error) {
      console.log("error while marking all notifications as read: ", error);
    }
  }

  const deleteNotificationHandler = async (notificationId: string) => {
    try {
      const response = await deleteNotification(notificationId);
      if (response.statusCode === 200) {
        console.log("Deleted notification successfully:", response.data);
        // Update the local state to reflect the change
        setNotifications(prev => prev.filter(notification => notification._id !== notificationId));
      } else {
        console.log("Failed to delete notification:", response.data);
      }
    } catch (error) {
      console.log("error while deleting notification: ", error);
    }
  }
  const closeDropdown = useCallback(() => {
    setIsDropdownOpen(false);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        notifDropdownRef.current &&
        !notifDropdownRef.current.contains(target) &&
        notifTriggerRef.current &&
        !notifTriggerRef.current.contains(target)
      ) {
        closeDropdown();
      }
      if (
        isProfileOpen &&
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(target) &&
        profileTriggerRef.current &&
        !profileTriggerRef.current.contains(target)
      ) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [closeDropdown, isProfileOpen]);

  const onNotificationClickHandler = (notification: Notification) => {
    // Handle notification click
    console.log("Notification clicked:", notification);
    markNotificationAsReadHandler(notification._id);
    if (notification.type === "LIVE_STREAM_STARTED") {
      if (notification?.video?._id) {
        router.push(`/watch?v=${notification.video._id}`);
        return;
      }
      if (notification.streamUrl) {
        window.open(notification.streamUrl, "_blank", "noopener,noreferrer");
        return;
      }
      router.push(`/channel/${notification?.channel?._id}`);
      return;
    }
    if (notification?.video?._id) {
      router.push(`/watch?v=${notification.video._id}`);
    }
  };

  const startLiveStreamHandler = async () => {
    const title = window.prompt("Enter live stream title");
    if (!title || !title.trim()) return;
    const streamUrl = window.prompt("Enter stream URL (required)");
    if (!streamUrl || !streamUrl.trim()) return;
    const description = window.prompt("Enter live description (optional)") || "";
    try {
      await StartLiveStream({
        title: title.trim(),
        streamUrl: streamUrl.trim(),
        description: description.trim(),
      });
    } catch (error) {
      console.log("error while starting live stream:", error);
    }
  };

  const handleVoiceSearch = useCallback(() => {
    const SpeechRecognitionApi = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionApi) {
      console.log("Voice search is not supported in this browser.");
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      return;
    }

    const recognition = new SpeechRecognitionApi();
    recognitionRef.current = recognition;
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript?.trim() || "";
      if (!transcript) return;
      setSearchQuery(transcript);
    };

    recognition.onerror = (event) => {
      console.log("Voice search error:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    setIsListening(true);
    recognition.start();
  }, [isListening, setSearchQuery]);

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
    };
  }, []);


  return (
    <React.Fragment>
      <header className="fixed top-0 left-0 right-0 h-14 bg-[#0f0f0f] flex items-center justify-between px-4 z-30">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-[#272727] rounded-full transition-colors"
          >
            <Menu className="text-white" size={24} />
          </button>
          <div onClick={() => router.push("/")} className="flex items-center gap-1 cursor-pointer">
            <div className="w-13 h-8 mx-2 bg-red-600 rounded-lg flex items-center justify-center">
              <div className="w-0 h-0 border-t-[5px] border-t-transparent border-l-[10px] border-l-white border-b-[5px] border-b-transparent ml-1"></div>
            </div>
            <span className="text-xl font-bold tracking-tight text-white font-sans hidden sm:block">
              YouTube
            </span>
          </div>
        </div>

        <div className="hidden md:flex flex-1 max-w-[720px] items-center ml-10">
          <div className="flex flex-1 items-center">
            <div className="flex flex-1 items-center bg-[#121212] border border-[#303030] rounded-l-full px-4 h-10 focus-within:border-blue-500 ml-8">
              <input
                type="text"
                placeholder="Search"
                aria-label="Search videos"
                className="bg-transparent text-white w-full outline-none text-base font-normal placeholder-gray-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.currentTarget.blur();
                    setSearchQuery((q) => q.trim());
                  }
                }}
              />
            </div>
            <button
              type="button"
              aria-label="Search"
              className="bg-[#222222] border border-l-0 border-[#303030] h-10 px-5 rounded-r-full hover:bg-[#2d2d2d] transition-colors"
              onClick={() => setSearchQuery((q) => q.trim())}
            >
              <Search size={20} className="text-gray-300" />
            </button>
          </div>
          <button
            className={`p-2 rounded-full ml-4 transition-colors ${isListening ? "bg-red-700 hover:bg-red-600" : "bg-[#181818] hover:bg-[#303030]"}`}
            onClick={handleVoiceSearch}
            aria-label={isListening ? "Stop voice search" : "Start voice search"}
            title={isListening ? "Listening..." : "Voice search"}
          >
            <Mic size={20} />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button className="md:hidden p-2 hover:bg-[#272727] rounded-full">
            <Search size={24} />
          </button>
          <button
            className={`md:hidden p-2 rounded-full transition-colors ${isListening ? "bg-red-700 hover:bg-red-600" : "hover:bg-[#272727]"}`}
            onClick={handleVoiceSearch}
            aria-label={isListening ? "Stop voice search" : "Start voice search"}
            title={isListening ? "Listening..." : "Voice search"}
          >
            <Mic size={20} />
          </button>

          {loginUserDetails?._id && <button
            onClick={() => {
              console.log("clicked")
              setIsUploadModalOpen(true)
            }}
            className="flex items-center gap-2 bg-[#272727] hover:bg-[#3f3f3f] text-white px-3 py-1.5 rounded-full font-medium text-sm transition-colors border border-transparent hover:border-[#4f4f4f]"
          >
            <Plus size={20} />
            <span className="hidden sm:inline">Create</span>
          </button>}

          {loginUserDetails?._id && <button
            onClick={startLiveStreamHandler}
            className="flex items-center gap-2 bg-red-700 hover:bg-red-600 text-white px-3 py-1.5 rounded-full font-medium text-sm transition-colors border border-red-500"
          >
            <Radio size={18} />
            <span className="hidden sm:inline">Go Live</span>
          </button>}

          {/* Dropdown Container */}
          <div className="relative">
            <button
              ref={notifTriggerRef}
              onClick={toggleDropdown}
              className={`
              p-2 rounded-full relative transition-colors
              ${isDropdownOpen ? 'bg-gray-200 dark:bg-[#272727]' : 'hover:bg-gray-100 dark:hover:bg-[#272727]'}
              text-gray-800 dark:text-white
            `}
            >
              <Bell size={20} />
              {notificationCount > 0 && (
                <span className="absolute top-0.5 right-0.5 min-w-[18px] h-[18px] bg-[#cc0000] border-2 border-white dark:border-[#0f0f0f] text-white text-[10px] font-bold rounded-full flex items-center justify-center px-0.5">
                  {notificationCount > 9 ? '9+' : notificationCount}
                </span>
              )}
            </button>
            <div ref={notifDropdownRef}>
              <NotificationDropdown
                notifications={isNotificationsLoading ? [] : notifications}
                isOpen={isDropdownOpen}
                onClose={closeDropdown}
                onNotificationClick={onNotificationClickHandler}
                onDeleteNotification={deleteNotificationHandler}
                onMarkAllAsRead={markAllNotificationsAsReadHandler}
                currentPage={notificationPage}
                totalPages={notificationTotalPages}
                onPageChange={fetchNotificationsPage}
              />
            </div>
          </div>

          {loginUserDetails?._id && <button className="ml-1 w-8 h-8 rounded-full overflow-hidden bg-gray-700" ref={profileTriggerRef}
            onClick={toggleProfile}>
            <img src={loginUserDetails?.avatar} alt="User" className="w-full h-full object-cover" />
          </button>}
          <div ref={profileDropdownRef}>
            <ProfileDrapdown
              isOpen={isProfileOpen}
            />
          </div>
        </div>

      </header>
      {
        isUploadModalOpen && <UploadModel
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
        />
      }
    </React.Fragment>
  )
}

export default Header
