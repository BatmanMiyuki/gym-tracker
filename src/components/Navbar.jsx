// src/components/Navbar.jsx
import React from 'react';
import {
  Dumbbell,
  Calendar,
  PlusCircle,
  BarChart3,
  Trophy,
  RefreshCw,
  Sparkles,
  Shield,
  Activity,
} from 'lucide-react';

export default function Navbar({
  activeTab,
  onSelectTab,
  onOpenNewWorkout,
  onOpenAchievements,
  onResetData,
  globalRank,
  globalLevel,
}) {
  return (
    <header className="sticky top-0 z-40 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800 px-3 sm:px-4 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
        {/* Brand with BodyRank Level */}
        <div
          onClick={() => onSelectTab('bodyrank')}
          className="flex items-center gap-2.5 cursor-pointer hover:opacity-95 transition-opacity"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-400 flex items-center justify-center text-black font-black shadow-lg shadow-emerald-500/25">
            <Dumbbell className="w-5 h-5 -rotate-45" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-lg tracking-wider bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                LIFTOFF
              </span>
              {globalRank && (
                <span
                  className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full border shadow-sm"
                  style={{
                    backgroundColor: globalRank.bg,
                    borderColor: globalRank.border,
                    color: globalRank.color,
                  }}
                >
                  {globalRank.id} • Nv.{globalLevel}
                </span>
              )}
            </div>
            <p className="text-[10px] text-zinc-400 leading-none">BodyRank & Musculation RPG</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2">
          {/* BodyRank Tab */}
          <button
            onClick={() => onSelectTab('bodyrank')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'bodyrank'
                ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/25 font-black'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span className="hidden sm:inline">BodyRank</span>
            <span className="sm:hidden">Rangs</span>
          </button>

          {/* Workouts Tab */}
          <button
            onClick={() => onSelectTab('list')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'list'
                ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/25 font-black'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span className="hidden sm:inline">Séances</span>
            <span className="sm:hidden">Journal</span>
          </button>

          {/* Stats Tab */}
          <button
            onClick={() => onSelectTab('stats')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'stats'
                ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/25 font-black'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Stats</span>
          </button>

          {/* Trophies Button */}
          <button
            onClick={onOpenAchievements}
            title="Succès & Trophées"
            className="p-2 rounded-2xl text-amber-400 hover:bg-zinc-900 hover:text-amber-300 transition-colors"
          >
            <Trophy className="w-4 h-4" />
          </button>

          {/* New Workout CTA */}
          <button
            onClick={onOpenNewWorkout}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-zinc-900 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500 hover:text-black text-xs sm:text-sm font-black transition-all shadow-md active:scale-95 ml-1"
          >
            <PlusCircle className="w-4 h-4" />
            <span className="hidden md:inline">+ Séance</span>
          </button>

          {/* Reset Demo Data */}
          <button
            onClick={onResetData}
            title="Recharger l'historique depuis Avril 2026"
            className="p-2 rounded-2xl text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900 transition-colors hidden sm:block"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </nav>
      </div>
    </header>
  );
}
