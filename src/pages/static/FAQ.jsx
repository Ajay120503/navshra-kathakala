import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, ChevronDown, ChevronUp } from "lucide-react";
const faqs = [
  {
    q: "How long does delivery take?",
    a: "Standard delivery takes 5-7 business days across India. Express shipping is available for select products.",
  },
  {
    q: "Can I personalize a product?",
    a: "Yes! Many of our products can be personalized with names, messages, or custom designs. Look for the 'Personalizable' badge on product pages.",
  },
  {
    q: "What is your return policy?",
    a: "We accept returns within 7 days of delivery for defective or damaged items. Handcrafted and personalized items cannot be returned unless damaged.",
  },
  {
    q: "Do you ship internationally?",
    a: "Currently, we ship across India. International shipping will be available soon.",
  },
  {
    q: "How do I track my order?",
    a: "Use the Track Order page with your invoice number. You'll also receive email updates at each stage.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major credit/debit cards, UPI, Net Banking via Razorpay, and Cash on Delivery (COD) for select pincodes.",
  },
  {
    q: "How are your products made?",
    a: "Each product is handcrafted by skilled artisans using traditional techniques combined with modern aesthetics.",
  },
  {
    q: "Can I cancel my order?",
    a: "Orders can be cancelled within 24 hours of placing. After that, please contact us for assistance.",
  },
];
const FAQ = () => {
  const [open, setOpen] = useState(null);
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
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
          Frequently Asked Questions
        </h1>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="card overflow-hidden">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between p-4 text-left"
              >
                <span className="font-medium text-neutral-900 pr-4">
                  {faq.q}
                </span>
                {open === i ? (
                  <ChevronUp className="w-5 h-5 text-primary-500 shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-neutral-400 shrink-0" />
                )}
              </button>
              {open === i && (
                <div className="px-4 pb-4 text-neutral-600 text-sm leading-relaxed border-t border-neutral-100 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
export default FAQ;
