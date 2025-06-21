import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  Trash2, 
  Shield, 
  Download, 
  Clock,
  CheckCircle,
  X,
  ArrowRight,
  ArrowLeft,
  User,
  Mail,
  Calendar,
  Database,
  FileText,
  Heart,
  RefreshCw,
  Lock
} from 'lucide-react';

const DeleteAccount = ({ 
  userInfo = {
    name: "Jean Dupont",
    email: "jean.dupont@example.com",
    joinDate: "Janvier 2023",
    totalPosts: 142,
    totalFiles: 58,
    subscription: "Premium"
  },
  onDeleteAccount = () => {},
  onCancel = () => {},
  onDownloadData = () => {}
}) => {
  const [step, setStep] = useState(1); // 1: Warning, 2: Reasons, 3: Confirmation, 4: Final
  const [selectedReasons, setSelectedReasons] = useState([]);
  const [customReason, setCustomReason] = useState('');
  const [confirmationText, setConfirmationText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [dataDownloaded, setDataDownloaded] = useState(false);

  const deletionReasons = [
    { id: 'privacy', label: 'Préoccupations sur la confidentialité', icon: Shield },
    { id: 'unused', label: 'Je n\'utilise plus ce service', icon: Clock },
    { id: 'alternative', label: 'J\'ai trouvé une alternative', icon: ArrowRight },
    { id: 'dissatisfied', label: 'Insatisfait du service', icon: X },
    { id: 'cost', label: 'Trop cher', icon: FileText },
    { id: 'technical', label: 'Problèmes techniques', icon: RefreshCw },
    { id: 'other', label: 'Autre raison', icon: User }
  ];

  const accountData = [
    { type: 'Profil utilisateur', count: '1 compte', icon: User },
    { type: 'Messages et posts', count: `${userInfo.totalPosts} éléments`, icon: Mail },
    { type: 'Fichiers uploadés', count: `${userInfo.totalFiles} fichiers`, icon: Database },
    { type: 'Données de navigation', count: 'Historique complet', icon: Calendar }
  ];

  // Countdown pour le bouton final
  useEffect(() => {
    if (step === 4 && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [step, countdown]);

  const handleReasonToggle = (reasonId) => {
    setSelectedReasons(prev => 
      prev.includes(reasonId) 
        ? prev.filter(id => id !== reasonId)
        : [...prev, reasonId]
    );
  };

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleDownloadData = () => {
    setDataDownloaded(true);
    onDownloadData();
  };

  const handleFinalDeletion = async () => {
    if (confirmationText === 'SUPPRIMER MON COMPTE' && countdown === 0) {
      setIsProcessing(true);
      setTimeout(() => {
        onDeleteAccount({
          reasons: selectedReasons,
          customReason,
          confirmedAt: new Date().toISOString()
        });
      }, 3000);
    }
  };

  const canProceedStep2 = selectedReasons.length > 0 || customReason.trim();
  const canProceedStep3 = dataDownloaded;
  const canDelete = confirmationText === 'SUPPRIMER MON COMPTE' && countdown === 0;

  // Étape 1: Avertissement
  if (step === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-red-500 rounded-full mb-6 animate-pulse">
              <AlertTriangle className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Suppression de compte
            </h1>
            <p className="text-gray-600 text-lg">
              Attention ! Cette action est irréversible
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-gray-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {userInfo.name}
              </h2>
              <p className="text-gray-500">{userInfo.email}</p>
              <p className="text-sm text-gray-400 mt-1">
                Membre depuis {userInfo.joinDate} • {userInfo.subscription}
              </p>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-red-900 mb-4 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2" />
                Ce qui sera définitivement supprimé :
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {accountData.map((data, index) => {
                  const IconComponent = data.icon;
                  return (
                    <div key={index} className="flex items-center p-3 bg-white rounded-lg">
                      <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                        <IconComponent className="w-5 h-5 text-red-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{data.type}</div>
                        <div className="text-sm text-gray-500">{data.count}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
              <div className="flex items-start">
                <Heart className="w-5 h-5 text-blue-500 mr-3 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900 mb-2">
                    Nous sommes désolés de vous voir partir
                  </h4>
                  <p className="text-sm text-blue-700 mb-3">
                    Avant de continuer, savez-vous que vous pouvez également :
                  </p>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Désactiver temporairement votre compte</li>
                    <li>• Modifier vos paramètres de confidentialité</li>
                    <li>• Contacter notre support pour résoudre les problèmes</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={onCancel}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-4 px-6 rounded-xl transition-colors flex items-center justify-center"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Annuler
              </button>
              <button
                onClick={handleNext}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 hover:shadow-lg flex items-center justify-center"
              >
                Continuer la suppression
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Étape 2: Raisons de suppression
  if (step === 2) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-500 rounded-full mb-4">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Pourquoi nous quittez-vous ?
            </h1>
            <p className="text-gray-600">
              Vos retours nous aident à améliorer notre service
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="space-y-4 mb-6">
              {deletionReasons.map((reason) => {
                const IconComponent = reason.icon;
                const isSelected = selectedReasons.includes(reason.id);
                
                return (
                  <div
                    key={reason.id}
                    onClick={() => handleReasonToggle(reason.id)}
                    className={`
                      cursor-pointer p-4 rounded-lg border-2 transition-all duration-200
                      ${isSelected 
                        ? 'border-orange-500 bg-orange-50' 
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }
                    `}
                  >
                    <div className="flex items-center">
                      <div className={`
                        w-10 h-10 rounded-full flex items-center justify-center mr-4
                        ${isSelected ? 'bg-orange-500' : 'bg-gray-100'}
                      `}>
                        <IconComponent className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-gray-600'}`} />
                      </div>
                      <span className="font-medium text-gray-900">{reason.label}</span>
                      {isSelected && (
                        <CheckCircle className="w-5 h-5 text-orange-500 ml-auto" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {selectedReasons.includes('other') && (
              <div className="mb-6 animate-in slide-in-from-top duration-300">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Précisez votre raison :
                </label>
                <textarea
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors resize-none"
                  rows="3"
                  placeholder="Expliquez-nous pourquoi vous souhaitez supprimer votre compte..."
                />
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleBack}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-4 px-6 rounded-xl transition-colors flex items-center justify-center"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Retour
              </button>
              <button
                onClick={handleNext}
                disabled={!canProceedStep2}
                className={`
                  flex-1 font-semibold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center
                  ${canProceedStep2
                    ? 'bg-orange-600 hover:bg-orange-700 text-white hover:shadow-lg'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }
                `}
              >
                Continuer
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Étape 3: Sauvegarde des données
  if (step === 3) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500 rounded-full mb-4">
              <Download className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Sauvegardez vos données
            </h1>
            <p className="text-gray-600">
              Téléchargez vos données avant la suppression définitive
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
              <div className="flex items-start">
                <Database className="w-6 h-6 text-blue-500 mr-3 mt-1" />
                <div>
                  <h3 className="font-semibold text-blue-900 mb-2">
                    Vos données incluent :
                  </h3>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Informations de profil et paramètres</li>
                    <li>• Tous vos messages et publications</li>
                    <li>• Fichiers et documents uploadés</li>
                    <li>• Historique d'activité</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="text-center mb-8">
              {!dataDownloaded ? (
                <button
                  onClick={handleDownloadData}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5 flex items-center mx-auto"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Télécharger mes données
                </button>
              ) : (
                <div className="animate-in zoom-in duration-500">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-green-700 mb-2">
                    Données téléchargées !
                  </h3>
                  <p className="text-green-600">
                    Vos données ont été sauvegardées avec succès
                  </p>
                </div>
              )}
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
              <div className="flex items-start">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mr-3 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-800 mb-1">
                    Important
                  </h4>
                  <p className="text-sm text-yellow-700">
                    Une fois votre compte supprimé, il sera impossible de récupérer vos données. 
                    Assurez-vous d'avoir téléchargé tout ce dont vous avez besoin.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleBack}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-4 px-6 rounded-xl transition-colors flex items-center justify-center"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Retour
              </button>
              <button
                onClick={handleNext}
                disabled={!canProceedStep3}
                className={`
                  flex-1 font-semibold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center
                  ${canProceedStep3
                    ? 'bg-red-600 hover:bg-red-700 text-white hover:shadow-lg'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }
                `}
              >
                Procéder à la suppression
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Étape 4: Confirmation finale
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-100 to-pink-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-600 rounded-full mb-6 animate-pulse">
            <Trash2 className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Confirmation finale
          </h1>
          <p className="text-gray-600">
            Dernière étape avant la suppression définitive
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          {!isProcessing ? (
            <>
              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 mb-8">
                <div className="text-center">
                  <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-red-900 mb-2">
                    Suppression irréversible
                  </h3>
                  <p className="text-red-700 mb-4">
                    Cette action supprimera définitivement votre compte et toutes vos données.
                    Il sera impossible de revenir en arrière.
                  </p>
                </div>
              </div>

              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Pour confirmer, tapez <strong>"SUPPRIMER MON COMPTE"</strong> ci-dessous :
                </label>
                <input
                  type="text"
                  value={confirmationText}
                  onChange={(e) => setConfirmationText(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors font-mono"
                  placeholder="SUPPRIMER MON COMPTE"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleBack}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-4 px-6 rounded-xl transition-colors flex items-center justify-center"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Retour
                </button>
                <button
                  onClick={handleFinalDeletion}
                  disabled={!canDelete}
                  className={`
                    flex-1 font-semibold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center
                    ${canDelete
                      ? 'bg-red-600 hover:bg-red-700 text-white hover:shadow-lg'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }
                  `}
                >
                  {countdown > 0 ? (
                    <>Attendre {countdown}s</>
                  ) : (
                    <>
                      <Trash2 className="w-5 h-5 mr-2" />
                      Supprimer définitivement
                    </>
                  )}
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Suppression en cours...
              </h3>
              <p className="text-gray-600">
                Nous supprimons votre compte et toutes vos données.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeleteAccount;