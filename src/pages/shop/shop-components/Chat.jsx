
import { useParams } from "react-router-dom";
import { popularShops } from "@/components/PopularShops";
import { Send, Paperclip, Image as ImageIcon, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function ShopChat() {
  const { id } = useParams();
  const shop = popularShops.find((s) => s.id === id);
  const [message, setMessage] = useState("");

  if (!shop) return null;

  return (
    <div className="animate-fade-in h-[calc(100vh-200px)] flex flex-col">
      <div className="flex items-center gap-3 p-4 border-b">
        <div className="w-10 h-10 bg-gradient-to-br from-primary/10 to-purple-100 rounded-lg flex items-center justify-center">
          <Store className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-heading-3 font-semibold text-secondary-foreground tracking-tight">
            {shop.name}
          </h2>
          <p className="text-small font-medium text-secondary leading-relaxed">
            En ligne
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="flex justify-start">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl rounded-tl-none px-4 py-2.5 shadow-sm max-w-[80%]">
            <p className="text-body text-secondary-foreground leading-relaxed">
              Bonjour ! Comment puis-je vous aider ?
            </p>
            <span className="text-tiny text-secondary mt-1 block">
              10:30
            </span>
          </div>
        </div>
      </div>

      <div className="p-4 bg-white/50 backdrop-blur-sm border-t">
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            className="shrink-0 hover:bg-primary/5"
          >
            <Paperclip className="w-4 h-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="shrink-0 hover:bg-primary/5"
          >
            <ImageIcon className="w-4 h-4" />
          </Button>
          <input
            type="text"
            placeholder="Écrivez votre message..."
            className="flex-1 rounded-full px-4 py-2.5 bg-white border text-body placeholder:text-secondary/60 focus:outline-none focus:ring-2 focus:ring-primary/20"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button 
            size="icon" 
            className="shrink-0 bg-primary hover:bg-primary/90 transition-colors"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
