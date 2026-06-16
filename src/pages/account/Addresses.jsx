import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { MapPin, Plus, Trash2, Star } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../api/axios";
import { setUser } from "../../redux/authSlice";

const Addresses = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [addresses, setAddresses] = useState(user?.addresses || []);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    label: "Home",
    fullName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    isDefault: false,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setAddresses(user?.addresses || []);
  }, [user]);

  const resetForm = () => {
    setForm({
      label: "Home",
      fullName: "",
      phone: "",
      street: "",
      city: "",
      state: "",
      pincode: "",
      isDefault: false,
    });
    setEditing(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !form.fullName ||
      !form.phone ||
      !form.street ||
      !form.city ||
      !form.state ||
      !form.pincode
    ) {
      toast.error("Please fill in all required fields");
      return;
    }
    setSaving(true);
    try {
      let updated = [...addresses];
      if (editing !== null) {
        updated[editing] = form;
      } else {
        updated.push(form);
      }
      const { data } = await api.put("/auth/addresses", { addresses: updated });
      dispatch(setUser({ ...user, addresses: data.data.addresses }));
      setAddresses(data.data.addresses);
      toast.success(editing !== null ? "Address updated!" : "Address added!");
      resetForm();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (index) => {
    const updated = addresses.filter((_, i) => i !== index);
    try {
      const { data } = await api.put("/auth/addresses", { addresses: updated });
      dispatch(setUser({ ...user, addresses: data.data.addresses }));
      setAddresses(data.data.addresses);
      toast.success("Address removed");
    } catch (err) {
      toast.error("Failed to remove address");
    }
  };

  const handleEdit = (index) => {
    setForm(addresses[index]);
    setEditing(index);
    setShowForm(true);
  };

  const setDefault = async (index) => {
    const updated = addresses.map((a, i) => ({ ...a, isDefault: i === index }));
    try {
      const { data } = await api.put("/auth/addresses", { addresses: updated });
      dispatch(setUser({ ...user, addresses: data.data.addresses }));
      setAddresses(data.data.addresses);
      toast.success("Default address updated");
    } catch (err) {
      toast.error("Failed to update");
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display font-bold text-neutral-900">
          My Addresses
        </h1>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="btn-primary text-sm"
        >
          <Plus className="w-4 h-4" /> Add Address
        </button>
      </div>

      {showForm && (
        <div className="card p-6 mb-6">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">
            {editing !== null ? "Edit Address" : "Add New Address"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-3 gap-3">
              {["Home", "Work", "Other"].map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setForm({ ...form, label: l })}
                  className={`py-2 rounded-xl border text-sm font-medium transition-colors ${
                    form.label === l
                      ? "bg-primary-500 text-white border-primary-500"
                      : "border-neutral-300 text-neutral-600 hover:border-primary-300"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={form.fullName}
                  onChange={(e) =>
                    setForm({ ...form, fullName: e.target.value })
                  }
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Phone *
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Street Address *
              </label>
              <input
                type="text"
                value={form.street}
                onChange={(e) => setForm({ ...form, street: e.target.value })}
                className="input-field"
                required
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  City *
                </label>
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  State *
                </label>
                <input
                  type="text"
                  value={form.state}
                  onChange={(e) => setForm({ ...form, state: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Pincode *
                </label>
                <input
                  type="text"
                  value={form.pincode}
                  onChange={(e) =>
                    setForm({ ...form, pincode: e.target.value })
                  }
                  className="input-field"
                  required
                />
              </div>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isDefault}
                onChange={(e) =>
                  setForm({ ...form, isDefault: e.target.checked })
                }
                className="w-4 h-4 rounded border-neutral-300 text-primary-500"
              />
              <span className="text-sm text-neutral-700">
                Set as default address
              </span>
            </label>
            <div className="flex gap-3">
              <button type="submit" disabled={saving} className="btn-primary">
                {saving ? "Saving..." : "Save Address"}
              </button>
              <button type="button" onClick={resetForm} className="btn-outline">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {addresses.length === 0 && !showForm ? (
        <div className="text-center py-16 card">
          <MapPin className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
          <p className="text-neutral-500">No addresses saved yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {addresses.map((addr, index) => (
            <div key={index} className="card p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary-100 text-primary-700">
                      {addr.label}
                    </span>
                    {addr.isDefault && (
                      <Star className="w-3 h-3 text-warning fill-warning" />
                    )}
                  </div>
                  <p className="font-medium text-neutral-900">
                    {addr.fullName}
                  </p>
                  <p className="text-sm text-neutral-600">
                    {addr.street}, {addr.city}, {addr.state} - {addr.pincode}
                  </p>
                  <p className="text-sm text-neutral-500 mt-1">
                    📞 {addr.phone}
                  </p>
                </div>
              </div>
              <div className="flex gap-3 mt-3 pt-3 border-t border-neutral-100">
                <button
                  onClick={() => handleEdit(index)}
                  className="text-sm text-primary-500 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(index)}
                  className="text-sm text-danger hover:underline"
                >
                  Remove
                </button>
                {!addr.isDefault && (
                  <button
                    onClick={() => setDefault(index)}
                    className="text-sm text-neutral-500 hover:underline"
                  >
                    Set as Default
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default Addresses;
