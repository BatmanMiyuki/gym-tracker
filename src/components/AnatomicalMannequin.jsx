// src/components/AnatomicalMannequin.jsx
import React, { useState } from 'react';
import { sounds } from '../utils/sound';

export default function AnatomicalMannequin({
  viewMode = 'front', // 'front' | 'back'
  selectedMuscleKey = 'chest',
  onSelectMuscle,
  muscleScores = {},
  filterGroup = 'all',
}) {
  const [hoveredMuscle, setHoveredMuscle] = useState(null);

  // Helper to get muscle rank color
  const getMuscleColor = (mKey) => {
    const m = muscleScores[mKey];
    if (!m || !m.rank) return '#3f3f46';
    return m.rank.color;
  };

  const getMuscleBgGrad = (mKey) => {
    const isSelected = selectedMuscleKey === mKey;
    const isHovered = hoveredMuscle === mKey;
    if (isSelected) return `url(#selected-glow)`;
    if (isHovered) return `url(#hover-glow)`;
    return `url(#grad-${mKey})`;
  };

  const handleClick = (mKey) => {
    sounds.playSetChecked();
    onSelectMuscle(mKey);
  };

  return (
    <div className="relative flex flex-col items-center justify-center select-none">
      {/* SVG Container */}
      <div className="relative w-full max-w-[340px] h-[480px] sm:h-[520px] flex items-center justify-center">
        <svg
          viewBox="0 0 320 500"
          className="w-full h-full overflow-visible filter drop-shadow-[0_10px_25px_rgba(0,0,0,0.8)]"
        >
          <defs>
            {/* Shading & 3D Gradient filters */}
            <filter id="glow-filter" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            {/* Selected Muscle Glow */}
            <linearGradient id="selected-glow" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#34d399" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#059669" stopOpacity="0.8" />
            </linearGradient>

            {/* Hover Glow */}
            <linearGradient id="hover-glow" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0.75" />
            </linearGradient>

            {/* Generate individual gradient for each muscle using its Rank color */}
            {Object.keys(muscleScores).map((mKey) => {
              const color = getMuscleColor(mKey);
              return (
                <linearGradient key={mKey} id={`grad-${mKey}`} x1="0" y1="0" x2="0.8" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity="0.85" />
                  <stop offset="60%" stopColor={color} stopOpacity="0.65" />
                  <stop offset="100%" stopColor="#09090b" stopOpacity="0.8" />
                </linearGradient>
              );
            })}
          </defs>

          {/* Mannequin Base Body Skeleton / Glow Silhouette */}
          <g opacity="0.15">
            <ellipse cx="160" cy="42" rx="20" ry="24" fill="#52525b" />
            <path
              d="M140,66 C110,72 80,100 80,140 C80,210 95,300 110,480 L210,480 C225,300 240,210 240,140 C240,100 210,72 180,66 Z"
              fill="#27272a"
            />
          </g>

          {/* Head & Neck Silhouette */}
          <g className="cursor-default pointer-events-none">
            <ellipse cx="160" cy="40" rx="18" ry="22" fill="#18181b" stroke="#27272a" strokeWidth="1.5" />
            {/* Neck */}
            <path d="M150,60 L170,60 L174,75 L146,75 Z" fill="#1c1917" stroke="#27272a" strokeWidth="1" />
          </g>

          {/* =========================================================================
              FRONT MANNEQUIN (VUE DE FACE)
             ========================================================================= */}
          {viewMode === 'front' ? (
            <g className="transition-all duration-300">
              {/* TRAPEZIUS (FRONT) */}
              <g
                className="cursor-pointer transition-all duration-200"
                onClick={() => handleClick('traps')}
                onMouseEnter={() => setHoveredMuscle('traps')}
                onMouseLeave={() => setHoveredMuscle(null)}
              >
                <path
                  d="M138,64 L160,72 L182,64 L202,78 L188,88 L160,82 L132,88 L118,78 Z"
                  fill={getMuscleBgGrad('traps')}
                  stroke={selectedMuscleKey === 'traps' ? '#34d399' : '#09090b'}
                  strokeWidth={selectedMuscleKey === 'traps' ? '2.5' : '1.2'}
                />
              </g>

              {/* FRONT DELTOIDS (ÉPAULES AVANT) */}
              <g
                className="cursor-pointer transition-all duration-200"
                onClick={() => handleClick('front_delts')}
                onMouseEnter={() => setHoveredMuscle('front_delts')}
                onMouseLeave={() => setHoveredMuscle(null)}
              >
                {/* Left Front Delt */}
                <path
                  d="M102,80 C114,78 126,82 128,88 C124,106 112,118 98,114 C94,102 96,90 102,80 Z"
                  fill={getMuscleBgGrad('front_delts')}
                  stroke={selectedMuscleKey === 'front_delts' ? '#34d399' : '#09090b'}
                  strokeWidth={selectedMuscleKey === 'front_delts' ? '2.5' : '1.2'}
                />
                {/* Right Front Delt */}
                <path
                  d="M218,80 C206,78 194,82 192,88 C196,106 208,118 222,114 C226,102 224,90 218,80 Z"
                  fill={getMuscleBgGrad('front_delts')}
                  stroke={selectedMuscleKey === 'front_delts' ? '#34d399' : '#09090b'}
                  strokeWidth={selectedMuscleKey === 'front_delts' ? '2.5' : '1.2'}
                />
              </g>

              {/* SIDE DELTOIDS (ÉPAULES LATÉRALES) */}
              <g
                className="cursor-pointer transition-all duration-200"
                onClick={() => handleClick('side_delts')}
                onMouseEnter={() => setHoveredMuscle('side_delts')}
                onMouseLeave={() => setHoveredMuscle(null)}
              >
                {/* Left Side Delt */}
                <path
                  d="M86,88 C94,80 102,82 102,86 C98,102 92,116 82,110 C80,102 82,94 86,88 Z"
                  fill={getMuscleBgGrad('side_delts')}
                  stroke={selectedMuscleKey === 'side_delts' ? '#34d399' : '#09090b'}
                  strokeWidth={selectedMuscleKey === 'side_delts' ? '2.5' : '1.2'}
                />
                {/* Right Side Delt */}
                <path
                  d="M234,88 C226,80 218,82 218,86 C222,102 228,116 238,110 C240,102 238,94 234,88 Z"
                  fill={getMuscleBgGrad('side_delts')}
                  stroke={selectedMuscleKey === 'side_delts' ? '#34d399' : '#09090b'}
                  strokeWidth={selectedMuscleKey === 'side_delts' ? '2.5' : '1.2'}
                />
              </g>

              {/* PECTORAUX (CHEST) - High Detail with clavicular & sternal fibers */}
              <g
                className="cursor-pointer transition-all duration-200"
                onClick={() => handleClick('chest')}
                onMouseEnter={() => setHoveredMuscle('chest')}
                onMouseLeave={() => setHoveredMuscle(null)}
              >
                {/* Left Pec Upper & Lower */}
                <path
                  d="M130,86 C144,82 156,84 158,88 L158,136 C144,136 122,132 114,124 C110,110 114,94 130,86 Z"
                  fill={getMuscleBgGrad('chest')}
                  stroke={selectedMuscleKey === 'chest' ? '#34d399' : '#09090b'}
                  strokeWidth={selectedMuscleKey === 'chest' ? '3' : '1.2'}
                />
                {/* Right Pec Upper & Lower */}
                <path
                  d="M190,86 C176,82 164,84 162,88 L162,136 C176,136 198,132 206,124 C210,110 206,94 190,86 Z"
                  fill={getMuscleBgGrad('chest')}
                  stroke={selectedMuscleKey === 'chest' ? '#34d399' : '#09090b'}
                  strokeWidth={selectedMuscleKey === 'chest' ? '3' : '1.2'}
                />
              </g>

              {/* BICEPS (AVEC CHEF COURT & CHEF LONG) */}
              <g
                className="cursor-pointer transition-all duration-200"
                onClick={() => handleClick('biceps')}
                onMouseEnter={() => setHoveredMuscle('biceps')}
                onMouseLeave={() => setHoveredMuscle(null)}
              >
                {/* Left Biceps */}
                <path
                  d="M84,116 C96,112 108,118 106,138 C104,152 92,162 82,156 C78,142 78,126 84,116 Z"
                  fill={getMuscleBgGrad('biceps')}
                  stroke={selectedMuscleKey === 'biceps' ? '#34d399' : '#09090b'}
                  strokeWidth={selectedMuscleKey === 'biceps' ? '2.5' : '1.2'}
                />
                {/* Right Biceps */}
                <path
                  d="M236,116 C224,112 212,118 214,138 C216,152 228,162 238,156 C242,142 242,126 236,116 Z"
                  fill={getMuscleBgGrad('biceps')}
                  stroke={selectedMuscleKey === 'biceps' ? '#34d399' : '#09090b'}
                  strokeWidth={selectedMuscleKey === 'biceps' ? '2.5' : '1.2'}
                />
              </g>

              {/* FOREARMS (AVANT-BRAS FACE) */}
              <g
                className="cursor-pointer transition-all duration-200"
                onClick={() => handleClick('forearms')}
                onMouseEnter={() => setHoveredMuscle('forearms')}
                onMouseLeave={() => setHoveredMuscle(null)}
              >
                {/* Left Forearm */}
                <path
                  d="M78,162 C90,158 100,166 96,192 C92,214 80,230 72,224 C68,206 70,178 78,162 Z"
                  fill={getMuscleBgGrad('forearms')}
                  stroke={selectedMuscleKey === 'forearms' ? '#34d399' : '#09090b'}
                  strokeWidth={selectedMuscleKey === 'forearms' ? '2.5' : '1.2'}
                />
                {/* Right Forearm */}
                <path
                  d="M242,162 C230,158 220,166 224,192 C228,214 240,230 248,224 C252,206 250,178 242,162 Z"
                  fill={getMuscleBgGrad('forearms')}
                  stroke={selectedMuscleKey === 'forearms' ? '#34d399' : '#09090b'}
                  strokeWidth={selectedMuscleKey === 'forearms' ? '2.5' : '1.2'}
                />
              </g>

              {/* ABDOMINAUX (6-PACK ABS + SERRATUS) */}
              <g
                className="cursor-pointer transition-all duration-200"
                onClick={() => handleClick('abs')}
                onMouseEnter={() => setHoveredMuscle('abs')}
                onMouseLeave={() => setHoveredMuscle(null)}
              >
                {/* Upper Abs Left & Right */}
                <path d="M142,140 L158,140 L158,158 L140,158 Z" fill={getMuscleBgGrad('abs')} stroke="#09090b" strokeWidth="1" />
                <path d="M162,140 L178,140 L180,158 L162,158 Z" fill={getMuscleBgGrad('abs')} stroke="#09090b" strokeWidth="1" />

                {/* Mid Abs Left & Right */}
                <path d="M140,162 L158,162 L158,180 L138,180 Z" fill={getMuscleBgGrad('abs')} stroke="#09090b" strokeWidth="1" />
                <path d="M162,162 L180,162 L182,180 L162,180 Z" fill={getMuscleBgGrad('abs')} stroke="#09090b" strokeWidth="1" />

                {/* Lower Abs Left & Right */}
                <path d="M138,184 L158,184 L158,206 L142,202 Z" fill={getMuscleBgGrad('abs')} stroke="#09090b" strokeWidth="1" />
                <path d="M162,184 L182,184 L178,202 L162,206 Z" fill={getMuscleBgGrad('abs')} stroke="#09090b" strokeWidth="1" />
              </g>

              {/* OBLIQUES (V-CUT) */}
              <g
                className="cursor-pointer transition-all duration-200"
                onClick={() => handleClick('obliques')}
                onMouseEnter={() => setHoveredMuscle('obliques')}
                onMouseLeave={() => setHoveredMuscle(null)}
              >
                {/* Left Oblique */}
                <path
                  d="M116,138 C130,136 136,146 136,188 L122,204 C112,186 110,160 116,138 Z"
                  fill={getMuscleBgGrad('obliques')}
                  stroke={selectedMuscleKey === 'obliques' ? '#34d399' : '#09090b'}
                  strokeWidth={selectedMuscleKey === 'obliques' ? '2.5' : '1.2'}
                />
                {/* Right Oblique */}
                <path
                  d="M204,138 C190,136 184,146 184,188 L198,204 C208,186 210,160 204,138 Z"
                  fill={getMuscleBgGrad('obliques')}
                  stroke={selectedMuscleKey === 'obliques' ? '#34d399' : '#09090b'}
                  strokeWidth={selectedMuscleKey === 'obliques' ? '2.5' : '1.2'}
                />
              </g>

              {/* QUADRICEPS (VASTUS LATERALIS, RECTUS FEMORIS, TEARDROP VASTUS MEDIALIS) */}
              <g
                className="cursor-pointer transition-all duration-200"
                onClick={() => handleClick('quads')}
                onMouseEnter={() => setHoveredMuscle('quads')}
                onMouseLeave={() => setHoveredMuscle(null)}
              >
                {/* Left Quad Group */}
                <path
                  d="M120,214 C146,212 156,224 154,260 C152,306 142,342 128,340 C114,334 104,260 120,214 Z"
                  fill={getMuscleBgGrad('quads')}
                  stroke={selectedMuscleKey === 'quads' ? '#34d399' : '#09090b'}
                  strokeWidth={selectedMuscleKey === 'quads' ? '3' : '1.2'}
                />
                {/* Right Quad Group */}
                <path
                  d="M200,214 C174,212 164,224 166,260 C168,306 178,342 192,340 C206,334 216,260 200,214 Z"
                  fill={getMuscleBgGrad('quads')}
                  stroke={selectedMuscleKey === 'quads' ? '#34d399' : '#09090b'}
                  strokeWidth={selectedMuscleKey === 'quads' ? '3' : '1.2'}
                />
              </g>

              {/* CALVES (MOLLETS & TIBIALIS - FRONT) */}
              <g
                className="cursor-pointer transition-all duration-200"
                onClick={() => handleClick('calves')}
                onMouseEnter={() => setHoveredMuscle('calves')}
                onMouseLeave={() => setHoveredMuscle(null)}
              >
                {/* Left Calf */}
                <path
                  d="M124,354 C142,352 148,368 144,416 C140,446 130,458 126,456 C118,446 114,388 124,354 Z"
                  fill={getMuscleBgGrad('calves')}
                  stroke={selectedMuscleKey === 'calves' ? '#34d399' : '#09090b'}
                  strokeWidth={selectedMuscleKey === 'calves' ? '2.5' : '1.2'}
                />
                {/* Right Calf */}
                <path
                  d="M196,354 C178,352 172,368 176,416 C180,446 190,458 194,456 C202,446 206,388 196,354 Z"
                  fill={getMuscleBgGrad('calves')}
                  stroke={selectedMuscleKey === 'calves' ? '#34d399' : '#09090b'}
                  strokeWidth={selectedMuscleKey === 'calves' ? '2.5' : '1.2'}
                />
              </g>
            </g>
          ) : (
            /* =========================================================================
                BACK MANNEQUIN (VUE DE DOS)
               ========================================================================= */
            <g className="transition-all duration-300">
              {/* TRAPEZIUS (DOS - DIAMOND SHAPE) */}
              <g
                className="cursor-pointer transition-all duration-200"
                onClick={() => handleClick('traps')}
                onMouseEnter={() => setHoveredMuscle('traps')}
                onMouseLeave={() => setHoveredMuscle(null)}
              >
                <path
                  d="M138,64 L182,64 L212,88 L160,154 L108,88 Z"
                  fill={getMuscleBgGrad('traps')}
                  stroke={selectedMuscleKey === 'traps' ? '#34d399' : '#09090b'}
                  strokeWidth={selectedMuscleKey === 'traps' ? '3' : '1.2'}
                />
              </g>

              {/* REAR DELTOIDS (ARRIÈRE D'ÉPAULES) */}
              <g
                className="cursor-pointer transition-all duration-200"
                onClick={() => handleClick('rear_delts')}
                onMouseEnter={() => setHoveredMuscle('rear_delts')}
                onMouseLeave={() => setHoveredMuscle(null)}
              >
                {/* Left Rear Delt */}
                <path
                  d="M86,88 C98,80 110,84 112,94 C108,112 96,120 86,112 C82,104 82,94 86,88 Z"
                  fill={getMuscleBgGrad('rear_delts')}
                  stroke={selectedMuscleKey === 'rear_delts' ? '#34d399' : '#09090b'}
                  strokeWidth={selectedMuscleKey === 'rear_delts' ? '2.5' : '1.2'}
                />
                {/* Right Rear Delt */}
                <path
                  d="M234,88 C222,80 210,84 208,94 C212,112 224,120 234,112 C238,104 238,94 234,88 Z"
                  fill={getMuscleBgGrad('rear_delts')}
                  stroke={selectedMuscleKey === 'rear_delts' ? '#34d399' : '#09090b'}
                  strokeWidth={selectedMuscleKey === 'rear_delts' ? '2.5' : '1.2'}
                />
              </g>

              {/* UPPER BACK / RHOMBOIDS */}
              <g
                className="cursor-pointer transition-all duration-200"
                onClick={() => handleClick('upper_back')}
                onMouseEnter={() => setHoveredMuscle('upper_back')}
                onMouseLeave={() => setHoveredMuscle(null)}
              >
                {/* Left Rhomboid/Infraspinatus */}
                <path
                  d="M112,96 L148,136 L118,154 L106,124 Z"
                  fill={getMuscleBgGrad('upper_back')}
                  stroke={selectedMuscleKey === 'upper_back' ? '#34d399' : '#09090b'}
                  strokeWidth={selectedMuscleKey === 'upper_back' ? '2.5' : '1.2'}
                />
                {/* Right Rhomboid/Infraspinatus */}
                <path
                  d="M208,96 L172,136 L202,154 L214,124 Z"
                  fill={getMuscleBgGrad('upper_back')}
                  stroke={selectedMuscleKey === 'upper_back' ? '#34d399' : '#09090b'}
                  strokeWidth={selectedMuscleKey === 'upper_back' ? '2.5' : '1.2'}
                />
              </g>

              {/* LATS (GRANDS DORSAUX - V-TAPER) */}
              <g
                className="cursor-pointer transition-all duration-200"
                onClick={() => handleClick('lats')}
                onMouseEnter={() => setHoveredMuscle('lats')}
                onMouseLeave={() => setHoveredMuscle(null)}
              >
                {/* Left Lat Wing */}
                <path
                  d="M108,124 L148,154 L144,198 C124,194 112,168 108,124 Z"
                  fill={getMuscleBgGrad('lats')}
                  stroke={selectedMuscleKey === 'lats' ? '#34d399' : '#09090b'}
                  strokeWidth={selectedMuscleKey === 'lats' ? '3' : '1.2'}
                />
                {/* Right Lat Wing */}
                <path
                  d="M212,124 L172,154 L176,198 C196,194 208,168 212,124 Z"
                  fill={getMuscleBgGrad('lats')}
                  stroke={selectedMuscleKey === 'lats' ? '#34d399' : '#09090b'}
                  strokeWidth={selectedMuscleKey === 'lats' ? '3' : '1.2'}
                />
              </g>

              {/* TRICEPS (HORSESHOE SHAPE - BACK) */}
              <g
                className="cursor-pointer transition-all duration-200"
                onClick={() => handleClick('triceps')}
                onMouseEnter={() => setHoveredMuscle('triceps')}
                onMouseLeave={() => setHoveredMuscle(null)}
              >
                {/* Left Triceps */}
                <path
                  d="M80,116 C92,112 104,118 102,142 C98,158 86,164 78,154 C74,142 74,124 80,116 Z"
                  fill={getMuscleBgGrad('triceps')}
                  stroke={selectedMuscleKey === 'triceps' ? '#34d399' : '#09090b'}
                  strokeWidth={selectedMuscleKey === 'triceps' ? '2.5' : '1.2'}
                />
                {/* Right Triceps */}
                <path
                  d="M240,116 C228,112 216,118 218,142 C222,158 234,164 242,154 C246,142 246,124 240,116 Z"
                  fill={getMuscleBgGrad('triceps')}
                  stroke={selectedMuscleKey === 'triceps' ? '#34d399' : '#09090b'}
                  strokeWidth={selectedMuscleKey === 'triceps' ? '2.5' : '1.2'}
                />
              </g>

              {/* GLUTES (FESSIERS) */}
              <g
                className="cursor-pointer transition-all duration-200"
                onClick={() => handleClick('glutes')}
                onMouseEnter={() => setHoveredMuscle('glutes')}
                onMouseLeave={() => setHoveredMuscle(null)}
              >
                {/* Left Glute */}
                <path
                  d="M120,200 C146,196 158,206 156,244 C152,260 134,264 118,252 C110,238 112,216 120,200 Z"
                  fill={getMuscleBgGrad('glutes')}
                  stroke={selectedMuscleKey === 'glutes' ? '#34d399' : '#09090b'}
                  strokeWidth={selectedMuscleKey === 'glutes' ? '3' : '1.2'}
                />
                {/* Right Glute */}
                <path
                  d="M200,200 C174,196 162,206 164,244 C168,260 186,264 202,252 C210,238 208,216 200,200 Z"
                  fill={getMuscleBgGrad('glutes')}
                  stroke={selectedMuscleKey === 'glutes' ? '#34d399' : '#09090b'}
                  strokeWidth={selectedMuscleKey === 'glutes' ? '3' : '1.2'}
                />
              </g>

              {/* HAMSTRINGS (ISCHIO-JAMBIERS) */}
              <g
                className="cursor-pointer transition-all duration-200"
                onClick={() => handleClick('hamstrings')}
                onMouseEnter={() => setHoveredMuscle('hamstrings')}
                onMouseLeave={() => setHoveredMuscle(null)}
              >
                {/* Left Hamstring */}
                <path
                  d="M118,256 C140,256 152,266 148,310 C144,338 132,342 122,338 C114,324 110,286 118,256 Z"
                  fill={getMuscleBgGrad('hamstrings')}
                  stroke={selectedMuscleKey === 'hamstrings' ? '#34d399' : '#09090b'}
                  strokeWidth={selectedMuscleKey === 'hamstrings' ? '3' : '1.2'}
                />
                {/* Right Hamstring */}
                <path
                  d="M202,256 C180,256 168,266 172,310 C176,338 188,342 198,338 C206,324 210,286 202,256 Z"
                  fill={getMuscleBgGrad('hamstrings')}
                  stroke={selectedMuscleKey === 'hamstrings' ? '#34d399' : '#09090b'}
                  strokeWidth={selectedMuscleKey === 'hamstrings' ? '3' : '1.2'}
                />
              </g>

              {/* CALVES (MOLLETS DIAMOND - BACK) */}
              <g
                className="cursor-pointer transition-all duration-200"
                onClick={() => handleClick('calves')}
                onMouseEnter={() => setHoveredMuscle('calves')}
                onMouseLeave={() => setHoveredMuscle(null)}
              >
                {/* Left Calf (Heart Diamond) */}
                <path
                  d="M120,352 C142,348 148,368 146,412 C142,444 130,458 126,456 C116,444 110,388 120,352 Z"
                  fill={getMuscleBgGrad('calves')}
                  stroke={selectedMuscleKey === 'calves' ? '#34d399' : '#09090b'}
                  strokeWidth={selectedMuscleKey === 'calves' ? '2.5' : '1.2'}
                />
                {/* Right Calf (Heart Diamond) */}
                <path
                  d="M200,352 C178,348 172,368 174,412 C178,444 190,458 194,456 C204,444 210,388 200,352 Z"
                  fill={getMuscleBgGrad('calves')}
                  stroke={selectedMuscleKey === 'calves' ? '#34d399' : '#09090b'}
                  strokeWidth={selectedMuscleKey === 'calves' ? '2.5' : '1.2'}
                />
              </g>
            </g>
          )}
        </svg>

        {/* Hover Muscle Floating Tooltip */}
        {hoveredMuscle && muscleScores[hoveredMuscle] && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-zinc-950/95 border border-zinc-700 px-3 py-1.5 rounded-full shadow-2xl backdrop-blur-md flex items-center gap-2 pointer-events-none z-20">
            <span className="text-base">{muscleScores[hoveredMuscle].icon}</span>
            <span className="font-black text-xs text-white">{muscleScores[hoveredMuscle].name}</span>
            <span
              className="text-[10px] font-bold px-1.5 py-0.2 rounded font-mono"
              style={{
                backgroundColor: muscleScores[hoveredMuscle].rank.bg,
                color: muscleScores[hoveredMuscle].rank.color,
              }}
            >
              Rang {muscleScores[hoveredMuscle].rank.id} • Nv.{muscleScores[hoveredMuscle].level}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
