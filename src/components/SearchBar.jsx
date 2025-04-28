
import { useState } from "react";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";


export const SearchBar = () => {
  const [isFocused, setIsFocused] = useState(false);
  const [searchType, setSearchType] = useState("name");

  return (
    <div
      className={cn(
        "relative w-full max-w-2xl mx-auto transition-all duration-300",
        isFocused ? "scale-105" : ""
      )}
    >
      <div
        className={cn(
          "relative flex items-center bg-white rounded-full shadow-lg transition-all duration-300",
          isFocused ? "shadow-xl" : ""
        )}
      >
        <Search
          className="absolute left-4 w-5 h-5 text-secondary"
          aria-hidden="true"
        />
        <input
          type="text"
          placeholder={
            searchType === "name"
              ? "Rechercher une boutique par nom..."
              : "Rechercher une boutique par identifiant..."
          }
          className="w-full py-4 pl-12 pr-32 text-lg bg-transparent rounded-full outline-none focus:ring-0 text-secondary-foreground placeholder:text-secondary"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        <div className="absolute right-2">
          <Select
            value={searchType}
            onValueChange={(value) => setSearchType(value)}
          >
            <SelectTrigger className="w-24 border-0 focus:ring-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Nom</SelectItem>
              <SelectItem value="id">ID</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
