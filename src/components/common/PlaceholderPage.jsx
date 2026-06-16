import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const PlaceholderPage = ({ title, description }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <Link
        to="/"
        className="flex items-center gap-2 text-neutral-500 hover:text-primary-500 mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </Link>
      <div className="card p-8 md:p-12 text-center">
        <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl">🎨</span>
        </div>
        <h1 className="text-3xl font-display font-bold text-neutral-900 mb-4">
          {title}
        </h1>
        <p className="text-neutral-600 max-w-md mx-auto mb-8">
          {description ||
            "This page is under construction. We're working hard to bring you an amazing experience!"}
        </p>
        <Link to="/shop" className="btn-primary">
          Browse Products
        </Link>
      </div>
    </div>
  );
};

export default PlaceholderPage;
