import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, ChevronRight, Search } from "lucide-react";
import api from "../../api/axios";
import { formatCurrency, formatDateTime } from "../../utils/formatCurrency";
const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get("/orders/myorders");
        setOrders(data.data?.orders || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);
  const filtered = orders.filter(
    (o) =>
      !search || o.invoiceNumber?.toLowerCase().includes(search.toLowerCase())
  );
  const getStatusColor = (status) => {
    const colors = {
      placed: "bg-primary-100 text-primary-700",
      confirmed: "bg-blue-100 text-blue-700",
      packed: "bg-blue-100 text-blue-700",
      shipped: "bg-primary-100 text-primary-700",
      out_for_delivery: "bg-secondary-100 text-secondary-600",
      delivered: "bg-green-100 text-green-700",
      cancelled: "bg-red-100 text-red-700",
      returned: "bg-red-100 text-red-700",
    };
    return colors[status] || "bg-neutral-100 text-neutral-700";
  };
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {" "}
      <h1 className="text-2xl font-display font-bold text-neutral-900 mb-6">
        My Orders
      </h1>{" "}
      <div className="relative mb-6">
        {" "}
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />{" "}
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by invoice number..."
          className="input-field pl-10"
        />{" "}
      </div>{" "}
      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 skeleton rounded-xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 card">
          <Package className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
          <p className="text-lg text-neutral-500">
            {search ? "No orders match your search" : "No orders yet"}
          </p>
          <Link
            to="/shop"
            className="text-primary-500 hover:underline mt-2 inline-block"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((order) => (
            <Link
              key={order._id}
              to={`/account/orders/${order._id}`}
              className="card p-4 block hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <p className="font-semibold text-neutral-900">
                      #{order.invoiceNumber}
                    </p>
                    <span
                      className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${getStatusColor(
                        order.orderStatus
                      )}`}
                    >
                      {order.orderStatus.replace(/_/g, " ")}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-500">
                    {formatDateTime(order.createdAt)} •{" "}
                    {order.items?.length || 0} item(s)
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-neutral-900">
                    {formatCurrency(order.totalPrice)}
                  </p>
                  <p
                    className={`text-xs mt-1 ${
                      order.paymentStatus === "paid"
                        ? "text-success"
                        : order.paymentStatus === "failed"
                        ? "text-danger"
                        : "text-warning"
                    }`}
                  >
                    {order.paymentStatus}
                  </p>
                </div>
              </div>
              {order.items?.length > 0 && (
                <div className="flex gap-2 mt-3 pt-3 border-t border-neutral-100">
                  {order.items.slice(0, 4).map((item, i) => (
                    <img
                      key={i}
                      src={item.image || "/placeholder.svg"}
                      alt=""
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                  ))}
                  {order.items.length > 4 && (
                    <span className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center text-xs text-neutral-500 font-medium">
                      +{order.items.length - 4}
                    </span>
                  )}
                </div>
              )}
            </Link>
          ))}
        </div>
      )}{" "}
    </div>
  );
};
export default MyOrders;
