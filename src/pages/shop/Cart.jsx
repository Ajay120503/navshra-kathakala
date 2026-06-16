import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  ShoppingBag,
  Minus,
  Plus,
  Trash2,
  ArrowRight,
  Tag,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  fetchCart,
  updateCartItem,
  removeFromCart,
  applyCoupon,
  removeCoupon,
  clearError,
} from "../../redux/cartSlice";
import { formatCurrency } from "../../utils/formatCurrency";
import { useState } from "react";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart, loading } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [couponInput, setCouponInput] = useState("");
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart());
    }
  }, [dispatch, isAuthenticated]);

  const items = cart?.items || [];
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const discount = cart?.discount || 0;
  const shipping = subtotal >= 999 ? 0 : 99;
  const total = Math.max(0, subtotal + shipping - discount);

  const handleQuantity = async (itemId, newQty) => {
    if (!isAuthenticated) {
      toast.error("Please login to update your cart");
      navigate("/login");
      return;
    }
    if (newQty < 1) return;
    await dispatch(updateCartItem({ itemId, quantity: newQty }));
  };

  const handleRemove = async (itemId) => {
    if (!isAuthenticated) {
      toast.error("Please login to manage your cart");
      navigate("/login");
      return;
    }
    await dispatch(removeFromCart(itemId));
    toast.success("Item removed");
  };

  const handleApplyCoupon = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to apply coupons");
      navigate("/login");
      return;
    }
    if (!couponInput.trim()) {
      toast.error("Enter a coupon code");
      return;
    }
    setApplying(true);
    const result = await dispatch(applyCoupon(couponInput.trim()));
    setApplying(false);
    if (applyCoupon.fulfilled.match(result)) {
      toast.success("Coupon applied!");
      setCouponInput("");
    } else {
      toast.error(result.payload || "Invalid coupon");
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <ShoppingBag className="w-20 h-20 text-neutral-300 mx-auto mb-6" />
        <h1 className="text-2xl font-display font-bold text-neutral-900 mb-2">
          Your Cart is Empty
        </h1>
        <p className="text-neutral-500 mb-8">
          Looks like you haven't added anything yet
        </p>
        <Link to="/shop" className="btn-primary">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <h1 className="text-xl sm:text-2xl font-display font-bold text-neutral-900 mb-6 sm:mb-8">
        Shopping Cart ({items.length} {items.length === 1 ? "item" : "items"})
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-3 sm:space-y-4">
          {items.map((item) => (
            <div
              key={item._id}
              className="card p-3 sm:p-4 grid grid-cols-[auto_minmax(0,1fr)] gap-3 sm:gap-4"
            >
              <Link
                to={`/shop/${item.product?.slug}`}
                className="w-20 h-20 sm:w-24 sm:h-24 bg-neutral-100 rounded-xl overflow-hidden shrink-0"
              >
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </Link>

              <div className="flex-1 min-w-0 flex flex-col">
                <Link
                  to={`/shop/${item.product?.slug}`}
                  className="font-medium text-sm sm:text-base text-neutral-900 hover:text-primary-500 line-clamp-2"
                >
                  {item.name}
                </Link>

                {item.variant?.value && (
                  <p className="text-xs text-neutral-500 mt-0.5 truncate">
                    {item.variant.name}: {item.variant.value}
                  </p>
                )}

                <p className="text-primary-500 font-bold text-sm sm:text-base mt-1">
                  {formatCurrency(item.price)}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-2 mt-auto pt-3">
                  <div className="flex items-center border border-neutral-300 rounded-lg">
                    <button
                      onClick={() =>
                        handleQuantity(item._id, item.quantity - 1)
                      }
                      disabled={item.quantity <= 1}
                      aria-label="Decrease quantity"
                      className="p-1.5 sm:p-2 hover:bg-neutral-50 disabled:opacity-30"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-sm font-medium min-w-[2rem] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        handleQuantity(item._id, item.quantity + 1)
                      }
                      aria-label="Increase quantity"
                      className="p-1.5 sm:p-2 hover:bg-neutral-50"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => handleRemove(item._id)}
                    className="text-danger hover:text-red-700 text-xs sm:text-sm flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span className="hidden xs:inline">Remove</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="card p-5 sm:p-6 lg:sticky lg:top-24">
            <h2 className="text-base sm:text-lg font-semibold text-neutral-900 mb-4">
              Order Summary
            </h2>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-600">Subtotal</span>
                <span className="font-medium">{formatCurrency(subtotal)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-success">Discount</span>
                  <span className="text-success font-medium">
                    -{formatCurrency(discount)}
                  </span>
                </div>
              )}

              <div className="flex justify-between text-sm">
                <span className="text-neutral-600">Shipping</span>
                <span className="font-medium">
                  {shipping === 0 ? (
                    <span className="text-success">FREE</span>
                  ) : (
                    formatCurrency(shipping)
                  )}
                </span>
              </div>

              {shipping > 0 && (
                <p className="text-xs text-neutral-400">
                  Free shipping on orders above ₹999
                </p>
              )}

              <div className="border-t border-neutral-200 pt-3 flex justify-between items-center">
                <span className="font-semibold text-neutral-900">Total</span>
                <span className="font-bold text-lg sm:text-xl text-primary-500">
                  {formatCurrency(total)}
                </span>
              </div>
            </div>

            {/* Coupon */}
            <div className="mt-4 pt-4 border-t border-neutral-200">
              {cart?.couponCode ? (
                <div className="flex items-center justify-between bg-success/10 rounded-lg px-3 py-2">
                  <span className="text-sm text-success font-medium truncate">
                    <Tag className="w-3.5 h-3.5 inline mr-1" />
                    {cart.couponCode}
                  </span>
                  <button
                    onClick={() => dispatch(removeCoupon())}
                    className="text-xs text-danger hover:underline shrink-0 ml-2"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Coupon code"
                    className="input-field text-sm flex-1 min-w-0"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    disabled={applying}
                    className="btn-primary text-sm px-4 py-2 whitespace-nowrap"
                  >
                    {applying ? "..." : "Apply"}
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => navigate("/checkout")}
              className="btn-primary w-full mt-4 py-3 flex items-center justify-center gap-2"
            >
              Proceed to Checkout <ArrowRight className="w-4 h-4" />
            </button>

            <Link
              to="/shop"
              className="block text-center text-sm text-neutral-500 hover:text-primary-500 mt-3"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Cart;
