"use client";

import { useEffect, useState } from "react";
import { getSocket } from "./socket";
import { useYoutubecontext } from "@/contextAPI/YoutubeContextAPI";
import { getMyNewVideoNotifications, getMyNotifications } from "@/APIS";
import { Notification } from "@/types/types";

export const useVideoNotifications = (userId?: string) => {
  type NewVideoEvent = { video: string; channel: string; user: string; type: string };

  const [videos, setVideos] = useState<NewVideoEvent[]>([]);
  const [liveEvents, setLiveEvents] = useState<number>(0);
  const { setNotifications } = useYoutubecontext();

  useEffect(() => {
    if (videos.length === 0) return;
    if (!userId) return;
    const latest = videos[0];
    if (!latest?.video || !latest?.channel) return;
    if (latest.channel === userId) return;
    const getNewVideos = async () => {
      try {
        const response = await getMyNewVideoNotifications(latest.video, latest.channel);
        const list = response?.data ?? (Array.isArray(response) ? response : []);
        if (response?.statusCode === 200 && Array.isArray(list) && list.length > 0) {
          setNotifications((prev: Notification[]) => {
            const combined = [...(list as Notification[]), ...prev];
            return Array.from(
              new Map(combined.map((item) => [item._id, item])).values()
            );
          });
        }
      } catch (error) {
        console.log("error in get new videos: ", error);
      }
    };
    getNewVideos();
  }, [videos.length, userId, setNotifications, videos]);

  useEffect(() => {
    if (!userId || liveEvents === 0) return;
    const getLatestNotifications = async () => {
      try {
        const response = await getMyNotifications();
        const list = response?.data ?? [];
        if (response?.statusCode === 200 && Array.isArray(list)) {
          setNotifications(list);
        }
      } catch (error) {
        console.log("error in get latest notifications: ", error);
      }
    };
    getLatestNotifications();
  }, [liveEvents, setNotifications, userId]);

  useEffect(() => {
    if (!userId) return;

    const socket = getSocket(userId);

    socket.on("new-video", (notification: NewVideoEvent) => {
      if (!notification) return;
      const channelId = notification.channel?.toString?.() ?? notification.channel;
      if (channelId === userId) return;
      setVideos((prev) => [notification, ...prev]);
    });

    socket.on("live-stream-started", (notification: { channel: string }) => {
      if (!notification) return;
      const channelId = notification.channel?.toString?.() ?? notification.channel;
      if (channelId === userId) return;
      setLiveEvents((prev) => prev + 1);
    });

    return () => {
      socket.off("new-video");
      socket.off("live-stream-started");
    };
  }, [userId]);
};
