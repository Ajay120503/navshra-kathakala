import { useEffect, useState, useRef } from "react";
import { Save, Upload, X } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../api/axios";

const AdminSettings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState({
    logo: false,
    favicon: false,
    banner: false,
  });
  const [tab, setTab] = useState("general");
  const logoInputRef = useRef();
  const faviconInputRef = useRef();
  const bannerInputRef = useRef();

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get("/settings");
        setSettings(data.data.settings);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const updateField = (path, value) => {
    setSettings((prev) => {
      const newSettings = { ...prev };
      const keys = path.split(".");
      let obj = newSettings;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!obj[keys[i]]) obj[keys[i]] = {};
        obj = obj[keys[i]];
      }
      obj[keys[keys.length - 1]] = value;
      return newSettings;
    });
  };

  const handleImageUpload = async (field, file) => {
    if (!file) return;
    setUploading((prev) => ({ ...prev, [field]: true }));
    try {
      const fd = new FormData();
      fd.append("file", file);
      const endpoint =
        field === "banner" ? "/upload/banner-image" : "/upload/logo";
      const { data } = await api.post(endpoint, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const urlPath =
        field === "logo"
          ? "logo.url"
          : field === "favicon"
          ? "favicon.url"
          : "banners.0.image.url";
      const publicIdPath =
        field === "logo"
          ? "logo.publicId"
          : field === "favicon"
          ? "favicon.publicId"
          : "banners.0.image.publicId";
      updateField(urlPath, data.data.url);
      updateField(publicIdPath, data.data.publicId);
      toast.success(`${field} uploaded!`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading((prev) => ({ ...prev, [field]: false }));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put("/settings", settings);
      toast.success("Settings saved!");
    } catch (err) {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-t-transparent" />
      </div>
    );
  if (!settings)
    return (
      <div className="text-center py-16 text-neutral-500">
        Settings not available
      </div>
    );

  const tabs = ["general", "branding", "shipping", "tax", "seo"];

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900 mb-6">
        Site Settings
      </h1>
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${
              tab === t
                ? "bg-primary-500 text-white"
                : "bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50"
            }`}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>
      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        {tab === "general" && (
          <div className="space-y-4 max-w-xl">
            <div>
              <label className="block text-sm font-medium mb-1">
                Site Name
              </label>
              <input
                type="text"
                value={settings.siteName || ""}
                onChange={(e) => updateField("siteName", e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tagline</label>
              <input
                type="text"
                value={settings.tagline || ""}
                onChange={(e) => updateField("tagline", e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Announcement Text
              </label>
              <input
                type="text"
                value={settings.announcementBar?.text || ""}
                onChange={(e) =>
                  updateField("announcementBar.text", e.target.value)
                }
                className="input-field"
              />
            </div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={settings.announcementBar?.isEnabled || false}
                onChange={(e) =>
                  updateField("announcementBar.isEnabled", e.target.checked)
                }
                className="w-4 h-4 rounded text-primary-500"
              />{" "}
              Enable Announcement Bar
            </label>
            <div>
              <label className="block text-sm font-medium mb-1">
                Contact Email
              </label>
              <input
                type="email"
                value={settings.contactInfo?.email || ""}
                onChange={(e) =>
                  updateField("contactInfo.email", e.target.value)
                }
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Contact Phone
              </label>
              <input
                type="text"
                value={settings.contactInfo?.phone || ""}
                onChange={(e) =>
                  updateField("contactInfo.phone", e.target.value)
                }
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Address</label>
              <textarea
                rows={2}
                value={settings.contactInfo?.address || ""}
                onChange={(e) =>
                  updateField("contactInfo.address", e.target.value)
                }
                className="input-field"
              />
            </div>
          </div>
        )}
        {tab === "branding" && (
          <div className="space-y-6 max-w-xl">
            <div>
              <label className="block text-sm font-medium mb-2">
                Site Logo
              </label>
              <div className="flex items-center gap-4">
                {settings.logo?.url ? (
                  <img
                    src={settings.logo.url}
                    alt="Logo"
                    className="w-24 h-24 object-contain rounded-lg border border-neutral-200"
                  />
                ) : (
                  <div className="w-24 h-24 bg-neutral-100 rounded-lg flex items-center justify-center text-neutral-400 text-xs">
                    No logo
                  </div>
                )}
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    ref={logoInputRef}
                    onChange={(e) =>
                      handleImageUpload("logo", e.target.files[0])
                    }
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => logoInputRef.current?.click()}
                    className="btn-primary text-sm"
                    disabled={uploading.logo}
                  >
                    {uploading.logo ? (
                      "..."
                    ) : (
                      <>
                        <Upload className="w-4 h-4" /> Upload Logo
                      </>
                    )}
                  </button>
                  {settings.logo?.publicId && (
                    <button
                      onClick={() => {
                        updateField("logo.url", "");
                        updateField("logo.publicId", "");
                      }}
                      className="btn-outline text-sm ml-2"
                    >
                      <X className="w-3 h-3" /> Remove
                    </button>
                  )}
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Favicon</label>
              <div className="flex items-center gap-4">
                {settings.favicon?.url ? (
                  <img
                    src={settings.favicon.url}
                    alt="Favicon"
                    className="w-10 h-10 object-contain rounded border border-neutral-200"
                  />
                ) : (
                  <div className="w-10 h-10 bg-neutral-100 rounded flex items-center justify-center text-neutral-400 text-xs">
                    No
                  </div>
                )}
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    ref={faviconInputRef}
                    onChange={(e) =>
                      handleImageUpload("favicon", e.target.files[0])
                    }
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => faviconInputRef.current?.click()}
                    className="btn-primary text-sm"
                    disabled={uploading.favicon}
                  >
                    {uploading.favicon ? (
                      "..."
                    ) : (
                      <>
                        <Upload className="w-4 h-4" /> Upload
                      </>
                    )}
                  </button>
                  {settings.favicon?.publicId && (
                    <button
                      onClick={() => {
                        updateField("favicon.url", "");
                        updateField("favicon.publicId", "");
                      }}
                      className="btn-outline text-sm ml-2"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Homepage Banner Image
              </label>
              <div className="flex items-center gap-4">
                {settings.banners?.[0]?.image?.url ? (
                  <img
                    src={settings.banners[0].image.url}
                    alt="Banner"
                    className="w-32 h-20 object-cover rounded-lg border border-neutral-200"
                  />
                ) : (
                  <div className="w-32 h-20 bg-neutral-100 rounded-lg flex items-center justify-center text-neutral-400 text-xs">
                    No banner
                  </div>
                )}
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    ref={bannerInputRef}
                    onChange={(e) =>
                      handleImageUpload("banner", e.target.files[0])
                    }
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => bannerInputRef.current?.click()}
                    className="btn-primary text-sm"
                    disabled={uploading.banner}
                  >
                    {uploading.banner ? (
                      "..."
                    ) : (
                      <>
                        <Upload className="w-4 h-4" /> Upload
                      </>
                    )}
                  </button>
                  {settings.banners?.[0]?.image?.publicId && (
                    <button
                      onClick={() => {
                        updateField("banners.0.image.url", "");
                        updateField("banners.0.image.publicId", "");
                      }}
                      className="btn-outline text-sm ml-2"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1">
                    Banner Title
                  </label>
                  <input
                    type="text"
                    value={settings.banners?.[0]?.title || ""}
                    onChange={(e) =>
                      updateField("banners.0.title", e.target.value)
                    }
                    className="input-field text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">
                    Subtitle
                  </label>
                  <input
                    type="text"
                    value={settings.banners?.[0]?.subtitle || ""}
                    onChange={(e) =>
                      updateField("banners.0.subtitle", e.target.value)
                    }
                    className="input-field text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">
                    CTA Text
                  </label>
                  <input
                    type="text"
                    value={settings.banners?.[0]?.ctaText || ""}
                    onChange={(e) =>
                      updateField("banners.0.ctaText", e.target.value)
                    }
                    className="input-field text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">
                    CTA Link
                  </label>
                  <input
                    type="text"
                    value={settings.banners?.[0]?.ctaLink || ""}
                    onChange={(e) =>
                      updateField("banners.0.ctaLink", e.target.value)
                    }
                    className="input-field text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
        {tab === "shipping" && (
          <div className="space-y-4 max-w-xl">
            <div>
              <label className="block text-sm font-medium mb-1">
                Free Shipping Threshold (₹)
              </label>
              <input
                type="number"
                value={settings.shippingSettings?.freeShippingThreshold || 999}
                onChange={(e) =>
                  updateField(
                    "shippingSettings.freeShippingThreshold",
                    parseFloat(e.target.value)
                  )
                }
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Flat Rate (₹)
              </label>
              <input
                type="number"
                value={settings.shippingSettings?.flatRate || 99}
                onChange={(e) =>
                  updateField(
                    "shippingSettings.flatRate",
                    parseFloat(e.target.value)
                  )
                }
                className="input-field"
              />
            </div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={settings.shippingSettings?.codEnabled !== false}
                onChange={(e) =>
                  updateField("shippingSettings.codEnabled", e.target.checked)
                }
                className="w-4 h-4 rounded text-primary-500"
              />{" "}
              Enable COD
            </label>
          </div>
        )}
        {tab === "tax" && (
          <div className="space-y-4 max-w-xl">
            <div>
              <label className="block text-sm font-medium mb-1">Tax Name</label>
              <input
                type="text"
                value={settings.taxSettings?.taxName || "GST"}
                onChange={(e) =>
                  updateField("taxSettings.taxName", e.target.value)
                }
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Tax Percentage (%)
              </label>
              <input
                type="number"
                step="0.01"
                value={settings.taxSettings?.taxPercentage || 0}
                onChange={(e) =>
                  updateField(
                    "taxSettings.taxPercentage",
                    parseFloat(e.target.value)
                  )
                }
                className="input-field"
              />
            </div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={settings.taxSettings?.taxInclusive || false}
                onChange={(e) =>
                  updateField("taxSettings.taxInclusive", e.target.checked)
                }
                className="w-4 h-4 rounded text-primary-500"
              />{" "}
              Prices include tax
            </label>
          </div>
        )}
        {tab === "seo" && (
          <div className="space-y-4 max-w-xl">
            <div>
              <label className="block text-sm font-medium mb-1">
                Meta Title
              </label>
              <input
                type="text"
                value={settings.seoDefaults?.metaTitle || ""}
                onChange={(e) =>
                  updateField("seoDefaults.metaTitle", e.target.value)
                }
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Meta Description
              </label>
              <textarea
                rows={3}
                value={settings.seoDefaults?.metaDescription || ""}
                onChange={(e) =>
                  updateField("seoDefaults.metaDescription", e.target.value)
                }
                className="input-field"
              />
            </div>
          </div>
        )}
        <div className="mt-6 border-t pt-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary"
          >
            <Save className="w-4 h-4" />{" "}
            {saving ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </div>
    </div>
  );
};
export default AdminSettings;
