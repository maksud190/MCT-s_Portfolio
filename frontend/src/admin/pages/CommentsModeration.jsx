import { useState, useEffect } from 'react';
import { API } from '../../api/api';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

export default function CommentsModeration() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchComments();
  }, [currentPage, filter]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await API.get('/admin/comments', {
        params: {
          page: currentPage,
          limit: 20,
          isFlagged: filter
        },
        headers: { Authorization: `Bearer ${token}` }
      });

      setComments(res.data.comments);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error('Error fetching comments:', err);
      toast.error('Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('⚠️ Delete this comment?\n\nThis action cannot be undone.')) return;

    try {
      const token = localStorage.getItem('token');
      await API.delete(`/admin/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success('Comment deleted successfully');
      fetchComments();
    } catch (err) {
      console.error('Error deleting comment:', err);
      toast.error('Failed to delete comment');
    }
  };

  const handleFlagComment = async (commentId, currentStatus) => {
    try {
      const token = localStorage.getItem('token');
      await API.put(`/admin/comments/${commentId}/flag`,
        { 
          isFlagged: !currentStatus,
          flagReason: currentStatus ? '' : 'Flagged by admin'
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(currentStatus ? 'Comment unflagged' : 'Comment flagged');
      fetchComments();
    } catch (err) {
      console.error('Error flagging comment:', err);
      toast.error('Failed to update comment');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Comments Moderation
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage and moderate user comments
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <select
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">All Comments</option>
            <option value="true">Flagged Only</option>
            <option value="false">Not Flagged</option>
          </select>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {loading ? (
          // Loading skeleton
          [...Array(5)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 animate-pulse">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
                <div className="flex-1 space-y-3">
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
                  <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))
        ) : comments.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
            <p className="text-gray-500 dark:text-gray-400">No comments found</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div
              key={comment._id}
              className={`bg-white dark:bg-gray-800 rounded-lg shadow p-6 ${
                comment.isFlagged ? 'border-2 border-red-500' : ''
              }`}
            >
              <div className="flex items-start gap-4">
                {/* User Avatar */}
                <div className="flex-shrink-0">
                  {comment.user?.avatar ? (
                    <img
                      src={comment.user.avatar}
                      alt={comment.user.username}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-gray-700 dark:text-gray-300 font-bold">
                      {comment.user?.username?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                {/* Comment Content */}
                <div className="flex-1 min-w-0">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {comment.user?.username}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(comment.createdAt).toLocaleString()}
                      </p>
                    </div>
                    
                    {comment.isFlagged && (
                      <span className="px-3 py-1 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 rounded-full text-xs font-bold">
                        🚩 Flagged
                      </span>
                    )}
                  </div>

                  {/* Comment Text */}
                  <p className="text-gray-700 dark:text-gray-300 mb-3">
                    {comment.text}
                  </p>

                  {/* Project Link */}
                  {comment.project && (
                    <Link
                      to={`/project/${comment.project._id}`}
                      target="_blank"
                      className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 mb-3"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      View Project: {comment.project.title}
                    </Link>
                  )}

                  {/* Flag Reason */}
                  {comment.isFlagged && comment.flagReason && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-3">
                      <p className="text-sm text-red-800 dark:text-red-400">
                        <span className="font-semibold">Reason:</span> {comment.flagReason}
                      </p>
                    </div>
                  )}

                  {/* Replies Count */}
                  {comment.replies?.length > 0 && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                      💬 {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
                    </p>
                  )}

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleFlagComment(comment._id, comment.isFlagged)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        comment.isFlagged
                          ? 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400'
                      }`}
                    >
                      {comment.isFlagged ? '✓ Unflag' : '🚩 Flag'}
                    </button>
                    
                    <button
                      onClick={() => handleDeleteComment(comment._id)}
                      className="px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 rounded-lg text-sm font-medium transition-colors"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}