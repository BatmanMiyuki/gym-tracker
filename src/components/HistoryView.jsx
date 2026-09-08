// src/components/HistoryView.jsx
import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  Dumbbell,
  Trophy,
  ChevronDown,
  ChevronUp,
  Play,
  Trash2,
  Sparkles,
  Search,
  Flame,
} from 'lucide-react';
import { formatDateFrench, formatDuration } from '../utils/formatters';

export default function HistoryView({
  workouts = [],
  exercises = [],
  onStartFromPastWorkout,
  onDeleteWorkout,
}) {
  const [expandedId, setExpandedId] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('all');

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  // Filter workouts
  const filteredWorkouts = workouts.filter((w) => {
    const matchesSearch =
      (w.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (w.notes || '').toLowerCase().includes(search.toLowerCase()) ||
      (w.exercises || []).some((e) =>
        (e.exerciseName || '').toLowerCase().includes(search.toLowerCase())
      );

    if (!matchesSearch) return false;
    if (selectedMonth === 'all') return true;

    const wDate = new Date(w.date);
    const mStr = `${wDate.getFullYear()}-${String(wDate.getMonth() + 1).padStart(2, '0')}`;
    return mStr === selectedMonth;
  });

  // Calculate distinct available months for filter
  const months = Array.from(
    new Set(
      workouts.map((w) => {
        const d = new Date(w.date);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      })
    )
  ).sort().reverse();

  // Activity Heatmap Grid (Last 16 weeks)
  const renderHeatmap = () => {
    const workoutDatesSet = new Set(
      workouts.map((w) => new Date(w.date).toISOString().split('T')[0])
    );

    // Generate last 112 days (16 weeks * 7 days)
    const today = new Date('2026-09-08');
    const days = [];
    for (let i = 111; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const iso = d.toISOString().split('T')[0];
      const hasWorkout = workoutDatesSet.has(iso);
      days.push({ date: iso, hasWorkout, dayOfWeek: d.getDay() });
    }

    return (
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 sm:p-5 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-xs text-zinc-200">
              Régularité des entraînements (16 dernières semaines)
            </span>
          </div>
          <span className="text-xs text-emerald-400 font-mono font-bold">
            {workouts.length} séances au total
          </span>
        </div>

        {/* Heatmap Grid */}
        <div className="overflow-x-auto pb-1">
          <div className="inline-grid grid-rows-7 grid-flow-col gap-1.5">
            {days.map((day, idx) => (
              <div
                key={idx}
                title={`${day.date} ${day.hasWorkout ? '• Entraînement effectué' : ''}`}
                className={`w-3 h-3 rounded-[3px] transition-all ${
                  day.hasWorkout
                    ? 'bg-emerald-400 shadow-[0_0_6px_#34d399]'
                    : 'bg-zinc-800/60 hover:bg-zinc-700'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] text-zinc-400 mt-2">
          <span>Avril 2026</span>
          <span>Aujourd'hui (Sept 2026)</span>
        </div>
      </div>
    );
  };

  return (
    <div className="pb-28 max-w-3xl mx-auto px-3 sm:px-4 space-y-4">
      {/* Activity Heatmap */}
      {renderHeatmap()}

      {/* Search & Month Filter */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filtrer les séances passées..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500"
        >
          <option value="all">Tous les mois</option>
          {months.map((m) => {
            const [year, month] = m.split('-');
            const monthName = new Date(Number(year), Number(month) - 1).toLocaleDateString('fr-FR', {
              month: 'long',
              year: 'numeric',
            });
            return (
              <option key={m} value={m}>
                {monthName}
              </option>
            );
          })}
        </select>
      </div>

      {/* Workouts List */}
      <div className="space-y-3">
        {filteredWorkouts.length > 0 ? (
          filteredWorkouts.map((w) => {
            const isExpanded = expandedId === w.id;
            const setsCount = (w.exercises || []).reduce(
              (sum, ex) => sum + (ex.sets || []).filter((s) => s.completed).length,
              0
            );

            return (
              <div
                key={w.id}
                className={`bg-zinc-900/90 border rounded-2xl overflow-hidden transition-all shadow-md ${
                  isExpanded ? 'border-emerald-500/40' : 'border-zinc-800 hover:border-zinc-700'
                }`}
              >
                {/* Workout Card Summary Header */}
                <div
                  onClick={() => toggleExpand(w.id)}
                  className="p-4 cursor-pointer flex items-center justify-between gap-3 hover:bg-zinc-850/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                        <CalendarIcon className="w-3.5 h-3.5" />
                        {formatDateFrench(w.date)}
                      </span>
                      {w.rating && <span className="text-sm">{w.rating}</span>}
                    </div>

                    <h3 className="font-black text-base text-zinc-100 truncate">{w.name}</h3>

                    {/* Meta stats badges */}
                    <div className="flex flex-wrap items-center gap-2 mt-2 text-xs font-mono">
                      <span className="flex items-center gap-1 text-zinc-300 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800">
                        <Clock className="w-3 h-3 text-cyan-400" />
                        {formatDuration(w.durationSeconds)}
                      </span>
                      <span className="text-emerald-400 font-bold bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/20">
                        {(w.totalVolume || 0).toLocaleString('fr-FR')} kg
                      </span>
                      <span className="text-zinc-400 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800">
                        {setsCount} séries
                      </span>
                      {w.prs && w.prs.length > 0 && (
                        <span className="flex items-center gap-1 text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30 text-[11px] font-bold">
                          <Trophy className="w-3 h-3" />
                          {w.prs.length} PR{w.prs.length > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-2 text-zinc-400">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-1 border-t border-zinc-800/80 bg-zinc-950/40 space-y-3">
                    {/* Notes if any */}
                    {w.notes && (
                      <div className="text-xs text-zinc-300 italic bg-zinc-900/80 p-2.5 rounded-xl border border-zinc-800">
                        "{w.notes}"
                      </div>
                    )}

                    {/* Exercises Breakdown */}
                    <div className="space-y-2">
                      {(w.exercises || []).map((ex, exIdx) => (
                        <div
                          key={exIdx}
                          className="p-3 bg-zinc-900 rounded-xl border border-zinc-800 text-xs"
                        >
                          <div className="font-bold text-zinc-200 mb-1.5 flex items-center justify-between">
                            <span>{ex.exerciseName}</span>
                            {ex.notes && <span className="text-[11px] text-zinc-500">{ex.notes}</span>}
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                            {(ex.sets || []).map((s, sIdx) => (
                              <div
                                key={sIdx}
                                className={`px-2 py-1 rounded-lg border font-mono text-[11px] flex items-center justify-between ${
                                  s.completed
                                    ? 'bg-zinc-950 border-zinc-800 text-zinc-200'
                                    : 'bg-zinc-950/40 border-zinc-800/40 text-zinc-500'
                                }`}
                              >
                                <span className="text-zinc-500">#{s.setNumber}</span>
                                <span className="font-bold text-emerald-400">
                                  {s.weight}kg × {s.reps}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => onStartFromPastWorkout(w)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs shadow-md shadow-emerald-500/20"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Refaire cette séance</span>
                      </button>

                      <button
                        onClick={() => {
                          if (confirm('Voulez-vous supprimer cette séance de votre historique ?')) {
                            onDeleteWorkout(w.id);
                          }
                        }}
                        className="px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-red-500/40 text-zinc-400 hover:text-red-400 text-xs"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="py-16 text-center border border-dashed border-zinc-800 rounded-2xl p-6 bg-zinc-900/30">
            <Dumbbell className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
            <p className="text-xs text-zinc-400">Aucune séance trouvée dans l'historique.</p>
          </div>
        )}
      </div>
    </div>
  );
}
