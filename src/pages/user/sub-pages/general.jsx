import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { 
  Mail, 
  User, 
  Phone, 
  Calendar,
  CheckCircle,
  Clock,
  Edit3
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { 
  fetchUserProfile,
  profileSelectors
} from '@/redux/Slices/profileSlice';

const General = () => {
  const dispatch = useDispatch();
  const { user: authUser } = useSelector((state) => state.auth);
  const { profile, isLoading } = useSelector((state) => ({
    profile: profileSelectors.selectProfile(state),
    isLoading: profileSelectors.selectIsLoading(state),
  }));

  useEffect(() => {
    if (authUser?._id && !profile) {
      dispatch(fetchUserProfile(authUser._id));
    }
  }, [dispatch, authUser?._id, profile]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const items = [
    {
      icon: <Mail className="w-5 h-5" />,
      label: 'Email',
      value: authUser?.email || 'Non fourni',
      editable: false
    },
    {
      icon: <User className="w-5 h-5" />,
      label: 'Nom d\'utilisateur',
      value: profile?.username || 'Non fourni',
      editable: true
    },
    {
      icon: <Phone className="w-5 h-5" />,
      label: 'Téléphone',
      value: profile?.phoneNumber || 'Non fourni',
      editable: true
    },
    {
      icon: <Calendar className="w-5 h-5" />,
      label: 'Membre depuis',
      value: profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('fr-FR') : 'Non disponible',
      editable: false
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full space-y-6"
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-900">Informations générales</h2>
          <p className="text-gray-500">Vos informations de profil</p>
        </div>
        <Link to="/profile/edit">
          <Button variant="outline" size="sm" className="gap-2">
            <Edit3 className="w-4 h-4" />
            Modifier
          </Button>
        </Link>
      </div>

      {/* Avatar Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-6">
            <Avatar className="w-20 h-20">
              <AvatarImage 
                src={profile?.avatar} 
                alt={profile?.username} 
              />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-lg font-bold">
                {authUser?.username?.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900">
                {authUser?.username}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Statut: <span className="inline-flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-green-600 font-medium">Actif</span>
                </span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bio Card */}
      {profile?.bio && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Bio</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
          </CardContent>
        </Card>
      )}

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
                    {item.icon}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-500 mb-1">
                      {item.label}
                    </p>
                    <p className="text-base font-semibold text-gray-900 break-all">
                      {item.value}
                    </p>
                  </div>

                  {item.editable && (
                    <Link to="/profile/edit" className="ml-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Verification Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Vérification du compte</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-medium text-green-900">Email vérifié</p>
                <p className="text-sm text-green-700">{authUser?.email}</p>
              </div>
            </div>
          </div>

          {!authUser?.emailVerified && (
            <div className="flex items-center justify-between p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-amber-600" />
                <div>
                  <p className="font-medium text-amber-900">Vérification en attente</p>
                  <p className="text-sm text-amber-700">Vérifiez votre email pour activer votre compte</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Renvoyer
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default General;
