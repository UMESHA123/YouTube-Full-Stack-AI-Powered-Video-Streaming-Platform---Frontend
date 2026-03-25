"use client"
import { ToggleSubscription, UpdateAavatar, UpdateCoverImage } from '@/APIS';
import { useYoutubecontext } from '@/contextAPI/YoutubeContextAPI';
import { Channel, TabItem } from '@/types/types';
import { Camera, Check, ChevronRight, Edit2, Search, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import Toast from './model/Toast';
import { createPortal } from 'react-dom';
import { handleGetSubscribedStatus, triggerToast } from '@/utills';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';

interface ChannelHeaderProps {
    onTabChange: (id: string) => void;
    isOwner: boolean;
    onUpdateChannel: (updates: Partial<Channel>) => void;
}

const PrivateChannelHeader: React.FC<ChannelHeaderProps> = ({
    onTabChange,
    isOwner,
    onUpdateChannel,
}) => {

    const router = useRouter()
    const pathname = usePathname()
    const bannerInputRef = useRef<HTMLInputElement>(null);
    const avatarInputRef = useRef<HTMLInputElement>(null);
    const { loginUserDetails:user, setLoginUserDetails, setToastMessage, setShowToast, subscribeStatus, setSubscribeStatus } = useYoutubecontext()
    // Local state for inline editing
    const [editingField, setEditingField] = useState<'name' | 'handle' | 'description' | null>(null);
    const [tempValue, setTempValue] = useState('');
    const [coverImage, setCoverImage] = useState<File | null>(null)
    const [avatarImage, setAvatarImage] = useState<File | null>(null)
    const [coverImageURL, setCoverImageURL] = useState<string>('')
    const [avatarImageURL, setAvatarImageURL] = useState<string>('null')
    const [channelId, setChannelId] = useState();

    const tabs: TabItem[] = [
        { id: 'videos', label: 'videos' },
        { id: 'playlists', label: 'playlist' },
        { id: 'community', label: 'tweet' },
    ];



    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'banner' | 'avatar') => {
        const file = e.target.files?.[0];

        if (file) {
            const imageUrl = URL.createObjectURL(file);
            if (field === 'banner') {
                console.log("file: ", file)
                try {
                    const response = await UpdateCoverImage(file)
                    if (response?.statusCode === 200) {
                        setLoginUserDetails(response?.data)
                        triggerToast("Cover image update successful", setToastMessage, setShowToast)
                    } else {
                        triggerToast("Something went wrong", setToastMessage, setShowToast);
                    }
                } catch (error) {
                    console.log("cover image error: ", error);
                }
            } else {
                try {
                    const response = await UpdateAavatar(file)
                    if (response?.statusCode === 200) {
                        setLoginUserDetails(response?.data)
                        triggerToast("Avatar update successful", setToastMessage, setShowToast)
                    } else {
                        triggerToast("Something went wrong", setToastMessage, setShowToast);
                    }
                } catch (error) {
                    console.log("avatar error: ", error);
                }
            }
        }
    };

    const startEditing = (field: 'name' | 'handle' | 'description', currentValue: string) => {
        setEditingField(field);
        setTempValue(currentValue);
    };

    const cancelEditing = () => {
        setEditingField(null);
        setTempValue('');
    };

    const saveEditing = () => {
        if (editingField) {
            onUpdateChannel({ [editingField]: tempValue });
            setEditingField(null);
        }
    };

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
        }, [user?._id]);

    return (
        <div className="flex flex-col">
            {/* Banner */}
            <div className="relative w-full aspect-6/1 md:aspect-5/1 xl:aspect-6/1 overflow-hidden rounded-xl mb-6 group">
                <img src={user?.coverImage || user?.avatar} alt="Channel Banner" className="w-full h-full object-cover" />
                {isOwner && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        onClick={() => bannerInputRef.current?.click()}>
                        <div className="bg-black/60 p-3 rounded-full text-white flex items-center gap-2 backdrop-blur-sm">
                            <Camera className="w-6 h-6" />
                            <span className="font-medium">Edit Banner</span>
                        </div>
                        <input
                            type="file"

                            ref={bannerInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, 'banner')}
                        />
                    </div>
                )}
            </div>

            {/* Info Section */}
            <div className="flex flex-col md:flex-row gap-6 px-2 md:px-0 mb-4">
                {/* Avatar */}
                <div className="shrink-0 mx-auto md:mx-0 relative group">
                    <img
                        src={user?.avatar}
                        alt={user?.fullName}
                        className="w-32 h-32 rounded-full object-cover border-4 border-[#0f0f0f]"
                    />
                    {isOwner && (
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer rounded-full overflow-hidden"
                            onClick={() => avatarInputRef.current?.click()}>
                            <div className="bg-black/60 p-3 rounded-full text-white backdrop-blur-sm">
                                <Camera className="w-6 h-6" />
                            </div>
                            <input
                                type="file"
                                ref={avatarInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => handleImageUpload(e, 'avatar')}
                            />
                        </div>
                    )}
                </div>

                <div className="flex flex-col flex-1 items-center md:items-start text-center md:text-left min-w-0">

                    {/* Name Editing */}
                    {editingField === 'name' ? (
                        <div className="flex items-center gap-2 mb-2 w-full max-w-md">
                            <input
                                type="text"
                                value={tempValue}
                                onChange={(e) => setTempValue(e.target.value)}
                                className="text-2xl md:text-4xl font-bold bg-[#1f1f1f] border border-[#3f3f3f] rounded px-2 w-full text-white focus:outline-none focus:border-blue-500"
                                autoFocus
                            />
                            <button onClick={saveEditing} className="p-2 text-green-500 hover:bg-[#272727] rounded-full"><Check className="w-6 h-6" /></button>
                            <button onClick={cancelEditing} className="p-2 text-red-500 hover:bg-[#272727] rounded-full"><X className="w-6 h-6" /></button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 mb-2 group">
                            <h1 className="text-2xl md:text-4xl font-bold">{user?.fullName}</h1>
                            {isOwner && (
                                <button
                                    onClick={() => startEditing('name', user?.fullName)}
                                    className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-[#272727] rounded-full text-[#aaaaaa] hover:text-white transition-all"
                                    title="Edit Name"
                                >
                                    <Edit2 className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                    )}

                    {/* Metadata */}
                    <div className="flex flex-wrap justify-center md:justify-start gap-2 text-[#aaaaaa] text-sm mb-3 items-center group">

                        {editingField === 'handle' ? (
                            <div className="flex items-center gap-1">
                                <input
                                    type="text"
                                    value={tempValue}
                                    onChange={(e) => setTempValue(e.target.value)}
                                    className="bg-[#1f1f1f] border border-[#3f3f3f] rounded px-2 text-sm text-white focus:outline-none focus:border-blue-500 w-32"
                                />
                                <button onClick={saveEditing} className="text-green-500"><Check className="w-4 h-4" /></button>
                                <button onClick={cancelEditing} className="text-red-500"><X className="w-4 h-4" /></button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-1">
                                {/* <span className="font-medium text-white md:text-[#aaaaaa]">{channel.handle}</span> */}
                                {isOwner && (
                                    <button
                                        //   onClick={() => startEditing('handle', channel.handle)}
                                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-[#272727] rounded-full text-[#aaaaaa] hover:text-white transition-opacity"
                                    >
                                        <Edit2 className="w-3 h-3" />
                                    </button>
                                )}
                            </div>
                        )}

                        {/* <span>•</span>
                            <span>{channel.subscribers} subscribers</span>
                            <span>•</span> */}
                        {/* <span>{channel.videosCount} videos</span> */}
                    </div>

                    {/* Description Editing */}
                    {editingField === 'description' ? (
                        <div className="w-full max-w-2xl mb-4">
                            <textarea
                                value={tempValue}
                                onChange={(e) => setTempValue(e.target.value)}
                                className="w-full bg-[#1f1f1f] border border-[#3f3f3f] rounded p-2 text-sm text-white focus:outline-none focus:border-blue-500 min-h-[80px] resize-none mb-2"
                            />
                            <div className="flex gap-2 justify-end">
                                <button onClick={cancelEditing} className="px-3 py-1 text-xs font-medium hover:bg-[#272727] rounded-full">Cancel</button>
                                <button onClick={saveEditing} className="px-3 py-1 text-xs font-bold bg-blue-600 text-black hover:bg-blue-500 rounded-full">Save</button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-start gap-2 mb-4 group w-full max-w-2xl">
                            <div className="flex items-center gap-1 text-[#aaaaaa] text-sm cursor-pointer hover:text-white flex-1">
                                <p className="line-clamp-2">{user?.fullName}</p>
                                <ChevronRight className="w-4 h-4 flex-shrink-0" />
                            </div>
                            {isOwner && (
                                <button
                                    onClick={() => startEditing('description', user?.username)}
                                    className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-[#272727] rounded-full text-[#aaaaaa] hover:text-white transition-opacity"
                                >
                                    <Edit2 className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    )}

                    <div className="flex gap-3">
                        {false ? (
                            <button className="px-4 py-2 bg-[#272727] text-white font-medium rounded-full hover:bg-[#3f3f3f] border border-[#3f3f3f] transition-colors flex items-center gap-2">
                                <span>Analytics</span>
                            </button>
                        ) : (
                            <button onClick={() => handleToggleSubscription(user?._id) } className="px-4 py-2 bg-white text-black font-medium rounded-full hover:bg-gray-200 transition-colors">
                                {subscribeStatus ? 'Subscribed' : 'Subscribe'}
                            </button>
                        )}

                        {isOwner && (
                            <button className="px-4 py-2 bg-[#272727] text-white font-medium rounded-full hover:bg-[#3f3f3f] border border-[#3f3f3f] transition-colors">
                                Manage Videos
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="sticky top-14 bg-[#0f0f0f] z-10 pt-2 border-b border-[#3f3f3f] mt-2">
                <div className="flex items-center gap-1 md:gap-6 overflow-x-auto no-scrollbar">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => router.push(`/channel/${user?._id}/${tab?.label}`)}
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
            {
                createPortal(Toast(), document.body)
            }
        </div>
    );
};

export default PrivateChannelHeader;