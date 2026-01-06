# Améliorations Redux - Niger E-commerce

**Document** : Plan d'amélioration de l'implémentation Redux  
**Date** : 2024  
**Priorité** : Haute

---

## 📋 Table des matières

1. [Vue d'ensemble](#vue-densemble)
2. [Problèmes identifiés](#problèmes-identifiés)
3. [Solutions proposées](#solutions-proposées)
4. [Implémentation](#implémentation)
5. [Exemples de code](#exemples-de-code)
6. [Checklist](#checklist)

---

## 🎯 Vue d'ensemble

L'implémentation Redux actuelle fonctionne bien mais présente plusieurs opportunités d'amélioration :

- **Pas de createAsyncThunk** : Utilisation de thunks manuels
- **Pas de normalisation** : État imbriqué et difficile à mettre à jour
- **Pas de sélecteurs memoizés** : Performance impactée
- **Gestion d'erreur incohérente** : Pas de standardisation
- **Pas de validation** : Risque de données invalides
- **Logging en production** : Beaucoup de console.log()
- **Pas de tests** : Aucune couverture
- **Duplication de code** : Logique répétée

---

## ⚠️ Problèmes identifiés

### 1. Pas de createAsyncThunk

**Problème** :
```javascript
// ❌ Actuel - Thunk manuel
export const login = (credentials) => (dispatch) =>
  handleAuthRequest(dispatch, 'auth/user/login', credentials, authSuccess);
```

**Impact** :
- Pas de gestion automatique des états pending/fulfilled/rejected
- Code verbeux et répétitif
- Difficile à tester

**Solution** :
```javascript
// ✅ Avec createAsyncThunk
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post('auth/user/login', credentials);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error);
    }
  }
);
```

---

### 2. Pas de normalisation d'état

**Problème** :
```javascript
// ❌ État imbriqué
{
  notifications: [
    {
      id: 1,
      type: 'order',
      data: {
        orderId: 123,
        orderNumber: 'ORD-001',
        status: 'shipped'
      }
    }
  ]
}
```

**Impact** :
- Difficile de mettre à jour une notification spécifique
- Duplication de données
- Performance dégradée

**Solution** :
```javascript
// ✅ État normalisé
{
  notifications: {
    byId: {
      '1': {
        id: 1,
        type: 'order',
        orderId: 123
      }
    },
    allIds: ['1']
  },
  orders: {
    byId: {
      '123': {
        id: 123,
        number: 'ORD-001',
        status: 'shipped'
      }
    },
    allIds: ['123']
  }
}
```

---

### 3. Pas de sélecteurs memoizés

**Problème** :
```javascript
// ❌ Recalcul à chaque rendu
export const basketSelectors = {
  selectItems: (state) => state.basket.items,
  selectTotalPrice: (state) => 
    state.basket.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
};
```

**Impact** :
- Recalcul inutile du prix total
- Re-render des composants
- Performance dégradée

**Solution** :
```javascript
// ✅ Avec createSelector
import { createSelector } from '@reduxjs/toolkit';

export const selectBasketItems = (state) => state.basket.items;

export const selectBasketTotalPrice = createSelector(
  [selectBasketItems],
  (items) => items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
);
```

---

### 4. Gestion d'erreur incohérente

**Problème** :
```javascript
// ❌ Incohérent
dispatch(authFailure('Une erreur est survenue.'));
dispatch(authFailure(error.response?.data?.error));
dispatch(setError('Erreur lors de la vérification'));
```

**Impact** :
- Messages d'erreur non standardisés
- Difficile à gérer globalement
- Mauvaise UX

**Solution** :
```javascript
// ✅ Standardisé
const errorSlice = createSlice({
  name: 'error',
  initialState: {
    message: null,
    code: null,
    timestamp: null
  },
  reducers: {
    setError: (state, action) => {
      state.message = action.payload.message;
      state.code = action.payload.code;
      state.timestamp = new Date().toISOString();
    },
    clearError: (state) => {
      state.message = null;
      state.code = null;
      state.timestamp = null;
    }
  }
});
```

---

### 5. Pas de validation

**Problème** :
```javascript
// ❌ Pas de validation
addProduct: (state, action) => {
  state.items.push(action.payload); // Peut être n'importe quoi
}
```

**Impact** :
- Données invalides dans le state
- Bugs difficiles à tracer
- Pas de type safety

**Solution** :
```javascript
// ✅ Avec validation
import { z } from 'zod';

const ProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number().positive(),
  quantity: z.number().int().positive()
});

addProduct: (state, action) => {
  const validated = ProductSchema.parse(action.payload);
  state.items.push(validated);
}
```

---

### 6. Logging en production

**Problème** :
```javascript
// ❌ Beaucoup de console.log()
console.log("add product to basket", state.items);
console.log("auth response", response);
console.log("auth error", error.response.data);
```

**Impact** :
- Fuite d'informations sensibles
- Difficile à déboguer en production
- Performance impactée

**Solution** :
```javascript
// ✅ Logging centralisé
const logger = {
  debug: (message, data) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[DEBUG] ${message}`, data);
    }
  },
  error: (message, error) => {
    console.error(`[ERROR] ${message}`, error);
    // Envoyer à Sentry en production
    if (process.env.NODE_ENV === 'production') {
      Sentry.captureException(error);
    }
  }
};
```

---

### 7. Pas de tests

**Problème** :
```javascript
// ❌ Aucun test
// Pas de fichier .test.js ou .spec.js
```

**Impact** :
- Pas de couverture de test
- Risque de régression
- Difficile à refactoriser

**Solution** :
```javascript
// ✅ Tests avec Vitest
import { describe, it, expect } from 'vitest';
import basketReducer, { addProduct } from './basketSlice';

describe('basketSlice', () => {
  it('should add a product to the basket', () => {
    const initialState = { items: [], totalPrice: 0, totalItems: 0 };
    const product = { id: '1', name: 'Product', price: 100, quantity: 1 };
    
    const newState = basketReducer(initialState, addProduct(product));
    
    expect(newState.items).toHaveLength(1);
    expect(newState.totalPrice).toBe(100);
  });
});
```

---

### 8. Duplication de code

**Problème** :
```javascript
// ❌ Logique répétée
// Dans basketSlice
state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
state.totalPrice = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

// Dans userSlice
state.cartTotal = state.cart.reduce((sum, item) => sum + item.quantity, 0);
state.cartPrice = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
```

**Impact** :
- Maintenance difficile
- Risque d'incohérence
- Code non DRY

**Solution** :
```javascript
// ✅ Utilitaires réutilisables
export const calculateCartTotals = (items) => ({
  totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
  totalPrice: items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
});

// Utilisation
addProduct: (state, action) => {
  state.items.push(action.payload);
  const totals = calculateCartTotals(state.items);
  state.totalItems = totals.totalItems;
  state.totalPrice = totals.totalPrice;
}
```

---

## ✅ Solutions proposées

### 1. Migrer vers createAsyncThunk

**Étapes** :
1. Créer des thunks avec `createAsyncThunk`
2. Gérer les états pending/fulfilled/rejected
3. Supprimer les thunks manuels
4. Ajouter des tests

**Fichiers à modifier** :
- `src/redux/Slices/authSlice.js`
- `src/redux/Slices/userSlice.js`
- `src/redux/Slices/initialData.js`

---

### 2. Normaliser l'état

**Étapes** :
1. Analyser la structure actuelle
2. Créer des schémas normalisés
3. Mettre à jour les reducers
4. Créer des sélecteurs pour dénormaliser

**Fichiers à modifier** :
- `src/redux/Slices/notificationSlice.js`
- `src/redux/Slices/messageSlice.js`
- `src/redux/Slices/productSlice.js`

---

### 3. Ajouter des sélecteurs memoizés

**Étapes** :
1. Importer `createSelector` de Redux Toolkit
2. Créer des sélecteurs memoizés
3. Remplacer les sélecteurs simples
4. Tester la performance

**Fichiers à modifier** :
- Tous les fichiers `Slices/*.js`

---

### 4. Standardiser la gestion d'erreur

**Étapes** :
1. Créer un slice `errorSlice.js`
2. Définir une structure d'erreur standard
3. Mettre à jour tous les slices
4. Créer un middleware d'erreur global

**Fichiers à créer** :
- `src/redux/Slices/errorSlice.js`
- `src/redux/middleware/errorMiddleware.js`

---

### 5. Ajouter la validation

**Étapes** :
1. Installer Zod (déjà présent)
2. Créer des schémas de validation
3. Valider les payloads dans les reducers
4. Ajouter des tests de validation

**Fichiers à créer** :
- `src/redux/schemas/` (dossier)
- `src/redux/schemas/product.schema.js`
- `src/redux/schemas/order.schema.js`
- etc.

---

### 6. Centraliser le logging

**Étapes** :
1. Créer un service de logging
2. Remplacer tous les console.log()
3. Ajouter Sentry en production
4. Configurer les niveaux de log

**Fichiers à créer** :
- `src/services/logger.js`

---

### 7. Ajouter des tests

**Étapes** :
1. Installer Vitest et React Testing Library
2. Créer des tests pour chaque slice
3. Créer des tests pour les sélecteurs
4. Créer des tests pour les middlewares

**Fichiers à créer** :
- `src/redux/Slices/__tests__/` (dossier)
- `src/redux/middleware/__tests__/` (dossier)

---

### 8. Réduire la duplication

**Étapes** :
1. Identifier les patterns répétés
2. Créer des utilitaires réutilisables
3. Refactoriser les slices
4. Documenter les utilitaires

**Fichiers à créer** :
- `src/redux/utils/` (dossier)
- `src/redux/utils/cartCalculations.js`
- `src/redux/utils/errorHandling.js`
- etc.

---

## 🔧 Implémentation

### Phase 1 : Préparation (1 semaine)

1. **Créer la structure de dossiers**
   ```
   src/redux/
   ├── Slices/
   ├── middleware/
   ├── schemas/
   ├── utils/
   ├── __tests__/
   └── store.js
   ```

2. **Installer les dépendances manquantes**
   ```bash
   npm install vitest @testing-library/react @testing-library/jest-dom
   ```

3. **Créer les fichiers de base**
   - `src/redux/schemas/index.js`
   - `src/redux/utils/index.js`
   - `src/services/logger.js`

---

### Phase 2 : Refactoring (2-3 semaines)

1. **Migrer authSlice vers createAsyncThunk**
2. **Créer les schémas de validation**
3. **Ajouter les sélecteurs memoizés**
4. **Centraliser le logging**

---

### Phase 3 : Tests (1-2 semaines)

1. **Ajouter les tests unitaires**
2. **Ajouter les tests d'intégration**
3. **Vérifier la couverture**

---

### Phase 4 : Optimisation (1 semaine)

1. **Normaliser l'état**
2. **Optimiser les performances**
3. **Documenter les changements**

---

## 💻 Exemples de code

### Exemple 1 : createAsyncThunk

```javascript
// ✅ Nouveau authSlice avec createAsyncThunk
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../lib/axios';

export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post('auth/user/login', credentials);
      const { token, ...user } = response.data;
      localStorage.setItem('jwt', token);
      return { user, token };
    } catch (error) {
      return rejectWithValue({
        code: error.response?.status,
        message: error.response?.data?.error || 'Login failed'
      });
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    isLoading: false,
    error: null
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

export default authSlice;
```

---

### Exemple 2 : Sélecteurs memoizés

```javascript
// ✅ Sélecteurs memoizés
import { createSelector } from '@reduxjs/toolkit';

const selectBasketState = (state) => state.basket;
const selectBasketItems = createSelector(
  [selectBasketState],
  (basket) => basket.items
);

export const selectBasketTotalPrice = createSelector(
  [selectBasketItems],
  (items) => items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
);

export const selectBasketTotalItems = createSelector(
  [selectBasketItems],
  (items) => items.reduce((sum, item) => sum + item.quantity, 0)
);

export const selectBasketWithTotals = createSelector(
  [selectBasketItems, selectBasketTotalPrice, selectBasketTotalItems],
  (items, totalPrice, totalItems) => ({
    items,
    totalPrice,
    totalItems
  })
);
```

---

### Exemple 3 : Validation avec Zod

```javascript
// ✅ Schémas de validation
import { z } from 'zod';

export const ProductSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  price: z.number().positive(),
  quantity: z.number().int().positive(),
  image: z.string().url().optional()
});

export const BasketItemSchema = ProductSchema.extend({
  quantity: z.number().int().min(1).max(100)
});

export const OrderSchema = z.object({
  id: z.string(),
  items: z.array(BasketItemSchema),
  totalPrice: z.number().positive(),
  status: z.enum(['pending', 'confirmed', 'shipped', 'delivered']),
  createdAt: z.string().datetime()
});

// Utilisation dans le reducer
addProduct: (state, action) => {
  try {
    const validated = BasketItemSchema.parse(action.payload);
    state.items.push(validated);
  } catch (error) {
    state.error = error.message;
  }
}
```

---

### Exemple 4 : Logging centralisé

```javascript
// ✅ Service de logging
class Logger {
  debug(message, data) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[DEBUG] ${message}`, data);
    }
  }

  info(message, data) {
    console.info(`[INFO] ${message}`, data);
  }

  warn(message, data) {
    console.warn(`[WARN] ${message}`, data);
  }

  error(message, error) {
    console.error(`[ERROR] ${message}`, error);
    
    if (process.env.NODE_ENV === 'production') {
      // Envoyer à Sentry
      Sentry.captureException(error, {
        tags: { message }
      });
    }
  }
}

export const logger = new Logger();

// Utilisation
logger.debug('Adding product to basket', product);
logger.error('Failed to fetch products', error);
```

---

### Exemple 5 : Tests

```javascript
// ✅ Tests avec Vitest
import { describe, it, expect, beforeEach } from 'vitest';
import basketReducer, { addProduct, updateQuantity } from './basketSlice';

describe('basketSlice', () => {
  let initialState;

  beforeEach(() => {
    initialState = {
      items: [],
      totalItems: 0,
      totalPrice: 0,
      isLoading: false,
      error: null
    };
  });

  describe('addProduct', () => {
    it('should add a new product to the basket', () => {
      const product = {
        id: '1',
        name: 'Product 1',
        price: 100,
        quantity: 1
      };

      const newState = basketReducer(initialState, addProduct(product));

      expect(newState.items).toHaveLength(1);
      expect(newState.items[0]).toEqual(product);
      expect(newState.totalItems).toBe(1);
      expect(newState.totalPrice).toBe(100);
    });

    it('should increment quantity if product already exists', () => {
      const product = {
        id: '1',
        name: 'Product 1',
        price: 100,
        quantity: 1
      };

      let state = basketReducer(initialState, addProduct(product));
      state = basketReducer(state, addProduct(product));

      expect(state.items).toHaveLength(1);
      expect(state.items[0].quantity).toBe(2);
      expect(state.totalPrice).toBe(200);
    });
  });

  describe('updateQuantity', () => {
    it('should update product quantity', () => {
      const product = {
        id: '1',
        name: 'Product 1',
        price: 100,
        quantity: 1
      };

      let state = basketReducer(initialState, addProduct(product));
      state = basketReducer(state, updateQuantity({ id: '1', quantity: 5 }));

      expect(state.items[0].quantity).toBe(5);
      expect(state.totalPrice).toBe(500);
    });

    it('should remove product if quantity is 0', () => {
      const product = {
        id: '1',
        name: 'Product 1',
        price: 100,
        quantity: 1
      };

      let state = basketReducer(initialState, addProduct(product));
      state = basketReducer(state, updateQuantity({ id: '1', quantity: 0 }));

      expect(state.items).toHaveLength(0);
      expect(state.totalPrice).toBe(0);
    });
  });
});
```

---

## ✅ Checklist

### Phase 1 : Préparation
- [ ] Créer la structure de dossiers
- [ ] Installer les dépendances
- [ ] Créer les fichiers de base
- [ ] Documenter le plan

### Phase 2 : Refactoring
- [ ] Migrer authSlice vers createAsyncThunk
- [ ] Migrer userSlice vers createAsyncThunk
- [ ] Créer les schémas de validation
- [ ] Ajouter les sélecteurs memoizés
- [ ] Centraliser le logging
- [ ] Créer les utilitaires réutilisables

### Phase 3 : Tests
- [ ] Ajouter les tests unitaires pour les slices
- [ ] Ajouter les tests pour les sélecteurs
- [ ] Ajouter les tests pour les middlewares
- [ ] Vérifier la couverture (>80%)

### Phase 4 : Optimisation
- [ ] Normaliser l'état
- [ ] Optimiser les performances
- [ ] Documenter les changements
- [ ] Faire une revue de code

### Phase 5 : Déploiement
- [ ] Tester en développement
- [ ] Tester en staging
- [ ] Déployer en production
- [ ] Monitorer les erreurs

---

## 📚 Ressources

- [Redux Toolkit Documentation](https://redux-toolkit.js.org)
- [Redux Thunk](https://github.com/reduxjs/redux-thunk)
- [Reselect](https://github.com/reduxjs/reselect)
- [Zod Validation](https://zod.dev)
- [Vitest](https://vitest.dev)
- [Redux DevTools](https://github.com/reduxjs/redux-devtools)

---

**Document créé le** : 2024  
**Dernière mise à jour** : 2024  
**Statut** : À implémenter
