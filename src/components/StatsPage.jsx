// src/components/StatsPage.jsx
import React, { useState } from 'react';
import {
  TrendingUp,
  Trophy,
  Flame,
  Layers,
  Dumbbell,
  Calendar,
  BarChart2,
  PieChart,
  ArrowUpRight,
  Activity,
  Award,
} from 'lucide-react';

export default function StatsPage({ stats = null }) {
  if (!stats || !stats.overview) {
    return (
      <div className="py-20 text-center text-zinc-400">
        Chargement des statistiques...
      </div>
    );
  }

  const {
    overview,
    volume_timeline = [],
    monthly_breakdown = [],
    muscle_distribution = [],
    exercise_progressions = {},
    personal_records = [],
  } = stats;

  const exerciseNames = Object.keys(exercise_progressions).sort();
  const [selectedExercise, setSelectedExercise] = useState(
    exerciseNames[0] || 'Développé couché'
  );

  const currentExProgression =
    exercise_progressions[selectedExercise] || null;

  // Max volume for volume timeline scaling
  const maxSessionVolume = Math.max(
    ...volume_timeline.map((v) => v.volume_kg),
    1
  );

  // Helper date formatter
  const formatDateShort = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
    });
  };

  // SVG Chart for Selected Exercise Progression
  const history = currentExProgression?.history || [];
  const hasHistory = history.length > 0;

  let minWeight = 0;
  let maxWeight = 100;
  let pointsStr = '';
  let areaStr = '';

  if (hasHistory) {
    const weights = history.map((h) => h.max_weight_kg);
    minWeight = Math.max(0, Math.min(...weights) - 5);
    maxWeight = Math.max(...weights) + 5;
    const range = maxWeight - minWeight || 1;

    const width = 340;
    const height = 130;
    const padding = 20;

    const coords = history.map((h, idx) => {
      const x =
        history.length === 1
          ? width / 2
          : padding + (idx / (history.length - 1)) * (width - 2 * padding);
      const y =
        height -
        padding -
        ((h.max_weight_kg - minWeight) / range) * (height - 2 * padding);
      return { x, y, weight: h.max_weight_kg, date: h.date, reps: h.reps };
    });

    if (history.length > 1) {
      pointsStr = coords.map((c) => `${c.x},${c.y}`).join(' ');
      areaStr = `${coords[0].x},${height} ${pointsStr} ${coords[coords.length - 1].x},${height}`;
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* KPI Highlight Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Total Sessions */}
        <div className="bg-zinc-900/90 border border-zinc-800 p-4 rounded-3xl shadow-lg">
          <div className="flex items-center gap-1.5 text-zinc-400 text-xs font-bold uppercase mb-1">
            <Flame className="w-4 h-4 text-emerald-400" />
            <span>Séances</span>
          </div>
          <div className="font-black text-3xl text-white">
            {overview.total_sessions}
          </div>
          <span className="text-[11px] text-zinc-400">enregistrées à la salle</span>
        </div>

        {/* Total Volume */}
        <div className="bg-zinc-900/90 border border-zinc-800 p-4 rounded-3xl shadow-lg">
          <div className="flex items-center gap-1.5 text-zinc-400 text-xs font-bold uppercase mb-1">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span>Tonnage total</span>
          </div>
          <div className="font-black text-3xl text-emerald-400">
            {overview.total_volume_tonnes}{' '}
            <span className="text-base text-zinc-400 font-semibold">tonnes</span>
          </div>
          <span className="text-[11px] text-zinc-400">
            {overview.total_volume_kg.toLocaleString('fr-FR')} kg soulevés
          </span>
        </div>

        {/* Avg Volume */}
        <div className="bg-zinc-900/90 border border-zinc-800 p-4 rounded-3xl shadow-lg">
          <div className="flex items-center gap-1.5 text-zinc-400 text-xs font-bold uppercase mb-1">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span>Moyenne / séance</span>
          </div>
          <div className="font-black text-3xl text-white">
            {overview.avg_volume_per_session.toLocaleString('fr-FR')}{' '}
            <span className="text-xs text-zinc-400 font-semibold">kg</span>
          </div>
          <span className="text-[11px] text-zinc-400">volume moyen par jour</span>
        </div>

        {/* Total Sets */}
        <div className="bg-zinc-900/90 border border-zinc-800 p-4 rounded-3xl shadow-lg">
          <div className="flex items-center gap-1.5 text-zinc-400 text-xs font-bold uppercase mb-1">
            <Layers className="w-4 h-4 text-amber-400" />
            <span>Séries & Reps</span>
          </div>
          <div className="font-black text-3xl text-white">
            {overview.total_sets}
          </div>
          <span className="text-[11px] text-zinc-400">
            {overview.total_reps} répétitions totales
          </span>
        </div>
      </div>

      {/* Chart 1: Volume Per Workout Day (Timeline Bar Chart) */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-black text-base text-white flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-emerald-400" />
              <span>Volume Total soulevé par séance (kg)</span>
            </h3>
            <p className="text-xs text-zinc-400">
              Évolution de la charge de travail au fil de vos journées à la salle
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-400">
            {volume_timeline.length} journées
          </span>
        </div>

        {volume_timeline.length > 0 ? (
          <div className="h-44 flex items-end justify-between gap-1.5 sm:gap-2 pt-6 px-1">
            {volume_timeline.map((v) => {
              const heightPct = Math.round((v.volume_kg / maxSessionVolume) * 100);

              return (
                <div
                  key={v.id}
                  className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group relative"
                >
                  {/* Tooltip on hover */}
                  <div className="absolute -top-10 bg-black/90 border border-zinc-700 px-2 py-1 rounded-md text-[10px] text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-lg font-mono">
                    {v.title} : {v.volume_kg.toLocaleString('fr-FR')} kg
                  </div>

                  <span className="text-[9px] sm:text-[10px] font-mono text-zinc-400 group-hover:text-emerald-400 font-bold opacity-0 sm:opacity-100 transition-opacity">
                    {(v.volume_kg / 1000).toFixed(1)}t
                  </span>

                  <div
                    style={{ height: `${Math.max(12, heightPct)}%` }}
                    className="w-full max-w-[40px] rounded-t-xl bg-gradient-to-t from-emerald-600 to-teal-400 hover:brightness-125 shadow-lg shadow-emerald-500/10 transition-all cursor-pointer"
                  />

                  <span className="text-[9px] sm:text-[10px] font-semibold text-zinc-400 whitespace-nowrap truncate max-w-[50px]">
                    {formatDateShort(v.date)}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-12 text-center text-xs text-zinc-500 italic">
            Enregistrez des séances pour voir apparaître votre graphique de volume.
          </div>
        )}
      </div>

      {/* Chart 2: Exercise Progression Curve (Courbe de force par exercice) */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-black text-base text-white flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Courbe d'Évolution de la Force par Exercice</span>
            </h3>
            <p className="text-xs text-zinc-400">
              Sélectionnez un exercice pour voir l'évolution de vos charges max (kg)
            </p>
          </div>

          <select
            value={selectedExercise}
            onChange={(e) => setSelectedExercise(e.target.value)}
            className="bg-zinc-950 border border-zinc-700 rounded-2xl px-4 py-2 text-xs font-bold text-white focus:outline-none focus:border-emerald-500 shadow-md"
          >
            {exerciseNames.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>

        {/* Exercise Quick Stats Badges */}
        {currentExProgression && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-zinc-950 p-3.5 rounded-2xl border border-zinc-800 text-center">
            <div>
              <span className="text-[10px] uppercase font-bold text-zinc-400 block">
                Charge Max (PR)
              </span>
              <span className="font-black text-lg text-emerald-400">
                {currentExProgression.max_weight} kg
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-zinc-400 block">
                1RM Estimé
              </span>
              <span className="font-black text-lg text-cyan-400">
                {currentExProgression.best_1rm} kg
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-zinc-400 block">
                Séances pratiquées
              </span>
              <span className="font-black text-lg text-zinc-200">
                {currentExProgression.history.length}
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-zinc-400 block">
                Volume Cumulé
              </span>
              <span className="font-black text-lg text-amber-400">
                {(currentExProgression.total_volume / 1000).toFixed(1)} t
              </span>
            </div>
          </div>
        )}

        {/* SVG Progression Line Curve */}
        {hasHistory ? (
          <div className="w-full bg-zinc-950/80 p-4 rounded-2xl border border-zinc-800/80">
            <svg viewBox="0 0 340 130" className="w-full h-40 overflow-visible">
              <defs>
                <linearGradient id="curve-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="20" y1="20" x2="320" y2="20" stroke="#27272a" strokeDasharray="3 3" />
              <line x1="20" y1="65" x2="320" y2="65" stroke="#27272a" strokeDasharray="3 3" />
              <line x1="20" y1="110" x2="320" y2="110" stroke="#27272a" strokeDasharray="3 3" />

              {/* Area polygon */}
              {history.length > 1 && (
                <polygon points={areaStr} fill="url(#curve-grad)" />
              )}

              {/* Curve polyline */}
              {history.length > 1 && (
                <polyline
                  points={pointsStr}
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {/* Data points markers */}
              {history.map((h, idx) => {
                const width = 340;
                const height = 130;
                const padding = 20;
                const range = maxWeight - minWeight || 1;
                const cx =
                  history.length === 1
                    ? width / 2
                    : padding + (idx / (history.length - 1)) * (width - 2 * padding);
                const cy =
                  height -
                  padding -
                  ((h.max_weight_kg - minWeight) / range) * (height - 2 * padding);

                return (
                  <g key={idx}>
                    <circle
                      cx={cx}
                      cy={cy}
                      r="5"
                      fill="#09090b"
                      stroke="#10b981"
                      strokeWidth="2.5"
                    />
                    <text
                      x={cx}
                      y={cy - 9}
                      textAnchor="middle"
                      fill="#34d399"
                      fontSize="10"
                      fontWeight="bold"
                    >
                      {h.max_weight_kg}kg
                    </text>
                  </g>
                );
              })}
            </svg>

            <div className="flex justify-between text-[11px] text-zinc-400 mt-3 px-2 font-semibold">
              <span>{formatDateShort(history[0].date)}</span>
              {history.length > 1 && (
                <span>{formatDateShort(history[history.length - 1].date)}</span>
              )}
            </div>
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-zinc-500 italic">
            Aucun historique pour cet exercice.
          </div>
        )}
      </div>

      {/* Two Columns: Muscle Groups & PR Table */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Muscle Group Distribution */}
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-5 shadow-xl space-y-4">
          <div className="flex items-center gap-2">
            <PieChart className="w-4 h-4 text-emerald-400" />
            <h3 className="font-black text-sm text-white">
              Répartition par Groupe Musculaire
            </h3>
          </div>

          <div className="space-y-3">
            {muscle_distribution.map((m) => (
              <div key={m.muscle} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-zinc-200">{m.muscle}</span>
                  <span className="font-mono text-zinc-400">
                    {(m.volume_kg / 1000).toFixed(1)} t ({m.percentage}%)
                  </span>
                </div>
                <div className="h-2 w-full bg-zinc-950 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${m.percentage}%` }}
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Personal Records Hall of Fame */}
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-5 shadow-xl space-y-4">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            <h3 className="font-black text-sm text-white">
              Records Personnels (PR)
            </h3>
          </div>

          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {personal_records.map((pr, idx) => (
              <div
                key={pr.exercise_name}
                className="bg-zinc-950 p-3 rounded-2xl border border-zinc-800 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-zinc-900 text-[10px] font-bold text-zinc-400 flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <div>
                    <div className="font-bold text-zinc-100">{pr.exercise_name}</div>
                    <div className="text-[10px] text-zinc-500">{pr.muscle_group}</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-black text-emerald-400 font-mono text-sm">
                    {pr.max_weight_kg} kg
                  </div>
                  <div className="text-[10px] text-zinc-400">
                    1RM: {pr.best_1rm_kg} kg
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
