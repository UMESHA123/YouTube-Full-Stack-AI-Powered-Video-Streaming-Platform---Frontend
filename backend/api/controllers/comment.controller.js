import mongoose from "mongoose";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { llm } from "../GenAI/llm/index.js";
import { YoutubeState } from "./video.controller.js";
import { CommentPromptGeneratorNode } from "../GenAI/node/index.js";
import { END, START, StateGraph } from "@langchain/langgraph";

const getVideoComments = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const pageNumber = Number(req.query.page) || 1;
  const limitNumber = Number(req.query.limit) || 10;
  const { parentComment } = req.query;
  const skip = (pageNumber - 1) * limitNumber;

  const query = { video: videoId };

  if (parentComment) {
    query.parentComment = parentComment;
  } else {
    query.parentComment = null;
  }

  const [comments, totalComments] = await Promise.all([
    Comment.find(query)
    .populate("owner", "_id username fullname avatar ")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNumber),
    Comment.countDocuments(query),
  ]);

  if (!comments) {
    throw new ApiError(404, "Comments not found");
  }

  const commentIds = comments.map((comment) => comment._id);
  const repliesCountAgg = await Comment.aggregate([
    { $match: { parentComment: { $in: commentIds } } },
    { $group: { _id: "$parentComment", count: { $sum: 1 } } },
  ]);

  const repliesCountMap = repliesCountAgg.reduce((acc, item) => {
    acc[item._id.toString()] = item.count;
    return acc;
  }, {});

  const commentsWithRepliesMeta = comments.map((comment) => ({
    ...comment.toObject(),
    repliesCount: repliesCountMap[comment._id.toString()] || 0,
  }));

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {
          comments: commentsWithRepliesMeta,
          page: pageNumber,
          limit: limitNumber,
          totalComments,
          hasMore: skip + comments.length < totalComments,
          parentComment: parentComment || null,
        },
        "Comments Retrieved"
      )
    );
});

const addComment = asyncHandler(async (req, res) => {
  const { content, parentComment } = req.body;
  const { videoId } = req.params;

  if (!content) {
    throw new ApiError(400, "Comment is required");
  }
  if (!videoId) {
    throw new ApiError(500, "Something went wrong.");
  }

  if (parentComment) {
    const parent = await Comment.findOne({ _id: parentComment, video: videoId });
    if (!parent) {
      throw new ApiError(400, "Invalid parent comment");
    }
  }

  const comment = await Comment.create({
    content: content,
    video: videoId,
    parentComment: parentComment || null,
    owner: req.user._id,
  });

  const populatedComment = await comment.populate(
    "owner",
    "_id username fullname avatar"
  );

  if (!populatedComment) {
    throw new ApiError(500, "Something went wrong");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, populatedComment, "Comment created successfully")
    );
});

const updateComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;

  if (!content) {
    throw new ApiError(400, "Comment content is required.");
  }

  if (!commentId) {
    throw new ApiError(500, "Something went wrong");
  }

  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  if (comment.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not allowed to update this comment.");
  }

  comment.content = content;
  await comment.save();

  const updatedComment = await comment?.populate(
    "owner",
    "_id username fullname avatar"
  );

  if (!updatedComment) {
    throw new ApiError(500, "Something went wrong");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedComment, "Comment updated successfully"));
});

const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  if (!commentId) {
    throw new ApiError(500, "Something went wrong");
  }
  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  if (comment.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not allowed to delete this comment.");
  }

  await Comment.deleteMany({
    $or: [{ _id: commentId }, { parentComment: commentId }],
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, comment, "Commentd deleted successfully")
    );
});

const generateManualQueryAns = asyncHandler(async (req, res) => {
  const { query } = req.query;
  const { videoId } = req.params;
  if (!videoId) {
    throw new ApiError(500, "Something went wrong.");
  }
  const items = await Comment.find({ video: videoId });
  const combinedString = items.map((item) => item.content).join(" ");

  if (!combinedString) {
    throw new ApiError(500, "Something went wrong");
  }

  const completion = await llm.invoke([
    {
      role: "user",
      content: `
                You must answer ONLY using the comment context below.
                If the answer is not present, reply: "Not available in the comment."
  
                User Question:
                ${query}
  
                comment Context:
                ${combinedString}
            `,
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        completion,
        "comment manual ans response generated successfully"
      )
    );
});

const CommentPromptGenerater = asyncHandler(async (req, res) => {
  try {
    // const { que } = req.body;
    // console.log(url);

    // if (!url) {
    //   throw new ApiError(404, "transcript file is required");
    // }
    const { videoId } = req.params;
    if (!videoId) {
      throw new ApiError(500, "Something went wrong.");
    }

    const graph = new StateGraph(YoutubeState)
      .addNode("CommentPromptGeneratorNode", CommentPromptGeneratorNode)
      .addEdge(START, "CommentPromptGeneratorNode")
      .addEdge("CommentPromptGeneratorNode", END)
      .compile();

    const graphRes = await graph.invoke({
      // query: `${query}`
      query: videoId,
    });

    console.log("comment graph response: ", graphRes);
    return res
      .status(200)
      .json(
        new ApiResponse(200, graphRes, "comment prompt generated successfully")
      );
  } catch (error) {
    console.log("Error in fetching comment prompt: ", error);
    throw new ApiError(
      500,
      "Internal server error in fetching comment prompts"
    );
  }
});

export {
  getVideoComments,
  addComment,
  updateComment,
  deleteComment,
  generateManualQueryAns,
  CommentPromptGenerater,
};
