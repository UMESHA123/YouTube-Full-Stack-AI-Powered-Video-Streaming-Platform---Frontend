'use client'
import React, { useEffect, useState } from 'react'
import { LogOut, LayoutDashboard, Settings, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { LogoutUser } from '@/APIS';
import Toast from './Toast';
import { useYoutubecontext } from '@/contextAPI/YoutubeContextAPI';
import { createPortal } from 'react-dom';
import { logInUserDetails, triggerToast } from '@/utills';
import { LoginUserDetailsResponse } from '@/types/types';
import { deleteCookie } from '@/utills/actions';


interface ProfileDrapdownProps {
    isOpen: boolean;
}

const ProfileDrapdown = ({ isOpen }: ProfileDrapdownProps) => {
    const router = useRouter()
    const { setShowToast, setToastMessage } = useYoutubecontext()
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


    const logOutHandler = async () => {
        
        try {
            const response = await LogoutUser();

            if (response?.statusCode === 200) {
                triggerToast("Logout successful!", setToastMessage, setShowToast);
                deleteCookie()
                // router.replace("/signin")
                router.refresh()
            } else {
                triggerToast("Logout failed!", setToastMessage, setShowToast);
            }
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    useEffect(() => {
        const getCurrentUser = async () => {
            await logInUserDetails(setLoginUserDetails)
        }
        getCurrentUser()
    }, [])

    if (!isOpen) return null;

    return (
        <React.Fragment>
            <div className="absolute top-12 right-0 w-72 bg-white dark:bg-[#282828] border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl z-40 overflow-hidden flex flex-col origin-top-right animate-in fade-in zoom-in-95 duration-200">

                {/* User Info Header */}
                <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center gap-4 bg-gray-50 dark:bg-[#202020]">
                    <div className="w-10 h-10 rounded-full bg-purple-600 shrink-0 flex items-center justify-center text-white font-bold text-lg overflow-hidden shadow-sm">
                        {loginUserDetails?.avatar ? <img src={loginUserDetails?.avatar} alt={loginUserDetails?.fullName} className="w-full h-full object-cover" /> : loginUserDetails?.username.charAt(0)}
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className="text-base font-semibold text-gray-900 dark:text-white truncate">{loginUserDetails?.username}</span>
                        {/* <span className="text-sm text-gray-500 dark:text-gray-400 truncate">{user.handle}</span> */}
                    </div>
                </div>

                {/* Menu Items */}
                <div className="py-2">
                    <button
                        onClick={() => router.push(`/dashboard`)}
                        className="w-full text-left px-5 py-3 flex items-center gap-4 hover:bg-gray-100 dark:hover:bg-[#3e3e3e] text-gray-700 dark:text-gray-200 transition-colors group"
                    >
                        <LayoutDashboard size={20} className="text-gray-500 dark:text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400" />
                        <span className="text-sm font-medium">Dashboard</span>
                    </button>

                    <button
                        onClick={() => router.push(`/channel/${loginUserDetails?._id}`)}
                        className="w-full text-left px-5 py-3 flex items-center gap-4 hover:bg-gray-100 dark:hover:bg-[#3e3e3e] text-gray-700 dark:text-gray-200 transition-colors group"
                    >
                        <User size={20} className="text-gray-500 dark:text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400" />
                        <span className="text-sm font-medium">Your Channel</span>
                    </button>

                    <div className="my-1 border-t border-gray-100 dark:border-gray-700"></div>

                    <button
                        className="w-full text-left px-5 py-3 flex items-center gap-4 hover:bg-gray-100 dark:hover:bg-[#3e3e3e] text-gray-700 dark:text-gray-200 transition-colors group"
                    >
                        <Settings size={20} className="text-gray-500 dark:text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400" />
                        <span className="text-sm font-medium">Settings</span>
                    </button>

                    <div className="my-1 border-t border-gray-100 dark:border-gray-700"></div>

                    <button
                        onClick={logOutHandler}
                        className="w-full text-left px-5 py-3 flex items-center gap-4 hover:bg-gray-100 dark:hover:bg-[#3e3e3e] text-gray-700 dark:text-gray-200 transition-colors group"
                    >
                        <LogOut size={20} className="text-gray-500 dark:text-gray-400 group-hover:text-red-500 dark:group-hover:text-red-400" />
                        <span className="text-sm font-medium">Sign out</span>
                    </button>
                </div>
            </div>
            {
                createPortal(Toast(), document.body)
            }
        </React.Fragment>
    )
}

export default ProfileDrapdown
