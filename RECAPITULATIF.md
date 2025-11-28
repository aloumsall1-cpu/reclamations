# 📋 RÉCAPITULATIF - Système de Réclamations P35/P34

## 📁 Fichiers du Projet

```
SITE/
├── index.html          ← Page principale
├── styles.css          ← Styles (moderne, sans gradient)
├── app.js              ← Logique JavaScript
├── README.md           ← Documentation
├── netlify.toml        ← Config Netlify
├── package.json        ← Config npm
└── .gitignore          ← Git ignore
```

## ✨ Fonctionnalités

### Login Étudiant
- P35/P34 + Code (4 chiffres)
- Si existe → Accueil
- Si N/existe pas → Créer compte

### Accueil Étudiant
- Voir infos perso
- Modifier infos
- Ajouter/modifier/supprimer réclamations
- 30 matières disponibles

### Admin (P35 / 0099)
- Dashboard toutes réclamations
- Pagination (10 par page)
- Voir détails complets
- Télécharger PDF/CSV/JSON
- Filtres avancés

## 🚀 Déployer sur GitHub

```bash
# 1. Créer repo GitHub
git init
git add .
git commit -m "Système réclamations"
git branch -M main
git remote add origin https://github.com/VotreUsername/reclamations.git
git push -u origin main

# 2. Connecter à Netlify
- Allez sur netlify.com
- "New site from Git"
- Sélectionnez GitHub
- Votre repo → Deploy

# Le site est en ligne !
```

## 🔐 Comptes Test

**Admin:** P35 / 0099  
**Étudiant:** Créez votre compte

## 🎨 Design

✅ Moderne (pas de gradient)  
✅ Responsive  
✅ Bleu professionnel (#3b82f6)  
✅ Animations fluides

## 💾 Données

**Actuellement:** En mémoire (stockage local)  
**Pour production:** Ajouter Supabase dans app.js

---

**Prêt à déployer !** 🎉
