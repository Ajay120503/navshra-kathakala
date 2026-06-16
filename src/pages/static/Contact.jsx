import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail, Phone, MapPin, Send, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import usePage from "../../hooks/usePage";

const Contact = () => {
  const { page, loading } = usePage("contact");
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const contactDetails = page?.contactDetails || {};
  const title = page?.title || "Contact Us";

  const handleSubmit = async (e) => {
    e.preventDefault();
    toast.success("Message sent! We'll get back to you soon.");
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Link
        to="/"
        className="flex items-center gap-2 text-sm text-neutral-500 hover:text-primary-500 mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </Link>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-display font-bold text-neutral-900 mb-8">
          {title}
        </h1>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            {contactDetails.email && (
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center">
                  <Mail className="w-5 h-5 text-primary-500" />
                </div>
                <div>
                  <h3 className="font-medium text-neutral-900">Email</h3>
                  <p className="text-sm text-neutral-500">
                    {contactDetails.email}
                  </p>
                </div>
              </div>
            )}
            {contactDetails.phone && (
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center">
                  <Phone className="w-5 h-5 text-primary-500" />
                </div>
                <div>
                  <h3 className="font-medium text-neutral-900">Phone</h3>
                  <p className="text-sm text-neutral-500">
                    {contactDetails.phone}
                  </p>
                </div>
              </div>
            )}
            {contactDetails.address && (
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-primary-500" />
                </div>
                <div>
                  <h3 className="font-medium text-neutral-900">Address</h3>
                  <p className="text-sm text-neutral-500">
                    {contactDetails.address}
                  </p>
                </div>
              </div>
            )}
          </div>
          <form onSubmit={handleSubmit} className="card p-6 space-y-4">
            <h3 className="text-lg font-semibold text-neutral-900">
              Send us a message
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Your Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="input-field"
                required
              />
              <input
                type="email"
                placeholder="Your Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="input-field"
                required
              />
            </div>
            <input
              type="text"
              placeholder="Subject"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              className="input-field"
            />
            <textarea
              rows={4}
              placeholder="Your Message"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="input-field"
              required
            />
            <button type="submit" className="btn-primary">
              <Send className="w-4 h-4" /> Send Message
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};
export default Contact;
