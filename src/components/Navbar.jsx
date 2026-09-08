// src/components/Navbar.jsx
import React from 'react';
import { Dumbbell, Calendar, PlusCircle, BarChart3, Database, RefreshCw } from 'lucide-react';

export default function Navbar({ activeTab, onSelectTab, onOpenNewWorkout, onResetData }) {
  return (
    <header className="sticky top-0 z-40 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800 px-4 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
        {/* Brand */}
        <div
          onClick={() => onSelectTab('list')}
          className="flex items-center gap-2.5 cursor-pointer hover:opacity-90 transition-opacity"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-black font-black shadow-lg shadow-emerald-500/20">
            <Dumbbell className="w-5 h-5 -rotate-45" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-lg tracking-wider text-white">GYM TRACKER</span>
              <span className="text-[10px] font-extrabold uppercase bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded">
                Full-Stack
              </span>
            </div>
            <p className="text-[11px] text-zinc-400">Suivi de séances & statistiques</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => onSelectTab('list')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'list'
                ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20'
                : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span className="hidden sm:inline">Mes Séances</span>
            <span className="sm:hidden">Séances</span>
          </button>

          <button
            onClick={() => onSelectTab('stats')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'stats'
                ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20'
                : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Statistiques</span>
          </button>

          <button
            onClick={onOpenNewWorkout}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-900 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500 hover:text-black text-xs sm:text-sm font-bold transition-all shadow-md"
          >
            <PlusCircle className="w-4 h-4" />
            <span className="hidden md:inline">Ajouter une séance</span>
            <span className="md:hidden">+ Séance</span>
          </button>

          <button
            onClick={onResetData}
            title="Recharger l'historique de démo (depuis Avril)"
            className="p-2 rounded-xl text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </nav>
      </div>
    </header>
  );
}
