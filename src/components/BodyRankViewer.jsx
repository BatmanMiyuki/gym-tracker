// src/components/BodyRankViewer.jsx
import React, { useState } from 'react';
import {
  Trophy,
  Flame,
  Award,
  Sparkles,
  Info,
  ChevronRight,
  TrendingUp,
  Shield,
  Activity,
  Zap,
} from 'lucide-react';
import { RANKS } from '../utils/bodyRank';

export default function BodyRankViewer({ bodyRankData, onSelectExercise }) {
  const [viewMode, setViewMode] = useState('front'); // 'front' or 'back'
  const [selectedMuscleKey, setSelectedMuscleKey] = useState('chest');

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

  // Color helper for SVG muscle parts
  const getMuscleColor = (mKey) => {
    const m = muscleScores[mKey];
    if (!m || !m.rank) return '#3f3f46';
    return m.rank.color;
  };

  const isMuscleSelected = (mKey) => selectedMuscleKey === mKey;

  // Radar Spider Chart helper
  const renderRadarChart = () => {
    const size = 200;
    const center = size / 2;
    const radius = 70;
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
      <div className="relative flex flex-col items-center">
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
                strokeWidth="1"
                strokeDasharray={idx === 3 ? '0' : '2 2'}
              />
            );
          })}

          {/* Axes */}
          {Array.from({ length: count }).map((_, i) => {
            const angle = (Math.PI * 2 / count) * i - Math.PI / 2;
            const x = center + radius * Math.cos(angle);
            const y = center + radius * Math.sin(angle);
            return (
              <line key={i} x1={center} y1={center} x2={x} y2={y} stroke="#27272a" strokeWidth="1" />
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
              <circle cx={p.x} cy={p.y} r="4" fill="#09090b" stroke="#10b981" strokeWidth="2" />
              <text
                x={center + (radius + 18) * Math.cos(p.angle)}
                y={center + (radius + 18) * Math.sin(p.angle) + 4}
                textAnchor="middle"
                fill="#a1a1aa"
                fontSize="9.5"
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
    <div className="space-y-6">
      {/* Hero Global BodyRank Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 border border-zinc-800 p-5 sm:p-7 shadow-2xl">
        {/* Glow behind rank badge */}
        <div
          className="absolute -top-12 -right-12 w-64 h-64 rounded-full opacity-20 blur-3xl pointer-events-none"
          style={{ backgroundColor: globalRank.color }}
        />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          {/* Global Rank Display */}
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-950 border border-zinc-800 text-xs font-bold">
              <span className="w-2.5 h-2.5 rounded-full animate-ping" style={{ backgroundColor: globalRank.color }} />
              <span className="uppercase tracking-wider text-zinc-300">Système BodyRank • Liftoff Engine</span>
            </div>

            <div className="flex items-center gap-4">
              <div
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex flex-col items-center justify-center font-black shadow-2xl border-2 transition-transform transform hover:scale-105"
                style={{
                  backgroundColor: globalRank.bg,
                  borderColor: globalRank.border,
                  color: globalRank.color,
                  boxShadow: `0 0 25px ${globalRank.color}33`,
                }}
              >
                <span className="text-2xl sm:text-3xl font-black">{globalRank.id}</span>
                <span className="text-[9px] font-bold uppercase tracking-widest">{globalRank.name}</span>
              </div>

              <div>
                <div className="flex items-baseline gap-2">
                  <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                    Niveau {globalLevel}
                  </h2>
                  <span className="text-xs font-bold text-zinc-400 font-mono">/ 100</span>
                </div>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Rang Global : <span className="font-bold text-white">{globalRank.name} (Rang {globalRank.id})</span> • {totalXP.toLocaleString('fr-FR')} XP total
                </p>
              </div>
            </div>

            {/* Level progress bar */}
            <div className="space-y-1.5 max-w-md">
              <div className="flex justify-between text-[11px] text-zinc-400 font-mono">
                <span>Progression du palier ({globalRank.minLevel} ➔ {globalRank.maxLevel})</span>
                <span className="font-bold text-white">
                  {Math.round(((globalLevel - globalRank.minLevel) / (globalRank.maxLevel - globalRank.minLevel + 1 || 1)) * 100)}%
                </span>
              </div>
              <div className="h-2.5 w-full bg-zinc-950 rounded-full overflow-hidden border border-zinc-800 p-0.5">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${Math.max(5, ((globalLevel - globalRank.minLevel) / (globalRank.maxLevel - globalRank.minLevel + 1 || 1)) * 100)}%`,
                    backgroundColor: globalRank.color,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Quick Strengths & Weaknesses Pills */}
          <div className="bg-zinc-950/80 border border-zinc-800/80 p-4 rounded-2xl space-y-3 md:min-w-[280px]">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1 mb-1.5">
                <Sparkles className="w-3 h-3" />
                <span>Points Forts</span>
              </span>
              <div className="flex flex-wrap gap-1.5">
                {strongestMuscles.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setSelectedMuscleKey(m.id)}
                    className="px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 border transition-all"
                    style={{ backgroundColor: m.rank.bg, borderColor: m.rank.border, color: m.rank.color }}
                  >
                    <span>{m.icon}</span>
                    <span>{m.name}</span>
                    <span className="text-[10px] opacity-80">Niv.{m.level}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-zinc-800/80">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1 mb-1.5">
                <TrendingUp className="w-3 h-3" />
                <span>Muscles à Développer</span>
              </span>
              <div className="flex flex-wrap gap-1.5">
                {laggingMuscles.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setSelectedMuscleKey(m.id)}
                    className="px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 text-zinc-300 hover:border-zinc-700 transition-all"
                  >
                    <span>{m.icon}</span>
                    <span>{m.name}</span>
                    <span className="text-[10px] text-zinc-500">Niv.{m.level}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive Anatomy Body Map & Muscle Detail Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive Vector Body Anatomy SVG */}
        <div className="lg:col-span-6 bg-zinc-900/90 border border-zinc-800 rounded-3xl p-5 shadow-xl space-y-4">
          {/* Header with Front/Back View Switcher */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-black text-base text-white flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>Carte Anatomique des Muscles</span>
              </h3>
              <p className="text-xs text-zinc-400">Touchez un muscle pour inspecter son rang</p>
            </div>

            <div className="flex bg-zinc-950 p-1 rounded-xl border border-zinc-800">
              <button
                type="button"
                onClick={() => setViewMode('front')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'front'
                    ? 'bg-emerald-500 text-black shadow-md'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Face
              </button>
              <button
                type="button"
                onClick={() => setViewMode('back')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'back'
                    ? 'bg-emerald-500 text-black shadow-md'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Dos
              </button>
            </div>
          </div>

          {/* Interactive SVG Body Container */}
          <div className="relative min-h-[380px] sm:min-h-[420px] bg-zinc-950/70 border border-zinc-800/80 rounded-2xl flex items-center justify-center p-4">
            <svg viewBox="0 0 300 460" className="w-full max-w-[280px] h-[380px] select-none filter drop-shadow-lg">
              {/* Head Silhouette */}
              <circle cx="150" cy="38" r="18" fill="#27272a" />
              <rect x="144" y="54" width="12" height="12" rx="3" fill="#27272a" />

              {viewMode === 'front' ? (
                /* ================= FRONT BODY VIEW ================= */
                <g className="transition-all duration-300">
                  {/* Traps (Front) */}
                  <path
                    d="M130,62 L170,62 L185,74 L115,74 Z"
                    fill={getMuscleColor('traps')}
                    className="cursor-pointer hover:brightness-125 transition-all"
                    onClick={() => setSelectedMuscleKey('traps')}
                    stroke={isMuscleSelected('traps') ? '#ffffff' : '#18181b'}
                    strokeWidth={isMuscleSelected('traps') ? '2' : '1'}
                  />

                  {/* Chest (Pectoraux) */}
                  <g
                    className="cursor-pointer hover:brightness-125 transition-all"
                    onClick={() => setSelectedMuscleKey('chest')}
                  >
                    {/* Left Pec */}
                    <path
                      d="M115,76 L148,76 L148,118 L108,112 L105,86 Z"
                      fill={getMuscleColor('chest')}
                      stroke={isMuscleSelected('chest') ? '#ffffff' : '#18181b'}
                      strokeWidth={isMuscleSelected('chest') ? '2.5' : '1'}
                      rx="4"
                    />
                    {/* Right Pec */}
                    <path
                      d="M152,76 L185,76 L195,86 L192,112 L152,118 Z"
                      fill={getMuscleColor('chest')}
                      stroke={isMuscleSelected('chest') ? '#ffffff' : '#18181b'}
                      strokeWidth={isMuscleSelected('chest') ? '2.5' : '1'}
                      rx="4"
                    />
                  </g>

                  {/* Front Delts (Épaules avant) */}
                  <g
                    className="cursor-pointer hover:brightness-125 transition-all"
                    onClick={() => setSelectedMuscleKey('front_delts')}
                  >
                    <path
                      d="M96,76 L113,76 L104,106 L90,96 Z"
                      fill={getMuscleColor('front_delts')}
                      stroke={isMuscleSelected('front_delts') ? '#ffffff' : '#18181b'}
                      strokeWidth={isMuscleSelected('front_delts') ? '2' : '1'}
                    />
                    <path
                      d="M187,76 L204,76 L210,96 L196,106 Z"
                      fill={getMuscleColor('front_delts')}
                      stroke={isMuscleSelected('front_delts') ? '#ffffff' : '#18181b'}
                      strokeWidth={isMuscleSelected('front_delts') ? '2' : '1'}
                    />
                  </g>

                  {/* Side Delts (Épaules latérales) */}
                  <g
                    className="cursor-pointer hover:brightness-125 transition-all"
                    onClick={() => setSelectedMuscleKey('side_delts')}
                  >
                    <path
                      d="M86,80 L96,76 L90,102 L80,94 Z"
                      fill={getMuscleColor('side_delts')}
                      stroke={isMuscleSelected('side_delts') ? '#ffffff' : '#18181b'}
                      strokeWidth={isMuscleSelected('side_delts') ? '2' : '1'}
                    />
                    <path
                      d="M204,76 L214,80 L220,94 L210,102 Z"
                      fill={getMuscleColor('side_delts')}
                      stroke={isMuscleSelected('side_delts') ? '#ffffff' : '#18181b'}
                      strokeWidth={isMuscleSelected('side_delts') ? '2' : '1'}
                    />
                  </g>

                  {/* Biceps */}
                  <g
                    className="cursor-pointer hover:brightness-125 transition-all"
                    onClick={() => setSelectedMuscleKey('biceps')}
                  >
                    <rect
                      x="82"
                      y="104"
                      width="18"
                      height="38"
                      rx="8"
                      fill={getMuscleColor('biceps')}
                      stroke={isMuscleSelected('biceps') ? '#ffffff' : '#18181b'}
                      strokeWidth={isMuscleSelected('biceps') ? '2' : '1'}
                    />
                    <rect
                      x="200"
                      y="104"
                      width="18"
                      height="38"
                      rx="8"
                      fill={getMuscleColor('biceps')}
                      stroke={isMuscleSelected('biceps') ? '#ffffff' : '#18181b'}
                      strokeWidth={isMuscleSelected('biceps') ? '2' : '1'}
                    />
                  </g>

                  {/* Forearms (Avant-bras) */}
                  <g
                    className="cursor-pointer hover:brightness-125 transition-all"
                    onClick={() => setSelectedMuscleKey('forearms')}
                  >
                    <path
                      d="M78,146 L98,146 L92,204 L74,198 Z"
                      fill={getMuscleColor('forearms')}
                      stroke={isMuscleSelected('forearms') ? '#ffffff' : '#18181b'}
                      strokeWidth={isMuscleSelected('forearms') ? '2' : '1'}
                    />
                    <path
                      d="M202,146 L222,146 L226,198 L208,204 Z"
                      fill={getMuscleColor('forearms')}
                      stroke={isMuscleSelected('forearms') ? '#ffffff' : '#18181b'}
                      strokeWidth={isMuscleSelected('forearms') ? '2' : '1'}
                    />
                  </g>

                  {/* Abs (Grand Droit) */}
                  <g
                    className="cursor-pointer hover:brightness-125 transition-all"
                    onClick={() => setSelectedMuscleKey('abs')}
                  >
                    <rect
                      x="134"
                      y="122"
                      width="14"
                      height="16"
                      rx="3"
                      fill={getMuscleColor('abs')}
                      stroke={isMuscleSelected('abs') ? '#ffffff' : '#18181b'}
                      strokeWidth="1"
                    />
                    <rect
                      x="152"
                      y="122"
                      width="14"
                      height="16"
                      rx="3"
                      fill={getMuscleColor('abs')}
                      stroke={isMuscleSelected('abs') ? '#ffffff' : '#18181b'}
                      strokeWidth="1"
                    />
                    <rect
                      x="134"
                      y="142"
                      width="14"
                      height="16"
                      rx="3"
                      fill={getMuscleColor('abs')}
                      stroke={isMuscleSelected('abs') ? '#ffffff' : '#18181b'}
                      strokeWidth="1"
                    />
                    <rect
                      x="152"
                      y="142"
                      width="14"
                      height="16"
                      rx="3"
                      fill={getMuscleColor('abs')}
                      stroke={isMuscleSelected('abs') ? '#ffffff' : '#18181b'}
                      strokeWidth="1"
                    />
                    <rect
                      x="136"
                      y="162"
                      width="13"
                      height="16"
                      rx="3"
                      fill={getMuscleColor('abs')}
                      stroke={isMuscleSelected('abs') ? '#ffffff' : '#18181b'}
                      strokeWidth="1"
                    />
                    <rect
                      x="151"
                      y="162"
                      width="13"
                      height="16"
                      rx="3"
                      fill={getMuscleColor('abs')}
                      stroke={isMuscleSelected('abs') ? '#ffffff' : '#18181b'}
                      strokeWidth="1"
                    />
                  </g>

                  {/* Obliques */}
                  <g
                    className="cursor-pointer hover:brightness-125 transition-all"
                    onClick={() => setSelectedMuscleKey('obliques')}
                  >
                    <path
                      d="M112,122 L130,122 L132,176 L118,172 Z"
                      fill={getMuscleColor('obliques')}
                      stroke={isMuscleSelected('obliques') ? '#ffffff' : '#18181b'}
                      strokeWidth={isMuscleSelected('obliques') ? '2' : '1'}
                    />
                    <path
                      d="M170,122 L188,122 L182,172 L168,176 Z"
                      fill={getMuscleColor('obliques')}
                      stroke={isMuscleSelected('obliques') ? '#ffffff' : '#18181b'}
                      strokeWidth={isMuscleSelected('obliques') ? '2' : '1'}
                    />
                  </g>

                  {/* Quads (Quadriceps) */}
                  <g
                    className="cursor-pointer hover:brightness-125 transition-all"
                    onClick={() => setSelectedMuscleKey('quads')}
                  >
                    {/* Left Quad */}
                    <path
                      d="M116,192 L146,192 L142,304 L114,298 L104,228 Z"
                      fill={getMuscleColor('quads')}
                      stroke={isMuscleSelected('quads') ? '#ffffff' : '#18181b'}
                      strokeWidth={isMuscleSelected('quads') ? '2.5' : '1'}
                      rx="6"
                    />
                    {/* Right Quad */}
                    <path
                      d="M154,192 L184,192 L196,228 L186,298 L158,304 Z"
                      fill={getMuscleColor('quads')}
                      stroke={isMuscleSelected('quads') ? '#ffffff' : '#18181b'}
                      strokeWidth={isMuscleSelected('quads') ? '2.5' : '1'}
                      rx="6"
                    />
                  </g>

                  {/* Calves (Mollets Front) */}
                  <g
                    className="cursor-pointer hover:brightness-125 transition-all"
                    onClick={() => setSelectedMuscleKey('calves')}
                  >
                    <path
                      d="M112,316 L138,316 L134,402 L116,398 Z"
                      fill={getMuscleColor('calves')}
                      stroke={isMuscleSelected('calves') ? '#ffffff' : '#18181b'}
                      strokeWidth={isMuscleSelected('calves') ? '2' : '1'}
                    />
                    <path
                      d="M162,316 L188,316 L184,398 L166,402 Z"
                      fill={getMuscleColor('calves')}
                      stroke={isMuscleSelected('calves') ? '#ffffff' : '#18181b'}
                      strokeWidth={isMuscleSelected('calves') ? '2' : '1'}
                    />
                  </g>
                </g>
              ) : (
                /* ================= BACK BODY VIEW ================= */
                <g className="transition-all duration-300">
                  {/* Traps (Trapèzes dos) */}
                  <path
                    d="M125,60 L175,60 L195,80 L150,132 L105,80 Z"
                    fill={getMuscleColor('traps')}
                    className="cursor-pointer hover:brightness-125 transition-all"
                    onClick={() => setSelectedMuscleKey('traps')}
                    stroke={isMuscleSelected('traps') ? '#ffffff' : '#18181b'}
                    strokeWidth={isMuscleSelected('traps') ? '2.5' : '1'}
                  />

                  {/* Upper Back / Rhomboids */}
                  <g
                    className="cursor-pointer hover:brightness-125 transition-all"
                    onClick={() => setSelectedMuscleKey('upper_back')}
                  >
                    <path
                      d="M106,84 L142,126 L108,138 Z"
                      fill={getMuscleColor('upper_back')}
                      stroke={isMuscleSelected('upper_back') ? '#ffffff' : '#18181b'}
                      strokeWidth="1"
                    />
                    <path
                      d="M194,84 L192,138 L158,126 Z"
                      fill={getMuscleColor('upper_back')}
                      stroke={isMuscleSelected('upper_back') ? '#ffffff' : '#18181b'}
                      strokeWidth="1"
                    />
                  </g>

                  {/* Lats (Grands Dorsaux) */}
                  <g
                    className="cursor-pointer hover:brightness-125 transition-all"
                    onClick={() => setSelectedMuscleKey('lats')}
                  >
                    <path
                      d="M106,104 L144,142 L136,176 L112,168 Z"
                      fill={getMuscleColor('lats')}
                      stroke={isMuscleSelected('lats') ? '#ffffff' : '#18181b'}
                      strokeWidth={isMuscleSelected('lats') ? '2.5' : '1'}
                    />
                    <path
                      d="M194,104 L188,168 L164,176 L156,142 Z"
                      fill={getMuscleColor('lats')}
                      stroke={isMuscleSelected('lats') ? '#ffffff' : '#18181b'}
                      strokeWidth={isMuscleSelected('lats') ? '2.5' : '1'}
                    />
                  </g>

                  {/* Rear Delts (Arrière d'épaules) */}
                  <g
                    className="cursor-pointer hover:brightness-125 transition-all"
                    onClick={() => setSelectedMuscleKey('rear_delts')}
                  >
                    <path
                      d="M86,76 L104,76 L96,106 L82,96 Z"
                      fill={getMuscleColor('rear_delts')}
                      stroke={isMuscleSelected('rear_delts') ? '#ffffff' : '#18181b'}
                      strokeWidth={isMuscleSelected('rear_delts') ? '2' : '1'}
                    />
                    <path
                      d="M196,76 L214,76 L218,96 L204,106 Z"
                      fill={getMuscleColor('rear_delts')}
                      stroke={isMuscleSelected('rear_delts') ? '#ffffff' : '#18181b'}
                      strokeWidth={isMuscleSelected('rear_delts') ? '2' : '1'}
                    />
                  </g>

                  {/* Triceps */}
                  <g
                    className="cursor-pointer hover:brightness-125 transition-all"
                    onClick={() => setSelectedMuscleKey('triceps')}
                  >
                    <rect
                      x="78"
                      y="104"
                      width="18"
                      height="38"
                      rx="8"
                      fill={getMuscleColor('triceps')}
                      stroke={isMuscleSelected('triceps') ? '#ffffff' : '#18181b'}
                      strokeWidth={isMuscleSelected('triceps') ? '2' : '1'}
                    />
                    <rect
                      x="204"
                      y="104"
                      width="18"
                      height="38"
                      rx="8"
                      fill={getMuscleColor('triceps')}
                      stroke={isMuscleSelected('triceps') ? '#ffffff' : '#18181b'}
                      strokeWidth={isMuscleSelected('triceps') ? '2' : '1'}
                    />
                  </g>

                  {/* Glutes (Fessiers) */}
                  <g
                    className="cursor-pointer hover:brightness-125 transition-all"
                    onClick={() => setSelectedMuscleKey('glutes')}
                  >
                    <path
                      d="M116,180 L148,180 L148,226 L112,220 Z"
                      fill={getMuscleColor('glutes')}
                      stroke={isMuscleSelected('glutes') ? '#ffffff' : '#18181b'}
                      strokeWidth={isMuscleSelected('glutes') ? '2.5' : '1'}
                      rx="8"
                    />
                    <path
                      d="M152,180 L184,180 L188,220 L152,226 Z"
                      fill={getMuscleColor('glutes')}
                      stroke={isMuscleSelected('glutes') ? '#ffffff' : '#18181b'}
                      strokeWidth={isMuscleSelected('glutes') ? '2.5' : '1'}
                      rx="8"
                    />
                  </g>

                  {/* Hamstrings (Ischio-jambiers) */}
                  <g
                    className="cursor-pointer hover:brightness-125 transition-all"
                    onClick={() => setSelectedMuscleKey('hamstrings')}
                  >
                    <path
                      d="M114,228 L146,228 L142,304 L114,300 Z"
                      fill={getMuscleColor('hamstrings')}
                      stroke={isMuscleSelected('hamstrings') ? '#ffffff' : '#18181b'}
                      strokeWidth={isMuscleSelected('hamstrings') ? '2.5' : '1'}
                      rx="6"
                    />
                    <path
                      d="M154,228 L186,228 L186,300 L158,304 Z"
                      fill={getMuscleColor('hamstrings')}
                      stroke={isMuscleSelected('hamstrings') ? '#ffffff' : '#18181b'}
                      strokeWidth={isMuscleSelected('hamstrings') ? '2.5' : '1'}
                      rx="6"
                    />
                  </g>

                  {/* Calves (Mollets Back) */}
                  <g
                    className="cursor-pointer hover:brightness-125 transition-all"
                    onClick={() => setSelectedMuscleKey('calves')}
                  >
                    <path
                      d="M112,316 L140,316 L134,402 L116,398 Z"
                      fill={getMuscleColor('calves')}
                      stroke={isMuscleSelected('calves') ? '#ffffff' : '#18181b'}
                      strokeWidth={isMuscleSelected('calves') ? '2' : '1'}
                    />
                    <path
                      d="M160,316 L188,316 L184,398 L166,402 Z"
                      fill={getMuscleColor('calves')}
                      stroke={isMuscleSelected('calves') ? '#ffffff' : '#18181b'}
                      strokeWidth={isMuscleSelected('calves') ? '2' : '1'}
                    />
                  </g>
                </g>
              )}
            </svg>

            {/* Tap Hint Indicator */}
            <div className="absolute bottom-3 left-4 text-[10px] text-zinc-500 flex items-center gap-1.5 font-medium">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Cliquez sur un muscle pour le sélectionner</span>
            </div>
          </div>

          {/* Ranks Legend */}
          <div className="flex flex-wrap items-center justify-between gap-1 pt-1 text-[10px] font-bold">
            {RANKS.map((r) => (
              <span
                key={r.id}
                className="px-2 py-0.5 rounded-md border flex items-center gap-1"
                style={{ backgroundColor: r.bg, borderColor: r.border, color: r.color }}
              >
                <span>{r.badge}</span>
                <span>{r.id}: {r.name}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Right Column: Selected Muscle Rank Sheet & Radar Balance */}
        <div className="lg:col-span-6 space-y-4">
          {/* Selected Muscle Detail Card */}
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-5 shadow-xl space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-black shadow-lg border"
                  style={{
                    backgroundColor: selectedMuscle.rank?.bg,
                    borderColor: selectedMuscle.rank?.border,
                    color: selectedMuscle.rank?.color,
                  }}
                >
                  <span className="text-xl font-black">{selectedMuscle.rank?.id}</span>
                  <span className="text-[8px] font-bold uppercase">{selectedMuscle.rank?.name}</span>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{selectedMuscle.icon}</span>
                    <h4 className="font-black text-xl text-white">{selectedMuscle.name}</h4>
                  </div>
                  <p className="text-xs text-zinc-400 mt-0.5">{selectedMuscle.description}</p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-mono text-zinc-400 block">Niveau</span>
                <span className="font-black text-2xl text-emerald-400 font-mono">
                  {selectedMuscle.level} <span className="text-xs text-zinc-400 font-normal">/ 100</span>
                </span>
              </div>
            </div>

            {/* Muscle XP & Level progress */}
            <div className="space-y-1.5 bg-zinc-950 p-3.5 rounded-2xl border border-zinc-800">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-zinc-400">Progression Rang {selectedMuscle.rank?.id}</span>
                <span className="text-emerald-400 font-mono font-bold">
                  {selectedMuscle.xp.toLocaleString('fr-FR')} XP
                </span>
              </div>
              <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.max(8, selectedMuscle.progressToNextLevel || 20)}%`,
                    backgroundColor: selectedMuscle.rank?.color || '#10b981',
                  }}
                />
              </div>
            </div>

            {/* Muscle Key Metrics */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-zinc-950 p-3 rounded-2xl border border-zinc-800">
                <span className="text-[10px] uppercase font-bold text-zinc-400 block mb-0.5">Meilleur Lift</span>
                <span className="font-black text-base text-emerald-400 font-mono">
                  {selectedMuscle.bestLiftKg > 0 ? `${selectedMuscle.bestLiftKg} kg` : '-'}
                </span>
              </div>

              <div className="bg-zinc-950 p-3 rounded-2xl border border-zinc-800">
                <span className="text-[10px] uppercase font-bold text-zinc-400 block mb-0.5">Volume Total</span>
                <span className="font-black text-base text-cyan-400 font-mono">
                  {selectedMuscle.totalVolume > 0 ? `${(selectedMuscle.totalVolume / 1000).toFixed(1)} t` : '-'}
                </span>
              </div>

              <div className="bg-zinc-950 p-3 rounded-2xl border border-zinc-800">
                <span className="text-[10px] uppercase font-bold text-zinc-400 block mb-0.5">Séries Validées</span>
                <span className="font-black text-base text-white font-mono">
                  {selectedMuscle.totalSets || 0}
                </span>
              </div>
            </div>

            {/* Recommended Exercises to Level Up this Muscle */}
            <div>
              <span className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider block mb-2">
                Exercices Clés pour ce Muscle :
              </span>
              <div className="flex flex-wrap gap-1.5">
                {(selectedMuscle.primaryExercises || []).map((exName, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 font-medium flex items-center gap-1.5"
                  >
                    <Zap className="w-3 h-3 text-amber-400" />
                    <span>{exName}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Muscle Balance Radar Spider Chart Card */}
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-black text-sm text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                <span>Radar d'Équilibre Corporel (Spider Chart)</span>
              </h4>
              <span className="text-xs text-zinc-400 font-mono">Harmonie musculaire</span>
            </div>

            {renderRadarChart()}
          </div>
        </div>
      </div>
    </div>
  );
}
