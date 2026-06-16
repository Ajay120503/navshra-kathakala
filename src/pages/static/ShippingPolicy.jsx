import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
const ShippingPolicy = () => (
  <div className="max-w-4xl mx-auto px-4 py-12">
    <Link
      to="/"
      className="flex items-center gap-2 text-sm text-neutral-500 hover:text-primary-500 mb-6"
    >
      <ArrowLeft className="w-4 h-4" /> Back to Home
    </Link>
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-3xl font-display font-bold text-neutral-900 mb-6">
        Shipping & Return Policy
      </h1>
      <div className="prose max-w-none text-neutral-600 leading-relaxed space-y-4">
        <h2 className="text-xl font-semibold text-neutral-900 mt-6">
          Shipping
        </h2>
        <p>
          We offer free shipping on all orders above ₹999. Standard delivery
          takes 5-7 business days across India. Orders are processed within 1-2
          business days.
        </p>
        <h2 className="text-xl font-semibold text-neutral-900 mt-6">
          Cash on Delivery
        </h2>
        <p>
          COD is available on orders up to ₹5000. A nominal fee of ₹50 applies
          for COD orders.
        </p>
        <h2 className="text-xl font-semibold text-neutral-900 mt-6">Returns</h2>
        <p>
          We accept returns within 7 days of delivery for defective or damaged
          items. Please contact us with photos of the damage for a quick
          resolution.
        </p>
        <h2 className="text-xl font-semibold text-neutral-900 mt-6">
          Non-Returnable Items
        </h2>
        <p>
          Personalized/custom items cannot be returned unless damaged during
          transit. Gift hampers with perishable items are non-returnable.
        </p>
        <h2 className="text-xl font-semibold text-neutral-900 mt-6">Refunds</h2>
        <p>
          Refunds are processed within 5-7 business days after the returned item
          is received and inspected. The amount will be credited to your
          original payment method.
        </p>
      </div>
    </motion.div>
  </div>
);
export default ShippingPolicy;
