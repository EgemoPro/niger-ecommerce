import { BellDot, LogOut, MessageCircle, MessageSquare, ShoppingBasket, SquareCheckBig, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  //   DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  //   DropdownMenuSub,
  //   DropdownMenuSubContent,
  //   DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import { Link, } from "react-router-dom";
import { logout } from "../../redux/Slices/authSlice";
import Loader from "../loader";
// import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useEffect } from "react";

export function UserInfo() {
  const dispatch = useDispatch();
  const { user, isLoading, token } = useSelector((state) => state.auth);
  const bascketLength = useSelector((state) => state.basket.items.length);
  const messageLength = useSelector((state) => state.message?.length || 0);
  const notifications = useSelector(state => state.notifications)

  useEffect(() => {
    if ((user != null && Object.keys(user.payload).length > 1) && !!token) {
      toast.success("Vous êtes connecté", {
        duration: 5000,
        icon: <SquareCheckBig className="h-4 w-4" />,
        className: "bg-green-50 text-green-600 border border-green-200",
        action: {
          label: "Fermer",
          onClick: () => {
            toast.dismiss()
          }
        }
      });
    }
  }, [user])

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="flex items-center gap-2 bg-transparent border-none hover:bg-transparent outline-transparent outline-none focus:outline-none focus:ring-0">
          {isLoading ? (
            <Loader />
          ) : user != null ? (
            <>
              <Avatar className="cursor-pointer">
                <AvatarImage
                  src={user.payload.imgSrc || "https://github.com/shadcn.png"}
                  alt="@img"
                />
                <AvatarFallback>
                  {user.payload.email.split("@")[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >

                <Badge disabled={true} className={"absolute bg-pink-500 max-md:hidden -translate-x-5 translate-y-2 gap-1.5 transition-all duration-300"} >
                  <div
                    className="flex items-center gap-0.5  text-white"
                  >
                    <BellDot size={15} />
                    <span className="text-md text-white">{}</span>

                  </div>

                  <div
                    className="flex items-center gap-1  text-white"
                  >
                    <ShoppingBasket size={15} />
                    <span className="text-md text-white">{bascketLength}</span>

                  </div>
                  <div
                    className="flex items-center gap-0.5 text-white"
                  >
                    {messageLength > 0 ? (<>
                      <MessageSquare size={15} />
                      <span className="text-md text-white">{messageLength}</span>
                    </>) : null}
                  </div>

                </Badge>
              </motion.div>
              <p className="hidden md:block text-sm tracking-tight font-semibold text-gray-800">
                {user.payload.email.slice(0, 3).toUpperCase()}
              </p>
            </>
          ) : null}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 mt-1.5 mr-3">
        <DropdownMenuLabel>Mon Compte</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <User />
            <Link to={"/profile"}>Profile</Link>
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
           <DropdownMenuItem>
            <BellDot />
            <Link to={"/profile/notifications"}>Notifications</Link>
            <DropdownMenuShortcut>⇧⌘N</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <ShoppingBasket />
            <Link to={"/products/orders"}>Panier</Link>
            <DropdownMenuShortcut className={"gap-2"}> <Badge className="bg-blue-500 hover:bg-blue-700" >{bascketLength} </Badge>  ⇧⌘B</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <MessageCircle />
            <Link to={"/chat"}>Messagerie</Link>
            <DropdownMenuShortcut className={"gap-2"}> {messageLength > 0 && <Badge className="bg-green-500 hover:bg-green-700" >{messageLength} </Badge>}  ⇧⌘M</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut />
          <span>Déconnection</span>
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
