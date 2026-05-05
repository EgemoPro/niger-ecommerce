# 📋 TODO LIST - 12 JOURS D'INTÉGRATION

## ✅ JOUR 1 - FONDATIONS

### Morning
- [ ] Lire ce document complet (2h)
- [ ] Vérifier que backend tourne: `http://localhost:8000`
- [ ] Tester `/health` endpoint
- [ ] Vérifier vite.config.js pour proxy `/api`

### Afternoon
- [ ] Modifier `src/lib/axios.js` - Ajouter response interceptor
  - [ ] Gestion 401 → redirect login
  - [ ] Gestion 423 → alert locked
  - [ ] Gestion 429 → alert rate limit
  - [ ] Gestion 502 → alert service down
- [ ] Installer `jwt-decode`: `npm install jwt-decode`
- [ ] Améliorer `authSlice.js` - ajouter JWT validation
- [ ] Test: Login + vérifier tokens dans DevTools

### Evening
- [ ] Commit: "feat: axios interceptors + jwt validation"
- [ ] Vérifier que tout compile: `npm run dev`

---

## ✅ JOUR 2 - AUTH & PAGES

### Morning
- [ ] Créer `src/pages/auth/login-page.jsx`
  - [ ] Formulaire email/password
  - [ ] Validation React Hook Form
  - [ ] Dispatch `login()` Redux
  - [ ] Redirect vers /products si succès
  - [ ] Afficher erreurs (400, 401, 423)

### Afternoon
- [ ] Créer `src/pages/auth/register-page.jsx`
  - [ ] Formulaire avec validation
  - [ ] Password strength checker
  - [ ] Afficher erreurs 400, 409 (email existe)
  - [ ] Auto-login après register

- [ ] Ajouter routes dans `src/routes/main.routes.jsx`
  - [ ] `/auth/login`
  - [ ] `/auth/register`

### Evening
- [ ] Créer navbar avec boutons Login/Register/Logout
- [ ] Test: Register → Login → Dashboard → Logout
- [ ] Commit: "feat: auth pages (login, register)"

---

## ✅ JOUR 3 - PROFIL UTILISATEUR

### Morning
- [ ] Créer `src/services/userService.js`
  ```javascript
  - getProfile(userId)
  - updateProfile(userId, updates)
  ```

- [ ] Ajouter actions dans `userSlice.js`
  ```javascript
  - fetchUserProfile(userId)
  - updateUserProfileAsync(userId, updates)
  - setUserProfile(profile)
  ```

### Afternoon
- [ ] Créer `src/pages/user/user-profile-view.jsx`
  - [ ] Charger profil au montage
  - [ ] Afficher infos (username, bio, avatar, phone)
  - [ ] Bouton Edit Profile

- [ ] Créer `src/pages/user/user-profile-edit.jsx`
  - [ ] Formulaire d'édition (username, bio, avatar, phone)
  - [ ] Validation (bio max 500 chars)
  - [ ] Sauvegarder + feedback

### Evening
- [ ] Tester: Charger profil → Éditer → Sauvegarder → Recharger
- [ ] Commit: "feat: user profile (view & edit)"

---

## ✅ JOUR 4 - PRODUITS & DÉTAILS

### Morning
- [ ] Créer `src/services/productService.js`
  ```javascript
  - getProducts(params) // existe déjà?
  - getProductDetail(productId)
  - getComments(productId)
  - addComment(productId, userId, content, rating)
  - deleteComment(commentId)
  ```

### Afternoon
- [ ] Ajouter actions Redux (productSlice)
  ```javascript
  - fetchProductDetail(productId)
  - fetchComments(productId)
  - addCommentAsync(...)
  - deleteCommentAsync(commentId)
  ```

- [ ] Adapter Product Detail page
  - [ ] Charger détails produit
  - [ ] Afficher images, prix, stock
  - [ ] Bouton Favoris
  - [ ] Bouton "Contacter vendeur"

### Evening
- [ ] Créer `src/components/product/CommentSection.jsx`
  - [ ] Afficher liste commentaires
  - [ ] Formulaire ajout commentaire
  - [ ] Bouton supprimer (si propriétaire)
  - [ ] Rating stars
- [ ] Tester: Voir produit → Ajouter/Supprimer commentaire
- [ ] Commit: "feat: product detail + comments"

---

## ✅ JOUR 5 - PANIER & CHECKOUT (PART 1)

### Morning
- [ ] Créer `src/services/orderService.js`
  ```javascript
  - createOrder(orderData)
  - getMyOrders(page, limit)
  - getOrderDetail(orderId)
  - confirmPayment(orderId, paymentIntentId)
  ```

### Afternoon
- [ ] Ajouter actions Redux (userSlice ou nouveau orderSlice)
  ```javascript
  - createOrderAsync(orderData)
  - fetchMyOrders(page)
  - fetchOrderDetail(orderId)
  ```

- [ ] Vérifier/compléter `basketSlice.js`
  - [ ] addToCart(product)
  - [ ] removeFromCart(productId)
  - [ ] updateQuantity(productId, quantity)
  - [ ] clearCart()
  - [ ] calculateTotal()

### Evening
- [ ] Créer `src/pages/cart/cart-page.jsx`
  - [ ] Afficher items du panier
  - [ ] Totaux (subtotal, tax, shipping, total)
  - [ ] Bouton "Checkout"
  - [ ] Bouton pour vider panier
- [ ] Commit: "feat: cart page (WIP)"

---

## ✅ JOUR 6 - PANIER & CHECKOUT (PART 2)

### Morning
- [ ] Créer `src/pages/checkout/checkout-page.jsx`
  - [ ] Récapitulatif panier
  - [ ] Formulaire adresse:
    - [ ] fullName, phone
    - [ ] street, city, postalCode, country
  - [ ] Sélection méthode paiement
    - [ ] Cash (onDelivery)
    - [ ] Mobile Money
    - [ ] Stripe (optionnel)

### Afternoon
- [ ] Intégrer `POST /orders`
  - [ ] Récupérer storeId (depuis produit?)
  - [ ] Construire orderData correctement
  - [ ] Envoyer via `createOrderAsync()`
  - [ ] Gestion erreur 409 (stock insuffisant)
  - [ ] Redirect vers `/orders` après succès

- [ ] Améliorer `src/pages/orders/order-page.jsx`
  - [ ] Charger commandes via `GET /orders`
  - [ ] Afficher liste avec pagination
  - [ ] Statut badge (pending, confirmed, shipped, etc.)
  - [ ] Clic sur commande → détail

### Evening
- [ ] Créer `src/pages/orders/order-detail-page.jsx`
  - [ ] Afficher détails commande
  - [ ] Items, adresse, paiement
  - [ ] Timeline statuts
  - [ ] Bouton annuler (si pending)
- [ ] Test full flow: Ajouter au panier → Checkout → Commande créée
- [ ] Commit: "feat: checkout + orders (GET)"

---

## ✅ JOUR 7 - CHAT REST API

### Morning
- [ ] Créer `src/services/conversationService.js`
  ```javascript
  - getOrCreateConversation(storeId)
  - getMyConversations(page, limit)
  - getMessages(conversationId, page, limit)
  ```

### Afternoon
- [ ] Créer `src/redux/Slices/conversationSlice.js`
  ```javascript
  - fetchConversations(page)
  - fetchMessages(conversationId, page)
  - getOrCreateConversationAsync(storeId)
  - setConversations(convos)
  - setMessages(messages)
  ```

- [ ] Adapter `Socket.js`
  - [ ] Ajouter `joinConversation(conversationId)` event
  - [ ] Adapter `sendMessage(conversationId, content)` - pas roomId
  - [ ] Ajouter `typing(conversationId)` event
  - [ ] Ajouter `stopTyping(conversationId)` event
  - [ ] Ajouter `markAsRead(conversationId)` event

### Evening
- [ ] Charger et tester les 3 endpoints REST
- [ ] Commit: "feat: chat REST API (conversations, messages)"

---

## ✅ JOUR 8 - CHAT SOCKET.IO & INTÉGRATION

### Morning
- [ ] Adapter Chat page pour historique + Socket
  - [ ] Charger historique via REST (getMessages)
  - [ ] Rejoindre room Socket (joinConversation)
  - [ ] Écouter receiveMessage + ajouter à liste

### Afternoon
- [ ] Ajouter typing indicators
  - [ ] Émettre `typing` au focus
  - [ ] Émettre `stopTyping` à la sortie
  - [ ] Afficher "X is typing..." si quelqu'un tape

- [ ] Ajouter marquer comme lu
  - [ ] Au focus conversation: `markAsRead()`
  - [ ] Écouter `messagesMarkedAsRead` → update unreadCount

- [ ] Créer conversation depuis product detail
  - [ ] Bouton "Contacter vendeur"
  - [ ] Créer conversation via `getOrCreateConversation(storeId)`
  - [ ] Redirect vers `/chat/:conversationId`

### Evening
- [ ] Test full flow: Product → Contacter vendeur → Chat → Message temps réel
- [ ] Commit: "feat: chat complete (REST + Socket + indicators)"

---

## ✅ JOUR 9 - FAVORIS & FOLLOWING

### Morning
- [ ] Corriger `src/services/favoriteService.js`
  ```javascript
  - toggleFavorite(userId, productId)
  - toggleFollowing(storeId)
  ```

### Afternoon
- [ ] Corriger actions Redux (userSlice)
  ```javascript
  - toggleFavoriteAsync(productId, userId) // ✅ correct endpoint
  - toggleFollowingAsync(storeId) // ✅ nouveau
  ```

- [ ] Créer `src/pages/favorites/favorites-page.jsx`
  - [ ] Charger produits favoris (via profile.favorites)
  - [ ] Afficher grid de produits
  - [ ] Clic pour voir détails
  - [ ] Bouton "Remove from favorites"

### Evening
- [ ] Créer `src/pages/following/following-page.jsx`
  - [ ] Charger boutiques suivies (via profile.following)
  - [ ] Afficher grid de shops
  - [ ] Clic pour voir shop
  - [ ] Bouton "Unfollow"
- [ ] Ajouter Toggle favoris sur ProductCard
- [ ] Ajouter Toggle following sur ShopCard
- [ ] Commit: "feat: favorites + following"

---

## ✅ JOUR 10 - GESTION ERREURS GLOBALE

### Morning
- [ ] Audit de tous les appels API
  - [ ] Vérifier si `.response?.data?.error` est bien accédé
  - [ ] Vérifier si format `{ success, error, payload }` est bien respecté
  - [ ] Ajouter fallback si error n'existe pas

### Afternoon
- [ ] Tester chaque cas d'erreur
  - [ ] [ ] 400 : Données invalides (email manquant, etc.)
  - [ ] [ ] 401 : Token expiré → Redirect login
  - [ ] [ ] 404 : Produit/commande introuvable
  - [ ] [ ] 409 : Email existe, stock insuffisant
  - [ ] [ ] 423 : Compte verrouillé
  - [ ] [ ] 429 : Rate limit
  - [ ] [ ] 500 : Erreur serveur
  - [ ] [ ] 502 : Service indisponible

- [ ] Créer composant `ErrorBoundary` si absent
- [ ] Ajouter error toast notifications

### Evening
- [ ] Commit: "fix: comprehensive error handling"

---

## ✅ JOUR 11 - TESTS & OPTIMISATIONS

### Morning
- [ ] Test complet du flux utilisateur
  - [ ] Register → Login → Profile → Product → Cart → Checkout → Order
  - [ ] Chat → Message temps réel
  - [ ] Favoris → Follow → Pages favoris/following

### Afternoon
- [ ] Optimisations
  - [ ] Ajouter loading spinners partout
  - [ ] Ajouter skeleton screens sur listes
  - [ ] Vérifier responsive (mobile view)
  - [ ] Vérifier pas de console errors
  - [ ] Vérifier pas de memory leaks (DevTools)

### Evening
- [ ] Vérifier page load time < 2s
- [ ] Commit: "perf: loading states + optimizations"

---

## ✅ JOUR 12 - POLISH & FINALIZATION

### Morning
- [ ] Code review
  - [ ] Pas d'API keys dans localStorage
  - [ ] Pas de console.logs en prod
  - [ ] Structure propre et cohérente
  - [ ] Documentation de code suffisante

### Afternoon
- [ ] UX Polish
  - [ ] Messages de succès après chaque action
  - [ ] Confirmations avant suppression
  - [ ] Animations transition pages
  - [ ] Accessibility (alt text, labels, etc.)

- [ ] Documentation
  - [ ] README updated
  - [ ] API mapping documenté
  - [ ] Comment expliquant chaque slice Redux

### Evening
- [ ] Final commit: "docs: completion + final polish"
- [ ] Push vers main (si tous tests OK)
- [ ] Célébrer! 🎉

---

## 📍 CHECKLIST PAR PRIORITÉ

### 🔴 BLOCKER (Must do)
```
[D1] Axios interceptors fonctionnels
[D2] Pages Login/Register
[D3] Profil User
[D4-D6] Panier/Commandes
[D7-D8] Chat REST + Socket
```

### 🟡 IMPORTANT (Should do)
```
[D4] Produits détail + commentaires
[D9] Favoris + Following
[D10] Gestion erreurs globale
```

### 🟢 NICE TO HAVE (Could do)
```
[D11] Optimisations
[D12] Polish
```

---

## 🎯 CHECKPOINTS DE VALIDATION

### EOD Jour 1 ✅
- [ ] Axios interceptor répond à 401, 423, 429, 502
- [ ] JWT decode fonctionne
- [ ] Pas d'erreur console

### EOD Jour 2 ✅
- [ ] Login page accessible
- [ ] Register page accessible
- [ ] Login → Redirect vers /products
- [ ] Logout → Redirect vers /auth/login

### EOD Jour 3 ✅
- [ ] Profil chargeant correctement
- [ ] Edit profile sauvegarde
- [ ] Erreurs affichées correctement

### EOD Jour 6 ✅
- [ ] Produit visible en détail
- [ ] Commentaires affichés
- [ ] Checkout prend la commande
- [ ] Commandes listées

### EOD Jour 8 ✅
- [ ] Chat charge historique
- [ ] Messages envoyés en temps réel
- [ ] Typing indicators marchent
- [ ] Unread count update

### EOD Jour 9 ✅
- [ ] Favoris toggle fonctionne
- [ ] Following toggle fonctionne
- [ ] Pages favorites/following affichent résultats

### EOD Jour 12 ✅
- [ ] Zéro console error
- [ ] Tous les cas d'erreur gérés
- [ ] UI responsive sur mobile
- [ ] Pas de memory leaks
- [ ] Full user flow testé

---

## 🚀 GIT COMMIT MESSAGES

```bash
# Jour 1
git commit -m "feat: axios interceptors + jwt validation"

# Jour 2
git commit -m "feat: auth pages (login, register)"

# Jour 3
git commit -m "feat: user profile (view & edit)"

# Jour 4
git commit -m "feat: product detail + comments"

# Jour 5
git commit -m "feat: cart page (WIP)"

# Jour 6
git commit -m "feat: checkout + orders (GET)"

# Jour 7
git commit -m "feat: chat REST API (conversations, messages)"

# Jour 8
git commit -m "feat: chat complete (REST + Socket + indicators)"

# Jour 9
git commit -m "feat: favorites + following"

# Jour 10
git commit -m "fix: comprehensive error handling"

# Jour 11
git commit -m "perf: loading states + optimizations"

# Jour 12
git commit -m "docs: completion + final polish"
```

---

## 💡 TIPS & TRICKS

### Pendant le développement
- Garder DevTools Redux ouvert pour debug state
- Utiliser Network tab pour voir les requêtes API
- Tester endpoint directement dans Postman d'abord
- Commit tous les jours (sauvegarder!)

### Si vous bloquez
- Vérifier que backend répond: `curl http://localhost:8000/health`
- Vérifier format response vs code
- Tester directement l'endpoint au lieu de chercher dans le code
- Lire les logs backend pour comprendre l'erreur

### Performance
- Ne pas charger tous les produits d'une fois → pagination
- Utiliser React.memo() si trop de re-renders
- Lazy load les images
- Minifier avant production

---

**Bon courage! Vous avez ça! 💪**

Prochaine étape : **Commencer Jour 1 dès maintenant!** ⏱️
