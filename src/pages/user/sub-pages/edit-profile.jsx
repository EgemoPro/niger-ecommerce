import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Camera, Save, AlertCircle, CheckCircle } from "lucide-react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

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
import { Textarea } from "@/components/ui/textarea";
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
import { alert } from "@/components/ui/sonner";

import { 
  fetchUserProfile, 
  updateUserProfile,
  clearProfileMessage,
  profileSelectors
} from "@/redux/Slices/profileSlice";

// Schéma de validation
const profileSchema = z.object({
  username: z.string()
    .min(3, "Le nom d'utilisateur doit comporter au moins 3 caractères")
    .max(20, "Le nom d'utilisateur doit comporter moins de 20 caractères"),
  bio: z.string()
    .max(500, "La bio doit comporter moins de 500 caractères")
    .optional(),
  phoneNumber: z.string()
    .regex(/^[\d\s\-\+\(\)]*$/, "Format de téléphone invalide")
    .optional(),
  avatar: z.instanceof(File).optional(),
});

const EditProfile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { profile, isLoading, error, successMessage } = useSelector((state) => ({
    profile: profileSelectors.selectProfile(state),
    isLoading: profileSelectors.selectIsLoading(state),
    error: profileSelectors.selectError(state),
    successMessage: profileSelectors.selectSuccessMessage(state),
  }));
  
  const [avatarPreview, setAvatarPreview] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: "",
      bio: "",
      phoneNumber: "",
    },
  });

  // Fetch profile on mount
  useEffect(() => {
    if (user?._id) {
      dispatch(fetchUserProfile(user._id)).catch((err) => {
        console.error('Error fetching profile:', err);
      });
    }
  }, [dispatch, user?._id]);

  // Update form when profile is loaded
  useEffect(() => {
    if (profile) {
      form.reset({
        username: profile.username || "",
        bio: profile.bio || "",
        phoneNumber: profile.phoneNumber || "",
      });
      if (profile.avatar) {
        setAvatarPreview(profile.avatar);
      }
    }
  }, [profile, form]);

  // Show messages
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        dispatch(clearProfileMessage());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, dispatch]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearProfileMessage());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setAvatarPreview(event.target?.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    try {
      const profileData = { ...data };
      if (selectedFile) {
        profileData.avatar = selectedFile;
      }
      
      await dispatch(updateUserProfile(user._id, profileData));
    } catch (err) {
      console.error('Update profile error:', err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-900">Modifier le profil</h2>
          <p className="text-gray-500">Mettez à jour vos informations personnelles</p>
        </div>

        {/* Messages */}
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex gap-3 p-4 rounded-lg bg-green-50 border border-green-200"
          >
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-green-900">{successMessage}</p>
            </div>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex gap-3 p-4 rounded-lg bg-red-50 border border-red-200"
          >
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-red-900">{error}</p>
            </div>
          </motion.div>
        )}

        {/* Avatar Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <Label className="text-base font-semibold mb-4 block">Photo de profil</Label>
          
          <div className="flex items-center gap-6">
            <Avatar className="w-24 h-24">
              <AvatarImage 
                src={avatarPreview || profile?.avatar} 
                alt="profile" 
              />
              <AvatarFallback className="bg-gray-100 text-lg font-semibold">
                {user?.username?.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <Label 
                htmlFor="avatar-upload"
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors w-fit"
              >
                <Camera className="w-4 h-4" />
                Changer la photo
              </Label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
              <p className="text-sm text-gray-500 mt-2">
                JPG, PNG ou GIF. Taille max 5MB.
              </p>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Username */}
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom d'utilisateur</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="johndoe"
                        {...field}
                        className="bg-gray-50"
                      />
                    </FormControl>
                    <FormDescription>
                      Entre 3 et 20 caractères
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Bio */}
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Décrivez-vous brièvement..."
                        {...field}
                        rows={4}
                        className="bg-gray-50 resize-none"
                      />
                    </FormControl>
                    <FormDescription>
                      Max 500 caractères
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Phone Number */}
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Numéro de téléphone</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="+227 XX XX XX XX"
                        {...field}
                        className="bg-gray-50"
                      />
                    </FormControl>
                    <FormDescription>
                      Format: +227 XXXXXXXX
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={isLoading || form.formState.isSubmitting}
                  className="flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {isLoading ? "Enregistrement..." : "Enregistrer les modifications"}
                </Button>
              </div>
            </form>
          </Form>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900">
            💡 Votre adresse email ne peut pas être modifiée depuis ce formulaire. 
            Contactez le support si vous avez besoin de la changer.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default EditProfile;
