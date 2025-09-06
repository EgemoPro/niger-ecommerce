import {
  Ellipsis,
  Maximize2,
  Minimize2
} from "lucide-react"
import SharePopover from "./SharePopover";

const ImageActions = ({ Buttons, toggleFullScreen, isFullScreen }) => {
  return (
    <div className="absolute flex gap-3 w-auto z-50 right-2 top-2 p-2">
      {/* Animated Dropdown Actions */}
      <div className="relative group">
        <button
          className="bg-[#f9f9f9f9] rounded-md flex items-center justify-center px-2 py-2 shadow-md hover:shadow-lg transition-all duration-300"
        >
          <Ellipsis size={18} className="text-gray-600 group-hover:rotate-90 transition-transform duration-300" />
        </button>
        <div
          className="absolute right-0 mt-1 min-w-max  bg-rose-500  border-none rounded-md shadow-lg opacity-0 group-hover:opacity-100 group-hover:translate-y-0 -translate-y-2 pointer-events-none group-hover:pointer-events-auto transition-all duration-300 flex gap-1 py-2 px-2 z-50"
        >
          {Buttons.map(({ Title, Icon, onClick }) => (
            <button
              key={Title}
              onClick={onClick}
              className="flex items-center gap-2 text-white hover:text-blue-600 hover:bg-gray-100 rounded p-1 transition-all duration-200 scale-100 hover:scale-110"
              title={Title}
            >
              <Icon size={16} />
            </button>
          ))}
        </div>
      </div>

      {/* Fullscreen Toggle */}
      <button
        onClick={toggleFullScreen}
        className="bg-[#f9f9f9f9] rounded-md text-gray-500 hover:text-blue-600 hover:bg-gray-100 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 p-2"
        title={isFullScreen ? "Quitter le plein écran" : "Plein écran"}
      >
        {isFullScreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
      </button>
      <SharePopover />
    </div>
  );
};

export default ImageActions;