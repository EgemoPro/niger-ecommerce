import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent, 
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy, CreditCard, ShoppingBag, CheckCircle, Phone, Clock, MessageCircle, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import generateQRCode from "../utils/generateQrCode";
import generateCode from "../utils/generateCode";

const OrderPopup = ({ isOpen, onClose }) => {
  const [codeValue, setCodeValue] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  
    const handleCopy = ()=> null
    const handleOrder = ()=> null

  // Steps data
  const steps = [
    {
      icon: <Copy className="h-8 w-8 text-blue-600" />,
      title: "1. Copiez votre code",
      content: (
        <div className="flex items-center space-x-2 bg-gray-50 p-2 rounded w-full">
          <code className="flex-grow text-center text-sm font-mono">{codeValue}</code>
          <Button size="sm" variant="ghost" onClick={handleCopy}>
            {isCopied ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
      )
    },
    {
      icon: <Send className="h-8 w-8 text-green-600" />,
      title: "2. Cliquez sur Commander",
      content: <p className="text-sm text-gray-600">Utilisez le bouton ci-dessous pour lancer la commande</p>
    },
    {
      icon: <MessageCircle className="h-8 w-8 text-yellow-600" />,
      title: "3. Envoyez le code sur WhatsApp",
      content: <p className="text-xs text-gray-500">+227 88783406</p>
    },
    {
      icon: <Clock className="h-8 w-8 text-purple-600" />,
      title: "4. Attendez la confirmation",
      content: <p className="text-xs text-gray-500">Délai max: 30 min</p>
    }
  ];
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] max-w-[95%] bg-gradient-to-br from-slate-50 to-gray-100 text-gray-900 rounded-xl shadow-2xl">
        <DialogHeader className="space-y-4">
          <DialogTitle className="text-xl sm:text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600">
            Processus de Commande
          </DialogTitle>
          <motion.div 
            className="h-1 w-20 bg-gradient-to-r from-slate-800 to-slate-600 mx-auto rounded-full"
            initial={{ width: 0 }}
            animate={{ width: "5rem" }}
            transition={{ duration: 0.5 }}
          />
        </DialogHeader>

        <Carousel 
          className="w-full max-w-xs mx-auto"
          value={currentStep}
          onValueChange={setCurrentStep}
        >
          <CarouselContent>
            {steps.map((step, index) => (
              <CarouselItem key={index}>
                <motion.div 
                  className="flex flex-col items-center space-y-4 bg-white p-6 rounded-xl shadow-md"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {step.icon}
                  <h3 className="text-lg font-semibold">{step.title}</h3>
                  {step.content}
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:flex" />
          <CarouselNext className="hidden sm:flex" />
        </Carousel>

        <motion.div 
          className="flex justify-center gap-2 mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {steps.map((_, index) => (
            <motion.div
              key={index}
              className={`h-2 w-2 rounded-full ${currentStep === index ? 'bg-blue-600' : 'bg-gray-300'}`}
              whileHover={{ scale: 1.2 }}
            />
          ))}
        </motion.div>

        <div className="mt-6">
          <Button 
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
            onClick={()=>{}}
          >
            Commander Maintenant
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderPopup;
