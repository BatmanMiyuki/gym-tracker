// src/components/WorkoutList.jsx
import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Search,
  PlusCircle,
  Clock,
  Dumbbell,
  Trash2,
  Edit2,
  Copy,
  Layers,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from 'lucide-react';

export default function WorkoutList({
  workouts = [],
  onEditWorkout,
  onDeleteWorkout,
  onDuplicateWorkout,
  onAddNewWorkout,
}) {
  const [search, setSearch] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [expandedId, setExpandedId] = useState(null);

  // Helper date formatter
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  // Distinct available months for filter
  const months = Array.from(
    new Set(workouts.map((w) => (w.date || '').substring(0, 7)).filter(Boolean))
  )
    .sort()
    .reverse();

  // Filter workouts
  const filtered = workouts.filter((w) => {
    const matchesSearch =
      (w.title || '').toLowerCase().includes(search.toLowerCase()) ||
      (w.notes || '').toLowerCase().includes(search.toLowerCase()) ||
      (w.exercises || []).some((ex) =>
        (ex.name || '').toLowerCase().includes(search.toLowerCase())
      );

    if (!matchesSearch) return false;
    if (selectedMonth === 'all') return true;
    return (w.date || '').startsWith(selectedMonth);
  });

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Top Banner & Quick Add */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-zinc-900 border border-zinc-800 p-4 sm:p-5 rounded-3xl shadow-xl">
        <div>
          <h2 className="text-xl font-black text-white">Journal de vos Séances</h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            {workouts.length} journée{workouts.length > 1 ? 's' : ''} enregistrée{workouts.length > 1 ? 's' : ''} à la salle
          </p>
        </div>

        <button
          onClick={onAddNewWorkout}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs sm:text-sm shadow-lg shadow-emerald-500/25 active:scale-95 transition-all whitespace-nowrap"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ Ajouter une journée</span>
        </button>
      </div>

      {/* Filters Row */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher un exercice, une date ou un mot clé..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 font-medium"
          />
        </div>

        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-2.5 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500 font-semibold"
        >
          <option value="all">Tous les mois</option>
          {months.map((m) => {
            const [year, month] = m.split('-');
            const monthName = new Date(
              Number(year),
              Number(month) - 1
            ).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
            return (
              <option key={m} value={m}>
                {monthName}
              </option>
            );
          })}
        </select>
      </div>

      {/* Workouts Timeline List */}
      <div className="space-y-3">
        {filtered.length > 0 ? (
          filtered.map((workout) => {
            // Total volume for this workout
            const sessionVolume = (workout.exercises || []).reduce(
              (sum, ex) =>
                sum +
                (ex.sets || []).reduce(
                  (sSum, s) =>
                    sSum + (Number(s.weight_kg) || 0) * (Number(s.reps) || 0),
                  0
                ),
              0
            );

            // Total sets
            const totalSetsCount = (workout.exercises || []).reduce(
              (sum, ex) => sum + (ex.sets || []).length,
              0
            );

            // Distinct muscles
            const muscles = Array.from(
              new Set(
                (workout.exercises || []).map((e) => e.muscle_group).filter(Boolean)
              )
            );

            return (
              <div
                key={workout.id}
                className="bg-zinc-900/90 border border-zinc-800 hover:border-zinc-700/80 rounded-3xl p-4 sm:p-5 shadow-lg transition-all space-y-4"
              >
                {/* Header of Workout Day */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800/80 pb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-emerald-400 capitalize flex items-center gap-1.5">
                        <CalendarIcon className="w-3.5 h-3.5" />
                        {formatDate(workout.date)}
                      </span>
                      {workout.duration_minutes && (
                        <span className="text-[11px] font-mono text-zinc-400 bg-zinc-950 px-2 py-0.5 rounded-md border border-zinc-800">
                          ⏱️ {workout.duration_minutes} min
                        </span>
                      )}
                    </div>
                    <h3 className="font-black text-lg text-white">
                      {workout.title || 'Séance de musculation'}
                    </h3>
                  </div>

                  {/* Badges & Actions */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 font-mono text-xs font-bold">
                      <span className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded-xl">
                        {sessionVolume.toLocaleString('fr-FR')} kg
                      </span>
                      <span className="bg-zinc-950 text-zinc-300 border border-zinc-800 px-2.5 py-1 rounded-xl">
                        {totalSetsCount} séries
                      </span>
                    </div>

                    {/* Actions Menu */}
                    <div className="flex items-center gap-1 ml-2">
                      <button
                        onClick={() => onEditWorkout(workout)}
                        title="Modifier cette séance"
                        className="p-2 rounded-xl text-zinc-400 hover:text-emerald-400 hover:bg-zinc-800 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onDuplicateWorkout(workout)}
                        title="Dupliquer pour aujourd'hui"
                        className="p-2 rounded-xl text-zinc-400 hover:text-cyan-400 hover:bg-zinc-800 transition-colors"
                      >
                        <Copy className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => {
                          if (
                            confirm('Voulez-vous vraiment supprimer cette journée de musculation ?')
                          ) {
                            onDeleteWorkout(workout.id);
                          }
                        }}
                        title="Supprimer la séance"
                        className="p-2 rounded-xl text-zinc-500 hover:text-red-400 hover:bg-zinc-800 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Optional Notes */}
                {workout.notes && (
                  <p className="text-xs text-zinc-300 italic bg-zinc-950/70 border border-zinc-800/80 px-3 py-2 rounded-xl">
                    💬 {workout.notes}
                  </p>
                )}

                {/* Exercises & Sets Detail Grid */}
                <div className="space-y-2.5">
                  {(workout.exercises || []).map((ex, exIdx) => (
                    <div
                      key={ex.id || exIdx}
                      className="bg-zinc-950 p-3 rounded-2xl border border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        <span className="font-bold text-sm text-zinc-100">
                          {ex.name}
                        </span>
                        {ex.muscle_group && (
                          <span className="text-[10px] font-semibold bg-zinc-900 border border-zinc-700 text-zinc-400 px-2 py-0.5 rounded-md">
                            {ex.muscle_group}
                          </span>
                        )}
                      </div>

                      {/* Sets pills */}
                      <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs">
                        {(ex.sets || []).map((s, sIdx) => (
                          <span
                            key={s.id || sIdx}
                            className="bg-zinc-900 border border-zinc-800 text-zinc-200 px-2 py-1 rounded-lg flex items-center gap-1"
                          >
                            <span className="text-emerald-400 font-bold">{s.weight_kg}kg</span>
                            <span className="text-zinc-500">×</span>
                            <span className="text-cyan-400 font-bold">{s.reps}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-16 text-center border border-dashed border-zinc-800 rounded-3xl p-8 bg-zinc-900/40 space-y-3">
            <Dumbbell className="w-10 h-10 text-zinc-600 mx-auto" />
            <h3 className="font-bold text-zinc-300 text-base">Aucune séance trouvée</h3>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto">
              Commencez dès maintenant en enregistrant votre première journée d'entraînement.
            </p>
            <button
              onClick={onAddNewWorkout}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Ajouter une séance</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
