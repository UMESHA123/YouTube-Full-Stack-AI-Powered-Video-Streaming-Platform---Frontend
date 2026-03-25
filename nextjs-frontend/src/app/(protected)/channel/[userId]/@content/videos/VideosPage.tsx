"use client"
import { DeleteVideo, GetAllVideos } from '@/APIS';
import { Video } from '@/types/types';
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation';
import { PrivateVideoCard } from '@/components/PrivateVideoCard';

const VideosClient = () => {
  const params = useParams();
  const userId = params.userId as string;

  const [videos, setVideos] = useState<Video[]>([])
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [sortBy, setSortBy] = useState<string>('asc');
  const [sortType, setSortType] = useState<string>('title');

  useEffect(() => {
    const getUserChannelVideos = async (userId: string) => {
      try {
        const response = await GetAllVideos({
          page,
          limit,
          sortBy,
          sortType,
          userId
        });
        if (response?.statusCode === 200) {
          console.log("succes: ", response);
          setVideos([...response?.data]);
        }
      } catch (error) {
        console.log("error while fetching the user channel videos: ", error);
      }
    }
    getUserChannelVideos(userId);
  }, [userId]);

  const handleVideoDelete = async (videoId: string) => {
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

  const loadMore = async (nextPage: number, nextLimit: number) => {
    setPage(nextPage)
    setLimit(nextLimit)
    const response: any = await GetAllVideos({
      page: nextPage,
      limit: nextLimit,
      userId: userId
    })
    console.log("response: ", response)
    if (response.statusCode === 200 && response.success === true) {
      setVideos((prevVideos) => {
        const newVideos = [...prevVideos, ...response.data];
        const uniqueVideos = Array.from(
          new Map(newVideos.map(v => [v._id, v])).values()
        );
        return uniqueVideos;
      });
    } else {
      console.error('Failed to fetch home page videos');
    }
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8 pb-10">
        {videos.map((video) => {
          const transformedVideo = {
            ...video,
            owner: {
              ...video.owner,
              username: video.owner.fullName, // Map fullName to username
            },
          };
          return <PrivateVideoCard key={video._id} video={transformedVideo} handleVideoDelete={handleVideoDelete} />;
        })}

      </div>
      <div className="mt-12 flex justify-center pb-8">
        <button onClick={() => loadMore(page + 1, limit)} className="bg-[#272727] hover:bg-[#3f3f3f] text-white font-medium py-2 px-6 rounded-full transition-colors border border-transparent hover:border-[#4f4f4f]">
          Load More Videos
        </button>
      </div>
    </>
  )
}

export default VideosClient