import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";

const toggleLike = async (modelName, id, userId) => {
  try {
    const existingLike = await Like.findOne({
      [modelName]: id,
      likedBy: userId,
    });
    if (existingLike) {
      await Like.findByIdAndDelete(existingLike._id);
      return new ApiResponse(
        200,
        { likeStatus: false },
        "Like removed successfully"
      );
    } else {
      await Like.create({
        [modelName]: id,
        likedBy: userId,
      });
      return new ApiResponse(200, { likeStatus: true }, "Like added");
    }
  } catch (error) {
    throw new ApiError(500, error?.message || "something went wrong");
  }
};

const likeStatus = async (modelName, id, userId) => {
  try {
    const existingLike = await Like.findOne({
      [modelName]: id,
      likedBy: userId,
    });
    if (existingLike) {
      return new ApiResponse(
        200,
        { isLiked: true, commentId: id },
        "like status featched successfuly"
      );
    } else {
      return new ApiResponse(
        200,
        { isLiked: false, commentId: id },
        "like status featched successfuly"
      );
    }
  } catch (error) {
    throw new ApiError(500, error?.message || "something went wrong");
  }
};
const getVideoLikeStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  const videoLikeStatus = await likeStatus("video", videoId, req.user._id);

  return res
    .status(200)
    .json(new ApiResponse(200, videoLikeStatus, "Liked successfully"));
});

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: toggle like on video
  const videoLikeResult = await toggleLike("video", videoId, req.user._id);

  // return res.status(200).json(videoLikeResult);
  return res
    .status(200)
    .json(new ApiResponse(200, videoLikeResult, "Liked successfully"));
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  try {
    const { commentId } = req.params;
    //TODO: toggle like on comment
    const commentLikeResult = await toggleLike(
      "comment",
      commentId,
      req.user._id
    );

    return res
      .status(200)
      .json(new ApiResponse(200, commentLikeResult, "Liked successfully"));
  } catch (error) {
    console.log("error in comment like toggle: ", error);
  }
});
const getCommentLikeStatus = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  const commentLikeStatus = await likeStatus(
    "comment",
    commentId,
    req.user._id
  );

  return res
    .status(200)
    .json(new ApiResponse(200, commentLikeStatus, "Liked successfully"));
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  //TODO: toggle like on tweet
  const tweetLikeResult = await toggleLike("tweet", tweetId, req.user._id);

  return res
    .status(200)
    .json(new ApiResponse(200, tweetLikeResult, "Liked successfully"));
});
const getTweetLikeStatus = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;

  const tweetLikeStatus = await likeStatus("tweet", tweetId, req.user._id);

  // return res.status(200).json(tweetLikeStatus);
  return res
    .status(200)
    .json(new ApiResponse(200, tweetLikeStatus, "Liked successfully"));
});

const getTweetLikesCount = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  const likesCount = await Like.countDocuments({ tweet: tweetId });

  return res
    .status(200)
    .json(
      new ApiResponse(200, { tweetId, likesCount }, "Tweet likes fetched")
    );
});

const getLikedVideos = asyncHandler(async (req, res) => {
  //TODO: get all liked videos
  const likedVideos = await Like.find({
    likedBy: req.user._id,
  }).populate("video");
  if (!likedVideos) {
    throw new ApiError(404, "No liked videos found");
  }
  let filteredRes = likedVideos.map((likedVideo) =>
    likedVideo.video ? likedVideo : null
  );
  filteredRes = filteredRes.filter((item) => item !== null);

  for (let i = 0; i < filteredRes.length; i++) {
    let ownerDetailes = await User.findById(filteredRes[i].video.owner);
    filteredRes[i].video.owner = ownerDetailes;
  }
  const videosOnly = filteredRes.map((item) => item.video);

  return res.status(200).json(new ApiResponse(200, videosOnly, "Liked Videos"));
});

const deleteLikedVideo = async (req, res) => {
  try {
    const { videoId } = req.params;
    const userId = req.user._id; // from JWT middleware

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
      // return res.status(400).json({
      //   success: false,
      //   message: "Invalid video ID",
      // });
      throw new ApiError(400, "No liked videos found");
    }

    const deletedLike = await Like.findOneAndDelete({
      video: videoId,
      likedBy: userId,
    });

    if (!deletedLike) {
      throw new ApiError(400, "Like not found");
    }

    // return res.status(200).json({
    //   success: true,
    //   message: "Video removed from liked videos",
    // });
    return res
      .status(200)
      .json(
        new ApiResponse(200, deletedLike, "Video removed from liked videos")
      );
  } catch (error) {
    console.error("deleteLikedVideo error:", error);
    throw new ApiError(500, "Internal server error");
  }
};

export {
  toggleCommentLike,
  toggleTweetLike,
  toggleVideoLike,
  getLikedVideos,
  deleteLikedVideo,
  getVideoLikeStatus,
  getTweetLikeStatus,
  getTweetLikesCount,
  getCommentLikeStatus,
};
