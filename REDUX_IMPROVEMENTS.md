# Améliorations Redux Implémentées

**Date** : 2024  
**Statut** : Implémenté  
**Compatibilité** : Rétrocompatible avec le code existant

---

## 📋 Résumé des changements

Les améliorations Redux ont été implémentées de manière **progressive et rétrocompatible**, sans casser le code existant.

### Fichiers créés

1. **`src/redux/schemas/index.js`** - Schémas de validation Zod
2. **`src/redux/utils/index.js`** - Utilitaires Redux réutilisables
3. **`src/services/logger.js`** - Service de logging centralisé
4. **`src/hooks/useBasket.js`** - Hook personnalisé pour le panier
5. **`src/hooks/useNotifications.js`** - Hook personnalisé pour les notifications

### Fichiers modifiés

1. **`src/redux/Slices/basketSlice.js`** - Ajout validation et logging
2. **`src/redux/Slices/notificationSlice.js`** - Ajout validation et logging

---

## ✨ Améliorations apportées

### 1. Schémas de validation Zod

**Fichier** : `src/redux/schemas/index.js`

**Contenu** :
- `LoginSchema` - Validation des données de connexion
- `RegisterSchema` - Validation des données d'inscription
- `ProductSchema` - Validation des produits
- `BasketItemSchema` - Validation des articles du panier
- `NotificationSchema` - Validation des notifications
- `MessageSchema` - Validation des messages
- `OrderSchema` - Validation des commandes
- `ShopSchema` - Validation des boutiques
- `UserProfileSchema` - Validation des profils utilisateur
- `SettingsSchema` - Validation des paramètres

**Utilisation** :
```javascript
import { BasketItemSchema, validatePayload } from '../redux/schemas/index';

const validation = validatePayload(BasketItemSchema, product, 'addProduct');
if (!validation.success) {
  // Gérer l'erreur
}
```

---

### 2. Utilitaires Redux

**Fichier** : `src/redux/utils/index.js`

**Catégories** :

#### Calculs - Panier
- `calculateCartTotals(items)` - Calcule les totaux du panier
- `findProductInCart(items, productId)` - Trouve un produit
- `updateProductQuantity(items, productId, quantity)` - Met à jour la quantité
- `removeProductFromCart(items, productId)` - Supprime un produit

#### Calculs - Notifications
- `calculateUnreadCount(notifications)` - Compte les non-lus
- `sortNotificationsByDate(notifications)` - Trie par date
- `sortNotificationsByPriority(notifications)` - Trie par priorité
- `filterNotificationsByType(notifications, type)` - Filtre par type
- `cleanupOldNotifications(notifications, daysOld)` - Nettoie les anciennes

#### Gestion d'erreur
- `createErrorObject(message, code, details)` - Crée un objet erreur
- `extractErrorMessage(error)` - Extrait le message d'erreur
- `extractErrorCode(error)` - Extrait le code d'erreur

#### Validation
- `validateAndSanitize(schema, data)` - Valide et nettoie les données
- `validatePayload(schema, payload, actionName)` - Valide avec logging

#### Normalisation
- `normalizeNotifications(notifications)` - Normalise les notifications
- `denormalizeNotifications(normalized)` - Dénormalise les notifications

#### Sélection
- `selectNotificationById(notifications, id)` - Sélectionne par ID
- `selectUnreadNotifications(notifications)` - Sélectionne les non-lus
- `selectMessagesByRoom(messages, roomId)` - Sélectionne par room

#### Transformation
- `transformNotificationForDisplay(notification)` - Transforme pour l'affichage
- `transformMessageForDisplay(message)` - Transforme un message
- `transformProductForCart(product, quantity)` - Transforme un produit

---

### 3. Service de logging centralisé

**Fichier** : `src/services/logger.js`

**Méthodes de base** :
- `debug(message, data)` - Logging de debug (dev uniquement)
- `info(message, data)` - Logging d'info
- `warn(message, data)` - Logging d'avertissement
- `error(message, error)` - Logging d'erreur

**Méthodes spécialisées** :
- `logAction(actionType, payload)` - Log les actions Redux
- `logStateChange(sliceName, oldState, newState)` - Log les changements d'état
- `logAsyncThunkStart/Success/Error(thunkName)` - Log les thunks
- `logApiRequest/Response/Error(method, url, ...)` - Log les requêtes API
- `logLogin/Logout(email)` - Log l'authentification
- `logAddToCart/RemoveFromCart(productId)` - Log le panier
- `logNotificationAdded/Read(notification)` - Log les notifications
- `logSocketConnect/Disconnect/Error()` - Log Socket.IO

**Utilisation** :
```javascript
import { logger } from '../../services/logger';

logger.debug('Product added', { productId: '123' });
logger.logAddToCart('123', 1);
logger.error('API error', error);
```

---

### 4. Hook personnalisé - Panier

**Fichier** : `src/hooks/useBasket.js`

**État** :
```javascript
const {
  items,           // Articles du panier
  totalItems,      // Nombre total d'articles
  totalPrice,      // Prix total
  isLoading,       // État de chargement
  error            // Message d'erreur
} = useBasket();
```

**Actions** :
```javascript
const {
  addToCart,                // Ajouter au panier
  removeFromCart,           // Supprimer du panier
  updateProductQuantity,    // Mettre à jour la quantité
  clearCart,                // Vider le panier
  clearBasketError          // Effacer l'erreur
} = useBasket();
```

**Utilitaires** :
```javascript
const {
  getProductInCart,         // Obtenir un produit
  isProductInCart,          // Vérifier si un produit est dans le panier
  isEmpty,                  // Le panier est vide
  itemCount                 // Nombre d'articles
} = useBasket();
```

**Utilisation** :
```javascript
import useBasket from '../hooks/useBasket';

function ProductCard({ product }) {
  const { addToCart, isProductInCart } = useBasket();
  
  const handleAddToCart = () => {
    addToCart(product);
  };
  
  return (
    <button onClick={handleAddToCart}>
      {isProductInCart(product.id) ? 'Déjà dans le panier' : 'Ajouter'}
    </button>
  );
}
```

---

### 5. Hook personnalisé - Notifications

**Fichier** : `src/hooks/useNotifications.js`

**État** :
```javascript
const {
  notifications,    // Liste des notifications
  basket,          // Compteur panier
  message,         // Compteur messages
  totalUnread,     // Total non-lus
  settings,        // Paramètres
  loading,         // État de chargement
  error            // Message d'erreur
} = useNotifications();
```

**Actions - Notifications** :
```javascript
const {
  add,             // Ajouter une notification
  markRead,        // Marquer comme lue
  markUnread,      // Marquer comme non-lue
  markAllRead,     // Marquer tout comme lu
  remove,          // Supprimer une notification
  clearAll,        // Supprimer toutes les notifications
  cleanup          // Nettoyer les anciennes
} = useNotifications();
```

**Actions - Compteurs** :
```javascript
const {
  setBasketCount,
  setMessageCount,
  incrementMessageCount,
  resetMessageCountAction,
  updateUnreadCount
} = useNotifications();
```

**Actions - Spécialisées** :
```javascript
const {
  addOrder,        // Ajouter notification de commande
  addPriceDrop,    // Ajouter notification de baisse de prix
  addStock         // Ajouter notification de stock
} = useNotifications();
```

**Utilitaires** :
```javascript
const {
  getUnreadCount,
  getNotificationById,
  getNotificationsByType,
  getUnreadNotifications,
  hasUnread,
  unreadCount
} = useNotifications();
```

**Utilisation** :
```javascript
import useNotifications from '../hooks/useNotifications';

function NotificationCenter() {
  const { notifications, markRead, getUnreadCount } = useNotifications();
  
  return (
    <div>
      <p>Non-lus: {getUnreadCount()}</p>
      {notifications.map(notif => (
        <div key={notif.id} onClick={() => markRead(notif.id)}>
          {notif.title}
        </div>
      ))}
    </div>
  );
}
```

---

### 6. Améliorations du basketSlice

**Changements** :
- �� Validation Zod des produits
- ✅ Utilisation de `calculateCartTotals()` pour les calculs
- ✅ Logging centralisé avec `logger`
- ✅ Gestion d'erreur améliorée
- ✅ Try-catch dans tous les reducers
- ✅ Messages d'erreur cohérents

**Rétrocompatibilité** :
- ✅ Les actions existantes fonctionnent toujours
- ✅ Les sélecteurs existants fonctionnent toujours
- ✅ `handleBacketAction` continue de fonctionner

---

### 7. Améliorations du notificationSlice

**Changements** :
- ✅ Validation Zod des notifications
- ✅ Utilisation de `calculateUnreadCount()` pour les compteurs
- ✅ Logging centralisé avec `logger`
- ✅ Gestion d'erreur améliorée
- ✅ Try-catch dans les reducers critiques
- ✅ Messages d'erreur cohérents

**Rétrocompatibilité** :
- ✅ Les actions existantes fonctionnent toujours
- ✅ Les sélecteurs existants fonctionnent toujours
- ✅ Les notifications existantes continuent de fonctionner

---

## 🔄 Migration progressive

### Étape 1 : Utiliser les nouveaux hooks (Recommandé)

**Avant** :
```javascript
const dispatch = useDispatch();
const items = useSelector(state => state.basket.items);

const handleAddToCart = () => {
  dispatch(handleBacketAction('addProduct', product));
};
```

**Après** :
```javascript
const { addToCart } = useBasket();

const handleAddToCart = () => {
  addToCart(product);
};
```

### Étape 2 : Utiliser les utilitaires

**Avant** :
```javascript
const totals = state.items.reduce((sum, item) => sum + item.quantity, 0);
```

**Après** :
```javascript
import { calculateCartTotals } from '../redux/utils/index';

const totals = calculateCartTotals(state.items);
```

### Étape 3 : Utiliser le logging

**Avant** :
```javascript
console.log("add product to basket", state.items);
```

**Après** :
```javascript
import { logger } from '../services/logger';

logger.logAddToCart(product.id, quantity);
```

---

## ✅ Checklist d'implémentation

- [x] Créer les schémas Zod
- [x] Créer les utilitaires Redux
- [x] Créer le service de logging
- [x] Créer le hook useBasket
- [x] Créer le hook useNotifications
- [x] Améliorer basketSlice
- [x] Améliorer notificationSlice
- [ ] Migrer les composants vers useBasket
- [ ] Migrer les composants vers useNotifications
- [ ] Ajouter les tests unitaires
- [ ] Documenter les changements

---

## 📚 Ressources

- Schémas Zod : `src/redux/schemas/index.js`
- Utilitaires : `src/redux/utils/index.js`
- Logger : `src/services/logger.js`
- Hooks : `src/hooks/useBasket.js`, `src/hooks/useNotifications.js`

---

**Statut** : ✅ Implémenté et rétrocompatible
