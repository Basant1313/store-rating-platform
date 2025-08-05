import AdminLayout from "@/layouts/AdminLayout";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const AdminUsersList = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filters, setFilters] = useState({
    name: "",
    email: "",
    address: "",
    role: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(5);
  const token = localStorage.getItem("token");

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("http://localhost:5000/api/admin/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch users");

      const filtered = data.filter(
        (u) => u.role === "user" || u.role === "admin" || u.role === "store_owner"
      );

      setAllUsers(filtered);
      setFilteredUsers(filtered);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let results = allUsers;

    if (filters.name.trim())
      results = results.filter((u) =>
        u.name.toLowerCase().includes(filters.name.toLowerCase())
      );

    if (filters.email.trim())
      results = results.filter((u) =>
        u.email.toLowerCase().includes(filters.email.toLowerCase())
      );

    if (filters.address.trim())
      results = results.filter((u) =>
        u.address.toLowerCase().includes(filters.address.toLowerCase())
      );

    if (filters.role)
      results = results.filter((u) => u.role === filters.role);

    setFilteredUsers(results);
  };

  const handleChange = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    applyFilters();
    setCurrentPage(1);
  }, [filters]);

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
          👥 Admin & User List
        </h1>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <input
            type="text"
            name="name"
            placeholder="Filter by Name"
            onChange={handleChange}
            className="px-4 py-2 border rounded-md dark:bg-gray-800 dark:text-white text-sm"
          />
          <input
            type="text"
            name="email"
            placeholder="Filter by Email"
            onChange={handleChange}
            className="px-4 py-2 border rounded-md dark:bg-gray-800 dark:text-white text-sm"
          />
          <input
            type="text"
            name="address"
            placeholder="Filter by Address"
            onChange={handleChange}
            className="px-4 py-2 border rounded-md dark:bg-gray-800 dark:text-white text-sm"
          />
          <select
            name="role"
            onChange={handleChange}
            className="px-4 py-2 border rounded-md dark:bg-gray-800 dark:text-white text-sm"
          >
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="user">Normal User</option>
            <option value="store_owner">Store Owner</option>
          </select>
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-opacity-50"></div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto rounded-lg shadow border border-gray-200 dark:border-gray-800">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      Address
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      Rating
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-100 dark:divide-gray-800">
                  {currentUsers.length > 0 ? (
                    currentUsers.map((user) => (
                      <tr
                        key={user.id}
                        className="hover:bg-blue-50 dark:hover:bg-gray-800 transition"
                      >
                        <td className="px-6 py-4 text-sm font-medium text-gray-800 dark:text-white">
                          {user.name}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                          {user.address}
                        </td>
                        <td className="px-6 py-4 text-sm text-blue-600 dark:text-blue-400 capitalize">
                          {user.role}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                          {user.role === "store_owner"
                            ? user.rating ?? "N/A"
                            : "—"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="text-center py-6 text-gray-500 dark:text-gray-400"
                      >
                        No users found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center mt-6 flex-wrap gap-4">
                {/* Rows per page */}
                <div className="flex items-center gap-2 text-sm">
                  <span>Rows per page:</span>
                  <select
                    value={usersPerPage}
                    onChange={(e) => {
                      setUsersPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="border rounded px-2 py-1 dark:bg-gray-800 dark:text-white"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                  </select>
                </div>

                {/* Page numbers with Prev/Next */}
                <div className="flex items-center gap-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                    className={`px-3 py-1 rounded-md text-sm ${
                      currentPage === 1
                        ? "bg-gray-200 text-gray-400 dark:bg-gray-800 dark:text-gray-600 cursor-not-allowed"
                        : "bg-gray-100 hover:bg-blue-100 dark:bg-gray-700 dark:text-white"
                    }`}
                  >
                    Prev
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-3 py-1 rounded-md text-sm ${
                        currentPage === i + 1
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 hover:bg-blue-100 dark:bg-gray-700 dark:text-white"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                    className={`px-3 py-1 rounded-md text-sm ${
                      currentPage === totalPages
                        ? "bg-gray-200 text-gray-400 dark:bg-gray-800 dark:text-gray-600 cursor-not-allowed"
                        : "bg-gray-100 hover:bg-blue-100 dark:bg-gray-700 dark:text-white"
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminUsersList;
