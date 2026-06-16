import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Star, Truck, Shield, Heart, Gift } from "lucide-react";
import api from "../../api/axios";
import { formatCurrency } from "../../utils/formatCurrency";

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [categories, setCategories] = useState([]);
  const [occasions, setOccasions] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featuredRes, newRes, catRes, occRes, settingsRes] =
          await Promise.all([
            api.get("/products?isFeatured=true&limit=8"),
            api.get("/products?isNewArrival=true&limit=8"),
            api.get("/categories?type=category"),
            api.get("/categories?type=occasion"),
            api.get("/settings/public"),
          ]);
        setFeaturedProducts(featuredRes.data.data?.products || []);
        setNewArrivals(newRes.data.data?.products || []);
        setCategories(catRes.data.data?.categories || []);
        setOccasions(occRes.data.data?.categories || []);
        setSettings(settingsRes.data.data?.settings || null);
      } catch (error) {
        console.error("Failed to fetch home data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.4 },
  };

  const heroTitle =
    settings?.banners
      ?.filter((banner) => banner.isActive !== false)
      .sort((a, b) => (a.order || 0) - (b.order || 0))?.[0]?.title ||
    "Unique Handmade Gifts for Every Occasion";
  const heroSubtitle =
    settings?.banners
      ?.filter((banner) => banner.isActive !== false)
      .sort((a, b) => (a.order || 0) - (b.order || 0))?.[0]?.subtitle ||
    "Discover thoughtfully crafted gifts made with love by talented artisans. Each piece tells a story.";
  const activeBanner = settings?.banners
    ?.filter((banner) => banner.isActive !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0))?.[0];
  const heroTag = settings?.tagline || "Handcrafted with Love";
  const heroCtaText = activeBanner?.ctaText || "Shop Now";
  const heroCtaLink = activeBanner?.ctaLink || "/shop";

  // Split the headline so the last word(s) can be highlighted in the
  // primary color while the rest stays black for stronger contrast.
  const heroTitleWords = heroTitle.trim().split(" ").filter(Boolean);
  const heroTitleAccent = heroTitleWords.slice(-1).join(" ");
  const heroTitleMain = heroTitleWords.slice(0, -1).join(" ");

  const getSection = (type) =>
    settings?.homepageSections?.find((section) => section.type === type);
  const isSectionEnabled = (type) => getSection(type)?.isEnabled !== false;
  const sectionTitle = (type, fallback) => getSection(type)?.title || fallback;
  const sectionSubtitle = (type, fallback) =>
    getSection(type)?.subtitle || fallback;

  // Pick up to 4 featured products for hero grid
  const heroProducts = featuredProducts.slice(0, 4);

  const trustBadges = [
    {
      icon: Truck,
      label: "Free Shipping",
      desc: `On orders above ${formatCurrency(
        settings?.shippingSettings?.freeShippingThreshold || 999
      )}`,
    },
    { icon: Shield, label: "Secure Payment", desc: "100% secure checkout" },
    { icon: Heart, label: "Handcrafted", desc: "Made with love & care" },
    { icon: Star, label: "Premium Quality", desc: "Satisfaction guaranteed" },
  ];

  return (
    <div>
      {/* Hero Section */}
      {isSectionEnabled("hero") && (
        <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-secondary-50">
          {/* Ambient background accents */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -top-24 -left-24 w-[28rem] h-[28rem] bg-primary-100 rounded-full blur-3xl opacity-40" />
            <div className="absolute -bottom-32 -right-20 w-[32rem] h-[32rem] bg-secondary-100 rounded-full blur-3xl opacity-40" />
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 1px 1px, rgb(0 0 0) 1px, transparent 0)",
                backgroundSize: "28px 28px",
              }}
            />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 md:py-28 lg:py-32">
            <div className="grid lg:grid-cols-12 gap-12 lg:gap-10 items-center">
              {/* Left: copy */}
              <motion.div
                {...fadeInUp}
                className="lg:col-span-6 text-center lg:text-left"
              >
                <span className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-white/70 backdrop-blur px-4 py-1.5 text-xs sm:text-sm font-medium text-primary-600 shadow-sm mb-6">
                  <Heart className="w-3.5 h-3.5 fill-primary-500 text-primary-500" />
                  {heroTag}
                </span>

                <h1
                  className="font-display font-bold tracking-tight text-neutral-900 mb-6
                         text-[2.5rem] leading-[1.05]
                         sm:text-5xl
                         md:text-6xl
                         lg:text-[4.25rem] lg:leading-[1.02]
                         xl:text-[4.75rem]"
                >
                  {heroTitleWords.length > 1 ? (
                    <>
                      <span className="block text-neutral-900">
                        {heroTitleMain}
                      </span>
                      <span className="relative inline-block mt-1">
                        <span className="relative z-10 bg-gradient-to-r from-primary-600 via-primary-500 to-primary-400 bg-clip-text text-transparent italic font-display">
                          {heroTitleAccent}
                        </span>
                        <span className="absolute left-0 right-0 bottom-1 h-3 sm:h-4 bg-primary-100/70 -z-0 rounded-sm" />
                      </span>
                    </>
                  ) : (
                    <span className="bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
                      {heroTitle}
                    </span>
                  )}
                </h1>

                <p className="text-base sm:text-lg lg:text-xl text-neutral-600 leading-relaxed mb-9 max-w-xl mx-auto lg:mx-0">
                  {heroSubtitle}
                </p>

                <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center lg:justify-start">
                  <Link
                    to={heroCtaLink}
                    className="btn-primary text-base sm:text-lg px-8 py-3.5 justify-center shadow-lg shadow-primary-500/20 hover:shadow-xl hover:shadow-primary-500/30 transition-shadow"
                  >
                    {heroCtaText} <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link
                    to="/custom-order"
                    className="btn-secondary text-base sm:text-lg px-8 py-3.5 justify-center"
                  >
                    Custom Order
                  </Link>
                </div>

                {/* Inline trust strip — uses only existing data */}
                <div className="mt-10 flex flex-wrap items-center justify-center lg:justify-start gap-x-8 gap-y-4 text-sm text-neutral-600">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-primary-500" />
                    <span>
                      Free shipping over{" "}
                      {formatCurrency(
                        settings?.shippingSettings?.freeShippingThreshold || 999
                      )}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-primary-500" />
                    <span>Secure checkout</span>
                  </div>
                  <div className="hidden sm:flex items-center gap-2">
                    <Star className="w-4 h-4 text-primary-500 fill-primary-500" />
                    <span>Loved by artisans & gifters</span>
                  </div>
                </div>
              </motion.div>

              {/* Right: product collage */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="lg:col-span-6"
              >
                <div className="relative max-w-md sm:max-w-lg lg:max-w-none mx-auto">
                  {heroProducts.length > 0 ? (
                    <div className="grid grid-cols-2 gap-5 sm:gap-5">
                      {heroProducts.map((p, i) => (
                        <Link
                          key={p._id}
                          to={`/shop/${p.slug}`}
                          className={`group relative block rounded-3xl overflow-hidden bg-white border border-neutral-200 shadow-sm hover:shadow-xl transition-all duration-300
                      ${i === 0 ? "lg:translate-y-2" : ""}
                      ${i === 1 ? "lg:-translate-y-4" : ""}
                      ${i === 2 ? "lg:-translate-y-2" : ""}
                      ${i === 3 ? "lg:translate-y-6" : ""}
                    `}
                        >
                          <div className="aspect-square overflow-hidden bg-neutral-50">
                            <img
                              src={p.images?.[0]?.url || "/placeholder.svg"}
                              alt={p.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          </div>
                          <div className="p-3 sm:p-4">
                            <p className="text-sm font-medium text-neutral-900 truncate">
                              {p.title}
                            </p>
                            <div className="flex items-center justify-between mt-1">
                              <span className="text-sm font-bold text-primary-500">
                                {formatCurrency(p.discountPrice || p.price)}
                              </span>
                              {p.discountPrice && (
                                <span className="text-xs text-neutral-400 line-through">
                                  {formatCurrency(p.price)}
                                </span>
                              )}
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4 sm:gap-5">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className="aspect-square bg-white/70 border border-neutral-200 rounded-3xl flex items-center justify-center text-neutral-300 shadow-sm"
                        >
                          <Gift className="w-10 h-10" />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Floating accent card — only renders if we have a real product */}
                  {heroProducts[0] && (
                    <div className="hidden lg:flex absolute -bottom-6 -left-6 items-center gap-3 bg-white rounded-2xl px-4 py-3 shadow-xl border border-neutral-200">
                      <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center">
                        <Star className="w-5 h-5 text-primary-500 fill-primary-500" />
                      </div>
                      <div className="text-left">
                        <p className="text-xs text-neutral-500">
                          Featured today
                        </p>
                        <p className="text-sm font-semibold text-neutral-900 truncate max-w-[10rem]">
                          {heroProducts[0].title}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* Trust Badges */}
      {isSectionEnabled("trustBadges") && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 md:-mt-10 relative z-10">
          <div className="bg-white rounded-3xl shadow-xl shadow-neutral-200/60 border border-neutral-200 p-4 sm:p-6 md:p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 divide-y md:divide-y-0 md:divide-x divide-neutral-100">
              {trustBadges.map((item, index) => (
                <motion.div
                  key={`badge-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  className="flex items-start gap-3 sm:gap-4 px-2 sm:px-4 py-3 md:py-1"
                >
                  <div className="shrink-0 w-11 h-11 rounded-2xl bg-primary-50 flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-primary-500" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-neutral-900 text-sm sm:text-base leading-tight">
                      {item.label}
                    </h3>
                    <p className="text-xs sm:text-sm text-neutral-500 mt-1 leading-snug">
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Shop by Occasion */}
      {isSectionEnabled("occasions") && occasions.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
          <motion.div
            className="max-w-2xl mx-auto text-center mb-12"
            {...fadeInUp}
          >
            <span className="inline-block text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-primary-500 mb-3">
              Occasions
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-neutral-900 tracking-tight leading-tight">
              {sectionTitle("occasions", "Shop by Occasion")}
            </h2>
            <p className="mt-4 text-base sm:text-lg text-neutral-600 leading-relaxed">
              {sectionSubtitle(
                "occasions",
                "Find the perfect gift for every moment"
              )}
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
            {occasions.map((occasion, index) => (
              <motion.div
                key={`occ-${occasion._id}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -6 }}
              >
                <Link
                  to={`/shop?occasion=${occasion._id}`}
                  className="relative block h-full overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm hover:shadow-xl transition-shadow duration-300 group"
                >
                  <div className="aspect-[4/5] bg-secondary-50 relative overflow-hidden">
                    {occasion.image?.url ? (
                      <img
                        src={occasion.image.url}
                        alt={occasion.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-secondary-300">
                        <Gift className="w-12 h-12" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/80 via-neutral-900/20 to-transparent" />

                    <div className="absolute inset-x-0 bottom-0 p-5">
                      <h3 className="font-display font-semibold text-lg sm:text-xl text-white leading-tight">
                        {occasion.name}
                      </h3>
                      {occasion.description && (
                        <p className="text-sm text-white/80 mt-1 line-clamp-2">
                          {occasion.description}
                        </p>
                      )}
                      <span className="inline-flex items-center gap-1.5 mt-3 text-sm font-medium text-white/90 group-hover:text-white">
                        Explore
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Featured Products */}
      {isSectionEnabled("featured") && featuredProducts.length > 0 && (
        <section className="relative bg-gradient-to-b from-neutral-50 via-neutral-100/40 to-white py-20 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12"
              {...fadeInUp}
            >
              <div className="max-w-2xl">
                <span className="inline-block text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-primary-500 mb-3">
                  Bestsellers
                </span>
                <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-neutral-900 tracking-tight leading-tight">
                  {sectionTitle("featured", "Featured Products")}
                </h2>
                <p className="mt-4 text-base sm:text-lg text-neutral-600 leading-relaxed">
                  {sectionSubtitle(
                    "featured",
                    "Our most loved handcrafted gifts"
                  )}
                </p>
              </div>

              <Link
                to="/shop"
                className="hidden md:inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-500 group"
              >
                View all products
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-7">
              {featuredProducts.map((product, index) => (
                <motion.div
                  key={`fp-${product._id}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -6 }}
                >
                  <Link
                    to={`/shop/${product.slug}`}
                    className="block overflow-hidden rounded-3xl bg-white border border-neutral-200 shadow-sm hover:shadow-xl transition-shadow duration-300 group"
                  >
                    <div className="aspect-square bg-neutral-100 relative overflow-hidden">
                      <img
                        src={product.images?.[0]?.url || "/placeholder.svg"}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      {product.discountPercent > 0 && (
                        <span className="absolute top-3 left-3 inline-flex items-center rounded-full bg-primary-500 text-white text-xs font-bold px-2.5 py-1 shadow-sm">
                          -{product.discountPercent}%
                        </span>
                      )}
                    </div>
                    <div className="p-4 md:p-5">
                      <h3 className="font-medium text-sm sm:text-base text-neutral-900 truncate leading-snug">
                        {product.title}
                      </h3>
                      <div className="flex items-baseline gap-2 mt-2">
                        <span className="font-bold text-base sm:text-lg text-primary-500">
                          {formatCurrency(
                            product.discountPrice || product.price
                          )}
                        </span>
                        {product.discountPrice && (
                          <span className="text-xs sm:text-sm text-neutral-400 line-through">
                            {formatCurrency(product.price)}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-12 md:hidden">
              <Link to="/shop" className="btn-primary px-8 py-3">
                View All Products <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* New Arrivals */}
      {isSectionEnabled("newArrivals") && newArrivals.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
          <motion.div
            className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12"
            {...fadeInUp}
          >
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-secondary-600 mb-3">
                <span className="w-2 h-2 rounded-full bg-secondary-500 animate-pulse" />
                Just In
              </span>
              <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-neutral-900 tracking-tight leading-tight">
                {sectionTitle("newArrivals", "New Arrivals")}
              </h2>
              <p className="mt-4 text-base sm:text-lg text-neutral-600 leading-relaxed">
                {sectionSubtitle(
                  "newArrivals",
                  "Fresh from our artisans' workshops"
                )}
              </p>
            </div>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-7">
            {newArrivals.map((product, index) => (
              <motion.div
                key={`na-${product._id}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -6 }}
              >
                <Link
                  to={`/shop/${product.slug}`}
                  className="block overflow-hidden rounded-3xl bg-white border border-neutral-200 shadow-sm hover:shadow-xl transition-shadow duration-300 group"
                >
                  <div className="aspect-square bg-neutral-100 relative overflow-hidden">
                    <img
                      src={product.images?.[0]?.url || "/placeholder.svg"}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    {product.isNewArrival && (
                      <span className="absolute top-3 left-3 inline-flex items-center rounded-full bg-secondary-500 text-white text-xs font-bold px-2.5 py-1 shadow-sm">
                        New
                      </span>
                    )}
                  </div>
                  <div className="p-4 md:p-5">
                    <h3 className="font-medium text-sm sm:text-base text-neutral-900 truncate leading-snug">
                      {product.title}
                    </h3>
                    <div className="flex items-baseline gap-2 mt-2">
                      <span className="font-bold text-base sm:text-lg text-primary-500">
                        {formatCurrency(product.discountPrice || product.price)}
                      </span>
                      {product.discountPrice && (
                        <span className="text-xs sm:text-sm text-neutral-400 line-through">
                          {formatCurrency(product.price)}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Categories */}
      {isSectionEnabled("categories") && categories.length > 0 && (
        <section className="bg-neutral-50/60 py-20 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="max-w-2xl mx-auto text-center mb-12"
              {...fadeInUp}
            >
              <span className="inline-block text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-primary-500 mb-3">
                Collections
              </span>
              <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-neutral-900 tracking-tight leading-tight">
                {sectionTitle("categories", "Explore Categories")}
              </h2>
              <p className="mt-4 text-base sm:text-lg text-neutral-600 leading-relaxed">
                {sectionSubtitle(
                  "categories",
                  "Browse our handcrafted collections"
                )}
              </p>
            </motion.div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
              {categories.slice(0, 8).map((cat, index) => (
                <motion.div
                  key={`cat-${cat._id}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.04 }}
                  whileHover={{ y: -4 }}
                >
                  <Link
                    to={`/shop?category=${cat._id}`}
                    className="relative block overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm hover:shadow-lg transition-shadow duration-300 group"
                  >
                    <div className="aspect-square bg-neutral-100 overflow-hidden">
                      {cat.image?.url ? (
                        <img
                          src={cat.image.url}
                          alt={cat.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-neutral-300">
                          <Gift className="w-10 h-10" />
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between p-4">
                      <h3 className="font-semibold text-sm sm:text-base text-neutral-900 truncate">
                        {cat.name}
                      </h3>
                      <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-primary-500 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter */}
      {isSectionEnabled("newsletter") && (
        <section className="relative overflow-hidden bg-primary-500 py-20 sm:py-24">
          {/* Decorative accents */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary-400 rounded-full blur-3xl opacity-40" />
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-primary-600 rounded-full blur-3xl opacity-40" />
            <div
              className="absolute inset-0 opacity-[0.06]"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
                backgroundSize: "24px 24px",
              }}
            />
          </div>

          <motion.div
            className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center"
            {...fadeInUp}
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur px-4 py-1.5 text-xs sm:text-sm font-medium text-white mb-6">
              <Heart className="w-3.5 h-3.5 fill-white" />
              Join our community
            </span>

            <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-white tracking-tight leading-tight mb-4">
              {sectionTitle("newsletter", "Stay Inspired")}
            </h2>
            <p className="text-base sm:text-lg text-primary-50/90 max-w-xl mx-auto leading-relaxed mb-10">
              {sectionSubtitle(
                "newsletter",
                "Get exclusive offers, new arrival alerts, and handmade tips delivered to your inbox."
              )}
            </p>

            <form
              className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto p-2 sm:p-1.5 sm:bg-white/15 sm:backdrop-blur sm:rounded-full sm:border sm:border-white/20"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-white sm:bg-transparent rounded-full sm:rounded-full px-5 py-3 text-sm sm:text-base text-neutral-900 sm:text-white placeholder:text-neutral-400 sm:placeholder:text-white/70 outline-none focus:ring-2 focus:ring-white/40 sm:focus:ring-0"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white text-primary-600 hover:bg-primary-50 font-semibold px-6 py-3 text-sm sm:text-base shadow-sm whitespace-nowrap transition-colors"
              >
                Subscribe
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <p className="text-xs text-primary-50/70 mt-5">
              No spam. Unsubscribe anytime.
            </p>
          </motion.div>
        </section>
      )}
    </div>
  );
};

export default Home;
