// src/components/ExercisePickerModal.jsx
import React, { useState, useMemo } from 'react';
import { X, Search, Plus, Check, Dumbbell, Filter } from 'lucide-react';
import { MUSCLE_GROUPS, EQUIPMENT_TYPES } from '../data/exercises';
import { storageService } from '../services/storage';

export default function ExercisePickerModal({
  exercises = [],
  onSelectExercise,
  onClose,
  onCustomExerciseCreated,
  alreadySelectedIds = [],
}) {
  const [search, setSearch] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState('all');
  const [selectedEquip, setSelectedEquip] = useState('all');
  const [showCreateCustom, setShowCreateCustom] = useState(false);

  // New exercise form state
  const [newExName, setNewExName] = useState('');
  const [newExCategory, setNewExCategory] = useState('chest');
  const [newExEquip, setNewExEquip] = useState('dumbbell');
  const [newExTips, setNewExTips] = useState('');

  const filteredExercises = useMemo(() => {
    return exercises.filter((ex) => {
      const matchesSearch =
        ex.name.toLowerCase().includes(search.toLowerCase()) ||
        (ex.secondaryMuscles && ex.secondaryMuscles.some((m) => m.toLowerCase().includes(search.toLowerCase())));
      const matchesMuscle = selectedMuscle === 'all' || ex.category === selectedMuscle;
      const matchesEquip = selectedEquip === 'all' || ex.equipment === selectedEquip;
      return matchesSearch && matchesMuscle && matchesEquip;
    });
  }, [exercises, search, selectedMuscle, selectedEquip]);

  const handleCreateCustom = (e) => {
    e.preventDefault();
    if (!newExName.trim()) return;
    const created = storageService.addExercise({
      name: newExName.trim(),
      category: newExCategory,
      equipment: newExEquip,
      secondaryMuscles: [],
      tips: newExTips.trim() || 'Exercice personnalisé.',
      defaultRest: 90,
    });
    if (onCustomExerciseCreated) {
      onCustomExerciseCreated(created);
    }
    onSelectExercise(created);
  };

  const getMuscleLabel = (catId) => {
    const found = MUSCLE_GROUPS.find((m) => m.id === catId);
    return found ? `${found.icon} ${found.name}` : catId;
  };

  const getEquipLabel = (eqId) => {
    const found = EQUIPMENT_TYPES.find((e) => e.id === eqId);
    return found ? found.name : eqId;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md">
      <div className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 border-b border-zinc-800 bg-zinc-950/60">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-black text-base text-zinc-100 flex items-center gap-2">
              <Dumbbell className="w-5 h-5 text-emerald-400" />
              <span>Choisir un exercice</span>
            </h2>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search Input */}
          <div className="relative mb-2">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher (ex: Développé couché, Squat, Dos...)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 focus:border-emerald-500 rounded-xl pl-9 pr-3 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none transition-colors"
            />
          </div>

          {/* Muscle Horizontal Chips */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar">
            {MUSCLE_GROUPS.map((m) => (
              <button
                key={m.id}
                onClick={() => setSelectedMuscle(m.id)}
                className={`whitespace-nowrap px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                  selectedMuscle === m.id
                    ? 'bg-emerald-500 text-black shadow-md'
                    : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <span>{m.icon}</span>
                <span>{m.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Modal Body / Exercise List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 divide-y divide-zinc-800/40">
          {showCreateCustom ? (
            /* Custom Exercise Form */
            <form onSubmit={handleCreateCustom} className="p-4 bg-zinc-950 rounded-xl border border-zinc-800 space-y-3">
              <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                Créer un exercice personnalisé
              </h3>
              <div>
                <label className="text-[11px] text-zinc-400 block mb-1">Nom de l'exercice *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Hip Thrust unilatéral"
                  value={newExName}
                  onChange={(e) => setNewExName(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-zinc-400 block mb-1">Groupe musculaire</label>
                  <select
                    value={newExCategory}
                    onChange={(e) => setNewExCategory(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-2 text-xs text-zinc-200 focus:outline-none"
                  >
                    {MUSCLE_GROUPS.filter((m) => m.id !== 'all').map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-zinc-400 block mb-1">Équipement</label>
                  <select
                    value={newExEquip}
                    onChange={(e) => setNewExEquip(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-2 text-xs text-zinc-200 focus:outline-none"
                  >
                    {EQUIPMENT_TYPES.filter((e) => e.id !== 'all').map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] text-zinc-400 block mb-1">Notes / Conseils d'exécution</label>
                <textarea
                  rows="2"
                  placeholder="Placement, tempo, sensations..."
                  value={newExTips}
                  onChange={(e) => setNewExTips(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-zinc-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateCustom(false)}
                  className="flex-1 py-2 rounded-lg bg-zinc-800 text-zinc-300 text-xs font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold"
                >
                  Ajouter et sélectionner
                </button>
              </div>
            </form>
          ) : (
            <>
              {/* Exercise Item List */}
              {filteredExercises.length > 0 ? (
                filteredExercises.map((ex) => {
                  const isSelected = alreadySelectedIds.includes(ex.id);
                  return (
                    <div
                      key={ex.id}
                      onClick={() => onSelectExercise(ex)}
                      className={`pt-2 first:pt-0 pb-2 flex items-center justify-between cursor-pointer rounded-xl px-3 hover:bg-zinc-800/60 transition-colors ${
                        isSelected ? 'bg-emerald-500/10 border border-emerald-500/30' : ''
                      }`}
                    >
                      <div className="flex-1 pr-3">
                        <div className="font-bold text-sm text-zinc-100 flex items-center gap-2">
                          <span>{ex.name}</span>
                          {isSelected && (
                            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-1.5 py-0.2 rounded">
                              Déjà ajouté
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-[11px] text-zinc-400">
                          <span className="bg-zinc-800 px-2 py-0.5 rounded text-zinc-300">
                            {getMuscleLabel(ex.category)}
                          </span>
                          <span>•</span>
                          <span>{getEquipLabel(ex.equipment)}</span>
                        </div>
                      </div>

                      <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-emerald-400">
                        {isSelected ? (
                          <Check className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Plus className="w-4 h-4" />
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-12 text-center text-zinc-400 space-y-2">
                  <p className="text-sm">Aucun exercice trouvé pour cette recherche.</p>
                  <button
                    onClick={() => {
                      setNewExName(search);
                      setShowCreateCustom(true);
                    }}
                    className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-lg hover:bg-emerald-500/20"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Créer "{search || 'mon exercice'}"
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {!showCreateCustom && (
          <div className="p-3 border-t border-zinc-800 bg-zinc-950/80 flex items-center justify-between">
            <button
              onClick={() => setShowCreateCustom(true)}
              className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold hover:underline"
            >
              <Plus className="w-4 h-4" />
              Créer un exercice personnalisé
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold"
            >
              Fermer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
