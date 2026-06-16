import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import usePage from "../../hooks/usePage";

const defaultContent = {
  sections: [
    {
      heading: "Shipping",
      body: "We offer free shipping on all orders above ₹999. Standard delivery takes 5-7 business days across India. Orders are processed within 1-2 business days.",
    },
    {
      heading: "Cash on Delivery",
      body: "COD is available on orders up to ₹5000. A nominal fee of ₹50 applies for COD orders.",
    },
    {
      heading: "Returns",
      body: "We accept returns within 7 days of delivery for defective or damaged items. Please contact us with photos of the damage for a quick resolution.",
    },
    {
      heading: "Non-Returnable Items",
      body: "Personalized/custom items cannot be returned unless damaged during transit. Gift hampers with perishable items are non-returnable.",
    },
    {
      heading: "Refunds",
      body: "Refunds are processed within 5-7 business days after the returned item is received and inspected. The amount will be credited to your original payment method.",
    },
  ],
};

const ShippingPolicy = () => {
  const { page, loading } = usePage("shipping");

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
  const title = page?.title || "Shipping & Return Policy";

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
export default ShippingPolicy;
