import AdminLayout from "@/layouts/AdminLayout";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Users, Store, Star } from "lucide-react";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStores: 0,
    totalRatings: 0,
  });

  const token = localStorage.getItem("token");

  const fetchStats = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load stats");

      setStats(data.data); // ✅ Important fix
    } catch (err) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white flex items-center gap-2">
          📊 Admin Dashboard
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
    <StatCard
  title="Total Users"
  value={stats.totalUsers}
  icon={<Users className="w-6 h-6 text-white" />}
  color={{ from: "from-blue-500", to: "to-blue-700" }}
/>

<StatCard
  title="Total Stores"
  value={stats.totalStores}
  icon={<Store className="w-6 h-6 text-white" />}
  color={{ from: "from-green-500", to: "to-green-700" }}
/>

<StatCard
  title="Total Ratings"
  value={stats.totalRatings}
  icon={<Star className="w-6 h-6 text-white" />}
  color={{ from: "from-yellow-400", to: "to-yellow-600" }}
/>

        </div>
      </div>
    </AdminLayout>
  );
};


const StatCard = ({ title, value, icon, color }) => (
  <div
    className="bg-white/30 dark:bg-white/5 backdrop-blur-md border border-white/20 dark:border-white/10 
    rounded-2xl shadow-lg hover:shadow-2xl transition duration-300 p-6 transform hover:scale-[1.02] group"
  >
    <div className="flex items-center gap-4">
      <div
        className={`p-4 rounded-full bg-gradient-to-tr ${color.from} ${color.to} shadow-md group-hover:scale-110 transition-transform duration-300`}
      >
        {icon}
      </div>
      <div>
        <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">{title}</h3>
        <p className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          {value}
        </p>
      </div>
    </div>
  </div>
);


export default AdminDashboard;
