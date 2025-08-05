// src/components/owner/OwnerSidebar.jsx

import { Home, Key, LogOut } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

const menuItems = [
  { label: "Dashboard", icon: <Home size={18} />, path: "/owner/dashboard" },
  { label: "Change Password", icon: <Key size={18} />, path: "/owner/change-password" },
];

const StoreOwnerSidebar = () => {
  const location = useLocation();

  return (
    <aside className="w-full sm:w-64 h-screen bg-white dark:bg-gray-900 shadow-md flex flex-col px-4 py-6">
          <div className="flex flex-col min-h-[90%] justify-between">
            <div>
      <h2 className="text-2xl font-bold text-center text-green-600 mb-8">Owner Panel</h2>

      <nav className="space-y-2 flex-1">
        {menuItems.map((item) => (
          <Link
            key={item.label}
            to={item.path}
            className={`flex items-center gap-3 px-3 py-2 rounded-md transition font-medium ${
              location.pathname === item.path
                ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-white"
                : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            }`}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </nav>
        </div>
      <Separator className="my-4" />

      <Button
        variant="outline"
        className="w-full flex items-center gap-2 justify-center"
       onClick={() => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.dispatchEvent(new Event("storage")); // 🔥 Notify others
  window.location.href = "/login";
}}

      >
        <LogOut size={16} />
        Logout
      </Button>
      </div>
    </aside>
  );
};

export default StoreOwnerSidebar;
