// src/components/PlateCalculator.jsx
import React, { useState } from 'react';
import { X, Disc, Plus, Minus, Check } from 'lucide-react';
import { calculatePlates, STANDARD_PLATES } from '../utils/formulas';

export default function PlateCalculator({ initialWeight = 80, onClose, onApplyWeight }) {
  const [targetWeight, setTargetWeight] = useState(initialWeight || 80);
  const [barWeight, setBarWeight] = useState(20);

  const { perSideWeight, platesPerSide, remainder } = calculatePlates(targetWeight, barWeight);

  const quickWeights = [40, 60, 80, 100, 120, 140, 160];

  const barOptions = [
    { label: 'Barre standard (20 kg)', value: 20 },
    { label: 'Barre femme / technique (15 kg)', value: 15 },
    { label: 'Barre EZ (10 kg)', value: 10 },
    { label: 'Sans barre / Machine (0 kg)', value: 0 },
  ];

  // Group plates for clean summary (e.g., 2 x 20kg, 1 x 5kg)
  const plateCounts = platesPerSide.reduce((acc, p) => {
    acc[p.weight] = (acc[p.weight] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Disc className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-zinc-100">Calculateur de disques</h2>
              <p className="text-[11px] text-zinc-400">Chargement de barre olympique</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-5">
          {/* Target Weight Controls */}
          <div>
            <label className="text-xs font-semibold text-zinc-400 block mb-2">
              Poids total souhaité (barre incluse)
            </label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setTargetWeight((w) => Math.max(0, w - 2.5))}
                className="w-12 h-12 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 flex items-center justify-center font-bold text-lg active:scale-95 transition-all"
              >
                <Minus className="w-5 h-5" />
              </button>

              <div className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-center">
                <input
                  type="number"
                  step="0.5"
                  value={targetWeight || ''}
                  onChange={(e) => setTargetWeight(Number(e.target.value) || 0)}
                  className="w-full bg-transparent text-center font-black text-3xl text-emerald-400 focus:outline-none"
                />
                <span className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">
                  Kilogrammes
                </span>
              </div>

              <button
                onClick={() => setTargetWeight((w) => w + 2.5)}
                className="w-12 h-12 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 flex items-center justify-center font-bold text-lg active:scale-95 transition-all"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Weight Chips */}
            <div className="flex flex-wrap gap-1.5 mt-3">
              {quickWeights.map((w) => (
                <button
                  key={w}
                  onClick={() => setTargetWeight(w)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    targetWeight === w
                      ? 'bg-emerald-500 text-black'
                      : 'bg-zinc-800/80 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700'
                  }`}
                >
                  {w} kg
                </button>
              ))}
            </div>
          </div>

          {/* Bar Type Select */}
          <div>
            <label className="text-xs font-semibold text-zinc-400 block mb-1.5">Type de barre</label>
            <select
              value={barWeight}
              onChange={(e) => setBarWeight(Number(e.target.value))}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs font-medium text-zinc-200 focus:outline-none focus:border-emerald-500"
            >
              {barOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Visual Barbell Sleeve */}
          <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 text-center">
            <div className="flex items-center justify-between text-xs mb-3">
              <span className="font-bold text-zinc-300">À mettre par côté :</span>
              <span className="font-black text-emerald-400 text-sm">
                {perSideWeight > 0 ? `${perSideWeight} kg` : '0 kg'}
              </span>
            </div>

            {/* Barbell Visual Representation */}
            <div className="relative h-20 bg-zinc-900/90 rounded-lg flex items-center justify-start px-4 overflow-hidden border border-zinc-800">
              {/* Bar shaft */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-5 bg-zinc-600 rounded-l-sm" />
              {/* Collar */}
              <div className="relative z-10 w-4 h-12 bg-zinc-400 rounded-sm border border-zinc-500 shadow-md mr-1.5 flex items-center justify-center">
                <div className="w-1 h-8 bg-zinc-600 rounded-full" />
              </div>

              {/* Sleeve Plates */}
              <div className="relative z-10 flex items-center gap-1 overflow-x-auto py-2">
                {platesPerSide.length > 0 ? (
                  platesPerSide.map((plate, idx) => {
                    const heightPercent =
                      plate.weight === 25
                        ? 'h-16 w-4'
                        : plate.weight === 20
                        ? 'h-15 w-4'
                        : plate.weight === 15
                        ? 'h-14 w-3.5'
                        : plate.weight === 10
                        ? 'h-12 w-3.5'
                        : plate.weight === 5
                        ? 'h-10 w-3'
                        : plate.weight === 2.5
                        ? 'h-8 w-2.5'
                        : 'h-6 w-2';

                    return (
                      <div
                        key={idx}
                        style={{ backgroundColor: plate.color, borderColor: plate.border }}
                        className={`${heightPercent} rounded-[2px] border flex flex-col items-center justify-center shadow-md`}
                        title={`${plate.label}`}
                      >
                        <span
                          className={`text-[8px] font-black transform -rotate-90 leading-none ${
                            plate.weight === 5 ? 'text-black' : 'text-white'
                          }`}
                        >
                          {plate.weight}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <span className="text-xs text-zinc-500 italic ml-2">Aucun disque (barre seule)</span>
                )}
              </div>
            </div>

            {/* Text Breakdown */}
            {platesPerSide.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-3">
                {Object.entries(plateCounts).map(([weight, count]) => {
                  const plateInfo = STANDARD_PLATES.find((p) => p.weight === Number(weight));
                  return (
                    <div
                      key={weight}
                      className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-2.5 py-1.5 rounded-lg"
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full inline-block border"
                        style={{ backgroundColor: plateInfo?.color, borderColor: plateInfo?.border }}
                      />
                      <span className="text-xs font-semibold text-zinc-200">
                        {count} × {weight} kg
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            {remainder > 0 && (
              <p className="text-[11px] text-amber-400/90 mt-2 font-medium">
                ⚠️ Reste non ajustable : {remainder} kg (en dessous de 1.25kg par côté).
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-950/60 flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold text-xs transition-colors"
          >
            Fermer
          </button>
          {onApplyWeight && (
            <button
              onClick={() => {
                onApplyWeight(targetWeight);
                onClose();
              }}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs transition-colors"
            >
              <Check className="w-4 h-4" />
              <span>Appliquer {targetWeight} kg</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
