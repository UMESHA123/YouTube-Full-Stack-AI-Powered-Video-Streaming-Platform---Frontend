import mongoose, {isValidObjectId, mongo} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


 const toggleSubscription = async (req, res) => {
  const { channelId } = req.params;
  const userId = req.user._id;

  const existing = await Subscription.findOne({
    subscriber: userId,
    channel: channelId,
  });

  if (existing) {
    await existing.deleteOne();

    return res.status(200).json(
      new ApiResponse(
        200,
        { channelId, isSubscribed: false },
        "Unsubscribed successfully"
      )
    );
  }

  await Subscription.create({
    subscriber: userId,
    channel: channelId,
  });

  return res.status(201).json(
    new ApiResponse(
      201,
      { channelId, isSubscribed: true },
      "Subscribed successfully"
    )
  );
};

const subscribedStatus = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  const subscriberId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(channelId)) {
    throw new ApiError(400, "Invalid channelId");
  }

  const isSubscribed = await Subscription.exists({
    channel: channelId,
    subscriber: subscriberId,
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        channelId,
        isSubscribed: !!isSubscribed,
      },
      "Subscription status fetched"
    )
  );
});

const getMyChannelSubscribers = asyncHandler(async (req, res) => {
  const {channelId} = req.params; // 🔥 from JWT

  const subscriptions = await Subscription.find({
    channel: channelId,
  })
    .populate("subscriber", "username avatar")
    .select("subscriber createdAt");

  const subscribers = subscriptions.map((item) => ({
    _id: item.subscriber._id,
    username: item.subscriber.username,
    avatar: item.subscriber.avatar,
    subscribedAt: item.createdAt,
  }));

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        channelId,
        totalSubscribers: subscribers.length,
        subscribers,
      },
      "Your channel subscribers fetched successfully"
    )
  );
});


const getSubscribedChannels = async (req, res) => {
  const userId = req.user._id;

  const subscriptions = await Subscription.aggregate([
    {
      $match: {
        subscriber: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "channel",
        foreignField: "_id",
        as: "channel",
        pipeline: [
          {
            $project: {
              username: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    { $unwind: "$channel" },
    {
      $project: {
        _id: 0,
        channel: 1,
        subscribedAt: "$createdAt",
      },
    },
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      subscriptions,
      "Subscribed channels fetched successfully"
    )
  );
};

const getSubscribersCount = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(channelId)) {
    throw new ApiError(400, "Invalid channelId");
  }

  const count = await Subscription.countDocuments({ channel: channelId });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        channelId,
        subscribersCount: count,
      },
      "Subscriber count fetched"
    )
  );
});


export {
    toggleSubscription,
    getMyChannelSubscribers,
    getSubscribedChannels,
    subscribedStatus,
    getSubscribersCount
}
