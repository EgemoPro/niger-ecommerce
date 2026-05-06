# 🛒 Guide d'intégration Frontend — Backend E-Commerce Microservices

**Version :** Avril 2026  
**Gateway :** `http://localhost:8000`  
**Format réponses :** Toutes les réponses suivent le format `{ success, error, payload }`

---

## 📋 Sommaire

1. [Configuration de base](#1-configuration-de-base)
2. [Authentification User](#2-authentification-user)
3. [Authentification Store (Vendeur)](#3-authentification-store-vendeur)
4. [Profil Utilisateur](#4-profil-utilisateur)
5. [Configuration Boutique](#5-configuration-boutique)
6. [Catalogue Produits](#6-catalogue-produits)
7. [Commentaires Produits](#7-commentaires-produits)
8. [Commandes](#8-commandes)
9. [Conversations & Chat REST](#9-conversations--chat-rest)
10. [Chat Temps Réel (Socket.IO)](#10-chat-temps-réel-socketio)
11. [Favoris & Following](#11-favoris--following)
12. [Gestion des erreurs globale](#12-gestion-des-erreurs-globale)
13. [Cookies & Tokens](#13-cookies--tokens)
14. [Checklist d'intégration étape par étape](#14-checklist-dintégration-étape-par-étape)

---

## 1. Configuration de base

### Instance Axios recommandée

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
  withCredentials: true, // Indispensable pour les cookies JWT httpOnly
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur — injecter le token dans chaque requête
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercepteur — gérer les erreurs globalement
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### Format de réponse universel

```typescript
interface ApiResponse<T> {
  success: boolean;
  error: string | null;  // Toujours une string — jamais un tableau
  payload: T | null;
  token?: string; // Présent uniquement sur login/register
}
```

> **Important :** `error` est **toujours une string** ou `null`. Vous n'avez jamais à gérer un tableau d'erreurs. En cas d'erreurs de validation multiples, elles sont jointes en une seule string séparée par des virgules.

---

## 2. Authentification User

### 2.1 Inscription

**Endpoint :** `POST /auth/user/register`  
**Auth :** ❌ Publique

```javascript
const register = async ({ email, password, username, firstName, lastName }) => {
  const response = await api.post('/auth/user/register', {
    email,
    password,       // Min 8 chars, 1 maj, 1 chiffre, 1 symbole
    username,       // Min 3 chars
    firstName,      // Optionnel
    lastName,       // Optionnel
  });
  return response.data;
};
```

**✅ Réponse succès — 201**
```json
{
  "success": true,
  "error": null,
  "payload": {
    "_id": "664a1b2c3d4e5f6a7b8c9d0e",
    "email": "user@example.com",
    "username": "johndoe",
    "firstName": "John",
    "lastName": "Doe",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=johndoe",
    "emailVerified": false,
    "isActive": true,
    "loginAttempts": 0,
    "createdAt": "2026-04-15T10:00:00.000Z",
    "updatedAt": "2026-04-15T10:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Cookie httpOnly automatiquement posé :** `jwt=<token>; HttpOnly; SameSite=Strict`

**❌ Erreurs possibles**

| Code | Cas | Réponse |
|------|-----|---------|
| 400 | Email/password/username manquant | `{ "success": false, "error": "Email, mot de passe et nom d'utilisateur sont requis.", "payload": null }` |
| 400 | Password trop faible | `{ "success": false, "error": "mot de passe invalide, une lettre majuscule, un chiffre et un caractère spécial", "payload": null }` |
| 409 | Email déjà utilisé | `{ "success": false, "error": "Cet email est déjà utilisé.", "payload": null }` |
| 409 | Username déjà utilisé | `{ "success": false, "error": "Le nom d'utilisateur ou l'email est déjà utilisé.", "payload": null }` |
| 500 | Erreur serveur | `{ "success": false, "error": "Erreur lors de l'inscription.", "payload": null }` |

```javascript
// Gestion d'erreur recommandée
try {
  const data = await register({ email, password, username });
  localStorage.setItem('token', data.token);
  // Rediriger vers le dashboard
} catch (err) {
  const message = err.response?.data?.error || 'Erreur réseau';
  setError(message);
}
```

---

### 2.2 Connexion

**Endpoint :** `POST /auth/user/login`  
**Auth :** ❌ Publique  
**Rate limit :** 5 tentatives échouées / 15 minutes par IP

```javascript
const login = async ({ email, password }) => {
  const response = await api.post('/auth/user/login', { email, password });
  return response.data;
};
```

**✅ Réponse succès — 200**
```json
{
  "success": true,
  "error": null,
  "payload": {
    "_id": "664a1b2c3d4e5f6a7b8c9d0e",
    "email": "user@example.com",
    "username": "johndoe",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=johndoe",
    "isActive": true,
    "lastLogin": "2026-04-15T10:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**❌ Erreurs possibles**

| Code | Cas | Réponse |
|------|-----|---------|
| 401 | Email ou password incorrect | `{ "success": false, "error": "Email ou mot de passe incorrect", "payload": null }` |
| 423 | Compte verrouillé (5 échecs) | `{ "success": false, "error": "Compte temporairement verrouillé. Réessayez plus tard.", "payload": null }` |
| 429 | Rate limit atteint | `{ "success": false, "error": "Trop de requêtes depuis cette IP, veuillez réessayer plus tard.", "payload": null }` |
| 500 | Erreur serveur | `{ "success": false, "error": "Erreur lors de la connexion", "payload": null }` |

---

### 2.3 Déconnexion

**Endpoint :** `POST /auth/user/logout`  
**Auth :** ❌ Publique (pas besoin du token)

```javascript
const logout = async () => {
  await api.post('/auth/user/logout');
  localStorage.removeItem('token');
  // Rediriger vers login
};
```

**✅ Réponse succès — 200**
```json
{
  "success": true,
  "error": null,
  "payload": null
}
```

Le cookie `jwt` est effacé côté serveur.

---

### 2.4 Profil User (Auth)

**Endpoint :** `GET /auth/user/profile`  
**Auth :** ✅ JWT requis

```javascript
const getAuthProfile = async () => {
  const response = await api.get('/auth/user/profile');
  return response.data.payload;
};
```

**✅ Réponse succès — 200**
```json
{
  "success": true,
  "error": null,
  "payload": {
    "_id": "664a1b2c3d4e5f6a7b8c9d0e",
    "email": "user@example.com",
    "username": "johndoe",
    "firstName": "John",
    "lastName": "Doe",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=johndoe",
    "phoneNumber": null,
    "emailVerified": false,
    "isActive": true,
    "lastLogin": "2026-04-15T10:00:00.000Z",
    "createdAt": "2026-04-15T10:00:00.000Z"
  }
}
```

**❌ Erreurs possibles**

| Code | Cas |
|------|-----|
| 401 | Token absent ou invalide |
| 404 | Utilisateur introuvable |

---

## 3. Authentification Store (Vendeur)

### 3.1 Inscription Store

**Endpoint :** `POST /auth/store/register`  
**Auth :** ❌ Publique

```javascript
const registerStore = async ({ email, password, fullname }) => {
  const response = await api.post('/auth/store/register', {
    email,
    password,   // Min 6 chars, 1 maj, 1 chiffre, 1 symbole
    fullname,   // Nom de la boutique, min 2 chars
  });
  return response.data;
};
```

**✅ Réponse succès — 201**
```json
{
  "success": true,
  "error": null,
  "payload": {
    "_id": "665b2c3d4e5f6a7b8c9d0e1f",
    "fullname": "Ma Boutique",
    "email": "boutique@example.com",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
    "role": "vendor",
    "phone": "",
    "bio": "",
    "createdAt": "2026-04-15T10:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**❌ Erreurs possibles**

| Code | Cas |
|------|-----|
| 400 | fullname manquant ou password trop faible |
| 409 | Email déjà utilisé |

---

### 3.2 Connexion Store

**Endpoint :** `POST /auth/store/login`  
**Auth :** ❌ Publique  
**Rate limit :** 5 tentatives échouées / 15 minutes

```javascript
const loginStore = async ({ email, password }) => {
  const response = await api.post('/auth/store/login', { email, password });
  return response.data;
};
```

**✅ Réponse succès — 200**

La réponse contient les données Auth **ET** les données de configuration StoreBackendAPI consolidées.

```json
{
  "success": true,
  "error": null,
  "payload": {
    "_id": "665b2c3d4e5f6a7b8c9d0e1f",
    "fullname": "Ma Boutique",
    "email": "boutique@example.com",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
    "role": "vendor",
    "storeData": {
      "_id": "665c3d4e5f6a7b8c9d0e1f20",
      "storeId": "665b2c3d4e5f6a7b8c9d0e1f",
      "description": "",
      "category": "other",
      "currency": "XOF",
      "language": "fr",
      "paymentMethods": {
        "cash": { "enabled": true },
        "mobileMoney": { "enabled": false },
        "stripe": { "enabled": false }
      },
      "stats": {
        "totalProducts": 0,
        "totalOrders": 0,
        "totalRevenue": 0,
        "averageRating": 0
      }
    }
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

> **Note :** `storeData` peut être `null` si StoreBackendAPI est temporairement indisponible. Le login réussit quand même.

---

### 3.3 Profil Store

**Endpoint :** `GET /auth/store/profile`  
**Auth :** ✅ JWT requis

Même structure que le login — retourne Auth + storeData consolidés.

---

### 3.4 Modifier le profil Store

**Endpoint :** `PUT /auth/store/profile`  
**Auth :** ✅ JWT requis

```javascript
const updateStoreProfile = async ({ fullname, phone, bio, avatar }) => {
  const response = await api.put('/auth/store/profile', {
    fullname,  // Optionnel
    phone,     // Optionnel
    bio,       // Optionnel
    avatar,    // Optionnel (URL)
  });
  return response.data.payload;
};
```

**✅ Réponse succès — 200**
```json
{
  "success": true,
  "error": null,
  "payload": {
    "_id": "665b2c3d4e5f6a7b8c9d0e1f",
    "fullname": "Ma Boutique Modifiée",
    "phone": "+22790000001",
    "bio": "La meilleure boutique de Niamey"
  }
}
```

**❌ Erreurs possibles**

| Code | Cas |
|------|-----|
| 400 | Aucun champ envoyé |
| 401 | Token absent ou invalide |
| 404 | Store introuvable |

---

### 3.5 Changer le mot de passe Store

**Endpoint :** `PATCH /auth/store/password`  
**Auth :** ✅ JWT requis

```javascript
const changePassword = async ({ currentPassword, newPassword }) => {
  const response = await api.patch('/auth/store/password', {
    currentPassword,
    newPassword,
  });
  return response.data;
};
```

**✅ Réponse succès — 200**
```json
{ "success": true, "error": null, "payload": null }
```

**❌ Erreurs possibles**

| Code | Cas |
|------|-----|
| 400 | currentPassword ou newPassword manquant |
| 401 | Mot de passe actuel incorrect |

---

### 3.6 Supprimer le compte Store

**Endpoint :** `DELETE /auth/store/account`  
**Auth :** ✅ JWT requis

```javascript
const deleteStoreAccount = async () => {
  await api.delete('/auth/store/account');
  localStorage.removeItem('token');
};
```

Supprime le compte Auth ET la configuration StoreBackendAPI. Cookie effacé.

---

## 4. Profil Utilisateur

Le profil utilisateur est géré par UsersAPI (port 3000) — distinct des données Auth.

### 4.1 Obtenir le profil

**Endpoint :** `GET /user/profile/:userId`  
**Auth :** ✅ JWT requis

```javascript
const getUserProfile = async (userId) => {
  const response = await api.get(`/user/profile/${userId}`);
  return response.data.payload;
};
```

**✅ Ré
ponse succès — 200**
```json
{
  "success": true,
  "error": null,
  "payload": {
    "_id": "664a1b2c3d4e5f6a7b8c9d0f",
    "userId": "664a1b2c3d4e5f6a7b8c9d0e",
    "username": "johndoe",
    "bio": "",
    "avatar": null,
    "phoneNumber": null,
    "favorites": [],
    "following": [],
    "createdAt": "2026-04-15T10:00:00.000Z"
  }
}
```

> **Lazy creation :** Si le profil n'existe pas encore, il est créé automatiquement avec les valeurs par défaut. Aucun 404 possible.

---

### 4.2 Modifier le profil

**Endpoint :** `PUT /user/profile/:userId`  
**Auth :** ✅ JWT requis

```javascript
const updateUserProfile = async (userId, { username, bio, avatar, phoneNumber }) => {
  const response = await api.put(`/user/profile/${userId}`, {
    username,     // Optionnel
    bio,          // Optionnel, max 500 chars
    avatar,       // Optionnel (URL)
    phoneNumber,  // Optionnel
  });
  return response.data.payload;
};
```

**✅ Réponse succès — 200**
```json
{
  "success": true,
  "error": null,
  "payload": {
    "userId": "664a1b2c3d4e5f6a7b8c9d0e",
    "username": "johndoe_updated",
    "bio": "Passionné de tech",
    "phoneNumber": "+22790000001"
  }
}
```

---

## 5. Configuration Boutique

### 5.1 Obtenir la configuration

**Endpoint :** `GET /store/all-data/:storeId`  
**Auth :** ❌ Publique

```javascript
const getStoreData = async (storeId) => {
  const response = await api.get(`/store/all-data/${storeId}`);
  return response.data.payload;
};
```

**✅ Réponse succès — 200**
```json
{
  "success": true,
  "error": null,
  "payload": {
    "_id": "665c3d4e5f6a7b8c9d0e1f20",
    "storeId": "665b2c3d4e5f6a7b8c9d0e1f",
    "description": "Vente de vêtements de qualité",
    "banner": "https://example.com/banner.jpg",
    "category": "fashion",
    "tags": ["mode", "niamey"],
    "address": {
      "street": "Rue de la Liberté",
      "city": "Niamey",
      "postalCode": "00000",
      "country": "NE"
    },
    "businessHours": [
      { "day": "monday", "open": "09:00", "close": "18:00", "isClosed": false }
    ],
    "paymentMethods": {
      "cash": { "enabled": true },
      "mobileMoney": { "enabled": true, "provider": "Orange Money" },
      "stripe": { "enabled": false, "accountId": "" }
    },
    "shippingSettings": {
      "freeShippingThreshold": 10000,
      "flatRate": 500,
      "localDelivery": true,
      "nationalDelivery": false
    },
    "notifications": {
      "emailOnNewOrder": true,
      "emailOnLowStock": true
    },
    "theme": {
      "primaryColor": "#3B82F6",
      "secondaryColor": "#10B981",
      "layout": "grid"
    },
    "socialLinks": {
      "instagram": "https://instagram.com/maboutique",
      "whatsapp": "+22790000001"
    },
    "stats": {
      "totalProducts": 24,
      "totalOrders": 156,
      "totalRevenue": 2450000,
      "averageRating": 4.3
    },
    "currency": "XOF",
    "language": "fr"
  }
}
```

---

### 5.2 Mettre à jour la configuration

**Endpoint :** `PUT /store/update-data/:storeId`  
**Auth :** ✅ JWT Store requis

```javascript
const updateStoreData = async (storeId, updates) => {
  const response = await api.put(`/store/update-data/${storeId}`, updates);
  return response.data.payload;
};

// Exemple : mettre à jour les horaires et la description
await updateStoreData(storeId, {
  description: "La meilleure boutique de Niamey",
  category: "fashion",
  businessHours: [
    { day: "monday", open: "08:00", close: "20:00", isClosed: false },
    { day: "sunday", open: "00:00", close: "00:00", isClosed: true }
  ],
  socialLinks: {
    instagram: "https://instagram.com/maboutique",
    whatsapp: "+22790000001"
  }
});
```

**✅ Réponse succès — 200**
```json
{
  "success": true,
  "error": null,
  "payload": { /* StoreData mis à jour */ }
}
```

---

## 6. Catalogue Produits

### 6.1 Lister les produits

**Endpoint :** `GET /products`  
**Auth :** ❌ Publique  
**Query params :** `?page=1&limit=10&storeId=xxx&category=fashion`

```javascript
const getProducts = async ({ page = 1, limit = 10, storeId, category } = {}) => {
  const params = new URLSearchParams({ page, limit });
  if (storeId) params.append('storeId', storeId);
  if (category) params.append('category', category);
  
  const response = await api.get(`/products?${params}`);
  return response.data.payload;
};
```

**✅ Réponse succès — 200**
```json
{
  "success": true,
  "error": null,
  "payload": {
    "products": [
      {
        "_id": "666d4e5f6a7b8c9d0e1f2031",
        "storeId": "665b2c3d4e5f6a7b8c9d0e1f",
        "sku": "TSHIRT-001",
        "title": "T-shirt Premium",
        "description": "T-shirt en coton 100%",
        "price": 5000,
        "stock": 50,
        "category": "clothing",
        "images": [
          { "url": "https://res.cloudinary.com/xxx/image.jpg", "alt": "T-shirt" }
        ],
        "available": true,
        "rating": 4.2,
        "reviews": 18,
        "createdAt": "2026-04-10T08:00:00.000Z"
      }
    ],
    "pagination": {
      "total": 87,
      "page": 1,
      "limit": 10,
      "totalPages": 9,
      "next": { "page": 2, "limit": 10 },
      "previous": null
    }
  }
}
```

**❌ Erreurs possibles**

| Code | Cas |
|------|-----|
| 404 | Aucun produit trouvé |

---

### 6.2 Obtenir un produit

**Endpoint :** `GET /products/:id`  
**Auth :** ❌ Publique

```javascript
const getProduct = async (productId) => {
  const response = await api.get(`/products/${productId}`);
  return response.data.payload;
};
```

**✅ Réponse succès — 200**
```json
{
  "success": true,
  "error": null,
  "payload": {
    "_id": "666d4e5f6a7b8c9d0e1f2031",
    "storeId": "665b2c3d4e5f6a7b8c9d0e1f",
    "sku": "TSHIRT-001",
    "title": "T-shirt Premium",
    "price": 5000,
    "stock": 50,
    "category": "clothing",
    "images": [{ "url": "https://res.cloudinary.com/xxx/image.jpg", "alt": "T-shirt" }],
    "colors": ["#FFFFFF", "#000000"],
    "sizes": [{ "name": "M" }, { "name": "L" }],
    "available": true
  }
}
```

**❌ Erreurs possibles**

| Code | Cas |
|------|-----|
| 404 | Produit introuvable |

---

### 6.3 Créer un produit

**Endpoint :** `POST /products/new`  
**Auth :** ✅ JWT Store requis  
**Content-Type :** `multipart/form-data` (pour les images)

```javascript
const createProduct = async (formData) => {
  const response = await api.post('/products/new', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data.payload;
};

// Construction du FormData
const formData = new FormData();
formData.append('storeId', storeId);
formData.append('sku', 'TSHIRT-002');
formData.append('title', 'Nouvelle chemise');
formData.append('description', 'Description du produit');
formData.append('price', 7500);
formData.append('stock', 30);
formData.append('category', 'clothing'); // electronics|clothing|food|beauty|home|sports|books|toys|other
formData.append('images', file1); // Max 5 images
formData.append('images', file2);
```

**✅ Réponse succès — 201**
```json
{
  "success": true,
  "error": null,
  "payload": {
    "_id": "666d4e5f6a7b8c9d0e1f2032",
    "storeId": "665b2c3d4e5f6a7b8c9d0e1f",
    "sku": "TSHIRT-002",
    "title": "Nouvelle chemise",
    "price": 7500,
    "stock": 30,
    "images": [
      { "url": "https://res.cloudinary.com/xxx/new-image.jpg", "alt": "Nouvelle chemise" }
    ]
  }
}
```

---

### 6.4 Modifier un produit

**Endpoint :** `PUT /products/update-product/:id`  
**Auth :** ✅ JWT Store requis

```javascript
const updateProduct = async (productId, updates) => {
  const response = await api.put(`/products/update-product/${productId}`, updates);
  return response.data.payload;
};
```

---

### 6.5 Supprimer un produit

**Endpoint :** `DELETE /products/delete-product/:id`  
**Auth :** ✅ JWT Store requis

```javascript
const deleteProduct = async (productId) => {
  const response = await api.delete(`/products/delete-product/${productId}`);
  return response.data;
};
```

---

## 7. Commentaires Produits

### 7.1 Lister les commentaires

**Endpoint :** `GET /comments/:productId`  
**Auth :** ❌ Publique

```javascript
const getComments = async (productId) => {
  const response = await api.get(`/comments/${productId}`);
  return response.data.payload;
};
```

**✅ Réponse succès — 200**
```json
{
  "success": true,
  "error": null,
  "payload": [
    {
      "_id": "667e5f6a7b8c9d0e1f203241",
      "productId": "666d4e5f6a7b8c9d0e1f2031",
      "userId": "664a1b2c3d4e5f6a7b8c9d0e",
      "content": "Très bonne qualité, je recommande !",
      "rating": 5,
      "isPublished": true,
      "createdAt": "2026-04-12T14:30:00.000Z"
    }
  ]
}
```

---

### 7.2 Ajouter un commentaire

**Endpoint :** `POST /comments/new`  
**Auth :** ✅ JWT User requis

```javascript
const addComment = async ({ productId, userId, content, rating }) => {
  const response = await api.post('/comments/new', {
    productId,
    userId,
    content,        // Max 1000 chars
    rating,         // 1 à 5 (optionnel)
  });
  return response.data.payload;
};
```

**✅ Réponse succès — 201**
```json
{
  "success": true,
  "error": null,
  "payload": {
    "_id": "667e5f6a7b8c9d0e1f203242",
    "productId": "666d4e5f6a7b8c9d0e1f2031",
    "userId": "664a1b2c3d4e5f6a7b8c9d0e",
    "content": "Très bonne qualité, je recommande !",
    "rating": 5,
    "createdAt": "2026-04-15T10:00:00.000Z"
  }
}
```

---

### 7.3 Supprimer un commentaire

**Endpoint :** `DELETE /comments/:id`  
**Auth :** ✅ JWT requis

```javascript
const deleteComment = async (commentId) => {
  await api.delete(`/comments/${commentId}`);
};
```

---

## 8. Commandes

### 8.1 Créer une commande

**Endpoint :** `POST /orders`  
**Auth :** ✅ JWT User requis

```javascript
const createOrder = async ({
  storeId,
  items,
  shippingAddress,
  paymentMethod,
  customerNote,
  shippingCost = 0,
  tax = 0,
  discount = 0,
}) => {
  const response = await api.post('/orders', {
    storeId,
    items: [
      {
        productId: "666d4e5f6a7b8c9d0e1f2031",
        title: "T-shirt Premium",
        sku: "TSHIRT-001",
        image: "https://res.cloudinary.com/xxx/image.jpg",
        price: 5000,      // Prix au moment de l'achat — snapshot
        quantity: 2,
        attributes: { color: "Blanc", size: "M" }  // Optionnel
      }
    ],
    shippingAddress: {
      fullName: "Eliezer Odjo",
      phone: "+22790000001",
      street: "Rue de la Liberté",
      city: "Niamey",
      postalCode: "00000",
      country: "NE"
    },
    paymentMethod: "cash",  // cash | mobile_money | stripe | paypal
    customerNote: "Livraison en matinée de préférence",
    shippingCost: 500,
    tax: 0,
    discount: 0
  });
  return response.data.payload;
};
```

**✅ Réponse succès — 201**
```json
{
  "success": true,
  "error": null,
  "payload": {
    "_id": "668f6a7b8c9d0e1f20324351",
    "orderNumber": "ORD-234567-0042",
    "userId": "664a1b2c3d4e5f6a7b8c9d0e",
    "storeId": "665b2c3d4e5f6a7b8c9d0e1f",
    "items": [
      {
        "productId": "666d4e5f6a7b8c9d0e1f2031",
        "title": "T-shirt Premium",
        "sku": "TSHIRT-001",
        "price": 5000,
        "quantity": 2
      }
    ],
    "subtotal": 10000,
    "shippingCost": 500,
    "tax": 0,
    "discount": 0,
    "total": 10500,
    "currency": "XOF",
    "status": "pending",
    "paymentMethod": "cash",
    "paymentStatus": "pending",
    "shippingAddress": {
      "fullName": "Eliezer Odjo",
      "phone": "+22790000001",
      "city": "Niamey",
      "country": "NE"
    },
    "statusHistory": [
      { "status": "pending", "note": "Commande créée", "changedAt": "2026-04-15T10:00:00.000Z" }
    ],
    "createdAt": "2026-04-15T10:00:00.000Z"
  }
}
```

**❌ Erreurs possibles**

| Code | Cas |
|------|-----|
| 400 | Aucun article dans la commande |
| 409 | Stock insuffisant pour un article |
| 401 | Non authentifié |

---

### 8.2 Mes commandes (User)

**Endpoint :** `GET /orders`  
**Auth :** ✅ JWT requis  
**Query params :** `?page=1&limit=10`

```javascript
const getMyOrders = async ({ page = 1, limit = 10 } = {}) => {
  const response = await api.get(`/orders?page=${page}&limit=${limit}`);
  return response.data.payload;
};
```

**✅ Réponse succès — 200**
```json
{
  "success": true,
  "error": null,
  "payload": {
    "orders": [ /* tableau de commandes */ ],
    "pagination": {
      "total": 12,
      "page": 1,
      "limit": 10,
      "totalPages": 2
    }
  }
}
```

---

### 8.3 Commandes d'un Store

**Endpoint :** `GET /orders/store/:storeId`  
**Auth :** ✅ JWT requis  
**Query params :** `?status=pending&page=1&limit=10`

```javascript
const getStoreOrders = async (storeId, { status, page = 1, limit = 10 } = {}) => {
  const params = new URLSearchParams({ page, limit });
  if (status) params.append('status', status);
  
  const response = await api.get(`/orders/store/${storeId}?${params}`);
  return response.data.payload;
};
```

**Valeurs de `status` :** `pending | confirmed | processing | shipped | delivered | cancelled | refunded`

---

### 8.4 Détail d'une commande

**Endpoint :** `GET /orders/:id`  
**Auth :** ✅ JWT requis (User propriétaire ou Store concerné)

```javascript
const getOrder = async (orderId) => {
  const response = await api.get(`/orders/${orderId}`);
  return response.data.payload;
};
```

**❌ Erreurs possibles**

| Code | Cas |
|------|-----|
| 400 | ID invalide |
| 403 | Pas propriétaire de la commande |
| 404 | Commande introuvable |

---

### 8.5 Mettre à jour le statut (Store)

**Endpoint :** `PATCH /orders/:id/status`  
**Auth :** ✅ JWT Store requis

```javascript
const updateOrderStatus = async (orderId, { status, note }) => {
  const response = await api.patch(`/orders/${orderId}/status`, {
    status,   // confirmed | processing | shipped | delivered | cancelled
    note,     // Optionnel — message pour le client
  });
  return response.data.payload;
};
```

**✅ Réponse succès — 200**
```json
{
  "success": true,
  "error": null,
  "payload": {
    "orderNumber": "ORD-234567-0042",
    "status": "confirmed",
    "confirmedAt": "2026-04-15T11:00:00.000Z",
    "statusHistory": [
      { "status": "pending", "changedAt": "2026-04-15T10:00:00.000Z" },
      { "status": "confirmed", "note": "Commande validée", "changedAt": "2026-04-15T11:00:00.000Z" }
    ]
  }
}
```

> **Annulation par le User :** Un user peut annuler sa propre commande uniquement si elle est en statut `pending`.

---

### 8.6 Confirmer un paiement

**Endpoint :** `PATCH /orders/:id/payment`  
**Auth :** ✅ JWT requis

```javascript
const confirmPayment = async (orderId, paymentIntentId = '') => {
  const response = await api.patch(`/orders/${orderId}/payment`, {
    paymentIntentId,  // ID Stripe si applicable
  });
  return response.data.payload;
};
```

---

## 9. Conversations & Chat REST

Le chat se fait en deux temps : l'API REST (Conversations) gère la persistance, Socket.IO gère le temps réel.

### 9.1 Créer ou récupérer une conversation

**Endpoint :** `POST /conversations`  
**Auth :** ✅ JWT User requis

```javascript
const getOrCreateConversation = async (storeId) => {
  const response = await api.post('/conversations', { storeId });
  return response.data.payload;
};
```

**✅ Réponse succès — 200**
```json
{
  "success": true,
  "error": null,
  "payload": {
    "_id": "669a7b8c9d0e1f2032435162",
    "userId": "664a1b2c3d4e5f6a7b8c9d0e",
    "storeId": "665b2c3d4e5f6a7b8c9d0e1f",
    "lastMessage": {
      "content": "",
      "senderType": "user"
    },
    "unreadCount": { "user": 0, "store": 0 },
    "isActive": true,
    "createdAt": "2026-04-15T10:00:00.000Z"
  }
}
```

> Idempotent — si la conversation existe déjà, retourne l'existante.

---

### 9.2 Mes conversations (User)

**Endpoint :** `GET /conversations`  
**Auth :** ✅ JWT User requis

```javascript
const getMyConversations = async ({ page = 1, limit = 20 } = {}) => {
  const response = await api.get(`/conversations?page=${page}&limit=${limit}`);
  return response.data.payload;
};
```

---

### 9.3 Conversations d'un Store

**Endpoint :** `GET /conversations/store/:storeId`  
**Auth :** ✅ JWT Store requis

```javascript
const getStoreConversations = async (storeId, { page = 1, limit = 20 } = {}) => {
  const response = await api.get(`/conversations/store/${storeId}?page=${page}&limit=${limit}`);
  return response.data.payload;
};
```

---

### 9.4 Historique des messages

**Endpoint :** `GET /conversations/:id/messages`  
**Auth :** ✅ JWT requis (participant uniquement)  
**Query params :** `?page=1&limit=30`

```javascript
const getMessages = async (conversationId, { page = 1, limit = 30 } = {}) => {
  const response = await api.get(
    `/conversations/${conversationId}/messages?page=${page}&limit=${limit}`
  );
  return response.data.payload;
};
```

**✅ Réponse succès — 200**
```json
{
  "success": true,
  "error": null,
  "payload": {
    "messages": [
      {
        "_id": "66ab8c9d0e1f203243516273",
        "conversationId": "669a7b8c9d0e1f2032435162",
        "senderId": "664a1b2c3d4e5f6a7b8c9d0e",
        "senderType": "user",
        "content": "Bonjour, est-ce que cet article est disponible en taille L ?",
        "isRead": true,
        "readAt": "2026-04-15T10:05:00.000Z",
        "createdAt": "2026-04-15T10:00:00.000Z"
      }
    ],
    "pagination": {
      "total": 45,
      "page": 1,
      "limit": 30,
      "totalPages": 2
    }
  }
}
```

> Les messages sont triés du plus ancien au plus récent (ordre chronologique).

---

## 10. Chat Temps Réel (Socket.IO)

### 10.1 Connexion

```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:8000', {  // Passe par le Gateway (/ws)
  auth: {
    token: localStorage.getItem('token'),  // JWT user/store
    userType: 'user',  // 'user' ou 'store'
  },
  withCredentials: true,
});

socket.on('connect', () => {
  console.log('Connecté au chat :', socket.id);
});

socket.on('connect_error', (err) => {
  console.error('Erreur connexion :', err.message);
  // 'Authentication error: token manquant'
  // 'Authentication error: token invalide ou expiré'
  // 'Authentication error: userType invalide'
});
```

---

### 10.2 Rejoindre une conversation

```javascript
// Émettre — rejoindre la room
socket.emit('joinConversation', { conversationId: '669a7b8c9d0e1f2032435162' });

// Recevoir — confirmation
socket.on('joinedConversation', ({ conversationId }) => {
  console.log('Dans la conversation :', conversationId);
});

// Recevoir — erreur d'accès
socket.on('error', (message) => {
  console.error('Erreur Socket :', message);
  // 'Conversation introuvable ou accès refusé'
});
```

---

### 10.3 Envoyer un message

```javascript
// Émettre — envoyer
socket.emit('sendMessage', {
  conversationId: '669a7b8c9d0e1f2032435162',
  content: 'Bonjour, est-ce disponible en taille L ?',
});

// Recevoir — message diffusé à tous les participants
socket.on('receiveMessage', (message) => {
  console.log('Nouveau message :', message);
  // {
  //   "_id": "66ab8c9d0e1f203243516273",
  //   "conversationId": "669a7b8c9d0e1f2032435162",
  //   "senderId": "664a1b2c3d4e5f6a7b8c9d0e",
  //   "senderType": "user",
  //   "content": "Bonjour, est-ce disponible en taille L ?",
  //   "isRead": false,
  //   "createdAt": "2026-04-15T10:00:00.000Z"
  // }
});

// Recevoir — erreur de validation
socket.on('validationError', ({ errors }) => {
  console.error('Message invalide :', errors);
  // [{ "message": "content est requis" }]
});
```

---

### 10.4 Indicateurs de frappe

```javascript
// Émettre — début de frappe
socket.emit('typing', { conversationId });

// Émettre — fin de frappe
socket.emit('stopTyping', { conversationId });

// Recevoir — l'autre participant tape
socket.on('userTyping', ({ userId, userType }) => {
  setIsTyping(true);
});

socket.on('userStoppedTyping', ({ userId, userType }) => {
  setIsTyping(false);
});
```

> **Important :** Ces événements ne fonctionnent que si le socket a d'abord rejoint la conversation via `joinConversation`.

---

### 10.5 Marquer comme lu

```javascript
// Émettre — marquer comme lu
socket.emit('markAsRead', { conversationId });

// Recevoir — confirmation broadcast
socket.on('messagesMarkedAsRead', ({ conversationId, readerType }) => {
  // Mettre à jour le compteur unreadCount côté UI
  setUnreadCount(0);
});
```

---

### 10.6 Quitter une conversation

```javascript
socket.emit('leaveConversation');
```

---

### 10.7 Déconnexion propre

```javascript
// À la déconnexion du composant React
useEffect(() => {
  return () => {
    socket.disconnect();
  };
}, []);
```

---

### 10.8 Flux complet recommandé (React)

```javascript
const ChatComponent = ({ conversationId }) => {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    // 1. Charger l'historique via REST
    getMessages(conversationId).then(({ messages }) => setMessages(messages));

    // 2. Rejoindre la room Socket
    socket.emit('joinConversation', { conversationId });

    // 3. Écouter les nouveaux messages
    socket.on('receiveMessage', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on('userTyping', () => setIsTyping(true));
    socket.on('userStoppedTyping', () => setIsTyping(false));

    return () => {
      socket.emit('leaveConversation');
      socket.off('receiveMessage');
      socket.off('userTyping');
      socket.off('userStoppedTyping');
    };
  }, [conversationId]);

  const sendMessage = (content) => {
    socket.emit('sendMessage', { conversationId, content });
    socket.emit('stopTyping', { conversationId });
  };

  return (/* JSX */);
};
```

---

## 11. Favoris & Following

### 11.1 Toggle Favori

**Endpoint :** `POST /user/favorites`  
**Auth :** ✅ JWT User requis  
**Comportement :** Toggle — ajoute si absent, retire si présent

```javascript
const toggleFavorite = async ({ userId, productId }) => {
  const response = await api.post('/user/favorites', { userId, productId });
  return response.data.payload;
};
```

**✅ Réponse succès — 200**
```json
{
  "success": true,
  "error": null,
  "payload": {
    "userId": "664a1b2c3d4e5f6a7b8c9d0e",
    "favorites": [
      "666d4e5f6a7b8c9d0e1f2031",
      "666d4e5f6a7b8c9d0e1f2032"
    ],
    "following": []
  }
}
```

---

### 11.2 Toggle Following (Store)

**Endpoint :** `PUT /user/following`  
**Auth :** ✅ JWT User requis  
**Comportement :** Toggle — follow si pas suivi, unfollow si suivi

```javascript
const toggleFollowing = async (storeId) => {
  const response = await api.put('/user/following', { storeId });
  return response.data.payload;
};
```

**✅ Réponse succès — 200**
```json
{
  "success": true,
  "error": null,
  "payload": {
    "userId": "664a1b2c3d4e5f6a7b8c9d0e",
    "favorites": [],
    "following": ["665b2c3d4e5f6a7b8c9d0e1f"]
  }
}
```

**❌ Erreurs possibles**

| Code | Cas |
|------|-----|
| 400 | storeId manquant ou invalide |
| 404 | Profil utilisateur introuvable |

---

## 12. Gestion des erreurs globale

### Format d'erreur universel

```typescript
interface ErrorResponse {
  success: false;
  error: string;    // Toujours une string — jamais un tableau
  payload: null;
  stack?: string;   // Uniquement en NODE_ENV=development
}
```

> **Note :** Les messages d'erreur des tokens JWT ont été standardisés :
> - Token absent → `"Token d'authentification manquant."`
> - Token invalide/expiré → `"Token invalide ou expiré."`
> - Accès service interne → `"Accès réservé aux services internes."`

### Tableau des codes HTTP

| Code | Signification | Quand |
|------|--------------|-------|
| 200 | Succès | GET, PUT, PATCH, DELETE réussis |
| 201 | Créé | POST register, createOrder, createProduct |
| 400 | Données invalides | Champs manquants, format incorrect |
| 401 | Non authentifié | Token absent, expiré ou invalide |
| 403 | Accès refusé | Token valide mais pas les droits |
| 404 | Introuvable | Ressource inexistante |
| 409 | Conflit | Email existant, stock insuffisant |
| 423 | Compte verrouillé | 5 tentatives login échouées |
| 429 | Rate limit | Trop de requêtes |
| 500 | Erreur serveur | Erreur interne inattendue |
| 502 | Service indisponible | Microservice cible down |

### Intercepteur global recommandé

```javascript
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    // error est toujours une string — jamais un tableau
    const message = error.response?.data?.error || 'Erreur réseau';

    switch (status) {
      case 401:
        localStorage.removeItem('token');
        window.location.href = '/login';
        break;
      case 423:
        alert('Compte verrouillé. Réessayez dans 2 heures.');
        break;
      case 429:
        alert('Trop de tentatives. Attendez 15 minutes.');
        break;
      case 502:
        alert('Service temporairement indisponible. Réessayez.');
        break;
      default:
        if (process.env.NODE_ENV === 'development') {
          console.error(`[${status}] ${message}`);
        }
    }

    return Promise.reject(error);
  }
);

    return Promise.reject(error);
  }
);
```

---

## 13. Cookies & Tokens

### Stratégie double

Le backend utilise **deux mécanismes simultanément** pour la flexibilité client :

| Mécanisme | Usage | Sécurité |
|-----------|-------|---------|
| Cookie `jwt` httpOnly | Navigateurs web | ✅ Protégé contre XSS |
| Header `Authorization: Bearer <token>` | Mobile, Postman, API clients | ✅ Flexible |

### Configuration cookie

```
Name:     jwt
HttpOnly: true       — Inaccessible depuis JavaScript
Secure:   true       — HTTPS uniquement (false en dev)
SameSite: Strict     — Pas envoyé en cross-site
MaxAge:   30 jours   — Configurable via MAX_COOKIE_AGE
```

### Récupération du token

```javascript
// Après login/register — stocker le token
const { token } = response.data;
localStorage.setItem('token', token);

// À chaque requête — deux façons de s'authentifier
// Option 1 : Header (recommandé pour apps React/Vue)
headers: { 'Authorization': `Bearer ${token}` }

// Option 2 : Cookie automatique (navigateur l'envoie automatiquement
// si withCredentials: true dans Axios)
```

### Durée de vie & Renouvellement

Il n'y a pas de refresh token actuellement. Le JWT expire après `MAX_COOKIE_AGE` (défaut 30 jours). Quand il expire :

```javascript
// L'API retourne 401
// L'intercepteur redirige vers /login
// L'utilisateur doit se reconnecter
```

---

## 14. Checklist d'intégration étape par étape

### Étape 1 — Mise en place (Jour 1)

- [ ] Configurer l'instance Axios avec `baseURL` et `withCredentials: true`
- [ ] Implémenter les intercepteurs request (token) et response (erreurs)
- [ ] Créer le contexte Auth (React Context ou Redux slice)
- [ ] Tester `POST /auth/user/register` et `POST /auth/user/login`
- [ ] Vérifier que le cookie `jwt` est posé en inspectant les DevTools

### Étape 2 — Authentification complète (Jour 2)

- [ ] Page Register User avec validation côté client
- [ ] Page Login User avec gestion du verrouillage 423
- [ ] Page Register Store avec champ `fullname`
- [ ] Page Login Store — afficher `storeData` du dashboard
- [ ] Route protégée (redirect si non connecté)
- [ ] Bouton Logout avec `clearCookie` + `localStorage.removeItem`

### Étape 3 — Profils (Jour 3)

- [ ] Page Profil User (`GET /user/profile/:id`)
- [ ] Formulaire modification profil (`PUT /user/profile/:id`)
- [ ] Page Profil Store (`GET /auth/store/profile`)
- [ ] Formulaire modification Store (`PUT /auth/store/profile`)
- [ ] Page Settings boutique (`GET/PUT /store/all-data/:storeId`)

### Étape 4 — Catalogue (Jour 4-5)

- [ ] Page liste produits avec pagination (`GET /products?page=1&limit=10`)
- [ ] Filtres par `storeId` et `category`
- [ ] Page détail produit (`GET /products/:id`)
- [ ] Dashboard Store — liste de ses produits (`GET /products?storeId=xxx`)
- [ ] Formulaire création produit avec upload images (`POST /products/new`)
- [ ] Modification produit (`PUT /products/update-product/:id`)
- [ ] Suppression produit (`DELETE /products/delete-product/:id`)
- [ ] Section commentaires par produit (`GET /comments/:productId`)
- [ ] Formulaire ajout commentaire (`POST /comments/new`)

### Étape 5 — Commandes (Jour 6-7)

- [ ] Page panier avec calcul subtotal/total
- [ ] Formulaire adresse de livraison
- [ ] Sélection méthode de paiement (cash, mobile_money)
- [ ] `POST /orders` avec gestion erreur 409 (stock insuffisant)
- [ ] Page "Mes commandes" User (`GET /orders`)
- [ ] Page détail commande (`GET /orders/:id`)
- [ ] Dashboard Store — liste commandes par statut (`GET /orders/store/:storeId?status=pending`)
- [ ] Boutons changement de statut (`PATCH /orders/:id/status`)
- [ ] Bouton annulation commande (User, statut pending seulement)

### Étape 6 — Social (Jour 8)

- [ ] Bouton Toggle Favori sur les produits (`POST /user/favorites`)
- [ ] Page "Mes favoris" (utiliser les IDs de `profile.favorites`)
- [ ] Bouton Follow/Unfollow Store (`PUT /user/following`)
- [ ] Page "Boutiques suivies" (utiliser les IDs de `profile.following`)

### Étape 7 — Chat (Jour 9-10)

- [ ] Installer `socket.io-client`
- [ ] Configurer la connexion Socket avec token et userType
- [ ] Gérer `connect_error` (token invalide → redirect login)
- [ ] Bouton "Contacter la boutique" → `POST /conversations`
- [ ] Page conversations (`GET /conversations`)
- [ ] Page chat avec historique REST (`GET /conversations/:id/messages`)
- [ ] Intégration Socket — joinConversation au montage
- [ ] Envoi de messages en temps réel
- [ ] Indicateurs de frappe (typing/stopTyping)
- [ ] Compteur messages non lus (`unreadCount.user`)
- [ ] markAsRead au focus de la conversation

### Étape 8 — Polissage (Jour 11-12)

- [ ] Gestion globale des erreurs 502 (service indisponible)
- [ ] États de chargement sur toutes les requêtes
- [ ] Messages d'erreur user-friendly sur toutes les erreurs 400
- [ ] Pagination sur toutes les listes
- [ ] Optimisation : ne pas refetch si données en cache
- [ ] Test complet du flux : register → login → créer produit → passer commande → chat

---

*Guide généré depuis le code source EgemoPro/backend-microservice — Avril 2026*
