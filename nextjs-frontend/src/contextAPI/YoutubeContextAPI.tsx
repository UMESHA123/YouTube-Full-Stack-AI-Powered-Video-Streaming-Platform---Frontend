"use client"
import { LoginUserDetailsResponse, Notification, UploadState, Video, VideoPlaylist } from "@/types/types";
import React, { createContext, useContext, useEffect, useState } from "react";

type YoutubeContextType = {
    showToast: boolean;
    setShowToast: React.Dispatch<React.SetStateAction<boolean>>;
    toastMessage: string;
    setToastMessage: React.Dispatch<React.SetStateAction<string>>;
    videos: Video[];
    setVideos: React.Dispatch<React.SetStateAction<Video[]>>;
    uploadState: UploadState;
    setUploadState: React.Dispatch<React.SetStateAction<UploadState>>;
    isUploadModalOpen: boolean;
    setIsUploadModalOpen: React.Dispatch<React.SetStateAction<boolean | false>>;
    isSidebarOpen: boolean;
    setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean | false>>;
    loginUserDetails: LoginUserDetailsResponse,
    setLoginUserDetails: React.Dispatch<React.SetStateAction<LoginUserDetailsResponse>>
    videoPlaylist: VideoPlaylist[],
    setVideoPlaylist: React.Dispatch<React.SetStateAction<VideoPlaylist[]>>,
    isVideoPlaylistActive: boolean,
    setIsVideoPlaylistActive: React.Dispatch<React.SetStateAction<boolean>>,
    playlistLabel: string,
    setPlaylistLabel: React.Dispatch<React.SetStateAction<string>>,
    subscribeStatus: boolean | null,
    setSubscribeStatus: React.Dispatch<React.SetStateAction<boolean | null>>,
    searchQuery: string,
    setSearchQuery: React.Dispatch<React.SetStateAction<string>>,
    notifications: Notification[],
    setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>,
    selectedTopic: string,
    setSelectedTopic: React.Dispatch<React.SetStateAction<string>>,
    selectedTopicVideoIds: string[],
    setSelectedTopicVideoIds: React.Dispatch<React.SetStateAction<string[]>>,
    suggestedTopics: { id: string; label: string; videoIds: string[] }[],
    setSuggestedTopics: React.Dispatch<React.SetStateAction<{ id: string; label: string; videoIds: string[] }[]>>
}

const YoutubeContext = createContext<YoutubeContextType | undefined>({
    showToast: false,
    setShowToast: () => { },
    toastMessage: "",
    setToastMessage: () => { },
    videos: [],
    setVideos: () => { },
    uploadState: {
        isActive: false,
        progress: 0,
        isComplete: false,
        data: null
    },
    setUploadState: () => { },
    isUploadModalOpen: false,
    setIsUploadModalOpen: () => { },
    isSidebarOpen: false,
    setIsSidebarOpen: () => { },
    loginUserDetails: {
        _id: '',
        username: '',
        email: '',
        fullName: '',
        avatar: '',
        coverImage: '',
        createdAt: '',
        updatedAt: '',
        __v: 0,
    },
    setLoginUserDetails: () => { },
    videoPlaylist: [],
    setVideoPlaylist: () => {},
    isVideoPlaylistActive: false,
    setIsVideoPlaylistActive: () => {},
    playlistLabel: "",
    setPlaylistLabel: () => {},
    subscribeStatus: false, 
    setSubscribeStatus: () => {},
    searchQuery: "",
    setSearchQuery: () => {},
    notifications: [],
    setNotifications: () => {},
    selectedTopic: "",
    setSelectedTopic: () => {},
    selectedTopicVideoIds: [],
    setSelectedTopicVideoIds: () => {},
    suggestedTopics: [],
    setSuggestedTopics: () => {},
});

// Provider
export const YoutubeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [videos, setVideos] = useState<Video[]>([]);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [videoPlaylist, setVideoPlaylist] = useState<VideoPlaylist[]>([]);
    const [isVideoPlaylistActive, setIsVideoPlaylistActive] = useState(false);
    const [playlistLabel, setPlaylistLabel] = useState("");
    const [uploadState, setUploadState] = useState<UploadState>({
        isActive: false,
        progress: 0,
        isComplete: false,
        data: null
    });
    const [loginUserDetails, setLoginUserDetails] = useState<LoginUserDetailsResponse>({
        _id: '',
        username: '',
        email: '',
        fullName: '',
        avatar: '',
        coverImage: '',
        createdAt: '',
        updatedAt: '',
        __v: 0,
    })
    const [subscribeStatus, setSubscribeStatus] = useState<boolean | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [selectedTopic, setSelectedTopic] = useState<string>("");
    const [selectedTopicVideoIds, setSelectedTopicVideoIds] = useState<string[]>([]);
    const [suggestedTopics, setSuggestedTopics] = useState<{ id: string; label: string; videoIds: string[] }[]>([]);

    return (
        <YoutubeContext.Provider value={{
            showToast,
            setShowToast,
            toastMessage,
            setToastMessage,
            videos,
            setVideos,
            uploadState,
            setUploadState,
            isUploadModalOpen,
            setIsUploadModalOpen,
            isSidebarOpen,
            setIsSidebarOpen,
            loginUserDetails,
            setLoginUserDetails,
            videoPlaylist, 
            setVideoPlaylist,
            isVideoPlaylistActive, 
            setIsVideoPlaylistActive,
            playlistLabel,
            setPlaylistLabel,
            subscribeStatus, 
            setSubscribeStatus,
            searchQuery,
            setSearchQuery,
            notifications,
            setNotifications,
            selectedTopic,
            setSelectedTopic,
            selectedTopicVideoIds,
            setSelectedTopicVideoIds,
            suggestedTopics,
            setSuggestedTopics
        }}>
            {children}
        </YoutubeContext.Provider>
    );
};

// Custom hook to use context
export const useYoutubecontext = () => {
    const context = useContext(YoutubeContext);
    if (!context) {
        throw new Error("state must be used inside the youtube context api provider");
    }
    return context;
};
