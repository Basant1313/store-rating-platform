import StoreOwnerLayout from "@/layouts/StoreOwnerLayout";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Star, Loader2 } from "lucide-react";

const StoreOwnerDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  const fetchDashboard = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/store/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to fetch dashboard");
      setDashboardData(data);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <StoreOwnerLayout>
        <div className="flex justify-center items-center h-60">
          <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
        </div>
      </StoreOwnerLayout>
    );
  }

  const { storeName, averageRating, ratings } = dashboardData || {};

  return (
    <StoreOwnerLayout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
          🏪 {storeName} - Dashboard
        </h1>

        {/* ⭐ Average Rating Card */}
        <div className="mb-6">
          <div className="bg-yellow-100 dark:bg-yellow-900 p-6 rounded-xl flex items-center gap-4 shadow">
            <Star className="text-yellow-500 w-8 h-8" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Average Rating</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {averageRating || "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* 👥 Users Who Rated */}
        <div className="overflow-x-auto rounded-md shadow border dark:border-gray-700">
          <table className="min-w-full text-sm bg-white dark:bg-gray-900">
            <thead className="bg-gray-100 dark:bg-gray-800 text-left text-gray-700 dark:text-gray-300">
              <tr>
                <th className="py-3 px-4">User Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Rating</th>
              </tr>
            </thead>
            <tbody>
              {ratings.length > 0 ? (
                ratings.map((user, index) => (
                  <tr key={index} className="border-t dark:border-gray-800 text-gray-800 dark:text-gray-200">
                    <td className="py-2 px-4">{user.user_name}</td>
                    <td className="py-2 px-4">{user.email}</td>
                    <td className="py-2 px-4 font-semibold">{user.rating} ⭐</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="text-center py-6 text-gray-500 dark:text-gray-400">
                    No ratings found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </StoreOwnerLayout>
  );
};

export default StoreOwnerDashboard;
