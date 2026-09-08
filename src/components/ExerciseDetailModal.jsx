// src/components/ExerciseDetailModal.jsx
import React from 'react';
import { X, Trophy, TrendingUp, Info, Calendar, Dumbbell, ShieldCheck } from 'lucide-react';
import { storageService } from '../services/storage';
import { MUSCLE_GROUPS, EQUIPMENT_TYPES } from '../data/exercises';
import { formatDateFrench } from '../utils/formatters';

export default function ExerciseDetailModal({ exercise, onClose, onStartWithExercise }) {
  if (!exercise) return null;

  const stats = storageService.getExerciseStats(exercise.id);
  const muscle = MUSCLE_GROUPS.find((m) => m.id === exercise.category);
  const equip = EQUIPMENT_TYPES.find((e) => e.id === exercise.equipment);

  // Prepare SVG chart points if history exists
  const historyPoints = stats.history || [];
  const hasHistory = historyPoints.length > 1;

  // Calculate SVG polyline coordinates
  let minWeight = 0;
  let maxWeight = 100;
  let pointsStr = '';
  let areaStr = '';

  if (hasHistory) {
    const weights = historyPoints.map((h) => h.maxWeight);
    minWeight = Math.max(0, Math.min(...weights) - 5);
    maxWeight = Math.max(...weights) + 5;
    const range = maxWeight - minWeight || 1;

    const width = 320;
    const height = 120;
    const padding = 15;

    const coords = historyPoints.map((h, idx) => {
      const x = padding + (idx / (historyPoints.length - 1)) * (width - 2 * padding);
      const y = height - padding - ((h.maxWeight - minWeight) / range) * (height - 2 * padding);
      return { x, y, weight: h.maxWeight, date: h.date };
    });

    pointsStr = coords.map((c) => `${c.x},${c.y}`).join(' ');
    areaStr = `${coords[0].x},${height} ${pointsStr} ${coords[coords.length - 1].x},${height}`;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md">
      <div className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 border-b border-zinc-800 bg-zinc-950/60">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-md font-bold">
                  {muscle ? `${muscle.icon} ${muscle.name}` : exercise.category}
                </span>
                <span className="text-xs bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded-md font-medium">
                  {equip ? equip.name : exercise.equipment}
                </span>
              </div>
              <h2 className="font-black text-xl text-zinc-100">{exercise.name}</h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scroll Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* PR Stats Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800/80 text-center">
              <span className="text-[10px] uppercase font-bold text-zinc-400 block mb-1">
                Max Poids
              </span>
              <span className="font-black text-lg text-emerald-400">
                {stats.bestWeight > 0 ? `${stats.bestWeight} kg` : '-'}
              </span>
            </div>

            <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800/80 text-center">
              <span className="text-[10px] uppercase font-bold text-zinc-400 block mb-1">
                1RM Estimé
              </span>
              <span className="font-black text-lg text-cyan-400">
                {stats.best1RM > 0 ? `${stats.best1RM} kg` : '-'}
              </span>
            </div>

            <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800/80 text-center">
              <span className="text-[10px] uppercase font-bold text-zinc-400 block mb-1">
                Total Séries
              </span>
              <span className="font-black text-lg text-zinc-200">{stats.totalSets || 0}</span>
            </div>

            <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800/80 text-center">
              <span className="text-[10px] uppercase font-bold text-zinc-400 block mb-1">
                Volume Total
              </span>
              <span className="font-black text-lg text-amber-400">
                {stats.totalVolume > 0 ? `${(stats.totalVolume / 1000).toFixed(1)} t` : '-'}
              </span>
            </div>
          </div>

          {/* Progression Graph */}
          <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-200">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span>Progression de la charge max (kg)</span>
              </div>
              {hasHistory && (
                <span className="text-[11px] text-emerald-400 font-semibold">
                  +{historyPoints[historyPoints.length - 1].maxWeight - historyPoints[0].maxWeight} kg
                  depuis Avril
                </span>
              )}
            </div>

            {hasHistory ? (
              <div className="w-full">
                <svg viewBox="0 0 320 120" className="w-full h-32 overflow-visible">
                  <defs>
                    <linearGradient id="grad-ex" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Grid lines */}
                  <line x1="15" y1="20" x2="305" y2="20" stroke="#27272a" strokeDasharray="3 3" />
                  <line x1="15" y1="60" x2="305" y2="60" stroke="#27272a" strokeDasharray="3 3" />
                  <line x1="15" y1="100" x2="305" y2="100" stroke="#27272a" strokeDasharray="3 3" />

                  {/* Area fill */}
                  <polygon points={areaStr} fill="url(#grad-ex)" />

                  {/* Curve line */}
                  <polyline
                    points={pointsStr}
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Data Points */}
                  {historyPoints.map((h, idx) => {
                    const width = 320;
                    const height = 120;
                    const padding = 15;
                    const range = maxWeight - minWeight || 1;
                    const cx = padding + (idx / (historyPoints.length - 1)) * (width - 2 * padding);
                    const cy = height - padding - ((h.maxWeight - minWeight) / range) * (height - 2 * padding);

                    return (
                      <g key={idx}>
                        <circle cx={cx} cy={cy} r="4" fill="#09090b" stroke="#10b981" strokeWidth="2.5" />
                        <text
                          x={cx}
                          y={cy - 7}
                          textAnchor="middle"
                          fill="#34d399"
                          fontSize="9"
                          fontWeight="bold"
                        >
                          {h.maxWeight}
                        </text>
                      </g>
                    );
                  })}
                </svg>

                <div className="flex justify-between text-[10px] text-zinc-400 mt-1">
                  <span>{formatDateFrench(historyPoints[0].date)}</span>
                  <span>{formatDateFrench(historyPoints[historyPoints.length - 1].date)}</span>
                </div>
              </div>
            ) : (
              <div className="py-6 text-center text-xs text-zinc-400 italic">
                Enregistrez plusieurs séances avec cet exercice pour voir votre courbe de progression.
              </div>
            )}
          </div>

          {/* Technique Tips */}
          {exercise.tips && (
            <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800">
              <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-200 mb-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>Conseils d'exécution & posture</span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">{exercise.tips}</p>

              {exercise.secondaryMuscles && exercise.secondaryMuscles.length > 0 && (
                <div className="mt-3 pt-2 border-t border-zinc-800/80 flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] text-zinc-400">Muscles secondaires :</span>
                  {exercise.secondaryMuscles.map((sm, i) => (
                    <span key={i} className="text-[10px] bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded">
                      {sm}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Past logs list */}
          {historyPoints.length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                Historique des séries
              </h3>
              <div className="space-y-2">
                {[...historyPoints].reverse().map((entry, idx) => (
                  <div key={idx} className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 text-xs">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="font-semibold text-zinc-300">
                        {formatDateFrench(entry.date)}
                      </span>
                      <span className="text-[11px] text-zinc-400">{entry.workoutName}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {entry.sets.map((s, sIdx) => (
                        <span
                          key={sIdx}
                          className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-200 font-mono text-[11px]"
                        >
                          {s.weight}kg × {s.reps}
                          {s.rpe ? ` @${s.rpe}` : ''}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-950/80 flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold text-xs"
          >
            Fermer
          </button>
          {onStartWithExercise && (
            <button
              onClick={() => {
                onStartWithExercise(exercise);
                onClose();
              }}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs"
            >
              <Dumbbell className="w-4 h-4" />
              <span>Démarrer avec cet exercice</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
