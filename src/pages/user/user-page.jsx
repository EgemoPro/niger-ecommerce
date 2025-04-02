import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink, Outlet, useLocation, Await, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ChevronDown } from "lucide-react";
import { Separator } from "../../components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { navItems } from "./sub-pages/navigation-items.js";
import Loader from "../../components/loader.jsx";

const CustomHeader = ({ srcImg, name, path }) => (
  <div className="h-full flex gap-2">
    <Avatar className="cursor-pointer">
      <AvatarImage src={srcImg || "https://github.com/shadcn.png"} alt="user@img" />
      <AvatarFallback className="text-xs">UserInfo</AvatarFallback>
    </Avatar>
    <h1 className="text-2xl capitalize">
      {name} <span className="text-gray-400"> / {path}</span>
    </h1>
  </div>
);

const MobileNav = ({ activePath, setPath }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleInteraction = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="md:hidden relative">
      <button 
        className="w-full flex items-center justify-between px-1 py-2 mb-1 mt-2 bg-white rounded-md "
        onClick={handleInteraction}
        onMouseEnter={handleInteraction}
      >
        <span className="text-gray-700 font-semibold">
          {activePath.name || "Menu"}
        </span>
        <ChevronDown 
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      <Separator/>
      <AnimatePresence>
        {isOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-full left-0 right-0 bg-gray-50 rounded-lg shadow-lg mt-0.5 overflow-hidden z-50"
            onMouseLeave={() => setIsOpen(false)}
          >
            <div className="p-2 flex flex-col gap-2">
              {navItems.map((item, index) => (
                <NavLink
                  key={index}
                  to={`/profile/${item.href}`}
                  className={({ isActive }) => 
                    isActive
                      ? "text-gray-700 font-semibold text-sm"
                      : "text-gray-400 hover:text-gray-700 text-sm"
                  }
                  onClick={() => {
                    setPath(item);
                    setIsOpen(false);
                  }}
                >
                  {item.name}
                </NavLink>
              ))}
              <Separator />
              <NavLink
                to="/profile/delete"
                className="text-red-500 hover:text-red-700 text-xs"
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
      className="w-full flex items-center justify-center bg-slate-200/15"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5 }}
    >
      <div className="container mx-auto min-h-screen px-4 md:px-32 lg:px-56 pt-20">
        <main className="min-h-screen md:grid grid-cols-1 md:grid-cols-6 grid-rows-12 md:grid-rows-12 gap-2">
          <div className="col-span-full row-span-1">
            <CustomHeader 
              name={user.payload.username}
              path={user.payload.srcImg}
            />
          </div>
          <div className="col-span-full md:col-span-1 row-span-1 md:row-span-6 max-md:gap-3">
            <MobileNav activePath={path} setPath={setPath} />

            <nav className="hidden md:flex flex-col gap-1 h-full">
              {navItems.map((item, index) => (
                <NavLink
                  key={index}
                  to={`/profile/${item.href}`}
                  className={({ isActive }) => {
                    if (isActive) {
                      setPath(item);
                      return "text-gray-700 font-semibold block hover:text-gray-300 text-sm";
                    }
                    return "text-gray-400 block hover:text-gray-700 text-sm";
                  }}
                >
                  {item.name}
                </NavLink>
              ))}
              <Separator />
              <NavLink
                to="/profile/delete"
                className="text-red-500 block hover:text-red-700 text-xs"
              >
                Delete Account
              </NavLink>
            </nav>
          </div>
          {/* content */}
          <div className="max-md:p-1 col-span-full md:col-span-5 row-span-10">
            <Await fallback={<Loader/>}>
              <Outlet />
            </Await>
          </div>
        </main>
      </div>
    </motion.div>
  );
};

export default UserPage;