import { useState } from "react";
import { motion } from "framer-motion";
import { Send, LogIn } from "lucide-react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../api/axios";

const CustomOrder = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    occasion: "",
    description: "",
    budget: "",
    deadline: "",
  });
  const [files, setFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error("Please login to submit a custom order request");
      return;
    }
    if (!form.name || !form.email || !form.phone || !form.description) {
      toast.error("Please fill in required fields");
      return;
    }
    if (form.description.length < 20) {
      toast.error("Please provide a detailed description (min 20 characters)");
      return;
    }
    setSubmitting(true);
    try {
      const referenceImages = [];
      for (const file of files) {
        const fd = new FormData();
        fd.append("file", file);
        const { data } = await api.post("/upload/custom-order-image", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        referenceImages.push({
          url: data.data.url,
          publicId: data.data.publicId,
        });
      }
      await api.post("/custom-orders", { ...form, referenceImages });
      setSubmitted(true);
      toast.success("Custom order request submitted!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted)
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="card p-8">
          <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Send className="w-10 h-10 text-success" />
          </div>
          <h1 className="text-2xl font-display font-bold mb-2">
            Request Submitted! 🎉
          </h1>
          <p className="text-neutral-500">
            We'll review your custom order and get back to you within 24-48
            hours.
          </p>
        </div>
      </div>
    );

  if (!isAuthenticated)
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="card p-8">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <LogIn className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-2xl font-display font-bold mb-2">
              Login Required
            </h1>
            <p className="text-neutral-500 mb-6">
              Please login or create an account to submit a custom order
              request.
            </p>
            <div className="flex gap-4 justify-center">
              <Link to="/login" className="btn-primary px-6 py-2.5">
                Login
              </Link>
              <Link to="/register" className="btn-outline px-6 py-2.5">
                Register
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-center mb-10">
          <h1 className="text-3xl font-display font-bold text-neutral-900">
            Request a Custom Order
          </h1>
          <p className="text-neutral-500 mt-2">
            Tell us about your vision and we'll bring it to life
          </p>
        </div>
        <div className="card p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Phone *
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Occasion
                </label>
                <select
                  value={form.occasion}
                  onChange={(e) =>
                    setForm({ ...form, occasion: e.target.value })
                  }
                  className="input-field"
                >
                  <option value="">Select</option>
                  <option>Birthday</option>
                  <option>Anniversary</option>
                  <option>Wedding</option>
                  <option>Festival</option>
                  <option>Corporate</option>
                  <option>Other</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Describe Your Idea *
              </label>
              <textarea
                rows={4}
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className="input-field"
                placeholder="Tell us what you're looking for..."
                required
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Budget Range
                </label>
                <select
                  value={form.budget}
                  onChange={(e) => setForm({ ...form, budget: e.target.value })}
                  className="input-field"
                >
                  <option value="">Select budget</option>
                  <option>Under ₹500</option>
                  <option>₹500 - ₹1000</option>
                  <option>₹1000 - ₹2500</option>
                  <option>₹2500 - ₹5000</option>
                  <option>Above ₹5000</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Deadline
                </label>
                <input
                  type="date"
                  value={form.deadline}
                  onChange={(e) =>
                    setForm({ ...form, deadline: e.target.value })
                  }
                  className="input-field"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Reference Images
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => setFiles([...e.target.files])}
                className="input-field"
              />
              <p className="text-xs text-neutral-400 mt-1">
                {files.length > 0
                  ? `${files.length} file(s) selected`
                  : "Upload images to help us understand your vision"}
              </p>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full py-3"
            >
              {submitting ? (
                <span className="flex items-center gap-2 justify-center">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />{" "}
                  Submitting...
                </span>
              ) : (
                <span className="flex items-center gap-2 justify-center">
                  <Send className="w-5 h-5" /> Submit Request
                </span>
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};
export default CustomOrder;
