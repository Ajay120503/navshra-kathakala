import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import usePage from "../../hooks/usePage";

const defaultContent = {
  lastUpdated: "January 2024",
  sections: [
    {
      heading: "Information We Collect",
      body: "We collect information you provide directly to us, including your name, email address, phone number, shipping address, and payment information when you make a purchase or create an account.",
    },
    {
      heading: "How We Use Your Information",
      body: "We use your information to process orders, send order updates, improve our services, and send promotional communications (with your consent).",
    },
    {
      heading: "Data Protection",
      body: "We implement industry-standard security measures to protect your personal information. Payment transactions are encrypted and processed securely through Razorpay.",
    },
    {
      heading: "Third-Party Services",
      body: "We use third-party services including Razorpay (payment processing), Cloudinary (image storage), and MongoDB (data storage). These services have their own privacy policies.",
    },
    {
      heading: "Contact",
      body: "For questions about this policy, please contact us at hello@hadmate.com.",
    },
  ],
};

const PrivacyPolicy = () => {
  const { page, loading } = usePage("privacy");

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  const content = page?.content
    ? typeof page.content === "string"
      ? JSON.parse(page.content)
      : page.content
    : defaultContent;
  const title = page?.title || "Privacy Policy";

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
        <h1 className="text-3xl font-display font-bold text-neutral-900 mb-6">
          {title}
        </h1>
        <div className="prose max-w-none text-neutral-600 leading-relaxed space-y-4">
          {content.lastUpdated && (
            <p>
              <strong>Last updated:</strong> {content.lastUpdated}
            </p>
          )}
          {(content.sections || []).map((section, i) => (
            <div key={i}>
              <h2 className="text-xl font-semibold text-neutral-900 mt-6">
                {section.heading}
              </h2>
              <p>{section.body}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
export default PrivacyPolicy;
