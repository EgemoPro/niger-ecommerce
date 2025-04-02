import React from "react";
import { Share2, Facebook, Twitter, Linkedin, } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";

import { Button } from "./ui/button";


const SharePopover = () => {
  
  return (
    <Popover>
      <PopoverTrigger>
        <Share2 size={18}/>
      </PopoverTrigger>
      <PopoverContent>
        
      </PopoverContent>
    </Popover>
  );
};

export default SharePopover;