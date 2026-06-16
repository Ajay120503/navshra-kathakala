import { useEffect, useState } from "react";
import { Eye, Image as ImageIcon, Save, X } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../api/axios";

const statuses = ["new", "in_discussion", "quoted", "confirmed", "rejected"];

const formatDate = (date) =>
  date ? new Date(date).toLocaleDateString() : "Not specified";

const AdminCustomOrders = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get("/custom-orders");
      setItems(data.data?.requests || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load custom orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const openDetails = async (id) => {
    setDetailsLoading(true);
    try {
      const { data } = await api.get(`/custom-orders/${id}`);
      setSelected(data.data.request);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load details");
    } finally {
      setDetailsLoading(false);
    }
  };

  const saveDetails = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      const { data } = await api.put(`/custom-orders/${selected._id}`, {
        status: selected.status,
        adminNotes: selected.adminNotes || "",
      });
      const updated = data.data.request;
      setSelected(updated);
      setItems((prev) =>
        prev.map((item) => (item._id === updated._id ? updated : item))
      );
      toast.success("Custom order updated");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save");
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

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900 mb-6">
        Custom Order Requests
      </h1>
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-neutral-50">
              <th className="text-left p-3 font-medium text-neutral-600">
                Name
              </th>
              <th className="text-left p-3 font-medium text-neutral-600">
                Contact
              </th>
              <th className="text-left p-3 font-medium text-neutral-600">
                Occasion
              </th>
              <th className="text-left p-3 font-medium text-neutral-600">
                Budget
              </th>
              <th className="text-left p-3 font-medium text-neutral-600">
                Status
              </th>
              <th className="text-left p-3 font-medium text-neutral-600">
                Date
              </th>
              <th className="text-right p-3 font-medium text-neutral-600">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-neutral-500">
                  No custom order requests found
                </td>
              </tr>
            ) : (
              items.map((r) => (
                <tr key={r._id} className="border-t border-neutral-100">
                  <td className="p-3 font-medium">{r.name}</td>
                  <td className="p-3 text-neutral-500">
                    <p>{r.email}</p>
                    <p>{r.phone}</p>
                  </td>
                  <td className="p-3">{r.occasion || "—"}</td>
                  <td className="p-3">{r.budget || "—"}</td>
                  <td className="p-3">
                    <span className="text-xs px-2 py-1 rounded-full bg-primary-100 text-primary-700">
                      {r.status?.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="p-3 text-neutral-500">
                    {formatDate(r.createdAt)}
                  </td>
                  <td className="p-3 text-right">
                    <button
                      type="button"
                      onClick={() => openDetails(r._id)}
                      className="btn-outline text-xs"
                      disabled={detailsLoading}
                    >
                      <Eye className="w-3 h-3" /> View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-neutral-200">
              <div>
                <h2 className="text-xl font-semibold text-neutral-900">
                  Custom Order Details
                </h2>
                <p className="text-sm text-neutral-500">
                  Submitted on {formatDate(selected.createdAt)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="p-2 hover:bg-neutral-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-5">
                <div>
                  <h3 className="font-semibold text-neutral-900 mb-2">
                    Customer Idea
                  </h3>
                  <p className="text-sm text-neutral-700 whitespace-pre-wrap">
                    {selected.description}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-neutral-900 mb-3">
                    Reference Images
                  </h3>
                  {selected.referenceImages?.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {selected.referenceImages.map((image, index) => (
                        <a
                          key={image.publicId || image.url || index}
                          href={image.url}
                          target="_blank"
                          rel="noreferrer"
                          className="aspect-square rounded-lg overflow-hidden border border-neutral-200 bg-neutral-100"
                        >
                          <img
                            src={image.url}
                            alt={`Reference ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </a>
                      ))}
                    </div>
                  ) : (
                    <div className="border border-dashed border-neutral-200 rounded-lg p-6 text-center text-neutral-400">
                      <ImageIcon className="w-8 h-8 mx-auto mb-2" />
                      No reference images
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-5">
                <div className="bg-neutral-50 rounded-lg p-4 space-y-3">
                  <h3 className="font-semibold text-neutral-900">
                    Customer Details
                  </h3>
                  <Detail label="Name" value={selected.name} />
                  <Detail label="Email" value={selected.email} />
                  <Detail label="Phone" value={selected.phone} />
                  <Detail label="Account" value={selected.user?.email || "Guest"} />
                  <Detail label="Occasion" value={selected.occasion} />
                  <Detail label="Budget" value={selected.budget} />
                  <Detail label="Deadline" value={formatDate(selected.deadline)} />
                </div>

                <div className="bg-neutral-50 rounded-lg p-4 space-y-3">
                  <h3 className="font-semibold text-neutral-900">
                    Admin Follow-up
                  </h3>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Status
                    </label>
                    <select
                      value={selected.status}
                      onChange={(e) =>
                        setSelected({ ...selected, status: e.target.value })
                      }
                      className="input-field"
                    >
                      {statuses.map((status) => (
                        <option key={status} value={status}>
                          {status.replace(/_/g, " ")}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Admin Notes
                    </label>
                    <textarea
                      rows={5}
                      value={selected.adminNotes || ""}
                      onChange={(e) =>
                        setSelected({ ...selected, adminNotes: e.target.value })
                      }
                      className="input-field"
                      placeholder="Internal notes, quote details, follow-up status..."
                    />
                  </div>
                  <button
                    type="button"
                    onClick={saveDetails}
                    disabled={saving}
                    className="btn-primary w-full"
                  >
                    <Save className="w-4 h-4" />
                    {saving ? "Saving..." : "Save Details"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Detail = ({ label, value }) => (
  <div>
    <p className="text-xs text-neutral-500">{label}</p>
    <p className="text-sm font-medium text-neutral-900 break-words">
      {value || "Not specified"}
    </p>
  </div>
);

export default AdminCustomOrders;
