import { Tweet } from "../models/tweet.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { llm } from "../GenAI/llm/index.js";

const createTweet = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const userId = req.user._id;

  if (!userId) {
    throw new ApiError(400, "user not found");
  }
  if (!content?.trim()) {
    throw new ApiError(400, "Tweet content is required");
  }

  const tweet = new Tweet({ content: content.trim(), owner: userId });
  await tweet.save();
  await tweet.populate("owner", "_id username fullName avatar");
  if (!tweet) {
    throw new ApiError(500, "Something went wrong while creating a tweet");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, tweet, "Tweet created successfully"));
});

const getUserTweets = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const tweets = await Tweet.find({ owner: userId })
    .populate("owner", "_id username fullName avatar ")
    .populate("comments.owner", "_id username fullName avatar")
    .populate({
      path: "repostOf",
      populate: {
        path: "owner",
        select: "_id username fullName avatar",
      },
    })
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, tweets, "User tweets featched successfully"));
});

const updateTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  const { content } = req.body;
  const tweet = await Tweet.findById(tweetId);

  if (!tweet) {
    throw new ApiError(404, "Tweet not found");
  }

  if (tweet.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not allowed to update this tweet");
  }

  if (!content?.trim()) {
    throw new ApiError(400, "Tweet content is required");
  }

  tweet.content = content.trim();
  await tweet.save();
  await tweet.populate("owner", "_id username fullName avatar");

  return res
    .status(200)
    .json(new ApiResponse(200, tweet, "Tweet updated successfully"));
});

const deleteTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  const tweet = await Tweet.findById(tweetId);

  if (!tweet) {
    throw new ApiError(400, "no tweet found");
  }

  if (tweet.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not allowed to delete this tweet");
  }

  await tweet.deleteOne();
  return res
    .status(200)
    .json(new ApiResponse(200, tweet, "tweet deleted successfully"));
});

const repostTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  const originalTweet = await Tweet.findById(tweetId);

  if (!originalTweet) {
    throw new ApiError(404, "Tweet not found");
  }

  const alreadyReposted = await Tweet.findOne({
    owner: req.user._id,
    repostOf: tweetId,
  })
    .populate("owner", "_id username fullName avatar")
    .populate({
      path: "repostOf",
      populate: {
        path: "owner",
        select: "_id username fullName avatar",
      },
    });

  if (alreadyReposted) {
    return res
      .status(200)
      .json(new ApiResponse(200, alreadyReposted, "Tweet already reposted"));
  }

  const repostedTweet = await Tweet.create({
    content: originalTweet.content,
    owner: req.user._id,
    repostOf: originalTweet._id,
  });

  await repostedTweet.populate("owner", "_id username fullName avatar");
  await repostedTweet.populate({
    path: "repostOf",
    populate: {
      path: "owner",
      select: "_id username fullName avatar",
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, repostedTweet, "Tweet reposted successfully"));
});

const getTweetComments = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  const tweet = await Tweet.findById(tweetId)
    .select("_id comments")
    .populate("comments.owner", "_id username fullName avatar");

  if (!tweet) {
    throw new ApiError(404, "Tweet not found");
  }

  const comments = [...tweet.comments].reverse();

  return res
    .status(200)
    .json(new ApiResponse(200, comments, "Tweet comments fetched successfully"));
});

const addTweetComment = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  const { content } = req.body;

  if (!content?.trim()) {
    throw new ApiError(400, "Comment content is required");
  }

  const tweet = await Tweet.findById(tweetId);

  if (!tweet) {
    throw new ApiError(404, "Tweet not found");
  }

  tweet.comments.push({
    content: content.trim(),
    owner: req.user._id,
  });

  await tweet.save();
  await tweet.populate("comments.owner", "_id username fullName avatar");
  const createdComment = tweet.comments[tweet.comments.length - 1];

  return res
    .status(200)
    .json(new ApiResponse(200, createdComment, "Tweet comment added successfully"));
});

const updateTweetComment = asyncHandler(async (req, res) => {
  const { tweetId, commentId } = req.params;
  const { content } = req.body;

  if (!content?.trim()) {
    throw new ApiError(400, "Comment content is required");
  }

  const tweet = await Tweet.findById(tweetId);

  if (!tweet) {
    throw new ApiError(404, "Tweet not found");
  }

  const comment = tweet.comments.id(commentId);
  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  if (comment.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not allowed to update this comment");
  }

  comment.content = content.trim();
  comment.updatedAt = new Date();
  await tweet.save();
  await tweet.populate("comments.owner", "_id username fullName avatar");
  const updatedComment = tweet.comments.id(commentId);

  return res
    .status(200)
    .json(new ApiResponse(200, updatedComment, "Tweet comment updated successfully"));
});

const deleteTweetComment = asyncHandler(async (req, res) => {
  const { tweetId, commentId } = req.params;
  const tweet = await Tweet.findById(tweetId);

  if (!tweet) {
    throw new ApiError(404, "Tweet not found");
  }

  const comment = tweet.comments.id(commentId);
  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  if (comment.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not allowed to delete this comment");
  }

  comment.deleteOne();
  await tweet.save();

  return res
    .status(200)
    .json(new ApiResponse(200, comment, "Tweet comment deleted successfully"));
});

const generateTweetComment = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  const { query } = req.body || {};

  const tweet = await Tweet.findById(tweetId).populate(
    "comments.owner",
    "_id username fullName avatar"
  );

  if (!tweet) {
    throw new ApiError(404, "Tweet not found");
  }

  const commentsContext = tweet.comments
    .slice(-20)
    .map((comment) => `${comment.owner?.username || "user"}: ${comment.content}`)
    .join("\n");

  const prompt = `
You generate one short social-media comment reply.
Keep it conversational, <= 25 words, and avoid hashtags/emojis unless user asks.

Tweet:
${tweet.content}

Existing comments:
${commentsContext || "No comments yet"}

User instruction (optional):
${query || "Generate a helpful engaging comment."}

Return only the comment text.
`;

  const completion = await llm.invoke([{ role: "user", content: prompt }]);
  const generatedText =
    completion?.content?.toString()?.trim() ||
    "Interesting perspective. Thanks for sharing this!";

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { comment: generatedText },
        "Tweet comment generated successfully"
      )
    );
});

export {
  createTweet,
  getUserTweets,
  updateTweet,
  deleteTweet,
  repostTweet,
  getTweetComments,
  addTweetComment,
  updateTweetComment,
  deleteTweetComment,
  generateTweetComment,
};
