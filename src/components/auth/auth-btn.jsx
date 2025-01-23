import React from "react";
import { useState, useEffect } from "react";
import { User, Mail, Lock, Eye, EyeOff, ChevronRight, X } from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { Button } from "../ui/button";
import Loader from "../loader";

import { Separator } from "../ui/separator";
import GoogleAuhtButton from "./buttons/GoogleAuhtButton";
import FacebookAuhtButton from "./buttons/FacebookAuthButton";
import AppleAuhtButton from "./buttons/AppleAuthButton";

const AuthBtn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          variant="ghost"
          className="text-gray-600 h-8 outline outline-[1px] outline-slate-400/50"
        >
          Se connecter
        </Button>
      </DrawerTrigger>

      <DrawerContent
        className={`bg-gradient-to-b from-gray-50 to-white ${
          isMobile ? "h-[95dvh]" : "h-[90vh]"
        }`}
      >
        <div className="mx-auto w-full max-w-lg">
          <DrawerHeader className="relative px-6 pt-8">
            <DrawerClose className="absolute right-4 top-4 md:right-6 md:top-6">
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-gray-100 rounded-full"
              >
                <X className="h-4 w-4" />
              </Button>
            </DrawerClose>

            <div className="text-center mb-6">
              <div className="mb-4">
                <div className="h-12 w-12 bg-blue-600 rounded-2xl mx-auto flex items-center justify-center">
                  <User className="h-6 w-6 text-white" />
                </div>
              </div>
              <DrawerTitle className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                {isLogin ? "Ravi de vous revoir !" : "Créer un compte"}
              </DrawerTitle>
              <p className="text-gray-500 text-sm md:text-base">
                {isLogin
                  ? "Connectez-vous pour accéder à votre espace"
                  : "Rejoignez-nous pour commencer l'aventure"}
              </p>
            </div>
          </DrawerHeader>

          <div className="px-6 pb-6 space-y-6 overflow-y-auto max-h-[calc(100vh-240px)] md:max-h-[65vh] scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
            <div className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Nom complet
                  </label>
                  <div className="relative group">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
                    <input
                      type="text"
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all duration-200 text-base hover:border-gray-300"
                      placeholder="John Doe"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Adresse Gmail
                </label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
                  <input
                    type="email"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all duration-200 text-base hover:border-gray-300"
                    placeholder="vous@gmail.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Mot de passe
                </label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full pl-10 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all duration-200 text-base hover:border-gray-300"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {isLogin && (
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-0">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-5 w-5 rounded-md border-gray-200 text-blue-500 focus:ring-blue-500 transition-colors duration-200"
                    />
                    <label className="ml-2 text-sm text-gray-600">
                      Rester connecté
                    </label>
                  </div>
                  <a
                    href="#"
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
                  >
                    Mot de passe oublié ?
                  </a>
                </div>
              )}

              <Button className="flex gap-2 items-center w-full h-12 md:h-11 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 mt-6">
                <span className="text-base">
                  {isLogin ? "Se connecter" : "S'inscrire"}
                </span>
                {isDataLoading ? <Loader className={'mt-1'} /> : <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" /> }
              </Button>

              <p className="text-center text-sm text-gray-500 mt-6">
                {isLogin ? "Pas encore de compte ?" : "Déjà un compte ?"}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-blue-600 hover:text-blue-700 font-medium ml-1 transition-colors duration-200"
                >
                  {isLogin ? "S'inscrire" : "Se connecter"}
                </button>
              </p>
            </div>
            <div className="relative">
              <Separator className="my-8" />
              <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 bg-white px-4">
                <span className="text-sm text-gray-400">ou continuez avec</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-6">
              <GoogleAuhtButton/>
              <FacebookAuhtButton/>
              <AppleAuhtButton/>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default AuthBtn;
