import { useState } from "react";
import { Package, Search, Truck, CheckCircle, Clock } from "lucide-react";
import { formatDateTime } from "../../utils/formatCurrency";
import api from "../../api/axios";

const TrackOrder = () => {
  const [invoice, setInvoice] = useState("");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!invoice.trim()) {
      setError("Please enter an invoice number");
      return;
    }
    setLoading(true);
    setError("");
    setOrder(null);
    try {
      const { data } = await api.get(`/orders/track/${invoice.trim()}`);
      setOrder(data.data.order);
    } catch (err) {
      setError(err.response?.data?.message || "Order not found");
    } finally {
      setLoading(false);
    }
  };

  const statusSteps = [
    { key: "placed", label: "Placed", icon: Clock },
    { key: "confirmed", label: "Confirmed", icon: CheckCircle },
    { key: "packed", label: "Packed", icon: Package },
    { key: "shipped", label: "Shipped", icon: Truck },
    { key: "delivered", label: "Delivered", icon: CheckCircle },
  ];

  const currentStatusIndex = statusSteps.findIndex(
    (s) => s.key === order?.orderStatus
  );

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-display font-bold text-neutral-900">
          Track Your Order
        </h1>
        <p className="text-neutral-500 mt-2">
          Enter your invoice number to track your order status
        </p>
      </div>
      <div className="card p-6">
        <form onSubmit={handleTrack} className="flex gap-3 mb-6">
          <input
            type="text"
            value={invoice}
            onChange={(e) => setInvoice(e.target.value)}
            placeholder="Enter invoice number (e.g., HAD-202406-0001)"
            className="input-field flex-1"
          />
          <button type="submit" disabled={loading} className="btn-primary">
            <Search className="w-4 h-4" /> {loading ? "..." : "Track"}
          </button>
        </form>
        {error && <p className="text-sm text-danger text-center">{error}</p>}
      </div>
      {order && (
        <div className="card p-6 mt-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-neutral-900">
                Order #{order.invoiceNumber}
              </h2>
              <p className="text-sm text-neutral-500">
                Placed on {formatDateTime(order.createdAt)}
              </p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                order.orderStatus === "delivered"
                  ? "bg-green-100 text-green-700"
                  : order.orderStatus === "cancelled"
                  ? "bg-red-100 text-red-700"
                  : "bg-primary-100 text-primary-700"
              }`}
            >
              {order.orderStatus.replace(/_/g, " ")}
            </span>
          </div>

          <div className="relative mb-8">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-neutral-200" />
            {statusSteps.map((step, i) => {
              const isActive = i <= currentStatusIndex;
              const isCancelled = order.orderStatus === "cancelled";
              return (
                <div
                  key={step.key}
                  className="flex items-start gap-4 relative pb-6 last:pb-0"
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 ${
                      isActive && !isCancelled
                        ? "bg-primary-500"
                        : "bg-neutral-200"
                    }`}
                  >
                    <step.icon
                      className={`w-4 h-4 ${
                        isActive && !isCancelled
                          ? "text-white"
                          : "text-neutral-400"
                      }`}
                    />
                  </div>
                  <div className="pt-1">
                    <p
                      className={`font-medium text-sm ${
                        isActive && !isCancelled
                          ? "text-neutral-900"
                          : "text-neutral-400"
                      }`}
                    >
                      {step.label}
                    </p>
                  </div>
                </div>
              );
            })}
            {(order.orderStatus === "cancelled" ||
              order.orderStatus === "returned") && (
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-danger flex items-center justify-center shrink-0">
                  <span className="text-white text-xs font-bold">✕</span>
                </div>
                <div className="pt-1">
                  <p className="font-medium text-sm text-danger">
                    {order.orderStatus === "cancelled"
                      ? "Cancelled"
                      : "Returned"}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="bg-neutral-50 rounded-xl p-4">
            <h3 className="font-medium text-sm text-neutral-700 mb-2">
              Shipping Address
            </h3>
            <p className="text-sm text-neutral-600">
              {order.shippingAddress?.fullName}
            </p>
            <p className="text-sm text-neutral-500">
              {order.shippingAddress?.street}, {order.shippingAddress?.city},{" "}
              {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
            </p>
          </div>

          {order.items?.length > 0 && (
            <div className="mt-4 space-y-2">
              <h3 className="font-medium text-sm text-neutral-700">Items</h3>
              {order.items.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-2 bg-neutral-50 rounded-lg"
                >
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt=""
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-neutral-500">x{item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
export default TrackOrder;
