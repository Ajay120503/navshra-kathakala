import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { ShoppingBag, Heart, Star, Minus, Plus } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../api/axios";
import { addToCart } from "../../redux/cartSlice";
import { setUser } from "../../redux/authSlice";
import { formatCurrency } from "../../utils/formatCurrency";
const ProductDetail = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [inWishlist, setInWishlist] = useState(false);

  useEffect(() => {
    if (user?.wishlist && product) {
      setInWishlist(user.wishlist.some((id) => id.toString() === product._id));
    }
  }, [user, product]);

  const handleToggleWishlist = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to add to wishlist");
      navigate("/login");
      return;
    }
    try {
      let updatedWishlist;
      if (inWishlist) {
        updatedWishlist = (user.wishlist || []).filter(
          (id) => id.toString() !== product._id
        );
      } else {
        updatedWishlist = [...(user.wishlist || []), product._id];
      }
      const { data } = await api.put("/auth/me", { wishlist: updatedWishlist });
      dispatch(setUser(data.data.user));
      setInWishlist(!inWishlist);
      toast.success(inWishlist ? "Removed from wishlist" : "Added to wishlist");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update wishlist");
    }
  };
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${slug}`);
        setProduct(data.data.product);
        setReviews(data.data.reviews || []);
        setRelated(data.data.related || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);
  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart");
      navigate("/login", { state: { from: { pathname: `/shop/${slug}` } } });
      return;
    }
    if (product) {
      dispatch(
        addToCart({
          productId: product._id,
          quantity,
          variant: selectedVariant,
        })
      );
      toast.success("Added to cart!");
    }
  };
  if (loading)
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="aspect-square skeleton rounded-2xl" />
          <div className="space-y-4">
            <div className="h-8 skeleton w-3/4" />
            <div className="h-6 skeleton w-1/4" />
            <div className="h-32 skeleton" />
          </div>
        </div>
      </div>
    );
  if (!product)
    return (
      <div className="text-center py-16">
        <p className="text-lg text-neutral-500">Product not found</p>
        <Link
          to="/shop"
          className="text-primary-500 hover:underline mt-2 inline-block"
        >
          Back to shop
        </Link>
      </div>
    );
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <Link
        to="/shop"
        className="text-sm text-neutral-500 hover:text-primary-500 inline-flex items-center gap-1 mb-4 sm:mb-6"
      >
        ← Back to Shop
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-12">
        {/* Gallery */}
        <div>
          <div className="aspect-square bg-neutral-100 rounded-2xl overflow-hidden mb-3 sm:mb-4">
            <img
              src={product.images?.[selectedImage]?.url || "/placeholder.svg"}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          </div>

          {product.images?.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  aria-label={`View image ${i + 1}`}
                  className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-colors ${
                    i === selectedImage
                      ? "border-primary-500"
                      : "border-transparent hover:border-neutral-300"
                  }`}
                >
                  <img
                    src={img.url}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          {product.isNewArrival && (
            <span className="badge-secondary mb-3 inline-block">
              New Arrival
            </span>
          )}

          <h1 className="text-2xl sm:text-3xl font-display font-bold text-neutral-900 mb-3">
            {product.title}
          </h1>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mb-4">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.round(product.rating)
                      ? "text-warning fill-warning"
                      : "text-neutral-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-neutral-500">
              ({product.numReviews} reviews)
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mb-6">
            <span className="text-2xl sm:text-3xl font-bold text-primary-500">
              {formatCurrency(product.discountPrice || product.price)}
            </span>
            {product.discountPrice && (
              <span className="text-base sm:text-lg text-neutral-400 line-through">
                {formatCurrency(product.price)}
              </span>
            )}
            {product.discountPercent > 0 && (
              <span className="badge-primary">
                {product.discountPercent}% OFF
              </span>
            )}
          </div>

          <p className="text-neutral-600 mb-6 text-sm sm:text-base leading-relaxed">
            {product.shortDescription || product.description?.substring(0, 200)}
          </p>

          {product.variants?.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-neutral-900 mb-2 text-sm sm:text-base">
                {product.variants[0].name}: {selectedVariant?.value || "Select"}
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedVariant(v)}
                    className={`px-3 sm:px-4 py-2 rounded-xl border text-sm font-medium transition-colors ${
                      selectedVariant?.value === v.value
                        ? "bg-primary-500 text-white border-primary-500"
                        : "border-neutral-300 text-neutral-600 hover:border-primary-300"
                    }`}
                  >
                    {v.value}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-6">
            <div className="flex items-center border border-neutral-300 rounded-xl">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                aria-label="Decrease quantity"
                className="p-2.5 sm:p-3 hover:bg-neutral-50"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-4 font-medium min-w-[2.5rem] text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                aria-label="Increase quantity"
                className="p-2.5 sm:p-3 hover:bg-neutral-50"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              className="btn-primary flex-1 min-w-[10rem] flex items-center justify-center gap-2 py-3"
            >
              <ShoppingBag className="w-5 h-5" /> Add to Cart
            </button>

            <button
              onClick={handleToggleWishlist}
              aria-label="Toggle wishlist"
              className={`p-3 rounded-xl border transition-colors shrink-0 ${
                inWishlist
                  ? "border-primary-300 bg-primary-50"
                  : "border-neutral-300 hover:bg-neutral-50"
              }`}
            >
              <Heart
                className={`w-5 h-5 ${
                  inWishlist
                    ? "text-primary-500 fill-primary-500"
                    : "text-neutral-500"
                }`}
              />
            </button>
          </div>

          <div className="border-t border-neutral-200 pt-5 sm:pt-6 space-y-2 sm:space-y-3">
            <p className="text-sm text-neutral-500">
              Category: {product.category?.name || "Uncategorized"}
            </p>
            <p className="text-sm text-neutral-500">
              Estimated Delivery: {product.estimatedDeliveryText}
            </p>
            {product.material?.length > 0 && (
              <p className="text-sm text-neutral-500">
                Materials: {product.material.join(", ")}
              </p>
            )}
          </div>
        </motion.div>
      </div>

      {product.description && (
        <div className="mt-10 sm:mt-12">
          <h2 className="text-lg sm:text-xl font-display font-bold text-neutral-900 mb-3 sm:mb-4">
            Description
          </h2>
          <div className="prose max-w-none text-neutral-600 leading-relaxed text-sm sm:text-base">
            {product.description}
          </div>
        </div>
      )}

      {reviews.length > 0 && (
        <div className="mt-10 sm:mt-12">
          <h2 className="text-lg sm:text-xl font-display font-bold text-neutral-900 mb-4 sm:mb-6">
            Reviews ({reviews.length})
          </h2>
          <div className="space-y-3 sm:space-y-4">
            {reviews.map((review) => (
              <div key={review._id} className="card p-4">
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < review.rating
                          ? "text-warning fill-warning"
                          : "text-neutral-300"
                      }`}
                    />
                  ))}
                </div>
                <p className="font-medium text-neutral-900 text-sm sm:text-base">
                  {review.title}
                </p>
                <p className="text-neutral-600 text-sm mt-1 leading-relaxed">
                  {review.comment}
                </p>

                {review.images?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {review.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img.url}
                        alt={`Review ${idx + 1}`}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border border-neutral-200"
                      />
                    ))}
                  </div>
                )}

                {review.videos?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {review.videos.map((vid, idx) => (
                      <video
                        key={idx}
                        src={vid.url}
                        controls
                        preload="metadata"
                        className="w-24 h-20 sm:w-28 sm:h-24 rounded-xl object-cover border border-neutral-200"
                      />
                    ))}
                  </div>
                )}

                <p className="text-xs text-neutral-400 mt-3">
                  — {review.user?.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {related.length > 0 && (
        <div className="mt-10 sm:mt-12">
          <h2 className="text-lg sm:text-xl font-display font-bold text-neutral-900 mb-4 sm:mb-6">
            You May Also Like
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {related.map((item) => (
              <Link
                key={item._id}
                to={`/shop/${item.slug}`}
                className="card overflow-hidden group"
              >
                <div className="aspect-square bg-neutral-100 overflow-hidden">
                  <img
                    src={item.images?.[0]?.url || "/placeholder.svg"}
                    alt={item.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-3">
                  <p className="text-sm font-medium line-clamp-1">
                    {item.title}
                  </p>
                  <p className="text-primary-500 font-bold mt-1 text-sm sm:text-base">
                    {formatCurrency(item.discountPrice || item.price)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
export default ProductDetail;
