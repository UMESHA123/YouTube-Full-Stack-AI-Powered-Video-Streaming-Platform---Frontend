import {
  commentPromptGenerator,
  commentPromptResponseGenerator,
  DeleteVideoComment,
  GetVideoComments,
  PostVideoComment,
  UpdateVideoComment,
} from "@/APIS";
import { useYoutubecontext } from "@/contextAPI/YoutubeContextAPI";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { Comment, VideoPlay } from "@/types/types";
import { timeAgo } from "@/utills";
import { Pen, Send, Sparkles, Trash2 } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import CommentLikeDisLike from "./CommentLikeDisLike";

type CommentSectionType = {
  video: VideoPlay;
};

type ReplyThread = {
  show: boolean;
  items: Comment[];
  page: number;
  hasMore: boolean;
  loading: boolean;
  input: string;
};

const INITIAL_LIMIT = 20;
const REPLY_LIMIT = 10;

const CommentSection: React.FC<CommentSectionType> = ({ video }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsPage, setCommentsPage] = useState(1);
  const [hasMoreComments, setHasMoreComments] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [totalComments, setTotalComments] = useState(0);

  const [aiQuery, setAiQuery] = useState("");
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [postComment, setPostComment] = useState("");
  const [updateComment, setUpdateComment] = useState("");
  const [isPosting, setIsPosting] = useState(true);
  const [commentId, setCommentId] = useState("");
  const [chips, setChips] = useState<string[]>([]);
  const [repliesMap, setRepliesMap] = useState<Record<string, ReplyThread>>({});
  const [editingReplyId, setEditingReplyId] = useState("");
  const [editingReplyText, setEditingReplyText] = useState("");
  const { loginUserDetails } = useYoutubecontext();

  const { sentinelRef } = useInfiniteScroll({
    onLoadMore: async () => {
      await fetchComments(false);
    },
    hasMore: hasMoreComments,
    loading: commentsLoading,
  });

  const resetAll = () => {
    setComments([]);
    setCommentsPage(1);
    setHasMoreComments(true);
    setTotalComments(0);
    setRepliesMap({});
    setAiQuery("");
    setAiResponse("");
    setChips([]);
    setPostComment("");
    setUpdateComment("");
    setCommentId("");
    setIsPosting(true);
    setEditingReplyId("");
    setEditingReplyText("");
  };

  const fetchComments = async (reset = false) => {
    if (!video?._id) return;
    if (commentsLoading && !reset) return;

    const pageToLoad = reset ? 1 : commentsPage;
    try {
      setCommentsLoading(true);
      const response = await GetVideoComments(video._id, {
        page: pageToLoad,
        limit: INITIAL_LIMIT,
      });

      if (response?.statusCode === 200 && response?.success === true) {
        const payload = response?.data || {};
        const incomingComments = payload?.comments || [];
        const incomingHasMore = Boolean(payload?.hasMore);
        const incomingTotal = payload?.totalComments || 0;

        setComments((prev) =>
          reset ? incomingComments : [...prev, ...incomingComments]
        );
        setHasMoreComments(incomingHasMore);
        setTotalComments(incomingTotal);
        setCommentsPage((prev) => (reset ? 2 : prev + 1));
      } else {
        console.error("Failed to fetch comments");
      }
    } catch (error) {
      console.log("Error while fetching comments: ", error);
    } finally {
      setCommentsLoading(false);
    }
  };

  useEffect(() => {
    const initializeComments = async () => {
      if (!video?._id) return;
      resetAll();
      try {
        setCommentsLoading(true);
        const response = await GetVideoComments(video._id, {
          page: 1,
          limit: INITIAL_LIMIT,
        });
        if (response?.statusCode === 200 && response?.success === true) {
          const payload = response?.data || {};
          const incomingComments = payload?.comments || [];
          setComments(incomingComments);
          setHasMoreComments(Boolean(payload?.hasMore));
          setTotalComments(payload?.totalComments || 0);
          setCommentsPage(2);
        }
      } catch (error) {
        console.log("Error while fetching initial comments: ", error);
      } finally {
        setCommentsLoading(false);
      }
    };
    initializeComments();
  }, [video?._id]);

  useEffect(() => {
    const getCommentPrompt = async () => {
      if (!video?._id) return;
      try {
        const response = await commentPromptGenerator(video._id);
        if (response?.statusCode === 200) {
          setChips(response?.data?.response[0]?.keywords || []);
        }
      } catch (error) {
        console.log("comment prompt generate error: ", error);
      }
    };
    getCommentPrompt();
  }, [video?._id]);

  const handleAiQuery = async (query: string) => {
    try {
      setIsLoading(true);
      const response = await commentPromptResponseGenerator(
        query || aiQuery,
        video?._id || ""
      );
      if (response?.statusCode === 200) {
        setAiResponse(response?.data?.kwargs?.content);
      }
    } catch (error) {
      console.log("error while generating a comment prompt: frontend: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCommentSubmit = async () => {
    if (isPosting) {
      if (postComment.trim() === "") return;
      const response = await PostVideoComment(video?._id || "", {
        content: postComment,
      });

      if (response?.statusCode === 200 && response?.success === true) {
        setComments((prev) => [response.data, ...prev]);
        setTotalComments((prev) => prev + 1);
      }
    } else {
      if (updateComment.trim() === "") return;
      const response = await UpdateVideoComment(commentId || "", {
        content: updateComment,
      });
      if (response?.statusCode === 200 && response?.success === true) {
        setComments((prev) =>
          prev.map((comment) =>
            comment._id === response.data._id ? response.data : comment
          )
        );
      }
      setIsPosting(true);
    }
    setPostComment("");
    setUpdateComment("");
  };

  const deleteVideoCommentHandler = async (targetCommentId: string) => {
    try {
      const response = await DeleteVideoComment(targetCommentId);
      if (response?.statusCode === 200 && response?.success === true) {
        setComments((prev) => prev.filter((comment) => comment._id !== targetCommentId));
        setTotalComments((prev) => Math.max(prev - 1, 0));
        setRepliesMap((prev) => {
          const next = { ...prev };
          delete next[targetCommentId];
          return next;
        });
      }
    } catch (error) {
      console.log("error while deleting comment: ", error);
    }
  };

  const loadReplies = async (parentCommentId: string, reset = false) => {
    const current = repliesMap[parentCommentId] || {
      show: true,
      items: [],
      page: 1,
      hasMore: true,
      loading: false,
      input: "",
    };

    if (current.loading) return;
    if (!reset && !current.hasMore) return;

    const pageToLoad = reset ? 1 : current.page;

    setRepliesMap((prev) => ({
      ...prev,
      [parentCommentId]: {
        ...current,
        loading: true,
        show: true,
      },
    }));

    try {
      const response = await GetVideoComments(video?._id || "", {
        page: pageToLoad,
        limit: REPLY_LIMIT,
        parentComment: parentCommentId,
      });

      if (response?.statusCode === 200 && response?.success === true) {
        const payload = response?.data || {};
        const incomingReplies = payload?.comments || [];
        const incomingHasMore = Boolean(payload?.hasMore);

        setRepliesMap((prev) => {
          const latest = prev[parentCommentId] || current;
          return {
            ...prev,
            [parentCommentId]: {
              ...latest,
              show: true,
              loading: false,
              items: reset ? incomingReplies : [...latest.items, ...incomingReplies],
              page: reset ? 2 : latest.page + 1,
              hasMore: incomingHasMore,
            },
          };
        });
      } else {
        setRepliesMap((prev) => ({
          ...prev,
          [parentCommentId]: {
            ...current,
            loading: false,
          },
        }));
      }
    } catch (error) {
      console.log("Error loading replies: ", error);
      setRepliesMap((prev) => ({
        ...prev,
        [parentCommentId]: {
          ...current,
          loading: false,
        },
      }));
    }
  };

  const toggleReplies = async (parentCommentId: string) => {
    const current = repliesMap[parentCommentId];
    if (!current) {
      await loadReplies(parentCommentId, true);
      return;
    }
    if (!current.show) {
      if (current.items.length === 0) {
        await loadReplies(parentCommentId, true);
        return;
      }
      setRepliesMap((prev) => ({
        ...prev,
        [parentCommentId]: {
          ...current,
          show: true,
        },
      }));
      return;
    }
    setRepliesMap((prev) => ({
      ...prev,
      [parentCommentId]: {
        ...current,
        show: false,
      },
    }));
  };

  const handleReplyInput = (parentCommentId: string, value: string) => {
    const current = repliesMap[parentCommentId] || {
      show: true,
      items: [],
      page: 1,
      hasMore: true,
      loading: false,
      input: "",
    };
    setRepliesMap((prev) => ({
      ...prev,
      [parentCommentId]: {
        ...current,
        input: value,
      },
    }));
  };

  const submitReply = async (parentCommentId: string) => {
    const current = repliesMap[parentCommentId];
    if (!current?.input?.trim()) return;

    try {
      const response = await PostVideoComment(video?._id || "", {
        content: current.input.trim(),
        parentComment: parentCommentId,
      });
      if (response?.statusCode === 200 && response?.success === true) {
        setRepliesMap((prev) => {
          const latest = prev[parentCommentId] || current;
          return {
            ...prev,
            [parentCommentId]: {
              ...latest,
              items: [response.data, ...latest.items],
              input: "",
              show: true,
            },
          };
        });
        setComments((prev) =>
          prev.map((comment) =>
            comment._id === parentCommentId
              ? { ...comment, repliesCount: (comment.repliesCount || 0) + 1 }
              : comment
          )
        );
      }
    } catch (error) {
      console.log("Error while posting reply: ", error);
    }
  };

  const startEditReply = (reply: Comment) => {
    setEditingReplyId(reply._id);
    setEditingReplyText(reply.content);
  };

  const saveReplyEdit = async (parentCommentId: string) => {
    if (!editingReplyId || !editingReplyText.trim()) return;
    try {
      const response = await UpdateVideoComment(editingReplyId, {
        content: editingReplyText.trim(),
      });
      if (response?.statusCode === 200 && response?.success === true) {
        setRepliesMap((prev) => {
          const thread = prev[parentCommentId];
          if (!thread) return prev;
          return {
            ...prev,
            [parentCommentId]: {
              ...thread,
              items: thread.items.map((reply) =>
                reply._id === editingReplyId ? response.data : reply
              ),
            },
          };
        });
        setEditingReplyId("");
        setEditingReplyText("");
      }
    } catch (error) {
      console.log("Error while updating reply: ", error);
    }
  };

  const deleteReply = async (parentCommentId: string, replyId: string) => {
    try {
      const response = await DeleteVideoComment(replyId);
      if (response?.statusCode === 200 && response?.success === true) {
        setRepliesMap((prev) => {
          const thread = prev[parentCommentId];
          if (!thread) return prev;
          return {
            ...prev,
            [parentCommentId]: {
              ...thread,
              items: thread.items.filter((reply) => reply._id !== replyId),
            },
          };
        });
        setComments((prev) =>
          prev.map((comment) =>
            comment._id === parentCommentId
              ? { ...comment, repliesCount: Math.max((comment.repliesCount || 1) - 1, 0) }
              : comment
          )
        );
      }
    } catch (error) {
      console.log("Error while deleting reply: ", error);
    }
  };

  const commentsHeaderText = useMemo(() => {
    return `${totalComments} Comments`;
  }, [totalComments]);

  return (
    <div className="mt-6">
      <div className="flex items-center gap-6 mb-6">
        <h3 className="text-xl font-bold text-white">{commentsHeaderText}</h3>
      </div>

      <div className="bg-[#1a1a1a] border border-purple-500/30 rounded-xl p-4 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span className="text-sm font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            AI Insight
          </span>
        </div>

        <div className="relative">
          <input
            type="text"
            value={aiQuery}
            onChange={(e) => setAiQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAiQuery(aiQuery)}
            placeholder="Ask AI about these comments..."
            className="w-full bg-[#0f0f0f] border border-[#333] rounded-lg px-4 py-2 text-sm text-white focus:border-purple-500 focus:outline-none pr-10"
          />
          <button
            onClick={() => handleAiQuery(aiQuery)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-purple-400 hover:text-purple-300"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        {isLoading && (
          <div className="mt-3 text-sm text-gray-400 animate-pulse">Analyzing comments...</div>
        )}
        {aiResponse && !isLoading && (
          <div className="mt-3 text-sm text-purple-100 bg-purple-900/20 p-3 rounded-lg border border-purple-500/20">
            {aiResponse}
          </div>
        )}

        {!aiResponse && (
          <div className="flex flex-wrap gap-2 mt-3">
            {chips.map((chip) => (
              <button
                key={chip}
                onClick={() => handleAiQuery(chip)}
                className="px-3 py-1 bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-full text-xs text-gray-300 border border-[#333] transition-colors"
              >
                {chip}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="bg-[#1a1a1a] border border-purple-500/30 rounded-xl p-4 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            {isPosting ? "Add" : "Edit"} Comment
          </span>
        </div>

        <div className="relative">
          <input
            type="text"
            value={isPosting ? postComment : updateComment}
            onChange={(e) =>
              isPosting ? setPostComment(e.target.value) : setUpdateComment(e.target.value)
            }
            onKeyDown={(e) => e.key === "Enter" && handleCommentSubmit()}
            placeholder={`${isPosting ? "Add" : "Edit"} your comment...`}
            className="w-full bg-[#0f0f0f] border border-[#333] rounded-lg px-4 py-2 text-sm text-white focus:border-purple-500 focus:outline-none pr-10"
          />
          <button
            onClick={() => handleCommentSubmit()}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-purple-400 hover:text-purple-300"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {comments.map((comment) => {
          const thread = repliesMap[comment._id];
          return (
            <div key={comment._id} className="flex gap-4 group">
              <img src={comment?.owner?.avatar} alt={comment?.owner?.fullName} className="w-10 h-10 rounded-full" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-white">{comment?.owner?.username}</span>
                  <span className="text-xs text-gray-500">{timeAgo(comment?.createdAt)}</span>
                </div>
                <p className="text-sm text-gray-200 leading-relaxed mb-2">{comment.content}</p>
                <div className="flex items-center gap-4 text-xs font-medium text-gray-400">
                  <CommentLikeDisLike commentId={comment?._id} />
                  {comment?.owner?._id === loginUserDetails?._id && (
                    <div className="cursor-pointer hover:bg-[#222] p-1 rounded">
                      <Pen
                        className="w-4 h-4"
                        onClick={() => {
                          setIsPosting(false);
                          setUpdateComment(comment.content);
                          setCommentId(comment?._id);
                        }}
                      />
                    </div>
                  )}
                  {comment?.owner?._id === loginUserDetails?._id && (
                    <div className="cursor-pointer hover:bg-[#222] p-1 rounded">
                      <Trash2
                        className="w-4 h-4"
                        onClick={() => deleteVideoCommentHandler(comment?._id)}
                      />
                    </div>
                  )}
                  <button
                    onClick={() => toggleReplies(comment._id)}
                    className="hover:bg-[#222] px-2 py-1 rounded hover:text-white"
                  >
                    Reply
                  </button>
                  {(comment.repliesCount || 0) > 0 && (
                    <button
                      onClick={() => toggleReplies(comment._id)}
                      className="hover:bg-[#222] px-2 py-1 rounded hover:text-white"
                    >
                      {thread?.show ? "Hide replies" : `Show replies (${comment.repliesCount})`}
                    </button>
                  )}
                </div>

                {thread?.show && (
                  <div className="mt-3 space-y-3">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={thread?.input || ""}
                        onChange={(e) => handleReplyInput(comment._id, e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && submitReply(comment._id)}
                        placeholder="Write a reply..."
                        className="flex-1 bg-[#0f0f0f] border border-[#333] rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
                      />
                      <button
                        onClick={() => submitReply(comment._id)}
                        className="px-3 py-2 text-xs rounded-md bg-purple-700/50 text-purple-100 hover:bg-purple-700/70"
                      >
                        Reply
                      </button>
                    </div>

                    {(thread?.items || []).map((reply) => (
                      <div key={reply._id} className="flex gap-3 ml-6">
                        <img
                          src={reply.owner?.avatar}
                          alt={reply.owner?.username}
                          className="w-8 h-8 rounded-full"
                        />
                        <div className="flex-1">
                          <p className="text-xs text-gray-400">
                            {reply.owner?.username} • {timeAgo(reply.createdAt)}
                          </p>
                          {editingReplyId === reply._id ? (
                            <div className="mt-1 flex gap-2">
                              <input
                                type="text"
                                value={editingReplyText}
                                onChange={(e) => setEditingReplyText(e.target.value)}
                                className="flex-1 bg-[#0f0f0f] border border-[#333] rounded-md px-2 py-1 text-xs text-white focus:outline-none"
                              />
                              <button
                                onClick={() => saveReplyEdit(comment._id)}
                                className="text-xs px-2 py-1 bg-blue-600 text-white rounded"
                              >
                                Save
                              </button>
                            </div>
                          ) : (
                            <p className="text-sm text-gray-200">{reply.content}</p>
                          )}
                          <div className="flex items-center gap-3 mt-1">
                            <CommentLikeDisLike commentId={reply._id} />
                            {reply?.owner?._id === loginUserDetails?._id && (
                              <button
                                className="text-xs text-gray-400 hover:text-white"
                                onClick={() => startEditReply(reply)}
                              >
                                Edit
                              </button>
                            )}
                            {reply?.owner?._id === loginUserDetails?._id && (
                              <button
                                className="text-xs text-gray-400 hover:text-red-400"
                                onClick={() => deleteReply(comment._id, reply._id)}
                              >
                                Delete
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}

                    {thread?.hasMore && (
                      <button
                        onClick={() => loadReplies(comment._id)}
                        disabled={thread.loading}
                        className="ml-6 text-xs text-blue-400 hover:text-blue-300"
                      >
                        {thread.loading ? "Loading..." : "Load more replies"}
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        <div ref={sentinelRef} className="h-4 w-full" />
        {commentsLoading && (
          <div className="text-sm text-gray-400">Loading more comments...</div>
        )}
        {!hasMoreComments && comments.length > 0 && (
          <div className="text-sm text-gray-500">No more comments.</div>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
