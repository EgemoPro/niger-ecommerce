import React, { useEffect, useState } from "react";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "../../lib/utils";
import { useSelector } from "react-redux";


const ProductGridHeader = () => {
  const [isVisible, setIsVisible] = useState(false);
  const {
    productPage: { content },
  } = useSelector((state) => state.settings);
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
  }, [content]);

  return (
    <CardHeader
      className={cn(
        "h-10 mx-0  flex flex-row sm:flex-row justify-between w-full  items-center"
      )}
    >
      <CardTitle className="flex items-center justify-between gap-2  text-lg text-[#2563eb]">
        <Link to={`/`} className="flex items-center gap-2 text-[#2563eb] ">
          <ChevronLeft className="bg-black/5 rounded-sm hover:bg-black/10 ease-in-out duration-75" />
          <span>Product</span>
        </Link>
      </CardTitle>
    </CardHeader>
  );
};

export default ProductGridHeader;
