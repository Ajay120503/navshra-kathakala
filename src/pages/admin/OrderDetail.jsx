import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../api/axios";
import { formatCurrency, formatDateTime } from "../../utils/formatCurrency";
const AdminOrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get(`/orders/${id}`);
        setOrder(data.data.order);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetch();
  }, [id]);
  const updateStatus = async (status) => {
    setUpdating(true);
    try {
      const { data } = await api.put(`/orders/${id}/status`, { status });
      setOrder(data.data.order);
      toast.success("Status updated");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    } finally {
      setUpdating(false);
    }
  };
  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-t-transparent" />
      </div>
    );
  if (!order)
    return (
      <div className="text-center py-16 text-neutral-500">Order not found</div>
    );
  const statuses = [
    "placed",
    "confirmed",
    "packed",
    "shipped",
    "out_for_delivery",
    "delivered",
    "cancelled",
  ];
  const currentIdx = statuses.indexOf(order.orderStatus);
  return (
    <div>
      <Link
        to="/admin/orders"
        className="flex items-center gap-2 text-sm text-neutral-500 hover:text-primary-500 mb-4"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Orders
      </Link>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-neutral-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-xl font-bold text-neutral-900">
                  Order #{order.invoiceNumber}
                </h1>
                <p className="text-sm text-neutral-500">
                  {formatDateTime(order.createdAt)}
                </p>
              </div>
              <span
                className={`text-sm px-3 py-1 rounded-full ${
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
            <div className="border-t pt-4">
              <p className="text-sm text-neutral-500 mb-2">Update Status:</p>
              <div className="flex flex-wrap gap-2">
                {statuses.map((s) => (
                  <button
                    key={s}
                    onClick={() => updateStatus(s)}
                    disabled={
                      updating ||
                      Math.abs(statuses.indexOf(s) - currentIdx) > 1 ||
                      (order.orderStatus === "cancelled" &&
                        s !== "cancelled") ||
                      order.orderStatus === "delivered"
                    }
                    className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                      order.orderStatus === s
                        ? "bg-primary-500 text-white border-primary-500"
                        : "hover:border-primary-300 border-neutral-200 text-neutral-600 disabled:opacity-30 disabled:cursor-not-allowed"
                    }`}
                  >
                    {s.replace(/_/g, " ")}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-neutral-200 p-6">
            <h2 className="font-semibold text-neutral-900 mb-4">Items</h2>
            <div className="space-y-3">
              {order.items?.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-2 bg-neutral-50 rounded-lg"
                >
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt=""
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-neutral-500">
                      x{item.quantity} • ₹{item.price}
                    </p>
                  </div>
                  <p className="text-sm font-medium">
                    {formatCurrency(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-neutral-200 p-6">
            <h2 className="font-semibold text-neutral-900 mb-4">
              Order Summary
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-500">Subtotal</span>
                <span>{formatCurrency(order.itemsPrice)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between">
                  <span className="text-success">Discount</span>
                  <span className="text-success">
                    -{formatCurrency(order.discount)}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-neutral-500">Shipping</span>
                <span>
                  {order.shippingPrice === 0 ? (
                    <span className="text-success">FREE</span>
                  ) : (
                    formatCurrency(order.shippingPrice)
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Tax</span>
                <span>{formatCurrency(order.taxPrice)}</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-primary-500">
                  {formatCurrency(order.totalPrice)}
                </span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-neutral-200 p-6">
            <h2 className="font-semibold text-neutral-900 mb-4">Customer</h2>
            <p className="text-sm font-medium">
              {order.user?.name || order.guestName}
            </p>
            <p className="text-sm text-neutral-500">
              {order.user?.email || order.guestEmail}
            </p>
          </div>
          <div className="bg-white rounded-xl border border-neutral-200 p-6">
            <h2 className="font-semibold text-neutral-900 mb-4">
              Shipping Address
            </h2>
            <p className="text-sm">{order.shippingAddress?.fullName}</p>
            <p className="text-sm text-neutral-500">
              {order.shippingAddress?.street}
            </p>
            <p className="text-sm text-neutral-500">
              {order.shippingAddress?.city}, {order.shippingAddress?.state} -{" "}
              {order.shippingAddress?.pincode}
            </p>
            <p className="text-sm text-neutral-500">
              📞 {order.shippingAddress?.phone}
            </p>
          </div>
          <div className="bg-white rounded-xl border border-neutral-200 p-6">
            <h2 className="font-semibold text-neutral-900 mb-4">Payment</h2>
            <p className="text-sm">
              Method: <strong>{order.paymentMethod}</strong>
            </p>
            <p className="text-sm">
              Status:{" "}
              <span
                className={`font-medium ${
                  order.paymentStatus === "paid"
                    ? "text-success"
                    : "text-warning"
                }`}
              >
                {order.paymentStatus}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AdminOrderDetail;
