import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Eye } from "lucide-react";
import api from "../../api/axios";
import { formatCurrency, formatDateTime } from "../../utils/formatCurrency";
const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  useEffect(() => {
    const fetch = async () => {
      try {
        const params = new URLSearchParams();
        if (status) params.set("status", status);
        if (search) params.set("search", search);
        const { data } = await api.get(`/orders?${params}`);
        setOrders(data.data?.orders || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [status, search]);
  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-t-transparent" />
      </div>
    );
  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900 mb-6">Orders</h1>
      <div className="flex gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by invoice or customer..."
            className="input-field pl-9 text-sm"
          />
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="input-field w-48 text-sm"
        >
          <option value="">All Status</option>
          <option value="placed">Placed</option>
          <option value="confirmed">Confirmed</option>
          <option value="packed">Packed</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-neutral-50">
              <th className="text-left p-3 font-medium text-neutral-600">
                Invoice
              </th>
              <th className="text-left p-3 font-medium text-neutral-600">
                Customer
              </th>
              <th className="text-left p-3 font-medium text-neutral-600">
                Date
              </th>
              <th className="text-left p-3 font-medium text-neutral-600">
                Status
              </th>
              <th className="text-left p-3 font-medium text-neutral-600">
                Payment
              </th>
              <th className="text-right p-3 font-medium text-neutral-600">
                Total
              </th>
              <th className="text-right p-3 font-medium text-neutral-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr
                key={o._id}
                className="border-t border-neutral-100 hover:bg-neutral-50"
              >
                <td className="p-3 font-medium">{o.invoiceNumber}</td>
                <td className="p-3">
                  {o.user?.name || o.guestName || "Guest"}
                </td>
                <td className="p-3 text-neutral-500">
                  {formatDateTime(o.createdAt)}
                </td>
                <td className="p-3">
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      o.orderStatus === "delivered"
                        ? "bg-green-100 text-green-700"
                        : o.orderStatus === "cancelled"
                        ? "bg-red-100 text-red-700"
                        : "bg-primary-100 text-primary-700"
                    }`}
                  >
                    {o.orderStatus.replace(/_/g, " ")}
                  </span>
                </td>
                <td className="p-3">
                  <span
                    className={`text-xs font-medium ${
                      o.paymentStatus === "paid"
                        ? "text-success"
                        : o.paymentStatus === "failed"
                        ? "text-danger"
                        : "text-warning"
                    }`}
                  >
                    {o.paymentStatus}
                  </span>
                </td>
                <td className="p-3 text-right font-medium">
                  {formatCurrency(o.totalPrice)}
                </td>
                <td className="p-3 text-right">
                  <Link
                    to={`/admin/orders/${o._id}`}
                    className="p-1.5 hover:bg-primary-50 rounded-lg inline-block"
                  >
                    <Eye className="w-4 h-4 text-primary-500" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default AdminOrders;
