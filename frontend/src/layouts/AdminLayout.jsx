import Sidebar from "@/components/admin/Sidebar";

const AdminLayout = ({ children }) => {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-6 bg-gray-50 dark:bg-gray-950 min-h-screen">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
