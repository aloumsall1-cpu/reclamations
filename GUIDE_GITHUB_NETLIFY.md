# 📖 Guide Déploiement GitHub + Netlify

## Étape 1 : Installer Git

### Windows
1. Allez sur https://git-scm.com/download/win
2. Téléchargez l'installeur
3. Lancez-le et cliquez "Next" partout
4. Redémarrez votre ordinateur

### Vérifier Git
```bash
git --version
```

---

## Étape 2 : Créer un Repo GitHub

1. Allez sur https://github.com
2. Connexion/Créez un compte
3. Cliquez "+" en haut à droite → "New repository"
4. **Nom:** `reclamations` ou autre
5. **Description:** "Système de gestion des réclamations P35/P34"
6. **Public** (pour que Netlify puisse accéder)
7. Cochez "Add a README file"
8. Cliquez "Create repository"

---

## Étape 3 : Configurer Git Localement

Ouvrez PowerShell et exécutez :

```bash
git config --global user.name "Votre Nom"
git config --global user.email "votre.email@gmail.com"
```

---

## Étape 4 : Initialiser le Repo Local

```bash
cd "c:\Users\ALIOU SALL\Desktop\SITE"
git init
git add .
git commit -m "Initial commit - Système réclamations"
```

---

## Étape 5 : Connecter à GitHub

### Sur GitHub
1. Allez dans votre repo
2. Cliquez "<> Code" (vert)
3. Copiez l'URL HTTPS
   - Ex: `https://github.com/VotreUsername/reclamations.git`

### Dans PowerShell
```bash
cd "c:\Users\ALIOU SALL\Desktop\SITE"
git remote add origin https://github.com/VotreUsername/reclamations.git
git branch -M main
git push -u origin main
```

⚠️ **Remplacez VotreUsername par votre nom GitHub**

---

## Étape 6 : Authentification GitHub (2024+)

GitHub demande un token au lieu du mot de passe.

### Générer un Token
1. Allez sur https://github.com/settings/tokens
2. Cliquez "Generate new token (classic)"
3. Nommez-le "git-push"
4. Cochez: `repo`, `write:packages`
5. Cliquez "Generate token"
6. **Copiez le token** (vous ne le verrez qu'une fois !)

### Utiliser le Token
Quand PowerShell demande le mot de passe, collez le token.

---

## Étape 7 : Vérifier sur GitHub

1. Allez sur https://github.com/VotreUsername/reclamations
2. Vous devez voir vos fichiers :
   - index.html
   - styles.css
   - app.js
   - etc.

---

## Étape 8 : Déployer sur Netlify

### Option A : Avec GitHub
1. Allez sur https://netlify.com
2. Connectez-vous (avec GitHub)
3. Cliquez "New site from Git"
4. Choisissez GitHub
5. Autorisez Netlify
6. Trouvez votre repo "reclamations"
7. Cliquez "Deploy"
8. ⏳ Attendre 30 secondes
9. ✨ Votre site est en ligne !

### Option B : Sans GitHub
1. Sur Netlify: "Sites" → "Add new site"
2. "Deploy manually"
3. Glissez-déposez le dossier SITE
4. ✨ Site en ligne !

---

## Résultat Final

Votre site sera accessible à :
- `https://votre-nom-site.netlify.app`
- Ou votre domaine personnalisé

---

## Commandes Futures (Mises à jour)

```bash
cd "c:\Users\ALIOU SALL\Desktop\SITE"
git add .
git commit -m "Description des changements"
git push
```

Netlify redéploie automatiquement ! 🚀

---

**Besoin d'aide ?**
- GitHub Help: https://docs.github.com
- Netlify Docs: https://docs.netlify.com
