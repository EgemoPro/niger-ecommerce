import { Share2, Facebook, Twitter, Linkedin, } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";


const items = [
  {
    label: "Facebook",
    btnIcon: <Facebook size={24} />
  }
]

const ShareButton = ({ label, btnIcon }) => (
  <span
    className = {"flex items-start w-full text-gray-500 bg-red-500 hover:text-gray-900 justify-center gap-2 bg-transparent"}
  >
    {btnIcon}
    {label}
  </span>)

const SharePopover = () => {

  return (
    <Popover>
      <PopoverTrigger>
        <Share2 size={18} />
      </PopoverTrigger>
      <PopoverContent>
        {items.map(item=> (
          <ShareButton {...item }/>
        ))}
      </PopoverContent>
    </Popover>
  );
};

export default SharePopover;