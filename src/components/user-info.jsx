import { LogOut, ShoppingBasket, User } from "lucide-react";

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
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate } from "react-router-dom";
import { logout } from "../redux/Slices/authSlice";
import Loader from "./loader";
// import {useToast} from "./ui/toast";

export function UserInfo() {
  const dispatch = useDispatch();
  const { user, isLoading } = useSelector((state) => state.auth);
  // const toast = useToast();
  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="flex items-center gap-2 bg-transparent border-none hover:bg-transparent">
          {isLoading ? (
            <Loader />
          ) : (
            <>
              <Avatar className="cursor-pointer">
                <AvatarImage
                  src={user.payload.imgSrc || "https://github.com/shadcn.png"}
                  alt="@img"
                />
                <AvatarFallback>
                  {user.payload.email.slice(4).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <p className="hidden md:block text-sm tracking-tight font-semibold text-gray-800">
                {user.payload.email}
              </p>
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 mt-1.5 ml-4">
        <DropdownMenuLabel>Mon Compte</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <User />
            <Link to={"/profile"}>Profile</Link>
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <ShoppingBasket />
            <Link to={"/products/orders"}>Panier</Link>
            <DropdownMenuShortcut>⇧⌘B</DropdownMenuShortcut>
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
