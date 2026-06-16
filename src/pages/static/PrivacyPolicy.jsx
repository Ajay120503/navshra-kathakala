import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
const PrivacyPolicy = () => (
  <div className="max-w-4xl mx-auto px-4 py-12">
    <Link
      to="/"
      className="flex items-center gap-2 text-sm text-neutral-500 hover:text-primary-500 mb-6"
    >
      <ArrowLeft className="w-4 h-4" /> Back to Home
    </Link>
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-3xl font-display font-bold text-neutral-900 mb-6">
        Privacy Policy
      </h1>
      <div className="prose max-w-none text-neutral-600 leading-relaxed space-y-4">
        <p>
          <strong>Last updated:</strong> January 2024
        </p>
        <h2 className="text-xl font-semibold text-neutral-900 mt-6">
          Information We Collect
        </h2>
        <p>
          We collect information you provide directly to us, including your
          name, email address, phone number, shipping address, and payment
          information when you make a purchase or create an account.
        </p>
        <h2 className="text-xl font-semibold text-neutral-900 mt-6">
          How We Use Your Information
        </h2>
        <p>
          We use your information to process orders, send order updates, improve
          our services, and send promotional communications (with your consent).
        </p>
        <h2 className="text-xl font-semibold text-neutral-900 mt-6">
          Data Protection
        </h2>
        <p>
          We implement industry-standard security measures to protect your
          personal information. Payment transactions are encrypted and processed
          securely through Razorpay.
        </p>
        <h2 className="text-xl font-semibold text-neutral-900 mt-6">
          Third-Party Services
        </h2>
        <p>
          We use third-party services including Razorpay (payment processing),
          Cloudinary (image storage), and MongoDB (data storage). These services
          have their own privacy policies.
        </p>
        <h2 className="text-xl font-semibold text-neutral-900 mt-6">Contact</h2>
        <p>
          For questions about this policy, please contact us at
          hello@hadmate.com.
        </p>
      </div>
    </motion.div>
  </div>
);
export default PrivacyPolicy;
