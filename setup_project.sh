#!/usr/bin/env bash
# ==============================================================================
# SCRIPT DE DÉPLOIEMENT & INSTALLATION RAPIDE — LIFTOFF BODYRANK PRO
# ==============================================================================

set -e

echo "🚀 Démarrage de l'installation de Liftoff BodyRank Pro..."

# 1. Cloner le repository
if [ ! -d "gym-tracker" ]; then
  git clone https://github.com/BatmanMiyuki/gym-tracker.git
  cd gym-tracker
else
  cd gym-tracker
  git pull origin main
fi

# 2. Installer les dépendances
echo "📦 Installation des dépendances npm..."
npm install

# 3. Démarrer le serveur de développement (Backend Express + Frontend Vite)
echo "⚡ Démarrage de l'application..."
npm run dev
