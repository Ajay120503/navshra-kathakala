import { useState, useEffect } from "react";
import {
  Save,
  RotateCcw,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Loader2,
  FileText,
  Eye,
  EyeOff,
  CheckCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../../api/axios";
import { clearPageCache } from "../../hooks/usePage";

const pageLabels = {
  about: "About Us",
  contact: "Contact Us",
  faq: "FAQ",
  privacy: "Privacy Policy",
  terms: "Terms & Conditions",
  shipping: "Shipping Policy",
};

const AdminPages = () => {
  const [pages, setPages] = useState([]);
  const [activePage, setActivePage] = useState("about");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState(null);

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/pages/admin/all");
      setPages(data.data?.pages || []);
    } catch (err) {
      toast.error("Failed to load pages");
    } finally {
      setLoading(false);
    }
  };

  const currentPage = pages.find((p) => p.slug === activePage);

  const updatePageField = (slug, field, value) => {
    setPages((prev) =>
      prev.map((p) => (p.slug === slug ? { ...p, [field]: value } : p))
    );
  };

  const handleSave = async () => {
    if (!currentPage) return;
    setSaving(true);
    try {
      const payload = {
        title: currentPage.title,
        content: currentPage.content,
        isActive: currentPage.isActive,
        metaTitle: currentPage.metaTitle,
        metaDescription: currentPage.metaDescription,
      };

      // Include FAQ data for faq page
      if (activePage === "faq") {
        payload.faqs = currentPage.faqs;
      }

      // Include contact details for contact page
      if (activePage === "contact") {
        payload.contactDetails = currentPage.contactDetails;
      }

      await api.put(`/pages/admin/${activePage}`, payload);
      clearPageCache(activePage);
      toast.success(`${pageLabels[activePage]} content saved!`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (!window.confirm(`Reset ${pageLabels[activePage]} to default content?`))
      return;
    try {
      await api.delete(`/pages/admin/${activePage}`);
      clearPageCache(activePage);
      await fetchPages();
      toast.success(`${pageLabels[activePage]} reset to defaults`);
    } catch (err) {
      toast.error("Failed to reset page");
    }
  };

  const handleAddFaq = () => {
    const updated = {
      ...currentPage,
      faqs: [...(currentPage.faqs || []), { question: "", answer: "" }],
    };
    setPages((prev) => prev.map((p) => (p.slug === activePage ? updated : p)));
  };

  const handleRemoveFaq = (index) => {
    const updated = {
      ...currentPage,
      faqs: currentPage.faqs.filter((_, i) => i !== index),
    };
    setPages((prev) => prev.map((p) => (p.slug === activePage ? updated : p)));
  };

  const handleFaqChange = (index, field, value) => {
    const updatedFaqs = [...currentPage.faqs];
    updatedFaqs[index] = { ...updatedFaqs[index], [field]: value };
    setPages((prev) =>
      prev.map((p) => (p.slug === activePage ? { ...p, faqs: updatedFaqs } : p))
    );
  };

  const handleContactChange = (field, value) => {
    const updated = {
      ...currentPage,
      contactDetails: { ...(currentPage.contactDetails || {}), [field]: value },
    };
    setPages((prev) => prev.map((p) => (p.slug === activePage ? updated : p)));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900 mb-6">
        Static Pages Editor
      </h1>
      <div
        className="grid lg:grid-4 gap-6"
        style={{ gridTemplateColumns: "200px 1fr" }}
      >
        {/* Sidebar */}
        <div className="space-y-1">
          {pages.map((p) => (
            <button
              key={p.slug}
              onClick={() => setActivePage(p.slug)}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-between ${
                activePage === p.slug
                  ? "bg-primary-50 text-primary-600"
                  : "text-neutral-600 hover:bg-neutral-100"
              }`}
            >
              <span>{pageLabels[p.slug] || p.slug}</span>
              {p.isCustomized && (
                <span
                  className="w-2 h-2 rounded-full bg-primary-500"
                  title="Customized"
                />
              )}
            </button>
          ))}
        </div>

        {/* Editor */}
        {currentPage && (
          <div className="bg-white rounded-xl border border-neutral-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <h2 className="font-semibold text-neutral-900 text-lg">
                  {pageLabels[activePage]}
                </h2>
                {currentPage.isCustomized ? (
                  <span className="flex items-center gap-1 text-xs font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded-full">
                    <CheckCircle className="w-3 h-3" /> Customized
                  </span>
                ) : (
                  <span className="text-xs font-medium text-neutral-500 bg-neutral-100 px-2 py-1 rounded-full">
                    Default
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    updatePageField(
                      activePage,
                      "isActive",
                      !currentPage.isActive
                    )
                  }
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    currentPage.isActive
                      ? "bg-green-50 text-green-600 hover:bg-green-100"
                      : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200"
                  }`}
                >
                  {currentPage.isActive ? (
                    <Eye className="w-3.5 h-3.5" />
                  ) : (
                    <EyeOff className="w-3.5 h-3.5" />
                  )}
                  {currentPage.isActive ? "Active" : "Inactive"}
                </button>
                <button
                  onClick={handleReset}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-600 hover:bg-neutral-100 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Reset
                </button>
              </div>
            </div>

            {/* Title */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Page Title
              </label>
              <input
                type="text"
                value={currentPage.title}
                onChange={(e) =>
                  updatePageField(activePage, "title", e.target.value)
                }
                className="input-field"
              />
            </div>

            {/* SEO Fields */}
            <div className="mb-4 grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Meta Title (SEO)
                </label>
                <input
                  type="text"
                  value={currentPage.metaTitle || ""}
                  onChange={(e) =>
                    updatePageField(activePage, "metaTitle", e.target.value)
                  }
                  className="input-field"
                  placeholder="Custom meta title..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Meta Description (SEO)
                </label>
                <input
                  type="text"
                  value={currentPage.metaDescription || ""}
                  onChange={(e) =>
                    updatePageField(
                      activePage,
                      "metaDescription",
                      e.target.value
                    )
                  }
                  className="input-field"
                  placeholder="Custom meta description..."
                />
              </div>
            </div>

            {/* FAQ Editor */}
            {activePage === "faq" && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-neutral-700">
                    FAQ Items
                  </label>
                  <button
                    onClick={handleAddFaq}
                    className="flex items-center gap-1 text-xs font-medium text-primary-600 hover:text-primary-700"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Question
                  </button>
                </div>
                <div className="space-y-3">
                  {(currentPage.faqs || []).map((faq, i) => (
                    <div
                      key={i}
                      className="border border-neutral-200 rounded-xl overflow-hidden"
                    >
                      <button
                        onClick={() =>
                          setExpandedFaq(expandedFaq === i ? null : i)
                        }
                        className="w-full flex items-center justify-between p-3 text-left hover:bg-neutral-50"
                      >
                        <span className="text-sm font-medium text-neutral-700 truncate pr-2">
                          {faq.question || `Question ${i + 1}`}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveFaq(i);
                            }}
                            className="text-neutral-400 hover:text-red-500"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          {expandedFaq === i ? (
                            <ChevronUp className="w-4 h-4 text-neutral-400" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-neutral-400" />
                          )}
                        </div>
                      </button>
                      {expandedFaq === i && (
                        <div className="p-3 pt-0 space-y-3 border-t border-neutral-100">
                          <input
                            type="text"
                            value={faq.question}
                            onChange={(e) =>
                              handleFaqChange(i, "question", e.target.value)
                            }
                            className="input-field mt-2"
                            placeholder="Question..."
                          />
                          <textarea
                            rows={3}
                            value={faq.answer}
                            onChange={(e) =>
                              handleFaqChange(i, "answer", e.target.value)
                            }
                            className="input-field font-mono text-sm"
                            placeholder="Answer..."
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Contact Details Editor */}
            {activePage === "contact" && (
              <div className="mb-4">
                <label className="text-sm font-medium text-neutral-700 mb-3 block">
                  Contact Details
                </label>
                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-xs text-neutral-500 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={currentPage.contactDetails?.email || ""}
                      onChange={(e) =>
                        handleContactChange("email", e.target.value)
                      }
                      className="input-field"
                      placeholder="hello@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-500 mb-1">
                      Phone
                    </label>
                    <input
                      type="text"
                      value={currentPage.contactDetails?.phone || ""}
                      onChange={(e) =>
                        handleContactChange("phone", e.target.value)
                      }
                      className="input-field"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-500 mb-1">
                      Address
                    </label>
                    <input
                      type="text"
                      value={currentPage.contactDetails?.address || ""}
                      onChange={(e) =>
                        handleContactChange("address", e.target.value)
                      }
                      className="input-field"
                      placeholder="Mumbai, India"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Content (HTML/JSON) for about, privacy, terms, shipping */}
            {activePage !== "faq" && activePage !== "contact" && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Page Content (JSON)
                </label>
                <p className="text-xs text-neutral-400 mb-2">
                  Edit the JSON content for this page. Use the format:
                  {activePage === "about"
                    ? ' { "intro": "...", "body": "...", "outro": "...", "features": [...] }'
                    : ' { "lastUpdated": "...", "sections": [{ "heading": "...", "body": "..." }] }'}
                </p>
                <textarea
                  rows={20}
                  value={currentPage.content || ""}
                  onChange={(e) =>
                    updatePageField(activePage, "content", e.target.value)
                  }
                  className="input-field font-mono text-sm"
                />
              </div>
            )}

            {/* Save Button */}
            <div className="flex justify-end mt-6 pt-4 border-t border-neutral-100">
              <button
                onClick={handleSave}
                disabled={saving}
                className="btn-primary"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}{" "}
                {saving ? "Saving..." : "Save Content"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPages;
