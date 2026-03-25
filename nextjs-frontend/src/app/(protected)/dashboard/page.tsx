"use client"
import { DeleteVideo, GetDashboardStats, GetDashboatdVideos, ToggleVideoPublishStatus, UpdateThumbnail, UpdateVideo } from '@/APIS';
import AnalyticsCharts from '@/components/AnalyticsCharts';
import StatsOverview from '@/components/StatsOverview';
import { VideoList } from '@/components/VideoList';
import { useYoutubecontext } from '@/contextAPI/YoutubeContextAPI';
import { ChartDataPoint, DashboardData, Video } from '@/types/types';
import React, { useEffect, useMemo, useState } from 'react'

const DashBoard = () => {
  const [videos, setVideos] = useState<any[]>([]);
  const [data, setData] = useState<DashboardData>()
  const { setIsUploadModalOpen } = useYoutubecontext()

    const chartData: ChartDataPoint[] = useMemo(() => {
    // In a real app, this would come from a specific time-series endpoint
    const tempData: Record<string, ChartDataPoint> = {};
    
    videos.forEach(v => {
      const date = new Date(v.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
      if (!tempData[date]) {
        tempData[date] = { date, subscribers: 0, views: 0, likes: 0, uploads: 0 };
      }
      tempData[date].views += v.views;
      tempData[date].uploads += 1;
      // Mocking incremental subs/likes for visualization
      tempData[date].subscribers = data?.totalSubscribers!;
      tempData[date].likes += Math.floor(v.views * 0.1); 
    });

    return Object.values(tempData).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [videos]);

  useEffect(() => {
    const getDashboardDetails = async () => {
      try {
        const response = await GetDashboardStats();
        if (response?.statusCode === 200) {
          setData(response?.data)
          // setVideos(() => [...response?.data?.userVideos])
        } else {
          console.log("error while fetching the user watch history")
        }
      } catch (error) {
        console.log("error while fetching the user watch history: ", error);
      }
    }
    getDashboardDetails();
  }, [])

  useEffect(() => {
    const getDashboardVideos = async () => {
      try {
        const response = await GetDashboatdVideos();
        if (response?.statusCode === 200) {
          setVideos(() => [...response?.data])
        } else {
          console.log("error while fetching the user watch history")
        }
      } catch (error) {
        console.log("error while fetching the user watch history: ", error);
      }
    }
    getDashboardVideos();
  }, [])


  const handleDeleteVideo = async (videoId: string) => {
    if (window.confirm('Are you sure you want to delete this video? This action cannot be undone.')) {
      try {
        const response = await DeleteVideo(videoId);
        if (response?.statusCode === 200) {
          setVideos([...videos.filter((video: Video) => video?._id !== videoId)])
        } else {
          console.log("error")
        }
      } catch (error) {
        console.log("error in delete video: ", error);
      }
    }
  };

  const handleToggleVisibility = async (videoId: string) => {
    try {
      const response = await ToggleVideoPublishStatus(videoId);
      if (response?.statusCode === 200) {
        setVideos([response?.data, ...videos.filter((video: Video) => video?._id !== videoId)])
      } else {
        console.log("ToggleVideoPublish error")

      }
    } catch (error) {
      console.log("handleToggleVisibility error: ", error);
    }
  };
  const handleUpdateVideo = async (videoId: string, title: string, description: string) => {
    try {
      const response = await UpdateVideo(videoId, title, description);
      if (response?.statusCode === 200) {
        setVideos([response?.data, ...videos.filter((video: Video) => video?._id !== videoId)])
      } else {
        console.log("VideoUpdate error")
      }
    } catch (error) {
      alert("something went wrong")
      console.log(error)
    }
  };

  const handleUpdateThumbnail = async (videoId: string, thumbnail: File) => {
    try {
      const response = await UpdateThumbnail(videoId, thumbnail);

      if (response?.statusCode === 200) {
        setVideos([response?.data, ...videos.filter((video: Video) => video?._id !== videoId)])
      } else {
        console.log("VideoUpdate error")
      }
    } catch (error) {
      alert("something went wrong")
      console.log("handleUpdateThumbnail error: ", error);
    }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Channel dashboard</h1>
          <p className="text-sm text-gray-400 mt-1">Here's what's happening with your channel right now.</p>
        </div>
        <div onClick={() => setIsUploadModalOpen(true)} className="flex gap-3">
          <button className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
            {/* <Upload className="w-4 h-4 mr-2" /> */}
            Upload Videos
          </button>
        </div>
      </div>

      {/* Stats */}
      <StatsOverview data={data!} />
      <AnalyticsCharts data={chartData} />
      {/* Recent Videos Table */}
      <VideoList videos={videos}
        onDelete={handleDeleteVideo}
        onToggleVisibility={handleToggleVisibility}
        onEdit={handleUpdateVideo}
        onThumbnailEdit={handleUpdateThumbnail} />
    </div>
  )
}

export default DashBoard;