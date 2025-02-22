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
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Camera } from "lucide-react";
import * as z from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {motion} from "framer-motion";

// Définition du schéma de validation
const profileSchema = z.object({
  username: z.string()
    .min(3, "Le nom d'utilisateur doit comporter au moins 3 caractères")
    .max(20, "Le nom d'utilisateur doit comporter moins de 20 caractères"),
  email: z.string()
    .email("Veuillez entrer une adresse email valide"),
  fullName: z.string()
    .min(2, "Le nom complet doit comporter au moins 2 caractères")
    .max(50, "Le nom complet doit comporter moins de 50 caractères"),
  bio: z.string()
    .max(500, "La biographie doit comporter moins de 500 caractères")
    .optional(),
  location: z.string()
    .max(100, "La localisation doit comporter moins de 100 caractères")
    .optional(),
  profession: z.string()
    .max(100, "La profession doit comporter moins de 100 caractères")
    .optional(),
  pronouns: z.enum(["he/him", "she/her", "they/them", "prefer-not-to-say"])
    .optional(),
});

const EditProfile = ({ defaultValues = {} }) => {
  const [avatarPreview, setAvatarPreview] = useState(defaultValues.avatarUrl || "");
  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: "",
      email: "",
      fullName: "",
      bio: "",
      location: "",
      profession: "",
      pronouns: "",
      ...defaultValues
    }
  });

  const onSubmit = async (data) => {
    console.log("Form data:", data);
    // Handle form submission here
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
        transition={{ duration: 0.5 }}
      >

      
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 md:px-20">
        {/* Avatar Section */}
        <FormItem className="flex flex-col items-center space-y-2">
          <FormLabel className="text-base font-medium">Photo de profil</FormLabel>
          <div className="relative">
            <Avatar className="h-20 w-20 border border-gray-300">
              <AvatarImage src={avatarPreview} />
              <AvatarFallback>
                {form.getValues("username")?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <Label 
              htmlFor="avatar" 
              className="absolute bottom-0 right-0 p-1 bg-primary text-primary-foreground rounded-full cursor-pointer hover:bg-primary/90"
            >
              <Camera className="h-4 w-4" />
            </Label>
            <Input 
              id="avatar"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>
          <FormDescription className="text-xs text-gray-500">
            Téléchargez une image carrée pour de meilleurs résultats
          </FormDescription>
        </FormItem>

        {/* Basic Information */}
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium">Nom d'utilisateur</FormLabel>
                <FormControl>
                  <Input placeholder="Nom d'utilisateur" {...field} className="border-gray-300 focus:border-primary focus:ring-primary" />
                </FormControl>
                <FormDescription className="text-xs text-gray-500">
                  Ceci est votre nom d'affichage public
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
                <FormLabel className="text-base font-medium">Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="email@example.com" {...field} className="border-gray-300 focus:border-primary focus:ring-primary" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium">Nom complet</FormLabel>
                <FormControl>
                  <Input placeholder="Nom complet" {...field} className="border-gray-300 focus:border-primary focus:ring-primary" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="pronouns"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium">Pronoms</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="border-gray-300 focus:border-primary focus:ring-primary">
                      <SelectValue placeholder="Sélectionnez vos pronoms" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="he/him">il/lui</SelectItem>
                    <SelectItem value="she/her">elle</SelectItem>
                    <SelectItem value="they/them">iel</SelectItem>
                    <SelectItem value="prefer-not-to-say">Préfère ne pas dire</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Bio */}
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-medium">Biographie</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Parlez-nous de vous"
                  className="min-h-[80px] border-gray-300 focus:border-primary focus:ring-primary"
                  {...field}
                />
              </FormControl>
              <FormDescription className="text-xs text-gray-500">
                Brève description qui apparaîtra sur votre profil
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Additional Information */}
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium">Localisation</FormLabel>
                <FormControl>
                  <Input placeholder="Ville, Pays" {...field} className="border-gray-300 focus:border-primary focus:ring-primary" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="profession"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium">Profession</FormLabel>
                <FormControl>
                  <Input placeholder="Votre profession" {...field} className="border-gray-300 focus:border-primary focus:ring-primary" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" className="hover:bg-gray-100">
            Annuler
          </Button>
          <Button type="submit" className="bg-primary text-white hover:bg-primary-dark">
            Enregistrer les modifications
          </Button>
        </div>
      </form>
      </motion.div>
    </Form>
  );
};

export default EditProfile;
