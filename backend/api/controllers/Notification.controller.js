import { Notification } from "../models/Notification.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const insertNotification = asyncHandler(async (req, res) => {
  const { user, type, video, channel, streamTitle, streamUrl } = req.body;

  const notification = await Notification.create({
    user,
    type,
    video,
    channel,
    streamTitle,
    streamUrl,
  });

  return res.status(201).json({
    success: true,
    notification,
  });
});

const getMyNotifications = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const notifications = await Notification.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(20)
    .populate("channel", "username avatar")
    .populate("video", "title thumbnail videoFile");

  return res.status(200).json(
    new ApiResponse(200, notifications, "Notifications fetched successfully")
  );
});

const getUnreadNotificationCount = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const count = await Notification.countDocuments({
    user: userId,
    isRead: false,
  });

  return res.status(200).json(
    new ApiResponse(200, { count }, "Unread count fetched")
  );
});

const markNotificationAsRead = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { notificationId } = req.params;

  await Notification.findOneAndUpdate(
    { _id: notificationId, user: userId },
    { isRead: true }
  );

  return res.status(200).json(
    new ApiResponse(200, {}, "Notification marked as read")
  );
});

const markAllNotificationsAsRead = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  await Notification.updateMany(
    { user: userId, isRead: false },
    { isRead: true }
  );

  return res.status(200).json(
    new ApiResponse(200, {}, "All notifications marked as read")
  );
});

const deleteNotification = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { notificationId } = req.params;

  await Notification.findOneAndDelete({
    _id: notificationId,
    user: userId,
  });

  return res.status(200).json(
    new ApiResponse(200, {}, "Notification deleted")
  );
});

const getMyNotificationsPaginated = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const page = Number(req.query.page) || 1;
  const limit = Math.min(Number(req.query.limit) || 20, 100);
  const skip = (page - 1) * limit;

  const [notifications, total] = await Promise.all([
    Notification.find({ user: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("channel", "username avatar")
      .populate("video", "title thumbnail videoFile"),
    Notification.countDocuments({ user: userId }),
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        notifications,
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total,
      },
      "Notifications fetched"
    )
  );
});

const getMyNewVideoNotifications = asyncHandler(async (req, res) => {
  const userId = req.user._id.toString();
  const { videoId, channelId } = req.query;

  console.log(videoId, channelId);
  const notifications = await Notification.find({
    user: userId,
    type: "VIDEO_UPLOADED",
    video: videoId,
    channel: channelId,
  })
    .sort({ createdAt: -1 })
    .limit(20)
    .populate("channel", "username avatar")
    .populate("video", "title thumbnail videoFile");

  return res.status(200).json(
    new ApiResponse(200, notifications, "Notifications fetched successfully")
  );
});

export {
    insertNotification,
    getMyNotifications,
    getUnreadNotificationCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
    getMyNotificationsPaginated,
    getMyNewVideoNotifications
}
