// src/components/AnalyticsView.jsx
import React, { useState } from 'react';
import {
  TrendingUp,
  Trophy,
  Flame,
  Scale,
  Calendar,
  Layers,
  Dumbbell,
  Clock,
  Plus,
  ArrowUpRight,
  ChevronRight,
} from 'lucide-react';
import { storageService } from '../services/storage';
import { MUSCLE_GROUPS } from '../data/exercises';
import { formatDateFrench } from '../utils/formatters';

export default function AnalyticsView({ workouts = [], exercises = [], bodyStats = [], onAddBodyStat }) {
  const [selectedExId, setSelectedExId] = useState('bench-press');
  const [showAddWeightModal, setShowAddWeightModal] = useState(false);
  const [newWeight, setNewWeight] = useState('');
  const [newArm, setNewArm] = useState('');
  const [newWaist, setNewWaist] = useState('');
  const [newChest, setNewChest] = useState('');

  // Total KPIs
  const totalWorkouts = workouts.length;
  const totalVolumeKg = workouts.reduce((sum, w) => sum + (w.totalVolume || 0), 0);
  const totalVolumeTonnes = (totalVolumeKg / 1000).toFixed(1);
  const totalSeconds = workouts.reduce((sum, w) => sum + (w.durationSeconds || 0), 0);
  const totalHours = Math.floor(totalSeconds / 3600);
  const totalMins = Math.floor((totalSeconds % 3600) / 60);

  const totalSets = workouts.reduce(
    (sum, w) =>
      sum +
      (w.exercises || []).reduce(
        (eSum, ex) => eSum + (ex.sets || []).filter((s) => s.completed).length,
        0
      ),
    0
  );

  // Monthly Volume Breakdown (April to September 2026)
  const monthlyVolumes = {};
  workouts.forEach((w) => {
    const d = new Date(w.date);
    const mKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    monthlyVolumes[mKey] = (monthlyVolumes[mKey] || 0) + (w.totalVolume || 0);
  });

  const sortedMonths = Object.keys(monthlyVolumes).sort();
  const maxMonthVolume = Math.max(...Object.values(monthlyVolumes), 1);

  // Muscle Volume Distribution
  const muscleDistribution = {};
  workouts.forEach((w) => {
    (w.exercises || []).forEach((ex) => {
      const exDef = exercises.find((e) => e.id === ex.exerciseId);
      const cat = exDef ? exDef.category : 'other';
      const catVolume = (ex.sets || []).reduce((sSum, s) => {
        if (s.completed && s.type !== 'warmup' && s.weight && s.reps) {
          return sSum + Number(s.weight) * Number(s.reps);
        }
        return sSum;
      }, 0);
      muscleDistribution[cat] = (muscleDistribution[cat] || 0) + catVolume;
    });
  });

  const totalMuscleVolume = Object.values(muscleDistribution).reduce((a, b) => a + b, 0) || 1;
  const muscleRanks = Object.entries(muscleDistribution)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  // Exercise history for selected exercise
  const exerciseStats = storageService.getExerciseStats(selectedExId);
  const selectedExDef = exercises.find((e) => e.id === selectedExId);

  // SVG Chart for exercise progression
  const exHistory = exerciseStats.history || [];
  const hasExHistory = exHistory.length > 1;

  let minW = 0;
  let maxW = 100;
  let pointsStr = '';
  let areaStr = '';

  if (hasExHistory) {
    const weights = exHistory.map((h) => h.maxWeight);
    minW = Math.max(0, Math.min(...weights) - 5);
    maxW = Math.max(...weights) + 5;
    const range = maxW - minW || 1;
    const width = 340;
    const height = 130;
    const padding = 20;

    const coords = exHistory.map((h, idx) => {
      const x = padding + (idx / (exHistory.length - 1)) * (width - 2 * padding);
      const y = height - padding - ((h.maxWeight - minW) / range) * (height - 2 * padding);
      return { x, y, weight: h.maxWeight, date: h.date };
    });

    pointsStr = coords.map((c) => `${c.x},${c.y}`).join(' ');
    areaStr = `${coords[0].x},${height} ${pointsStr} ${coords[coords.length - 1].x},${height}`;
  }

  // Handle add body stat
  const handleSaveBodyStat = (e) => {
    e.preventDefault();
    if (!newWeight) return;
    const entry = {
      date: new Date().toISOString().split('T')[0],
      weight: Number(newWeight),
      arm: newArm ? Number(newArm) : undefined,
      waist: newWaist ? Number(newWaist) : undefined,
      chest: newChest ? Number(newChest) : undefined,
    };
    onAddBodyStat(entry);
    setShowAddWeightModal(false);
    setNewWeight('');
    setNewArm('');
    setNewWaist('');
    setNewChest('');
  };

  const latestBodyStat = bodyStats[bodyStats.length - 1] || null;
  const firstBodyStat = bodyStats[0] || null;
  const weightDiff =
    latestBodyStat && firstBodyStat
      ? (latestBodyStat.weight - firstBodyStat.weight).toFixed(1)
      : null;

  return (
    <div className="pb-28 max-w-4xl mx-auto px-3 sm:px-4 space-y-5">
      {/* KPI Highlight Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
        <div className="bg-zinc-900/90 border border-zinc-800 p-3.5 rounded-2xl shadow-md">
          <div className="flex items-center gap-1.5 text-zinc-400 text-xs font-bold uppercase mb-1">
            <Flame className="w-4 h-4 text-emerald-400" />
            <span>Séances</span>
          </div>
          <div className="font-black text-2xl text-zinc-100">{totalWorkouts}</div>
          <span className="text-[11px] text-zinc-400">depuis Avril 2026</span>
        </div>

        <div className="bg-zinc-900/90 border border-zinc-800 p-3.5 rounded-2xl shadow-md">
          <div className="flex items-center gap-1.5 text-zinc-400 text-xs font-bold uppercase mb-1">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span>Tonnage total</span>
          </div>
          <div className="font-black text-2xl text-emerald-400">
            {totalVolumeTonnes} <span className="text-sm">tonnes</span>
          </div>
          <span className="text-[11px] text-zinc-400">{totalVolumeKg.toLocaleString('fr-FR')} kg</span>
        </div>

        <div className="bg-zinc-900/90 border border-zinc-800 p-3.5 rounded-2xl shadow-md">
          <div className="flex items-center gap-1.5 text-zinc-400 text-xs font-bold uppercase mb-1">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span>Temps en salle</span>
          </div>
          <div className="font-black text-2xl text-zinc-100">
            {totalHours}h <span className="text-sm font-semibold">{totalMins}m</span>
          </div>
          <span className="text-[11px] text-zinc-400">cumulé sous les barres</span>
        </div>

        <div className="bg-zinc-900/90 border border-zinc-800 p-3.5 rounded-2xl shadow-md">
          <div className="flex items-center gap-1.5 text-zinc-400 text-xs font-bold uppercase mb-1">
            <Layers className="w-4 h-4 text-amber-400" />
            <span>Séries validées</span>
          </div>
          <div className="font-black text-2xl text-zinc-100">{totalSets}</div>
          <span className="text-[11px] text-zinc-400">séries d'efforts</span>
        </div>
      </div>

      {/* Monthly Volume Progression Bar Chart */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 sm:p-5 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <h3 className="font-black text-sm text-zinc-100">
              Progression du Volume Mensuel Soulevé (kg)
            </h3>
          </div>
          <span className="text-xs text-emerald-400 font-bold font-mono">Avril - Septembre 2026</span>
        </div>

        <div className="h-44 flex items-end justify-between gap-2 pt-4 px-2">
          {sortedMonths.map((mKey) => {
            const vol = monthlyVolumes[mKey];
            const heightPct = Math.round((vol / maxMonthVolume) * 100);
            const [year, month] = mKey.split('-');
            const monthLabel = new Date(Number(year), Number(month) - 1).toLocaleDateString(
              'fr-FR',
              { month: 'short' }
            );

            return (
              <div key={mKey} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <span className="text-[10px] font-mono text-zinc-400 group-hover:text-emerald-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                  {(vol / 1000).toFixed(1)}t
                </span>
                <div
                  style={{ height: `${Math.max(12, heightPct)}%` }}
                  className="w-full max-w-[48px] rounded-t-xl bg-gradient-to-t from-emerald-600 to-teal-400 hover:brightness-110 shadow-lg shadow-emerald-500/10 transition-all cursor-pointer"
                />
                <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-tight">
                  {monthLabel}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Exercise Progression Inspector (Courbe de force par exercice) */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 sm:p-5 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="font-black text-sm text-zinc-100 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Courbe de force & Records par exercice</span>
            </h3>
            <p className="text-[11px] text-zinc-400">Évolution de la charge maximale soulevée</p>
          </div>

          <select
            value={selectedExId}
            onChange={(e) => setSelectedExId(e.target.value)}
            className="bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-1.5 text-xs text-zinc-100 focus:outline-none focus:border-emerald-500 font-semibold"
          >
            {exercises.map((ex) => (
              <option key={ex.id} value={ex.id}>
                {ex.name}
              </option>
            ))}
          </select>
        </div>

        {/* Selected Exercise Stats Bar */}
        <div className="grid grid-cols-3 gap-2 bg-zinc-950 p-3 rounded-xl border border-zinc-800 mb-4 text-center">
          <div>
            <span className="text-[10px] uppercase font-bold text-zinc-400 block">Record Actuel</span>
            <span className="font-black text-base text-emerald-400">
              {exerciseStats.bestWeight > 0 ? `${exerciseStats.bestWeight} kg` : '-'}
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-zinc-400 block">1RM Estimé</span>
            <span className="font-black text-base text-cyan-400">
              {exerciseStats.best1RM > 0 ? `${exerciseStats.best1RM} kg` : '-'}
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-zinc-400 block">Volume Total</span>
            <span className="font-black text-base text-amber-400">
              {exerciseStats.totalVolume > 0 ? `${(exerciseStats.totalVolume / 1000).toFixed(1)} t` : '-'}
            </span>
          </div>
        </div>

        {/* SVG Chart */}
        {hasExHistory ? (
          <div className="w-full bg-zinc-950/60 p-3 rounded-xl border border-zinc-800/80">
            <svg viewBox="0 0 340 130" className="w-full h-36 overflow-visible">
              <defs>
                <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="20" y1="20" x2="320" y2="20" stroke="#27272a" strokeDasharray="3 3" />
              <line x1="20" y1="65" x2="320" y2="65" stroke="#27272a" strokeDasharray="3 3" />
              <line x1="20" y1="110" x2="320" y2="110" stroke="#27272a" strokeDasharray="3 3" />

              {/* Polygon Area */}
              <polygon points={areaStr} fill="url(#chart-grad)" />

              {/* Polyline */}
              <polyline
                points={pointsStr}
                fill="none"
                stroke="#10b981"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Point Markers */}
              {exHistory.map((h, idx) => {
                const width = 340;
                const height = 130;
                const padding = 20;
                const range = maxW - minW || 1;
                const cx = padding + (idx / (exHistory.length - 1)) * (width - 2 * padding);
                const cy = height - padding - ((h.maxWeight - minW) / range) * (height - 2 * padding);

                return (
                  <g key={idx}>
                    <circle cx={cx} cy={cy} r="4.5" fill="#09090b" stroke="#10b981" strokeWidth="2.5" />
                    <text
                      x={cx}
                      y={cy - 8}
                      textAnchor="middle"
                      fill="#34d399"
                      fontSize="9.5"
                      fontWeight="bold"
                    >
                      {h.maxWeight}kg
                    </text>
                  </g>
                );
              })}
            </svg>

            <div className="flex justify-between text-[11px] text-zinc-400 mt-2 px-2 font-semibold">
              <span>{formatDateFrench(exHistory[0].date)}</span>
              <span>{formatDateFrench(exHistory[exHistory.length - 1].date)}</span>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-zinc-400 italic">
            Pas assez de données pour afficher le graphique de cet exercice.
          </div>
        )}
      </div>

      {/* Two Columns: Muscle Breakdown & Body Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Muscle Breakdown */}
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 sm:p-5 shadow-lg">
          <h3 className="font-black text-sm text-zinc-100 flex items-center gap-2 mb-3">
            <Dumbbell className="w-4 h-4 text-emerald-400" />
            <span>Répartition par Groupe Musculaire</span>
          </h3>

          <div className="space-y-2.5">
            {muscleRanks.map(([catId, vol]) => {
              const muscleDef = MUSCLE_GROUPS.find((m) => m.id === catId);
              const pct = Math.round((vol / totalMuscleVolume) * 100);

              return (
                <div key={catId}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-semibold text-zinc-200">
                      {muscleDef ? `${muscleDef.icon} ${muscleDef.name}` : catId}
                    </span>
                    <span className="font-mono font-bold text-zinc-400">
                      {(vol / 1000).toFixed(1)} t ({pct}%)
                    </span>
                  </div>
                  <div className="h-2 w-full bg-zinc-950 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${pct}%` }}
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Body Measurements & Weight */}
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-black text-sm text-zinc-100 flex items-center gap-2">
                <Scale className="w-4 h-4 text-cyan-400" />
                <span>Poids Corporel & Mensurations</span>
              </h3>
              <button
                onClick={() => setShowAddWeightModal(true)}
                className="flex items-center gap-1 text-xs text-emerald-400 font-bold hover:underline"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Ajouter</span>
              </button>
            </div>

            {/* Current Weight Card */}
            {latestBodyStat && (
              <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 mb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-zinc-400 uppercase font-bold">
                      Dernière pesée
                    </span>
                    <div className="font-black text-2xl text-zinc-100">
                      {latestBodyStat.weight} <span className="text-sm font-semibold text-emerald-400">kg</span>
                    </div>
                  </div>
                  {weightDiff && (
                    <div className="text-right">
                      <span className="text-[10px] text-zinc-400 uppercase font-bold">
                        Évolution
                      </span>
                      <div className="font-bold text-sm text-emerald-400">
                        {Number(weightDiff) >= 0 ? `+${weightDiff}` : weightDiff} kg
                      </div>
                    </div>
                  )}
                </div>

                {/* Body parts stats */}
                <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-zinc-800/60 text-center text-xs">
                  <div>
                    <span className="text-[10px] text-zinc-400 block">Bras</span>
                    <span className="font-bold text-zinc-200">{latestBodyStat.arm || '-'} cm</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-400 block">Poitrine</span>
                    <span className="font-bold text-zinc-200">{latestBodyStat.chest || '-'} cm</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-400 block">Taille</span>
                    <span className="font-bold text-zinc-200">{latestBodyStat.waist || '-'} cm</span>
                  </div>
                </div>
              </div>
            )}

            {/* Measurements history list */}
            <div className="space-y-1.5 max-h-36 overflow-y-auto">
              {[...bodyStats].reverse().map((b, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between text-xs px-2.5 py-1.5 rounded-lg bg-zinc-950/60 border border-zinc-800/80"
                >
                  <span className="text-zinc-400">{b.date}</span>
                  <span className="font-mono font-bold text-zinc-100">{b.weight} kg</span>
                  {b.arm && <span className="text-zinc-400">Bras: {b.arm}cm</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add Body Weight Modal */}
      {showAddWeightModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-2xl space-y-4">
            <h3 className="font-bold text-base text-zinc-100 flex items-center gap-2">
              <Scale className="w-5 h-5 text-emerald-400" />
              <span>Enregistrer votre pesée</span>
            </h3>

            <form onSubmit={handleSaveBodyStat} className="space-y-3">
              <div>
                <label className="text-xs text-zinc-400 block mb-1">Poids corporel (kg) *</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  placeholder="Ex: 81.5"
                  value={newWeight}
                  onChange={(e) => setNewWeight(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500 font-bold"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] text-zinc-400 block mb-1">Bras (cm)</label>
                  <input
                    type="number"
                    step="0.5"
                    placeholder="38.5"
                    value={newArm}
                    onChange={(e) => setNewArm(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-2 py-1.5 text-xs text-zinc-100"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-zinc-400 block mb-1">Poitrine (cm)</label>
                  <input
                    type="number"
                    step="0.5"
                    placeholder="105"
                    value={newChest}
                    onChange={(e) => setNewChest(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-2 py-1.5 text-xs text-zinc-100"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-zinc-400 block mb-1">Taille (cm)</label>
                  <input
                    type="number"
                    step="0.5"
                    placeholder="82"
                    value={newWaist}
                    onChange={(e) => setNewWaist(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-2 py-1.5 text-xs text-zinc-100"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddWeightModal(false)}
                  className="flex-1 py-2 rounded-xl bg-zinc-800 text-zinc-300 text-xs font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
