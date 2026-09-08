// src/components/BodyRankViewer.jsx
import React, { useState } from 'react';
import {
  Trophy,
  Flame,
  Award,
  Sparkles,
  ChevronRight,
  TrendingUp,
  Shield,
  Activity,
  Zap,
  Target,
  Layers,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import AnatomicalMannequin from './AnatomicalMannequin';
import { RANKS, MUSCLE_DEFINITIONS } from '../utils/bodyRank';

export default function BodyRankViewer({ bodyRankData, onSelectExercise }) {
  const [viewMode, setViewMode] = useState('front'); // 'front' or 'back'
  const [selectedMuscleKey, setSelectedMuscleKey] = useState('chest');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const {
    globalLevel = 1,
    globalRank = RANKS[0],
    totalXP = 0,
    muscleScores = {},
    strongestMuscles = [],
    laggingMuscles = [],
    radarData = [],
  } = bodyRankData || {};

  const selectedMuscle = muscleScores[selectedMuscleKey] || muscleScores.chest || {};

  // Standards progression for selected muscle
  const standards = selectedMuscle.standards1RM || [30, 50, 70, 90, 110, 130];
  const tierLabels = ['Novice (E)', 'Initié (D)', 'Intermédiaire (C)', 'Avancé (B)', 'Expert (A)', 'Élite (S)'];

  // Radar Spider Chart helper
  const renderRadarChart = () => {
    const size = 220;
    const center = size / 2;
    const radius = 75;
    const count = radarData.length || 6;

    const points = radarData.map((d, i) => {
      const angle = (Math.PI * 2 / count) * i - Math.PI / 2;
      const r = (d.level / 100) * radius;
      const x = center + r * Math.cos(angle);
      const y = center + r * Math.sin(angle);
      return { x, y, label: d.label, level: d.level, angle };
    });

    const polygonPoints = points.map((p) => `${p.x},${p.y}`).join(' ');

    return (
      <div className="relative flex flex-col items-center justify-center py-2">
        <svg width={size} height={size} className="overflow-visible">
          {/* Background Concentric Webs */}
          {[0.25, 0.5, 0.75, 1.0].map((levelPct, idx) => {
            const webPoints = Array.from({ length: count }).map((_, i) => {
              const angle = (Math.PI * 2 / count) * i - Math.PI / 2;
              const r = levelPct * radius;
              return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
            }).join(' ');
            return (
              <polygon
                key={idx}
                points={webPoints}
                fill="none"
                stroke="#27272a"
                strokeWidth="1.2"
                strokeDasharray={idx === 3 ? '0' : '3 3'}
              />
            );
          })}

          {/* Axes */}
          {Array.from({ length: count }).map((_, i) => {
            const angle = (Math.PI * 2 / count) * i - Math.PI / 2;
            const x = center + radius * Math.cos(angle);
            const y = center + radius * Math.sin(angle);
            return (
              <line key={i} x1={center} y1={center} x2={x} y2={y} stroke="#27272a" strokeWidth="1.2" />
            );
          })}

          {/* Filled Radar Area */}
          <polygon
            points={polygonPoints}
            fill="rgba(16, 185, 129, 0.25)"
            stroke="#10b981"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />

          {/* Data Points and Labels */}
          {points.map((p, i) => (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r="4.5" fill="#09090b" stroke="#10b981" strokeWidth="2.5" />
              <text
                x={center + (radius + 20) * Math.cos(p.angle)}
                y={center + (radius + 20) * Math.sin(p.angle) + 4}
                textAnchor="middle"
                fill="#d4d4d8"
                fontSize="10"
                fontWeight="bold"
              >
                {p.label}
              </text>
            </g>
          ))}
        </svg>
      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Hero Global BodyRank Banner with Cyberpunk Neon Glass Effect */}
      <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 border border-zinc-800 p-6 sm:p-8 shadow-2xl">
        {/* Glow behind rank badge */}
        <div
          className="absolute -top-16 -right-16 w-80 h-80 rounded-full opacity-25 blur-3xl pointer-events-none"
          style={{ backgroundColor: globalRank.color }}
        />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          {/* Global Rank Display */}
          <div className="space-y-3.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-950/80 border border-zinc-800 text-xs font-bold backdrop-blur-md">
              <span className="w-2.5 h-2.5 rounded-full animate-ping" style={{ backgroundColor: globalRank.color }} />
              <span className="uppercase tracking-widest text-zinc-300 font-extrabold text-[10px]">
                Système BodyRank • Liftoff Core
              </span>
            </div>

            <div className="flex items-center gap-5">
              <div
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl flex flex-col items-center justify-center font-black shadow-2xl border-2 transition-all transform hover:scale-105"
                style={{
                  backgroundColor: globalRank.bg,
                  borderColor: globalRank.border,
                  color: globalRank.color,
                  boxShadow: `0 0 35px ${globalRank.color}44`,
                }}
              >
                <span className="text-3xl sm:text-4xl font-black tracking-tight">{globalRank.id}</span>
                <span className="text-[10px] font-extrabold uppercase tracking-widest">{globalRank.name}</span>
              </div>

              <div>
                <div className="flex items-baseline gap-2.5">
                  <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                    Niveau {globalLevel}
                  </h2>
                  <span className="text-xs font-bold text-zinc-400 font-mono">/ 100</span>
                </div>
                <p className="text-xs text-zinc-400 mt-1">
                  Rang Global : <span className="font-extrabold text-white">{globalRank.name} (Rang {globalRank.id})</span> •{' '}
                  <span className="text-emerald-400 font-mono font-bold">{totalXP.toLocaleString('fr-FR')} XP</span>
                </p>
              </div>
            </div>

            {/* Level progress bar */}
            <div className="space-y-1.5 max-w-md">
              <div className="flex justify-between text-xs text-zinc-400 font-mono">
                <span>Palier en cours : {globalRank.minLevel} ➔ {globalRank.maxLevel}</span>
                <span className="font-bold text-emerald-400">
                  {Math.round(((globalLevel - globalRank.minLevel) / (globalRank.maxLevel - globalRank.minLevel + 1 || 1)) * 100)}%
                </span>
              </div>
              <div className="h-3 w-full bg-zinc-950 rounded-full overflow-hidden border border-zinc-800 p-0.5 shadow-inner">
                <div
                  className="h-full rounded-full transition-all duration-700 shadow-lg"
                  style={{
                    width: `${Math.max(6, ((globalLevel - globalRank.minLevel) / (globalRank.maxLevel - globalRank.minLevel + 1 || 1)) * 100)}%`,
                    backgroundColor: globalRank.color,
                    boxShadow: `0 0 12px ${globalRank.color}`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Quick Strengths & Weaknesses Pills */}
          <div className="bg-zinc-950/80 border border-zinc-800/80 p-4 sm:p-5 rounded-2xl space-y-3 md:min-w-[300px] backdrop-blur-md">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Points Forts du Corps</span>
              </span>
              <div className="flex flex-wrap gap-1.5">
                {strongestMuscles.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => {
                      setSelectedMuscleKey(m.id);
                      setViewMode(m.view === 'back' ? 'back' : 'front');
                    }}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border shadow-sm transition-all hover:scale-105"
                    style={{ backgroundColor: m.rank.bg, borderColor: m.rank.border, color: m.rank.color }}
                  >
                    <span>{m.icon}</span>
                    <span>{m.name}</span>
                    <span className="text-[10px] opacity-80 font-mono">Nv.{m.level}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2.5 border-t border-zinc-800/80">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400 flex items-center gap-1.5 mb-2">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Muscles à Travailler en Priorité</span>
              </span>
              <div className="flex flex-wrap gap-1.5">
                {laggingMuscles.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => {
                      setSelectedMuscleKey(m.id);
                      setViewMode(m.view === 'back' ? 'back' : 'front');
                    }}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 text-zinc-300 hover:border-zinc-700 transition-all hover:scale-105"
                  >
                    <span>{m.icon}</span>
                    <span>{m.name}</span>
                    <span className="text-[10px] text-zinc-500 font-mono">Nv.{m.level}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Interactive Anatomy Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Anatomical Vector Mannequin */}
        <div className="lg:col-span-6 bg-zinc-900/90 border border-zinc-800 rounded-[32px] p-5 sm:p-6 shadow-2xl space-y-4">
          {/* Header with Front/Back View Switcher */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-black text-base text-white flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>Mannequin Anatomique 3D</span>
              </h3>
              <p className="text-xs text-zinc-400">Touchez chaque muscle pour l'inspecter</p>
            </div>

            <div className="flex bg-zinc-950 p-1 rounded-2xl border border-zinc-800">
              <button
                type="button"
                onClick={() => setViewMode('front')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${
                  viewMode === 'front'
                    ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/30'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Face
              </button>
              <button
                type="button"
                onClick={() => setViewMode('back')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${
                  viewMode === 'back'
                    ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/30'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Dos
              </button>
            </div>
          </div>

          {/* Quick Muscle Selector Pills */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {Object.values(muscleScores)
              .filter((m) => viewMode === 'front' ? m.view !== 'back' : m.view !== 'front' || m.view === 'both')
              .map((m) => (
                <button
                  key={m.id}
                  onClick={() => setSelectedMuscleKey(m.id)}
                  className={`whitespace-nowrap px-2.5 py-1 rounded-xl text-[11px] font-bold flex items-center gap-1 border transition-all ${
                    selectedMuscleKey === m.id
                      ? 'bg-emerald-500 text-black border-emerald-400 font-black shadow-md'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <span>{m.icon}</span>
                  <span>{m.name}</span>
                </button>
              ))}
          </div>

          {/* Anatomical Mannequin Component */}
          <div className="bg-zinc-950/80 rounded-3xl border border-zinc-800/80 p-3 flex items-center justify-center relative overflow-hidden">
            <AnatomicalMannequin
              viewMode={viewMode}
              selectedMuscleKey={selectedMuscleKey}
              onSelectMuscle={(mKey) => setSelectedMuscleKey(mKey)}
              muscleScores={muscleScores}
            />
          </div>

          {/* Tier Legend */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 pt-1 text-[10px] font-black">
            {RANKS.slice(0, 6).map((r) => (
              <div
                key={r.id}
                className="px-2 py-1.5 rounded-xl border flex flex-col items-center justify-center text-center shadow-sm"
                style={{ backgroundColor: r.bg, borderColor: r.border, color: r.color }}
              >
                <span>{r.badge} Rang {r.id}</span>
                <span className="text-[8px] opacity-75">{r.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Selected Muscle Detail Card & Radar Chart */}
        <div className="lg:col-span-6 space-y-5">
          {/* Detailed Muscle Card */}
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-[32px] p-6 shadow-2xl space-y-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3.5">
                <div
                  className="w-16 h-16 rounded-2xl flex flex-col items-center justify-center font-black shadow-xl border-2"
                  style={{
                    backgroundColor: selectedMuscle.rank?.bg,
                    borderColor: selectedMuscle.rank?.border,
                    color: selectedMuscle.rank?.color,
                    boxShadow: `0 0 20px ${selectedMuscle.rank?.color}33`,
                  }}
                >
                  <span className="text-2xl font-black">{selectedMuscle.rank?.id}</span>
                  <span className="text-[9px] font-bold uppercase">{selectedMuscle.rank?.name}</span>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{selectedMuscle.icon}</span>
                    <h4 className="font-black text-2xl text-white tracking-tight">{selectedMuscle.name}</h4>
                  </div>
                  <p className="text-xs text-zinc-400 mt-0.5">{selectedMuscle.description}</p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-zinc-400 block font-mono">Niveau</span>
                <span className="font-black text-3xl text-emerald-400 font-mono">
                  {selectedMuscle.level} <span className="text-xs text-zinc-500 font-normal">/ 100</span>
                </span>
              </div>
            </div>

            {/* Muscle XP Bar */}
            <div className="space-y-2 bg-zinc-950 p-4 rounded-2xl border border-zinc-800/90 shadow-inner">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-zinc-400">Palier Rang {selectedMuscle.rank?.id} ({selectedMuscle.rank?.name})</span>
                <span className="text-emerald-400 font-mono">
                  {selectedMuscle.xp.toLocaleString('fr-FR')} XP accumulés
                </span>
              </div>
              <div className="h-3 w-full bg-zinc-900 rounded-full overflow-hidden p-0.5 border border-zinc-800">
                <div
                  className="h-full rounded-full transition-all duration-500 shadow-md"
                  style={{
                    width: `${Math.max(10, selectedMuscle.progressToNextLevel || 25)}%`,
                    backgroundColor: selectedMuscle.rank?.color || '#10b981',
                    boxShadow: `0 0 10px ${selectedMuscle.rank?.color}`,
                  }}
                />
              </div>
            </div>

            {/* Muscle Stats Grid */}
            <div className="grid grid-cols-3 gap-2.5 text-center text-xs">
              <div className="bg-zinc-950 p-3.5 rounded-2xl border border-zinc-800">
                <span className="text-[10px] uppercase font-bold text-zinc-400 block mb-0.5">Meilleur Lift (PR)</span>
                <span className="font-black text-lg text-emerald-400 font-mono">
                  {selectedMuscle.bestLiftKg > 0 ? `${selectedMuscle.bestLiftKg} kg` : '-'}
                </span>
              </div>

              <div className="bg-zinc-950 p-3.5 rounded-2xl border border-zinc-800">
                <span className="text-[10px] uppercase font-bold text-zinc-400 block mb-0.5">Volume Total</span>
                <span className="font-black text-lg text-cyan-400 font-mono">
                  {selectedMuscle.totalVolume > 0 ? `${(selectedMuscle.totalVolume / 1000).toFixed(1)} t` : '-'}
                </span>
              </div>

              <div className="bg-zinc-950 p-3.5 rounded-2xl border border-zinc-800">
                <span className="text-[10px] uppercase font-bold text-zinc-400 block mb-0.5">Séries Validées</span>
                <span className="font-black text-lg text-white font-mono">
                  {selectedMuscle.totalSets || 0}
                </span>
              </div>
            </div>

            {/* Strength Standards Milestones Table */}
            <div className="space-y-2">
              <span className="text-[11px] font-extrabold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-amber-400" />
                <span>Paliers de Force pour ce Muscle :</span>
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-xs">
                {standards.map((weightTarget, idx) => {
                  const isReached = (selectedMuscle.bestLiftKg || 0) >= weightTarget;

                  return (
                    <div
                      key={idx}
                      className={`p-2 rounded-xl border flex items-center justify-between text-[11px] ${
                        isReached
                          ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                          : 'bg-zinc-950 border-zinc-800 text-zinc-400'
                      }`}
                    >
                      <span className="font-medium">{tierLabels[idx]}</span>
                      <span className="font-mono font-black">{weightTarget} kg</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Key Exercises */}
            <div className="pt-2 border-t border-zinc-800/80">
              <span className="text-[11px] font-extrabold text-zinc-300 uppercase tracking-wider block mb-2">
                Exercices pour faire monter l'XP :
              </span>
              <div className="flex flex-wrap gap-1.5">
                {(selectedMuscle.primaryExercises || []).map((exName, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 font-semibold flex items-center gap-1.5 shadow-sm"
                  >
                    <Zap className="w-3 h-3 text-amber-400" />
                    <span>{exName}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Radar Spider Chart Card */}
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-[32px] p-6 shadow-2xl space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-black text-sm text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                <span>Radar d'Harmonie Musculaire 360°</span>
              </h4>
              <span className="text-xs text-zinc-400 font-mono">Équilibre corporel</span>
            </div>

            {renderRadarChart()}
          </div>
        </div>
      </div>
    </div>
  );
}
