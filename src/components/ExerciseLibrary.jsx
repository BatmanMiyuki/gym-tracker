// src/components/ExerciseLibrary.jsx
import React, { useState, useMemo } from 'react';
import { Search, Plus, Dumbbell, ChevronRight, Trophy, BookOpen } from 'lucide-react';
import { MUSCLE_GROUPS, EQUIPMENT_TYPES } from '../data/exercises';
import { storageService } from '../services/storage';
import ExerciseDetailModal from './ExerciseDetailModal';
import ExercisePickerModal from './ExercisePickerModal';

export default function ExerciseLibrary({ exercises = [], onStartWorkoutWithExercise }) {
  const [search, setSearch] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState('all');
  const [selectedEquip, setSelectedEquip] = useState('all');
  const [selectedExerciseForModal, setSelectedExerciseForModal] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filteredExercises = useMemo(() => {
    return exercises.filter((ex) => {
      const matchesSearch =
        ex.name.toLowerCase().includes(search.toLowerCase()) ||
        (ex.secondaryMuscles &&
          ex.secondaryMuscles.some((m) => m.toLowerCase().includes(search.toLowerCase())));
      const matchesMuscle = selectedMuscle === 'all' || ex.category === selectedMuscle;
      const matchesEquip = selectedEquip === 'all' || ex.equipment === selectedEquip;
      return matchesSearch && matchesMuscle && matchesEquip;
    });
  }, [exercises, search, selectedMuscle, selectedEquip]);

  const getMuscleLabel = (catId) => {
    const found = MUSCLE_GROUPS.find((m) => m.id === catId);
    return found ? `${found.icon} ${found.name}` : catId;
  };

  const getEquipLabel = (eqId) => {
    const found = EQUIPMENT_TYPES.find((e) => e.id === eqId);
    return found ? found.name : eqId;
  };

  return (
    <div className="pb-28 max-w-4xl mx-auto px-3 sm:px-4 space-y-4">
      {/* Search & Top Action */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher parmi les 80+ exercices..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <select
          value={selectedEquip}
          onChange={(e) => setSelectedEquip(e.target.value)}
          className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500 font-medium"
        >
          {EQUIPMENT_TYPES.map((eq) => (
            <option key={eq.id} value={eq.id}>
              {eq.name}
            </option>
          ))}
        </select>
      </div>

      {/* Horizontal Muscle Category Pills */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {MUSCLE_GROUPS.map((m) => (
          <button
            key={m.id}
            onClick={() => setSelectedMuscle(m.id)}
            className={`whitespace-nowrap px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
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

      {/* Exercises List Counter */}
      <div className="flex items-center justify-between text-xs text-zinc-400 px-1">
        <span>{filteredExercises.length} exercices disponibles</span>
        <button
          onClick={() => setShowCreateModal(true)}
          className="text-emerald-400 font-bold hover:underline flex items-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Ajouter un exercice</span>
        </button>
      </div>

      {/* Exercises Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {filteredExercises.map((ex) => {
          const stats = storageService.getExerciseStats(ex.id);

          return (
            <div
              key={ex.id}
              onClick={() => setSelectedExerciseForModal(ex)}
              className="bg-zinc-900/90 border border-zinc-800 hover:border-emerald-500/40 rounded-2xl p-3.5 cursor-pointer flex items-center justify-between transition-all group shadow-sm hover:shadow-lg hover:shadow-emerald-950/30"
            >
              <div className="flex-1 min-w-0 pr-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded">
                    {getMuscleLabel(ex.category)}
                  </span>
                  <span className="text-[10px] text-zinc-400">{getEquipLabel(ex.equipment)}</span>
                </div>

                <h3 className="font-bold text-sm text-zinc-100 group-hover:text-emerald-400 transition-colors truncate">
                  {ex.name}
                </h3>

                {stats.bestWeight > 0 ? (
                  <div className="flex items-center gap-2 text-xs mt-1.5 font-mono">
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <Trophy className="w-3 h-3 text-amber-400" />
                      PR : {stats.bestWeight} kg
                    </span>
                    <span className="text-zinc-500">•</span>
                    <span className="text-zinc-400">{stats.totalSets} séries faites</span>
                  </div>
                ) : (
                  <p className="text-[11px] text-zinc-500 mt-1 italic">Pas encore pratiqué</p>
                )}
              </div>

              <div className="w-8 h-8 rounded-xl bg-zinc-800/80 flex items-center justify-center text-zinc-400 group-hover:text-emerald-400 group-hover:bg-emerald-500/10 transition-colors">
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Exercise Detail Modal */}
      {selectedExerciseForModal && (
        <ExerciseDetailModal
          exercise={selectedExerciseForModal}
          onClose={() => setSelectedExerciseForModal(null)}
          onStartWithExercise={onStartWorkoutWithExercise}
        />
      )}

      {/* Custom Exercise Creator Modal */}
      {showCreateModal && (
        <ExercisePickerModal
          exercises={exercises}
          onSelectExercise={(created) => {
            setShowCreateModal(false);
            setSelectedExerciseForModal(created);
          }}
          onClose={() => setShowCreateModal(false)}
        />
      )}
    </div>
  );
}
