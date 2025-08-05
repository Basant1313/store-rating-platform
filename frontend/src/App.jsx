import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PrivateRoute from "./components/PrivateRoute";
import AdminDashboard from "./pages/Dashboard/AdminDashboard";
import StoreOwnerDashboard from "./pages/Dashboard/StoreOwnerDashboard";
import UserDashboard from "./pages/Dashboard/UserDashboard";
import StoreList from "./pages/StoreList";
import Navbar from "./components/Navbar";


import AdminUsersList from "@/pages/admin/AdminUsersList";
import AdminStoresList from "./pages/admin/AdminStoresList";
import AdminAddUser from "./pages/admin/AdminAddUser";
import AdminAddStore from "./pages/admin/AdminAddStore";
import StoreUpdatePassword from "./pages/storeowner/StoreOwnerUpdatePassword";
import UserUpdatePassword from "./pages/UserUpdatePassword";


function App() {
  return (
<>
 
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />


        {/* Protected Route for Normal User */}
         <Route element={<PrivateRoute allowedRoles={["user"]} />}>
          <Route path="/" element={<StoreList />} />
          {/* <Route path="/user/dashboard" element={<UserDashboard />} /> */}
          <Route path="/user/change-password" element={<UserUpdatePassword />} />
          
        </Route>

           {/* Protected Route for Admin */}
           <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsersList />} />
          <Route path="/admin/stores" element={<AdminStoresList />} />
          <Route path="/admin/users/add" element={<AdminAddUser />} />
          <Route path="/admin/stores/add" element={<AdminAddStore />} />
        </Route>

        {/* Protected Route for Store Owner */}
        <Route element={<PrivateRoute allowedRoles={["store_owner"]} />}>
          <Route path="/owner/dashboard" element={<StoreOwnerDashboard />} />
          <Route path="/owner/change-password" element={<StoreUpdatePassword />} />
        </Route>

         {/* <Route element={<PrivateRoute allowedRoles={["user"]} />}>
          <Route path="/user/dashboard" element={<UserDashboard />} />
        </Route> */}

      </Routes>
    </Router>
    </>
  );
}

export default App;
