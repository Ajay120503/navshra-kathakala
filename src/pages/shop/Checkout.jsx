import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Truck,
  MapPin,
  Check,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../../api/axios";
import { fetchCart, clearCart } from "../../redux/cartSlice";
import { formatCurrency } from "../../utils/formatCurrency";

const STEPS = ["Shipping", "Payment", "Review"];

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cart } = useSelector((state) => state.cart);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [step, setStep] = useState(0);
  const [placing, setPlacing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("razorpay");
  const [address, setAddress] = useState({
    fullName:
      user?.addresses?.find((a) => a.isDefault)?.fullName || user?.name || "",
    phone:
      user?.addresses?.find((a) => a.isDefault)?.phone || user?.phone || "",
    street: user?.addresses?.find((a) => a.isDefault)?.street || "",
    city: user?.addresses?.find((a) => a.isDefault)?.city || "",
    state: user?.addresses?.find((a) => a.isDefault)?.state || "",
    pincode: user?.addresses?.find((a) => a.isDefault)?.pincode || "",
  });
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  useEffect(() => {
    if (!cart?.items?.length) dispatch(fetchCart());
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => setRazorpayLoaded(true);
    script.onerror = () => console.warn("Razorpay SDK failed to load");
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const items = cart?.items || [];
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const discount = cart?.discount || 0;
  const shipping = subtotal >= 999 ? 0 : 99;
  const total = Math.max(0, subtotal + shipping - discount);

  const nextStep = () => {
    if (step < 2) setStep(step + 1);
  };
  const prevStep = () => {
    if (step > 0) setStep(step - 1);
  };

  const handlePlaceOrder = async () => {
    if (
      !address.fullName ||
      !address.phone ||
      !address.street ||
      !address.city ||
      !address.state ||
      !address.pincode
    ) {
      toast.error("Please fill in all shipping address fields");
      setStep(0);
      return;
    }
    setPlacing(true);
    try {
      const orderData = {
        items: items.map((i) => ({
          productId: i.product?._id || i.product,
          quantity: i.quantity,
          variant: i.variant,
          personalization: i.personalization,
        })),
        shippingAddress: address,
        paymentMethod,
        couponCode: cart?.couponCode,
        email: user?.email || "",
        name: address.fullName,
      };

      const { data } = await api.post("/orders", orderData);
      const order = data.data.order;

      if (paymentMethod === "razorpay" && razorpayLoaded) {
        const keyRes = await api.get("/payment/razorpay-key");
        const payRes = await api.post("/payment/create-order", {
          amount: total,
        });

        const rzp = new window.Razorpay({
          key: keyRes.data.data.keyId,
          amount: payRes.data.data.amount,
          currency: "INR",
          name: "Hadmate",
          order_id: payRes.data.data.orderId,
          handler: async (response) => {
            await api.post("/payment/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: order._id,
            });
            dispatch(clearCart());
            navigate(`/order-success/${order._id}`);
          },
          modal: {
            ondismiss: () => {
              setPlacing(false);
              toast.error("Payment cancelled");
            },
          },
          prefill: {
            name: address.fullName,
            contact: address.phone,
            email: user?.email,
          },
          theme: { color: "#F97316" },
        });
        rzp.open();
      } else {
        dispatch(clearCart());
        navigate(`/order-success/${order._id}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to place order");
      setPlacing(false);
    }
  };

  if (!items.length)
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-neutral-500 text-lg">Your cart is empty</p>
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-display font-bold text-neutral-900 mb-8">
        Checkout
      </h1>
      <div className="flex items-center gap-2 mb-8">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                i <= step
                  ? "bg-primary-500 text-white"
                  : "bg-neutral-200 text-neutral-500"
              }`}
            >
              {i < step ? <Check className="w-4 h-4" /> : i + 1}
            </div>
            <span
              className={`text-sm font-medium hidden sm:inline ${
                i <= step ? "text-primary-500" : "text-neutral-400"
              }`}
            >
              {s}
            </span>
            {i < 2 && (
              <div
                className={`w-12 h-0.5 ${
                  i < step ? "bg-primary-500" : "bg-neutral-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {step === 0 && (
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary-500" /> Shipping Address
              </h2>

              {isAuthenticated && user?.addresses?.length > 0 && (
                <div className="mb-4 space-y-2">
                  <p className="text-sm text-neutral-500 mb-2">
                    Saved Addresses:
                  </p>
                  {user.addresses.map((addr, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setAddress(addr)}
                      className={`w-full text-left p-3 rounded-xl border transition-colors ${
                        address === addr
                          ? "border-primary-500 bg-primary-50"
                          : "border-neutral-200 hover:border-primary-300"
                      }`}
                    >
                      <p className="font-medium text-sm">
                        {addr.label} {addr.isDefault && "(Default)"}
                      </p>
                      <p className="text-xs text-neutral-500">
                        {addr.fullName}, {addr.city}, {addr.state} -{" "}
                        {addr.pincode}
                      </p>
                    </button>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={address.fullName}
                    onChange={(e) =>
                      setAddress({ ...address, fullName: e.target.value })
                    }
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    value={address.phone}
                    onChange={(e) =>
                      setAddress({ ...address, phone: e.target.value })
                    }
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Pincode *
                  </label>
                  <input
                    type="text"
                    value={address.pincode}
                    onChange={(e) =>
                      setAddress({ ...address, pincode: e.target.value })
                    }
                    className="input-field"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    value={address.street}
                    onChange={(e) =>
                      setAddress({ ...address, street: e.target.value })
                    }
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    value={address.city}
                    onChange={(e) =>
                      setAddress({ ...address, city: e.target.value })
                    }
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    value={address.state}
                    onChange={(e) =>
                      setAddress({ ...address, state: e.target.value })
                    }
                    className="input-field"
                  />
                </div>
              </div>
              <button onClick={nextStep} className="btn-primary mt-6">
                <ChevronRight className="w-4 h-4" /> Continue to Payment
              </button>
            </div>
          )}

          {step === 1 && (
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary-500" /> Payment
                Method
              </h2>
              <div className="space-y-3">
                <label
                  className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${
                    paymentMethod === "razorpay"
                      ? "border-primary-500 bg-primary-50"
                      : "border-neutral-200 hover:border-primary-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="razorpay"
                    checked={paymentMethod === "razorpay"}
                    onChange={() => setPaymentMethod("razorpay")}
                    className="w-4 h-4 text-primary-500"
                  />
                  <div>
                    <p className="font-medium text-neutral-900">
                      Card / UPI / Net Banking
                    </p>
                    <p className="text-sm text-neutral-500">
                      Pay securely via Razorpay
                    </p>
                  </div>
                </label>
                <label
                  className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${
                    paymentMethod === "cod"
                      ? "border-primary-500 bg-primary-50"
                      : "border-neutral-200 hover:border-primary-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                    className="w-4 h-4 text-primary-500"
                  />
                  <div>
                    <p className="font-medium text-neutral-900">
                      Cash on Delivery
                    </p>
                    <p className="text-sm text-neutral-500">
                      Pay when you receive
                    </p>
                  </div>
                </label>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={prevStep} className="btn-outline">
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
                <button onClick={nextStep} className="btn-primary">
                  <ChevronRight className="w-4 h-4" /> Review Order
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-neutral-900 mb-4">
                Review Your Order
              </h2>
              <div className="space-y-3 mb-6">
                <h3 className="font-medium text-sm text-neutral-700">
                  Items ({items.length})
                </h3>
                {items.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-2 bg-neutral-50 rounded-lg"
                  >
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt=""
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-neutral-500">
                        x{item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-medium">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>
              <div className="bg-neutral-50 rounded-xl p-4 mb-6">
                <h3 className="font-medium text-sm text-neutral-700 mb-2">
                  Shipping To
                </h3>
                <p className="text-sm">
                  {address.fullName}, {address.phone}
                </p>
                <p className="text-sm text-neutral-500">
                  {address.street}, {address.city}, {address.state} -{" "}
                  {address.pincode}
                </p>
              </div>
              <p className="text-sm text-neutral-500 mb-4">
                Payment:{" "}
                <strong className="text-neutral-700">
                  {paymentMethod === "razorpay"
                    ? "Online Payment"
                    : "Cash on Delivery"}
                </strong>
              </p>
              <div className="flex gap-3">
                <button onClick={prevStep} className="btn-outline">
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
                <button
                  onClick={handlePlaceOrder}
                  disabled={placing}
                  className="btn-primary flex-1"
                >
                  {placing ? (
                    <span className="flex items-center gap-2 justify-center">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />{" "}
                      Placing Order...
                    </span>
                  ) : (
                    `Place Order • ${formatCurrency(total)}`
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-24">
            <h3 className="font-semibold text-neutral-900 mb-4">
              Order Summary
            </h3>
            <div className="space-y-2 text-sm">
              {items.map((item, i) => (
                <div key={i} className="flex justify-between">
                  <span className="text-neutral-600 truncate max-w-[200px]">
                    {item.name} x{item.quantity}
                  </span>
                  <span className="font-medium">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t mt-4 pt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-600">Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between">
                  <span className="text-success">Discount</span>
                  <span className="text-success">
                    -{formatCurrency(discount)}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-neutral-600">Shipping</span>
                <span>
                  {shipping === 0 ? (
                    <span className="text-success">FREE</span>
                  ) : (
                    formatCurrency(shipping)
                  )}
                </span>
              </div>
              <div className="border-t pt-2 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-primary-500">
                  {formatCurrency(total)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Checkout;
