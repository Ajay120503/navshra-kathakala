import { Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

// Admin Pages
import AdminDashboard from "../../pages/admin/Dashboard";
import AdminProducts from "../../pages/admin/Products";
import AdminProductForm from "../../pages/admin/ProductForm";
import AdminCategories from "../../pages/admin/Categories";
import AdminOrders from "../../pages/admin/Orders";
import AdminOrderDetail from "../../pages/admin/OrderDetail";
import AdminCustomOrders from "../../pages/admin/CustomOrders";
import AdminCustomers from "../../pages/admin/Customers";
import AdminReviews from "../../pages/admin/Reviews";
import AdminCoupons from "../../pages/admin/Coupons";
import AdminSettings from "../../pages/admin/Settings";
import AdminPages from "../../pages/admin/Pages";

const AdminLayout = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  if (
    !isAuthenticated ||
    !user ||
    (user.role !== "admin" &&
      user.role !== "staff" &&
      user.role !== "superadmin")
  ) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen bg-neutral-50 overflow-hidden">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Routes>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="products/new" element={<AdminProductForm />} />
            <Route path="products/:id/edit" element={<AdminProductForm />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="orders/:id" element={<AdminOrderDetail />} />
            <Route path="custom-orders" element={<AdminCustomOrders />} />
            <Route path="customers" element={<AdminCustomers />} />
            <Route path="reviews" element={<AdminReviews />} />
            <Route path="coupons" element={<AdminCoupons />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="pages" element={<AdminPages />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
