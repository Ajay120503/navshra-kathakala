import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../api/axios";
import { setUser } from "../../redux/authSlice";
import { formatCurrency } from "../../utils/formatCurrency";

const Wishlist = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        if (user?.wishlist?.length > 0) {
          const promises = user.wishlist.map((id) =>
            api.get(`/products/id/${id}`).catch(() => null)
          );
          const results = await Promise.all(promises);
          setProducts(results.filter(Boolean).map((r) => r.data.data.product));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, [user]);

  const removeFromWishlist = async (productId) => {
    try {
      const updated = (user.wishlist || []).filter(
        (id) => id.toString() !== productId
      );
      const { data } = await api.put("/auth/me", { wishlist: updated });
      dispatch(setUser(data.data.user));
      setProducts(products.filter((p) => p._id !== productId));
      toast.success("Removed from wishlist");
    } catch (err) {
      toast.error("Failed to remove");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-display font-bold text-neutral-900 mb-6">
        My Wishlist
      </h1>
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card overflow-hidden">
              <div className="aspect-square skeleton" />
              <div className="p-3 space-y-2">
                <div className="h-4 skeleton w-3/4" />
                <div className="h-4 skeleton w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 card">
          <Heart className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
          <p className="text-lg text-neutral-500">Your wishlist is empty</p>
          <Link
            to="/shop"
            className="text-primary-500 hover:underline mt-2 inline-block"
          >
            Browse products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.map((product) => (
            <div key={product._id} className="card overflow-hidden group">
              <Link to={`/shop/${product.slug}`}>
                <div className="aspect-square bg-neutral-100">
                  <img
                    src={product.images?.[0]?.url || "/placeholder.svg"}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </Link>
              <div className="p-3">
                <Link to={`/shop/${product.slug}`}>
                  <h3 className="font-medium text-sm text-neutral-900 truncate">
                    {product.title}
                  </h3>
                </Link>
                <p className="text-primary-500 font-bold mt-1">
                  {formatCurrency(product.discountPrice || product.price)}
                </p>
                <button
                  onClick={() => removeFromWishlist(product._id)}
                  className="flex items-center gap-1 text-xs text-danger mt-2 hover:underline"
                >
                  <Trash2 className="w-3 h-3" /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default Wishlist;
