# Rapport d'Amélioration - Usages Redux

**Document** : Analyse et amélioration des usages Redux dans le code  
**Date** : 2024  
**Priorité** : Haute

---

## 📋 Table des matières

1. [Vue d'ensemble](#vue-densemble)
2. [Analyse des usages actuels](#analyse-des-usages-actuels)
3. [Problèmes identifiés](#problèmes-identifiés)
4. [Solutions proposées](#solutions-proposées)
5. [Refactoring par domaine](#refactoring-par-domaine)
6. [Checklist d'implémentation](#checklist-dimplémentation)

---

## 🎯 Vue d'ensemble

L'analyse du code a révélé **107 usages de dispatch** répartis dans **25+ fichiers**. Bien que Redux soit utilisé, il y a plusieurs opportunités d'amélioration :

- **Incohérence** : Mélange de patterns (thunks, actions directes, handleBacketAction)
- **Duplication** : Même logique répétée dans plusieurs fichiers
- **Pas de typage** : Pas de TypeScript pour les actions
- **Pas de validation** : Pas de vérification des payloads
- **Logging** : Beaucoup de console.log() directement dans les reducers
- **Erreurs** : Pas de gestion d'erreur cohérente

---

## 📊 Analyse des usages actuels

### 1. Répartition par domaine

| Domaine | Fichiers | Usages | Problèmes |
|---------|----------|--------|-----------|
| **Authentification** | 4 | 12 | Thunks manuels, pas de createAsyncThunk |
| **Panier** | 5 | 8 | handleBacketAction, pas de typage |
| **Notifications** | 4 | 15 | Dispatch direct, pas de validation |
| **Favoris** | 3 | 4 | toggleFavoriteAsync, pas de gestion d'erreur |
| **Messages** | 2 | 8 | Dispatch direct, pas de normalisation |
| **Socket** | 1 | 20 | Dispatch direct, pas de validation |
| **Autres** | 6 | 40 | Mélange de patterns |

### 2. Patterns utilisés

#### Pattern 1 : Thunks manuels (❌ À améliorer)
```javascript
// ❌ Actuel
export const login = (credentials) => (dispatch) =>
  handleAuthRequest(dispatch, 'auth/user/login', credentials, authSuccess);

// Usages :
dispatch(login({ email, password }));
dispatch(register({ username, email, password }));
dispatch(logout());
```

**Fichiers** : `authSlice.js`, `userSlice.js`  
**Problèmes** :
- Pas de gestion automatique des états pending/fulfilled/rejected
- Code verbeux
- Difficile à tester

#### Pattern 2 : handleBacketAction (❌ À supprimer)
```javascript
// ❌ Actuel
export const handleBacketAction = (type, payload) => {
  switch (type) {
    case 'addProduct':
      return { type: 'basket/addProduct', payload };
    case 'delProduct':
      return { type: 'basket/delProduct', payload };
    case 'reset':
      return { type: 'basket/reset' };
  }
};

// Usages :
dispatch(handleBacketAction('addProduct', product));
dispatch(handleBacketAction('delProduct', orderId));
dispatch(handleBacketAction('reset'));
```

**Fichiers** : `ProductCard.jsx`, `ProductDrawerCard.jsx`, `order-page.jsx`  
**Problèmes** :
- Pas de typage
- Pas de validation
- Pas de IDE autocompletion
- Difficile à déboguer

#### Pattern 3 : Dispatch direct (❌ À améliorer)
```javascript
// ❌ Actuel
dispatch(addNotification({
  id: 1,
  type: 'order',
  title: 'Commande',
  message: 'Votre commande a été confirmée'
}));

dispatch(markAsRead(notificationId));
dispatch(deleteNotification(notificationId));
```

**Fichiers** : `socketMiddleware.js`, `NotificationToast.jsx`, `SocketDemo.jsx`  
**Problèmes** :
- Pas de validation du payload
- Pas de gestion d'erreur
- Pas de logging

#### Pattern 4 : Dispatch avec type string (❌ À améliorer)
```javascript
// ❌ Actuel
dispatch({ type: 'messages/addMessage', payload: fakeMessage });
dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
dispatch({ type: 'MARK_ALL_READ' });
dispatch({ type: 'SET_FILTER', payload: key });
```

**Fichiers** : `SocketDemo.jsx`, `notifications.jsx`  
**Problèmes** :
- Pas de typage
- Pas de validation
- Pas de IDE autocompletion
- Risque d'erreur de typage

---

## ⚠️ Problèmes identifiés

### Problème 1 : Incohérence des patterns

**Situation actuelle** :
```javascript
// Authentification - Thunk manuel
dispatch(login({ email, password }));

// Panier - handleBacketAction
dispatch(handleBacketAction('addProduct', product));

// Notifications - Dispatch direct
dispatch(addNotification(notification));

// Messages - Type string
dispatch({ type: 'messages/addMessage', payload: message });
```

**Impact** :
- Difficile à maintenir
- Pas de cohérence
- Courbe d'apprentissage élevée

**Solution** :
Utiliser un pattern unique : **createAsyncThunk** pour les actions asynchrones et **actions créées** pour les actions synchrones.

---

### Problème 2 : Pas de typage

**Situation actuelle** :
```javascript
// ❌ Pas de typage
dispatch(handleBacketAction('addProduct', product));
// Qu'est-ce que product doit contenir ?
// Quels sont les types valides pour le premier argument ?
```

**Impact** :
- Pas d'autocompletion IDE
- Erreurs à l'exécution
- Difficile à déboguer

**Solution** :
```javascript
// ✅ Avec typage TypeScript
interface AddProductPayload {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

dispatch(addProduct({ id: '1', name: 'Product', price: 100, quantity: 1 }));
```

---

### Problème 3 : Pas de validation

**Situation actuelle** :
```javascript
// ❌ Pas de validation
dispatch(addNotification({
  id: 1,
  type: 'order',
  title: 'Commande',
  message: 'Votre commande a été confirmée'
  // Qu'est-ce qui se passe si on oublie un champ ?
  // Qu'est-ce qui se passe si on envoie un type invalide ?
}));
```

**Impact** :
- Données invalides dans le state
- Bugs difficiles à tracer
- Pas de garantie de cohérence

**Solution** :
```javascript
// ✅ Avec validation Zod
const NotificationSchema = z.object({
  id: z.string().or(z.number()),
  type: z.enum(['order', 'price_drop', 'stock_alert']),
  title: z.string(),
  message: z.string(),
  priority: z.enum(['low', 'medium', 'high']).optional()
});

dispatch(addNotification(NotificationSchema.parse(data)));
```

---

### Problème 4 : Logging en production

**Situation actuelle** :
```javascript
// ❌ Logging en production
addProduct: (state, action) => {
  const product = action.payload;
  state.items.push(product);
  console.log("add product to basket", state.items); // ❌ En production !
}
```

**Impact** :
- Fuite d'informations sensibles
- Performance dégradée
- Difficile à déboguer en production

**Solution** :
```javascript
// ✅ Logging centralisé
addProduct: (state, action) => {
  const product = action.payload;
  state.items.push(product);
  logger.debug('Product added to basket', { productId: product.id });
}
```

---

### Problème 5 : Pas de gestion d'erreur

**Situation actuelle** :
```javascript
// ❌ Pas de gestion d'erreur
export const login = (credentials) => (dispatch) =>
  handleAuthRequest(dispatch, 'auth/user/login', credentials, authSuccess);

// Qu'est-ce qui se passe en cas d'erreur ?
// Comment l'utilisateur est-il informé ?
```

**Impact** :
- Erreurs silencieuses
- Mauvaise UX
- Difficile à déboguer

**Solution** :
```javascript
// ✅ Avec gestion d'erreur
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post('auth/user/login', credentials);
      return response.data;
    } catch (error) {
      return rejectWithValue({
        code: error.response?.status,
        message: error.response?.data?.error
      });
    }
  }
);
```

---

### Problème 6 : Duplication de code

**Situation actuelle** :
```javascript
// ❌ Duplication dans ProductCard.jsx
const handleAddToCart = () => {
  dispatch(handleBacketAction('addProduct', product));
};

// ❌ Duplication dans ProductDrawerCard.jsx
const handleBasket = () => {
  dispatch(handleBacketAction("addProduct", { ...product, quantity }));
};

// ❌ Duplication dans order-page.jsx
const handleCleanBacket = () => {
  dispatch(handleBacketAction('reset'));
};
```

**Impact** :
- Maintenance difficile
- Risque d'incohérence
- Code non DRY

**Solution** :
Créer un hook personnalisé `useBasket()` qui centralise la logique.

---

### Problème 7 : Pas de tests

**Situation actuelle** :
```javascript
// ❌ Aucun test
// Pas de fichier .test.js ou .spec.js pour les actions Redux
```

**Impact** :
- Pas de couverture de test
- Risque de régression
- Difficile à refactoriser

**Solution** :
Ajouter des tests pour chaque action et reducer.

---

## ✅ Solutions proposées

### Solution 1 : Standardiser les patterns

**Objectif** : Utiliser un pattern unique pour toutes les actions

**Avant** :
```javascript
// Mélange de patterns
dispatch(login({ email, password }));           // Thunk manuel
dispatch(handleBacketAction('addProduct', p));  // handleBacketAction
dispatch(addNotification(n));                   // Action directe
dispatch({ type: 'messages/addMessage', p });  // Type string
```

**Après** :
```javascript
// Pattern unique
dispatch(login({ email, password }));           // createAsyncThunk
dispatch(addProductToBasket(product));          // Action créée
dispatch(addNotification(notification));        // Action créée
dispatch(addMessage(message));                  // Action créée
```

---

### Solution 2 : Ajouter le typage TypeScript

**Avant** :
```javascript
// ❌ Pas de typage
dispatch(handleBacketAction('addProduct', product));
```

**Après** :
```javascript
// ✅ Avec typage
interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

dispatch(addProductToBasket(product as Product));
```

---

### Solution 3 : Ajouter la validation

**Avant** :
```javascript
// ❌ Pas de validation
addProduct: (state, action) => {
  state.items.push(action.payload);
}
```

**Après** :
```javascript
// ✅ Avec validation
addProduct: (state, action) => {
  const validated = ProductSchema.parse(action.payload);
  state.items.push(validated);
}
```

---

### Solution 4 : Centraliser le logging

**Avant** :
```javascript
// ❌ Logging partout
console.log("add product to basket", state.items);
console.log("auth response", response);
console.log("auth error", error.response.data);
```

**Après** :
```javascript
// ✅ Logging centralisé
logger.debug('Product added to basket', { productId: product.id });
logger.info('Auth successful', { userId: user.id });
logger.error('Auth failed', error);
```

---

### Solution 5 : Créer des hooks personnalisés

**Avant** :
```javascript
// ❌ Logique répétée
const dispatch = useDispatch();
const handleAddToCart = () => {
  dispatch(handleBacketAction('addProduct', product));
};
```

**Après** :
```javascript
// ✅ Hook personnalisé
const { addProduct } = useBasket();
const handleAddToCart = () => {
  addProduct(product);
};
```

---

### Solution 6 : Ajouter des tests

**Avant** :
```javascript
// ❌ Aucun test
// Pas de fichier .test.js
```

**Après** :
```javascript
// ✅ Tests complets
describe('basketSlice', () => {
  it('should add a product to the basket', () => {
    // Test
  });
});
```

---

## 🔧 Refactoring par domaine

### Domaine 1 : Authentification

**Fichiers** : `authSlice.js`, `auth-btn.jsx`, `user-info.jsx`

**Changements** :
1. Migrer vers `createAsyncThunk`
2. Ajouter la validation Zod
3. Ajouter la gestion d'erreur
4. Ajouter les tests

**Avant** :
```javascript
export const login = (credentials) => (dispatch) =>
  handleAuthRequest(dispatch, 'auth/user/login', credentials, authSuccess);

dispatch(login({ email, password }));
```

**Après** :
```javascript
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const validated = LoginSchema.parse(credentials);
      const response = await api.post('auth/user/login', validated);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error);
    }
  }
);

dispatch(login({ email, password }));
```

---

### Domaine 2 : Panier

**Fichiers** : `basketSlice.js`, `ProductCard.jsx`, `ProductDrawerCard.jsx`, `order-page.jsx`

**Changements** :
1. Supprimer `handleBacketAction`
2. Créer des actions typées
3. Créer un hook `useBasket()`
4. Ajouter la validation

**Avant** :
```javascript
dispatch(handleBacketAction('addProduct', product));
dispatch(handleBacketAction('delProduct', orderId));
dispatch(handleBacketAction('reset'));
```

**Après** :
```javascript
const { addProduct, removeProduct, reset } = useBasket();
addProduct(product);
removeProduct(orderId);
reset();
```

---

### Domaine 3 : Notifications

**Fichiers** : `notificationSlice.js`, `socketMiddleware.js`, `NotificationToast.jsx`

**Changements** :
1. Ajouter la validation Zod
2. Créer des actions spécialisées
3. Ajouter le logging
4. Ajouter les tests

**Avant** :
```javascript
dispatch(addNotification({
  id: 1,
  type: 'order',
  title: 'Commande',
  message: 'Votre commande a été confirmée'
}));
```

**Après** :
```javascript
dispatch(addOrderNotification({
  orderId: '123',
  orderNumber: 'ORD-001',
  status: 'confirmed'
}));
```

---

### Domaine 4 : Favoris

**Fichiers** : `userSlice.js`, `ProductCard.jsx`, `ProductDrawerCard.jsx`

**Changements** :
1. Migrer vers `createAsyncThunk`
2. Ajouter la validation
3. Ajouter la gestion d'erreur
4. Créer un hook `useFavorites()`

**Avant** :
```javascript
dispatch(toggleFavoriteAsync(product.id, user.payload.userId));
```

**Après** :
```javascript
const { toggleFavorite } = useFavorites();
toggleFavorite(product.id);
```

---

### Domaine 5 : Messages

**Fichiers** : `messageSlice.js`, `socketMiddleware.js`, `useSocket.js`

**Changements** :
1. Normaliser l'état
2. Ajouter la validation
3. Créer des actions typées
4. Ajouter les tests

**Avant** :
```javascript
dispatch({ type: 'messages/addMessage', payload: message });
dispatch(socketActions.sendMessage(roomId, message, recipientId));
```

**Après** :
```javascript
dispatch(addMessage(message));
dispatch(sendMessage({ roomId, message, recipientId }));
```

---

## 📋 Checklist d'implémentation

### Phase 1 : Préparation (1 semaine)

- [ ] Créer les schémas Zod pour chaque domaine
- [ ] Créer les types TypeScript
- [ ] Créer le service de logging
- [ ] Créer les hooks personnalisés

### Phase 2 : Authentification (1 semaine)

- [ ] Migrer authSlice vers createAsyncThunk
- [ ] Ajouter la validation Zod
- [ ] Ajouter la gestion d'erreur
- [ ] Mettre à jour les composants
- [ ] Ajouter les tests

### Phase 3 : Panier (1 semaine)

- [ ] Supprimer handleBacketAction
- [ ] Créer les actions typées
- [ ] Créer le hook useBasket()
- [ ] Mettre à jour les composants
- [ ] Ajouter les tests

### Phase 4 : Notifications (1 semaine)

- [ ] Ajouter la validation Zod
- [ ] Créer les actions spécialisées
- [ ] Ajouter le logging
- [ ] Mettre à jour socketMiddleware
- [ ] Ajouter les tests

### Phase 5 : Favoris (3 jours)

- [ ] Migrer vers createAsyncThunk
- [ ] Ajouter la validation
- [ ] Créer le hook useFavorites()
- [ ] Mettre à jour les composants
- [ ] Ajouter les tests

### Phase 6 : Messages (3 jours)

- [ ] Normaliser l'état
- [ ] Ajouter la validation
- [ ] Créer les actions typées
- [ ] Mettre à jour socketMiddleware
- [ ] Ajouter les tests

### Phase 7 : Tests et optimisation (1 semaine)

- [ ] Ajouter les tests unitaires
- [ ] Ajouter les tests d'intégration
- [ ] Vérifier la couverture (>80%)
- [ ] Optimiser les performances
- [ ] Documenter les changements

---

## 📊 Résumé des changements

| Domaine | Avant | Après | Bénéfices |
|---------|-------|-------|-----------|
| **Authentification** | Thunk manuel | createAsyncThunk | Gestion d'état automatique |
| **Panier** | handleBacketAction | Actions typées | Typage, validation |
| **Notifications** | Dispatch direct | Actions spécialisées | Validation, logging |
| **Favoris** | Thunk manuel | createAsyncThunk | Gestion d'état automatique |
| **Messages** | Type string | Actions typées | Typage, validation |
| **Tous** | Pas de tests | Tests complets | Couverture, régression |

---

## 🎯 Résultats attendus

### Avant
- ❌ 107 usages de dispatch incohérents
- ❌ Pas de typage
- ❌ Pas de validation
- ❌ Pas de tests
- ❌ Logging en production
- ❌ Gestion d'erreur incohérente

### Après
- ✅ Pattern unique et cohérent
- ✅ Typage TypeScript complet
- ✅ Validation Zod
- ✅ Tests complets (>80% couverture)
- ✅ Logging centralisé
- ✅ Gestion d'erreur standardisée

---

## 📚 Ressources

- [Redux Toolkit Documentation](https://redux-toolkit.js.org)
- [createAsyncThunk](https://redux-toolkit.js.org/api/createAsyncThunk)
- [Zod Validation](https://zod.dev)
- [TypeScript Redux](https://redux.js.org/usage/usage-with-typescript)
- [Redux Testing](https://redux.js.org/usage/writing-tests)

---

**Document créé le** : 2024  
**Dernière mise à jour** : 2024  
**Statut** : À implémenter
