import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Search as SearchIcon } from "lucide-react";
import api from "../../api/axios";
import { formatCurrency } from "../../utils/formatCurrency";

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const query = searchParams.get("q") || "";

  useEffect(() => {
    if (query) {
      setLoading(true);
      api
        .get(`/products?search=${encodeURIComponent(query)}&limit=20`)
        .then((res) => setProducts(res.data.data?.products || []))
        .catch(() => setProducts([]))
        .finally(() => setLoading(false));
    }
  }, [query]);

  const handleSearch = (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const q = form.get("q");
    if (q) setSearchParams({ q });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <form onSubmit={handleSearch} className="relative mb-8 max-w-2xl mx-auto">
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
        <input
          type="text"
          name="q"
          defaultValue={query}
          placeholder="Search products..."
          className="input-field pl-12 py-3 text-lg"
          autoFocus
        />
      </form>

      {query && (
        <p className="text-neutral-500 mb-6">
          {loading
            ? "Searching..."
            : `${products.length} results for "${query}"`}
        </p>
      )}

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="card overflow-hidden">
              <div className="aspect-square skeleton" />
              <div className="p-3 space-y-2">
                <div className="h-4 skeleton w-3/4" />
                <div className="h-4 skeleton w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 && query ? (
        <div className="text-center py-16">
          <SearchIcon className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
          <p className="text-lg text-neutral-500">No products found</p>
          <Link
            to="/shop"
            className="text-primary-500 hover:underline mt-2 inline-block"
          >
            Browse all products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.map((product) => (
            <Link
              key={product._id}
              to={`/shop/${product.slug}`}
              className="card overflow-hidden group"
            >
              <div className="aspect-square bg-neutral-100">
                <img
                  src={product.images?.[0]?.url || "/placeholder.svg"}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {product.discountPercent > 0 && (
                  <span className="absolute top-2 left-2 badge-primary">
                    -{product.discountPercent}%
                  </span>
                )}
              </div>
              <div className="p-3">
                <h3 className="font-medium text-sm text-neutral-900 truncate">
                  {product.title}
                </h3>
                <p className="text-primary-500 font-bold mt-1">
                  {formatCurrency(product.discountPrice || product.price)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
export default Search;
