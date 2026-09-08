// src/components/WorkoutForm.jsx
import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Trash2,
  Check,
  Dumbbell,
  Calendar,
  Layers,
  Sparkles,
  Info,
} from 'lucide-react';

const MUSCLE_GROUPS = [
  'Pectoraux',
  'Dos',
  'Épaules',
  'Biceps',
  'Triceps',
  'Jambes',
  'Abdominaux',
  'Autre',
];

export default function WorkoutForm({
  initialData = null,
  presets = [],
  onSave,
  onCancel,
  isLoading = false,
}) {
  const [date, setDate] = useState(
    initialData?.date || new Date().toISOString().split('T')[0]
  );
  const [title, setTitle] = useState(initialData?.title || '');
  const [notes, setNotes] = useState(initialData?.notes || '');
  const [duration, setDuration] = useState(initialData?.duration_minutes || 60);

  const [exercises, setExercises] = useState(
    initialData?.exercises && initialData.exercises.length > 0
      ? initialData.exercises
      : [
          {
            id: `ex-${Date.now()}-1`,
            name: 'Développé couché',
            muscle_group: 'Pectoraux',
            sets: [
              { id: `s-1`, set_number: 1, weight_kg: 60, reps: 10 },
              { id: `s-2`, set_number: 2, weight_kg: 70, reps: 8 },
              { id: `s-3`, set_number: 3, weight_kg: 75, reps: 6 },
            ],
          },
        ]
  );

  // Quick auto-title suggestion based on muscle groups
  useEffect(() => {
    if (!title && exercises.length > 0) {
      const muscles = Array.from(
        new Set(exercises.map((e) => e.muscle_group).filter(Boolean))
      );
      if (muscles.length > 0) {
        setTitle(`Séance ${muscles.slice(0, 2).join(' & ')}`);
      }
    }
  }, [exercises, title]);

  // Add a new empty exercise
  const handleAddExercise = () => {
    const newEx = {
      id: `ex-${Date.now()}-${exercises.length + 1}`,
      name: '',
      muscle_group: 'Pectoraux',
      sets: [
        { id: `s-${Date.now()}-1`, set_number: 1, weight_kg: 50, reps: 10 },
        { id: `s-${Date.now()}-2`, set_number: 2, weight_kg: 50, reps: 10 },
        { id: `s-${Date.now()}-3`, set_number: 3, weight_kg: 50, reps: 8 },
      ],
    };
    setExercises([...exercises, newEx]);
  };

  // Remove exercise
  const handleRemoveExercise = (exIdx) => {
    setExercises(exercises.filter((_, idx) => idx !== exIdx));
  };

  // Update exercise metadata
  const handleUpdateExercise = (exIdx, field, value) => {
    const updated = [...exercises];
    updated[exIdx][field] = value;

    // If name changed, check preset for auto-muscle group
    if (field === 'name') {
      const matched = presets.find(
        (p) => p.name.toLowerCase() === value.trim().toLowerCase()
      );
      if (matched) {
        updated[exIdx].muscle_group = matched.muscle_group;
      }
    }

    setExercises(updated);
  };

  // Add set to exercise
  const handleAddSet = (exIdx) => {
    const updated = [...exercises];
    const ex = updated[exIdx];
    const prevSet = ex.sets[ex.sets.length - 1];

    const newSet = {
      id: `s-${Date.now()}-${ex.sets.length + 1}`,
      set_number: ex.sets.length + 1,
      weight_kg: prevSet ? prevSet.weight_kg : 50,
      reps: prevSet ? prevSet.reps : 10,
    };

    ex.sets.push(newSet);
    setExercises(updated);
  };

  // Remove set from exercise
  const handleRemoveSet = (exIdx, setIdx) => {
    const updated = [...exercises];
    updated[exIdx].sets.splice(setIdx, 1);
    // Renumber remaining sets
    updated[exIdx].sets.forEach((s, idx) => {
      s.set_number = idx + 1;
    });
    setExercises(updated);
  };

  // Update set values
  const handleUpdateSet = (exIdx, setIdx, field, value) => {
    const updated = [...exercises];
    updated[exIdx].sets[setIdx][field] = value === '' ? '' : Number(value);
    setExercises(updated);
  };

  // Submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!date) {
      alert('Veuillez renseigner la date de la séance.');
      return;
    }
    if (exercises.length === 0) {
      alert('Veuillez ajouter au moins un exercice.');
      return;
    }

    const payload = {
      date,
      title: title.trim() || 'Séance de musculation',
      notes: notes.trim(),
      duration_minutes: Number(duration) || 60,
      exercises: exercises.map((ex) => ({
        ...ex,
        name: ex.name.trim() || 'Exercice',
        sets: (ex.sets || []).map((s) => ({
          set_number: s.set_number,
          weight_kg: Number(s.weight_kg) || 0,
          reps: Number(s.reps) || 0,
        })),
      })),
    };

    onSave(payload);
  };

  // Quick total volume calculation
  const totalVolume = exercises.reduce(
    (sum, ex) =>
      sum +
      (ex.sets || []).reduce(
        (sSum, s) => sSum + (Number(s.weight_kg) || 0) * (Number(s.reps) || 0),
        0
      ),
    0
  );

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Dumbbell className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-black text-xl text-white">
              {initialData ? 'Modifier la séance' : 'Enregistrer une journée à la salle'}
            </h2>
            <p className="text-xs text-zinc-400">
              Saisissez la date, vos exercices, le poids et les répétitions
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onCancel}
          className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Date & Title Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-zinc-300 block mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-emerald-400" />
              <span>Date de la séance *</span>
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500 font-semibold"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-zinc-300 block mb-1.5">
              Titre de la séance (ex: Pecs & Bras)
            </label>
            <input
              type="text"
              placeholder="Ex: Séance Pectoraux & Triceps"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Optional Notes & Duration */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="text-xs font-bold text-zinc-400 block mb-1.5">
              Notes & Ressenti (facultatif)
            </label>
            <input
              type="text"
              placeholder="Ex: Super énergie, bonne congestion, charges en hausse..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-zinc-400 block mb-1.5">
              Durée estimée (min)
            </label>
            <input
              type="number"
              min="10"
              max="240"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value) || 60)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500 font-mono"
            />
          </div>
        </div>

        {/* Exercises Section */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              <h3 className="font-black text-sm uppercase tracking-wider text-zinc-200">
                Exercices effectués ({exercises.length})
              </h3>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400">
              Volume total estimé : {totalVolume.toLocaleString('fr-FR')} kg
            </span>
          </div>

          {/* List of Exercises Cards */}
          <div className="space-y-4">
            {exercises.map((ex, exIdx) => (
              <div
                key={ex.id || exIdx}
                className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 space-y-3 shadow-lg"
              >
                {/* Exercise Name & Muscle Category */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex-1 w-full flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-zinc-900 border border-zinc-700 text-xs font-mono font-bold text-emerald-400 flex items-center justify-center">
                      {exIdx + 1}
                    </span>
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        required
                        list={`presets-${exIdx}`}
                        placeholder="Nom de l'exercice (ex: Développé couché)"
                        value={ex.name}
                        onChange={(e) =>
                          handleUpdateExercise(exIdx, 'name', e.target.value)
                        }
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-sm font-bold text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
                      />
                      <datalist id={`presets-${exIdx}`}>
                        {presets.map((p, idx) => (
                          <option key={idx} value={p.name}>
                            {p.muscle_group}
                          </option>
                        ))}
                      </datalist>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                    <select
                      value={ex.muscle_group}
                      onChange={(e) =>
                        handleUpdateExercise(exIdx, 'muscle_group', e.target.value)
                      }
                      className="bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs font-semibold text-zinc-200 focus:outline-none focus:border-emerald-500"
                    >
                      {MUSCLE_GROUPS.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>

                    <button
                      type="button"
                      onClick={() => handleRemoveExercise(exIdx)}
                      title="Supprimer cet exercice"
                      className="p-2 rounded-xl text-zinc-500 hover:text-red-400 hover:bg-zinc-900 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Sets Table */}
                <div className="space-y-1.5 pt-1">
                  <div className="grid grid-cols-12 gap-2 text-[10px] font-bold uppercase tracking-wider text-zinc-400 px-2">
                    <span className="col-span-2 text-center">Série #</span>
                    <span className="col-span-5 text-center">Poids (kg)</span>
                    <span className="col-span-4 text-center">Répétitions</span>
                    <span className="col-span-1 text-center"></span>
                  </div>

                  {ex.sets.map((set, setIdx) => (
                    <div
                      key={set.id || setIdx}
                      className="grid grid-cols-12 gap-2 items-center bg-zinc-900/80 border border-zinc-800 rounded-xl p-2"
                    >
                      {/* Set Number */}
                      <span className="col-span-2 text-center font-mono font-bold text-xs text-zinc-400">
                        Série {set.set_number || setIdx + 1}
                      </span>

                      {/* Weight (Poids kg) */}
                      <div className="col-span-5">
                        <div className="flex items-center bg-zinc-950 border border-zinc-700 rounded-lg px-2.5 py-1.5">
                          <input
                            type="number"
                            step="0.5"
                            min="0"
                            placeholder="0"
                            value={set.weight_kg !== undefined ? set.weight_kg : ''}
                            onChange={(e) =>
                              handleUpdateSet(exIdx, setIdx, 'weight_kg', e.target.value)
                            }
                            className="w-full bg-transparent font-black text-sm text-center text-emerald-400 focus:outline-none"
                          />
                          <span className="text-[10px] text-zinc-400 font-bold ml-1">KG</span>
                        </div>
                      </div>

                      {/* Reps (Répétitions) */}
                      <div className="col-span-4">
                        <div className="flex items-center bg-zinc-950 border border-zinc-700 rounded-lg px-2.5 py-1.5">
                          <input
                            type="number"
                            min="0"
                            placeholder="0"
                            value={set.reps !== undefined ? set.reps : ''}
                            onChange={(e) =>
                              handleUpdateSet(exIdx, setIdx, 'reps', e.target.value)
                            }
                            className="w-full bg-transparent font-black text-sm text-center text-cyan-400 focus:outline-none"
                          />
                          <span className="text-[10px] text-zinc-400 font-bold ml-1">REPS</span>
                        </div>
                      </div>

                      {/* Remove Set Button */}
                      <div className="col-span-1 text-center">
                        {ex.sets.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveSet(exIdx, setIdx)}
                            className="text-zinc-600 hover:text-red-400 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Set Button */}
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => handleAddSet(exIdx)}
                    className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 py-1.5 px-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Ajouter une série</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add Exercise Button */}
          <button
            type="button"
            onClick={handleAddExercise}
            className="w-full py-3.5 rounded-2xl bg-zinc-950 hover:bg-zinc-900 border border-dashed border-zinc-700 hover:border-emerald-500 text-emerald-400 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>+ Ajouter un autre exercice à cette séance</span>
          </button>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-xs transition-colors"
          >
            Annuler
          </button>

          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-black text-xs sm:text-sm shadow-xl shadow-emerald-500/30 active:scale-95 transition-all flex items-center gap-2"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>{isLoading ? 'Enregistrement...' : 'Enregistrer la journée'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
