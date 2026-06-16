import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Package,
  Heart,
  MapPin,
  User,
  Settings,
  ArrowRight,
  ShoppingBag,
  Star,
  MessageSquare,
} from "lucide-react";
import api from "../../api/axios";
import { formatDateTime } from "../../utils/formatCurrency";

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get("/orders/myorders");
        setRecentOrders(data.data?.orders?.slice(0, 5) || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const quickLinks = [
    {
      icon: Package,
      label: "My Orders",
      desc: "View order history",
      to: "/account/orders",
      color: "text-primary-500 bg-primary-50",
    },
    {
      icon: Heart,
      label: "Wishlist",
      desc: "Saved items",
      to: "/account/wishlist",
      color: "text-danger bg-red-50",
    },
    {
      icon: MapPin,
      label: "Addresses",
      desc: "Manage addresses",
      to: "/account/addresses",
      color: "text-info bg-blue-50",
    },
    {
      icon: User,
      label: "Profile",
      desc: "Edit profile",
      to: "/account/profile",
      color: "text-secondary-500 bg-secondary-50",
    },
    {
      icon: Star,
      label: "My Reviews",
      desc: "View your reviews",
      to: "/account/reviews",
      color: "text-warning bg-yellow-50",
    },
    {
      icon: MessageSquare,
      label: "Custom Orders",
      desc: "Track requests",
      to: "/account/custom-orders",
      color: "text-success bg-green-50",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-display font-bold text-neutral-900">
          Hello, {user?.name || "there"}!
        </h1>
        <p className="text-neutral-500 mt-1">
          Welcome to your Hadmate dashboard
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {quickLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className="card p-4 hover:shadow-md transition-shadow"
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${link.color}`}
            >
              <link.icon className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-neutral-900 text-sm">
              {link.label}
            </h3>
            <p className="text-xs text-neutral-500 mt-1">{link.desc}</p>
          </Link>
        ))}
      </div>

      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-neutral-900">
            Recent Orders
          </h2>
          <Link
            to="/account/orders"
            className="text-sm text-primary-500 hover:text-primary-600 flex items-center gap-1"
          >
            View All <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 skeleton rounded-xl" />
            ))}
          </div>
        ) : recentOrders.length === 0 ? (
          <div className="text-center py-8">
            <ShoppingBag className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
            <p className="text-neutral-500">No orders yet</p>
            <Link
              to="/shop"
              className="text-primary-500 hover:underline text-sm mt-2 inline-block"
            >
              Start shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <Link
                key={order._id}
                to={`/account/orders`}
                className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl hover:bg-neutral-100 transition-colors"
              >
                <div>
                  <p className="font-medium text-sm text-neutral-900">
                    #{order.invoiceNumber}
                  </p>
                  <p className="text-xs text-neutral-500">
                    {formatDateTime(order.createdAt)}
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${
                      order.orderStatus === "delivered"
                        ? "bg-green-100 text-green-700"
                        : order.orderStatus === "cancelled"
                        ? "bg-red-100 text-red-700"
                        : "bg-primary-100 text-primary-700"
                    }`}
                  >
                    {order.orderStatus.replace(/_/g, " ")}
                  </span>
                  <p className="text-sm font-semibold text-neutral-900 mt-1">
                    ₹{order.totalPrice.toLocaleString("en-IN")}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default Dashboard;
