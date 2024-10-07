import React from "react";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";

const ProductGridHeader = () => (
  <CardHeader className="flex flex-row sm:flex-row justify-between sm:w-full  items-center py-2 pb-0">
    <CardTitle className="flex items-center justify-between gap-2  text-lg text-[#2563eb]">
      <Link
        to={`/`}
        className="text-[#2563eb] bg-black/5 rounded-sm hover:bg-black/10 ease-in-out duration-75 "
      >
        <ChevronLeft />
      </Link>
      Product
    </CardTitle>
  </CardHeader>
);

export default ProductGridHeader;
