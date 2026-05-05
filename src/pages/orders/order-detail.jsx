import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  Truck,
  Package,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  Calendar,
  Copy,
  XCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Alert,
  AlertDescription,
} from '@/components/ui/alert';

import {
  fetchOrderDetail,
  cancelOrder,
  ordersSelectors
} from '@/redux/Slices/ordersSlice';

const statusConfig = {
  pending: { label: 'En attente', color: 'bg-yellow-100 text-yellow-800' },
  confirmed: { label: 'Confirmée', color: 'bg-blue-100 text-blue-800' },
  processing: { label: 'En préparation', color: 'bg-purple-100 text-purple-800' },
  shipped: { label: 'Expédiée', color: 'bg-indigo-100 text-indigo-800' },
  delivered: { label: 'Livrée', color: 'bg-green-100 text-green-800' },
  cancelled: { label: 'Annulée', color: 'bg-red-100 text-red-800' },
  refunded: { label: 'Remboursée', color: 'bg-gray-100 text-gray-800' },
};

const paymentMethodConfig = {
  cash: 'Paiement à la livraison',
  mobile_money: 'Mobile Money',
  stripe: 'Stripe',
  paypal: 'PayPal',
};

const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isCancelling, setIsCancelling] = useState(false);
  const [copied, setCopied] = useState(false);

  const { currentOrder, isLoading, error } = useSelector((state) => ({
    currentOrder: ordersSelectors.selectCurrentOrder(state),
    isLoading: ordersSelectors.selectIsLoading(state),
    error: ordersSelectors.selectError(state),
  }));

  useEffect(() => {
    if (id) {
      dispatch(fetchOrderDetail(id)).catch((err) => {
        console.error('Error fetching order detail:', err);
      });
    }
  }, [dispatch, id]);

  const handleCopyOrderNumber = () => {
    const orderNumber = currentOrder?.orderNumber || `ORD-${id?.slice(-6).toUpperCase()}`;
    navigator.clipboard.writeText(orderNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCancelOrder = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir annuler cette commande ?')) {
      setIsCancelling(true);
      try {
        await dispatch(cancelOrder(id));
      } catch (err) {
        console.error('Error cancelling order:', err);
      } finally {
        setIsCancelling(false);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!currentOrder) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
        <p className="text-gray-600 font-medium">Commande introuvable</p>
        <Button onClick={() => navigate('/orders')} className="mt-4">
          Retour aux commandes
        </Button>
      </div>
    );
  }

  const statusInfo = statusConfig[currentOrder.status] || statusConfig.pending;
  const canCancel = currentOrder.status === 'pending';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full space-y-6"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/orders')}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour
            </Button>
            <h2 className="text-2xl font-bold text-gray-900">
              Détail de la commande
            </h2>
          </div>
          <p className="text-gray-500">Suivi et gestion de votre commande</p>
        </div>

        <Badge className={statusInfo.color} variant="outline">
          {statusInfo.label}
        </Badge>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Order Header Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-gray-500 mb-1">N° de Commande</p>
              <div className="flex items-center gap-2">
                <p className="font-mono font-semibold text-lg">
                  {currentOrder.orderNumber || `ORD-${id?.slice(-6).toUpperCase()}`}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyOrderNumber}
                >
                  <Copy className="w-4 h-4" />
                </Button>
                {copied && <span className="text-xs text-green-600">Copié !</span>}
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-1">Date de Commande</p>
              <p className="font-semibold flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                {new Date(currentOrder.createdAt).toLocaleDateString('fr-FR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-1">Montant Total</p>
              <p className="font-semibold text-lg">
                {currentOrder.total?.toLocaleString('fr-FR')} {currentOrder.currency || 'XOF'}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-1">Statut de Paiement</p>
              <Badge
                variant="outline"
                className={
                  currentOrder.paymentStatus === 'paid'
                    ? 'bg-green-50 text-green-700 border-green-200'
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                }
              >
                {currentOrder.paymentStatus === 'paid' ? 'Payé' : 'En attente'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Historique du Statut</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {currentOrder.statusHistory?.map((history, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold text-sm">
                    ✓
                  </div>
                  {index < (currentOrder.statusHistory?.length - 1) && (
                    <div className="w-0.5 h-12 bg-gray-200 my-2" />
                  )}
                </div>
                <div className="pb-4">
                  <p className="font-medium text-gray-900">
                    {statusConfig[history.status]?.label || history.status}
                  </p>
                  {history.note && (
                    <p className="text-sm text-gray-600 mt-1">{history.note}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(history.changedAt).toLocaleString('fr-FR')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Items */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Articles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {currentOrder.items?.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex gap-4 pb-4 border-b last:pb-0 last:border-0"
              >
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                )}
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{item.title}</p>
                  <p className="text-sm text-gray-600 mt-1">SKU: {item.sku}</p>
                  {item.attributes && (
                    <div className="flex gap-2 mt-2 flex-wrap">
                      {Object.entries(item.attributes).map(([key, value]) => (
                        <Badge key={key} variant="outline" className="text-xs">
                          {key}: {value}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    {item.price?.toLocaleString('fr-FR')} XOF
                  </p>
                  <p className="text-sm text-gray-600">Qté: {item.quantity}</p>
                  <p className="font-semibold text-gray-900 mt-1">
                    {(item.price * item.quantity)?.toLocaleString('fr-FR')} XOF
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pricing */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-3">
            <div className="flex justify-between text-gray-600">
              <span>Sous-total</span>
              <span>{currentOrder.subtotal?.toLocaleString('fr-FR')} XOF</span>
            </div>
            {currentOrder.shippingCost > 0 && (
              <div className="flex justify-between text-gray-600">
                <span>Livraison</span>
                <span>{currentOrder.shippingCost?.toLocaleString('fr-FR')} XOF</span>
              </div>
            )}
            {currentOrder.tax > 0 && (
              <div className="flex justify-between text-gray-600">
                <span>Taxes</span>
                <span>{currentOrder.tax?.toLocaleString('fr-FR')} XOF</span>
              </div>
            )}
            {currentOrder.discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Réduction</span>
                <span>-{currentOrder.discount?.toLocaleString('fr-FR')} XOF</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>{currentOrder.total?.toLocaleString('fr-FR')} {currentOrder.currency || 'XOF'}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Shipping Address */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Adresse de Livraison
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-gray-700">
            <p className="font-semibold">{currentOrder.shippingAddress?.fullName}</p>
            <p>{currentOrder.shippingAddress?.street}</p>
            <p>
              {currentOrder.shippingAddress?.postalCode} {currentOrder.shippingAddress?.city}
            </p>
            <p>{currentOrder.shippingAddress?.country}</p>
            <div className="flex items-center gap-2 mt-4 text-sm">
              <Phone className="w-4 h-4" />
              <span>{currentOrder.shippingAddress?.phone}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            Informations de Paiement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p>
              <span className="text-gray-600">Méthode:</span>
              <span className="font-semibold ml-2">
                {paymentMethodConfig[currentOrder.paymentMethod] || currentOrder.paymentMethod}
              </span>
            </p>
            <p>
              <span className="text-gray-600">Statut:</span>
              <span
                className={`font-semibold ml-2 ${
                  currentOrder.paymentStatus === 'paid'
                    ? 'text-green-600'
                    : 'text-amber-600'
                }`}
              >
                {currentOrder.paymentStatus === 'paid' ? 'Payé' : 'En attente'}
              </span>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        {canCancel && (
          <Button
            variant="destructive"
            onClick={handleCancelOrder}
            disabled={isCancelling}
            className="gap-2"
          >
            <XCircle className="w-4 h-4" />
            {isCancelling ? 'Annulation...' : 'Annuler la commande'}
          </Button>
        )}

        <Button
          variant="outline"
          onClick={() => window.print()}
          className="gap-2"
        >
          📄 Imprimer
        </Button>
      </div>

      {/* Customer Note */}
      {currentOrder.customerNote && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Note du Client</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{currentOrder.customerNote}</p>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
};

export default OrderDetailPage;
