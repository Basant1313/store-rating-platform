import { Home, Users, Store, Star, PlusSquare, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Link, useLocation } from "react-router-dom";

const menuItems = [
  { label: "Dashboard", icon: <Home size={18} />, path: "/admin/dashboard" },
  { label: "Users", icon: <Users size={18} />, path: "/admin/users" },
  { label: "Add User", icon: <PlusSquare size={18} />, path: "/admin/users/add" },
  { label: "Stores", icon: <Store size={18} />, path: "/admin/stores" },
  { label: "Add Store", icon: <PlusSquare size={18} />, path: "/admin/stores/add" },
//   { label: "Ratings", icon: <Star size={18} />, path: "/admin/ratings" },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    
  <aside className="w-full sm:w-64 h-screen bg-white dark:bg-gray-900 shadow-md flex flex-col px-4 py-6">
  <div className="flex flex-col min-h-[90%] justify-between">
    <div>
      <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">Admin Panel</h2>

      <nav className="space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.label}
            to={item.path}
            className={`flex items-center gap-3 px-3 py-2 rounded-md transition font-medium ${
              location.pathname === item.path
                ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-white"
                : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            }`}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </nav>
    </div>

    <div className="mt-4">
      <Separator className="my-2" />

      <Button
        variant="outline"
        className="w-full flex items-center gap-2 justify-center"
        onClick={() => {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.dispatchEvent(new Event("storage"));
          window.location.href = "/login";
        }}
      >
        <LogOut size={16} />
        Logout
      </Button>
    </div>
  </div>
</aside>

  );
};

export default Sidebar;
