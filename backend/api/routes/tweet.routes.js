import { Router } from 'express';
import {
    addTweetComment,
    createTweet,
    deleteTweetComment,
    deleteTweet,
    generateTweetComment,
    getTweetComments,
    getUserTweets,
    repostTweet,
    updateTweetComment,
    updateTweet,
} from "../controllers/tweet.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/").post(createTweet);
router.route("/user/:userId").get(getUserTweets);
router.route("/:tweetId/comments").get(getTweetComments).post(addTweetComment);
router.route("/:tweetId/comments/generate").post(generateTweetComment);
router.route("/:tweetId/comments/:commentId").patch(updateTweetComment).delete(deleteTweetComment);
router.route("/:tweetId/repost").post(repostTweet);
router.route("/:tweetId").patch(updateTweet).delete(deleteTweet);

export default router
