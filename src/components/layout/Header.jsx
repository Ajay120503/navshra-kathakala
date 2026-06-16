import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  Search,
  ShoppingBag,
  User,
  Menu,
  X,
  Heart,
  LogOut,
  Star,
  ChevronDown,
  MessageSquare,
} from "lucide-react";
import { logoutUser } from "../../redux/authSlice";
import { clearCart } from "../../redux/cartSlice";
import { useDebounce } from "../../hooks/useDebounce";
import api from "../../api/axios";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const debouncedSearch = useDebounce(searchQuery, 300);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userMenuRef = useRef(null);
  const searchBoxRef = useRef(null);

  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);
  const { settings } = useSelector((state) => state.settings);

  const cartCount =
    cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const wishlistCount = Array.isArray(user?.wishlist)
    ? user.wishlist.filter(Boolean).length
    : 0;

  const defaultNavItems = [
    { label: "Home", url: "/" },
    { label: "Shop", url: "/shop" },
    { label: "Custom Order", url: "/custom-order" },
    { label: "About", url: "/about" },
    { label: "Contact", url: "/contact" },
  ];

  const navItems =
    settings?.header?.navItems
      ?.filter((item) => item.isActive !== false)
      .sort((a, b) => (a.order || 0) - (b.order || 0)) || [];
  const menuItems = navItems.length > 0 ? navItems : defaultNavItems;
  const headerSticky = settings?.header?.stickyHeader !== false;
  const showAnnouncement =
    settings?.header?.showAnnouncement !== false &&
    settings?.announcementBar?.isEnabled;

  const getNavUrl = (item) => {
    if (item.type === "category" && item.category) {
      return `/shop?category=${item.category._id || item.category}`;
    }
    return item.url || "/";
  };

  const renderNavItem = (item, className, onClick) => {
    if (item.type === "dropdown" && item.children?.length > 0) {
      return (
        <div key={item.label} className="relative group">
          <button
            className={`${className} flex items-center gap-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-md`}
          >
            {item.label}
            <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
          </button>
          <div className="absolute left-0 top-full pt-3 hidden group-hover:block z-50">
            <div className="w-52 bg-white rounded-xl shadow-xl ring-1 ring-neutral-200 py-2">
              {item.children.map((child) => (
                <Link
                  key={`${item.label}-${child.label}`}
                  to={child.url || "/"}
                  className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-primary-500 transition-colors"
                  onClick={onClick}
                >
                  {child.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      );
    }

    return (
      <Link
        key={item.label}
        to={getNavUrl(item)}
        onClick={onClick}
        className={className}
      >
        {item.label}
      </Link>
    );
  };

  // Suggestions fetch
  useEffect(() => {
    if (debouncedSearch.length > 1) {
      api
        .get(`/products?search=${debouncedSearch}&limit=5`)
        .then((res) => setSuggestions(res.data.data?.products || []))
        .catch(() => setSuggestions([]));
    } else {
      setSuggestions([]);
    }
  }, [debouncedSearch]);

  // Close user menu / suggestions on outside click
  useEffect(() => {
    const onClick = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target)) {
        setSuggestions([]);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  // Lock scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const handleLogout = async () => {
    setUserMenuOpen(false);
    await dispatch(logoutUser());
    dispatch(clearCart());
    navigate("/");
  };

  const iconBtn =
    "relative p-2 rounded-full text-neutral-600 hover:text-primary-500 hover:bg-neutral-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500";

  const badge =
    "absolute -top-0.5 -right-0.5 bg-primary-500 text-white text-[10px] min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center font-semibold ring-2 ring-white";

  return (
    <header
      className={`bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 border-b border-neutral-200 z-50 ${
        headerSticky ? "sticky top-0" : ""
      }`}
    >
      {/* Announcement Bar */}
      {showAnnouncement && (
        <div
          className="text-center text-xs sm:text-sm py-2 px-4"
          style={{
            backgroundColor: settings.announcementBar.bgColor,
            color: settings.announcementBar.textColor,
          }}
        >
          {settings.announcementBar.link ? (
            <Link
              to={settings.announcementBar.link}
              className="font-medium hover:underline underline-offset-2"
            >
              {settings.announcementBar.text}
            </Link>
          ) : (
            <p className="font-medium">{settings.announcementBar.text}</p>
          )}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Row */}
        <div className="grid grid-cols-[auto_1fr_auto] lg:grid-cols-[auto_1fr_auto] items-center gap-3 sm:gap-4 h-16 lg:h-20">
          {/* Left: Mobile menu + Logo */}
          <div className="flex items-center gap-2 min-w-0">
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
              className="lg:hidden p-2 -ml-2 rounded-md text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>

            <Link
              to="/"
              className="flex items-center gap-2 shrink-0 min-w-0"
              aria-label="Home"
            >
              {settings?.logo?.url ? (
                <img
                  src={settings.logo.url}
                  alt={settings.siteName}
                  className="h-8 lg:h-10 w-auto"
                />
              ) : (
                <span className="text-xl sm:text-2xl font-display font-bold text-primary-500 truncate">
                  {settings?.siteName || "Hadmate"}
                </span>
              )}
            </Link>
          </div>

          {/* Center: Desktop Nav + Search */}
          <div className="hidden lg:flex items-center justify-center gap-6 min-w-0">
            <nav className="flex items-center gap-6 xl:gap-8 shrink-0">
              {menuItems.map((item) =>
                renderNavItem(
                  item,
                  "text-sm xl:text-[15px] text-neutral-700 hover:text-primary-500 font-medium transition-colors"
                )
              )}
            </nav>

            <div
              ref={searchBoxRef}
              className="relative flex-1 max-w-sm xl:max-w-md"
            >
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
              <form onSubmit={handleSearch}>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-neutral-100 border border-transparent rounded-full focus:bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                />
              </form>
              {suggestions.length > 0 && (
                <div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-xl ring-1 ring-neutral-200 p-2 z-50 max-h-96 overflow-y-auto">
                  {suggestions.map((product) => (
                    <button
                      key={product._id}
                      onClick={() => {
                        navigate(`/shop/${product.slug}`);
                        setSearchQuery("");
                        setSuggestions([]);
                      }}
                      className="flex items-center gap-3 w-full p-2 hover:bg-neutral-50 rounded-lg text-left transition-colors"
                    >
                      <img
                        src={product.images?.[0]?.url || "/placeholder.svg"}
                        alt={product.title}
                        className="h-10 w-10 rounded-lg object-cover shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-neutral-900 truncate">
                          {product.title}
                        </p>
                        <p className="text-xs text-neutral-500">
                          ₹{product.discountPrice || product.price}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: Icons */}
          <div className="flex items-center gap-1 sm:gap-1.5 justify-end">
            {/* Mobile search toggle */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Search"
              className={`lg:hidden ${iconBtn}`}
            >
              <Search className="w-5 h-5" />
            </button>

            {/* User Menu */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                aria-label="Account"
                className={iconBtn}
              >
                <User className="w-5 h-5" />
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl ring-1 ring-neutral-200 py-2 z-50 origin-top-right animate-in fade-in slide-in-from-top-1">
                  {isAuthenticated ? (
                    <>
                      <div className="px-4 py-3 border-b border-neutral-100">
                        <p className="text-sm font-semibold text-neutral-900 truncate">
                          {user?.name}
                        </p>
                        <p className="text-xs text-neutral-500 truncate">
                          {user?.email}
                        </p>
                      </div>
                      <div className="py-1">
                        <Link
                          to="/account"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                        >
                          <User className="w-4 h-4 text-neutral-500" />{" "}
                          Dashboard
                        </Link>
                        <Link
                          to="/account/orders"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                        >
                          <ShoppingBag className="w-4 h-4 text-neutral-500" />{" "}
                          Orders
                        </Link>
                        <Link
                          to="/account/wishlist"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                        >
                          <Heart className="w-4 h-4 text-neutral-500" />
                          <span className="flex-1">Wishlist</span>
                          {wishlistCount > 0 && (
                            <span className="bg-primary-500 text-white text-[10px] min-w-5 h-5 px-1 rounded-full flex items-center justify-center font-medium">
                              {wishlistCount > 9 ? "9+" : wishlistCount}
                            </span>
                          )}
                        </Link>
                        <Link
                          to="/account/reviews"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                        >
                          <Star className="w-4 h-4 text-neutral-500" /> My
                          Reviews
                        </Link>
                        <Link
                          to="/account/custom-orders"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                        >
                          <MessageSquare className="w-4 h-4 text-neutral-500" />{" "}
                          Custom Orders
                        </Link>
                        {user?.role === "admin" && (
                          <Link
                            to="/admin"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-sm font-medium text-primary-600 hover:bg-primary-50"
                          >
                            Admin Panel
                          </Link>
                        )}
                      </div>
                      <div className="border-t border-neutral-100 pt-1">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-2.5 w-full px-4 py-2 text-sm text-danger hover:bg-red-50"
                        >
                          <LogOut className="w-4 h-4" /> Logout
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="py-1">
                      <Link
                        to="/login"
                        onClick={() => setUserMenuOpen(false)}
                        className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                      >
                        Login
                      </Link>
                      <Link
                        to="/register"
                        onClick={() => setUserMenuOpen(false)}
                        className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                      >
                        Register
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Wishlist */}
            {isAuthenticated && (
              <Link
                to="/account/wishlist"
                aria-label="Wishlist"
                className={`hidden sm:inline-flex ${iconBtn}`}
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className={badge}>
                    {wishlistCount > 9 ? "9+" : wishlistCount}
                  </span>
                )}
              </Link>
            )}

            {/* Cart */}
            <Link to="/cart" aria-label="Cart" className={iconBtn}>
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className={badge}>
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile Search Overlay */}
        {searchOpen && (
          <div className="lg:hidden border-t border-neutral-200 py-3 animate-slide-down">
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-neutral-100 border border-transparent rounded-full focus:bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none"
                  autoFocus
                />
              </div>
              <button
                type="submit"
                className="btn-primary text-sm px-4 rounded-full"
              >
                Go
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Mobile Nav Sheet */}
      {isOpen && (
        <>
          {/* <div
            className="lg:hidden fixed inset-0 top-16 bg-black/40 z-40 animate-in fade-in"
            onClick={() => setIsOpen(false)}
          /> */}
          <div className="lg:hidden fixed inset-x-0 mt-8 top-16 bg-white border-t border-neutral-200 z-50 max-h-[calc(100vh-4rem)] overflow-y-auto animate-slide-down">
            <nav className="flex flex-col py-3 px-4">
              {menuItems.flatMap((item) =>
                item.type === "dropdown" && item.children?.length > 0
                  ? [
                      <span
                        key={`${item.label}-heading`}
                        className="text-neutral-900 font-semibold px-2 pt-3 pb-1 text-sm uppercase tracking-wide"
                      >
                        {item.label}
                      </span>,
                      ...item.children.map((child) => (
                        <Link
                          key={`${item.label}-${child.label}`}
                          to={child.url || "/"}
                          onClick={() => setIsOpen(false)}
                          className="text-neutral-700 hover:text-primary-500 hover:bg-neutral-50 rounded-lg px-4 py-2.5 text-[15px]"
                        >
                          {child.label}
                        </Link>
                      )),
                    ]
                  : renderNavItem(
                      item,
                      "text-neutral-800 hover:text-primary-500 hover:bg-neutral-50 rounded-lg font-medium px-3 py-2.5 text-[15px]",
                      () => setIsOpen(false)
                    )
              )}
            </nav>
          </div>
        </>
      )}
    </header>
  );
};

export default Header;
