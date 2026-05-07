import { z } from 'zod';

// ============================================
// SCHÉMAS DE VALIDATION - AUTHENTIFICATION
// ============================================

export const LoginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères')
});

export const RegisterSchema = z.object({
  username: z.string().min(3, 'Le nom d\'utilisateur doit contenir au moins 3 caractères'),
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères')
});

export const UserSchema = z.object({
  id: z.string(),
  username: z.string().optional(),
  email: z.string().email(),
  payload: z.record(z.any()).optional()
});

export const AuthStateSchema = z.object({
  user: UserSchema.nullable(),
  token: z.string().nullable(),
  isAuthenticated: z.boolean(),
  isLoading: z.boolean(),
  error: z.string().nullable()
});

// ============================================
// SCHÉMAS DE VALIDATION - PANIER
// ============================================

export const ProductSchema = z.object({
  id: z.string().min(1, 'ID produit requis'),
  name: z.string().min(1, 'Nom du produit requis'),
  price: z.number().positive('Le prix doit être positif'),
  quantity: z.number().int().positive().optional(),  // Rendu optionnel pour l'ajout
  image: z.string().url().optional(),
  description: z.string().optional(),
  category: z.string().optional(),
  storeId: z.string().optional(),      // Ajouté
  sku: z.string().optional(),         // Ajouté
  attributes: z.record(z.string()).optional()  // Ajouté
});

export const BasketItemSchema = z.object({
  id: z.string().min(1, 'ID produit requis'),
  name: z.string().min(1, 'Nom du produit requis').optional(),
  price: z.number().positive().optional(),
  quantity: z.number().int().min(1).max(100).default(1),
  image: z.string().optional(),
  description: z.string().optional(),
  category: z.string().optional(),
  storeId: z.string().optional(),
  sku: z.string().optional(),
  attributes: z.record(z.string()).optional()
});

export const BasketStateSchema = z.object({
  items: z.array(BasketItemSchema),
  totalItems: z.number().nonnegative(),
  totalPrice: z.number().nonnegative(),
  isLoading: z.boolean(),
  error: z.string().nullable()
});

// ============================================
// SCHÉMAS DE VALIDATION - NOTIFICATIONS
// ============================================

export const NotificationSchema = z.object({
  id: z.string().or(z.number()),
  type: z.enum([
    'order_confirmed',
    'order_shipped',
    'order_delivered',
    'payment_success',
    'price_drop',
    'stock_alert',
    'message',
    'promo',
    'birthday',
    'order_update'
  ]),
  title: z.string().min(1, 'Titre requis'),
  message: z.string().min(1, 'Message requis'),
  timestamp: z.string().datetime().or(z.date()),
  read: z.boolean().default(false),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  actionUrl: z.string().url().optional(),
  icon: z.string().optional(),
  color: z.string().optional(),
  data: z.record(z.any()).optional()
});

export const NotificationSettingsSchema = z.object({
  showToasts: z.boolean().default(true),
  soundEnabled: z.boolean().default(true),
  orderUpdates: z.boolean().default(true),
  promotions: z.boolean().default(true),
  priceAlerts: z.boolean().default(true),
  stockAlerts: z.boolean().default(true),
  messageNotifications: z.boolean().default(true)
});

export const NotificationStateSchema = z.object({
  basket: z.number().nonnegative(),
  message: z.number().nonnegative(),
  totalUnread: z.number().nonnegative(),
  notifications: z.array(NotificationSchema),
  settings: NotificationSettingsSchema,
  loading: z.boolean(),
  error: z.string().nullable()
});

// ============================================
// SCHÉMAS DE VALIDATION - FAVORIS
// ============================================

export const FavoriteSchema = z.object({
  id: z.string().min(1, 'ID requis'),
  productId: z.string().min(1, 'ID produit requis'),
  name: z.string().optional(),
  price: z.number().optional(),
  image: z.string().url().optional(),
  addedAt: z.string().datetime().or(z.date()).optional()
});

export const FavorisStateSchema = z.object({
  items: z.array(FavoriteSchema),
  isLoading: z.boolean(),
  error: z.string().nullable()
});

// ============================================
// SCHÉMAS DE VALIDATION - MESSAGES
// ============================================

export const MessageSchema = z.object({
  id: z.string().or(z.number()),
  roomId: z.string().min(1, 'ID room requis'),
  message: z.string().min(1, 'Message requis'),
  sender: z.string().min(1, 'Sender requis'),
  senderName: z.string().optional(),
  timestamp: z.string().datetime().or(z.date()),
  type: z.enum(['text', 'image', 'file']).default('text'),
  read: z.boolean().default(false),
  delivered: z.boolean().default(false)
});

export const MessageStateSchema = z.object({
  messagesByRoom: z.record(z.array(MessageSchema)),
  currentRoom: z.string().nullable(),
  onlineUsers: z.record(z.any()),
  isLoading: z.boolean(),
  error: z.string().nullable()
});

// ============================================
// SCHÉMAS DE VALIDATION - COMMANDES
// ============================================

export const OrderItemSchema = z.object({
  id: z.string(),
  productId: z.string(),
  name: z.string(),
  price: z.number().positive(),
  quantity: z.number().int().positive(),
  subtotal: z.number().positive()
});

export const OrderSchema = z.object({
  id: z.string().min(1, 'ID commande requis'),
  number: z.string().optional(),
  items: z.array(OrderItemSchema),
  totalPrice: z.number().positive(),
  status: z.enum(['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']),
  createdAt: z.string().datetime().or(z.date()),
  updatedAt: z.string().datetime().or(z.date()).optional(),
  shippingAddress: z.string().optional(),
  trackingNumber: z.string().optional()
});

// ============================================
// SCHÉMAS DE VALIDATION - BOUTIQUE
// ============================================

export const ShopSchema = z.object({
  id: z.string().min(1, 'ID boutique requis'),
  name: z.string().min(1, 'Nom boutique requis'),
  description: z.string().optional(),
  image: z.string().url().optional(),
  banner: z.string().url().optional(),
  rating: z.number().min(0).max(5).optional(),
  products: z.array(ProductSchema).optional(),
  popularProducts: z.array(ProductSchema).optional()
});

// ============================================
// SCHÉMAS DE VALIDATION - UTILISATEUR
// ============================================

export const UserProfileSchema = z.object({
  id: z.string().min(1, 'ID utilisateur requis'),
  username: z.string().min(3, 'Nom d\'utilisateur minimum 3 caractères'),
  email: z.string().email('Email invalide'),
  avatar: z.string().url().optional(),
  bio: z.string().optional(),
  favorites: z.array(z.string()).optional(),
  following: z.array(z.string()).optional(),
  orders: z.array(OrderSchema).optional(),
  cart: z.array(BasketItemSchema).optional()
});

// ============================================
// SCHÉMAS DE VALIDATION - PARAMÈTRES
// ============================================

export const SettingsSchema = z.object({
  theme: z.enum(['light', 'dark']).default('light'),
  language: z.enum(['fr', 'en']).default('fr'),
  currency: z.string().default('EUR'),
  notifications: NotificationSettingsSchema,
  privacy: z.object({
    profilePublic: z.boolean().default(true),
    showEmail: z.boolean().default(false),
    allowMessages: z.boolean().default(true)
  }).optional()
});

// ============================================
// SCHÉMAS DE VALIDATION - ERREURS
// ============================================

export const ErrorSchema = z.object({
  message: z.string().min(1, 'Message d\'erreur requis'),
  code: z.string().optional(),
  timestamp: z.string().datetime().or(z.date()).optional(),
  details: z.record(z.any()).optional()
});

// ============================================
// FONCTION UTILITAIRE DE VALIDATION
// ============================================

export const validateData = (schema, data) => {
  try {
    return {
      success: true,
      data: schema.parse(data),
      error: null
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error.errors || error.message
    };
  }
};

// ============================================
// FONCTION UTILITAIRE DE VALIDATION SÉCURISÉE
// ============================================

export const safeValidate = (schema, data, defaultValue = null) => {
  try {
    return schema.parse(data);
  } catch (error) {
    console.warn('Validation error:', error.message);
    return defaultValue;
  }
};
