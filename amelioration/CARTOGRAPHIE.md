# Cartographie du Projet

> Fichier de référence rapide pour naviguer dans le code. Mettre à jour à chaque modification.

---

## Structure Globale

```
niger-ecommerce/
├── monitor.cjs                    # Moniteur (CommonJS)
├── monitor-console.cjs            # Moniteur console
├── vite.config.js                 # Config Vite
├── tailwind.config.js
├── postcss.config.js
├── eslint.config.js
│
src/
├── main.jsx                       # Entry point → routes + redux
├── Socket.js                      # WebSocket (socket.io-client)
├── App.css / index.css            # Styles globaux
│
├── routes/
│   └── main.routes.jsx            # Toutes les routes
│
├── redux/
│   ├── store.js                   # ConfigureStore → 17 slices
│   ├── method.js
│   ├── initialState.js
│   ├── middleware/
│   │   └── socketMiddleware.js
│   ├── Slices/                    # 17 slices
│   ├── schemas/
│   │   └── index.js
│   └── utils/
│       └── index.js
│
├── hooks/ (6)
├── lib/ (4)
├── services/ (2)
├── pages/ (37)
├── components/ (28 + sous-dossiers)
├── layouts/ (1)
└── utils/ (2)
```

---

## Point d'entrée → Routes

```
main.jsx
  ├── routes/main.routes.jsx
  │     ├── pages/home/
  │     │     ├── home-page.jsx
  │     │     ├── home-2.jsx
  │     │     └── sections/enhanced-section.jsx
  │     ├── pages/products/products-page.jsx
  │     ├── pages/productSweater/
  │     │     ├── producr-sweater-page.jsx
  │     │     └── errors/ErrorProductSweater.jsx
  │     ├── pages/orders/
  │     │     ├── order-page.jsx
  │     │     └── order-detail.jsx
  │     ├── pages/user/user-page.jsx
  │     │     └── sub-pages/
  │     │           ├── edit-profile.jsx
  │     │           ├── general.jsx
  │     │           ├── password.jsx
  │     │           ├── payouts.jsx
  │     │           ├── notifications.jsx
  │     │           ├── data-privacy.jsx
  │     │           ├── delete-account.jsx
  │     │           └── navigation-items.js
  │     ├── pages/chat/chat-page.jsx
  │     ├── pages/favoris/
  │     │     ├── mes-favoris.jsx
  │     │     └── boutiques-suivies.jsx
  │     ├── pages/shop/
  │     │     ├── shop-page.jsx
  │     │     ├── Index.jsx
  │     │     ├── ShopDetails.jsx
  │     │     ├── NotFound.jsx
  │     │     └── shop-components/
  │     │           ├── Products.jsx
  │     │           ├── ProductDetail.jsx
  │     │           ├── Chat.jsx
  │     │           ├── FAQ.jsx
  │     │           ├── Reviews.jsx
  │     │           ├── Photos.jsx
  │     │           ├── ProductsPage.jsx
  │     │           ├── ProductDetailPage.jsx
  │     │           ├── ChatPage.jsx
  │     │           ├── FAQPage.jsx
  │     │           ├── ReviewsPage.jsx
  │     │           ├── PhotosPage.jsx
  │     │           └── AboutPage.jsx
  │     └── layouts/ShopLayout.jsx
  │
  └── redux/store.js
        └── Slices/ (17 slices)
```

---

## Redux - Store

**`src/redux/store.js`** → 17 slices :

| # | Slice | Fichier | Fonctionnalité |
|---|-------|---------|-----------------|
| 1 | basketSlice | `Slices/basketSlice.js` | Panier |
| 2 | authSlice | `Slices/authSlice.js` | Authentification |
| 3 | favorisSlice | `Slices/favorisSlice.js` | Favoris produits |
| 4 | followingSlice | `Slices/followingSlice.js` | Boutiques suivies |
| 5 | shopSlice | `Slices/shopSlice.js` | Boutique actuelle |
| 6 | ordersSlice | `Slices/ordersSlice.js` | Commandes |
| 7 | conversationsSlice | `Slices/conversationsSlice.js` | Conversations chat |
| 8 | messageSlice | `Slices/messageSlice.js` | Messages |
| 9 | notificationSlice | `Slices/notificationSlice.js` | Notifications |
| 10 | initialData | `Slices/initialData.js` | Produits initiaux |
| 11 | userSlice | `Slices/userSlice.js` | Utilisateur |
| 12 | profileSlice | `Slices/profileSlice.js` | Profil |
| 13 | commentsSlice | `Slices/commentsSlice.js` | Commentaires |
| 14 | productSlice | `Slices/productSlice.js` | Produits |
| 15 | settingsSlice | `Slices/settingsSlice.js` | Paramètres |
| 16 | recommendationSlice | `Slices/recommendationSlice.js` | Recommandations |
| 17 | SearchEngine | `Slices/SearchEngine.js` | Moteur de recherche |

**Autres fichiers redux/** : `method.js`, `initialState.js`, `schemas/index.js`, `utils/index.js`

---

## Hooks (6)

| Hook | Fichier | Dépendances |
|------|---------|-------------|
| useSocket | `hooks/useSocket.js` | Socket.js, messageSlice |
| useBasket | `hooks/useBasket.js` | basketSlice |
| useNotifications | `hooks/useNotifications.js` | notificationSlice |
| useConversationSocket | `hooks/useConversationSocket.js` | conversationsSlice |
| use-fetch | `hooks/use-fetch.js` | - |
| use-toast | `hooks/use-toast.js` | - |

---

## Lib / Services

| Type | Fichier | Description |
|------|---------|-------------|
| lib | `lib/axios.js` | API HTTP avec intercepteurs |
| lib | `lib/utils.js` | fn `cn()` pour classnames |
| lib | `lib/firebase.js` | Firebase config |
| lib | `lib/shop-utils.js` | Utilitaires boutique |
| service | `services/logger.js` | Logging centralisé |
| service | `services/conversationService.js` | Service conversations |

---

## Pages (37 fichiers)

### Pages principales
- `pages/home/home-page.jsx`
- `pages/home/home-2.jsx`
- `pages/home/sections/enhanced-section.jsx`
- `pages/products/products-page.jsx`
- `pages/orders/order-page.jsx`, `order-detail.jsx`
- `pages/chat/chat-page.jsx`
- `pages/favoris/mes-favoris.jsx`, `boutiques-suivies.jsx`

### Pages Product Sweater
- `pages/productSweater/producr-sweater-page.jsx`
- `pages/productSweater/errors/ErrorProductSweater.jsx`

### Pages User
- `pages/user/user-page.jsx`
- `pages/user/sub-pages/` (8 fichiers)

### Pages Shop
- `pages/shop/shop-page.jsx`, `Index.jsx`, `ShopDetails.jsx`, `NotFound.jsx`
- `pages/shop/shop-components/` (13 fichiers)

---

## Composants (28 + sous-dossiers)

### Racine components/ (18 fichiers)
- `NavBare.jsx` - Navigation principale
- `ProductCard.jsx`, `ProductDetails.jsx`, `ProductComments.jsx`, `ProductDrawerCard.jsx`
- `ImageCarousel.jsx`, `Crousel.jsx`
- `SearchBar.jsx`, `PopularShops.jsx`
- `SharePopover.jsx`, `ActionButtons.jsx`, `bascket-btn.jsx`
- `AdvancedFilterDrawer.jsx`, `renderStar.jsx`
- `loader.jsx`, `meta-button.jsx`, `custom-meta.jsx`
- `order-popup.jsx`, `order-express-popup.jsx`, `ecommerce-dashboard-popup.jsx`
- `order-table-components.jsx`, `comment-section.jsx`, `quickExportPDF.jsx`
- `image-actions.jsx`, `product-grid-component.jsx`
- `tabs-bar/tabs-bar.jsx`, `tabs-bar/tabs-bar-triger/tabs-bar-triger.jsx`
- `navigation/PageNavigation.jsx`

###Sous-dossiers components/

| Dossier | Fichiers |
|---------|----------|
| `shop/` (7) | ShopCard, ShopHeader, ShopBanner, ShopTabs, ShopAbout, ProductGrid, ProductCard |
| `product-grid-components/` (6) | ProductList, ProductCard, ProductPrice, ProductFilters, ProductGridHeader, ProductRating |
| `chat/` (5) | EmbeddedChatWindow, ChatWindow, MessageList, MessageInput, TypingIndicator |
| `auth/` (5) | auth-btn, user-info, buttons/GoogleAuhtButton, AppleAuthButton, FacebookAuthButton |
| `buttons/` (2) | FavoriteToggle, FollowingToggle |
| `notifications/` (2) | NotificationToast, NotificationBadge |
| `demo/` (2) | SocketDemo, ChatDemo |

### Composants UI (37 fichiers - shadcn/ui)
`button`, `input`, `textarea`, `label`, `checkbox`, `badge`, `card`, `dialog`, `drawer`, `sheet`, `tabs`, `accordion`, `alert`, `alert-dialog`, `toast`, `toaster`, `sonner`, `skeleton`, `scroll-area`, `table`, `select`, `popover`, `dropdown-menu`, `carousel`, `slider`, `avatar`, `aspect-ratio`, `resizable`, `separator`, `form`, `input-otp`, `command`, `chart`, `rainbow-button`, `text-reveal`, `fade-text`, `sparkles-text`

---

## Layouts

- `layouts/ShopLayout.jsx` - Layout pour les pages de boutique

---

## Utils

- `utils/generateQrCode.jsx`
- `utils/generateCode.js`

---

## Imports clés

```
main.jsx
  └── RouterProvider → routes/main.routes.jsx
  └── store → redux/store.js → 17 slices

routes/main.routes.jsx
  └── import pages depuis ../pages/...

pages/* et components/*
  └── useDispatch, useSelector → redux/Slices/...
```

---

## Navigation rapide

| Besoin | Emplacement |
|--------|-------------|
| Ajouter une route | `routes/main.routes.jsx` |
| Ajouter un slice | `redux/Slices/` + `redux/store.js` |
| Créer un hook | `hooks/` |
| Ajouter un composant | `components/` ou `components/ui/` |
| Ajouter une page | `pages/` |
| Modifier l'API | `lib/axios.js` |
| WebSocket | `Socket.js` + `redux/middleware/socketMiddleware.js` |

---

## Panier localStorage (Basket-to-Order)

### Fonctionnalité
Le panier utilise localStorage pour persister les produits entre les sessions.

| Key localStorage | Structure |
|-----------------|-----------|
| `quickcart_products` | `[{ productId, quantity, attributes }]` |

### Flux

```
1. Click "Ajouter au panier" → basketSlice.addProduct() + saveToLocalStorage()
2. Naviguer vers /products/orders
3. LOAD: loadFromLocalStorage() → GET /products/many-products/{ids}
4. AFFICHER: tableau produits avec quantities
5. POST /orders成功 → clearLocalCart()
```

### Fichiers liés

| Fichier | Usage |
|---------|-------|
| `basketSlice.js` | saveToLocalStorage(), loadFromLocalStorage(), clearLocalCart() |
| `bascket-btn.jsx` | Toast confirmation + onAddToCart |
| `order-page.jsx` | Chargement localStorage au mount |

---

*Dernière mise à jour: 2026-05-07*
*Total: 172 fichiers de code dans /src + 2 fichiers racine*