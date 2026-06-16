import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Save } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../api/axios";

const AdminCategories = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    type: "category",
    order: 0,
    isActive: true,
  });
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data } = await api.get("/categories");
      setItems(data.data?.categories || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setForm({
      name: "",
      slug: "",
      description: "",
      type: "category",
      order: 0,
      isActive: true,
    });
    setImage(null);
    setEditing(null);
    setShowForm(false);
  };

  const uploadImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const { data } = await api.post("/upload/category-image", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setImage({ url: data.data.url, publicId: data.data.publicId });
      toast.success("Image uploaded");
    } catch (err) {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name) {
      toast.error("Name required");
      return;
    }
    setSaving(true);
    try {
      const slug =
        form.slug ||
        form.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "");
      const payload = {
        ...form,
        slug,
        image: image || undefined,
        order: parseInt(form.order) || 0,
      };
      if (editing) {
        const { data } = await api.put(`/categories/${editing._id}`, payload);
        setItems(
          items.map((c) => (c._id === editing._id ? data.data.category : c))
        );
        toast.success("Updated");
      } else {
        const { data } = await api.post("/categories", payload);
        setItems([...items, data.data.category]);
        toast.success("Created");
      }
      reset();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete?")) return;
    try {
      await api.delete(`/categories/${id}`);
      setItems(items.filter((c) => c._id !== id));
      toast.success("Deleted");
    } catch (err) {
      toast.error("Failed");
    }
  };

  const handleEdit = (c) => {
    setForm({
      name: c.name,
      slug: c.slug,
      description: c.description || "",
      type: c.type,
      order: c.order || 0,
      isActive: c.isActive,
    });
    setImage(c.image || null);
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
        <h1 className="text-2xl font-bold text-neutral-900">
          Categories & Occasions
        </h1>
        <button
          onClick={() => {
            reset();
            setShowForm(true);
          }}
          className="btn-primary text-sm"
        >
          <Plus className="w-4 h-4" /> Add
        </button>
      </div>
      {showForm && (
        <div className="bg-white rounded-xl border border-neutral-200 p-6 mb-6">
          <h2 className="font-semibold text-neutral-900 mb-4">
            {editing ? "Edit" : "New"} Category
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value,
                      slug: editing
                        ? form.slug
                        : e.target.value
                            .toLowerCase()
                            .replace(/[^a-z0-9]+/g, "-")
                            .replace(/^-|-$/g, ""),
                    })
                  }
                  className="input-field"
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
                  <option value="category">Category</option>
                  <option value="occasion">Occasion</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Slug</label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  className="input-field"
                  placeholder="Auto"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Order</label>
                <input
                  type="number"
                  value={form.order}
                  onChange={(e) => setForm({ ...form, order: e.target.value })}
                  className="input-field"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Description
              </label>
              <textarea
                rows={2}
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Image</label>
              <div className="flex items-center gap-4">
                {image?.url ? (
                  <img
                    src={image.url}
                    alt=""
                    className="w-20 h-20 object-cover rounded-lg border"
                  />
                ) : (
                  <div className="w-20 h-20 bg-neutral-100 rounded-lg flex items-center justify-center text-neutral-400 text-xs">
                    No img
                  </div>
                )}
                <div>
                  <label
                    htmlFor="cat-image-upload"
                    className="btn-primary text-xs cursor-pointer inline-block"
                  >
                    {uploading ? "..." : "Upload"}
                  </label>
                  <input
                    id="cat-image-upload"
                    type="file"
                    accept="image/*"
                    onChange={uploadImage}
                    className="hidden"
                  />
                  {image && (
                    <button
                      type="button"
                      onClick={() => setImage(null)}
                      className="btn-outline text-xs ml-2"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
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
              <th className="text-left p-3 font-medium">Image</th>
              <th className="text-left p-3 font-medium">Name</th>
              <th className="text-left p-3 font-medium">Type</th>
              <th className="text-left p-3 font-medium">Slug</th>
              <th className="text-left p-3 font-medium">Order</th>
              <th className="text-left p-3 font-medium">Status</th>
              <th className="text-right p-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((c) => (
              <tr key={c._id} className="border-t border-neutral-100">
                <td className="p-3">
                  {c.image?.url ? (
                    <img
                      src={c.image.url}
                      alt=""
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-neutral-100 rounded-lg" />
                  )}
                </td>
                <td className="p-3 font-medium">{c.name}</td>
                <td className="p-3">
                  <span className="text-xs px-2 py-1 rounded-full bg-primary-50 text-primary-700">
                    {c.type}
                  </span>
                </td>
                <td className="p-3 text-neutral-500">{c.slug}</td>
                <td className="p-3">{c.order}</td>
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
export default AdminCategories;
