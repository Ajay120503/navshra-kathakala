import { useState } from "react";
import { Save } from "lucide-react";
import toast from "react-hot-toast";
const AdminPages = () => {
  const [content, setContent] = useState({
    about: "About Us content goes here...",
    contact: "Contact page content...",
    faq: "FAQ content...",
    privacy: "Privacy policy...",
    terms: "Terms & conditions...",
    shipping: "Shipping policy...",
  });
  const [saving, setSaving] = useState(false);
  const [activePage, setActivePage] = useState("about");
  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      toast.success("Page content saved!");
      setSaving(false);
    }, 500);
  };
  const pages = Object.keys(content);
  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900 mb-6">
        Static Pages Editor
      </h1>
      <div className="grid lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-1">
          {pages.map((p) => (
            <button
              key={p}
              onClick={() => setActivePage(p)}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                activePage === p
                  ? "bg-primary-50 text-primary-600"
                  : "text-neutral-600 hover:bg-neutral-100"
              }`}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl border border-neutral-200 p-6">
            <h2 className="font-semibold text-neutral-900 mb-4 capitalize">
              {activePage}
            </h2>
            <textarea
              rows={15}
              value={content[activePage]}
              onChange={(e) =>
                setContent({ ...content, [activePage]: e.target.value })
              }
              className="input-field font-mono text-sm"
            />
            <div className="flex justify-end mt-4">
              <button
                onClick={handleSave}
                disabled={saving}
                className="btn-primary"
              >
                <Save className="w-4 h-4" />{" "}
                {saving ? "Saving..." : "Save Content"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AdminPages;
