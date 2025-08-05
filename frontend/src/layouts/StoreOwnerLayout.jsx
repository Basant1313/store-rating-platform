

import StoreOwnerSidebar from "@/components/storeowner/OwnerSidebar";

const OwnerLayout = ({ children }) => {
  return (
    <div className="flex">
      <StoreOwnerSidebar />
      <main className="flex-1 p-6 bg-gray-50 dark:bg-gray-950 min-h-screen">
        {children}
      </main>
    </div>
  );
};

export default OwnerLayout;
