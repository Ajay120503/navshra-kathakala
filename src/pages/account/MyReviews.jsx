import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Star,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Image as ImageIcon,
  Film,
} from "lucide-react";
import api from "../../api/axios";
import { formatDate } from "../../utils/formatCurrency";

const MyReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });

  const fetchReviews = async (page = 1) => {
    setLoading(true);
    try {
      const { data } = await api.get(`/reviews/my?page=${page}&limit=20`);
      setReviews(data.data?.reviews || []);
      setPagination({
        page: data.pagination?.page || page,
        limit: 20,
        total: data.pagination?.total || 0,
        pages: data.pagination?.pages || 0,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews(1);
  }, []);

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

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-t-transparent" />
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display font-bold text-neutral-900">
          My Reviews
        </h1>
        <p className="text-sm text-neutral-500">{pagination.total} reviews</p>
      </div>

      {reviews.length === 0 ? (
        <div className="text-center py-16">
          <Star className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
          <p className="text-neutral-500 mb-4">
            You haven't written any reviews yet
          </p>
          <Link
            to="/account/orders"
            className="text-primary-500 hover:underline text-sm"
          >
            View your orders
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review._id} className="card p-4">
                <div className="flex items-start gap-4">
                  {review.product?.images?.[0]?.url && (
                    <img
                      src={review.product.images[0].url}
                      alt=""
                      className="w-16 h-16 rounded-xl object-cover shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <Link
                        to={`/shop/${review.product?.slug}`}
                        className="font-medium text-neutral-900 hover:text-primary-500 truncate"
                      >
                        {review.product?.title || "Product"}
                      </Link>
                      {getStatusBadge(review.status)}
                    </div>
                    <div className="flex items-center gap-1 mt-1">
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
                      <span className="text-xs text-neutral-400 ml-1">
                        {formatDate(review.createdAt)}
                      </span>
                    </div>
                    {review.title && (
                      <p className="font-medium text-sm text-neutral-900 mt-2">
                        {review.title}
                      </p>
                    )}
                    <p className="text-sm text-neutral-600 mt-1">
                      {review.comment}
                    </p>
                    {/* Review Images */}
                    {review.images && review.images.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {review.images.map((img, idx) => (
                          <img
                            key={idx}
                            src={img.url}
                            alt={`Review image ${idx + 1}`}
                            className="w-16 h-16 rounded-xl object-cover border border-neutral-200"
                          />
                        ))}
                      </div>
                    )}

                    {/* Review Videos */}
                    {review.videos && review.videos.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {review.videos.map((vid, idx) => (
                          <video
                            key={idx}
                            src={vid.url}
                            controls
                            preload="metadata"
                            className="w-24 h-20 rounded-xl object-cover border border-neutral-200"
                          />
                        ))}
                      </div>
                    )}

                    {review.adminReply && (
                      <div className="bg-primary-50 p-3 rounded-xl mt-3">
                        <p className="text-xs text-primary-500 font-medium mb-1 flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" />
                          Admin Reply
                        </p>
                        <p className="text-sm text-neutral-700">
                          {review.adminReply}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="p-2 rounded-lg border border-neutral-300 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
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
              })}
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
                className="p-2 rounded-lg border border-neutral-300 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MyReviews;
