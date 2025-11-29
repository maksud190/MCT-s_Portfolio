// pages/admin/ForumModeration.jsx
import { useState, useEffect } from "react";
import { API } from "../../api/api";
import { toast } from "sonner";
import { Link } from "react-router-dom";

export default function ForumModeration() {
  const [activeTab, setActiveTab] = useState("questions"); // questions, answers, reports
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalQuestions: 0,
    totalAnswers: 0,
    solvedQuestions: 0,
    unsolvedQuestions: 0,
    flaggedContent: 0
  });
  
  // Filters
  const [questionFilter, setQuestionFilter] = useState("all"); // all, solved, unsolved, flagged
  const [answerFilter, setAnswerFilter] = useState("all"); // all, best, flagged
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchStats();
    if (activeTab === "questions") {
      fetchQuestions();
    } else if (activeTab === "answers") {
      fetchAnswers();
    }
  }, [activeTab, questionFilter, answerFilter, currentPage]);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get("/admin/forum/stats", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(res.data);
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await API.get("/admin/forum/questions", {
        params: { filter: questionFilter, page: currentPage, limit: 10 },
        headers: { Authorization: `Bearer ${token}` }
      });
      setQuestions(res.data.questions);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error("Error fetching questions:", err);
      toast.error("Failed to load questions");
    } finally {
      setLoading(false);
    }
  };

  const fetchAnswers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await API.get("/admin/forum/answers", {
        params: { filter: answerFilter, page: currentPage, limit: 10 },
        headers: { Authorization: `Bearer ${token}` }
      });
      setAnswers(res.data.answers);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error("Error fetching answers:", err);
      toast.error("Failed to load answers");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQuestion = async (questionId, title) => {
    if (!window.confirm(`Delete question "${title}"?\n\nThis will delete all answers and cannot be undone.`)) return;

    try {
      const token = localStorage.getItem("token");
      await API.delete(`/admin/forum/questions/${questionId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Question deleted!");
      fetchQuestions();
      fetchStats();
    } catch (err) {
      console.error("Error deleting question:", err);
      toast.error("Failed to delete question");
    }
  };

  const handleDeleteAnswer = async (answerId) => {
    if (!window.confirm("Delete this answer?\n\nThis action cannot be undone.")) return;

    try {
      const token = localStorage.getItem("token");
      await API.delete(`/admin/forum/answers/${answerId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Answer deleted!");
      fetchAnswers();
      fetchStats();
    } catch (err) {
      console.error("Error deleting answer:", err);
      toast.error("Failed to delete answer");
    }
  };

  const handleFlagQuestion = async (questionId) => {
    const reason = prompt("Enter flag reason (optional):");
    
    try {
      const token = localStorage.getItem("token");
      await API.put(
        `/admin/forum/questions/${questionId}/flag`,
        { reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Question flagged!");
      fetchQuestions();
      fetchStats();
    } catch (err) {
      console.error("Error flagging question:", err);
      toast.error("Failed to flag question");
    }
  };

  const handleUnflagQuestion = async (questionId) => {
    try {
      const token = localStorage.getItem("token");
      await API.put(
        `/admin/forum/questions/${questionId}/unflag`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Question unflagged!");
      fetchQuestions();
      fetchStats();
    } catch (err) {
      console.error("Error unflagging question:", err);
      toast.error("Failed to unflag question");
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                Forum Moderation
              </h1>
              <p className="text-gray-600 mt-1">Manage questions, answers, and forum content</p>
            </div>
            <Link
              to="/forum"
              className="px-4 py-2 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-xl font-semibold transition-all flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              View Forum
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border-2 border-blue-200">
              <div className="text-2xl font-black text-blue-700">{stats.totalQuestions}</div>
              <div className="text-sm text-blue-600 font-semibold">Total Questions</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border-2 border-green-200">
              <div className="text-2xl font-black text-green-700">{stats.solvedQuestions}</div>
              <div className="text-sm text-green-600 font-semibold">Solved</div>
            </div>
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-4 border-2 border-yellow-200">
              <div className="text-2xl font-black text-yellow-700">{stats.unsolvedQuestions}</div>
              <div className="text-sm text-yellow-600 font-semibold">Unsolved</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border-2 border-purple-200">
              <div className="text-2xl font-black text-purple-700">{stats.totalAnswers}</div>
              <div className="text-sm text-purple-600 font-semibold">Total Answers</div>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-4 border-2 border-red-200">
              <div className="text-2xl font-black text-red-700">{stats.flaggedContent}</div>
              <div className="text-sm text-red-600 font-semibold">Flagged Items</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-200 mb-6">
          <div className="flex border-b-2 border-gray-200">
            <button
              onClick={() => {
                setActiveTab("questions");
                setCurrentPage(1);
              }}
              className={`flex-1 px-6 py-4 font-bold text-lg transition-all ${
                activeTab === "questions"
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-tl-2xl"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Questions ({stats.totalQuestions})
              </div>
            </button>
            <button
              onClick={() => {
                setActiveTab("answers");
                setCurrentPage(1);
              }}
              className={`flex-1 px-6 py-4 font-bold text-lg transition-all ${
                activeTab === "answers"
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-tr-2xl"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
                Answers ({stats.totalAnswers})
              </div>
            </button>
          </div>

          {/* Questions Tab */}
          {activeTab === "questions" && (
            <div className="p-6">
              {/* Filter */}
              <div className="flex items-center gap-3 mb-6">
                <label className="text-sm font-bold text-gray-700">Filter:</label>
                <select
                  value={questionFilter}
                  onChange={(e) => {
                    setQuestionFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 font-semibold"
                >
                  <option value="all">All Questions</option>
                  <option value="solved">Solved</option>
                  <option value="unsolved">Unsolved</option>
                  <option value="flagged">Flagged</option>
                </select>
              </div>

              {/* Questions List */}
              {loading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="bg-gray-100 rounded-xl p-6 animate-pulse">
                      <div className="h-4 bg-gray-300 rounded w-3/4 mb-3"></div>
                      <div className="h-3 bg-gray-300 rounded w-full mb-2"></div>
                      <div className="h-3 bg-gray-300 rounded w-5/6"></div>
                    </div>
                  ))}
                </div>
              ) : questions.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-5xl">📭</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No Questions Found</h3>
                  <p className="text-gray-600">No questions match the selected filter</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {questions.map((question) => (
                    <div
                      key={question._id}
                      className={`rounded-xl p-6 border-2 transition-all ${
                        question.isFlagged
                          ? "bg-red-50 border-red-300"
                          : "bg-gray-50 border-gray-200 hover:border-blue-300"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Link
                              to={`/forum/questions/${question._id}`}
                              target="_blank"
                              className="text-lg font-bold text-gray-900 hover:text-blue-600 transition-colors"
                            >
                              {question.title}
                            </Link>
                            {question.isSolved && (
                              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                                ✅ Solved
                              </span>
                            )}
                            {question.isPoll && (
                              <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-full">
                                📊 Poll
                              </span>
                            )}
                            {question.isFlagged && (
                              <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full">
                                🚩 Flagged
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-700 mb-3 line-clamp-2">{question.content}</p>
                          
                          {/* Categories & Tags */}
                          <div className="flex flex-wrap gap-2 mb-3">
                            {question.categories?.slice(0, 3).map((cat, idx) => (
                              <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-lg">
                                {cat}
                              </span>
                            ))}
                            {question.tags?.slice(0, 3).map((tag, idx) => (
                              <span key={idx} className="px-2 py-1 bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg">
                                #{tag}
                              </span>
                            ))}
                          </div>

                          {/* Author & Stats */}
                          <div className="flex items-center gap-4 text-xs text-gray-600">
                            <span className="font-semibold">
                              👤 {question.author?.username || "Unknown"}
                            </span>
                            <span>👍 {question.upvotes?.length || 0}</span>
                            <span>👎 {question.downvotes?.length || 0}</span>
                            <span>💬 {question.answersCount || 0} answers</span>
                            <span>👁️ {question.views || 0} views</span>
                            <span>{formatDate(question.createdAt)}</span>
                          </div>

                          {question.isFlagged && question.flagReason && (
                            <div className="mt-3 p-3 bg-red-100 border-2 border-red-300 rounded-lg">
                              <p className="text-sm font-semibold text-red-700">
                                <span className="font-bold">Flag Reason:</span> {question.flagReason}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 pt-3 border-t-2 border-gray-200">
                        <Link
                          to={`/forum/questions/${question._id}`}
                          target="_blank"
                          className="px-3 py-2 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg text-sm font-semibold transition-all flex items-center gap-1"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          View
                        </Link>
                        
                        {question.isFlagged ? (
                          <button
                            onClick={() => handleUnflagQuestion(question._id)}
                            className="px-3 py-2 bg-green-100 text-green-700 hover:bg-green-200 rounded-lg text-sm font-semibold transition-all flex items-center gap-1"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Unflag
                          </button>
                        ) : (
                          <button
                            onClick={() => handleFlagQuestion(question._id)}
                            className="px-3 py-2 bg-yellow-100 text-yellow-700 hover:bg-yellow-200 rounded-lg text-sm font-semibold transition-all flex items-center gap-1"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                            </svg>
                            Flag
                          </button>
                        )}

                        <button
                          onClick={() => handleDeleteQuestion(question._id, question.title)}
                          className="px-3 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg text-sm font-semibold transition-all flex items-center gap-1"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-white border-2 border-gray-200 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    ← Previous
                  </button>
                  <span className="px-4 py-2 text-sm font-bold text-gray-700">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-white border-2 border-gray-200 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    Next →
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Answers Tab */}
          {activeTab === "answers" && (
            <div className="p-6">
              {/* Filter */}
              <div className="flex items-center gap-3 mb-6">
                <label className="text-sm font-bold text-gray-700">Filter:</label>
                <select
                  value={answerFilter}
                  onChange={(e) => {
                    setAnswerFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 font-semibold"
                >
                  <option value="all">All Answers</option>
                  <option value="best">Best Answers</option>
                  <option value="recent">Recent Answers</option>
                </select>
              </div>

              {/* Answers List */}
              {loading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="bg-gray-100 rounded-xl p-6 animate-pulse">
                      <div className="h-3 bg-gray-300 rounded w-full mb-2"></div>
                      <div className="h-3 bg-gray-300 rounded w-5/6"></div>
                    </div>
                  ))}
                </div>
              ) : answers.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-5xl">💬</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No Answers Found</h3>
                  <p className="text-gray-600">No answers match the selected filter</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {answers.map((answer) => (
                    <div
                      key={answer._id}
                      className="bg-gray-50 border-2 border-gray-200 hover:border-purple-300 rounded-xl p-6 transition-all"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          {answer.isBestAnswer && (
                            <span className="inline-block px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full mb-2">
                              ⭐ Best Answer
                            </span>
                          )}
                          <p className="text-sm text-gray-700 mb-3 line-clamp-3">{answer.content}</p>
                          
                          {/* Question Link */}
                          {answer.question && (
                            <Link
                              to={`/forum/questions/${answer.question._id}`}
                              target="_blank"
                              className="text-sm font-semibold text-blue-600 hover:text-blue-700 mb-2 inline-block"
                            >
                              Question: {answer.question.title}
                            </Link>
                          )}

                          {/* Author & Stats */}
                          <div className="flex items-center gap-4 text-xs text-gray-600 mt-2">
                            <span className="font-semibold">
                              👤 {answer.author?.username || "Unknown"}
                            </span>
                            <span>👍 {answer.upvotes?.length || 0}</span>
                            <span>👎 {answer.downvotes?.length || 0}</span>
                            <span>💬 {answer.replies?.length || 0} replies</span>
                            <span>{formatDate(answer.createdAt)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 pt-3 border-t-2 border-gray-200">
                        <Link
                          to={`/forum/questions/${answer.question?._id}`}
                          target="_blank"
                          className="px-3 py-2 bg-purple-100 text-purple-700 hover:bg-purple-200 rounded-lg text-sm font-semibold transition-all flex items-center gap-1"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          View Question
                        </Link>

                        <button
                          onClick={() => handleDeleteAnswer(answer._id)}
                          className="px-3 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg text-sm font-semibold transition-all flex items-center gap-1"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-white border-2 border-gray-200 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    ← Previous
                  </button>
                  <span className="px-4 py-2 text-sm font-bold text-gray-700">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-white border-2 border-gray-200 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    Next →
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}