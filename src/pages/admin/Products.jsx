import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../api/axios";
import { formatCurrency } from "../../utils/formatCurrency";
const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get("/products?limit=50");
        setProducts(data.data?.products || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);
  const filtered = products.filter(
    (p) =>
      !search ||
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.sku?.toLowerCase().includes(search.toLowerCase())
  );
  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;
    try {
      await api.delete(`/products/${id}`);
      setProducts(products.filter((p) => p._id !== id));
      toast.success("Product deleted");
    } catch (err) {
      toast.error("Failed to delete");
    }
  };
  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-t-transparent" />
      </div>
    );
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">Products</h1>
        <Link to="/admin/products/new" className="btn-primary text-sm">
          <Plus className="w-4 h-4" /> Add Product
        </Link>
      </div>
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="input-field pl-9 text-sm"
        />
      </div>
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-neutral-50">
              <th className="text-left p-3 font-medium text-neutral-600">
                Product
              </th>
              <th className="text-left p-3 font-medium text-neutral-600">
                SKU
              </th>
              <th className="text-left p-3 font-medium text-neutral-600">
                Price
              </th>
              <th className="text-left p-3 font-medium text-neutral-600">
                Stock
              </th>
              <th className="text-left p-3 font-medium text-neutral-600">
                Status
              </th>
              <th className="text-right p-3 font-medium text-neutral-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr
                key={p._id}
                className="border-t border-neutral-100 hover:bg-neutral-50"
              >
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={p.images?.[0]?.url || "/placeholder.svg"}
                      alt=""
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                    <div>
                      <p className="font-medium">{p.title}</p>
                      <p className="text-xs text-neutral-500">
                        {p.category?.name || "Uncategorized"}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="p-3 text-neutral-500">{p.sku || "—"}</td>
                <td className="p-3 font-medium">
                  {formatCurrency(p.discountPrice || p.price)}
                </td>
                <td className="p-3">
                  <span
                    className={`${
                      p.stock <= (p.lowStockThreshold || 5)
                        ? "text-danger font-medium"
                        : "text-neutral-600"
                    }`}
                  >
                    {p.stock}
                  </span>
                </td>
                <td className="p-3">
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      p.status === "active"
                        ? "bg-green-100 text-green-700"
                        : p.status === "inactive"
                        ? "bg-red-100 text-red-700"
                        : "bg-neutral-100 text-neutral-600"
                    }`}
                  >
                    {p.status}
                  </span>
                </td>
                <td className="p-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      to={`/admin/products/${p._id}/edit`}
                      className="p-1.5 hover:bg-neutral-100 rounded-lg"
                    >
                      <Edit className="w-4 h-4 text-neutral-500" />
                    </Link>
                    <button
                      onClick={() => handleDelete(p._id)}
                      className="p-1.5 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4 text-danger" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default AdminProducts;
