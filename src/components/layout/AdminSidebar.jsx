import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Star,
  Percent,
  Settings,
  FileText,
  MessageSquare,
  Grid3X3,
} from "lucide-react";

const menuItems = [
  { path: "/admin", icon: LayoutDashboard, label: "Dashboard", exact: true },
  { path: "/admin/products", icon: Package, label: "Products" },
  { path: "/admin/categories", icon: Grid3X3, label: "Categories" },
  { path: "/admin/orders", icon: ShoppingBag, label: "Orders" },
  { path: "/admin/custom-orders", icon: MessageSquare, label: "Custom Orders" },
  { path: "/admin/customers", icon: Users, label: "Customers" },
  { path: "/admin/reviews", icon: Star, label: "Reviews" },
  { path: "/admin/coupons", icon: Percent, label: "Coupons" },
  { path: "/admin/pages", icon: FileText, label: "Pages" },
  { path: "/admin/settings", icon: Settings, label: "Settings" },
];

const AdminSidebar = () => {
  const location = useLocation();

  const isActive = (item) => {
    if (item.exact) return location.pathname === item.path;
    return location.pathname.startsWith(item.path);
  };

  return (
    <aside className="w-64 bg-white border-r border-neutral-200 flex flex-col shrink-0">
      <div className="p-4 border-b border-neutral-200">
        <Link to="/admin" className="flex items-center gap-2">
          <span className="text-xl font-display font-bold text-primary-500">
            Hadmate
          </span>
          <span className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full font-medium">
            Admin
          </span>
        </Link>
      </div>
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              isActive(item)
                ? "bg-primary-50 text-primary-600"
                : "text-neutral-600 hover:bg-neutral-100"
            }`}
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="p-3 border-t border-neutral-200">
        <Link
          to="/"
          className="flex items-center gap-2 px-3 py-2.5 text-sm text-neutral-500 hover:text-neutral-700 rounded-xl hover:bg-neutral-100 transition-colors"
        >
          ← Back to Store
        </Link>
      </div>
    </aside>
  );
};

export default AdminSidebar;
