import { motion } from "framer-motion";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  NavLink,
  Outlet,
  useLocation,
  Navigate,
  Await,
} from "react-router-dom";
import { Separator } from "../../components/ui/separator";
import { navItems } from "./sub-pages/navigation-items.js";
import { Accordion } from "../../components/ui/accordion";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";

const CustomHeader = ({ imgSrc, name, path }) => (
  <div className="h-full flex gap-2">
    <Avatar className="cursor-pointer">
      <AvatarImage
        src={imgSrc || "https://github.com/shadcn.png"}
        alt="user@img"
      />
      <AvatarFallback className="text-xs">UserInfo</AvatarFallback>
    </Avatar>
    <h1 className="text-2xl capitalize">{name} <span className="text-gray-400"> / {path}</span> </h1>
  </div>
);

const UserPage = () => {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();
  const [path, setPath] = useState({
    name:"",
    href:""
  });
  // const path = location.pathname.split("/")[2];
  // console.log(location.pathname.split("/")[2]); 

  if (user === null) return <Navigate to="/" />;
  if (location?.pathname === "/profile")
    return <Navigate to="/profile/general" />;

  return (
    <motion.div
      className="w-full h-screen flex items-center justify-center bg-slate-200/15"
      initial={{
        opacity: 0,
      }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5 }}
    >
      <div className="container mx-auto h-[90%] px-4 md:px-72 py-10">
        <main className="h-full grid grid-cols-1 md:grid-cols-6 grid-rows-12 md:grid-rows-12 gap-2">
          <div className="col-span-full row-span-1">
            <CustomHeader name={user.payload.email.split("@")[0]} 
              path={path.name}
            />
          </div>

          <div className="col-span-full md:col-span-1 row-span-1 md:row-span-6">
            <nav className="flex flex-col gap-1 h-full">
              {navItems.map((item, index) => (
                <NavLink
                  key={index}
                  to={`/profile/${item.href}`}
                  className={({ isActive }, location) => {

                    if (!isActive) {
                      console.log(isActive);
                      return `text-gray-400 block hover:text-gray-700 text-sm`;
                    } else{
                      setPath(item)
                      return `text-gray-700 font-semibold block hover:text-gray-300 text-sm`};
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

          <div className="col-span-full md:col-span-5 row-span-10">
            <Await fallback={<div>Loading...</div>}>
              <Outlet />
            </Await>
          </div>
        </main>
      </div>
    </motion.div>
  );
};

export default UserPage;
