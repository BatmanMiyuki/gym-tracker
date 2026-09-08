// src/components/AchievementsModal.jsx
import React from 'react';
import { X, Award, Trophy, CheckCircle2, Lock, Sparkles } from 'lucide-react';
import { ACHIEVEMENTS } from '../utils/bodyRank';

export default function AchievementsModal({ workouts = [], bodyRankData = {}, onClose }) {
  const unlockedCount = ACHIEVEMENTS.filter((ach) =>
    ach.check(workouts, bodyRankData)
  ).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md">
      <div className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-zinc-800 bg-zinc-950/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-lg text-white">Trophées & Succès</h3>
              <p className="text-xs text-zinc-400">
                {unlockedCount} / {ACHIEVEMENTS.length} succès débloqués
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of Trophies */}
        <div className="p-5 overflow-y-auto space-y-2.5 divide-y divide-zinc-800/40">
          {ACHIEVEMENTS.map((ach) => {
            const isUnlocked = ach.check(workouts, bodyRankData);

            return (
              <div
                key={ach.id}
                className={`pt-2.5 first:pt-0 p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                  isUnlocked
                    ? 'bg-zinc-950 border-emerald-500/30 shadow-md'
                    : 'bg-zinc-950/40 border-zinc-850 opacity-60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl shadow-inner border ${
                      isUnlocked
                        ? 'bg-gradient-to-tr from-amber-500/20 to-emerald-500/20 border-amber-500/40'
                        : 'bg-zinc-900 border-zinc-800'
                    }`}
                  >
                    {ach.icon}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4
                        className={`font-black text-sm ${
                          isUnlocked ? 'text-white' : 'text-zinc-400'
                        }`}
                      >
                        {ach.title}
                      </h4>
                      {isUnlocked && (
                        <span className="text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-400 px-1.5 py-0.2 rounded">
                          Débloqué
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-400 mt-0.5">{ach.desc}</p>
                  </div>
                </div>

                <div>
                  {isUnlocked ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <Lock className="w-4 h-4 text-zinc-600" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-950/80">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
