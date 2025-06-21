import React, { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Camera, User, Mail, Phone, MapPin, Calendar } from "lucide-react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";

// Schéma de validation pour profil e-commerce
const profileSchema = z.object({
  username: z.string()
    .min(3, "Le nom d'utilisateur doit comporter au moins 3 caractères")
    .max(20, "Le nom d'utilisateur doit comporter moins de 20 caractères"),
  email: z.string()
    .email("Veuillez entrer une adresse email valide"),
  firstName: z.string()
    .min(2, "Le prénom doit comporter au moins 2 caractères")
    .max(50, "Le prénom doit comporter moins de 50 caractères"),
  lastName: z.string()
    .min(2, "Le nom doit comporter au moins 2 caractères")
    .max(50, "Le nom doit comporter moins de 50 caractères"),
  phone: z.string()
    .min(10, "Le numéro de téléphone doit comporter au moins 10 chiffres")
    .regex(/^[\d\s\-\+\(\)]+$/, "Format de téléphone invalide"),
  dateOfBirth: z.string()
    .optional(),
  gender: z.enum(["male", "female", "other", "prefer-not-to-say"])
    .optional(),
  // Adresse
  address: z.string()
    .min(5, "L'adresse doit comporter au moins 5 caractères")
    .max(200, "L'adresse doit comporter moins de 200 caractères"),
  city: z.string()
    .min(2, "La ville doit comporter au moins 2 caractères")
    .max(100, "La ville doit comporter moins de 100 caractères"),
  postalCode: z.string()
    .min(3, "Le code postal doit comporter au moins 3 caractères")
    .max(10, "Le code postal doit comporter moins de 10 caractères"),
  country: z.string()
    .min(2, "Veuillez sélectionner un pays"),
  state: z.string()
    .max(100, "La région doit comporter moins de 100 caractères")
    .optional(),
});

const countries = [
  { value: "FR", label: "France" },
  { value: "BE", label: "Belgique" },
  { value: "CH", label: "Suisse" },
  { value: "CA", label: "Canada" },
  { value: "MA", label: "Maroc" },
  { value: "TN", label: "Tunisie" },
  { value: "SN", label: "Sénégal" },
  { value: "CI", label: "Côte d'Ivoire" },
  { value: "US", label: "États-Unis" },
  { value: "GB", label: "Royaume-Uni" },
];

const EditProfile = ({ defaultValues = {} }) => {
  const [avatarPreview, setAvatarPreview] = useState(defaultValues.avatarUrl || "");
  
  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: "",
      email: "",
      firstName: "",
      lastName: "",
      phone: "",
      dateOfBirth: "",
      gender: "",
      address: "",
      city: "",
      postalCode: "",
      country: "",
      state: "",
      ...defaultValues
    }
  });

  const onSubmit = async (data) => {
    console.log("Données du profil:", data);
    // Traitement de la soumission du formulaire
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Form {...form}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-4xl mx-auto"
      >
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8 sm:px-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Mon Profil
            </h2>
            <p className="text-blue-100 text-sm sm:text-base">
              Gérez vos informations personnelles et préférences de livraison
            </p>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 sm:p-8 space-y-8">
            {/* Photo de profil */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative group">
                <Avatar className="h-24 w-24 sm:h-32 sm:w-32 border-4 border-white shadow-lg">
                  <AvatarImage src={avatarPreview} className="object-cover" />
                  <AvatarFallback className="text-lg sm:text-xl bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                    {(form.getValues("firstName")?.charAt(0) || "") + (form.getValues("lastName")?.charAt(0) || "") || "U"}
                  </AvatarFallback>
                </Avatar>
                <Label 
                  htmlFor="avatar" 
                  className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full cursor-pointer hover:bg-blue-700 transition-colors shadow-lg group-hover:scale-110 transform duration-200"
                >
                  <Camera className="h-4 w-4 sm:h-5 sm:w-5" />
                </Label>
                <Input 
                  id="avatar"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>
              <p className="text-sm text-gray-500 text-center">
                Téléchargez une photo de profil (JPG, PNG - Max 5MB)
              </p>
            </div>

            {/* Informations personnelles */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                <User className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Informations personnelles</h3>
              </div>

              <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">Nom d'utilisateur</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="nom_utilisateur" 
                          {...field} 
                          className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors" 
                        />
                      </FormControl>
                      <FormDescription className="text-xs text-gray-500">
                        Votre identifiant unique sur la plateforme
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input 
                            type="email" 
                            placeholder="email@example.com" 
                            {...field} 
                            className="h-11 pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors" 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">Prénom</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Jean" 
                          {...field} 
                          className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">Nom</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Dupont" 
                          {...field} 
                          className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">Téléphone</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input 
                            placeholder="+33 1 23 45 67 89" 
                            {...field} 
                            className="h-11 pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors" 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">Date de naissance</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input 
                            type="date" 
                            {...field} 
                            className="h-11 pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors" 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel className="text-sm font-medium text-gray-700">Genre</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors">
                            <SelectValue placeholder="Sélectionnez votre genre" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="male">Homme</SelectItem>
                          <SelectItem value="female">Femme</SelectItem>
                          <SelectItem value="other">Autre</SelectItem>
                          <SelectItem value="prefer-not-to-say">Préfère ne pas dire</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Adresse de facturation/livraison */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                <MapPin className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Adresse de livraison</h3>
              </div>

              <div className="grid gap-4 sm:gap-6 grid-cols-1">
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">Adresse complète</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="123 Rue de la Paix, Appartement 4B" 
                          {...field} 
                          className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-3">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">Ville</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Paris" 
                            {...field} 
                            className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="postalCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">Code postal</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="75001" 
                            {...field} 
                            className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">Pays</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors">
                              <SelectValue placeholder="Sélectionnez un pays" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {countries.map((country) => (
                              <SelectItem key={country.value} value={country.value}>
                                {country.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">Région/État (optionnel)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Île-de-France" 
                          {...field} 
                          className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-gray-200">
              <Button 
                type="button" 
                variant="outline" 
                className="order-2 sm:order-1 h-11 px-6 border-gray-300 hover:bg-gray-50 transition-colors"
              >
                Annuler
              </Button>
              <Button 
                type="submit" 
                className="order-1 sm:order-2 h-11 px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transition-all duration-200 transform hover:scale-105"
              >
                Enregistrer les modifications
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </Form>
  );
};

export default EditProfile;