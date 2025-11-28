# Système de Gestion des Réclamations - Communication P35/P34

Un site web moderne pour gérer les réclamations des étudiants en Communication.

## 🎯 Fonctionnalités

### Pour les Étudiants
- ✅ Login avec Programme (P35/P34) et Code (4 chiffres)
- ✅ Création de profil utilisateur
- ✅ Modification des informations personnelles
- ✅ Consultation des réclamations
- ✅ Ajout/modification/suppression de réclamations
- ✅ Filtrage par programme et code

### Pour les Admins
- ✅ Login spécial (P35 / 0099)
- ✅ Dashboard avec toutes les réclamations
- ✅ Pagination (10 items par page)
- ✅ Vue détaillée de chaque réclamation
- ✅ Téléchargement en PDF/CSV/JSON
- ✅ Filtrage avancé (matière, programme, note)

## 📋 Matières Disponibles

1. Théories des sciences de l'information et de la communication
2. Socio-histoire des médias
3. Fondements de la communication des organisations
4. Sociologie des entreprises
5. Métiers de la communication
6. Et 22 autres matières...

## 🚀 Installation Rapide

### Option 1 : Fichiers Statiques (Plus Simple)

```bash
# 1. Téléchargez les fichiers dans un dossier
# - index.html
# - styles.css
# - app.js

# 2. Ouvrez index.html dans un navigateur
# Double-cliquez sur le fichier
```

### Option 2 : Avec un Serveur Local

```bash
# Python 3
python -m http.server 8000

# Node.js (http-server)
npm install -g http-server
http-server .

# PHP
php -S localhost:8000
```

Accédez à http://localhost:8000

## 🔐 Comptes de Test

### Admin
- **Programme**: P35
- **Code**: 0099

### Utilisateur Exemple
- **Programme**: P35 ou P34
- **Code**: 0000 (créez votre propre compte à la première connexion)

## 🎨 Design

- Design moderne et minimaliste (sans gradient)
- Interface responsive (mobile, tablet, desktop)
- Couleurs professionnelles
- Animations fluides
- Accessibilité optimale

## 📦 Structure des Fichiers

```
SITE/
├── index.html              # Page HTML principale
├── styles.css              # Styles CSS
├── app.js                  # Logique JavaScript
├── README.md               # Ce fichier
└── SETUP_SUPABASE.md       # Guide Supabase (optionnel)
```

## 🗄️ Données (Stockage Local)

Actuellement, les données sont stockées en mémoire JavaScript. Pour la production, utilisez Supabase (voir SETUP_SUPABASE.md).

### Structure des Données

**Users:**
- id
- program (P35 ou P34)
- code (4 chiffres)
- nom
- prenom
- niveau (L1, L2, L3)
- email
- createdAt
- updatedAt

**Reclamations:**
- id
- userId
- matiere
- semestre (1 ou 2)
- note (0-20 ou NÉANT)
- commentaire
- createdAt
- updatedAt

## 🔗 Déploiement Gratuit

### Sur Netlify (Recommandé)

1. Créez un compte sur netlify.com
2. Glissez-déposez le dossier SITE
3. Le site est automatiquement en ligne

### Sur GitHub Pages

1. Créez un repo GitHub
2. Uploadez les fichiers
3. Activez GitHub Pages dans Settings
4. Le site est accessible via `username.github.io/repo-name`

### Sur Vercel

1. Créez un compte sur vercel.com
2. Connectez votre repo GitHub
3. Vercel déploie automatiquement

## 🔄 Flux d'Utilisation

### 1. Login Étudiant
```
Popup 1: Sélectionner P35/P34 + Code (4 chiffres)
  ↓
Vérification dans BD
  ├─→ Trouvé → Accueil
  └─→ Non trouvé → Popup 2
```

### 2. Création de Compte
```
Popup 2: Remplir Nom, Prénom, Niveau, Email
  ↓
Créer utilisateur
  ↓
Accueil avec mes réclamations
```

### 3. Accueil Étudiant
```
- Affichage infos personnelles
- Bouton "Modifier mes infos"
- Bouton "Ajouter une réclamation"
- Liste de mes réclamations (modifier/supprimer)
```

### 4. Admin Dashboard
```
P35 / 0099
  ↓
Liste de TOUTES les réclamations
  ↓
- Pagination
- Voir détails
- Télécharger (avec filtres)
```

## 📥 Téléchargement

### Formats Supportés
- **PDF** : Pour imprimer ou archiver
- **CSV** : Pour Excel/Sheets
- **JSON** : Pour développeurs

### Filtres de Téléchargement
- Matière spécifique
- Programme (P35 ou P34)
- Notes (NÉANT ou non-NÉANT)
- Ou tous les critères

## 🛠️ Personnalisation

### Changer les Couleurs
Modifiez dans `styles.css`:
```css
--primary-color: #3b82f6;  /* Bleu */
--secondary-color: #e5e7eb; /* Gris clair */
```

### Ajouter une Matière
Dans `index.html`, ajoutez une option dans les select:
```html
<option value="Nouvelle Matière">Nouvelle Matière</option>
```

### Ajouter un Admin
Dans `app.js`, modifiez `checkLogin()`:
```javascript
if (program === 'P35' && code === '0099') { // Changez ici
```

## 🐛 Dépannage

### "Le site ne se charge pas"
- Vérifiez que tous les fichiers sont dans le même dossier
- Ouvrez la console (F12) pour voir les erreurs

### "Mes données disparaissent au rechargement"
- C'est normal avec la version actuelle (stockage en mémoire)
- Utilisez Supabase pour la persistance (voir SETUP_SUPABASE.md)

### "Je ne peux pas créer de compte"
- Vérifiez que tous les champs sont remplis
- L'email doit avoir un "@"

## 📱 Responsive

- ✅ Desktop (1920px+)
- ✅ Tablet (768px - 1024px)
- ✅ Mobile (320px - 767px)

## 🔐 Sécurité

**Version Actuelle (Développement):**
- Stockage en mémoire (données non persistantes)
- Code fourni au client

**Pour la Production:**
- Utilisez Supabase avec authentification JWT
- Validez tout côté serveur
- Chiffrez les données sensibles
- Utilisez HTTPS

## 📞 Support

Pour ajouter Supabase ou déployer:
1. Consultez SETUP_SUPABASE.md
2. Ou contactez un développeur

## 📄 License

Libre d'utilisation pour votre institution.

---

**Version:** 1.0  
**Créé:** Novembre 2025  
**Dernière mise à jour:** Novembre 2025
