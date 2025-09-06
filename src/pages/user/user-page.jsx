import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink, Outlet, useLocation, Await, Navigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { ChevronDown, Home } from "lucide-react";
import { Separator } from "../../components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { navItems } from "./sub-pages/navigation-items.js";
import Loader from "../../components/loader.jsx";

const CustomHeader = ({ srcImg, name, path }) => (
  <div className="flex items-center gap-3 sm:gap-4 p-4 sm:p-6 lg:p-8">
    <Avatar className="cursor-pointer w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14">
      <AvatarImage src={srcImg || "https://github.com/shadcn.png"} alt="user@img" />
      <AvatarFallback className="text-xs sm:text-sm">UI</AvatarFallback>
    </Avatar>
    <div className="flex-1 min-w-0">
      <h1 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-semibold capitalize truncate">
        {name}
      </h1>
      <p className="text-xs sm:text-sm text-gray-500 truncate">
        Profile / {path}
      </p>
    </div>
    <div>

      <Link to={"/"} className="flex items-center gap-2 border-b p-1 px-2 text-lg text-gray-500 hover:text-gray-950 duration-150">
        <Home size={18} />
        Home
      </Link>
      
    </div>
  </div>
);

const MobileNav = ({ activePath, setPath }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleInteraction = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="lg:hidden relative mx-4 sm:mx-6">
      <button
        className="w-full flex items-center justify-between px-4 py-3 bg-white rounded-lg shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors"
        onClick={handleInteraction}
        onMouseEnter={handleInteraction}
      >
        <span className="text-gray-700 font-medium text-sm sm:text-base">
          {activePath.name || "Navigation"}
        </span>
        <ChevronDown
          className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-full left-0 right-0 bg-white rounded-lg shadow-lg border border-gray-200 mt-2 overflow-hidden z-50"
            onMouseLeave={() => setIsOpen(false)}
          >
            <div className="p-3">
              {navItems.map((item, index) => (
                <NavLink
                  key={index}
                  to={`/profile/${item.href}`}
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-md text-sm transition-colors ${isActive
                      ? "text-gray-900 bg-gray-100 font-medium"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`
                  }
                  onClick={() => {
                    setPath(item);
                    setIsOpen(false);
                  }}
                >
                  {item.name}
                </NavLink>
              ))}
              <Separator className="my-2" />
              <NavLink
                to="/profile/delete"
                className="block px-3 py-2 rounded-md text-sm text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
              >
                Delete Account
              </NavLink>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </div>
  );
};

const UserPage = () => {
  const { user, isLoading } = useSelector((state) => state.auth);
  const location = useLocation();
  const [path, setPath] = useState({
    name: "",
    href: ""
  });

  if (user === null && !isLoading) return <Navigate to="/" />;
  if (location?.pathname === "/profile")
    return <Navigate to="/profile/general" />;

  return (
    <motion.div
      className="w-full min-h-screen bg-gray-50/50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="w-full max-w-7xl mx-auto min-h-screen">
        <main className="min-h-screen flex flex-col">
          {/* Header Section */}
          <div className="flex-shrink-0 bg-white border-b border-gray-200">
            <CustomHeader
              name={user.payload.username}
              path={path.name || "Profile"}
            />
          </div>

          {/* Mobile Navigation */}
          <div className="flex-shrink-0 lg:hidden py-4 bg-white border-b border-gray-100">
            <MobileNav activePath={path} setPath={setPath} />
          </div>

          {/* Main Content Section */}
          <div className="flex-1 flex">
            {/* Desktop Navigation Sidebar */}
            <aside className="hidden lg:flex flex-col w-64 xl:w-72 bg-white border-r border-gray-200">
              <div className="flex-1 px-6 py-8">
                <nav className="space-y-2">
                  {navItems.map((item, index) => (
                    <NavLink
                      key={index}
                      to={`/profile/${item.href}`}
                      className={({ isActive }) => {
                        if (isActive) {
                          setPath(item);
                          return "flex items-center px-4 py-3 text-sm font-medium text-gray-900 bg-gray-100 rounded-lg transition-colors";
                        }
                        return "flex items-center px-4 py-3 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors";
                      }}
                    >
                      {item.name}
                    </NavLink>
                  ))}
                </nav>

                <Separator className="my-6" />

                <NavLink
                  to="/profile/delete"
                  className="flex items-center px-4 py-3 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                >
                  Delete Account
                </NavLink>
              </div>
            </aside>

            {/* Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
              <div className="flex-1 p-4 sm:p-6 lg:p-8 xl:p-12">
                <div className="w-full max-w-4xl mx-auto">
                  <Await fallback={
                    <div className="flex items-center justify-center py-12">
                      <Loader />
                    </div>
                  }>
                    <Outlet />
                  </Await>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </motion.div>
  );
};

export default UserPage;