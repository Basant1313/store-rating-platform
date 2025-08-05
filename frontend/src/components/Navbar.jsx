import { useState, useEffect } from "react";
import { Link, useNavigate,useLocation } from "react-router-dom";
import { Menu, X, Moon, Sun, User } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState(null); // Simulate user from localStorage or auth
  const navigate = useNavigate();
  const location = useLocation();
  const role = JSON.parse(localStorage.getItem("user"))?.role;



  useEffect(() => {
  const localTheme = localStorage.getItem("theme");
  if (localTheme === "dark") {
    setDarkMode(true);
    document.documentElement.classList.add("dark");
  }

  const handleStorageChange = () => {
    const userData = localStorage.getItem("user");
    setUser(userData ? JSON.parse(userData) : null);
  };

  // Initial load
  handleStorageChange();

  // Listen to storage updates
  window.addEventListener("storage", handleStorageChange);

  return () => {
    window.removeEventListener("storage", handleStorageChange);
  };
}, [location]);


  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  const renderLinks = () => {
    if (!user) {
      return (
        <>
          <Link to="/login" className="nav-link">Login</Link>
          <Link to="/register" className="nav-link">Register</Link>
        </>
      );
    }

    if (user.role === "admin") {
      return (
        <>
          <Link to="/admin/dashboard" className="nav-link">Dashboard</Link>
        </>
      );
    }

    if (user.role === "store_owner") {
      return (
        <>
          <Link to="/owner/dashboard" className="nav-link">Dashboard</Link>
        </>
      );
    }

    return (
      <>
        <Link to="/" className="nav-link">Home</Link>
      </>
    );
  };

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md text-gray-800 dark:text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-bold tracking-tight">
            Store<span className="text-blue-500 dark:text-yellow-300">Rating</span>
          </Link>

          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {renderLinks()}
            {/* <button onClick={toggleDarkMode}>
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button> */}

            {user && (
  <div className="relative group">
    <div className="flex items-center space-x-1 cursor-pointer">
      <User size={20} />
      <span>{user.name?.split(" ")[0]}</span>
    </div>
    <div
      className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded shadow-md opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-200 z-50"
      onMouseEnter={() => {}}
      onMouseLeave={() => {}}
    >
      <button
        onClick={logout}
        className="block w-full text-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        Logout
      </button>
      {role === "user" && (
  <Link to="/user/change-password" className="block w-full text-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
    Change Password
  </Link>
)}


    </div>
  </div>
)}


          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden flex flex-col space-y-2 mt-2 pb-3">
            {renderLinks()}
            <button onClick={toggleDarkMode}>
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            {user && (
              <button onClick={logout} className="nav-link">
                Logout
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
