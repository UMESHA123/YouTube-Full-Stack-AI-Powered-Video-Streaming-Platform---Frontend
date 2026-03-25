import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Like } from "../models/like.model.js";
import { v2 as cloudinary } from "cloudinary";
import { END, START, StateGraph } from "@langchain/langgraph";
import z from "zod/v3";
import {
  PromptGeneratorNode,
  PromptResponseNode,
} from "../GenAI/node/index.js";
import { llm } from "../GenAI/llm/index.js";
import axios from "axios";
import { Comment } from "../models/comment.model.js";
import { producer } from "../kafka/producer.js";

export const YoutubeState = z.object({
  query: z.string(),
  response: z.array(z.any()).default([]),
});

// export const ManyalAnsState = z.object({
//   query: z.object({
//     query: string,
//     url: string,
//   }),
//   response: z.array(z.any()).default([]),
// });

const getAllVideos = asyncHandler(async (req, res) => {
  let { page = 1, limit = 10, sortBy, sortType, userId } = req.query;

  const pageNum = parseInt(page) || 1;
  const limitNum = parseInt(limit) || 10;

  try {
    let pipeline = [];

    // If owner requests their own videos, return all.
    // For other users, return only published videos.
    if (userId) {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new ApiError(400, "Invalid userId");
      }
      const requestedUserId = userId.toString();
      const currentUserId = req.user?._id?.toString();
      const matchStage = {
        owner: new mongoose.Types.ObjectId(userId),
      };

      if (!currentUserId || requestedUserId !== currentUserId) {
        matchStage.isPublished = true;
      }

      pipeline.push({
        $match: matchStage,
      });
    } else {
      // condition 2: no userId -> show only published videos
      pipeline.push({
        $match: {
          isPublished: true,
        },
      });
    }

    if (sortBy && sortType) {
      const sortOptions = {};
      sortOptions[sortBy] = sortType === "desc" ? -1 : 1;
      pipeline.push({ $sort: sortOptions });
    }

    pipeline.push({ $skip: (pageNum - 1) * limitNum }, { $limit: limitNum });

    pipeline.push({
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "ownerDetails",
      },
    });

    pipeline.push({ $unwind: "$ownerDetails" });

    pipeline.push({
      $project: {
        videoFile: 1,
        thumbnail: 1,
        title: 1,
        duration: 1,
        views: 1,
        isPublished: 1,
        isLive: 1,
        owner: {
          _id: "$ownerDetails._id",
          fullName: "$ownerDetails.fullName",
          avatar: "$ownerDetails.avatar",
        },
        createdAt: 1,
        updatedAt: 1,
      },
    });

    const videos = await Video.aggregate(pipeline);

    return res
      .status(200)
      .json(new ApiResponse(200, videos, "All videos fetched successfully"));
  } catch (error) {
    console.log(`Error in get all videos ${error?.message}`);
    throw new ApiError(
      error?.statusCode || 500,
      error?.message || "Internal server error in get all videos"
    );
  }
});

const publishAVideo = asyncHandler(async (req, res) => {
  // TODO: get video, upload to cloudinary, create video
  const { title, description } = req.body;
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  //validate data
  if (title === "" || description === "") {
    throw new ApiError(400, "All field are required");
  }
  if (!req.files.thumbnail || !req.files.videoFile) {
    throw new ApiError(400, "Video file and thumbnail are required");
  }
  // upload thumbNail and video to cloudinary
  console.log(
    "Uploading video and thumbnail...",
    req?.files?.thumbnail[0].path
  );
  console.log(
    "Uploading video and thumbnail...",
    req?.files?.videoFile[0].path
  );

  let thumbnailurl = await uploadOnCloudinary(req?.files?.thumbnail[0].path);
  let videourl = await uploadOnCloudinary(req?.files?.videoFile[0].path);
  if (!videourl || !thumbnailurl) {
    throw new ApiError(400, "Video file and thumbnail file are required");
  }
  console.log("videourl ", videourl);
  // console.log("vide transcript: ", videourl.info.raw_convert.google_speech);
  //create video
  const video = await Video.create({
    videoFile: videourl?.url,
    videoId: videourl?.public_id,
    thumbnail: thumbnailurl?.url,
    title: title,
    description: description,
    duration: videourl?.duration,
    owner: req?.user._id,
  });
  //return video
  console.log("video created:", video);
  console.log("notification event creation started");
  const event = {
    eventType: "VIDEO_UPLOADED",
    videoId: video?._id.toString(),
    channelId: req?.user._id.toString(),
    token: token,
    
  };

  console.log("notification event creation done");

  // ✅ Publish event
  console.log("pushing the notification event to Kafka");
  await producer.send({
    topic: "video.uploaded",
    messages: [
      {
        key: video._id.toString(),
        value: JSON.stringify(event),
      },
    ],
  });
  console.log("notification event pushed to Kafka");

  console.log("sending the video upload success message to frontend");
  return res
    .status(200)
    .json(new ApiResponse(200, video, "video created successfully"));
});

const startLiveStream = asyncHandler(async (req, res) => {
  const { title, streamUrl, description } = req.body || {};
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new ApiError(401, "Unauthorized request");
  }

  const streamTitle = title?.trim() || `${req.user?.username || "Channel"} is live`;
  const normalizedStreamUrl = streamUrl?.trim();

  if (!normalizedStreamUrl) {
    throw new ApiError(400, "streamUrl is required to start live stream");
  }

  const liveVideo = await Video.create({
    videoFile: normalizedStreamUrl,
    thumbnail: req.user?.avatar,
    title: streamTitle,
    description: description?.trim() || "Live stream",
    duration: 0,
    owner: req.user?._id,
    isLive: true,
    isPublished: true,
  });

  const event = {
    eventType: "LIVE_STREAM_STARTED",
    channelId: req.user?._id?.toString(),
    videoId: liveVideo?._id?.toString(),
    token,
    streamTitle,
    streamUrl: normalizedStreamUrl,
  };

  await producer.send({
    topic: "stream.started",
    messages: [
      {
        key: req.user?._id?.toString(),
        value: JSON.stringify(event),
      },
    ],
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        channelId: req.user?._id,
        videoId: liveVideo?._id,
        streamTitle,
        streamUrl: normalizedStreamUrl,
      },
      "Live stream started and subscribers notified"
    )
  );
});

const endLiveStream = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { unpublish = false } = req.body || {};

  if (!videoId) {
    throw new ApiError(400, "videoId is required");
  }

  const liveVideo = await Video.findById(videoId);
  if (!liveVideo) {
    throw new ApiError(404, "Live stream not found");
  }

  if (liveVideo.owner?.toString() !== req.user?._id?.toString()) {
    throw new ApiError(403, "You are not allowed to end this stream");
  }

  if (!liveVideo.isLive) {
    return res.status(200).json(
      new ApiResponse(
        200,
        { videoId: liveVideo._id, isLive: false, isPublished: liveVideo.isPublished },
        "Stream is already ended"
      )
    );
  }

  liveVideo.isLive = false;
  if (unpublish === true) {
    liveVideo.isPublished = false;
  }
  await liveVideo.save();

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        videoId: liveVideo._id,
        isLive: liveVideo.isLive,
        isPublished: liveVideo.isPublished,
      },
      "Live stream ended successfully"
    )
  );
});

const getVideoById = asyncHandler(async (req, res) => {
  //TODO: get video by id
  let { videoId } = req.params;
  let video = await Video.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(videoId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
        pipeline: [
          {
            $project: {
              username: 1,
              avatar: 1,
              fullname: 1,
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "video",
        as: "likes",
      },
    },
    {
      $addFields: {
        owner: {
          $first: "$owner",
        },
        likes: {
          $size: "$likes",
        },
        views: {
          $add: [1, "$views"],
        },
      },
    },
  ]);
  if (video.length > 0) {
    video = video[0];
  }
  await Video.findByIdAndUpdate(videoId, {
    $set: {
      views: video.views,
    },
  });
  console.log("video ", video);

  // pull video if it already exists → avoid duplicates
  await User.findByIdAndUpdate(req.user._id, {
    $pull: { watchHistory: videoId },
  });
  // push video to the beginning of the array (most recent first)
  await User.findByIdAndUpdate(req.user._id, {
    $push: { watchHistory: { $each: [videoId], $position: 0 } },
  });

  return res.status(200).json(new ApiResponse(200, video, "video found"));
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { title, description } = req.body;

  if (!videoId) {
    throw new ApiError(500, "Something went wrong");
  }
  if (!title || !description) {
    throw new ApiError(400, "Title and description is required");
  }

  const existingVideo = await Video.findById(videoId);
  if (!existingVideo) {
    throw new ApiError(404, "Video not found");
  }
  if (existingVideo.owner?.toString() !== req.user?._id?.toString()) {
    throw new ApiError(403, "You are not allowed to update this video");
  }

  const video = await Video.findByIdAndUpdate(
    videoId,
    {
      $set: {
        title: title,
        description: description,
      },
    },
    {
      new: true,
    }
  );

  if (!video) {
    throw new ApiError(
      500,
      "Error while updating the title description and thumbnail"
    );
  }
  return res.status(200).json(new ApiResponse(200, video, "video updated"));
});
const updateThumbnail = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const thumbnailLocalPath = req.file?.path;

  console.log("file:", req.file); // not req.files

  if (!videoId) {
    throw new ApiError(500, "Something went wrong");
  }

  if (!thumbnailLocalPath) {
    throw new ApiError(400, "Thumbnail is required");
  }

  const existingVideo = await Video.findById(videoId);
  if (!existingVideo) {
    throw new ApiError(404, "Video not found");
  }
  if (existingVideo.owner?.toString() !== req.user?._id?.toString()) {
    throw new ApiError(403, "You are not allowed to update this thumbnail");
  }

  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

  const video = await Video.findByIdAndUpdate(
    videoId,
    {
      $set: { thumbnail: thumbnail.url },
    },
    { new: true }
  );

  return res.status(200).json(new ApiResponse(200, video, "video updated"));
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: delete video

  if (!videoId) {
    throw new ApiError(500, "Something went wrong");
  }

  const existingVideo = await Video.findById(videoId);
  if (!existingVideo) {
    throw new ApiError(404, "Video not found");
  }
  if (existingVideo.owner?.toString() !== req.user?._id?.toString()) {
    throw new ApiError(403, "You are not allowed to delete this video");
  }

  const video = await Video.findByIdAndDelete(videoId);
  const comment = await Comment.deleteMany({ video: videoId });
  const likes = await Like.deleteMany({ video: videoId });

  if (!video || !comment || !likes) {
    throw new ApiError(500, "Something went wrong while deleting");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video deleted Successfully"));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!videoId) {
    throw new ApiError(400, "Video ID is required");
  }

  const existingVideo = await Video.findById(videoId);
  if (!existingVideo) {
    throw new ApiError(404, "Video not found");
  }
  if (existingVideo.owner?.toString() !== req.user?._id?.toString()) {
    throw new ApiError(403, "You are not allowed to change publish status");
  }

  const video = await Video.findByIdAndUpdate(
    videoId,
    [{ $set: { isPublished: { $not: "$isPublished" } } }],
    { new: true }
  );

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video publish status updated"));
});

const getVideoTranscript = asyncHandler(async (req, res) => {
  try {
    const { videoId } = req.params;

    if (!videoId) {
      throw new ApiError(500, "Something went wrong");
    }
    const video = await Video.findById(videoId);
    if (!video) {
      throw new ApiError(404, "Video not found");
    }

    // Assuming 'my_video' is the public_id of your video
    const publicId = video.videoId;

    // Construct the URL for the transcript file (e.g., .transcript, .srt, or .vtt)
    // const cloudinary = require('cloudinary').v2;

    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      throw new ApiError(500, "Cloudinary env vars are not configured");
    }

    const transcriptUrl = cloudinary.url(publicId, {
      resource_type: "raw", // Or 'video' if fetching a specific derived version
      format: "transcript", // Or 'srt', 'vtt' based on your raw_convert setting
      // format: "vtt",
    });

    console.log("Transcript URL:", transcriptUrl);

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { transcriptUrl },
          "Transcript URL fetched successfully"
        )
      );
  } catch (error) {
    console.log("Error in fetching transcript: ", error);
    throw new ApiError(500, "Internal server error in fetching transcript");
  }
});

const generateAPrompt = asyncHandler(async (req, res) => {
  try {
    const { url } = req.body;
    console.log(url);

    if (!url) {
      throw new ApiError(404, "transcript file is required");
    }

    const graph = new StateGraph(YoutubeState)
      .addNode("PromptGeneratorNode", PromptGeneratorNode)
      .addEdge(START, "PromptGeneratorNode")
      .addEdge("PromptGeneratorNode", END)
      .compile();

    const graphRes = await graph.invoke({
      // query: `${query}`
      query: `${url}`,
    });

    console.log("graph response: ", graphRes);

    return res
      .status(200)
      .json(new ApiResponse(200, graphRes, "prompts generated successfull"));
  } catch (error) {
    console.log("Error in fetching transcript: ", error);
    throw new ApiError(
      500,
      "Internal server error in fetching transcript prompts"
    );
  }
});

const generatePromptResponse = asyncHandler(async (req, res) => {
  try {
    const { query } = req.body;
    console.log("query: ", query);

    if (!query) {
      throw new ApiError(404, "query or url is required");
    }

    const graph = new StateGraph(YoutubeState)
      .addNode("PromptResponseNode", PromptResponseNode)
      .addEdge(START, "PromptResponseNode")
      // .addEdge("PromptResponseNode", "PromptResponseNode")
      .addEdge("PromptResponseNode", END)
      .compile();

    const graphRes = await graph.invoke({
      // query: `${query}`
      query: `${query}`,
    });

    console.log("graph response: ", graphRes);

    return res
      .status(200)
      .json(
        new ApiResponse(200, graphRes, "prompts response generated successfull")
      );
  } catch (error) {
    console.log("Error in fetching transcript: ", error);
    throw new ApiError(
      500,
      "Internal server error in fetching transcript prompts"
    );
  }
});

const manualAnsGenerator = asyncHandler(async (req, res) => {
  try {
    const { query, url } = req.body;
    if (!query || !url) {
      throw new ApiError(404, "query or url is required");
    }
    const response = await axios.get(url, { responseType: "text" });
    // console.log("response.data: ",JSON.parse(response?.data));

    const context = JSON.parse(response?.data)
      .map((item) => item.transcript)
      .join(" ");
    console.log("transcriptOnly => ", context);

    const completion = await llm.invoke([
      {
        role: "user",
        content: `
              You must answer ONLY using the transcript context below.
              If the answer is not present, reply: "Not available in the transcript."

              User Question:
              ${query}

              Transcript Context:
              ${context}
          `,
      },
    ]);
    return res
      .status(200)
      .json(new ApiResponse(200, completion, "manual query ansl"));
  } catch (error) {
    console.log("error in manual prompt generator: ", error);
  }
});

const searchVideos = asyncHandler(async (req, res) => {
  let { query, page = 1, limit = 10, sortBy, sortType, videoIds } = req.query;

  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 10;

  if (!query || query.trim() === "") {
    throw new ApiError(400, "Search query is required");
  }

  const userId = req.user?._id;
  const hasValidUser = userId && mongoose.Types.ObjectId.isValid(userId);
  const normalizedQuery = query.trim().toLowerCase();
  const escapedQuery = normalizedQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const queryTokens = normalizedQuery
    .split(/\s+/)
    .map((token) => token.replace(/[^a-z0-9]/gi, ""))
    .filter((token) => token.length >= 2)
    .slice(0, 8);

  const requestedVideoIds = typeof videoIds === "string"
    ? videoIds
        .split(",")
        .map((id) => id.trim())
        .filter((id) => mongoose.Types.ObjectId.isValid(id))
        .map((id) => new mongoose.Types.ObjectId(id))
    : [];

  try {
    const pipeline = [];

    const matchStage = {};

    if (hasValidUser) {
      matchStage.$or = [
        { isPublished: true },
        { owner: new mongoose.Types.ObjectId(userId) },
      ];
    } else {
      matchStage.isPublished = true;
    }

    if (requestedVideoIds.length > 0) {
      matchStage._id = { $in: requestedVideoIds };
    }

    if (queryTokens.length > 0) {
      const tokenRegexes = queryTokens.map((token) => new RegExp(token, "i"));
      matchStage.$and = [
        {
          $or: [
            { title: { $regex: escapedQuery, $options: "i" } },
            { description: { $regex: escapedQuery, $options: "i" } },
            ...tokenRegexes.flatMap((regex) => [
              { title: { $regex: regex } },
              { description: { $regex: regex } },
            ]),
          ],
        },
      ];
    }

    pipeline.push({ $match: matchStage });

    const tokenScoreExpressions = queryTokens.map((token) => ({
      $cond: [
        {
          $or: [
            { $regexMatch: { input: "$title", regex: token, options: "i" } },
            { $regexMatch: { input: "$description", regex: token, options: "i" } },
          ],
        },
        1,
        0,
      ],
    }));

    pipeline.push({
      $addFields: {
        searchScore: {
          $add: [
            {
              $cond: [
                { $regexMatch: { input: "$title", regex: escapedQuery, options: "i" } },
                20,
                0,
              ],
            },
            {
              $cond: [
                { $regexMatch: { input: "$description", regex: escapedQuery, options: "i" } },
                8,
                0,
              ],
            },
            ...tokenScoreExpressions,
            { $min: [{ $divide: ["$views", 5000] }, 10] },
            {
              $max: [
                0,
                {
                  $subtract: [
                    6,
                    {
                      $divide: [
                        { $dateDiff: { startDate: "$createdAt", endDate: "$$NOW", unit: "day" } },
                        30,
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      },
    });

    if (sortBy && sortType) {
      pipeline.push({
        $sort: {
          [sortBy]: sortType === "desc" ? -1 : 1,
        },
      });
    } else {
      pipeline.push({
        $sort: {
          searchScore: -1,
          views: -1,
          createdAt: -1,
        },
      });
    }

    pipeline.push({ $skip: (pageNum - 1) * limitNum }, { $limit: limitNum });

    pipeline.push({
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "ownerDetails",
      },
    });

    pipeline.push({ $unwind: "$ownerDetails" });

    pipeline.push({
      $project: {
        videoFile: 1,
        thumbnail: 1,
        title: 1,
        description: 1,
        duration: 1,
        views: 1,
        isPublished: 1,
        isLive: 1,
        owner: {
          _id: "$ownerDetails._id",
          fullName: "$ownerDetails.fullName",
          avatar: "$ownerDetails.avatar",
        },
        createdAt: 1,
        updatedAt: 1,
        searchScore: 1,
      },
    });

    const videos = await Video.aggregate(pipeline);

    return res
      .status(200)
      .json(new ApiResponse(200, videos, "Search videos fetched successfully"));
  } catch (error) {
    console.error("Error in searchVideos:", error);
    throw new ApiError(
      error.statusCode || 500,
      error.message || "Internal server error in search videos"
    );
  }
});

const getSuggestedVideoTopics = asyncHandler(async (req, res) => {
  const maxVideos = 300;
  const videos = await Video.find({ isPublished: true })
    .select("_id title description views createdAt")
    .sort({ createdAt: -1 })
    .limit(maxVideos);

  const stopWords = new Set([
    "the", "and", "for", "with", "this", "that", "from", "your", "you", "are",
    "how", "what", "when", "where", "why", "about", "into", "have", "has", "had",
    "will", "can", "all", "new", "best", "guide", "tips", "video", "videos",
  ]);

  const topicMap = new Map();

  const toLabel = (token) =>
    token
      .split(" ")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");

  videos.forEach((video) => {
    const text = `${video.title} ${video.description || ""}`.toLowerCase();
    const words = text
      .split(/[^a-z0-9]+/g)
      .filter((word) => word.length >= 3 && !stopWords.has(word));

    const uniqueWords = Array.from(new Set(words)).slice(0, 30);
    const baseWeight = 1 + Math.min((video.views || 0) / 10000, 6);

    uniqueWords.forEach((word) => {
      const existing = topicMap.get(word) || { score: 0, videoIds: new Set() };
      existing.score += baseWeight;
      existing.videoIds.add(video._id.toString());
      topicMap.set(word, existing);
    });
  });

  const topics = Array.from(topicMap.entries())
    .sort((a, b) => b[1].score - a[1].score)
    .slice(0, 20)
    .map(([token, meta]) => ({
      id: token,
      label: toLabel(token),
      score: Number(meta.score.toFixed(2)),
      videoIds: Array.from(meta.videoIds).slice(0, 50),
    }));

  return res
    .status(200)
    .json(new ApiResponse(200, topics, "Suggested topics fetched"));
});

export {
  getAllVideos,
  publishAVideo,
  startLiveStream,
  endLiveStream,
  getVideoById,
  updateVideo,
  updateThumbnail,
  deleteVideo,
  togglePublishStatus,
  getVideoTranscript,
  generateAPrompt,
  generatePromptResponse,
  manualAnsGenerator,
  searchVideos,
  getSuggestedVideoTopics,
};
