import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
const Terms = () => (
  <div className="max-w-4xl mx-auto px-4 py-12">
    <Link
      to="/"
      className="flex items-center gap-2 text-sm text-neutral-500 hover:text-primary-500 mb-6"
    >
      <ArrowLeft className="w-4 h-4" /> Back to Home
    </Link>
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-3xl font-display font-bold text-neutral-900 mb-6">
        Terms & Conditions
      </h1>
      <div className="prose max-w-none text-neutral-600 leading-relaxed space-y-4">
        <p>
          <strong>Last updated:</strong> January 2024
        </p>
        <h2 className="text-xl font-semibold text-neutral-900 mt-6">
          Acceptance of Terms
        </h2>
        <p>
          By accessing and using Hadmate, you agree to these terms. If you do
          not agree, please do not use our services.
        </p>
        <h2 className="text-xl font-semibold text-neutral-900 mt-6">
          Products & Pricing
        </h2>
        <p>
          All prices are in Indian Rupees (INR) and include applicable taxes
          unless stated otherwise. Product images are for illustration; actual
          products may vary slightly due to handcrafted nature.
        </p>
        <h2 className="text-xl font-semibold text-neutral-900 mt-6">
          Orders & Payment
        </h2>
        <p>
          We reserve the right to cancel any order due to pricing errors, stock
          unavailability, or suspected fraud. Payment must be completed before
          order processing begins.
        </p>
        <h2 className="text-xl font-semibold text-neutral-900 mt-6">
          Intellectual Property
        </h2>
        <p>
          All content, designs, and products on Hadmate are protected by
          copyright. Reproduction without permission is prohibited.
        </p>
        <h2 className="text-xl font-semibold text-neutral-900 mt-6">
          Limitation of Liability
        </h2>
        <p>
          Hadmate shall not be liable for any indirect, incidental, or
          consequential damages arising from the use of our products or
          services.
        </p>
      </div>
    </motion.div>
  </div>
);
export default Terms;
