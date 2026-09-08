# 🚀 PROMPT MASTER — CRÉATION COMPLÈTE DE L'APPLICATION LIFTOFF BODYRANK PRO

> **Mode d'emploi :** Copiez-collez l'intégralité du bloc ci-dessous dans une IA de développement (ou utilisez-le comme cahier des charges technique) pour générer l'application complète de A à Z.

---

```markdown
# MISSION : Développer une Application Full-Stack de Musculation & BodyRank RPG "Liftoff BodyRank Pro"

Tu es un Développeur Full-Stack Senior et Designer UI/UX d'élite.
Développe une application web complète, moderne, fluide et réactive de suivi de musculation intégrant un système de progression RPG inspiré de "Liftoff BodyRank" avec un mannequin anatomique vectoriel interactif haute fidélité.

---

## 🛠️ 1. STACK TECHNIQUE & ARCHITECTURE

- **Frontend** : React 19 + Vite + Tailwind CSS v4 + Lucide React (icônes).
- **Backend API** : Node.js + Express.js avec support REST API (CRUD complet des séances, exercices, statistiques, profil).
- **Base de Données** : Base JSON persistante atomique ou SQLite (gestion des séances, historique des séries/reps/poids, calcul automatique du 1RM et des records personnels PR).
- **Mode Hybride (Local & Web)** : Détection automatique de l'API avec fallback transparent sur `localStorage` pour fonctionner à la fois en serveur local et en mode statique hébergé (ex: GitHub Pages).
- **Graphismes & Visualisation** : Mannequin anatomique 100% SVG vectoriel sur-mesure (sans dépendances 3D lourdes) + Radar Chart SVG d'harmonie musculaire 360°.

---

## 🎨 2. DIRECTION ARTISTIQUE & DESIGN SYSTEM

- **Ambiance** : Cyberpunk Fitness / Dark OLED (`#08080a`, `#121216`).
- **Couleurs & Accents** :
  - Primaire : Vert Émeraude Néon (`#10b981`, `#059669`)
  - Accent : Cyan Néon (`#06b6d4`), Violet Cyber (`#8b5cf6`), Ambre Feu (`#f59e0b`), Rubis (`#ef4444`)
- **Effets Visuels** : Glassmorphism (cartes en verre dépoli avec `backdrop-blur-md` et bordures subtiles `border-white/10`), reflets néons dynamiques (`neon-glow`), barres d'XP animées avec effet `shimmer`.
- **Typographie & Ergonomie** : Police sans-serif ultra-lisible, chiffres tabulaires pour les poids/reps, boutons tactiles optimisés mobile (hitbox généreuses).

---

## ⚡ 3. FONCTIONNALITÉS CLÉS DU JOURNAL D'ENTRAÎNEMENT

1. **Enregistrement Rapide de Séances** :
   - Nom de la séance (ex: *Push Day A*, *Legs Focus Quads*), date et heure.
   - Ajout dynamique d'exercices parmi une bibliothèque exhaustive classée par groupe musculaire (Pectoraux, Dos, Épaules, Bras, Jambes, Abdos).
   - Ajout rapide de séries avec : Poids (kg), Répétitions, RPE (Taux d'effort perçu), Type de série (Warmup, Normal, Drop set, Failure).
   - Calcul en temps réel du volume total de la séance (kg et tonnes) et du 1RM estimé (formule Epley / Brzycki : $1RM = \text{Poids} \times (1 + \frac{\text{Reps}}{30})$).
   - Détection et célébration automatique des Nouveaux Records Personnels (PR 🏆).

2. **Chronomètre de Repos Intégré** :
   - Timer interactif configurable (30s, 60s, 90s, 2min, 3min, 5min) avec alerte visuelle et sonore à la fin du décompte.

3. **Historique & Journal** :
   - Vue chronologique des séances passées avec badge de volume, exercices réalisés et possibilité de modifier / dupliquer / supprimer une séance.

---

## 🧍‍♂️ 4. SYSTÈME BODYRANK & MANNEQUIN ANATOMIQUE HD (INSPIRÉ DE LIFTOFF)

1. **Mannequin Anatomique Vectoriel 15 Groupes Musculaires (Face & Dos)** :
   - **Vue Face** : Pectoraux (Haut & Bas), Deltoïdes Antérieurs & Latéraux, Biceps (Court & Long), Avant-bras, 6-Pack Abdominaux, Obliques (V-Cut), Quadriceps (Droit fémoral & Goutte vaste interne), Mollets.
   - **Vue Dos** : Trapèzes complets (Losange), Grand Dorsal, Deltoïdes Postérieurs, Triceps (Fer à cheval), Lombaires, Grand Fessier, Ischio-jambiers, Mollets.
   - **Éclairage Dynamique par Rang** : Chaque muscle s'illumine avec les dégradés de couleur correspondant à son niveau d'XP et son rang.
   - **Interactivité** : Survol avec infobulle holographique (Niveau, XP, Rang) et clic pour ouvrir la fiche détaillée du muscle.

2. **Système de Rangs & Niveaux RPG** :
   - **Niveaux de 1 à 100** avec calcul d'XP basé sur les 1RM réels et le volume d'entraînement.
   - **Échelons de Rangs** :
     - ⚪ **Rang E — Novice** (Gris/Blanc)
     - 🟢 **Rang D — Apprenti** (Émeraude)
     - 🔵 **Rang C — Guerrier** (Cyan/Bleu)
     - 🟣 **Rang B — Athlète** (Violet/Améthyste)
     - 🟡 **Rang A — Maître** (Doré/Ambre)
     - 🔴 **Rang S — Légende** (Rubis/Rouge)
     - 💎 **Rang S+ — Titan** (Diamant Holographique)

3. **Fiche Muscle & Paliers de Force (Standards Liftoff)** :
   - Affichage des charges cibles en kg selon le poids corporel pour débloquer les paliers :
     - *Novice ➔ Intermédiaire ➔ Avancé ➔ Élite*.
   - Liste des exercices recommandés et historique des performances sur ce muscle.

4. **Radar d'Harmonie Musculaire 360°** :
   - Graphique spider chart SVG évaluant l'équilibre entre les grands axes (Poussée, Tirage, Jambes, Bras, Core).

---

## 🏆 5. SYSTÈME DE SUCCÈS & TROPHÉES (RPG ACHIEVEMENTS)

- Plus de 20 succès déblocables automatiquement :
  - *Premier Pas* (1ère séance enregistrée).
  - *Club des 100kg* (100kg au Bench Press ou Squat).
  - *Titan du Volume* (Dépasser 10 tonnes sur une séance).
  - *Régularité de Fer* (5 séances consécutives).
  - *Centurion* (100 répétitions cumulées dans un entraînement).
  - *Maître du Dos* / *Pecs d'Acier* (Atteindre le Rang A sur un groupe).
- Modale interactive avec badges métalliques (Bronze, Argent, Or, Platine, Diamant), barre de complétion globale et date de déblocage.

---

## 📊 6. PAGE STATISTIQUES & ANALYTICS AVANCÉES

- **Cartes KPI** : Volume cumulé (en tonnes), Nombre total de séances, Total des séries, Total des répétitions, Record absolu.
- **Graphique d'Évolution du Volume** : Courbe de surcharge progressive au fil des semaines.
- **Courbe de Progression du 1RM** : Sélecteur d'exercice (ex: Développé Couché, Squat, Soulevé de terre) pour voir l'évolution de la force max dans le temps.
- **Répartition Musculaire** : Camembert/Histogramme montrant les muscles les plus travaillés et les points faibles.

---

## 🗂️ 7. STRUCTURE RECOMMANDÉE DU PROJET

```
workout-app/
├── server/
│   ├── index.js              # Serveur Express REST API (CORS, CRUD workouts, stats)
│   ├── database.js           # Gestionnaire de base de données JSON/SQLite atomique
│   └── seedData.js           # Données réalistes d'exemple pour démonstration
├── src/
│   ├── components/
│   │   ├── Navbar.jsx               # Barre de navigation avec badge de niveau BodyRank & menu
│   │   ├── WorkoutList.jsx          # Liste & cartes des séances avec filtres et actions
│   │   ├── WorkoutForm.jsx          # Formulaire d'enregistrement avec séries, RPE, timer
│   │   ├── AnatomicalMannequin.jsx  # Mannequin SVG Face/Dos ultra-détaillé interactif
│   │   ├── BodyRankViewer.jsx       # Dashboard BodyRank, radar 360°, fiches muscles & standards
│   │   ├── StatsPage.jsx            # Graphiques de volume, progression 1RM, KPIs
│   │   ├── RestTimer.jsx            # Chronomètre de repos sonore & visuel
│   │   └── AchievementsModal.jsx    # Système de trophées RPG
│   ├── utils/
│   │   ├── bodyRank.js              # Algorithmes d'XP, calculs 1RM, standards de force
│   │   ├── storage.js               # Passerelle API / LocalStorage hybride
│   │   └── sounds.js                # Synthétiseur audio Web Audio API pour le timer/PR
│   ├── App.jsx                      # Routeur d'états, synchronisation et thèmes
│   ├── index.css                    # Styles Tailwind v4, animations néon & glassmorphism
│   └── main.jsx
├── package.json
├── vite.config.js
└── tailwind.config.js
```

---

## 🚀 8. INSTRUCTIONS D'EXÉCUTION

1. Configure les endpoints backend sur `/api/workouts`, `/api/stats`, `/api/exercises`.
2. Configure le proxy Vite dans `vite.config.js` pour rediriger `/api` vers `http://127.0.0.1:3001`.
3. Assure-toi que l'application est 100% responsive (Mobile First, Tablette, Desktop).
4. Fournis un jeu de données initial riche et cohérent pour que l'application soit immédiatement vivante et visuellement impressionnante dès le premier lancement.
```
