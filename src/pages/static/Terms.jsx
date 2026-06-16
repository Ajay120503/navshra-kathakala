import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import usePage from "../../hooks/usePage";

const defaultContent = {
  lastUpdated: "January 2024",
  sections: [
    {
      heading: "Acceptance of Terms",
      body: "By accessing and using Hadmate, you agree to these terms. If you do not agree, please do not use our services.",
    },
    {
      heading: "Products & Pricing",
      body: "All prices are in Indian Rupees (INR) and include applicable taxes unless stated otherwise. Product images are for illustration; actual products may vary slightly due to handcrafted nature.",
    },
    {
      heading: "Orders & Payment",
      body: "We reserve the right to cancel any order due to pricing errors, stock unavailability, or suspected fraud. Payment must be completed before order processing begins.",
    },
    {
      heading: "Intellectual Property",
      body: "All content, designs, and products on Hadmate are protected by copyright. Reproduction without permission is prohibited.",
    },
    {
      heading: "Limitation of Liability",
      body: "Hadmate shall not be liable for any indirect, incidental, or consequential damages arising from the use of our products or services.",
    },
  ],
};

const Terms = () => {
  const { page, loading } = usePage("terms");

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
  const title = page?.title || "Terms & Conditions";

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
export default Terms;
