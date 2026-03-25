import axios from "axios";
import Cookies from "js-cookie";
import type {
  UserData,
  Credentials,
  PasswordData,
  UpdateAccountData,
  AvatarData,
  CoverImageData,
  TweetData,
  TweetCommentData,
  GetAllVideosParams,
  PublishVideoData,
  StartLiveStreamData,
  EndLiveStreamData,
  UpdateThumbnailData,
  GetCommentsParams,
  AddCommentData,
  UpdateCommentData,
  CreatePlaylistData,
  UpdatePlaylistData,
} from "./types";
import React from "react";

const MAIN_URL = process.env.NEXT_PUBLIC_APP_URL;

const api = axios.create({
  baseURL: `${MAIN_URL}`, // your Express backend
  withCredentials: true, // ✅ send cookies automatically
});

export const HealthCheck = async () => {
  try {
    const response = await api.get(`/api/v1/healthcheck`);
    console.log("HealthCheck response:", response.data);
  } catch (error) {
    console.log("HealthCheck error:", error);
  }
};

// user routes
export const getUserById = async (userId: string) => {
  try {
    const response = await api.get(`/api/v1/users/users/${userId}`)
    console.log("response getUserById: ", response.data);
    return response.data;
  } catch (error) {
    console.log("error getuserbyif: ", error);
  }
}

export const RegisterUser = async (
  userData: UserData,
  setError: React.Dispatch<React.SetStateAction<any>>,
  setLoading: React.Dispatch<React.SetStateAction<any>>
) => {
  try {
    // const token = getToken();
    setLoading(true);
    const response = await api.post(`/api/v1/users/register`, userData, {
      headers: {
        // Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("RegisterUser response:", response.data);
    return response.data;
  } catch (err: any) {
    console.log("RegisterUser error:", err);
    const status = err?.response?.status || 500;
    const message =
      err?.response?.data?.message || err?.message || "Something went wrong";

    setError((prev: any) => ({
      ...prev,
      status,
      message,
    }));
  } finally {
    setLoading(false);
  }
};

export const LoginUser = async (
  credentials: Credentials,
  setError: React.Dispatch<React.SetStateAction<any>>,
  setLoading: React.Dispatch<React.SetStateAction<any>>
) => {
  try {
    setLoading(true);
    const response = await api.post(`/api/v1/users/login`, credentials);
    console.log("LoginUser response:", response.data);
    return response.data;
  } catch (err: any) {
    console.log("LoginUser error:", err);
    const status = err?.response?.status || 500;
    const message =
      err?.response?.data?.message || err?.message || "Something went wrong";

    setError((prev: any) => ({
      ...prev,
      status,
      message,
    }));
  } finally {
    setLoading(false);
  }
};

export const LogoutUser = async () => {
  try {
    const response = await api.post(`/api/v1/users/logout`, {});
    console.log("LogoutUser response:", response.data);
    return response.data;
  } catch (error) {
    console.log("LogoutUser error:", error);
  }
};

export const RefreshToken = async () => {
  try {
    const response = await api.post(`/api/v1/users/refresh-token`, {});
    console.log("RefreshToken response:", response.data);
    return response.data;
  } catch (error) {
    console.log("RefreshToken error:", error);
  }
};

export const ChangePassword = async (passwordData: PasswordData) => {
  try {
    const response = await api.post(
      `/api/v1/users/change-password`,
      passwordData
    );
    console.log("ChangePassword response:", response.data);
    return response.data;
  } catch (error) {
    console.log("ChangePassword error:", error);
  }
};

export const CurrentUser = async () => {
  try {
    const response = await api.get(`/api/v1/users/current-user`);
    console.log("CurrentUser response:", response.data);
    return response.data;
  } catch (error) {
    console.log("CurrentUser error:", error);
  }
};

export const UpdateAccount = async (updateData: UpdateAccountData) => {
  try {
    const response = await api.patch(
      `/api/v1/users/update-account`,
      updateData
    );
    console.log("UpdateAccount response:", response.data);
    return response.data;
  } catch (error) {
    console.log("UpdateAccount error:", error);
  }
};

export const UpdateAavatar = async (avatarImage: File) => {
  try {
    const formData = new FormData();
    formData.append("avatar", avatarImage);
    const response = await api.patch(`/api/v1/users/avatar`, formData);
    console.log("UpdateAvatar response:", response.data);
    return response.data;
  } catch (error) {
    console.log("UpdateAvatar error:", error);
  }
};

export const UpdateCoverImage = async (coverImage: File) => {
  try {
    console.log(coverImage);
    const formData = new FormData();
    formData.append("coverImage", coverImage);

    const response = await api.patch(`/api/v1/users/cover-image`, formData);

    console.log("UpdateCoverImage response:", response.data);
    return response.data;
  } catch (error) {
    console.log("UpdateCoverImage error:", error);
  }
};

export const GetUserChannelProfile = async (userId: string) => {
  try {
    
    const response = await api.get(`/api/v1/users/c/${userId}`);
    console.log("GetUserChannelProfile response:", response.data);
    return response.data;
  } catch (error) {
    console.log("GetUserChannelProfile error:", error);
  }
};

export const GetWatchHistory = async () => {
  try {
    const response = await api.get(`/api/v1/users/history`);
    console.log("GetWatchHistory response:", response.data);
    return response.data;
  } catch (error) {
    console.log("GetWatchHistory error:", error);
  }
};

export const RemoveVideoFromWatchHistory = async (videoId: string) => {
  try {
    const response = await api.get(`/api/v1/users/history/remove/v/${videoId}`);
    console.log("RemoveVideoFromWatchHistory response:", response.data);
    return response.data;
  } catch (error) {
    console.log("RemoveVideoFromWatchHistory  error:", error);
  }
};

export const ClearWatchHistory = async () => {
  try {
    const response = await api.delete(`/api/v1/users/history/remove/v/all`);
    console.log("ClearWatchHistory response:", response.data);
    return response.data;
  } catch (error) {
    console.log("ClearWatchHistory error:", error);
  }
};

export const addVideoToWatchLater = async (videoId: string) => {
  try {
    const response = await api.post(
      `/api/v1/users/watch-later/add/${videoId}`,
      {}
    );
    console.log("addVideoToWatchLater response: ", response.data);
    return response.data;
  } catch (error) {
    console.log("addVideoToWatchLater error: ", error);
  }
};

export const removeVideoFromWatchLater = async (videoId: string) => {
  try {
    const response = await api.delete(
      `/api/v1/users/watch-later/remove/${videoId}`
    );
    console.log("removeVideoFromWatchLater response: ", response.data);
    return response.data;
  } catch (error) {
    console.log("removeVideoFromWatchLater error: ", error);
  }
};

export const clearWatchLater = async () => {
  try {
    const response = await api.delete(`/api/v1/users/watch-later/clear`);
    console.log("clearWatchLater response: ", response.data);
    return response.data;
  } catch (error) {
    console.log("clearWatchLater error: ", error);
  }
};

export const getWatchLaterVideos = async () => {
  try {
    const response = await api.get(`/api/v1/users/watch-later/videos`);
    console.log("getWatchLaterVideos response: ", response.data);
    return response.data;
  } catch (error) {
    console.log("getWatchLaterVideos error: ", error);
  }
};
// tweet

export const CreateTweet = async (tweetData: TweetData) => {
  try {
    const response = await api.post(`/api/v1/tweets`, tweetData);
    console.log("CreateTweet response:", response.data);
    return response.data;
  } catch (error) {
    console.log("CreateTweet error:", error);
  }
};

export const GetUserTweets = async (userId: string) => {
  try {
    const response = await api.get(`/api/v1/tweets/user/${userId}`);
    console.log("GetUserTweets response:", response.data);
    return response.data;
  } catch (error) {
    console.log("GetUserTweets error:", error);
  }
};

export const DeleteTweet = async (tweetId: string) => {
  try {
    const response = await api.delete(`/api/v1/tweets/${tweetId}`);
    console.log("DeleteTweet response:", response.data);
    return response.data;
  } catch (error) {
    console.log("DeleteTweet error:", error);
  }
};

export const GetTweetComments = async (tweetId: string) => {
  try {
    const response = await api.get(`/api/v1/tweets/${tweetId}/comments`);
    console.log("GetTweetComments response:", response.data);
    return response.data;
  } catch (error) {
    console.log("GetTweetComments error:", error);
  }
};

export const AddTweetComment = async (
  tweetId: string,
  commentData: TweetCommentData
) => {
  try {
    const response = await api.post(
      `/api/v1/tweets/${tweetId}/comments`,
      commentData
    );
    console.log("AddTweetComment response:", response.data);
    return response.data;
  } catch (error) {
    console.log("AddTweetComment error:", error);
  }
};

export const DeleteTweetComment = async (tweetId: string, commentId: string) => {
  try {
    const response = await api.delete(
      `/api/v1/tweets/${tweetId}/comments/${commentId}`
    );
    console.log("DeleteTweetComment response:", response.data);
    return response.data;
  } catch (error) {
    console.log("DeleteTweetComment error:", error);
  }
};

export const GenerateTweetComment = async (tweetId: string, query?: string) => {
  try {
    const response = await api.post(`/api/v1/tweets/${tweetId}/comments/generate`, {
      query,
    });
    console.log("GenerateTweetComment response:", response.data);
    return response.data;
  } catch (error) {
    console.log("GenerateTweetComment error:", error);
  }
};

export const RepostTweet = async (tweetId: string) => {
  try {
    const response = await api.post(`/api/v1/tweets/${tweetId}/repost`, {});
    console.log("RepostTweet response:", response.data);
    return response.data;
  } catch (error) {
    console.log("RepostTweet error:", error);
  }
};

export const GetSubScribedChannels = async () => {
  try {
    const response = await api.get(`/api/v1/subscriptions/my-subscriptions`);
    console.log("GetSubScribedChannels response:", response.data);
    return response.data;
  } catch (error) {
    console.log("GetSubScribedChannels error:", error);
  }
};

export const ToggleSubscription = async (channelId: string) => {
  try {
    const response = await api.post(`/api/v1/subscriptions/channel/${channelId}`, {});
    console.log("ToggleSubscription response:", response.data);
    return response.data;
  } catch (error) {
    console.log("ToggleSubscription error:", error);
  }
};

export const SubscribedStatus = async (channelId: string) => {
  try {
    const response = await api.get(
      `/api/v1/subscriptions/channel/${channelId}/status`
    );
    console.log("SubscribedStatus response:", response.data);
    return response.data;
  } catch (error) {
    console.log("SubscribedStatus error:", error);
  }
};

export const GetUserChannelSubscribers = async (channelId: string) => {
  try {
    // /subscriptions/:channelId/c/subscribers
    // const response = await api.get(`/api/v1/subscriptions/u/${subscriberId}`);
    const response = await api.get(`/api/v1/subscriptions/${channelId}/c/subscribers`);
    console.log("GetUserChannelSubscribers response:", response.data);
    return response.data;
  } catch (error) {
    console.log("GetUserChannelSubscribers error:", error);
  }
};

export const GetSubscribersCount = async (channelId: string) => {
  try {
    const response = await api.get(
      `/api/v1/subscriptions/channel/${channelId}/subscribers-count`
    );
    return response.data;
  } catch (error) {
    console.log("GetSubscribersCount error:", error);
  }
};

//video routes

export const GetAllVideos = async (videoData: GetAllVideosParams) => {
  try {
    const response = await api.get(`/api/v1/videos`, {
      params: videoData,
    });
    console.log("GetAllVideos response:", response.data);
    return response.data;
  } catch (error) {
    console.log("GetAllVideos error:", error);
  }
};

export const PublishVideo = async (
  videoData: PublishVideoData,
  onUploadProgress?: (progress: number) => void
) => {
  try {
    const formData = new FormData();
    formData.append("title", videoData.title);
    formData.append("description", videoData.description);
    formData.append("thumbnail", videoData?.thumbnail!);
    formData.append("videoFile", videoData?.videoFile!);

    const response = await api.post(`/api/v1/videos`, formData, {
      onUploadProgress: (event) => {
        if (event.total && onUploadProgress) {
          const progress = Math.round((event.loaded / event.total) * 100);
          onUploadProgress(progress);
        }
      },
    });

    return response.data;
  } catch (error) {
    console.log("PublishVideo error:", error);
    throw error;
  }
};

export const StartLiveStream = async (streamData: StartLiveStreamData) => {
  try {
    const response = await api.post(`/api/v1/videos/live/start`, streamData);
    console.log("StartLiveStream response:", response.data);
    return response.data;
  } catch (error) {
    console.log("StartLiveStream error:", error);
    throw error;
  }
};

export const EndLiveStream = async (payload: EndLiveStreamData) => {
  try {
    const response = await api.patch(`/api/v1/videos/live/end/${payload.videoId}`, {
      unpublish: payload.unpublish ?? false,
    });
    console.log("EndLiveStream response:", response.data);
    return response.data;
  } catch (error) {
    console.log("EndLiveStream error:", error);
    throw error;
  }
};

export const GetVideoById = async (videoId: string) => {
  try {
    const response = await api.get(`/api/v1/videos/${videoId}`);
    console.log("GetVideoById response:", response.data);
    return response.data;
  } catch (error) {
    console.log("GetVideoById error:", error);
  }
};

export const DeleteVideo = async (videoId: string) => {
  try {
    const response = await api.delete(`/api/v1/videos/${videoId}`);
    console.log("DeleteVideo response:", response.data);
    return response.data;
  } catch (error) {
    console.log("DeleteVideo error:", error);
  }
};

export const UpdateVideo = async (
  videoId: string,
  title: string,
  description: string
) => {
  try {
    const response = await api.patch(`/api/v1/videos/${videoId}`, {
      title,
      description,
    });
    console.log("UpdateVideo response: ", response);
    return response?.data;
  } catch (error) {
    console.log("UpdateVideo error: ", error);
  }
};

export const UpdateThumbnail = async (videoId: string, thumbnail: File) => {
  try {
    const formData = new FormData();
    formData.append("thumbnail", thumbnail);

    const response = await api.patch(
      `/api/v1/videos/thumbnail/${videoId}`,
      formData
    );

    console.log("UpdateThumbnail response: ", response);
    return response?.data;
  } catch (error) {
    console.log("UpdateThumbnail error: ", error);
  }
};
///
export const ToggleVideoPublishStatus = async (videoId: string) => {
  try {
    const response = await api.patch(
      `/api/v1/videos/toggle/publish/${videoId}`,
      {}
    );

    console.log("ToggleVideoPublishStatus response: ", response);
    return response?.data;
  } catch (error) {
    console.log("ToggleVideoPublishStatus error: ", error);
  }
};

// comment routes

export const GetVideoComments = async (
  videoId: string,
  commentData?: GetCommentsParams
) => {
  try {
    const response = await api.get(`/api/v1/comments/${videoId}`, {
      params: {
        page: commentData?.page,
        limit: commentData?.limit,
        parentComment: commentData?.parentComment,
      },
    });
    console.log("GetVideoComments response:", response.data);
    return response.data;
  } catch (error) {
    console.log("GetVideoComments error:", error);
  }
};

export const PostVideoComment = async (
  videoId: string,
  commentData: AddCommentData
) => {
  try {
    const response = await api.post(`/api/v1/comments/${videoId}`, commentData);
    console.log("PostVideoComment response:", response.data);
    return response.data;
  } catch (error) {
    console.log("PostVideoComment error:", error);
  }
};

export const DeleteVideoComment = async (commentId: string) => {
  try {
    const response = await api.delete(`/api/v1/comments/c/${commentId}`);
    console.log("DeleteVideoComment response:", response.data);
    return response.data;
  } catch (error) {
    console.log("DeleteVideoComment error:", error);
  }
};

export const UpdateVideoComment = async (
  commentId: string,
  updateData: UpdateCommentData
) => {
  try {
    const response = await api.patch(
      `/api/v1/comments/c/${commentId}`,
      updateData
    );
    console.log("UpdateVideoComment response:", response.data);
    return response.data;
  } catch (error) {
    console.log("UpdateVideoComment error:", error);
  }
};

// like routes

export const ToggleVideoLike = async (videoId: string) => {
  try {
    const response = await api.post(`/api/v1/likes/toggle/v/${videoId}`, {});
    console.log("ToggleVideoLike response:", response.data);
    return response.data;
  } catch (error) {
    console.log("ToggleVideoLike error:", error);
  }
};

export const ToggleCommentLike = async (commentId: string) => {
  try {
    const response = await api.post(`/api/v1/likes/toggle/c/${commentId}`, {});
    console.log("ToggleCommentLike response:", response.data);
    return response.data;
  } catch (error) {
    console.log("ToggleCommentLike error:", error);
  }
};

export const ToggleTweetLike = async (tweetId: string) => {
  try {
    const response = await api.post(`/api/v1/likes/toggle/t/${tweetId}`, {});
    console.log("ToggleTweetLike response:", response.data);
    return response.data;
  } catch (error) {
    console.log("ToggleTweetLike error:", error);
  }
};

export const GetLikedVideos = async () => {
  try {
    const response = await api.get(`/api/v1/likes/videos`);
    console.log("GetLikedVideos response:", response.data);
    return response.data;
  } catch (error) {
    console.log("GetLikedVideos error:", error);
  }
};

export const DeleteLikedVideo = async (videoId: string) => {
  try {
    const response = await api.delete(`/api/v1/likes/video/${videoId}`, {
      withCredentials: true,
    });
    console.log("deleteLikedVideo response", response.data);
    return response;
  } catch (error) {
    console.log("deleteLikedVideo error: ", error);
  }
};

export const GetVideoLikeStatus = async (videoId: string) => {
  try {
    const response = await api.get(`/api/v1/likes/video/like/s/${videoId}`);
    console.log("GetVideoLikeStatus response:", response.data);
    return response.data;
  } catch (error) {
    console.log("GetVideoLikeStatus error:", error);
  }
};

export const GetCommentLikeStatus = async (commentId: string) => {
  try {
    const response = await api.get(`/api/v1/likes/comment/like/s/${commentId}`);
    console.log("GetCommentLikeStatus response:", response.data);
    return response.data;
  } catch (error) {
    console.log("GetCommentLikeStatus error:", error);
  }
};

export const GetTweetLikeStatus = async (tweetId: string) => {
  try {
    const response = await api.get(`/api/v1/likes/tweet/like/s/${tweetId}`);
    console.log("GetTweetLikeStatus response:", response.data);
    return response.data;
  } catch (error) {
    console.log("GetTweetLikeStatus error:", error);
  }
};

export const GetTweetLikesCount = async (tweetId: string) => {
  try {
    const response = await api.get(`/api/v1/likes/tweet/likes/count/${tweetId}`);
    console.log("GetTweetLikesCount response:", response.data);
    return response.data;
  } catch (error) {
    console.log("GetTweetLikesCount error:", error);
  }
};

// playlist routes

export const CreatePlaylist = async (playlistData: CreatePlaylistData) => {
  try {
    const response = await api.post(`/api/v1/playlist`, playlistData);
    console.log("CreatePlaylist response:", response.data);
    return response.data;
  } catch (error) {
    console.log("CreatePlaylist error:", error);
  }
};

export const GetPlaylistById = async (playlistId: string) => {
  try {
    const response = await api.get(`/api/v1/playlist/${playlistId}`);
    console.log("GetPlaylistById response:", response.data);
    return response.data;
  } catch (error) {
    console.log("GetPlaylistById error:", error);
  }
};

export const UpdatePlaylist = async (
  playlistId: string,
  updateData: UpdatePlaylistData
) => {
  try {
    const response = await api.patch(
      `/api/v1/playlist/${playlistId}`,
      updateData
    );
    console.log("UpdatePlaylist response:", response.data);
    return response.data;
  } catch (error) {
    console.log("UpdatePlaylist error:", error);
  }
};

export const DeletePlaylist = async (playlistId: string) => {
  try {
    const response = await api.delete(`/api/v1/playlist/${playlistId}`);
    console.log("DeletePlaylist response:", response.data);
    return response.data;
  } catch (error) {
    console.log("DeletePlaylist error:", error);
  }
};

export const AddVideoToPlaylist = async (
  playlistId: string,
  videoId: string
) => {
  try {
    const response = await api.patch(
      `/api/v1/playlist/add/${videoId}/${playlistId}`,
      {}
    );
    console.log("AddVideoToPlaylist response:", response.data);
    return response.data;
  } catch (error) {
    console.log("AddVideoToPlaylist error:", error);
  }
};

export const RemoveVideoFromPlaylist = async (
  playlistId: string,
  videoId: string
) => {
  try {
    const response = await api.patch(
      `/api/v1/playlist/remove/${videoId}/${playlistId}`
    );
    console.log("RemoveVideoFromPlaylist response:", response.data);
    return response.data;
  } catch (error) {
    console.log("RemoveVideoFromPlaylist error:", error);
  }
};

export const GetUserPlaylists = async (userId: string) => {
  try {
    const response = await api.get(`/api/v1/playlist/user/${userId}`);
    console.log("GetUserPlaylists response:", response.data);
    return response.data;
  } catch (error) {
    console.log("GetUserPlaylists error:", error);
  }
};

//dashboard routes

export const GetDashboardStats = async () => {
  try {
    const response = await api.get(`/api/v1/dashboard/stats`);
    console.log("GetDashboardStats response:", response.data);
    return response.data;
  } catch (error) {
    console.log("GetDashboardStats error:", error);
  }
};

export const GetDashboatdVideos = async () => {
  try {
    const response = await api.get(`/api/v1/dashboard/videos`);
    console.log("GetDashboatdVideos response:", response.data);
    return response.data;
  } catch (error) {
    console.log("GetDashboatdVideos error:", error);
  }
};

export const getTranscript = async (videoId: string) => {
  try {
    const response = await api.get(`/api/v1/videos/transcript/${videoId}`);
    console.log("getTranscript response:", response.data);
    return response.data;
  } catch (error) {
    console.log("getTranscript error:", error);
  }
};

export const getSuggestedPrompt = async (url: string) => {
  try {
    const response = await api.post(
      `/api/v1/videos/prompts`,
      { url },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("get suggested prompts:", response.data);
    return response.data;
  } catch (error: any) {
    console.error(
      "Error in getSuggestedPrompt:",
      error?.response?.data || error?.message
    );
    throw (
      error?.response?.data || new Error("Failed to fetch suggested prompt")
    );
  }
};

export const getPromptResponse = async (query: string) => {
  try {
    const response = await api.post(`/api/v1/videos/prompts/response`, {
      query,
    });
    console.log("the prompt response log: ", response?.data);
    return response?.data;
  } catch (error) {
    console.log("error while generating the prompt response: ", error);
  }
};

export const manualQueryAnsGenerator = async (query: string, url: string) => {
  try {
    const response = await api.post(`/api/v1/videos/manual-query/response`, {
      query,
      url,
    });
    console.log("the manual query ans: ", response?.data);
    return response?.data;
  } catch (error) {
    console.log("error while generating manual query response: ", error);
  }
};

export const commentPromptGenerator = async (videoId: string) => {
  try {
    const response = await api.get(`/api/v1/comments/c/prompt/${videoId}`);
    console.log("the comment prompt generator response: ", response.data);
    return response.data;
  } catch (error) {
    console.log("Error in comment prompt generation: ", error);
  }
};

export const commentPromptResponseGenerator = async (
  query: string,
  videoId: string
) => {
  try {
    const response = await api.get(
      `/api/v1/comments/c/manual-response/${videoId}/?query=${query}`
    );
    console.log(
      "the comment prompt response generator response: ",
      response.data
    );
    return response.data;
  } catch (error) {
    console.log("Error in comment prompt response generation: ", error);
  }
};

// notification routes
export const getMyNotifications = async () => {
  try {
    const response = await api.get(`/api/v1/notifications/my`);
    console.log("GetMyNotifications response:", response.data);
    return response.data;
  } catch (error) {
    console.log("GetMyNotifications error:", error);
  }
};

export const getUnreadNotificationCount = async () => {
  try {
    const response = await api.get(`/api/v1/notifications/unread-count`);
    console.log("GetUnreadNotificationCount response:", response.data);
    return response.data;
  } catch (error) {
    console.log("GetUnreadNotificationCount error:", error);
  }
};

export const markNotificationAsRead = async (notificationId: string) => {
  try {
    const response = await api.patch(`/api/v1/notifications/${notificationId}/read`);
    console.log("MarkNotificationAsRead response:", response.data);
    return response.data;
  } catch (error) {
    console.log("MarkNotificationAsRead error:", error);
  }
};
export const markAllNotificationsAsRead = async () => {
  try {
    const response = await api.patch(`/api/v1/notifications/read-all`);
    console.log("MarkAllNotificationsAsRead response:", response.data);
    return response.data;
  } catch (error) {
    console.log("MarkAllNotificationsAsRead error:", error);
  }
};

export const deleteNotification = async (notificationId: string) => {
  try {
    const response = await api.delete(`/api/v1/notifications/${notificationId}`);
    console.log("DeleteNotification response:", response.data);
    return response.data;
  } catch (error) {
    console.log("DeleteNotification error:", error);
  }
};

export const getMyNotificationsPagination = async (page: number, limit: number) => {
  try {
    const response = await api.get(`/api/v1/notifications/my/paginated`, {
      params: { page, limit },
    });
    console.log("GetMyNotificationsPagination response:", response.data);
    return response.data;
  } catch (error) {
    console.log("GetMyNotificationsPagination error:", error);
  }
};

export const getMyNewVideoNotifications = async (videoId: string, channelId: string) => {
  try {
    const response = await api.get(`/api/v1/notifications/my/new-unread/notification`, {
      params: { videoId, channelId },
    });
    console.log("GetMyNewVideoNotifications response:", response.data);
    return response.data;
  } catch (error) {
    console.log("GetMyNewVideoNotifications error:", error);
  }
};

export const videoSearch = async (query: string, page: number, limit: number) => {
  try {
    const response = await api.get(`/api/v1/videos/result/search_query`, {
      params: { query, page, limit },
    });
    console.log("Video search response:", response.data);
    return response.data;
  } catch (error) {
    console.log("Video search error:", error);
  }
};

export const advancedVideoSearch = async (
  query: string,
  page: number,
  limit: number,
  videoIds?: string[]
) => {
  try {
    const response = await api.get(`/api/v1/videos/result/search_query`, {
      params: {
        query,
        page,
        limit,
        videoIds: videoIds?.length ? videoIds.join(",") : undefined,
      },
    });
    console.log("advancedVideoSearch response:", response.data);
    return response.data;
  } catch (error) {
    console.log("advancedVideoSearch error:", error);
  }
};

export const getSuggestedVideoTopics = async () => {
  try {
    const response = await api.get(`/api/v1/videos/topics/suggestions`);
    console.log("getSuggestedVideoTopics response:", response.data);
    return response.data;
  } catch (error) {
    console.log("getSuggestedVideoTopics error:", error);
  }
};
