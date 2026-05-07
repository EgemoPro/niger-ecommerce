# Instructions du Projet - Niger E-commerce

> Ce fichier guide les agents IA pour travailler efficacement sur le projet.

## 🏗️ Stack Technique

- **Frontend**: React 18 + Vite + Tailwind CSS
- **State Management**: Redux Toolkit (17 slices)
- **UI Components**: shadcn/ui (Radix UI)
- **Routing**: React Router v6
- **HTTP Client**: Axios with interceptors
- **Real-time**: Socket.IO client

### Commandes Setup

```bash
# Installation dépendances
npm install

# Développement
npm run dev        # Lance sur port 5173

# Production
npm run build      # Build pour production
npm run lint      # ESLint check

# Tests
npm run preview   # Preview du build
```

---

## 📁 Structure du Projet

### Fichiers clés

| Emplacement | Usage |
|-------------|-------|
| `src/main.jsx` | Point d'entrée - routes + redux + auth check |
| `src/routes/main.routes.jsx` | Toutes les routes de l'application |
| `src/redux/store.js` | Store Redux - 17 slices |
| `src/lib/axios.js` | Instance API avec interceptors |
| `amelioration/CARTOGRAPHIE.md` | Référence rapide du code |
| `amelioration/FRONTEND_INTEGRATION_GUIDE.md` | Guide API backend |
| `amelioration/RESUME_INTERVENTIONS_07052026.md` | Historique modifications |

### Répertoires principaux

```
src/
├── pages/          # 37 pages (home, products, orders, profile, favoris, shop, chat...)
├── components/     # 28+ composants (+ sous-dossiers: auth/, shop/, chat/...)
├── redux/
│   ├── Slices/     # 17 slices (auth, basket, orders, favoris, user, profile, etc.)
│   ├── schemas/    # Zod schemas validation
│   └── utils/      # Fonctions utilitaires
├── hooks/          # 6 custom hooks (useBasket, useSocket, useNotifications...)
├── lib/            # axios, utils, firebase
└── services/       # logger, conversation
```

---

## 🎯 Méthodologie d'Intégration

### Avant de coder: CONSULTER LA CARTOGRAPHIE

**TOUJOURS** consulter `amelioration/CARTOGRAPHIE.md` avant de:
1. Ajouter une nouvelle route → vérifier l'emplacement dans `main.routes.jsx`
2. Ajouter un slice Redux → vérifier `store.js` pour les slices existants
3. Ajouter une page → vérifier le dossier `pages/`
4. Ajouter un composant → vérifier le dossier `components/`

### Processus d'intégration API

#### 1. Identifier l'endpoint
Consulter `amelioration/FRONTEND_INTEGRATION_GUIDE.md` pour trouver:
- L'endpoint exact (ex: `POST /user/favorites`)
- Le format de requête et réponse
- Les paramètres d'authentification

#### 2. Vérifier l'existant
```bash
# Rechercher dans le code existant
grep -r "endpoint" src/
# ou utiliser glob/grep tools
```

#### 3. Choisir le pattern d'intégration

| Type d'intégration | Where to add |
|-------------------|--------------|
| CRUD API complet | Nouveau slice dans `redux/Slices/` |
| Action simple | `redux/method.js` (fonctions pures) |
| Query données | `hooks/use-NomFeature.js` |
| UI composants | `components/` ou `components/ui/` |

#### 4. Intégrer étape par étape

```javascript
// Étape 1: Ajouter la fonction API dans un service ou method.js
const toggleFavorite = async ({ userId, productId }) => {
  const response = await api.post('/user/favorites', { userId, productId });
  return response.data;
};

// Étape 2: Intégrer dans le slice Redux existant ou créer nouveau
export const favoriteSlice = createSlice({
  name: 'favorite',
  initialState,
  reducers: {
    toggleFavoriteSuccess: (state, action) => {
      state.favorites = action.payload.favorites;
    }
  }
});

// Étape 3: Créer thunk async si nécessaire
export const toggleFavoriteAsync = (userId, productId) => async (dispatch) => {
  const result = await toggleFavoriteAPI(userId, productId);
  dispatch(toggleFavoriteSuccess(result));
};

// Étape 4: Intégrer dans le composant
const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const handleToggle = () => dispatch(toggleFavoriteAsync(userId, product.id));
};
```

---

## 📋 Patterns et Conventions

### Structure API (selon FRONTEND_INTEGRATION_GUIDE)

```javascript
// Response standard
{
  success: boolean,
  error: string | null,
  payload: any
}

// Erreurs HTTP à gérer
- 401: Token expiré → redirect /login
- 404: Ressource non trouvée
- 409: Conflit (ex: stock insuffisant)
- 500: Erreur serveur
```

### State Redux

```javascript
// Structure typique d'un slice
{
  items: [],           // Données principales
  isLoading: boolean,  // État chargement
  error: string | null // Erreur
}
```

### Composants React

```javascript
// Fonctionnel uniquement (pas de class components)
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// Props avec valeurs par défaut
const Button = ({ variant = 'default', size = 'md', ...props }) => {};

// Garder les composants purs et simples
```

---

## ⚠️ Règles de sécurité

### NE PAS Modifier

1. **`package.json`** - Dependances sauf si explicitement demandé
2. **`vite.config.js`** - Configuration build
3. **Design UI** - Le design ne doit pas être modifié, seulement l'intégration API

### À FAIRE avant modification

1. **Consulter la cartographie** - Toujours vérifier l'emplacement existant
2. **Vérifier les slices** - Utiliser les slices existants avant d'en créer
3. **Handle les erreurs API** - Gérer 401, 404, 409, 500
4. **Tester avec curl** - Vérifier l'API avant l'intégration frontend

### Vérification Mandatory

```bash
# Tester l'endpoint API avec curl avant integration
curl -s "http://localhost:8000/endpoint" -H "Authorization: Bearer TOKEN"
```

---

## 📊 Outils de debug

### Chrome DevTools MCP

Pour tester en temps réel:
```javascript
// Dans Chrome DevTools:
// - Console logs
// - Network requests
// - Elements snapshot
```

### Tests locales

```bash
# ESLint
npm run lint

# Build check
npm run build
```

---

## 📝 Conventions de nommage

| Type | Convention | Exemple |
|------|------------|---------|
| Fichiers | kebab-case | `user-profile.jsx` |
| Composants | PascalCase | `UserProfile` |
| Fonctions | camelCase | `fetchUserOrders` |
| Constantes | UPPER_SNAKE | `LOCALSTORAGE_KEY` |
| CSS classes | tailwind utilities | `className="flex items-center gap-2"` |

---

## 🗂️ Documentation

| Fichier | Usage |
|---------|-------|
| `CARTOGRAPHIE.md` | Navigation rapide dans le code |
| `FRONTEND_INTEGRATION_GUIDE.md` | Reference API complete |
| `RESUME_INTERVENTIONS_07052026.md` | Historique modifications |

---

*Dernière mise à jour: Mai 2026*