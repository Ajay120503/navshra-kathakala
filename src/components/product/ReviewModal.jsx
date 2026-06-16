import { useState, useRef } from "react";
import { Star, X, Image as ImageIcon, Film, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../api/axios";

const ReviewModal = ({ isOpen, onClose, product, onReviewSubmitted }) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [uploading, setUploading] = useState(false);
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);

  if (!isOpen) return null;

  const handleUploadImage = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    if (images.length + files.length > 5) {
      toast.error("You can upload up to 5 images");
      return;
    }

    setUploading(true);
    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        const { data } = await api.post("/upload/review-image", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setImages((prev) => [
          ...prev,
          { url: data.data.url, publicId: data.data.publicId },
        ]);
      }
      toast.success("Image uploaded");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to upload image");
    } finally {
      setUploading(false);
      if (imageInputRef.current) imageInputRef.current.value = "";
    }
  };

  const handleUploadVideo = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    if (videos.length + files.length > 2) {
      toast.error("You can upload up to 2 videos");
      return;
    }

    setUploading(true);
    try {
      for (const file of files) {
        if (file.size > 25 * 1024 * 1024) {
          toast.error("Video must be under 25MB");
          continue;
        }
        const formData = new FormData();
        formData.append("file", file);
        const { data } = await api.post("/upload/review-video", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setVideos((prev) => [
          ...prev,
          {
            url: data.data.url,
            publicId: data.data.publicId,
            duration: data.data.duration,
          },
        ]);
      }
      toast.success("Video uploaded");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to upload video");
    } finally {
      setUploading(false);
      if (videoInputRef.current) videoInputRef.current.value = "";
    }
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeVideo = (index) => {
    setVideos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }
    if (!comment.trim()) {
      toast.error("Please write a review");
      return;
    }
    if (uploading) {
      toast.error("Please wait for file uploads to complete");
      return;
    }

    setSubmitting(true);
    try {
      await api.post("/reviews", {
        productId: product._id,
        rating,
        title: title.trim(),
        comment: comment.trim(),
        images,
        videos,
      });
      toast.success("Review submitted! It will appear after approval.");
      setRating(0);
      setTitle("");
      setComment("");
      setImages([]);
      setVideos([]);
      onReviewSubmitted?.();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  const ratingLabels = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-200">
          <div>
            <h2 className="text-lg font-display font-bold text-neutral-900">
              Write a Review
            </h2>
            <p className="text-sm text-neutral-500 mt-0.5">{product?.title}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5 text-neutral-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Your Rating *
            </label>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="p-0.5 transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-8 h-8 transition-colors ${
                        star <= (hoveredRating || rating)
                          ? "text-warning fill-warning"
                          : "text-neutral-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
              {rating > 0 && (
                <span className="text-sm font-medium text-primary-500">
                  {ratingLabels[rating]}
                </span>
              )}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Review Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Summarize your experience"
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
              maxLength={100}
            />
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Your Review *
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience with this product. What did you like or dislike?"
              rows={4}
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm resize-none"
              maxLength={1000}
              required
            />
            <p className="text-xs text-neutral-400 mt-1 text-right">
              {comment.length}/1000
            </p>
          </div>

          {/* Images Upload */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Images (optional, max 5)
            </label>
            <div className="flex flex-wrap gap-2">
              {images.map((img, idx) => (
                <div key={idx} className="relative group">
                  <img
                    src={img.url}
                    alt=""
                    className="w-20 h-20 object-cover rounded-xl border border-neutral-200"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
              {images.length < 5 && (
                <button
                  type="button"
                  onClick={() => imageInputRef.current?.click()}
                  disabled={uploading}
                  className="w-20 h-20 rounded-xl border-2 border-dashed border-neutral-300 hover:border-primary-400 flex flex-col items-center justify-center text-neutral-400 hover:text-primary-500 transition-colors disabled:opacity-50"
                >
                  <ImageIcon className="w-5 h-5" />
                  <span className="text-xs mt-0.5">Photo</span>
                </button>
              )}
              <input
                ref={imageInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                multiple
                onChange={handleUploadImage}
                className="hidden"
              />
            </div>
          </div>

          {/* Videos Upload */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Videos (optional, max 2, 25MB each)
            </label>
            <div className="flex flex-wrap gap-2">
              {videos.map((vid, idx) => (
                <div key={idx} className="relative group">
                  <video
                    src={vid.url}
                    className="w-24 h-20 object-cover rounded-xl border border-neutral-200"
                    preload="metadata"
                  />
                  <button
                    type="button"
                    onClick={() => removeVideo(idx)}
                    className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
              {videos.length < 2 && (
                <button
                  type="button"
                  onClick={() => videoInputRef.current?.click()}
                  disabled={uploading}
                  className="w-24 h-20 rounded-xl border-2 border-dashed border-neutral-300 hover:border-primary-400 flex flex-col items-center justify-center text-neutral-400 hover:text-primary-500 transition-colors disabled:opacity-50"
                >
                  <Film className="w-5 h-5" />
                  <span className="text-xs mt-0.5">Video</span>
                </button>
              )}
              <input
                ref={videoInputRef}
                type="file"
                accept="video/mp4,video/mov,video/webm"
                multiple
                onChange={handleUploadVideo}
                className="hidden"
              />
            </div>
          </div>

          {uploading && (
            <p className="text-xs text-primary-500 flex items-center gap-2">
              <div className="animate-spin rounded-full h-3 w-3 border-2 border-primary-500 border-t-transparent" />
              Uploading file...
            </p>
          )}

          {/* Submit */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl border border-neutral-300 text-neutral-600 hover:bg-neutral-50 transition-colors text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || rating === 0 || uploading}
              className="flex-1 px-6 py-2.5 rounded-xl bg-primary-500 text-white hover:bg-primary-600 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;
