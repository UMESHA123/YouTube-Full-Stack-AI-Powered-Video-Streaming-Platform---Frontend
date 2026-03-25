"use client";

import {
  GetDashboatdVideos,
  GetDashboardStats,
  GetSubScribedChannels,
  GetUserChannelSubscribers,
} from "@/APIS";
import AnalyticsCharts from "@/components/AnalyticsCharts";
import StatsOverview from "@/components/StatsOverview";
import { useYoutubecontext } from "@/contextAPI/YoutubeContextAPI";
import { ChartDataPoint, DashboardData, SubscriptionType, Video } from "@/types/types";
import { formatNumber, timeAgo } from "@/utills";
import React, { useEffect, useMemo, useState } from "react";

type SubscribedChannelItem = {
  channel: {
    _id: string;
    username: string;
    avatar: string;
  };
  subscribedAt: string;
};

const SubscribersPage = () => {
  const { loginUserDetails } = useYoutubecontext();
  const [dashboardStats, setDashboardStats] = useState<DashboardData | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [subscribers, setSubscribers] = useState<SubscriptionType[]>([]);
  const [subscriptions, setSubscriptions] = useState<SubscribedChannelItem[]>([]);

  useEffect(() => {
    const fetchPageData = async () => {
      if (!loginUserDetails?._id) return;

      try {
        const [statsRes, videosRes, subscribersRes, subscriptionsRes] =
          await Promise.all([
            GetDashboardStats(),
            GetDashboatdVideos(),
            GetUserChannelSubscribers(loginUserDetails._id),
            GetSubScribedChannels(),
          ]);

        if (statsRes?.statusCode === 200) {
          setDashboardStats(statsRes.data);
        }
        if (videosRes?.statusCode === 200) {
          setVideos(videosRes.data || []);
        }
        if (subscribersRes?.statusCode === 200) {
          setSubscribers(subscribersRes?.data?.subscribers || []);
        }
        if (subscriptionsRes?.statusCode === 200) {
          setSubscriptions(subscriptionsRes?.data || []);
        }
      } catch (error) {
        console.log("Error while fetching subscribers page data: ", error);
      }
    };

    fetchPageData();
  }, [loginUserDetails?._id]);

  const recentSubscribers = useMemo(() => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return subscribers.filter(
      (subscriber) => new Date(subscriber.subscribedAt) >= thirtyDaysAgo
    ).length;
  }, [subscribers]);

  const avgViewsPerVideo = useMemo(() => {
    if (!videos.length) return 0;
    const totalViews = videos.reduce((acc, video) => acc + (video.views || 0), 0);
    return Math.round(totalViews / videos.length);
  }, [videos]);

  const chartData: ChartDataPoint[] = useMemo(() => {
    const tempData: Record<string, ChartDataPoint> = {};

    videos.forEach((video) => {
      const date = new Date(video.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
      });
      if (!tempData[date]) {
        tempData[date] = {
          date,
          subscribers: 0,
          views: 0,
          likes: 0,
          uploads: 0,
        };
      }
      tempData[date].views += video.views;
      tempData[date].uploads += 1;
      tempData[date].subscribers = dashboardStats?.totalSubscribers || 0;
      tempData[date].likes += Math.floor(video.views * 0.1);
    });

    if (Object.keys(tempData).length === 0 && dashboardStats) {
      const today = new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
      });
      tempData[today] = {
        date: today,
        subscribers: dashboardStats.totalSubscribers || 0,
        views: dashboardStats.totalVideoViews || 0,
        likes: dashboardStats.totalLikes || 0,
        uploads: dashboardStats.totalVideos || 0,
      };
    }

    return Object.values(tempData);
  }, [videos, dashboardStats]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Subscribers Insights</h1>
        <p className="text-sm text-gray-400 mt-1">
          Subscriber growth, your subscriptions, and channel performance in one view.
        </p>
      </div>

      {dashboardStats && <StatsOverview data={dashboardStats} />}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#1a1a1a] border border-[#2f2f2f] rounded-xl p-4">
          <p className="text-xs text-gray-400">Subscribed Channels</p>
          <p className="text-2xl font-bold text-white mt-1">{formatNumber(subscriptions.length)}</p>
        </div>
        <div className="bg-[#1a1a1a] border border-[#2f2f2f] rounded-xl p-4">
          <p className="text-xs text-gray-400">New Subscribers (30 days)</p>
          <p className="text-2xl font-bold text-white mt-1">{formatNumber(recentSubscribers)}</p>
        </div>
        <div className="bg-[#1a1a1a] border border-[#2f2f2f] rounded-xl p-4">
          <p className="text-xs text-gray-400">Avg Views Per Video</p>
          <p className="text-2xl font-bold text-white mt-1">{formatNumber(avgViewsPerVideo)}</p>
        </div>
      </div>

      <AnalyticsCharts data={chartData} />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-[#141414] border border-[#2f2f2f] rounded-xl p-4">
          <h2 className="text-lg font-semibold text-white mb-3">All Subscribers</h2>
          <div className="space-y-3 max-h-[420px] overflow-y-auto pr-2">
            {subscribers.map((subscriber) => (
              <div key={subscriber._id} className="flex items-center gap-3 py-2 border-b border-[#252525]">
                <img src={subscriber.avatar} alt={subscriber.username} className="w-10 h-10 rounded-full" />
                <div className="min-w-0">
                  <p className="text-sm text-white truncate">{subscriber.username}</p>
                  <p className="text-xs text-gray-400">
                    Subscribed {timeAgo(subscriber.subscribedAt)}
                  </p>
                </div>
              </div>
            ))}
            {subscribers.length === 0 && (
              <p className="text-sm text-gray-400">No subscribers found.</p>
            )}
          </div>
        </div>

        <div className="bg-[#141414] border border-[#2f2f2f] rounded-xl p-4">
          <h2 className="text-lg font-semibold text-white mb-3">Channels You Follow</h2>
          <div className="space-y-3 max-h-[420px] overflow-y-auto pr-2">
            {subscriptions.map((item) => (
              <div key={item.channel._id} className="flex items-center gap-3 py-2 border-b border-[#252525]">
                <img
                  src={item.channel.avatar}
                  alt={item.channel.username}
                  className="w-10 h-10 rounded-full"
                />
                <div className="min-w-0">
                  <p className="text-sm text-white truncate">{item.channel.username}</p>
                  <p className="text-xs text-gray-400">
                    Following since {timeAgo(item.subscribedAt)}
                  </p>
                </div>
              </div>
            ))}
            {subscriptions.length === 0 && (
              <p className="text-sm text-gray-400">You are not subscribed to any channels yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscribersPage;
