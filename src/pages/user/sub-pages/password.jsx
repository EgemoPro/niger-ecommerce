import  { useState } from "react";
import { useForm } from "react-hook-form";
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "../../../components/ui/input";

import { Button } from "../../../components/ui/button";
import { Alert, AlertDescription } from "../../../components/ui/alert";
import { 
  Eye, 
  EyeOff, 
  Lock, 
  Shield, 
  CheckCircle, 
  AlertCircle,
  Key,
  RefreshCw
} from "lucide-react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";

// Schéma de validation pour le changement de mot de passe
const passwordSchema = z.object({
  currentPassword: z.string()
    .min(1, "Le mot de passe actuel est requis"),
  newPassword: z.string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
      "Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial"),
  confirmPassword: z.string()
    .min(1, "Veuillez confirmer votre mot de passe"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

// Composant pour analyser la force du mot de passe
const PasswordStrength = ({ password }) => {
  const getStrength = (pwd) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/\d/.test(pwd)) score++;
    if (/[@$!%*?&]/.test(pwd)) score++;
    return score;
  };

  const strength = getStrength(password);
  const strengthLabels = ["Très faible", "Faible", "Moyen", "Fort", "Très fort"];
  const strengthColors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-blue-500", "bg-green-500"];

  if (!password) return null;

  return (
    <div className="mt-2 space-y-2">
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-600">Force du mot de passe :</span>
        <span className={`text-xs font-medium ${strength <= 2 ? 'text-red-600' : strength <= 3 ? 'text-yellow-600' : 'text-green-600'}`}>
          {strengthLabels[strength - 1] || "Très faible"}
        </span>
      </div>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((level) => (
          <div
            key={level}
            className={`h-1.5 flex-1 rounded-full ${
              level <= strength ? strengthColors[strength - 1] : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

// Composant pour les critères de mot de passe
const PasswordCriteria = ({ password }) => {
  const criteria = [
    { test: (pwd) => pwd.length >= 8, label: "Au moins 8 caractères" },
    { test: (pwd) => /[a-z]/.test(pwd), label: "Une lettre minuscule" },
    { test: (pwd) => /[A-Z]/.test(pwd), label: "Une lettre majuscule" },
    { test: (pwd) => /\d/.test(pwd), label: "Un chiffre" },
    { test: (pwd) => /[@$!%*?&]/.test(pwd), label: "Un caractère spécial (@$!%*?&)" },
  ];

  return (
    <div className="mt-3 space-y-2">
      <p className="text-xs font-medium text-gray-700">Votre mot de passe doit contenir :</p>
      <div className="space-y-1">
        {criteria.map((criterion, index) => {
          const isValid = criterion.test(password);
          return (
            <div key={index} className="flex items-center gap-2">
              {isValid ? (
                <CheckCircle className="h-3 w-3 text-green-500" />
              ) : (
                <div className="h-3 w-3 rounded-full border border-gray-300" />
              )}
              <span className={`text-xs ${isValid ? 'text-green-700' : 'text-gray-500'}`}>
                {criterion.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Password = () => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const form = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onChange"
  });

  const watchNewPassword = form.watch("newPassword");

  const onSubmit = async (data) => {
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      // Simulation d'un appel API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simuler une réponse
      const isSuccess = Math.random() > 0.3; // 70% de chance de succès
      
      if (isSuccess) {
        setSuccessMessage("Votre mot de passe a été modifié avec succès !");
        form.reset();
      } else {
        setErrorMessage("Le mot de passe actuel est incorrect. Veuillez réessayer.");
      }
    } catch (error) {
      setErrorMessage("Une erreur est survenue. Veuillez réessayer plus tard.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 to-pink-600 px-6 py-8 sm:px-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Lock className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1">
                Sécurité du compte
              </h2>
              <p className="text-red-100 text-sm sm:text-base">
                Modifiez votre mot de passe pour sécuriser votre compte
              </p>
            </div>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 sm:p-8 space-y-6">
            {/* Messages d'état */}
            {successMessage && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  {successMessage}
                </AlertDescription>
              </Alert>
            )}

            {errorMessage && (
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  {errorMessage}
                </AlertDescription>
              </Alert>
            )}

            {/* Conseils de sécurité */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-blue-900 mb-1">Conseils de sécurité</h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Utilisez un mot de passe unique que vous n'utilisez nulle part ailleurs</li>
                    <li>• Évitez les informations personnelles faciles à deviner</li>
                    <li>• Considérez l'utilisation d'un gestionnaire de mots de passe</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Mot de passe actuel */}
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Key className="h-4 w-4" />
                    Mot de passe actuel
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showCurrentPassword ? "text" : "password"}
                        placeholder="Entrez votre mot de passe actuel"
                        {...field}
                        className="h-12 pr-12 border-gray-300 focus:border-red-500 focus:ring-red-500 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showCurrentPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormDescription className="text-xs text-gray-500">
                    Saisissez votre mot de passe actuel pour confirmer votre identité
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Nouveau mot de passe */}
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Nouveau mot de passe
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showNewPassword ? "text" : "password"}
                        placeholder="Entrez votre nouveau mot de passe"
                        {...field}
                        className="h-12 pr-12 border-gray-300 focus:border-red-500 focus:ring-red-500 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showNewPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <PasswordStrength password={watchNewPassword} />
                  <PasswordCriteria password={watchNewPassword} />
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Confirmation du mot de passe */}
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Confirmer le nouveau mot de passe
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirmez votre nouveau mot de passe"
                        {...field}
                        className="h-12 pr-12 border-gray-300 focus:border-red-500 focus:ring-red-500 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormDescription className="text-xs text-gray-500">
                    Retapez votre nouveau mot de passe pour confirmation
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Boutons d'action */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-gray-200">
              <Button 
                type="button" 
                variant="outline" 
                className="order-2 sm:order-1 h-12 px-6 border-gray-300 hover:bg-gray-50 transition-colors"
                onClick={() => form.reset()}
              >
                Annuler
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading || !form.formState.isValid}
                className="order-1 sm:order-2 h-12 px-8 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Modification en cours...
                  </div>
                ) : (
                  "Modifier le mot de passe"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </motion.div>
  );
};

export default Password;