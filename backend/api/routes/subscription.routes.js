import { Router } from "express";
import {
  getSubscribedChannels,
  toggleSubscription,
  subscribedStatus,
  getSubscribersCount,
  getMyChannelSubscribers,
} from "../controllers/subscription.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

/**
 * 1️⃣ Get channels current user has subscribed to
 * GET /subscriptions/my-subscriptions
 */
router.get("/my-subscriptions", getSubscribedChannels);

/**
 * 2️⃣ Subscribe / Unsubscribe a channel
 * POST /subscriptions/channel/:channelId
 */
router.post("/channel/:channelId", toggleSubscription);

/**
 * 3️⃣ Check subscription status (Subscribe / Subscribed button)
 * GET /subscriptions/channel/:channelId/status
 */
router.get("/channel/:channelId/status", subscribedStatus);

/**
 * 4️⃣ Get subscribers of a channel
 * GET /subscriptions/channel/:channelId/subscribers
 */
router.get("/:channelId/c/subscribers", getMyChannelSubscribers);

/**
 * 5️⃣ Get subscribers count
 * GET /subscriptions/channel/:channelId/subscribers-count
 */
router.get(
  "/channel/:channelId/subscribers-count",
  getSubscribersCount
);

export default router;
