import mongoose from "mongoose"
import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscription.model.js"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { User } from "../models/user.model.js"


const getChannelStats = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // 1️⃣ Total videos & get videoIds in a single query
  const userVideos = await Video.find({ owner: userId }).select("_id views");
  const totalVideos = userVideos.length;
  const videoIds = userVideos.map(v => v._id);

  // 2️⃣ Total video views
  const totalVideoViews = userVideos.reduce((acc, v) => acc + (v.views || 0), 0);

  // 3️⃣ Total likes on all videos
  const totalLikes = await Like.countDocuments({ video: { $in: videoIds } });

  // 4️⃣ Total subscribers of this user's channel
  const totalSubscribers = await Subscription.countDocuments({ channel: userId });

  return res.status(200).json(
    new ApiResponse(200, {
      totalSubscribers,
      totalVideoViews,
      totalLikes,
      totalVideos,
    }, "Channel stats fetched successfully")
  );
});



const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel
    const channelVideos = await Video.find(
        {
            owner: req.user._id
        }
    )
    if(!channelVideos){
        throw new ApiError(400, "Something went wrong while featching channel videos")
    }
    
    
    return res 
    .status(200)
    .json(
        new ApiResponse(
            200, 
            channelVideos,
            "Channel video featuched successfully"
        )
    )
})

export {
    getChannelStats, 
    getChannelVideos
    }
