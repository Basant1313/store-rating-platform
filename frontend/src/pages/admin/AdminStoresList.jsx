import AdminLayout from "@/layouts/AdminLayout";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const AdminStoresList = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ name: "", email: "" });

  const [currentPage, setCurrentPage] = useState(1);
  const [storesPerPage, setStoresPerPage] = useState(5);
  const token = localStorage.getItem("token");

  const fetchStores = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/admin/stores", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      

      if (!res.ok) throw new Error(data.error || "Failed to fetch stores");

      setStores(data); // Full list
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  // Local filtering
const filteredStores = stores.filter((store) => {
  const nameMatch = (store.name || "")
    .toLowerCase()
    .includes(filters.name.toLowerCase());
  const emailMatch = (store.email || "")
    .toLowerCase()
    .includes(filters.email.toLowerCase());

  return nameMatch && emailMatch;
});

  const totalPages = Math.ceil(filteredStores.length / storesPerPage);
  const paginatedStores = filteredStores.slice(
    (currentPage - 1) * storesPerPage,
    currentPage * storesPerPage
  );

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setCurrentPage(1); // Reset to page 1 when filters change
  };

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
          🏬 Stores List
        </h1>

        {/* Filters */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <input
            type="text"
            name="name"
            placeholder="Search by store name"
            value={filters.name}
            onChange={handleFilterChange}
            className="border px-4 py-2 rounded-md bg-white dark:bg-gray-800 dark:text-white"
          />
          <input
            type="text"
            name="email"
            placeholder="Search by owner email"
            value={filters.email}
            onChange={handleFilterChange}
            className="border px-4 py-2 rounded-md bg-white dark:bg-gray-800 dark:text-white"
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-md shadow">
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="animate-spin w-6 h-6 text-blue-500" />
            </div>
          ) : (
            <table className="min-w-full bg-white dark:bg-gray-900 text-sm">
              <thead className="bg-gray-100 dark:bg-gray-800">
                <tr className="text-left text-gray-700 dark:text-gray-300">
                  <th className="py-3 px-4">Store Name</th>
                  <th className="py-3 px-4">Owner Email</th>
                  <th className="py-3 px-4">Address</th>
                  <th className="py-3 px-4">Rating</th>
                </tr>
              </thead>
              <tbody>
                {paginatedStores.length > 0 ? (
                  paginatedStores.map((store) => (
                    <tr
                      key={store.id}
                      className="border-t text-gray-800 dark:text-gray-200"
                    >
                      <td className="py-2 px-4">{store.name}</td>
                      <td className="py-2 px-4">{store.email}</td>
                      <td className="py-2 px-4">{store.address}</td>
                      <td className="py-2 px-4">{store.average_rating}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="text-center py-6 text-gray-500 dark:text-gray-400"
                    >
                      No stores found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex items-center gap-4">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Prev
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Next
              </button>
              <select
                value={storesPerPage}
                onChange={(e) => {
                  setStoresPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="border px-2 py-1 rounded"
              >
                {[5, 10, 20].map((n) => (
                  <option key={n} value={n}>
                    {n} per page
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminStoresList;
