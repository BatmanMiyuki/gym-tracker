// src/components/OneRepMaxModal.jsx
import React, { useState } from 'react';
import { X, Calculator, Zap, Flame } from 'lucide-react';
import { calculate1RM, get1RMPercentages } from '../utils/formulas';

export default function OneRepMaxModal({ initialWeight = 80, initialReps = 8, onClose }) {
  const [weight, setWeight] = useState(initialWeight || 80);
  const [reps, setReps] = useState(initialReps || 8);

  const oneRepMax = calculate1RM(weight, reps);
  const percentages = get1RMPercentages(oneRepMax);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-zinc-100">Calculateur de 1RM</h2>
              <p className="text-[11px] text-zinc-400">Estimation de force maximale (Brzycki & Epley)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-5">
          {/* Inputs Row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800">
              <label className="text-[11px] font-semibold text-zinc-400 block mb-1">
                Poids soulevé (kg)
              </label>
              <div className="flex items-center justify-between">
                <input
                  type="number"
                  step="0.5"
                  value={weight || ''}
                  onChange={(e) => setWeight(Number(e.target.value) || 0)}
                  className="w-full bg-transparent font-black text-2xl text-emerald-400 focus:outline-none"
                />
                <span className="text-xs text-zinc-500 font-bold">KG</span>
              </div>
            </div>

            <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800">
              <label className="text-[11px] font-semibold text-zinc-400 block mb-1">
                Répétitions réussies
              </label>
              <div className="flex items-center justify-between">
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={reps || ''}
                  onChange={(e) => setReps(Number(e.target.value) || 1)}
                  className="w-full bg-transparent font-black text-2xl text-teal-400 focus:outline-none"
                />
                <span className="text-xs text-zinc-500 font-bold">REPS</span>
              </div>
            </div>
          </div>

          {/* Big 1RM Card */}
          <div className="relative overflow-hidden bg-gradient-to-br from-emerald-950/60 via-zinc-900 to-zinc-950 border border-emerald-500/30 p-5 rounded-2xl text-center shadow-lg">
            <div className="flex items-center justify-center gap-1 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Flame className="w-4 h-4 fill-current" />
              <span>Votre 1RM Estimé</span>
            </div>
            <div className="font-black text-4xl sm:text-5xl text-zinc-100 tracking-tight my-1">
              {oneRepMax} <span className="text-xl font-bold text-emerald-400">kg</span>
            </div>
            <p className="text-[11px] text-zinc-400 max-w-xs mx-auto">
              Charge maximale théorique que vous pouvez soulever sur 1 seule répétition propre.
            </p>
          </div>

          {/* Training Zones Breakdown Table */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                Tableau des pourcentages d'entraînement
              </span>
            </div>

            <div className="bg-zinc-950 rounded-xl border border-zinc-800 overflow-hidden text-xs">
              <div className="grid grid-cols-4 bg-zinc-900/90 px-3 py-2 text-[10px] font-bold text-zinc-400 uppercase border-b border-zinc-800">
                <span>Intensité</span>
                <span>Poids</span>
                <span>Reps cibles</span>
                <span>Objectif</span>
              </div>

              <div className="divide-y divide-zinc-800/60 max-h-56 overflow-y-auto">
                {percentages.map((row) => {
                  const isHeavy = row.percentage >= 85;
                  const isHypertrophy = row.percentage >= 70 && row.percentage < 85;

                  return (
                    <div
                      key={row.percentage}
                      className="grid grid-cols-4 px-3 py-2 items-center hover:bg-zinc-900/50 transition-colors"
                    >
                      <span
                        className={`font-mono font-bold ${
                          row.percentage === 100
                            ? 'text-emerald-400'
                            : isHeavy
                            ? 'text-amber-400'
                            : isHypertrophy
                            ? 'text-cyan-400'
                            : 'text-zinc-400'
                        }`}
                      >
                        {row.percentage}%
                      </span>
                      <span className="font-bold text-zinc-200">{row.weight} kg</span>
                      <span className="text-zinc-400 font-medium">{row.reps}</span>
                      <span className="text-[11px] text-zinc-400 truncate">{row.description}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-950/60">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-xs transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
