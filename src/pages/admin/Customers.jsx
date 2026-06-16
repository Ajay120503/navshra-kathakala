import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import api from "../../api/axios";
import { formatDate } from "../../utils/formatCurrency";
const AdminCustomers = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  useEffect(() => {
    const fetch = async () => {
      try {
        const params = search ? `?search=${search}` : "";
        const { data } = await api.get(`/admin/users${params}`);
        setItems(data.data?.users || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [search]);
  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-t-transparent" />
      </div>
    );
  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900 mb-6">Customers</h1>
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search customers..."
          className="input-field pl-9 text-sm"
        />
      </div>
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-neutral-50">
              <th className="text-left p-3 font-medium">Name</th>
              <th className="text-left p-3 font-medium">Email</th>
              <th className="text-left p-3 font-medium">Phone</th>
              <th className="text-left p-3 font-medium">Joined</th>
              <th className="text-left p-3 font-medium">Status</th>
              <th className="text-left p-3 font-medium">Role</th>
            </tr>
          </thead>
          <tbody>
            {items.map((u) => (
              <tr key={u._id} className="border-t border-neutral-100">
                <td className="p-3 font-medium">{u.name}</td>
                <td className="p-3 text-neutral-500">{u.email}</td>
                <td className="p-3">{u.phone || "—"}</td>
                <td className="p-3 text-neutral-500">
                  {formatDate(u.createdAt)}
                </td>
                <td className="p-3">
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      u.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {u.isActive ? "Active" : "Blocked"}
                  </span>
                </td>
                <td className="p-3">
                  <span className="text-xs px-2 py-1 rounded-full bg-primary-50 text-primary-700">
                    {u.role}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default AdminCustomers;
