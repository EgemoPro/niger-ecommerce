
import { Home, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";


export const PageNavigation = ({ title }) => {
  const navigate = useNavigate();

  return (
    <div className="fixed top-0 left-0 right-0 bg-red-500/95 backdrop-blur-sm z-50">
      <div className="max-w-[1200px] mx-auto">
        <div className="border-b border-secondary/10">
          <div className="flex items-center justify-between px-4 py-2">
            <div className="flex items-center gap-4">
              <Link to="/" className="hover:text-primary transition-colors duration-300">
                <Home className="w-6 h-6" />
              </Link>
              <button 
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-secondary hover:text-primary transition-colors duration-300"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="text-small font-medium hidden sm:inline">Retour</span>
              </button>
            </div>
            {title && (
              <div className="text-small font-medium text-secondary">
                {title}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
