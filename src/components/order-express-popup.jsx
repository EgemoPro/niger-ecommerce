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
      <DialogContent className="bg-white text-gray-900 p-4 sm:p-6 md:p-8 w-[95%] sm:w-[90%] md:w-[85%] lg:w-[80%] xl:w-[70%] max-w-[800px] mx-auto">
        <DialogHeader>
          <DialogTitle className="text-center font-bold mb-4 sm:mb-6 text-2xl sm:text-3xl md:text-4xl">
            Contactez-nous
          </DialogTitle>
        </DialogHeader>

        <Carousel>
          <CarouselContent>
            <CarouselItem className={currentSlide === 0 ? 'block' : 'hidden'}>
              <div className="flex flex-col items-center space-y-6">
                <p className="text-center text-gray-600 text-base sm:text-lg md:text-xl">
                  Pour plus d'informations sur le produit
                </p>
                <h2 className="text-center font-bold text-xl sm:text-2xl md:text-3xl">
                  {product.title}
                </h2>
                <p className="text-center text-gray-600 text-base sm:text-lg md:text-xl">
                  veuillez saisir votre numéro de téléphone
                </p>
                <InputOTP
                  maxLength={8}
                  value={phoneNumber}
                  onChange={setPhoneNumber}
                >
                  <InputOTPGroup className="w-full max-w-[400px]">
                    {[...Array(8)].map((_, index) => (
                      <React.Fragment key={index}>
                        {index > 0 && index % 2 === 0 && <InputOTPSeparator />}
                        <InputOTPSlot index={index} />
                      </React.Fragment>
                    ))}
                  </InputOTPGroup>
                </InputOTP>
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitDisabled}
                  className="mt-6 w-full sm:w-auto px-8 py-2 text-lg"
                >
                  Demander un rappel
                </Button>
              </div>
            </CarouselItem>

            <CarouselItem className={currentSlide === 1 ? 'block' : 'hidden'}>
              <div className="flex flex-col items-center space-y-6">
                <p className="text-center text-gray-600 text-base sm:text-lg md:text-xl">
                  Merci ! Notre équipe vous contactera dans les plus brefs délais pour vous donner plus d'informations sur
                </p>
                <h2 className="text-center font-bold text-xl sm:text-2xl md:text-3xl">
                  {product.title}
                </h2>
                <img
                  src={PhoneCall}
                  className="h-24 sm:h-28 md:h-32"
                  alt="Phone call"
                />
                <Button onClick={handleBack} className="mt-6 w-full sm:w-auto px-8 py-2 text-lg">
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