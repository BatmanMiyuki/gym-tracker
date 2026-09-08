// src/components/Navigation.jsx
import React from 'react';
import { Dumbbell, History, BookOpen, LineChart, Play, ChevronUp } from 'lucide-react';
import { formatDuration } from '../utils/formatters';

export default function Navigation({
  currentTab,
  onSelectTab,
  activeWorkout,
  activeWorkoutDuration,
  onOpenActiveWorkout,
}) {
  const tabs = [
    { id: 'templates', label: 'Séance', icon: Dumbbell },
    { id: 'history', label: 'Historique', icon: History },
    { id: 'exercises', label: 'Exercices', icon: BookOpen },
    { id: 'analytics', label: 'Progression', icon: LineChart },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40">
      {/* Persistent Active Workout Mini Banner (if active workout exists and not in active workout view) */}
      {activeWorkout && currentTab !== 'active_workout' && (
        <div className="max-w-lg mx-auto px-3 pb-2">
          <div
            onClick={onOpenActiveWorkout}
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-700 text-black p-3 rounded-xl shadow-xl shadow-emerald-950/50 flex items-center justify-between cursor-pointer border border-emerald-400/40 hover:brightness-105 active:scale-[0.99] transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-black/20 flex items-center justify-center animate-pulse">
                <Play className="w-4 h-4 text-black fill-current" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-wider text-black/80">
                    Séance en cours
                  </span>
                  <span className="inline-block w-2 h-2 rounded-full bg-black animate-ping" />
                </div>
                <div className="font-bold text-sm text-black truncate max-w-[180px] sm:max-w-[240px]">
                  {activeWorkout.name || 'Séance personnalisée'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-sm bg-black/20 px-2.5 py-1 rounded-md text-black">
                {formatDuration(activeWorkoutDuration)}
              </span>
              <ChevronUp className="w-5 h-5 text-black" />
            </div>
          </div>
        </div>
      )}

      {/* Main Bottom Nav Bar */}
      <nav className="bg-zinc-950/90 backdrop-blur-lg border-t border-zinc-800/80 px-2 py-2">
        <div className="max-w-md mx-auto flex items-center justify-around">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`flex flex-col items-center py-1 px-3 rounded-xl transition-all relative ${
                  isActive
                    ? 'text-emerald-400 font-bold scale-105'
                    : 'text-zinc-400 hover:text-zinc-200 font-medium'
                }`}
              >
                {isActive && (
                  <span className="absolute -top-1 w-6 h-1 bg-emerald-400 rounded-full shadow-[0_0_8px_#34d399]" />
                )}
                <Icon className={`w-5 h-5 mb-1 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                <span className="text-[11px] tracking-tight">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
