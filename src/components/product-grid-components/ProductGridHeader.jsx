import React from "react";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";

const ProductGridHeader = () => (
  <CardHeader className="flex flex-row sm:flex-row justify-between sm:w-full  items-center p-0 h-10 ">
    <CardTitle className="flex items-center justify-between gap-2  text-lg text-[#2563eb]">
      <Link to={`/`} className="flex items-center gap-2 text-[#2563eb]  p-2">
        <ChevronLeft className="bg-black/5 rounded-sm hover:bg-black/10 ease-in-out duration-75" />
        <span>Product</span>
      </Link>
    </CardTitle>
  </CardHeader>
);

export default ProductGridHeader;
