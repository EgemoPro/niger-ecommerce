import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent, 
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Phone,
  ArrowLeft,
  Info,
  Send,
  PhoneCall as PhoneCallIcon,
  Edit2,
  Clock,
  MessageCircle
} from "lucide-react";
import PhoneCall from "../assets/phone-call.gif";

const OrderPopup = ({ isOpen, onClose, product }) => {
  const [phoneNumber, setPhoneNumber] = useState(["", "", "", ""]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [preferredTime, setPreferredTime] = useState("");
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    phoneNumber: "",
    preferredTime: "",
    message: "",
  });

  useEffect(() => {
    const isComplete = phoneNumber.every((group) => group.length === 2);
    setIsSubmitDisabled(!isComplete);
  }, [phoneNumber]);

  const handleClose = () => {
    setPhoneNumber(["", "", "", ""]);
    setCurrentSlide(0);
    setPreferredTime("");
    setMessage("");
    setFormData({
      phoneNumber: "",
      preferredTime: "",
      message: ""
    });
    onClose();
  };

  const handleSubmit = () => {
    const formattedPhoneNumber = phoneNumber.join("");
    const submissionData = {
      phoneNumber: formattedPhoneNumber,
      preferredTime: preferredTime,
      message: message,
      product: product // Inclure les infos du produit si nécessaire
    };
    setFormData(submissionData);
    setCurrentSlide(1);
    // Maintenant formData peut être passé à d'autres composants
  };

  const handleBack = () => {
    setCurrentSlide(0);
  };

  const handlePhoneInput = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newPhoneNumber = [...phoneNumber];
    newPhoneNumber[index] = value.slice(0, 2);
    setPhoneNumber(newPhoneNumber);

    if (value.length === 2 && index < 3) {
      const nextInput = document.getElementById(`phone-group-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !phoneNumber[index] && index > 0) {
      const prevInput = document.getElementById(`phone-group-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-gray-900 p-4 sm:p-6 w-[95vw] sm:w-[85vw] md:w-[75vw] lg:w-[65vw] max-w-[800px] mx-auto rounded-2xl shadow-xl">
        {/* En-tête avec titre et description */}
        <div className="mb-4 sm:mb-8">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-center gap-2 sm:gap-3 font-bold text-2xl sm:text-3xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              <Phone className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
              Service Client
            </DialogTitle>
            <DialogDescription className="text-center text-gray-500 text-base sm:text-lg mt-2">
              Notre équipe est disponible de 8h à 20h pour vous assister
            </DialogDescription>
          </DialogHeader>
        </div>

        <Carousel className="w-full">
          <CarouselContent>
            {/* Premier écran - Saisie des informations */}
            <CarouselItem className={currentSlide === 0 ? "block" : "hidden"}>
              <div className="grid grid-cols-1 gap-4 sm:gap-8 max-w-2xl mx-auto">
                {/* Section produit */}
                <div className="text-center bg-blue-50 p-4 sm:p-6 rounded-xl">
                  <p className="flex items-center justify-center gap-2 text-sm sm:text-base text-gray-600 mb-2">
                    <Info className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                    Pour plus d&apos;informations sur
                  </p>
                  <h2 className="font-bold text-xl sm:text-2xl text-blue-600">{product.title}</h2>
                </div>

                {/* Section téléphone */}
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                    <PhoneCallIcon className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500 animate-pulse" />
                    <p className="text-base sm:text-lg text-gray-700">Saisissez votre numéro de téléphone</p>
                  </div>

                  <div className="flex justify-center gap-2 sm:gap-3">
                    {phoneNumber.map((group, index) => (
                      <React.Fragment key={index}>
                        <Input
                          id={`phone-group-${index}`}
                          type="text"
                          value={group}
                          onChange={(e) => handlePhoneInput(index, e.target.value)}
                          onKeyDown={(e) => handleKeyDown(index, e)}
                          className="w-12 h-12 sm:w-14 sm:h-14 text-center text-lg sm:text-xl font-semibold border-2 border-blue-200 focus:border-blue-500 rounded-lg"
                          maxLength={2}
                        />
                        {index < 3 && <span className="text-gray-400 text-lg sm:text-xl">-</span>}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                {/* Section préférences */}
                <div className="space-y-3 sm:space-y-4 bg-gray-50 p-4 sm:p-6 rounded-xl">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
                    <select 
                      value={preferredTime}
                      onChange={(e) => setPreferredTime(e.target.value)}
                      className="flex-1 p-2 sm:p-3 border rounded-lg border-blue-200 focus:border-blue-500 text-base sm:text-lg"
                    >
                      <option value="">Choisir l&apos;heure de rappel</option>
                      <option value="morning">Matin (8h - 12h)</option>
                      <option value="afternoon">Après-midi (12h - 16h)</option>
                      <option value="evening">Soir (16h - 20h)</option>
                    </select>
                  </div>

                  <div className="flex items-start gap-2 sm:gap-3">
                    <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500 mt-2" />
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Message (optionnel)"
                      className="flex-1 p-2 sm:p-3 border rounded-lg border-blue-200 focus:border-blue-500 min-h-[80px] sm:min-h-[100px] text-base sm:text-lg"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitDisabled}
                  className="w-full py-3 sm:py-4 text-base sm:text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl disabled:opacity-50"
                >
                  <Send className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Demander un rappel
                </Button>
              </div>
            </CarouselItem>

            {/* Deuxième écran - Confirmation */}
            <CarouselItem className={currentSlide === 1 ? "block" : "hidden"}>
              <div className="flex flex-col items-center gap-6 sm:gap-8 max-w-2xl mx-auto text-center">
                <div className="bg-green-50 p-4 sm:p-6 rounded-xl w-full">
                  <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                    <PhoneCallIcon className="w-6 h-6 sm:w-8 sm:h-8 text-green-500" />
                    <p className="text-base sm:text-lg text-gray-700">
                      Merci ! Notre équipe vous contactera très bientôt au sujet de
                    </p>
                  </div>
                  <h2 className="font-bold text-xl sm:text-2xl text-blue-600 mb-3 sm:mb-4">{product.title}</h2>
                  {preferredTime && (
                    <p className="text-sm sm:text-base text-gray-600">
                      Période de rappel souhaitée : {preferredTime === 'morning' ? 'Matin' : preferredTime === 'afternoon' ? 'Après-midi' : 'Soir'}
                    </p>
                  )}
                </div>

                <img
                  src={PhoneCall}
                  className="h-24 sm:h-32 animate-pulse"
                  alt="Phone call"
                />

                <Button
                  onClick={handleBack}
                  className="px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-full shadow-md hover:shadow-lg"
                >
                  <Edit2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
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
