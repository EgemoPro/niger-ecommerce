import React from "react";
import { Share2, Facebook, Twitter, Linkedin } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
} from "react-share";
import { Button } from "./ui/button";


const SharePopover = () => {
  
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="text-gray-500 hover:text-gray-700 transition-all duration-300  transform hover:scale-110 active:scale-95">
          <Share2 size={16} />
        </button>
      </PopoverTrigger>
      <PopoverContent className="flex flex-col w-32 p-0 gap-1">
        <FacebookShareButton url={window.location.href}>
          <Button className="flex items-center bg-transparent space-x-2 text-black-600 hover:text-black-700">
            <Facebook size={20} />
            <span>Facebook</span>
          </Button>
        </FacebookShareButton>
        <TwitterShareButton url={window.location.href}>
          <Button className="flex items-center bg-transparent space-x-2 text-black-600 hover:text-black-700">
            <Twitter size={20} />
            <span>Twitter</span>
          </Button>
        </TwitterShareButton>
        <LinkedinShareButton url={window.location.href}>
          <Button className="flex items-center bg-transparent space-x-2 text-black-600 hover:text-black-700">
            <Linkedin size={20} />
            <span>LinkedIn</span>
          </Button>
        </LinkedinShareButton>
      </PopoverContent>
    </Popover>
  );
};

export default SharePopover;