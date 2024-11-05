import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import PhoneCall from "../assets/phone-call.gif";

const OrderPopup = ({ isOpen, onClose, product }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);

  useEffect(() => {
    setIsSubmitDisabled(phoneNumber.length !== 8);
  }, [phoneNumber]);

  const handleClose = () => {
    setPhoneNumber("");
    setCurrentSlide(0);
    onClose();
  };

  const handleSubmit = () => {
    setCurrentSlide(1);
  };

  const handleBack = () => {
    setCurrentSlide(0);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-gray-900 p-8 sm:p-10 md:p-12 max-md:scale-90 max-md:rounded-lg max-md:w-full md:w-[85%] lg:w-[75%] xl:w-[65%] max-w-[750px] mx-auto shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-center font-bold mb-8 sm:mb-10 text-2xl sm:text-3xl md:text-4xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Contactez-nous
          </DialogTitle>
        </DialogHeader>

        <Carousel>
          <CarouselContent>
            <CarouselItem className={currentSlide === 0 ? 'block' : 'hidden'}>
              <div className="flex flex-col items-center space-y-10">
                <div className="space-y-4 text-center">
                  <p className="text-gray-600 text-base sm:text-lg md:text-xl font-medium">
                    Pour plus d'informations sur le produit
                  </p>
                  <h2 className="font-bold text-xl sm:text-2xl md:text-3xl text-blue-600">
                    {product.title}
                  </h2>
                  <p className="text-gray-600 text-base sm:text-lg md:text-xl font-medium">
                    veuillez saisir votre numéro de téléphone
                  </p>
                </div>
                <InputOTP
                  maxLength={8}
                  value={phoneNumber}
                  onChange={setPhoneNumber}
                >
                  <InputOTPGroup className="w-full max-w-[400px] p-3 bg-gray-50 rounded-xl">
                    {[...Array(8)].map((_, index) => (
                      <React.Fragment key={index}>
                        {index > 0 && index % 2 === 0 && <InputOTPSeparator />}
                        <InputOTPSlot index={index} className="border-2 border-blue-200 focus:border-blue-500 transition-colors duration-200" />
                      </React.Fragment>
                    ))}
                  </InputOTPGroup>
                </InputOTP>
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitDisabled}
                  className="mt-6 w-full sm:w-auto px-12 py-4 text-lg font-semibold bg-blue-600 hover:bg-blue-700 transition-all duration-300 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Demander un rappel
                </Button>
              </div>
            </CarouselItem>

            <CarouselItem className={currentSlide === 1 ? 'block' : 'hidden'}>
              <div className="flex flex-col items-center space-y-10">
                <div className="space-y-4 text-center">
                  <p className="text-gray-600 text-base sm:text-lg md:text-xl font-medium">
                    Merci ! Notre équipe vous contactera dans les plus brefs délais pour vous donner plus d'informations sur
                  </p>
                  <h2 className="font-bold text-xl sm:text-2xl md:text-3xl text-blue-600">
                    {product.title}
                  </h2>
                </div>
                <img
                  src={PhoneCall}
                  className="h-32 sm:h-36 md:h-40 animate-pulse"
                  alt="Phone call"
                />
                <Button 
                  onClick={handleBack} 
                  className="mt-6 w-full sm:w-auto px-12 py-4 text-lg font-semibold bg-gray-100 hover:bg-gray-200 text-gray-800 transition-all duration-300 rounded-full shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  Modifier le numéro
                </Button>
              </div>
            </CarouselItem>
          </CarouselContent>
        </Carousel>
      </DialogContent>
    </Dialog>
  );
};

export default OrderPopup;