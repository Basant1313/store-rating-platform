import AdminLayout from "@/layouts/AdminLayout";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react"; // 🔁 Spinner

const AdminAddStore = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    owner_id: "",
  });

  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(false); // ⏳ Loading state
  const token = localStorage.getItem("token");

  const handleOwnerChange = (e) => {
  const ownerId = e.target.value;
  const selectedOwner = owners.find((owner) => owner.id === parseInt(ownerId));

  setForm({
    ...form,
    owner_id: ownerId,
    email: selectedOwner?.email || "",
  });
};
  useEffect(() => {
    const fetchOwners = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/admin/users?role=store_owner",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        setOwners(data);
      } catch (err) {
        toast.error("Failed to fetch store owners");
      }
    };

    fetchOwners();
  }, [token]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // 🌀 Start loading
    try {
      const res = await fetch("http://localhost:5000/api/admin/stores", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add store");

      toast.success("Store added successfully");
      navigate("/admin/stores");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false); // ✅ Done loading
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-xl mx-auto px-6 py-10 bg-white dark:bg-gray-900 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6 text-green-600 dark:text-green-400">
          🏬 Add New Store
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {["name","address"].map((field) => (
            <div key={field}>
              <label className="block mb-1 text-sm font-medium capitalize text-gray-700 dark:text-gray-300">
                {field}
              </label>
              <input
                name={field}
                required
                value={form[field]}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-green-500"
              />
            </div>
          ))}

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Store Owner
            </label>
            <select
  name="owner_id"
  required
  value={form.owner_id}
  onChange={handleOwnerChange}
  className="..."
>
  <option value="">Select owner</option>
  {owners.map((owner) => (
    <option key={owner.id} value={owner.id}>
      {owner.name} ({owner.email})
    </option>
  ))}
</select>
          </div>

          {/* Submit Button with Spinner */}
          <Button
            type="submit"
            className="w-full flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? "Adding..." : "Add Store"}
          </Button>
        </form>
      </div>
    </AdminLayout>
  );
};

export default AdminAddStore;
