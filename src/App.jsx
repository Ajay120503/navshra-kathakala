import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchSettings } from "./redux/settingsSlice";
import { fetchCart } from "./redux/cartSlice";
import { getMe } from "./redux/authSlice";
import { ProtectedRoute, AdminRoute } from "./routes/ProtectedRoute";

import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

// Pages - Shop
import Home from "./pages/shop/Home";
import CategoryPage from "./pages/shop/CategoryPage";
import ProductDetail from "./pages/shop/ProductDetail";
import Cart from "./pages/shop/Cart";
import Checkout from "./pages/shop/Checkout";
import OrderSuccess from "./pages/shop/OrderSuccess";
import Search from "./pages/shop/Search";
import CustomOrder from "./pages/shop/CustomOrder";

// Pages - Account
import Login from "./pages/account/Login";
import Register from "./pages/account/Register";
import ForgotPassword from "./pages/account/ForgotPassword";
import Dashboard from "./pages/account/Dashboard";
import MyOrders from "./pages/account/MyOrders";
import OrderDetail from "./pages/account/OrderDetail";
import Wishlist from "./pages/account/Wishlist";
import Addresses from "./pages/account/Addresses";
import Profile from "./pages/account/Profile";
import MyReviews from "./pages/account/MyReviews";
import MyCustomOrders from "./pages/account/MyCustomOrders";

// Pages - Static
import About from "./pages/static/About";
import Contact from "./pages/static/Contact";
import FAQ from "./pages/static/FAQ";
import PrivacyPolicy from "./pages/static/PrivacyPolicy";
import Terms from "./pages/static/Terms";
import ShippingPolicy from "./pages/static/ShippingPolicy";
import TrackOrder from "./pages/static/TrackOrder";

// Pages - Admin
import AdminLayout from "./components/layout/AdminLayout";

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  // Verify token on app load - ensures stale tokens are detected
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(getMe());
    }
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchSettings());
  }, [dispatch]);
  useEffect(() => {
    if (isAuthenticated) dispatch(fetchCart());
  }, [isAuthenticated, dispatch]);

  return (
    <Routes>
      {/* Admin routes FIRST - more specific path matching */}
      <Route path="/admin/*" element={<AdminLayout />} />

      {/* Public routes - catch-all MUST come AFTER admin */}
      <Route
        path="/"
        element={
          <>
            <Header />
            <main className="min-h-screen">
              <Home />
            </main>
            <Footer />
          </>
        }
      />
      <Route
        path="/shop"
        element={
          <>
            <Header />
            <main className="min-h-screen">
              <CategoryPage />
            </main>
            <Footer />
          </>
        }
      />
      <Route
        path="/shop/:slug"
        element={
          <>
            <Header />
            <main className="min-h-screen">
              <ProductDetail />
            </main>
            <Footer />
          </>
        }
      />
      <Route
        path="/cart"
        element={
          <>
            <Header />
            <main className="min-h-screen">
              <Cart />
            </main>
            <Footer />
          </>
        }
      />
      <Route
        path="/checkout"
        element={
          <>
            <Header />
            <main className="min-h-screen">
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            </main>
            <Footer />
          </>
        }
      />
      <Route
        path="/order-success/:id"
        element={
          <>
            <Header />
            <main className="min-h-screen">
              <OrderSuccess />
            </main>
            <Footer />
          </>
        }
      />
      <Route
        path="/search"
        element={
          <>
            <Header />
            <main className="min-h-screen">
              <Search />
            </main>
            <Footer />
          </>
        }
      />
      <Route
        path="/custom-order"
        element={
          <>
            <Header />
            <main className="min-h-screen">
              <CustomOrder />
            </main>
            <Footer />
          </>
        }
      />
      <Route
        path="/login"
        element={
          <>
            <Header />
            <main className="min-h-screen">
              <Login />
            </main>
            <Footer />
          </>
        }
      />
      <Route
        path="/register"
        element={
          <>
            <Header />
            <main className="min-h-screen">
              <Register />
            </main>
            <Footer />
          </>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <>
            <Header />
            <main className="min-h-screen">
              <ForgotPassword />
            </main>
            <Footer />
          </>
        }
      />
      <Route
        path="/reset-password/:token"
        element={
          <>
            <Header />
            <main className="min-h-screen">
              <ForgotPassword />
            </main>
            <Footer />
          </>
        }
      />
      <Route
        path="/account"
        element={
          <>
            <Header />
            <main className="min-h-screen">
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            </main>
            <Footer />
          </>
        }
      />
      <Route
        path="/account/orders"
        element={
          <>
            <Header />
            <main className="min-h-screen">
              <ProtectedRoute>
                <MyOrders />
              </ProtectedRoute>
            </main>
            <Footer />
          </>
        }
      />
      <Route
        path="/account/orders/:id"
        element={
          <>
            <Header />
            <main className="min-h-screen">
              <ProtectedRoute>
                <OrderDetail />
              </ProtectedRoute>
            </main>
            <Footer />
          </>
        }
      />
      <Route
        path="/account/wishlist"
        element={
          <>
            <Header />
            <main className="min-h-screen">
              <ProtectedRoute>
                <Wishlist />
              </ProtectedRoute>
            </main>
            <Footer />
          </>
        }
      />
      <Route
        path="/account/addresses"
        element={
          <>
            <Header />
            <main className="min-h-screen">
              <ProtectedRoute>
                <Addresses />
              </ProtectedRoute>
            </main>
            <Footer />
          </>
        }
      />
      <Route
        path="/account/profile"
        element={
          <>
            <Header />
            <main className="min-h-screen">
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            </main>
            <Footer />
          </>
        }
      />
      <Route
        path="/account/reviews"
        element={
          <>
            <Header />
            <main className="min-h-screen">
              <ProtectedRoute>
                <MyReviews />
              </ProtectedRoute>
            </main>
            <Footer />
          </>
        }
      />
      <Route
        path="/account/custom-orders"
        element={
          <>
            <Header />
            <main className="min-h-screen">
              <ProtectedRoute>
                <MyCustomOrders />
              </ProtectedRoute>
            </main>
            <Footer />
          </>
        }
      />
      <Route
        path="/about"
        element={
          <>
            <Header />
            <main className="min-h-screen">
              <About />
            </main>
            <Footer />
          </>
        }
      />
      <Route
        path="/contact"
        element={
          <>
            <Header />
            <main className="min-h-screen">
              <Contact />
            </main>
            <Footer />
          </>
        }
      />
      <Route
        path="/faqs"
        element={
          <>
            <Header />
            <main className="min-h-screen">
              <FAQ />
            </main>
            <Footer />
          </>
        }
      />
      <Route
        path="/privacy-policy"
        element={
          <>
            <Header />
            <main className="min-h-screen">
              <PrivacyPolicy />
            </main>
            <Footer />
          </>
        }
      />
      <Route
        path="/terms"
        element={
          <>
            <Header />
            <main className="min-h-screen">
              <Terms />
            </main>
            <Footer />
          </>
        }
      />
      <Route
        path="/shipping-policy"
        element={
          <>
            <Header />
            <main className="min-h-screen">
              <ShippingPolicy />
            </main>
            <Footer />
          </>
        }
      />
      <Route
        path="/track-order"
        element={
          <>
            <Header />
            <main className="min-h-screen">
              <TrackOrder />
            </main>
            <Footer />
          </>
        }
      />
      <Route
        path="/track-order/:invoiceNumber"
        element={
          <>
            <Header />
            <main className="min-h-screen">
              <TrackOrder />
            </main>
            <Footer />
          </>
        }
      />

      {/* 404 */}
      <Route
        path="*"
        element={
          <>
            <Header />
            <main className="min-h-screen">
              <div className="text-center py-16">
                <h1 className="text-4xl font-bold text-neutral-900">404</h1>
                <p className="text-neutral-500 mt-4">Page not found</p>
              </div>
            </main>
            <Footer />
          </>
        }
      />
    </Routes>
  );
}

export default App;
