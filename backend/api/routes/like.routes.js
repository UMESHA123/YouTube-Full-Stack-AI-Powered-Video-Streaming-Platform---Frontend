import { Router } from 'express';
import {
    getLikedVideos,
    toggleCommentLike,
    toggleVideoLike,
    toggleTweetLike,
    getVideoLikeStatus,
    getTweetLikeStatus,
    getTweetLikesCount,
    getCommentLikeStatus,
    deleteLikedVideo,
} from "../controllers/like.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/toggle/v/:videoId").post(toggleVideoLike);
router.route("/toggle/c/:commentId").post(toggleCommentLike);
router.route("/toggle/t/:tweetId").post(toggleTweetLike);
router.route("/videos").get(getLikedVideos);
router.delete("/video/:videoId", verifyJWT, deleteLikedVideo);
router.route("/video/like/s/:videoId").get(getVideoLikeStatus);
router.route("/tweet/like/s/:tweetId").get(getTweetLikeStatus);
router.route("/tweet/likes/count/:tweetId").get(getTweetLikesCount);
router.route("/comment/like/s/:commentId").get(getCommentLikeStatus);
export default router
