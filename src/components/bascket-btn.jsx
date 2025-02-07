import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ShoppingCart, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"


export function BasketBtn({ onAddToCart, basketCount }) {
  const [isAdding, setIsAdding] = useState(false)
  const [isAdded, setIsAdded] = useState(false)

  const handleAddToCart = async () => {
    setIsAdding(true)
    await onAddToCart()
    setIsAdding(false)
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
  }

  return (
    <Button
      onClick={handleAddToCart}
      disabled={isAdding}
      className={cn(
        "relative overflow-hidden h-full w-full md:w-auto max-md:rounded-none",
        isAdded ? "bg-green-500/80 hover:bg-green-600/90" : "bg-blue-600 hover:bg-blue-700",
      )}
    >
      <AnimatePresence mode="wait">
        {isAdding ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center gap-2"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1, ease: "linear" }}
            >
              <ShoppingCart size={18} />
            </motion.div>
            <span>Ajout en cours...</span>
          </motion.div>
        ) : isAdded ? (
          <motion.div
            key="added"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex items-center justify-center gap-2"
          >
            <Check size={18} />
            <span>Ajouté au panier</span>
          </motion.div>
        ) : (
          <motion.div
            key="default"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center gap-2"
          >
            <div className="relative">
              <ShoppingCart size={18} />
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="absolute -top-2 -right-2 bg-white text-blue-600 rounded-full h-4 w-4 flex items-center justify-center text-xs font-bold"
              >
                {basketCount}
              </motion.div>
            </div>
            <span>Ajouter au panier</span>
          </motion.div>
        )}
      </AnimatePresence>
    </Button>
  )
}

