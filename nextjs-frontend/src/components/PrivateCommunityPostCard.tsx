import {
  AddTweetComment,
  DeleteTweetComment,
  GenerateTweetComment,
  GetTweetLikesCount,
  GetTweetLikeStatus,
  GetTweetComments,
  RepostTweet,
  ToggleTweetLike,
} from "@/APIS";
import { CommunityFeedPost, TweetComment } from "@/types/types";
import { timeAgo } from "@/utills";
import {
  Heart,
  MessageSquare,
  Repeat,
  Send,
  Sparkles,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";

export const PrivateCommunityPostCard = ({
  post,
  userId,
  deleteUserPost,
}: {
  post: CommunityFeedPost;
  userId: string;
  deleteUserPost: (tweetif: string) => void;
}) => {
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<TweetComment[]>(post?.comments || []);
  const [commentText, setCommentText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isReposting, setIsReposting] = useState(false);
  const [isReposted, setIsReposted] = useState(Boolean(post?.repostOf));

  useEffect(() => {
    const loadTweetLikeData = async () => {
      try {
        const [statusResponse, countResponse] = await Promise.all([
          GetTweetLikeStatus(post?._id),
          GetTweetLikesCount(post?._id),
        ]);
        setIsLiked(Boolean(statusResponse?.data?.data?.isLiked));
        setLikeCount(countResponse?.data?.likesCount || 0);
      } catch (error) {
        console.log("Error loading tweet like data: ", error);
      }
    };

    if (post?._id) {
      loadTweetLikeData();
    }
  }, [post?._id]);

  const loadTweetComments = async () => {
    try {
      setIsLoadingComments(true);
      const response = await GetTweetComments(post?._id);
      if (response?.statusCode === 200) {
        setComments(response?.data || []);
      }
    } catch (error) {
      console.log("Error loading tweet comments: ", error);
    } finally {
      setIsLoadingComments(false);
    }
  };

  const addCommentHandler = async () => {
    if (!commentText.trim()) return;
    try {
      const response = await AddTweetComment(post?._id, { content: commentText });
      if (response?.statusCode === 200) {
        setComments((prev) => [response?.data, ...prev]);
        setCommentText("");
      }
    } catch (error) {
      console.log("Error adding tweet comment: ", error);
    }
  };

  const deleteCommentHandler = async (commentId: string) => {
    try {
      const response = await DeleteTweetComment(post?._id, commentId);
      if (response?.statusCode === 200) {
        setComments((prev) =>
          prev.filter((comment) => comment?._id !== commentId)
        );
      }
    } catch (error) {
      console.log("Error deleting tweet comment: ", error);
    }
  };

  const generateCommentHandler = async () => {
    try {
      setIsGenerating(true);
      const response = await GenerateTweetComment(post?._id);
      if (response?.statusCode === 200) {
        setCommentText(response?.data?.comment || "");
      }
    } catch (error) {
      console.log("Error generating tweet comment: ", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleLikeHandler = async () => {
    try {
      const response = await ToggleTweetLike(post?._id);
      if (response?.statusCode === 200) {
        const nextLiked = Boolean(response?.data?.data?.likeStatus);
        setIsLiked(nextLiked);
        setLikeCount((prev) => (nextLiked ? prev + 1 : Math.max(prev - 1, 0)));
      }
    } catch (error) {
      console.log("Error toggling tweet like: ", error);
    }
  };

  const repostHandler = async () => {
    try {
      setIsReposting(true);
      const response = await RepostTweet(post?._id);
      if (response?.statusCode === 200) {
        setIsReposted(true);
      }
    } catch (error) {
      console.log("Error reposting tweet: ", error);
    } finally {
      setIsReposting(false);
    }
  };

  const toggleComments = () => {
    const nextValue = !showComments;
    setShowComments(nextValue);
    if (nextValue) {
      loadTweetComments();
    }
  };

  return (
    <div className="border border-[#3f3f3f] rounded-xl p-4 bg-[#0f0f0f] hover:bg-[#1f1f1f] transition-colors mb-4 relative group">
      <div className="flex gap-3">
        <div className="flex-shrink-0">
          <img 
            src={post?.owner?.avatar} 
            alt={post?.owner?.fullName} 
            className="w-10 h-10 rounded-full object-cover" 
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-bold text-sm text-white">{post?.owner?.fullName}</span>
            <span className="text-[#717171] text-xs">•</span>
            <span className="text-[#717171] text-sm hover:underline cursor-pointer">{timeAgo(post?.createdAt)}</span>
          </div>

          <p className="text-[15px] leading-normal text-white mb-3 whitespace-pre-wrap">
            {post.content}
          </p>

          <div className="flex items-center gap-2 text-[#aaaaaa]">
             <button onClick={toggleComments} className="flex items-center gap-2 hover:text-blue-400 cursor-pointer group p-2 -ml-2 rounded-full hover:bg-blue-500/10 transition-colors">
                <MessageSquare className="w-4 h-4" />
                <span className="text-xs group-hover:text-blue-400">{comments.length}</span>
             </button>
             
             <button
                onClick={repostHandler}
                disabled={isReposting || isReposted}
                className={`flex items-center gap-2 cursor-pointer group p-2 rounded-full transition-colors ${
                  isReposted
                    ? "text-green-400 bg-green-500/10"
                    : "hover:text-green-400 hover:bg-green-500/10"
                }`}
             >
                <Repeat className="w-4 h-4" />
                <span className="text-xs group-hover:text-green-400">
                  {isReposted ? "Reposted" : isReposting ? "Reposting..." : ""}
                </span>
             </button>

             <button
                onClick={toggleLikeHandler}
                className={`flex items-center gap-2 cursor-pointer group p-2 rounded-full transition-colors ${
                  isLiked
                    ? "text-red-500 bg-red-500/10"
                    : "hover:text-red-500 hover:bg-red-500/10"
                }`}
             >
                <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
                <span className="text-xs group-hover:text-red-500">{likeCount}</span>
             </button>
          </div>

          {showComments && (
            <div className="mt-3 border border-[#2f2f2f] rounded-lg p-3 bg-[#151515]">
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addCommentHandler()}
                  placeholder="Write a comment..."
                  className="flex-1 bg-[#0f0f0f] border border-[#333] rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                />
                <button
                  onClick={generateCommentHandler}
                  className="px-3 py-2 text-xs rounded-md bg-purple-700/50 text-purple-100 hover:bg-purple-700/70 flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" />
                  {isGenerating ? "Generating..." : "AI"}
                </button>
                <button
                  onClick={addCommentHandler}
                  disabled={!commentText.trim()}
                  className="px-3 py-2 text-xs rounded-md bg-blue-600 text-white disabled:opacity-50 flex items-center gap-1"
                >
                  <Send className="w-3 h-3" />
                  Post
                </button>
              </div>

              {isLoadingComments ? (
                <div className="text-xs text-[#9f9f9f]">Loading comments...</div>
              ) : comments.length === 0 ? (
                <div className="text-xs text-[#9f9f9f]">No comments yet.</div>
              ) : (
                <div className="space-y-3">
                  {comments.map((comment) => (
                    <div key={comment?._id} className="flex gap-2">
                      <img
                        src={comment?.owner?.avatar}
                        alt={comment?.owner?.fullName}
                        className="w-7 h-7 rounded-full"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <div className="text-xs text-[#bdbdbd]">
                            {comment?.owner?.username} • {timeAgo(comment?.createdAt)}
                          </div>
                          {comment?.owner?._id === userId && (
                            <button
                              onClick={() => deleteCommentHandler(comment?._id)}
                              className="text-[#8f8f8f] hover:text-red-400"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                        <p className="text-sm text-white">{comment?.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {userId && (
          <button 
            onClick={() => deleteUserPost(post?._id)}
            className="text-[#717171] hover:text-red-500 h-fit p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            title="Delete Post"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};
