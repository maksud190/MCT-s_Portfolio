import { useState, useEffect } from "react";
import { API } from "../api/api";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function Comments({ projectId }) {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [replyText, setReplyText] = useState({});
  const [showReplyBox, setShowReplyBox] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [projectId]);

  const fetchComments = async () => {
    try {
      const res = await API.get(`/projects/${projectId}/comments`);
      setComments(res.data);
    } catch (err) {
      console.error("Fetch comments error:", err);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("Please login to comment");
      return;
    }

    if (!newComment.trim()) {
      toast.error("Please enter a comment");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await API.post(
        `/projects/${projectId}/comments`,
        { text: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setNewComment("");
      fetchComments();
      toast.success("Comment added!");
    } catch (err) {
      console.error("Add comment error:", err);
      toast.error("Failed to add comment");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;

    try {
      const token = localStorage.getItem("token");
      await API.delete(`/projects/${projectId}/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      fetchComments();
      toast.success("Comment deleted");
    } catch (err) {
      console.error("Delete comment error:", err);
      toast.error("Failed to delete comment");
    }
  };

  const handleAddReply = async (commentId) => {
    if (!user) {
      toast.error("Please login to reply");
      return;
    }

    const text = replyText[commentId];
    if (!text?.trim()) {
      toast.error("Please enter a reply");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await API.post(
        `/projects/${projectId}/comments/${commentId}/replies`,
        { text },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setReplyText({ ...replyText, [commentId]: "" });
      setShowReplyBox({ ...showReplyBox, [commentId]: false });
      fetchComments();
      toast.success("Reply added!");
    } catch (err) {
      console.error("Add reply error:", err);
      toast.error("Failed to add reply");
    }
  };

  const formatDate = (date) => {
    const now = new Date();
    const commentDate = new Date(date);
    const diffTime = Math.abs(now - commentDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
      if (diffHours === 0) {
        const diffMinutes = Math.floor(diffTime / (1000 * 60));
        return diffMinutes <= 1 ? "Just now" : `${diffMinutes}m ago`;
      }
      return `${diffHours}h ago`;
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return commentDate.toLocaleDateString();
    }
  };

  return (
    <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg p-6">
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Comments ({comments.length})
      </h3>

      {/* Add Comment Form */}
      {user ? (
        <form onSubmit={handleAddComment} className="mb-6">
          <div className="flex gap-3">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.username}
                className="w-10 h-10 rounded-full"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-amber-400 flex items-center justify-center text-white font-bold">
                {user.username?.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                rows="3"
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-400 resize-none"
                disabled={loading}
              />
              <div className="flex justify-end mt-2">
                <button
                  type="submit"
                  disabled={loading || !newComment.trim()}
                  className="px-4 py-2 bg-amber-400 hover:bg-amber-500 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? "Posting..." : "Post Comment"}
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Please login to comment
          </p>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment._id} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-b-0">
            {/* Comment */}
            <div className="flex gap-3">
              {comment.user?.avatar ? (
                <img
                  src={comment.user.avatar}
                  alt={comment.user.username}
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                  {comment.user?.username?.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {comment.user?.username}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDate(comment.createdAt)}
                  </span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {comment.text}
                </p>
                
                {/* Comment Actions */}
                <div className="flex items-center gap-4 mt-2">
                  <button
                    onClick={() =>
                      setShowReplyBox({
                        ...showReplyBox,
                        [comment._id]: !showReplyBox[comment._id],
                      })
                    }
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-amber-500"
                  >
                    Reply
                  </button>
                  {user && (comment.user?._id === user._id) && (
                    <button
                      onClick={() => handleDeleteComment(comment._id)}
                      className="text-sm text-red-600 dark:text-red-400 hover:text-red-700"
                    >
                      Delete
                    </button>
                  )}
                </div>

                {/* Reply Box */}
                {showReplyBox[comment._id] && user && (
                  <div className="mt-3 ml-8">
                    <textarea
                      value={replyText[comment._id] || ""}
                      onChange={(e) =>
                        setReplyText({
                          ...replyText,
                          [comment._id]: e.target.value,
                        })
                      }
                      placeholder="Write a reply..."
                      rows="2"
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-amber-400 resize-none"
                    />
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => handleAddReply(comment._id)}
                        className="px-3 py-1 bg-amber-400 hover:bg-amber-500 text-white rounded text-sm"
                      >
                        Reply
                      </button>
                      <button
                        onClick={() =>
                          setShowReplyBox({
                            ...showReplyBox,
                            [comment._id]: false,
                          })
                        }
                        className="px-3 py-1 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300 rounded text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Replies */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className="mt-4 ml-8 space-y-3">
                    {comment.replies.map((reply, idx) => (
                      <div key={idx} className="flex gap-2">
                        {reply.user?.avatar ? (
                          <img
                            src={reply.user.avatar}
                            alt={reply.user.username}
                            className="w-8 h-8 rounded-full"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-sm font-bold">
                            {reply.user?.username?.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-sm text-gray-900 dark:text-white">
                              {reply.user?.username}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {formatDate(reply.createdAt)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            {reply.text}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {comments.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No comments yet. Be the first to comment!
          </div>
        )}
      </div>
    </div>
  );
}