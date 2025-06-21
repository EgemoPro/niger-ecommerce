import React, { useState } from 'react';
import { 
  CreditCard, 
  Smartphone, 
  Shield, 
  CheckCircle, 
  ArrowRight,
  Lock,
  Globe,
  Wallet
} from 'lucide-react';

const Payout = ({ 
  amount = "99.99", 
  currency = "EUR", 
  onPaymentComplete = () => {} 
}) => {
  const [selectedMethod, setSelectedMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    name: '',
    email: '',
    phone: ''
  });

  const paymentMethods = [
    {
      id: 'paypal',
      name: 'PayPal',
      icon: Wallet,
      color: 'bg-blue-500',
      description: 'Paiement sécurisé via PayPal'
    },
    {
      id: 'card',
      name: 'Carte Bancaire',
      icon: CreditCard,
      color: 'bg-gray-700',
      description: 'Visa, Mastercard, American Express'
    },
    {
      id: 'local',
      name: 'Solution Locale',
      icon: Smartphone,
      color: 'bg-green-500',
      description: 'Mobile Money, Virement bancaire'
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    // Simulation d'un traitement de paiement
    setTimeout(() => {
      setIsProcessing(false);
      onPaymentComplete({ method: selectedMethod, amount, currency });
    }, 2000);
  };

  const formatCardNumber = (value) => {
    return value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
  };

  const formatExpiryDate = (value) => {
    return value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500 rounded-full mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Finaliser votre paiement
          </h1>
          <p className="text-gray-600">
            Paiement sécurisé et crypté à 100%
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Résumé de commande */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Lock className="w-5 h-5 mr-2 text-green-500" />
                Résumé
              </h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Sous-total</span>
                  <span className="font-medium">{amount} {currency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Frais de traitement</span>
                  <span className="font-medium">2.99 {currency}</span>
                </div>
                <hr className="my-3" />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-blue-600">
                    {(parseFloat(amount) + 2.99).toFixed(2)} {currency}
                  </span>
                </div>
              </div>

              <div className="flex items-center text-sm text-gray-500 mb-4">
                <Shield className="w-4 h-4 mr-2" />
                <span>Paiement sécurisé SSL 256-bit</span>
              </div>

              <div className="flex items-center justify-center space-x-2 text-xs text-gray-400">
                <CreditCard className="w-4 h-4" />
                <Wallet className="w-4 h-4" />
                <Smartphone className="w-4 h-4" />
                <Globe className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Formulaire de paiement */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              {/* Sélection méthode de paiement */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">
                  Choisissez votre méthode de paiement
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {paymentMethods.map((method) => {
                    const IconComponent = method.icon;
                    return (
                      <div
                        key={method.id}
                        onClick={() => setSelectedMethod(method.id)}
                        className={`
                          relative cursor-pointer rounded-xl border-2 p-4 transition-all duration-300 hover:shadow-md
                          ${selectedMethod === method.id 
                            ? 'border-blue-500 bg-blue-50 shadow-md' 
                            : 'border-gray-200 hover:border-gray-300'
                          }
                        `}
                      >
                        <div className="flex flex-col items-center text-center">
                          <div className={`w-12 h-12 ${method.color} rounded-full flex items-center justify-center mb-3`}>
                            <IconComponent className="w-6 h-6 text-white" />
                          </div>
                          <h4 className="font-medium text-gray-900 mb-1">
                            {method.name}
                          </h4>
                          <p className="text-xs text-gray-500">
                            {method.description}
                          </p>
                        </div>
                        
                        {selectedMethod === method.id && (
                          <div className="absolute -top-2 -right-2">
                            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                              <CheckCircle className="w-4 h-4 text-white" />
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Formulaires spécifiques */}
              <div className="space-y-6">
                {selectedMethod === 'card' && (
                  <div className="space-y-4 animate-in slide-in-from-right duration-300">
                    <h4 className="font-semibold text-gray-900 flex items-center">
                      <CreditCard className="w-5 h-5 mr-2" />
                      Informations de carte
                    </h4>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nom sur la carte *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                          placeholder="Jean Dupont"
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Numéro de carte *
                        </label>
                        <input
                          type="text"
                          name="cardNumber"
                          value={formatCardNumber(formData.cardNumber)}
                          onChange={(e) => handleInputChange({
                            target: { name: 'cardNumber', value: e.target.value.replace(/\s/g, '') }
                          })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                          placeholder="1234 5678 9012 3456"
                          maxLength="19"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Date d'expiration *
                        </label>
                        <input
                          type="text"
                          name="expiryDate"
                          value={formatExpiryDate(formData.expiryDate)}
                          onChange={(e) => handleInputChange({
                            target: { name: 'expiryDate', value: e.target.value }
                          })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                          placeholder="MM/AA"
                          maxLength="5"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          CVV *
                        </label>
                        <input
                          type="text"
                          name="cvv"
                          value={formData.cvv}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                          placeholder="123"
                          maxLength="4"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {selectedMethod === 'paypal' && (
                  <div className="text-center py-8 animate-in slide-in-from-right duration-300">
                    <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Wallet className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="text-lg font-semibold mb-2">
                      Paiement via PayPal
                    </h4>
                    <p className="text-gray-600 mb-6">
                      Vous serez redirigé vers PayPal pour finaliser votre paiement de manière sécurisée.
                    </p>
                  </div>
                )}

                {selectedMethod === 'local' && (
                  <div className="space-y-4 animate-in slide-in-from-right duration-300">
                    <h4 className="font-semibold text-gray-900 flex items-center">
                      <Smartphone className="w-5 h-5 mr-2" />
                      Solution de paiement locale
                    </h4>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                          placeholder="votre@email.com"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Téléphone *
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                          placeholder="+227 XX XX XX XX"
                        />
                      </div>
                    </div>
                    
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-sm text-green-700">
                        <strong>Instructions:</strong> Après validation, vous recevrez un SMS avec les instructions pour finaliser le paiement via Mobile Money ou virement bancaire.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Bouton de paiement */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className={`
                    w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl
                    transition-all duration-300 flex items-center justify-center space-x-2
                    ${isProcessing ? 'opacity-75 cursor-not-allowed' : 'hover:shadow-lg transform hover:-translate-y-0.5'}
                  `}
                >
                  {isProcessing ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Traitement en cours...</span>
                    </div>
                  ) : (
                    <>
                      <span>
                        Payer {(parseFloat(amount) + 2.99).toFixed(2)} {currency}
                      </span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
                
                <p className="text-xs text-gray-500 text-center mt-4">
                  En cliquant sur "Payer", vous acceptez nos conditions d'utilisation et notre politique de confidentialité.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payout;