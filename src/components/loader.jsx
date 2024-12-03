import { Loader2 } from "lucide-react";
import PropTypes from 'prop-types';
import { cn } from "@/lib/utils";

const Loader = ({ className, ...props }) => {
  return (
    <Loader2 
      className={cn("h-4 w-4 animate-spin", className)} 
      {...props}
    />
  );
};

Loader.propTypes = {
  className: PropTypes.string
};

export default Loader;
