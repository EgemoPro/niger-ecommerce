import React, { useEffect, useState } from "react";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { BotIcon, ChevronLeft, StoreIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "../../lib/utils";
import { useDispatch, useSelector } from "react-redux";
import AuthBtn from "../auth/auth-btn";
import {UserInfo} from "../auth/user-info";
import { checkAuth } from "../../redux/Slices/authSlice";



const ProductGridHeader = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const dispatch = useDispatch(); 
  const {
    productPage: { content },
  } = useSelector((state) => state.settings);

  const {user, isLoading} = useSelector((state) => state.auth);

  useEffect(() => {
    if(user != null && Object.keys(user.payload).length > 1){
      setIsAuthenticated(true)
    }else{
      setIsAuthenticated(false)
      dispatch(checkAuth())
    }

  }, [user, isLoading, dispatch])


  /**
   * scrollTop + scrollHeight = clientHeight
  */
 useEffect(() => {
   
    if (
      content.scroll.option.scrollTop + content.scroll.option.clientHeight >=
      content.scroll.option.scrollHeight - 45
    ) {
      // console.log("hello bro", isVisible);
      setIsVisible(!isVisible)
    }
  }, [content, isVisible]);

  return (
    <CardHeader
      className={cn(
        "h-10 mx-0  flex flex-row sm:flex-row justify-between w-full  items-center"
      )}
    >
      <CardTitle className="w-full flex items-center justify-between gap-2  text-lg">
        <Link to={`/`} className="flex items-center gap-2 text-[#2563eb] ">
          <ChevronLeft className="bg-black/5 rounded-sm hover:bg-black/10 ease-in-out duration-75" />
          <span>Product</span>
        </Link>
        <div className="flex items-center h-auto p-1 gap-2 max-md:gap-1">
          <Link to={`/shop`} className="flex items-center h-auto p-1 gap-2" >
            <BotIcon size={29} />  <span  className="max-md:hidden">Assistant</span>
          </Link>
          <Link to={`/shop`} className="flex items-center h-auto p-1 gap-2" >
            <StoreIcon size={20} /> <span className="max-md:hidden">Boutique</span>
          </Link>
          {isAuthenticated == false ? <AuthBtn/>: <UserInfo/>}
        </div>
      </CardTitle>
    </CardHeader>
  );
};

export default ProductGridHeader;
