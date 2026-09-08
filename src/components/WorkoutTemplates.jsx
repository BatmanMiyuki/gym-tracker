// src/components/WorkoutTemplates.jsx
import React, { useState } from 'react';
import {
  Play,
  Plus,
  Flame,
  Clock,
  Dumbbell,
  ChevronRight,
  Sparkles,
  Layers,
  Edit2,
  Trash2,
} from 'lucide-react';
import { storageService } from '../services/storage';
import ExercisePickerModal from './ExercisePickerModal';

export default function WorkoutTemplates({
  templates = [],
  exercises = [],
  onStartWorkout,
  onStartEmptyWorkout,
  onUpdateTemplates,
}) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New template builder state
  const [tplName, setTplName] = useState('');
  const [tplCategory, setTplCategory] = useState('PPL');
  const [tplDescription, setTplDescription] = useState('');
  const [tplExercises, setTplExercises] = useState([]);
  const [showPickerForTpl, setShowPickerForTpl] = useState(false);

  const categories = ['all', 'PPL', 'Upper/Lower', 'Full Body', 'Personnalisé'];

  const filteredTemplates = templates.filter((t) => {
    if (selectedCategory === 'all') return true;
    return t.category === selectedCategory || (selectedCategory === 'Personnalisé' && t.isCustom);
  });

  const handleStartFromTemplate = (template) => {
    // Generate active workout object with exercise details and last weights preloaded
    const workoutExercises = (template.exercises || []).map((tEx) => {
      const exerciseDef = exercises.find((e) => e.id === tEx.exerciseId) || {
        name: tEx.exerciseId,
        category: 'chest',
      };
      const lastPerf = storageService.getLastPerformance(tEx.exerciseId);
      const defaultWeight = lastPerf?.sets?.[0]?.weight || 50;
      const targetSetsCount = tEx.targetSets || 3;

      const sets = [];
      for (let i = 1; i <= targetSetsCount; i++) {
        // First set warmup if heavy compound
        const isWarmup = i === 1 && targetSetsCount >= 4;
        sets.push({
          setNumber: i,
          type: isWarmup ? 'warmup' : 'normal',
          weight: isWarmup ? Math.round(defaultWeight * 0.6) : defaultWeight,
          reps: 8,
          rpe: 8,
          completed: false,
        });
      }

      return {
        exerciseId: tEx.exerciseId,
        exerciseName: exerciseDef.name,
        category: exerciseDef.category,
        equipment: exerciseDef.equipment,
        defaultRest: tEx.restSeconds || 90,
        notes: '',
        sets,
      };
    });

    const activeWorkout = {
      id: `workout-${Date.now()}`,
      templateId: template.id,
      name: template.name,
      exercises: workoutExercises,
      durationSeconds: 0,
      prs: [],
      notes: '',
      date: new Date().toISOString(),
    };

    onStartWorkout(activeWorkout);
  };

  const handleAddExerciseToNewTemplate = (exercise) => {
    setTplExercises([
      ...tplExercises,
      {
        exerciseId: exercise.id,
        exerciseName: exercise.name,
        targetSets: 3,
        targetReps: '8-10',
        restSeconds: exercise.defaultRest || 90,
      },
    ]);
    setShowPickerForTpl(false);
  };

  const handleSaveCustomTemplate = (e) => {
    e.preventDefault();
    if (!tplName.trim() || tplExercises.length === 0) return;

    const newTpl = storageService.addTemplate({
      name: tplName.trim(),
      category: tplCategory,
      description: tplDescription.trim() || 'Programme personnalisé',
      durationMin: tplExercises.length * 10,
      isCustom: true,
      exercises: tplExercises,
    });

    onUpdateTemplates(storageService.getTemplates());
    setShowCreateModal(false);
    setTplName('');
    setTplDescription('');
    setTplExercises([]);
  };

  return (
    <div className="pb-28 max-w-4xl mx-auto px-3 sm:px-4 space-y-5">
      {/* Hero Quick Start Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-900/60 via-zinc-900 to-zinc-900 border border-emerald-500/30 p-4 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider mb-1">
              <Flame className="w-4 h-4 fill-current text-emerald-400" />
              <span>Prêt pour l'entraînement ?</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-zinc-100">
              Démarrer une séance aujourd'hui
            </h2>
            <p className="text-xs text-zinc-400 mt-1 max-w-md">
              Choisissez un programme pré-établi ou lancez une séance libre pour enregistrer vos séries en direct.
            </p>
          </div>

          <button
            onClick={onStartEmptyWorkout}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs sm:text-sm shadow-lg shadow-emerald-500/25 active:scale-95 transition-all whitespace-nowrap"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Séance libre (Vide)</span>
          </button>
        </div>
      </div>

      {/* Routine Category Filters & Create Button */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1">
        <div className="flex items-center gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-emerald-500 text-black shadow-md'
                  : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {cat === 'all' ? 'Tous les programmes' : cat}
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-emerald-500/40 text-emerald-400 hover:text-emerald-300 text-xs font-bold whitespace-nowrap transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Créer une routine</span>
        </button>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        {filteredTemplates.map((tpl) => (
          <div
            key={tpl.id}
            className="bg-zinc-900/90 border border-zinc-800 hover:border-zinc-700/90 rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col justify-between transition-all group"
          >
            <div>
              {/* Top Meta */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded">
                  {tpl.category}
                </span>
                <div className="flex items-center gap-1 text-xs text-zinc-400 font-mono">
                  <Clock className="w-3.5 h-3.5" />
                  <span>~{tpl.durationMin || 60} min</span>
                </div>
              </div>

              {/* Title & Description */}
              <h3 className="font-black text-base text-zinc-100 group-hover:text-emerald-400 transition-colors">
                {tpl.name}
              </h3>
              <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                {tpl.description}
              </p>

              {/* Exercises Preview List */}
              <div className="mt-3.5 space-y-1.5 border-t border-zinc-800/60 pt-3">
                <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider block">
                  {tpl.exercises?.length || 0} Exercices inclus :
                </span>
                <div className="space-y-1">
                  {(tpl.exercises || []).slice(0, 5).map((exItem, idx) => {
                    const exObj = exercises.find((e) => e.id === exItem.exerciseId);
                    return (
                      <div
                        key={idx}
                        className="flex items-center justify-between text-xs text-zinc-300"
                      >
                        <span className="truncate pr-2 font-medium">
                          • {exObj ? exObj.name : exItem.exerciseName || exItem.exerciseId}
                        </span>
                        <span className="text-[11px] font-mono text-zinc-400 whitespace-nowrap">
                          {exItem.targetSets} × {exItem.targetReps || '8-10'}
                        </span>
                      </div>
                    );
                  })}
                  {(tpl.exercises?.length || 0) > 5 && (
                    <span className="text-[11px] text-zinc-400 italic">
                      + {(tpl.exercises.length - 5)} autres exercices...
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Action */}
            <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between gap-2">
              <button
                onClick={() => handleStartFromTemplate(tpl)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs shadow-md shadow-emerald-500/20 active:scale-95 transition-all"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Démarrer cette séance</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Custom Template Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
            <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
              <h3 className="font-bold text-sm text-zinc-100 flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-400" />
                <span>Créer une routine sur mesure</span>
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-zinc-100"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveCustomTemplate} className="p-4 overflow-y-auto space-y-4">
              <div>
                <label className="text-xs font-semibold text-zinc-400 block mb-1">
                  Nom de la routine *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Pecs & Biceps Armageddon"
                  value={tplName}
                  onChange={(e) => setTplName(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-zinc-400 block mb-1">Catégorie</label>
                  <select
                    value={tplCategory}
                    onChange={(e) => setTplCategory(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none"
                  >
                    <option value="PPL">PPL</option>
                    <option value="Upper/Lower">Upper / Lower</option>
                    <option value="Full Body">Full Body</option>
                    <option value="Bro Split">Bro Split</option>
                    <option value="Autre">Autre</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-zinc-400 block mb-1">
                    Description rapide
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Focus haut des pecs"
                    value={tplDescription}
                    onChange={(e) => setTplDescription(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none"
                  />
                </div>
              </div>

              {/* Added exercises */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-zinc-300">Exercices ({tplExercises.length})</span>
                  <button
                    type="button"
                    onClick={() => setShowPickerForTpl(true)}
                    className="flex items-center gap-1 text-xs text-emerald-400 font-bold hover:underline"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Ajouter un exercice
                  </button>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {tplExercises.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2.5 bg-zinc-950 rounded-xl border border-zinc-800 text-xs"
                    >
                      <span className="font-semibold text-zinc-200">{item.exerciseName}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-zinc-400">{item.targetSets} séries</span>
                        <button
                          type="button"
                          onClick={() => setTplExercises(tplExercises.filter((_, i) => i !== idx))}
                          className="text-zinc-500 hover:text-red-400 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {tplExercises.length === 0 && (
                    <div className="py-6 text-center text-zinc-500 text-xs border border-dashed border-zinc-800 rounded-xl">
                      Aucun exercice ajouté pour l'instant.
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-zinc-800 text-zinc-300 font-semibold text-xs"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={tplExercises.length === 0 || !tplName.trim()}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-bold text-xs"
                >
                  Enregistrer la routine
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Picker for template builder */}
      {showPickerForTpl && (
        <ExercisePickerModal
          exercises={exercises}
          onSelectExercise={handleAddExerciseToNewTemplate}
          onClose={() => setShowPickerForTpl(false)}
        />
      )}
    </div>
  );
}
