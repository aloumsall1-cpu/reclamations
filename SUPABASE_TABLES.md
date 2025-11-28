# 📊 Tables Supabase - SQL

## Table 1: USERS

```sql
CREATE TABLE users (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  program VARCHAR(10) NOT NULL,
  code VARCHAR(10) NOT NULL UNIQUE,
  nom VARCHAR(100) NOT NULL,
  prenom VARCHAR(100) NOT NULL,
  niveau VARCHAR(5) NOT NULL CHECK (niveau IN ('L1', 'L2', 'L3')),
  email VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Variables:
- `id` - ID unique (auto-incrémenté)
- `program` - P35 ou P34
- `code` - Code 4 chiffres (unique)
- `nom` - Nom de l'étudiant
- `prenom` - Prénom
- `niveau` - L1, L2 ou L3
- `email` - Email (unique)
- `created_at` - Date création
- `updated_at` - Date dernière modif

---

## Table 2: RECLAMATIONS

```sql
CREATE TABLE reclamations (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  matiere VARCHAR(255) NOT NULL,
  semestre INT NOT NULL CHECK (semestre IN (1, 2)),
  note VARCHAR(20),
  commentaire TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Variables:
- `id` - ID unique
- `user_id` - ID de l'utilisateur (référence)
- `matiere` - Nom de la matière
- `semestre` - 1 ou 2
- `note` - 0-20 ou "NÉANT"
- `commentaire` - Description de la réclamation
- `created_at` - Date création
- `updated_at` - Date dernière modif

---

## 🚀 Comment Créer sur Supabase

### 1. Allez sur https://supabase.com

### 2. Connectez-vous et ouvrez votre projet

### 3. Allez à "SQL Editor"

### 4. Créez la table USERS
Copiez-collez ce code :

```sql
CREATE TABLE users (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  program VARCHAR(10) NOT NULL,
  code VARCHAR(10) NOT NULL UNIQUE,
  nom VARCHAR(100) NOT NULL,
  prenom VARCHAR(100) NOT NULL,
  niveau VARCHAR(5) NOT NULL CHECK (niveau IN ('L1', 'L2', 'L3')),
  email VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

Cliquez "Run" → ✅ Table créée

### 5. Créez la table RECLAMATIONS
Copiez-collez ce code :

```sql
CREATE TABLE reclamations (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  matiere VARCHAR(255) NOT NULL,
  semestre INT NOT NULL CHECK (semestre IN (1, 2)),
  note VARCHAR(20),
  commentaire TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

Cliquez "Run" → ✅ Table créée

---

## 6. Récupérer vos Clés Supabase

### Allez à Settings → API

Vous aurez besoin de :
- **SUPABASE_URL** (Project URL)
- **SUPABASE_ANON_KEY** (anon public key)

---

## 7. Modifier app.js

En haut du fichier, remplacez ceci :

```javascript
const DB = {
    users: [...],
    reclamations: [...]
};
```

Par ceci :

```javascript
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'votre_SUPABASE_URL'
const SUPABASE_ANON_KEY = 'votre_SUPABASE_ANON_KEY'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
```

---

## 8. Installer Supabase Client

Si vous utilisez un bundler (Vite, Next.js) :

```bash
npm install @supabase/supabase-js
```

Pour HTML pur, ajoutez dans `<head>` :

```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js"></script>
```

---

## ⚠️ Important

Votre app.js actuellement utilise une **BD en mémoire** (données perdues au rechargement).

Pour utiliser Supabase, il faut :
1. Créer les tables ✅
2. Remplacer `DB` par `supabase`
3. Modifier les fonctions (checkLogin, createUser, etc.)

---

## 📝 Exemple: Modifier checkLogin()

### Avant (mémoire):
```javascript
const user = DB.users.find(u => u.program === program && u.code === code);
```

### Après (Supabase):
```javascript
const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('program', program)
    .eq('code', code)
    .single()
```

---

**Besoin d'aide pour migrer l'app.js vers Supabase ?** Demandez ! 🚀
