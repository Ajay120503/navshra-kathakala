import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Save } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../api/axios";
import { formatCurrency, formatDate } from "../../utils/formatCurrency";

const AdminCoupons = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    code: "",
    description: "",
    type: "flat",
    value: "",
    minOrderValue: "",
    usageLimit: "",
    expiryDate: "",
    isActive: true,
    applicableTo: "all",
  });
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [couponsRes, prodRes] = await Promise.all([
        api.get("/coupons"),
        api.get("/products?limit=50"),
      ]);
      setItems(couponsRes.data.data?.coupons || []);
      setProducts(prodRes.data.data?.products || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setForm({
      code: "",
      description: "",
      type: "flat",
      value: "",
      minOrderValue: "",
      usageLimit: "",
      expiryDate: "",
      isActive: true,
      applicableTo: "all",
    });
    setEditing(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.code || !form.value) {
      toast.error("Code and value required");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        code: form.code.toUpperCase(),
        value: parseFloat(form.value),
        minOrderValue: form.minOrderValue ? parseFloat(form.minOrderValue) : 0,
        usageLimit: form.usageLimit ? parseInt(form.usageLimit) : undefined,
        expiryDate: form.expiryDate || undefined,
      };
      if (editing) {
        const { data } = await api.put(`/coupons/${editing._id}`, payload);
        setItems(
          items.map((c) => (c._id === editing._id ? data.data.coupon : c))
        );
        toast.success("Coupon updated");
      } else {
        const { data } = await api.post("/coupons", payload);
        setItems([...items, data.data.coupon]);
        toast.success("Coupon created");
      }
      reset();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete coupon?")) return;
    try {
      await api.delete(`/coupons/${id}`);
      setItems(items.filter((c) => c._id !== id));
      toast.success("Deleted");
    } catch (err) {
      toast.error("Failed");
    }
  };

  const handleEdit = (c) => {
    setForm({
      code: c.code,
      description: c.description || "",
      type: c.type,
      value: c.value.toString(),
      minOrderValue: c.minOrderValue ? c.minOrderValue.toString() : "",
      usageLimit: c.usageLimit ? c.usageLimit.toString() : "",
      expiryDate: c.expiryDate
        ? new Date(c.expiryDate).toISOString().split("T")[0]
        : "",
      isActive: c.isActive,
      applicableTo: c.applicableTo || "all",
    });
    setEditing(c);
    setShowForm(true);
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
        <h1 className="text-2xl font-bold text-neutral-900">Coupons</h1>
        <button
          onClick={() => {
            reset();
            setShowForm(true);
          }}
          className="btn-primary text-sm"
        >
          <Plus className="w-4 h-4" /> Add Coupon
        </button>
      </div>
      {showForm && (
        <div className="bg-white rounded-xl border border-neutral-200 p-6 mb-6">
          <h2 className="font-semibold text-neutral-900 mb-4">
            {editing ? "Edit" : "New"} Coupon
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Code *</label>
                <input
                  type="text"
                  value={form.code}
                  onChange={(e) =>
                    setForm({ ...form, code: e.target.value.toUpperCase() })
                  }
                  className="input-field font-mono"
                  placeholder="SAVE10"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="input-field"
                >
                  <option value="flat">Flat (₹)</option>
                  <option value="percentage">Percentage (%)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Value *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={form.value}
                  onChange={(e) => setForm({ ...form, value: e.target.value })}
                  className="input-field"
                  placeholder={
                    form.type === "percentage" ? "e.g. 10" : "e.g. 100"
                  }
                  required
                />
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Min Order (₹)
                </label>
                <input
                  type="number"
                  value={form.minOrderValue}
                  onChange={(e) =>
                    setForm({ ...form, minOrderValue: e.target.value })
                  }
                  className="input-field"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Usage Limit
                </label>
                <input
                  type="number"
                  value={form.usageLimit}
                  onChange={(e) =>
                    setForm({ ...form, usageLimit: e.target.value })
                  }
                  className="input-field"
                  placeholder="Unlimited"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Expiry Date
                </label>
                <input
                  type="date"
                  value={form.expiryDate}
                  onChange={(e) =>
                    setForm({ ...form, expiryDate: e.target.value })
                  }
                  className="input-field"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Description
              </label>
              <input
                type="text"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className="input-field"
                placeholder="Optional description"
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) =>
                    setForm({ ...form, isActive: e.target.checked })
                  }
                  className="w-4 h-4 rounded text-primary-500"
                />{" "}
                Active
              </label>
              <button
                type="button"
                onClick={reset}
                className="btn-outline text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="btn-primary text-sm"
              >
                <Save className="w-4 h-4" />{" "}
                {saving ? "..." : editing ? "Update" : "Create"}
              </button>
            </div>
          </form>
        </div>
      )}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-neutral-50">
              <th className="text-left p-3 font-medium">Code</th>
              <th className="text-left p-3 font-medium">Type</th>
              <th className="text-left p-3 font-medium">Value</th>
              <th className="text-left p-3 font-medium">Min Order</th>
              <th className="text-left p-3 font-medium">Expiry</th>
              <th className="text-left p-3 font-medium">Used</th>
              <th className="text-left p-3 font-medium">Status</th>
              <th className="text-right p-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((c) => (
              <tr key={c._id} className="border-t border-neutral-100">
                <td className="p-3 font-mono font-bold text-primary-500">
                  {c.code}
                </td>
                <td className="p-3">
                  <span className="text-xs px-2 py-1 rounded-full bg-secondary-50 text-secondary-600">
                    {c.type}
                  </span>
                </td>
                <td className="p-3 font-medium">
                  {c.type === "percentage"
                    ? `${c.value}%`
                    : formatCurrency(c.value)}
                </td>
                <td className="p-3">{formatCurrency(c.minOrderValue)}</td>
                <td className="p-3 text-neutral-500">
                  {c.expiryDate ? formatDate(c.expiryDate) : "—"}
                </td>
                <td className="p-3">
                  {c.usedCount}/{c.usageLimit || "∞"}
                </td>
                <td className="p-3">
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      c.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {c.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="p-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleEdit(c)}
                      className="p-1.5 hover:bg-neutral-100 rounded-lg"
                    >
                      <Edit className="w-4 h-4 text-neutral-500" />
                    </button>
                    <button
                      onClick={() => handleDelete(c._id)}
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
export default AdminCoupons;
