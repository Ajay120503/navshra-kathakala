import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../../api/axios";
import { formatCurrency } from "../../utils/formatCurrency";
import { SORT_OPTIONS } from "../../utils/constants";
const CategoryPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [categories, setCategories] = useState([]);
  const [occasions, setOccasions] = useState([]);
  const limit = 12;
  const sort = searchParams.get("sort") || "-createdAt";
  const category = searchParams.get("category") || "";
  const occasion = searchParams.get("occasion") || "";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const personalizable = searchParams.get("personalizable") || "";

  useEffect(() => {
    Promise.all([
      api
        .get("/categories?type=category")
        .catch(() => ({ data: { data: { categories: [] } } })),
      api
        .get("/categories?type=occasion")
        .catch(() => ({ data: { data: { categories: [] } } })),
    ]).then(([catRes, occRes]) => {
      setCategories(
        (catRes.data.data?.categories || []).filter((c) => c.isActive)
      );
      setOccasions(
        (occRes.data.data?.categories || []).filter((c) => c.isActive)
      );
    });
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.set("page", page);
        params.set("limit", limit);
        if (sort) params.set("sort", sort);
        if (category) params.set("category", category);
        if (occasion) params.set("occasion", occasion);
        if (minPrice) params.set("minPrice", minPrice);
        if (maxPrice) params.set("maxPrice", maxPrice);
        if (personalizable) params.set("personalizable", personalizable);
        const { data } = await api.get(`/products?${params}`);
        setProducts(data.data?.products || []);
        setTotal(data.pagination?.total || 0);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [page, sort, category, occasion, minPrice, maxPrice, personalizable]);
  const updateFilter = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    params.set("page", "1");
    setPage(1);
    setSearchParams(params);
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {" "}
      <div className="flex flex-col md:flex-row gap-8">
        {" "}
        {/* Filters */}{" "}
        <div className="w-full md:w-64 shrink-0 space-y-6">
          {" "}
          <div>
            {" "}
            <h3 className="font-semibold text-neutral-900 mb-3">
              Sort By
            </h3>{" "}
            <select
              value={sort}
              onChange={(e) => updateFilter("sort", e.target.value)}
              className="input-field"
            >
              {" "}
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}{" "}
            </select>{" "}
          </div>{" "}
          <div>
            {" "}
            <h3 className="font-semibold text-neutral-900 mb-3">
              Price Range
            </h3>{" "}
            <div className="flex gap-2">
              {" "}
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => updateFilter("minPrice", e.target.value)}
                className="input-field w-1/2"
              />{" "}
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => updateFilter("maxPrice", e.target.value)}
                className="input-field w-1/2"
              />{" "}
            </div>{" "}
          </div>{" "}
          <label className="flex items-center gap-2 cursor-pointer">
            {" "}
            <input
              type="checkbox"
              checked={personalizable === "true"}
              onChange={(e) =>
                updateFilter("personalizable", e.target.checked ? "true" : "")
              }
              className="w-4 h-4 rounded border-neutral-300 text-primary-500"
            />{" "}
            <span className="text-sm text-neutral-700">
              Personalizable Only
            </span>{" "}
          </label>{" "}
          {categories.length > 0 && (
            <div>
              <h3 className="font-semibold text-neutral-900 mb-3">
                Categories
              </h3>
              <div className="space-y-1">
                {categories.map((cat) => (
                  <button
                    key={cat._id}
                    onClick={() =>
                      updateFilter(
                        "category",
                        category === cat._id ? "" : cat._id
                      )
                    }
                    className={`block w-full text-left text-sm px-3 py-1.5 rounded-lg transition-colors ${
                      category === cat._id
                        ? "bg-primary-50 text-primary-600 font-medium"
                        : "text-neutral-600 hover:bg-neutral-50"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          )}
          {occasions.length > 0 && (
            <div>
              <h3 className="font-semibold text-neutral-900 mb-3">Occasions</h3>
              <div className="space-y-1">
                {occasions.map((occ) => (
                  <button
                    key={occ._id}
                    onClick={() =>
                      updateFilter(
                        "occasion",
                        occasion === occ._id ? "" : occ._id
                      )
                    }
                    className={`block w-full text-left text-sm px-3 py-1.5 rounded-lg transition-colors ${
                      occasion === occ._id
                        ? "bg-primary-50 text-primary-600 font-medium"
                        : "text-neutral-600 hover:bg-neutral-50"
                    }`}
                  >
                    {occ.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>{" "}
        {/* Products Grid */}{" "}
        <div className="flex-1">
          {" "}
          <div className="flex items-center justify-between mb-6">
            {" "}
            <h1 className="text-2xl font-display font-bold text-neutral-900">
              All Products
            </h1>{" "}
            <p className="text-sm text-neutral-500">{total} products</p>{" "}
          </div>{" "}
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {" "}
              {[...Array(6)].map((_, i) => (
                <div key={i} className="card overflow-hidden">
                  {" "}
                  <div className="aspect-square skeleton" />{" "}
                  <div className="p-4 space-y-2">
                    {" "}
                    <div className="h-4 skeleton w-3/4" />{" "}
                    <div className="h-4 skeleton w-1/2" />{" "}
                  </div>{" "}
                </div>
              ))}{" "}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16">
              {" "}
              <p className="text-neutral-500 text-lg">
                No products found.
              </p>{" "}
              <Link
                to="/shop"
                className="text-primary-500 hover:underline mt-2 inline-block"
              >
                Clear filters
              </Link>{" "}
            </div>
          ) : (
            <>
              {" "}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {" "}
                {products.map((product) => (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -4 }}
                  >
                    {" "}
                    <Link
                      to={`/shop/${product.slug}`}
                      className="card block overflow-hidden group"
                    >
                      {" "}
                      <div className="aspect-square bg-neutral-100 relative overflow-hidden">
                        {" "}
                        <img
                          src={product.images?.[0]?.url || "/placeholder.svg"}
                          alt={product.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />{" "}
                        {product.discountPercent > 0 && (
                          <span className="absolute top-2 left-2 badge-primary">
                            -{product.discountPercent}%
                          </span>
                        )}{" "}
                        {product.isNewArrival && (
                          <span className="absolute top-2 right-2 badge-secondary">
                            New
                          </span>
                        )}{" "}
                      </div>{" "}
                      <div className="p-3">
                        {" "}
                        <h3 className="font-medium text-sm text-neutral-900 truncate">
                          {product.title}
                        </h3>{" "}
                        <div className="flex items-center gap-2 mt-1">
                          {" "}
                          <span className="font-bold text-primary-500">
                            {formatCurrency(
                              product.discountPrice || product.price
                            )}
                          </span>{" "}
                          {product.discountPrice && (
                            <span className="text-xs text-neutral-400 line-through">
                              {formatCurrency(product.price)}
                            </span>
                          )}{" "}
                        </div>{" "}
                      </div>{" "}
                    </Link>{" "}
                  </motion.div>
                ))}{" "}
              </div>{" "}
              {/* Pagination */}{" "}
              {total > limit && (
                <div className="flex justify-center gap-2 mt-8">
                  {" "}
                  {Array.from({ length: Math.ceil(total / limit) }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i + 1)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                        page === i + 1
                          ? "bg-primary-500 text-white"
                          : "bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50"
                      }`}
                    >
                      {" "}
                      {i + 1}{" "}
                    </button>
                  ))}{" "}
                </div>
              )}{" "}
            </>
          )}{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
};
export default CategoryPage;
