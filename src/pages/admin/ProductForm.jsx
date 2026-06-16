import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Save, Upload, X, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../api/axios";

const AdminProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [occasionsList, setOccasionsList] = useState([]);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    price: "",
    discountPrice: "",
    discountPercent: "",
    description: "",
    shortDescription: "",
    stock: "0",
    lowStockThreshold: "5",
    trackInventory: true,
    status: "active",
    sku: "",
    category: "",
    occasions: [],
    isFeatured: false,
    isNewArrival: false,
    isBestSeller: false,
    isPersonalizable: false,
    tags: "",
    material: "",
    weight: "",
    taxClass: "standard",
    estimatedDeliveryText: "5-7 business days",
    seoMetaTitle: "",
    seoMetaDescription: "",
    length: "",
    width: "",
    height: "",
  });
  const [variants, setVariants] = useState([]);
  const [personalizationFields, setPersonalizationFields] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, occRes] = await Promise.all([
          api.get("/categories?type=category"),
          api.get("/categories?type=occasion"),
        ]);
        setCategories(catRes.data.data?.categories || []);
        setOccasionsList(occRes.data.data?.categories || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
    if (isEdit) fetchProduct();
  }, [id, isEdit, navigate]);

  const fetchProduct = async () => {
    try {
      const { data } = await api.get(`/products/id/${id}`);
      const p = data.data.product;
      setForm({
        title: p.title,
        slug: p.slug || "",
        price: p.price.toString(),
        discountPrice: p.discountPrice ? p.discountPrice.toString() : "",
        discountPercent: p.discountPercent ? p.discountPercent.toString() : "",
        description: p.description || "",
        shortDescription: p.shortDescription || "",
        stock: p.stock.toString(),
        lowStockThreshold: (p.lowStockThreshold || 5).toString(),
        trackInventory: p.trackInventory !== false,
        status: p.status,
        sku: p.sku || "",
        category: p.category?._id || p.category || "",
        occasions: p.occasions?.map((o) => o._id || o) || [],
        isFeatured: p.isFeatured || false,
        isNewArrival: p.isNewArrival || false,
        isBestSeller: p.isBestSeller || false,
        isPersonalizable: p.isPersonalizable || false,
        tags: (p.tags || []).join(", "),
        material: (p.material || []).join(", "),
        weight: p.weight ? p.weight.toString() : "",
        taxClass: p.taxClass || "standard",
        estimatedDeliveryText: p.estimatedDeliveryText || "5-7 business days",
        seoMetaTitle: p.seo?.metaTitle || "",
        seoMetaDescription: p.seo?.metaDescription || "",
        length: p.dimensions?.length ? p.dimensions.length.toString() : "",
        width: p.dimensions?.width ? p.dimensions.width.toString() : "",
        height: p.dimensions?.height ? p.dimensions.height.toString() : "",
      });
      setImages(p.images || []);
      setVariants(p.variants || []);
      setPersonalizationFields(p.personalizationFields || []);
    } catch (err) {
      toast.error("Failed to load product");
      navigate("/admin/products");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const files = e.target.files;
    if (!files.length) return;
    setUploading(true);
    try {
      const fd = new FormData();
      for (const file of files) fd.append("files", file);
      const { data } = await api.post("/upload/product-images", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const uploaded = data.data.images || [];
      setImages((prev) => [
        ...prev,
        ...uploaded.map((u) => ({
          url: u.url,
          publicId: u.publicId,
          isThumbnail: prev.length === 0 && u === uploaded[0],
          order: prev.length,
        })),
      ]);
      toast.success(`${uploaded.length} image(s) uploaded`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.price) {
      toast.error("Title and price are required");
      return;
    }
    setSaving(true);
    try {
      const slug =
        form.slug ||
        form.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");
      const cleanedVariants = variants.map((variant) => {
        const next = { ...variant };
        const sku = typeof next.sku === "string" ? next.sku.trim() : next.sku;
        if (sku) {
          next.sku = sku;
        } else {
          delete next.sku;
        }
        return next;
      });

      const payload = {
        title: form.title,
        slug,
        price: parseFloat(form.price),
        discountPrice: form.discountPrice
          ? parseFloat(form.discountPrice)
          : undefined,
        discountPercent: form.discountPercent
          ? parseFloat(form.discountPercent)
          : undefined,
        description: form.description,
        shortDescription: form.shortDescription,
        stock: parseInt(form.stock) || 0,
        lowStockThreshold: parseInt(form.lowStockThreshold) || 5,
        trackInventory: form.trackInventory,
        status: form.status,
        sku: form.sku.trim() || undefined,
        category: form.category || undefined,
        occasions: form.occasions,
        isFeatured: form.isFeatured,
        isNewArrival: form.isNewArrival,
        isBestSeller: form.isBestSeller,
        isPersonalizable: form.isPersonalizable,
        tags: form.tags
          ? form.tags
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean)
          : [],
        material: form.material
          ? form.material
              .split(",")
              .map((m) => m.trim())
              .filter(Boolean)
          : [],
        weight: form.weight ? parseFloat(form.weight) : undefined,
        taxClass: form.taxClass,
        estimatedDeliveryText: form.estimatedDeliveryText,
        seo: {
          metaTitle: form.seoMetaTitle,
          metaDescription: form.seoMetaDescription,
        },
        dimensions:
          form.length || form.width || form.height
            ? {
                length: form.length ? parseFloat(form.length) : undefined,
                width: form.width ? parseFloat(form.width) : undefined,
                height: form.height ? parseFloat(form.height) : undefined,
                unit: "cm",
              }
            : undefined,
        images,
        variants: cleanedVariants,
        personalizationFields,
      };
      if (isEdit) {
        await api.put(`/products/${id}`, payload);
        toast.success("Product updated!");
      } else {
        await api.post("/products", payload);
        toast.success("Product created!");
      }
      navigate("/admin/products");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const addVariant = () =>
    setVariants([
      ...variants,
      { name: "", value: "", priceAdjustment: 0, stock: 0, sku: "" },
    ]);
  const updateVariant = (i, field, val) => {
    const v = [...variants];
    v[i][field] = val;
    setVariants(v);
  };
  const removeVariant = (i) =>
    setVariants(variants.filter((_, idx) => idx !== i));

  const addPersonalization = () =>
    setPersonalizationFields([
      ...personalizationFields,
      {
        label: "",
        type: "text",
        required: false,
        placeholder: "",
        maxLength: "",
      },
    ]);
  const updatePersonalization = (i, field, val) => {
    const v = [...personalizationFields];
    v[i][field] = val;
    setPersonalizationFields(v);
  };
  const removePersonalization = (i) =>
    setPersonalizationFields(
      personalizationFields.filter((_, idx) => idx !== i)
    );

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-t-transparent" />
      </div>
    );

  return (
    <div>
      <Link
        to="/admin/products"
        className="flex items-center gap-2 text-sm text-neutral-500 hover:text-primary-500 mb-4"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Products
      </Link>
      <h1 className="text-2xl font-bold text-neutral-900 mb-6">
        {isEdit ? "Edit Product" : "Add New Product"}
      </h1>
      <form onSubmit={handleSubmit} className="max-w-5xl space-y-6">
        {/* Basic Information */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4">
          <h2 className="font-semibold text-neutral-900">Basic Information</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Title *</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) =>
                  setForm({
                    ...form,
                    title: e.target.value,
                    slug: isEdit
                      ? form.slug
                      : e.target.value
                          .toLowerCase()
                          .replace(/[^a-z0-9]+/g, "-")
                          .replace(/(^-|-$)/g, ""),
                  })
                }
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">SKU</label>
              <input
                type="text"
                value={form.sku}
                onChange={(e) => setForm({ ...form, sku: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Slug</label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                className="input-field"
                placeholder="Auto-generated"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Price (₹) *
              </label>
              <input
                type="number"
                step="0.01"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Discount Price
              </label>
              <input
                type="number"
                step="0.01"
                value={form.discountPrice}
                onChange={(e) =>
                  setForm({ ...form, discountPrice: e.target.value })
                }
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Discount %
              </label>
              <input
                type="number"
                step="0.1"
                value={form.discountPercent}
                onChange={(e) =>
                  setForm({ ...form, discountPercent: e.target.value })
                }
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Stock</label>
              <input
                type="number"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Low Stock Threshold
              </label>
              <input
                type="number"
                value={form.lowStockThreshold}
                onChange={(e) =>
                  setForm({ ...form, lowStockThreshold: e.target.value })
                }
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Tax Class
              </label>
              <select
                value={form.taxClass}
                onChange={(e) => setForm({ ...form, taxClass: e.target.value })}
                className="input-field"
              >
                <option value="standard">Standard</option>
                <option value="reduced">Reduced</option>
                <option value="zero">Zero Rated</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Weight (g)
              </label>
              <input
                type="number"
                step="0.1"
                value={form.weight}
                onChange={(e) => setForm({ ...form, weight: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Est. Delivery
              </label>
              <input
                type="text"
                value={form.estimatedDeliveryText}
                onChange={(e) =>
                  setForm({ ...form, estimatedDeliveryText: e.target.value })
                }
                className="input-field"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Short Description
            </label>
            <input
              type="text"
              value={form.shortDescription}
              onChange={(e) =>
                setForm({ ...form, shortDescription: e.target.value })
              }
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Tags (comma separated)
            </label>
            <input
              type="text"
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              className="input-field"
              placeholder="gift, birthday, handmade"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Material (comma separated)
            </label>
            <input
              type="text"
              value={form.material}
              onChange={(e) => setForm({ ...form, material: e.target.value })}
              className="input-field"
              placeholder="cotton, wood, clay"
            />
          </div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.trackInventory}
              onChange={(e) =>
                setForm({ ...form, trackInventory: e.target.checked })
              }
              className="w-4 h-4 rounded text-primary-500"
            />{" "}
            Track Inventory
          </label>
        </div>

        {/* Category & Occasion */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4">
          <h2 className="font-semibold text-neutral-900">
            Category & Occasions
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="input-field"
              >
                <option value="">None</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Occasions
              </label>
              <div className="flex flex-wrap gap-2">
                {occasionsList.map((o) => (
                  <button
                    key={o._id}
                    type="button"
                    onClick={() => {
                      const occ = form.occasions.includes(o._id)
                        ? form.occasions.filter((id) => id !== o._id)
                        : [...form.occasions, o._id];
                      setForm({ ...form, occasions: occ });
                    }}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                      form.occasions.includes(o._id)
                        ? "bg-primary-500 text-white border-primary-500"
                        : "border-neutral-300 hover:border-primary-300"
                    }`}
                  >
                    {o.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Dimensions */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4">
          <h2 className="font-semibold text-neutral-900">Dimensions (cm)</h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Length</label>
              <input
                type="number"
                step="0.1"
                value={form.length}
                onChange={(e) => setForm({ ...form, length: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Width</label>
              <input
                type="number"
                step="0.1"
                value={form.width}
                onChange={(e) => setForm({ ...form, width: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Height</label>
              <input
                type="number"
                step="0.1"
                value={form.height}
                onChange={(e) => setForm({ ...form, height: e.target.value })}
                className="input-field"
              />
            </div>
          </div>
        </div>

        {/* Variants */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-neutral-900">Variants</h2>
            <button
              type="button"
              onClick={addVariant}
              className="btn-primary text-xs py-1.5"
            >
              <Plus className="w-3 h-3" /> Add Variant
            </button>
          </div>
          {variants.length === 0 ? (
            <p className="text-sm text-neutral-400">
              No variants. Click "Add Variant" to create options like sizes or
              colors.
            </p>
          ) : (
            variants.map((v, i) => (
              <div
                key={i}
                className="flex flex-wrap items-end gap-2 p-3 bg-neutral-50 rounded-lg"
              >
                <div>
                  <label className="text-xs font-medium">Name</label>
                  <input
                    type="text"
                    value={v.name}
                    onChange={(e) => updateVariant(i, "name", e.target.value)}
                    className="input-field text-sm py-1.5 w-24"
                    placeholder="Size"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium">Value</label>
                  <input
                    type="text"
                    value={v.value}
                    onChange={(e) => updateVariant(i, "value", e.target.value)}
                    className="input-field text-sm py-1.5 w-24"
                    placeholder="Medium"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium">Price Adj.</label>
                  <input
                    type="number"
                    step="1"
                    value={v.priceAdjustment}
                    onChange={(e) =>
                      updateVariant(
                        i,
                        "priceAdjustment",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    className="input-field text-sm py-1.5 w-20"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium">Stock</label>
                  <input
                    type="number"
                    value={v.stock}
                    onChange={(e) =>
                      updateVariant(i, "stock", parseInt(e.target.value) || 0)
                    }
                    className="input-field text-sm py-1.5 w-20"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium">SKU</label>
                  <input
                    type="text"
                    value={v.sku}
                    onChange={(e) => updateVariant(i, "sku", e.target.value)}
                    className="input-field text-sm py-1.5 w-28"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeVariant(i)}
                  className="p-1.5 text-danger hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Personalization */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-neutral-900">Personalization</h2>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isPersonalizable}
                onChange={(e) =>
                  setForm({ ...form, isPersonalizable: e.target.checked })
                }
                className="w-4 h-4 rounded text-primary-500"
              />{" "}
              Enable Personalization
            </label>
          </div>
          {form.isPersonalizable && (
            <div>
              {personalizationFields.length === 0 ? (
                <p className="text-sm text-neutral-400 mb-3">
                  Add fields for customers to customize (engraving text, image
                  upload, etc.)
                </p>
              ) : (
                personalizationFields.map((f, i) => (
                  <div
                    key={i}
                    className="flex flex-wrap items-end gap-2 p-3 bg-neutral-50 rounded-lg mb-2"
                  >
                    <div>
                      <label className="text-xs font-medium">Label</label>
                      <input
                        type="text"
                        value={f.label}
                        onChange={(e) =>
                          updatePersonalization(i, "label", e.target.value)
                        }
                        className="input-field text-sm py-1.5 w-40"
                        placeholder="Engraving text"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium">Type</label>
                      <select
                        value={f.type}
                        onChange={(e) =>
                          updatePersonalization(i, "type", e.target.value)
                        }
                        className="input-field text-sm py-1.5 w-28"
                      >
                        <option value="text">Text</option>
                        <option value="textarea">Textarea</option>
                        <option value="image">Image</option>
                      </select>
                    </div>
                    <label className="flex items-center gap-1 text-xs">
                      <input
                        type="checkbox"
                        checked={f.required}
                        onChange={(e) =>
                          updatePersonalization(i, "required", e.target.checked)
                        }
                        className="w-3 h-3"
                      />{" "}
                      Required
                    </label>
                    <div>
                      <label className="text-xs font-medium">Max</label>
                      <input
                        type="number"
                        value={f.maxLength}
                        onChange={(e) =>
                          updatePersonalization(
                            i,
                            "maxLength",
                            parseInt(e.target.value) || ""
                          )
                        }
                        className="input-field text-sm py-1.5 w-20"
                        placeholder="100"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removePersonalization(i)}
                      className="p-1.5 text-danger hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
              <button
                type="button"
                onClick={addPersonalization}
                className="btn-outline text-xs"
              >
                <Plus className="w-3 h-3" /> Add Field
              </button>
            </div>
          )}
        </div>

        {/* Images */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4">
          <h2 className="font-semibold text-neutral-900">Product Images</h2>
          <div className="flex flex-wrap gap-3">
            {images.map((img, i) => (
              <div
                key={img.publicId || i}
                className="relative w-24 h-24 rounded-xl overflow-hidden border border-neutral-200 group"
              >
                <img
                  src={img.url}
                  alt=""
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      await api.delete(`/upload/${img.publicId}`);
                    } catch {}
                    setImages((prev) => prev.filter((_, idx) => idx !== i));
                  }}
                  className="absolute top-1 right-1 w-5 h-5 bg-danger text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            <label className="w-24 h-24 rounded-xl border-2 border-dashed border-neutral-300 flex flex-col items-center justify-center cursor-pointer hover:border-primary-400 hover:bg-primary-50/30 transition-colors">
              {uploading ? (
                <span className="w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Upload className="w-5 h-5 text-neutral-400" />
                  <span className="text-xs text-neutral-400 mt-1">Upload</span>
                </>
              )}
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={uploading}
              />
            </label>
          </div>
        </div>

        {/* Flags */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4">
          <h2 className="font-semibold text-neutral-900">Status & Flags</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="input-field"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isFeatured}
                onChange={(e) =>
                  setForm({ ...form, isFeatured: e.target.checked })
                }
                className="w-4 h-4 rounded text-primary-500"
              />{" "}
              Featured
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isNewArrival}
                onChange={(e) =>
                  setForm({ ...form, isNewArrival: e.target.checked })
                }
                className="w-4 h-4 rounded text-primary-500"
              />{" "}
              New Arrival
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isBestSeller}
                onChange={(e) =>
                  setForm({ ...form, isBestSeller: e.target.checked })
                }
                className="w-4 h-4 rounded text-primary-500"
              />{" "}
              Best Seller
            </label>
          </div>
        </div>

        {/* SEO */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4">
          <h2 className="font-semibold text-neutral-900">SEO</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Meta Title
              </label>
              <input
                type="text"
                value={form.seoMetaTitle}
                onChange={(e) =>
                  setForm({ ...form, seoMetaTitle: e.target.value })
                }
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Meta Description
              </label>
              <textarea
                rows={2}
                value={form.seoMetaDescription}
                onChange={(e) =>
                  setForm({ ...form, seoMetaDescription: e.target.value })
                }
                className="input-field"
              />
            </div>
          </div>
        </div>

        <button type="submit" disabled={saving} className="btn-primary">
          <Save className="w-4 h-4" />{" "}
          {saving ? "Saving..." : isEdit ? "Update Product" : "Create Product"}
        </button>
      </form>
    </div>
  );
};
export default AdminProductForm;
