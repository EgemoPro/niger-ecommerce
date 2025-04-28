
import { Link } from "react-router-dom";

export const ShopTabs = ({ tabs, shopId, currentTab, className }) => {
  return (
    <div className={`border-b overflow-x-auto bg-white/95 backdrop-blur-sm sticky top-[56px] z-20 transition-all duration-300 ${className}`}>
      <div className="flex items-center gap-4 px-4">
        <nav className="flex gap-2 min-w-max">
          {tabs.map((tab) => (
            <Link
              key={tab.path}
              to={`/shop/${shopId}/${tab.path}`}
              className={`relative py-4 px-4 text-body transition-colors duration-300 ${
                currentTab === tab.path ? "text-primary" : "text-secondary hover:text-secondary-foreground"
              }`}
            >
              {tab.label}
              {currentTab === tab.path && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-md animate-fade-in" />
              )}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};
