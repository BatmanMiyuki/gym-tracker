// src/components/Header.jsx
import React from 'react';
import { Dumbbell, Calculator, Disc, Settings, Smartphone, Monitor } from 'lucide-react';

export default function Header({
  activeWorkout,
  onOpen1RM,
  onOpenPlateCalc,
  onOpenSettings,
  viewMode,
  onToggleViewMode,
  onOpenActiveWorkout,
}) {
  return (
    <header className="sticky top-0 z-30 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/80 px-4 py-3">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-black font-black">
            <Dumbbell className="w-5 h-5 text-black transform -rotate-45" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-lg tracking-wider bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                FORGE
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded">
                GYM PRO
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-none">Suivi d'entraînement & force</p>
          </div>
        </div>

        {/* Quick Tools & Settings */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* 1RM Calculator */}
          <button
            onClick={onOpen1RM}
            title="Calculateur 1RM"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-emerald-500/50 hover:bg-zinc-800/80 text-zinc-300 hover:text-emerald-400 transition-all text-xs font-semibold"
          >
            <Calculator className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">1RM</span>
          </button>

          {/* Plate Calculator */}
          <button
            onClick={onOpenPlateCalc}
            title="Calculateur de disques"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-emerald-500/50 hover:bg-zinc-800/80 text-zinc-300 hover:text-emerald-400 transition-all text-xs font-semibold"
          >
            <Disc className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">Disques</span>
          </button>

          {/* Desktop / Mobile Frame View Switcher */}
          <button
            onClick={onToggleViewMode}
            title={viewMode === 'full' ? 'Passer en vue mobile' : 'Passer en plein écran'}
            className="hidden md:flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-all text-xs font-medium"
          >
            {viewMode === 'full' ? (
              <>
                <Smartphone className="w-3.5 h-3.5 text-zinc-400" />
                <span>Mobile UI</span>
              </>
            ) : (
              <>
                <Monitor className="w-3.5 h-3.5 text-zinc-400" />
                <span>Plein écran</span>
              </>
            )}
          </button>

          {/* Settings */}
          <button
            onClick={onOpenSettings}
            title="Paramètres & Sauvegarde"
            className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-all"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
