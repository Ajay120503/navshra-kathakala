import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Package,
  Truck,
  CheckCircle,
  MapPin,
  CreditCard,
  Star,
  MessageSquare,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../../api/axios";
import { formatCurrency, formatDateTime } from "../../utils/formatCurrency";
import ReviewModal from "../../components/product/ReviewModal";

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reviewedProducts, setReviewedProducts] = useState({});
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await api.get(`/orders/${id}`);
        setOrder(data.data?.order || data.data);
      } catch (err) {
        setError("Order not found");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  // Check review status for each product in delivered orders
  useEffect(() => {
    if (!order || order.orderStatus !== "delivered") return;

    const checkReviews = async () => {
      try {
        const productIds = order.items
          .map((item) => {
            if (typeof item.product === "object" && item.product?._id) {
              return item.product._id;
            }
            return item.product;
          })
          .filter(Boolean)
          .join(",");
        if (productIds) {
          const { data } = await api.get(
            `/reviews/batch?productIds=${productIds}`
          );
          const reviews = data.data?.reviews || [];
          const reviewMap = {};
          reviews.forEach((review) => {
            reviewMap[review.product] = review;
          });
          setReviewedProducts(reviewMap);
        }
      } catch (err) {
        console.error("Failed to check reviews:", err);
      }
    };
    checkReviews();
  }, [order]);

  const getStatusIcon = (status) => {
    const icons = {
      delivered: CheckCircle,
      shipped: Truck,
      out_for_delivery: Truck,
    };
    return icons[status] || Package;
  };

  const getProgressPercent = (status) => {
    const steps = [
      "placed",
      "confirmed",
      "packed",
      "shipped",
      "out_for_delivery",
      "delivered",
    ];
    const idx = steps.indexOf(status);
    return idx >= 0 ? ((idx + 1) / steps.length) * 100 : 0;
  };

  const getProductId = (item) => {
    if (typeof item.product === "object" && item.product?._id) {
      return item.product._id;
    }
    return typeof item.product === "string" ? item.product : null;
  };

  const handleReviewSubmitted = () => {
    // Refresh reviews
    if (order && order.orderStatus === "delivered") {
      const productIds = order.items
        .map((item) => getProductId(item))
        .filter(Boolean)
        .join(",");
      if (productIds) {
        api
          .get(`/reviews/batch?productIds=${productIds}`)
          .then(({ data }) => {
            const reviews = data.data?.reviews || [];
            const reviewMap = {};
            reviews.forEach((review) => {
              reviewMap[review.product] = review;
            });
            setReviewedProducts(reviewMap);
          })
          .catch(() => {});
      }
    }
  };

  const openReviewModal = (item) => {
    const productId = getProductId(item);
    if (!productId) {
      toast.error("Product data not available");
      return;
    }
    setSelectedProduct({ _id: productId, title: item.title || item.name });
    setReviewModalOpen(true);
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-t-transparent" />
      </div>
    );
  if (error || !order)
    return (
      <div className="text-center py-16">
        <p className="text-neutral-500 mb-4">{error || "Order not found"}</p>
        <Link to="/account/orders" className="text-primary-500 hover:underline">
          Back to orders
        </Link>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link
        to="/account/orders"
        className="flex items-center gap-2 text-neutral-500 hover:text-primary-500 mb-6 text-sm"
      >
        <ArrowLeft className="w-4 h-4" /> Back to orders
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-neutral-900">
            Order #{order.invoiceNumber}
          </h1>
          <p className="text-neutral-500 text-sm mt-1">
            {formatDateTime(order.createdAt)}
          </p>
        </div>
        <span
          className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
            order.orderStatus === "delivered"
              ? "bg-green-100 text-green-700"
              : order.orderStatus === "cancelled"
              ? "bg-red-100 text-red-700"
              : "bg-primary-100 text-primary-700"
          }`}
        >
          {order.orderStatus?.replace(/_/g, " ")}
        </span>
      </div>

      {/* Progress Bar */}
      {!["cancelled", "returned"].includes(order.orderStatus) && (
        <div className="card p-6 mb-6">
          <div className="w-full bg-neutral-200 rounded-full h-2 mb-4">
            <div
              className="bg-primary-500 h-2 rounded-full transition-all"
              style={{ width: `${getProgressPercent(order.orderStatus)}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-neutral-500">
            {[
              "Placed",
              "Confirmed",
              "Packed",
              "Shipped",
              "Out for Delivery",
              "Delivered",
            ].map((step, i) => (
              <span
                key={step}
                className={`${
                  getProgressPercent(order.orderStatus) >= ((i + 1) / 6) * 100
                    ? "text-primary-500 font-medium"
                    : ""
                }`}
              >
                {step}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Shipping Address */}
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-primary-500" />
            <h2 className="font-semibold text-neutral-900">Shipping Address</h2>
          </div>
          <div className="text-sm text-neutral-600 space-y-1">
            <p className="font-medium text-neutral-900">
              {order.shippingAddress?.fullName}
            </p>
            <p>{order.shippingAddress?.addressLine1}</p>
            {order.shippingAddress?.addressLine2 && (
              <p>{order.shippingAddress.addressLine2}</p>
            )}
            <p>
              {order.shippingAddress?.city}, {order.shippingAddress?.state} -{" "}
              {order.shippingAddress?.pincode}
            </p>
            <p>{order.shippingAddress?.phone}</p>
          </div>
        </div>

        {/* Payment Info */}
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard className="w-5 h-5 text-primary-500" />
            <h2 className="font-semibold text-neutral-900">Payment</h2>
          </div>
          <div className="text-sm text-neutral-600 space-y-2">
            <div className="flex justify-between">
              <span>Method</span>
              <span className="font-medium capitalize">
                {order.paymentMethod}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Status</span>
              <span
                className={`font-medium ${
                  order.paymentStatus === "paid"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {order.paymentStatus}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="card p-6 mt-6">
        <h2 className="font-semibold text-neutral-900 mb-4">Order Items</h2>
        <div className="space-y-4">
          {order.items?.map((item, i) => {
            const productId = getProductId(item);
            const reviewed = reviewedProducts[productId];
            return (
              <div
                key={i}
                className="flex items-center gap-4 p-3 bg-neutral-50 rounded-xl"
              >
                <img
                  src={
                    item.image ||
                    (typeof item.product === "object" &&
                      item.product?.images?.[0]?.url) ||
                    "/placeholder.svg"
                  }
                  alt={item.title || item.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-neutral-900 truncate">
                    {item.title || item.name}
                  </p>
                  {item.selectedColor && (
                    <p className="text-xs text-neutral-500">
                      Color: {item.selectedColor}
                    </p>
                  )}
                  {item.selectedSize && (
                    <p className="text-xs text-neutral-500">
                      Size: {item.selectedSize}
                    </p>
                  )}
                  <p className="text-xs text-neutral-500">
                    Qty: {item.quantity}
                  </p>

                  {/* Review status for delivered orders */}
                  {order.orderStatus === "delivered" && (
                    <div className="mt-1">
                      {reviewed ? (
                        <span className="inline-flex items-center gap-1 text-xs text-green-600">
                          <Star className="w-3 h-3 fill-green-600" />
                          Reviewed
                        </span>
                      ) : (
                        <button
                          onClick={() => openReviewModal(item)}
                          className="inline-flex items-center gap-1 text-xs text-primary-500 hover:text-primary-600 font-medium"
                        >
                          <MessageSquare className="w-3 h-3" />
                          Write Review
                        </button>
                      )}
                    </div>
                  )}
                </div>
                <p className="font-semibold text-primary-500">
                  {formatCurrency(item.price * item.quantity)}
                </p>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="border-t border-neutral-200 mt-4 pt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-neutral-500">Subtotal</span>
            <span>{formatCurrency(order.itemsPrice)}</span>
          </div>
          {(order.shippingPrice || 0) > 0 && (
            <div className="flex justify-between">
              <span className="text-neutral-500">Shipping</span>
              <span>{formatCurrency(order.shippingPrice)}</span>
            </div>
          )}
          {(order.taxPrice || 0) > 0 && (
            <div className="flex justify-between">
              <span className="text-neutral-500">Tax</span>
              <span>{formatCurrency(order.taxPrice)}</span>
            </div>
          )}
          {(order.discount || 0) > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount</span>
              <span>-{formatCurrency(order.discount)}</span>
            </div>
          )}
          {order.couponCode && (
            <div className="flex justify-between">
              <span className="text-neutral-500">Coupon</span>
              <span className="font-mono text-xs">{order.couponCode}</span>
            </div>
          )}
          <div className="flex justify-between text-lg font-bold border-t border-neutral-200 pt-2">
            <span>Total</span>
            <span className="text-primary-500">
              {formatCurrency(order.totalPrice)}
            </span>
          </div>
        </div>
      </div>

      {/* Tracking */}
      {order.trackingNumber && (
        <div className="card p-6 mt-6">
          <div className="flex items-center gap-2 mb-2">
            <Truck className="w-5 h-5 text-primary-500" />
            <h2 className="font-semibold text-neutral-900">Tracking</h2>
          </div>
          <p className="text-sm text-neutral-600">
            Tracking Number:{" "}
            <span className="font-mono font-medium">
              {order.trackingNumber}
            </span>
          </p>
        </div>
      )}

      {/* Review CTA for delivered orders */}
      {order.orderStatus === "delivered" &&
        Object.keys(reviewedProducts).length === 0 && (
          <div className="card p-6 mt-6 border-primary-200 bg-primary-50">
            <div className="flex items-start gap-3">
              <Star className="w-5 h-5 text-primary-500 mt-0.5" />
              <div>
                <h3 className="font-semibold text-neutral-900">
                  How was your order?
                </h3>
                <p className="text-sm text-neutral-600 mt-1">
                  Share your experience by reviewing the products in this order.
                  Your feedback helps other shoppers!
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {order.items?.map((item, i) => (
                    <button
                      key={i}
                      onClick={() => openReviewModal(item)}
                      className="px-4 py-2 text-sm font-medium bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors"
                    >
                      Review {item.title || item.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

      {/* Review Modal */}
      <ReviewModal
        isOpen={reviewModalOpen}
        onClose={() => {
          setReviewModalOpen(false);
          setSelectedProduct(null);
        }}
        product={selectedProduct}
        onReviewSubmitted={handleReviewSubmitted}
      />
    </div>
  );
};
export default OrderDetail;
