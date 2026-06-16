import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  ShoppingBag,
  Users,
  IndianRupee,
  AlertTriangle,
  TrendingUp,
  Star,
} from "lucide-react";
import { formatCurrency } from "../../utils/formatCurrency";
import api from "../../api/axios";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await api.get("/admin/dashboard");
        setStats(data.data.stats);
        setRecentOrders(data.data.recentOrders || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-t-transparent" />
      </div>
    );

  const cards = [
    {
      label: "Total Revenue",
      value: formatCurrency(stats?.totalRevenue || 0),
      icon: IndianRupee,
      color: "bg-green-50 text-green-600",
    },
    {
      label: "Total Orders",
      value: stats?.totalOrders || 0,
      icon: ShoppingBag,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Total Products",
      value: stats?.totalProducts || 0,
      icon: Package,
      color: "bg-primary-50 text-primary-600",
    },
    {
      label: "Total Customers",
      value: stats?.totalCustomers || 0,
      icon: Users,
      color: "bg-secondary-50 text-secondary-600",
    },
    {
      label: "Pending Orders",
      value: stats?.pendingOrders || 0,
      icon: AlertTriangle,
      color: "bg-yellow-50 text-yellow-600",
    },
    {
      label: "Low Stock Items",
      value: stats?.lowStockCount || 0,
      icon: AlertTriangle,
      color: "bg-red-50 text-red-600",
    },
    {
      label: "Pending Reviews",
      value: stats?.pendingReviews || 0,
      icon: Star,
      color: "bg-yellow-50 text-yellow-600",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-6">
        Dashboard
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {cards.map((card, i) => (
          <div
            key={i}
            className="bg-card rounded-xl p-3 sm:p-4 border shadow-sm flex flex-col"
          >
            <div
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center mb-2 sm:mb-3 shrink-0 ${
                card.color.split(" ")[0]
              }`}
            >
              <card.icon
                className={`w-4 h-4 sm:w-5 sm:h-5 ${card.color.split(" ")[1]}`}
              />
            </div>
            <p className="text-xl sm:text-2xl font-bold text-foreground">
              {card.value}
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              {card.label}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
        <div className="p-3 sm:p-4 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h2 className="text-base sm:text-lg font-semibold text-foreground">
            Recent Orders
          </h2>
          <Link
            to="/admin/orders"
            className="text-sm text-primary hover:text-primary/80 transition-colors font-medium"
          >
            View All
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="p-6 sm:p-8 text-center text-muted-foreground text-sm">
            No orders yet
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[640px]">
              <thead>
                <tr className="bg-muted/50">
                  <th className="text-left p-2.5 sm:p-3 font-medium text-muted-foreground text-xs sm:text-sm">
                    Invoice
                  </th>
                  <th className="text-left p-2.5 sm:p-3 font-medium text-muted-foreground text-xs sm:text-sm">
                    Customer
                  </th>
                  <th className="text-left p-2.5 sm:p-3 font-medium text-muted-foreground text-xs sm:text-sm">
                    Date
                  </th>
                  <th className="text-left p-2.5 sm:p-3 font-medium text-muted-foreground text-xs sm:text-sm">
                    Status
                  </th>
                  <th className="text-right p-2.5 sm:p-3 font-medium text-muted-foreground text-xs sm:text-sm">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr
                    key={order._id}
                    className="border-t transition-colors hover:bg-muted/40"
                  >
                    <td className="p-2.5 sm:p-3 font-medium text-foreground text-xs sm:text-sm">
                      {order.invoiceNumber}
                    </td>
                    <td className="p-2.5 sm:p-3 text-foreground text-xs sm:text-sm">
                      {order.user?.name || order.guestName || "Guest"}
                    </td>
                    <td className="p-2.5 sm:p-3 text-muted-foreground text-xs sm:text-sm whitespace-nowrap">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-2.5 sm:p-3">
                      <span
                        className={`inline-flex items-center text-xs px-2 py-0.5 rounded-full font-medium ${getStatusBadgeClasses(
                          order.orderStatus
                        )}`}
                      >
                        {order.orderStatus.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="p-2.5 sm:p-3 text-right font-medium text-foreground text-xs sm:text-sm whitespace-nowrap">
                      {formatCurrency(order.totalPrice)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );

  // Helper to keep status badge classes clean
  function getStatusBadgeClasses(status) {
    switch (status) {
      case "delivered":
        return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
      case "cancelled":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      case "pending":
        return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
      case "processing":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      default:
        return "bg-primary/10 text-primary";
    }
  }
};
export default AdminDashboard;
