import React from "react";
import {
  Share2,
  Facebook,
  Twitter,
  Linkedin,
} from "lucide-react";

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

const SharePopover = () => {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <button className="text-gray-500 hover:text-gray-700 transition-all duration-300  transform hover:scale-110 active:scale-95">
            <Share2 size={16} />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-48 p-2">
          <div className="flex flex-col space-y-2">
            <FacebookShareButton url={window.location.href}>
              <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-800">
                <Facebook size={20} />
                <span>Facebook</span>
              </button>
            </FacebookShareButton>
            <TwitterShareButton url={window.location.href}>
              <button className="flex items-center space-x-2 text-blue-400 hover:text-blue-600">
                <Twitter size={20} />
                <span>Twitter</span>
              </button>
            </TwitterShareButton>
            <LinkedinShareButton url={window.location.href}>
              <button className="flex items-center space-x-2 text-blue-700 hover:text-blue-900">
                <Linkedin size={20} />
                <span>LinkedIn</span>
              </button>
            </LinkedinShareButton>
          </div>
        </PopoverContent>
      </Popover>
    );
  };

export default SharePopover;