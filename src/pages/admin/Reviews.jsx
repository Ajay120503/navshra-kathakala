import { useEffect, useState } from "react";
import {
  Star,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  Search,
  Trash2,
  MessageSquare,
  Eye,
  Filter,
  Image as ImageIcon,
  Film,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../../api/axios";

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });
  const [statusFilter, setStatusFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [selectedReview, setSelectedReview] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [actionLoading, setActionLoading] = useState(null);

  const fetchReviews = async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "20",
      });
      if (statusFilter) params.append("status", statusFilter);
      if (searchQuery) params.append("search", searchQuery);

      const { data } = await api.get(`/reviews?${params.toString()}`);
      setReviews(data.data?.reviews || []);
      setPagination({
        page: data.pagination?.page || page,
        limit: 20,
        total: data.pagination?.total || 0,
        pages: data.pagination?.pages || 0,
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews(1);
  }, [statusFilter, searchQuery]);

  const handleStatusChange = async (id, status) => {
    setActionLoading(id);
    try {
      await api.put(`/reviews/${id}/status`, { status });
      setReviews(reviews.map((r) => (r._id === id ? { ...r, status } : r)));
      toast.success(`Review ${status}`);
    } catch (err) {
      toast.error("Failed to update review");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    setActionLoading(id);
    try {
      await api.delete(`/reviews/${id}`);
      setReviews(reviews.filter((r) => r._id !== id));
      toast.success("Review deleted");
      setPagination((prev) => ({ ...prev, total: prev.total - 1 }));
    } catch (err) {
      toast.error("Failed to delete review");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReply = async () => {
    if (!selectedReview || !replyText.trim()) return;
    setActionLoading(selectedReview._id);
    try {
      await api.put(`/reviews/${selectedReview._id}/status`, {
        status: selectedReview.status,
        adminReply: replyText.trim(),
      });
      setReviews(
        reviews.map((r) =>
          r._id === selectedReview._id
            ? { ...r, adminReply: replyText.trim() }
            : r
        )
      );
      toast.success("Reply added");
      setShowReplyModal(false);
      setReplyText("");
      setSelectedReview(null);
    } catch (err) {
      toast.error("Failed to add reply");
    } finally {
      setActionLoading(null);
    }
  };

  const openReplyModal = (review) => {
    setSelectedReview(review);
    setReplyText(review.adminReply || "");
    setShowReplyModal(true);
  };

  const openDetailModal = (review) => {
    setSelectedReview(review);
    setShowDetailModal(true);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(searchInput);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      fetchReviews(newPage);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      approved: "bg-green-100 text-green-700",
      rejected: "bg-red-100 text-red-700",
      pending: "bg-yellow-100 text-yellow-700",
    };
    return (
      <span
        className={`text-xs px-2.5 py-1 rounded-full font-medium ${
          styles[status] || "bg-neutral-100 text-neutral-700"
        }`}
      >
        {status}
      </span>
    );
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">Reviews</h1>
        <p className="text-sm text-neutral-500">
          {pagination.total} total reviews
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Search */}
        <form onSubmit={handleSearch} className="flex gap-2 flex-1">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search reviews..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-primary-500 text-white rounded-xl text-sm font-medium hover:bg-primary-600"
          >
            Search
          </button>
        </form>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-neutral-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-t-transparent" />
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-neutral-200">
          <Star className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
          <p className="text-neutral-500">No reviews found</p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-neutral-50">
                    <th className="text-left p-3 font-medium">Product</th>
                    <th className="text-left p-3 font-medium">User</th>
                    <th className="text-left p-3 font-medium">Rating</th>
                    <th className="text-left p-3 font-medium hidden md:table-cell">
                      Comment
                    </th>
                    <th className="text-left p-3 font-medium">Status</th>
                    <th className="text-right p-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reviews.map((review) => (
                    <tr
                      key={review._id}
                      className="border-t border-neutral-100 hover:bg-neutral-50"
                    >
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          {review.product?.images?.[0]?.url && (
                            <img
                              src={review.product.images[0].url}
                              alt=""
                              className="w-10 h-10 rounded-lg object-cover"
                            />
                          )}
                          <div>
                            <p className="font-medium text-neutral-900 truncate max-w-[200px]">
                              {review.product?.title || "—"}
                            </p>
                            <p className="text-xs text-neutral-400">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <p className="text-neutral-900">
                          {review.user?.name || "—"}
                        </p>
                        <p className="text-xs text-neutral-400">
                          {review.user?.email}
                        </p>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${
                                i < review.rating
                                  ? "text-warning fill-warning"
                                  : "text-neutral-300"
                              }`}
                            />
                          ))}
                        </div>
                      </td>
                      <td className="p-3 hidden md:table-cell">
                        <p className="max-w-xs truncate text-neutral-500">
                          {review.title && (
                            <span className="font-medium text-neutral-700">
                              {review.title}:{" "}
                            </span>
                          )}
                          {review.comment}
                        </p>
                        {(review.images?.length > 0 ||
                          review.videos?.length > 0) && (
                          <p className="text-xs text-primary-500 mt-1 flex items-center gap-1">
                            {review.images?.length > 0 && (
                              <span className="flex items-center gap-0.5">
                                <ImageIcon className="w-3 h-3" />
                                {review.images.length}
                              </span>
                            )}
                            {review.videos?.length > 0 && (
                              <span className="flex items-center gap-0.5 ml-1">
                                <Film className="w-3 h-3" />
                                {review.videos.length}
                              </span>
                            )}
                          </p>
                        )}
                        {review.adminReply && (
                          <p className="text-xs text-primary-500 mt-1 flex items-center gap-1">
                            <MessageSquare className="w-3 h-3" />
                            Admin replied
                          </p>
                        )}
                      </td>
                      <td className="p-3">{getStatusBadge(review.status)}</td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openDetailModal(review)}
                            className="p-1.5 hover:bg-neutral-100 rounded-lg"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4 text-neutral-500" />
                          </button>
                          <button
                            onClick={() => openReplyModal(review)}
                            className="p-1.5 hover:bg-primary-50 rounded-lg"
                            title="Reply"
                          >
                            <MessageSquare className="w-4 h-4 text-primary-500" />
                          </button>
                          {review.status !== "approved" && (
                            <button
                              onClick={() =>
                                handleStatusChange(review._id, "approved")
                              }
                              disabled={actionLoading === review._id}
                              className="p-1.5 hover:bg-green-50 rounded-lg disabled:opacity-50"
                              title="Approve"
                            >
                              <Check className="w-4 h-4 text-success" />
                            </button>
                          )}
                          {review.status !== "rejected" && (
                            <button
                              onClick={() =>
                                handleStatusChange(review._id, "rejected")
                              }
                              disabled={actionLoading === review._id}
                              className="p-1.5 hover:bg-red-50 rounded-lg disabled:opacity-50"
                              title="Reject"
                            >
                              <X className="w-4 h-4 text-danger" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(review._id)}
                            disabled={actionLoading === review._id}
                            className="p-1.5 hover:bg-red-50 rounded-lg disabled:opacity-50"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <p className="text-sm text-neutral-500">
                Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
                of {pagination.total} reviews
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="p-2 rounded-lg border border-neutral-300 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from(
                  { length: Math.min(5, pagination.pages) },
                  (_, i) => {
                    let pageNum;
                    if (pagination.pages <= 5) {
                      pageNum = i + 1;
                    } else if (pagination.page <= 3) {
                      pageNum = i + 1;
                    } else if (pagination.page >= pagination.pages - 2) {
                      pageNum = pagination.pages - 4 + i;
                    } else {
                      pageNum = pagination.page - 2 + i;
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                          pagination.page === pageNum
                            ? "bg-primary-500 text-white"
                            : "border border-neutral-300 hover:bg-neutral-50"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  }
                )}
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.pages}
                  className="p-2 rounded-lg border border-neutral-300 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Review Detail Modal */}
      {showDetailModal && selectedReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowDetailModal(false)}
          />
          <div className="relative bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-neutral-200">
              <h2 className="text-lg font-bold text-neutral-900">
                Review Details
              </h2>
              <button
                onClick={() => setShowDetailModal(false)}
                className="p-2 hover:bg-neutral-100 rounded-xl"
              >
                <X className="w-5 h-5 text-neutral-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {/* Product */}
              <div className="flex items-center gap-3">
                {selectedReview.product?.images?.[0]?.url && (
                  <img
                    src={selectedReview.product.images[0].url}
                    alt=""
                    className="w-16 h-16 rounded-xl object-cover"
                  />
                )}
                <div>
                  <p className="font-medium text-neutral-900">
                    {selectedReview.product?.title}
                  </p>
                  <p className="text-xs text-neutral-400">
                    Product ID: {selectedReview.product?._id}
                  </p>
                </div>
              </div>

              {/* User */}
              <div>
                <p className="text-xs text-neutral-400 mb-1">Reviewer</p>
                <p className="font-medium text-neutral-900">
                  {selectedReview.user?.name}
                </p>
                <p className="text-sm text-neutral-500">
                  {selectedReview.user?.email}
                </p>
              </div>

              {/* Rating */}
              <div>
                <p className="text-xs text-neutral-400 mb-1">Rating</p>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < selectedReview.rating
                          ? "text-warning fill-warning"
                          : "text-neutral-300"
                      }`}
                    />
                  ))}
                  <span className="text-sm text-neutral-500 ml-2">
                    ({selectedReview.rating}/5)
                  </span>
                </div>
              </div>

              {/* Status */}
              <div>
                <p className="text-xs text-neutral-400 mb-1">Status</p>
                {getStatusBadge(selectedReview.status)}
              </div>

              {/* Title */}
              {selectedReview.title && (
                <div>
                  <p className="text-xs text-neutral-400 mb-1">Title</p>
                  <p className="font-medium text-neutral-900">
                    {selectedReview.title}
                  </p>
                </div>
              )}

              {/* Comment */}
              <div>
                <p className="text-xs text-neutral-400 mb-1">Comment</p>
                <p className="text-neutral-700">{selectedReview.comment}</p>
              </div>

              {/* Review Images */}
              {selectedReview.images && selectedReview.images.length > 0 && (
                <div>
                  <p className="text-xs text-neutral-400 mb-1">Review Images</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedReview.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img.url}
                        alt={`Review image ${idx + 1}`}
                        className="w-24 h-24 rounded-xl object-cover border border-neutral-200"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Review Videos */}
              {selectedReview.videos && selectedReview.videos.length > 0 && (
                <div>
                  <p className="text-xs text-neutral-400 mb-1">Review Videos</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedReview.videos.map((vid, idx) => (
                      <video
                        key={idx}
                        src={vid.url}
                        controls
                        preload="metadata"
                        className="w-32 h-24 rounded-xl object-cover border border-neutral-200"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Admin Reply */}
              {selectedReview.adminReply && (
                <div className="bg-primary-50 p-4 rounded-xl">
                  <p className="text-xs text-primary-500 font-medium mb-1">
                    Admin Reply
                  </p>
                  <p className="text-neutral-700">
                    {selectedReview.adminReply}
                  </p>
                </div>
              )}

              {/* Date */}
              <div>
                <p className="text-xs text-neutral-400 mb-1">Submitted</p>
                <p className="text-sm text-neutral-500">
                  {new Date(selectedReview.createdAt).toLocaleString()}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2 border-t border-neutral-200">
                {selectedReview.status !== "approved" && (
                  <button
                    onClick={() => {
                      handleStatusChange(selectedReview._id, "approved");
                      setShowDetailModal(false);
                    }}
                    className="px-4 py-2 bg-green-500 text-white rounded-xl text-sm font-medium hover:bg-green-600"
                  >
                    Approve
                  </button>
                )}
                {selectedReview.status !== "rejected" && (
                  <button
                    onClick={() => {
                      handleStatusChange(selectedReview._id, "rejected");
                      setShowDetailModal(false);
                    }}
                    className="px-4 py-2 bg-red-500 text-white rounded-xl text-sm font-medium hover:bg-red-600"
                  >
                    Reject
                  </button>
                )}
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    openReplyModal(selectedReview);
                  }}
                  className="px-4 py-2 border border-primary-500 text-primary-500 rounded-xl text-sm font-medium hover:bg-primary-50"
                >
                  Reply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reply Modal */}
      {showReplyModal && selectedReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowReplyModal(false)}
          />
          <div className="relative bg-white rounded-2xl w-full max-w-lg shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-neutral-200">
              <div>
                <h2 className="text-lg font-bold text-neutral-900">
                  Admin Reply
                </h2>
                <p className="text-sm text-neutral-500">
                  Replying to {selectedReview.user?.name}'s review on{" "}
                  {selectedReview.product?.title}
                </p>
              </div>
              <button
                onClick={() => setShowReplyModal(false)}
                className="p-2 hover:bg-neutral-100 rounded-xl"
              >
                <X className="w-5 h-5 text-neutral-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {/* Original Review */}
              <div className="bg-neutral-50 p-4 rounded-xl">
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < selectedReview.rating
                          ? "text-warning fill-warning"
                          : "text-neutral-300"
                      }`}
                    />
                  ))}
                </div>
                {selectedReview.title && (
                  <p className="font-medium text-sm text-neutral-900">
                    {selectedReview.title}
                  </p>
                )}
                <p className="text-sm text-neutral-600">
                  {selectedReview.comment}
                </p>
              </div>

              {/* Reply Input */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Your Reply
                </label>
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write your reply to this review..."
                  rows={4}
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                  maxLength={500}
                />
                <p className="text-xs text-neutral-400 mt-1 text-right">
                  {replyText.length}/500
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowReplyModal(false)}
                  className="px-6 py-2.5 border border-neutral-300 rounded-xl text-sm font-medium text-neutral-600 hover:bg-neutral-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReply}
                  disabled={!replyText.trim() || actionLoading}
                  className="flex-1 px-6 py-2.5 bg-primary-500 text-white rounded-xl text-sm font-medium hover:bg-primary-600 disabled:opacity-50"
                >
                  {actionLoading ? "Saving..." : "Save Reply"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReviews;
