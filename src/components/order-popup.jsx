import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy} from "lucide-react";
import { motion } from "framer-motion";
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
  const [showQr, setShowQr] = useState(false);

  useEffect(() => {
    const today = new Date().toDateString();
    const storedDate = localStorage.getItem("CKEY_DATE");
    const CKEY = localStorage.getItem("CKEY");

    if (CKEY && storedDate === today) {
      setCodeValue(CKEY);
    } else {
      const randomCode = generateCode();
      setCodeValue(randomCode);
      localStorage.setItem("CKEY", randomCode);
      localStorage.setItem("CKEY_DATE", today);
    }
    setShowQr(true);
  }, []);

  const handleCopy = () => {
    navigator.clipboard
      .writeText(codeValue)
      .then(() => {
        console.log("Code copié dans le presse-papiers");
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 1500);
      })
      .catch((err) => {
        console.error("Échec de la copie : ", err);
      });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] bg-white text-gray-900">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-center">
            Processus de l'achat
          </DialogTitle>
        </DialogHeader>

        <Carousel className="w-full max-w-xs mx-auto">
          <CarouselContent>
            <CarouselItem>
              <div className="flex flex-col items-center space-y-6">
                <p className="text-center text-gray-600 text-lg">
                  Copier ou Scanner le code QR
                </p>
                <div className="relative">
                  {showQr && generateQRCode(codeValue)}
                </div>
                <div className="flex items-center space-x-3 bg-gray-100 p-3 rounded-md w-full">
                  <code className="flex-grow text-center text-base">
                    {codeValue}
                  </code>
                  <motion.div
                    whileTap={{ scale: 0.95 }}
                    animate={isCopied ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 0.3 }}
                  >
                    <Button variant="ghost" size="sm" onClick={handleCopy}>
                      <Copy className="h-5 w-5" />
                    </Button>
                  </motion.div>
                </div>
              </div>
            </CarouselItem>
            <CarouselItem>
              <div className="flex flex-col items-center space-y-6">
                <p className="text-center text-gray-600 text-lg">
                  Deuxième étape de la vérification
                </p>
                {/* Ajoutez ici le contenu de la deuxième étape */}
              </div>
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </DialogContent>
    </Dialog>
  );
};

export default OrderPopup;