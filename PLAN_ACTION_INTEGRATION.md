# 🎯 PLAN D'ACTION DÉTAILLÉ - Intégration Frontend (USER ACTIONS)

**Document complémentaire du bilan**  
**Durée totale estimée** : 8-12 jours

---

## PHASE 1 : FONDATIONS (2 jours)

### Jour 1.1 : Configuration Axios & Intercepteurs

**Fichier à modifier** : `src/lib/axios.js`

**Tâche** :
1. Ajouter interceptor response global (401, 423, 429, 502)
2. Gérer JWT expiration avec `jwt-decode`
3. Centraliser la gestion des erreurs

**Code à ajouter** :
```javascript
// À la fin de axios.js
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.error || 'Erreur réseau';

    switch (status) {
      case 401:
        localStorage.removeItem('token');
        Cookies.remove('jwt');
        window.location.href = '/auth/login';
        break;
      case 423:
        alert('Compte verrouillé. Réessayez dans 2 heures.');
        break;
      case 429:
        alert('Trop de tentatives. Réessayez dans 15 minutes.');
        break;
      case 502:
        alert('Service indisponible. Réessayez plus tard.');
        break;
      default:
        console.error(`[${status}] ${message}`);
    }
    return Promise.reject(error);
  }
);
```

### Jour 1.2 : Valider proxy Vite

**Fichier** : `vite.config.js`

**Vérifier** :
```javascript
// Le proxy doit exister et rediriger /api vers le backend
export default {
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
}
```

### Jour 1.3 : Améliorer Redux Auth Slice

**Fichier** : `src/redux/Slices/authSlice.js`

**Tâches** :
1. Ajouter JWT decode pour vérifier expiration
2. Améliorer la gestion du format de réponse
3. Ajouter validation pour codes 423, 429

```javascript
// À importer
import jwtDecode from 'jwt-decode';

// Ajouter cette fonction utilitaire
const isTokenExpired = (token) => {
  try {
    const decoded = jwtDecode(token);
    return decoded.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

// Modifier checkAuth pour vérifier l'expiration
export const checkAuth = () => async (dispatch) => {
  dispatch(authRequest());
  const token = Cookies.get(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY);
  
  if (!token || isTokenExpired(token)) {
    dispatch(authFailure('Token expiré ou manquant'));
    return false;
  }
  
  try {
    const response = await api.get('auth/user/profile');
    const { payload } = response.data; // ✅ Adapter au format API
    dispatch(authSuccess({ user: payload, token }));
    return true;
  } catch (error) {
    dispatch(authFailure(error.response?.data?.error));
    return false;
  }
};
```

---

## PHASE 2 : PAGES AUTH & PROFIL (2 jours)

### Jour 2.1 : Créer pages Login & Register

**À créer** :
- `src/pages/auth/login-page.jsx`
- `src/pages/auth/register-page.jsx`

**Exemple structure** :
```jsx
// login-page.jsx
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '@/redux/Slices/authSlice';
import { authSelectors } from '@/redux/Slices/authSlice';

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector(state => ({
    isLoading: authSelectors.selectIsLoading(state),
    error: authSelectors.selectError(state)
  }));

  const onSubmit = (data) => {
    dispatch(login(data));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Email input */}
      {/* Password input */}
      {/* Submit button */}
      {error && <div className="error">{error}</div>}
    </form>
  );
}
```

**Points clés** :
- Validation React Hook Form (yup ou zod)
- Affichage des erreurs API (400, 401, 423, 429)
- Loading state sur le bouton
- Redirect vers `/products` après succès

### Jour 2.2 : Implémenter endpoints Profil User

**À créer** : `src/services/userService.js`

```javascript
import api from '@/lib/axios';

export const userService = {
  // GET /user/profile/:userId
  getProfile: async (userId) => {
    const { data } = await api.get(`/user/profile/${userId}`);
    return data.payload;
  },

  // PUT /user/profile/:userId
  updateProfile: async (userId, updates) => {
    const { data } = await api.put(`/user/profile/${userId}`, updates);
    return data.payload;
  }
};
```

**À ajouter dans userSlice.js** :
```javascript
export const fetchUserProfile = (userId) => async (dispatch) => {
  dispatch(requestStart());
  try {
    const profile = await userService.getProfile(userId);
    dispatch(setUserProfile(profile));
  } catch (error) {
    dispatch(requestFail(error.response?.data?.error));
  }
};

export const updateUserProfileAsync = (userId, updates) => async (dispatch) => {
  dispatch(requestStart());
  try {
    const profile = await userService.updateProfile(userId, updates);
    dispatch(setUserProfile(profile));
  } catch (error) {
    dispatch(requestFail(error.response?.data?.error));
  }
};
```

### Jour 2.3 : Pages Profil User

**À créer/modifier** :
- `src/pages/user/user-profile-view.jsx` (affichage)
- `src/pages/user/user-profile-edit.jsx` (édition)

**Points** :
- Charger le profil au montage
- Formulaire d'édition avec validation
- Avatar upload (si multi-form support)
- Confirmation avant sauvegarde

---

## PHASE 3 : PRODUITS & COMMENTAIRES (2 jours)

### Jour 3.1 : Implémenter Produits

**À créer** : `src/services/productService.js`

```javascript
export const productService = {
  // GET /products (existe déjà partiellement)
  getProducts: async (params) => {
    const { data } = await api.get('/products', { params });
    return data.payload;
  },

  // GET /products/:id
  getProductDetail: async (productId) => {
    const { data } = await api.get(`/products/${productId}`);
    return data.payload;
  },

  // GET /comments/:productId
  getComments: async (productId) => {
    const { data } = await api.get(`/comments/${productId}`);
    return data.payload;
  },

  // POST /comments/new
  addComment: async (productId, userId, content, rating) => {
    const { data } = await api.post('/comments/new', {
      productId, userId, content, rating
    });
    return data.payload;
  },

  // DELETE /comments/:id
  deleteComment: async (commentId) => {
    const { data } = await api.delete(`/comments/${commentId}`);
    return data;
  }
};
```

**À ajouter dans Redux** :
```javascript
// productSlice.js — ajouter actions
export const fetchProductDetail = (productId) => async (dispatch) => { ... };
export const fetchComments = (productId) => async (dispatch) => { ... };
export const addCommentAsync = (productId, userId, content, rating) => async (dispatch) => { ... };
```

### Jour 3.2 : Composant Commentaires

**À créer** : `src/components/product/CommentSection.jsx`

**Fonctionnalités** :
- Liste commentaires avec rating stars
- Formulaire d'ajout
- Bouton supprimer (si user propriétaire)
- Pagination si > 10 commentaires

### Jour 3.3 : Page Product Detail

**Modifier** : `src/pages/productSweater/producr-sweater-page.jsx`

**À ajouter** :
- Charger détails produit via `GET /products/:id`
- Afficher CommentSection
- Boutons Favoris + "Contacter vendeur"

---

## PHASE 4 : PANIER & COMMANDES (3 jours)

### Jour 4.1 : Service Commandes

**À créer** : `src/services/orderService.js`

```javascript
export const orderService = {
  // POST /orders
  createOrder: async (orderData) => {
    const { data } = await api.post('/orders', orderData);
    return data.payload;
  },

  // GET /orders
  getMyOrders: async (page = 1, limit = 10) => {
    const { data } = await api.get(`/orders?page=${page}&limit=${limit}`);
    return data.payload;
  },

  // GET /orders/:id
  getOrderDetail: async (orderId) => {
    const { data } = await api.get(`/orders/${orderId}`);
    return data.payload;
  }
};
```

### Jour 4.2 : Pages Panier & Checkout

**À créer** :
- `src/pages/cart/cart-page.jsx` — Afficher panier, totaux, bouton Checkout
- `src/pages/checkout/checkout-page.jsx` — Formulaire adresse + paiement

**Formulaire Checkout** :
```javascript
{
  storeId: string,
  items: [{productId, quantity, attributes?, ...}],
  shippingAddress: {
    fullName, phone, street, city, postalCode, country
  },
  paymentMethod: 'cash' | 'mobile_money' | 'stripe',
  customerNote?: string,
  shippingCost?: number,
  tax?: number,
  discount?: number
}
```

### Jour 4.3 : Page Mes Commandes

**À créer/modifier** : `src/pages/orders/order-page.jsx`

**Fonctionnalités** :
- Charger commandes via `GET /orders`
- Afficher liste avec statut badge
- Clic → détail commande
- Historique statut (timeline)
- Bouton annuler (si pending)

---

## PHASE 5 : CHAT REST API (2 jours)

### Jour 5.1 : Service Conversations

**À créer** : `src/services/conversationService.js`

```javascript
export const conversationService = {
  // POST /conversations
  getOrCreateConversation: async (storeId) => {
    const { data } = await api.post('/conversations', { storeId });
    return data.payload;
  },

  // GET /conversations
  getMyConversations: async (page = 1, limit = 20) => {
    const { data } = await api.get(`/conversations?page=${page}&limit=${limit}`);
    return data.payload;
  },

  // GET /conversations/:id/messages
  getMessages: async (conversationId, page = 1, limit = 30) => {
    const { data } = await api.get(
      `/conversations/${conversationId}/messages?page=${page}&limit=${limit}`
    );
    return data.payload;
  }
};
```

**À ajouter dans Redux** : `src/redux/Slices/conversationSlice.js`

```javascript
// Actions
export const fetchConversations = (page) => async (dispatch) => { ... };
export const fetchMessages = (conversationId, page) => async (dispatch) => { ... };
export const getOrCreateConversationAsync = (storeId) => async (dispatch) => { ... };
```

### Jour 5.2 : Adapter Socket.IO

**Modifier** : `src/Socket.js`

**Ajouter événements** :
```javascript
// Dans setupEventListeners()
this.socket.on('messagesMarkedAsRead', (data) => {
  this.notifyLocal('messagesMarkedAsRead', data);
});

// Ajouter méthodes
joinConversation(conversationId) {
  this.emit('joinConversation', { conversationId });
}

sendMessageToConversation(conversationId, content) {
  this.emit('sendMessage', { conversationId, content });
}

typing(conversationId) {
  this.emit('typing', { conversationId });
}

stopTyping(conversationId) {
  this.emit('stopTyping', { conversationId });
}

markAsRead(conversationId) {
  this.emit('markAsRead', { conversationId });
}
```

### Jour 5.3 : Page Chat

**Modifier** : `src/pages/chat/chat-page.jsx`

**Flux** :
1. Charger historique via REST (`fetchMessages`)
2. Rejoindre room Socket (`joinConversation`)
3. Écouter `receiveMessage` temps réel
4. Envoyer via Socket
5. Marquer comme lu au focus

---

## PHASE 6 : FAVORIS & FOLLOWING (1 jour)

### Jour 6.1 : Service Favoris

**À créer/corriger** : `src/services/favoriteService.js`

```javascript
export const favoriteService = {
  // POST /user/favorites (toggle)
  toggleFavorite: async (userId, productId) => {
    const { data } = await api.post('/user/favorites', {
      userId, productId
    });
    return data.payload;
  },

  // PUT /user/following (toggle)
  toggleFollowing: async (storeId) => {
    const { data } = await api.put('/user/following', { storeId });
    return data.payload;
  }
};
```

**Corriger dans Redux** :
```javascript
export const toggleFavoriteAsync = (productId, userId) => async (dispatch) => {
  try {
    const result = await favoriteService.toggleFavorite(userId, productId);
    dispatch(setFavorites(result.favorites));
    dispatch(setFollowing(result.following));
  } catch (error) {
    dispatch(requestFail(error.response?.data?.error));
  }
};

export const toggleFollowingAsync = (storeId) => async (dispatch) => {
  try {
    const result = await favoriteService.toggleFollowing(storeId);
    dispatch(setFollowing(result.following));
  } catch (error) {
    dispatch(requestFail(error.response?.data?.error));
  }
};
```

### Jour 6.2 : Pages Favoris & Following

**À créer** :
- `src/pages/favorites/favorites-page.jsx` — Grid de produits favoris
- `src/pages/following/following-page.jsx` — Grid de boutiques suivies

---

## PHASE 7 : TESTS & POLISH (3 jours)

### Jour 7.1 : Gestion erreurs complète

**À vérifier sur chaque action** :
- [ ] Erreur 400 → Afficher détail du champ
- [ ] Erreur 401 → Redirect login
- [ ] Erreur 404 → Afficher "Non trouvé"
- [ ] Erreur 409 → Message spécifique (email exist, stock insuffisant)
- [ ] Erreur 423 → Message verrouillage
- [ ] Erreur 429 → Message rate limit
- [ ] Erreur 500 → Message générique
- [ ] Erreur 502 → Message service indisponible

### Jour 7.2 : Loading states & UX

**À ajouter partout** :
- Spinner sur les requêtes
- Bouton disabled pendant chargement
- Skeleton screens sur listes
- Optimistic updates (optionnel, v2)

### Jour 7.3 : Tests

**À tester** :
1. **Auth flow** : Register → Login → Logout → Redirect
2. **Profile** : Charger → Éditer → Sauvegarder
3. **Produits** : Lister → Détail → Commentaires → Ajouter/Supprimer
4. **Commandes** : Créer → Lister → Détail → Annuler (si pending)
5. **Chat** : Créer conversation → Historique → Messages temps réel
6. **Favoris** : Toggle → Afficher page favoris
7. **Following** : Toggle → Afficher page following

---

## 📋 CHECKLIST DÉTAILLÉE

### Jour 1 (Lundi)
- [ ] Fixer axios interceptors
- [ ] Ajouter JWT decode
- [ ] Vérifier Vite proxy
- [ ] Améliorer authSlice

### Jour 2 (Mardi)
- [ ] Créer pages login/register
- [ ] Implémenter userService.getProfile/updateProfile
- [ ] Créer pages profil view/edit

### Jour 3 (Mercredi)
- [ ] Implémenter productService (tous endpoints)
- [ ] Créer CommentSection composant
- [ ] Adapter ProductDetail avec commentaires

### Jour 4 (Jeudi)
- [ ] Implémenter orderService
- [ ] Créer pages cart, checkout, orders, order-detail

### Jour 5 (Vendredi)
- [ ] Implémenter conversationService
- [ ] Créer conversationSlice Redux
- [ ] Adapter Socket.IO events

### Jour 6 (Lundi)
- [ ] Corriger favoriteService
- [ ] Créer pages favorites, following
- [ ] Tests basic favoris/following

### Jour 7 (Mardi)
- [ ] Tests complets auth
- [ ] Tests complets products/comments
- [ ] Tests complets orders

### Jour 8 (Mercredi)
- [ ] Tests complets chat (REST + Socket)
- [ ] Tests complets favoris
- [ ] Bug fixes & polish

---

## 🎯 SUCCESS CRITERIA

Chaque phase est complète quand :

**Phase 1** : Axios interceptors gèrent 401, 423, 429, 502 correctement  
**Phase 2** : Login/Register fonctionnels, profil éditable  
**Phase 3** : Produits affichent commentaires, ajout/suppression OK  
**Phase 4** : Panier → Checkout → Commandes fonctionnels, statuts affichés  
**Phase 5** : Chat avec historique + messages temps réel synchronisés  
**Phase 6** : Favoris et following bidirectionnels  
**Phase 7** : Tous les cas d'erreur gérés, UX polish complète  

---

## 📞 POINTS DE CONTACT

**En cas de blocage** :
- Backend API URL/format : Vérifier gateway `http://localhost:8000/api`
- JWT format : Vérifier si custom claims dans backend
- Socket.IO events : Coordonner avec backend team sur noms événements
- Rate limits : Documenter les seuils (5 tentatives login, etc.)

---

**Document finalisé ✅**  
**Prêt à coder !** 🚀
