
import { CurrentUser, SubscribedStatus } from "@/APIS";
import { LoginUserDetailsResponse } from "@/types/types";
import React from "react";

export const triggerToast = (
  msg: string,
  setToastMessage: React.Dispatch<React.SetStateAction<string>>,
  setShowToast: React.Dispatch<React.SetStateAction<boolean>>
) => {
  setToastMessage(msg);
  setShowToast(true);
  setTimeout(() => setShowToast(false), 3000);
};

export const logInUserDetails = async (
  setLoginUserDetails: React.Dispatch<
    React.SetStateAction<LoginUserDetailsResponse>
  >
) => {
  try {
    const response = await CurrentUser();
    if (response?.statusCode === 200) {
      setLoginUserDetails(response?.data);
    } else {
      console.log("error while fetching the login user details");
    }
  } catch (error) {
    console.log("logInUserDetails error: ", error);
  }
};

export const timeAgo = (isoDate: string): string => {
  const date = new Date(isoDate);
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

  const intervals: Record<string, number> = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
  };

  for (const key in intervals) {
    const value = Math.floor(seconds / intervals[key]);
    if (value >= 1) {
      return `${value} ${key}${value > 1 ? "s" : ""} ago`;
    }
  }

  return "Just now";
};

export const formatDuration = (seconds: number): string => {
  const roundedSeconds = Math.floor(seconds);
  const m = Math.floor(roundedSeconds / 60);
  const s = roundedSeconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
};


export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-US', { notation: "compact", maximumFractionDigits: 1 }).format(num);
}

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};

export const formatViews = (views: number): string => {
  if (views >= 1000000) return (views / 1000000).toFixed(1) + "M";
  if (views >= 1000) return (views / 1000).toFixed(1) + "K";
  return views.toString();
};


export const handleGetSubscribedStatus = async (channelId: string, setSubscribeStatus: React.Dispatch<React.SetStateAction<boolean | null>>) => {
        try {
            const response = await SubscribedStatus(channelId);
            if(response?.data?.isSubscribed) {
                console.log("Subscribed status retrieved successfully");
                setSubscribeStatus(true);
            }else{
                console.log("Error in getting subscribed status");
                setSubscribeStatus(false);
            }
        } catch (error) {
            console.log("error while getting subscribed status: ", error);
        }
    }