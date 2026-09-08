// src/components/ActiveWorkout.jsx
import React, { useState, useEffect } from 'react';
import {
  Plus,
  Trash2,
  Check,
  MoreVertical,
  Disc,
  Clock,
  Sparkles,
  Trophy,
  X,
  AlertCircle,
  HelpCircle,
  Dumbbell,
  Flame,
  ArrowUpDown,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { storageService } from '../services/storage';
import { calculateWorkoutVolume, calculate1RM } from '../utils/formulas';
import { formatDuration } from '../utils/formatters';
import { sounds } from '../utils/sound';
import ExercisePickerModal from './ExercisePickerModal';
import PlateCalculator from './PlateCalculator';
import RestTimer from './RestTimer';

export default function ActiveWorkout({
  workout,
  onUpdateWorkout,
  onFinishWorkout,
  onCancelWorkout,
  exercises = [],
}) {
  const [showPicker, setShowPicker] = useState(false);
  const [showPlateCalc, setShowPlateCalc] = useState(false);
  const [plateCalcWeight, setPlateCalcWeight] = useState(80);
  const [showRestTimer, setShowRestTimer] = useState(false);
  const [restTimerSeconds, setRestTimerSeconds] = useState(90);
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  // Finish modal review state
  const [workoutRating, setWorkoutRating] = useState('🔥');
  const [sessionNotes, setSessionNotes] = useState(workout.notes || '');

  // Live timer for active workout
  const [elapsedSeconds, setElapsedSeconds] = useState(workout.durationSeconds || 0);

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => {
        const next = prev + 1;
        // Autosave periodically
        if (next % 5 === 0) {
          onUpdateWorkout({ ...workout, durationSeconds: next });
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [workout, onUpdateWorkout]);

  // Handle Set check validation
  const handleToggleSet = (exerciseIndex, setIndex) => {
    const newExList = [...workout.exercises];
    const currentSet = newExList[exerciseIndex].sets[setIndex];
    const wasCompleted = currentSet.completed;

    currentSet.completed = !wasCompleted;

    if (!wasCompleted) {
      // User validated set
      sounds.playSetChecked();

      // Check if new PR
      const exId = newExList[exerciseIndex].exerciseId;
      const weightNum = Number(currentSet.weight) || 0;
      const repsNum = Number(currentSet.reps) || 0;

      if (weightNum > 0 && repsNum > 0 && currentSet.type !== 'warmup') {
        const isPR = storageService.isSetNewPR(exId, weightNum, repsNum);
        if (isPR) {
          sounds.playPRChime();
          currentSet.isPR = true;
          // Add to workout PR list if not present
          const prs = workout.prs || [];
          if (!prs.includes(exId)) {
            workout.prs = [...prs, exId];
          }
        }
      }

      // Auto start rest timer
      const targetRest = newExList[exerciseIndex].defaultRest || 90;
      setRestTimerSeconds(targetRest);
      setShowRestTimer(true);
    }

    onUpdateWorkout({
      ...workout,
      exercises: newExList,
      durationSeconds: elapsedSeconds,
    });
  };

  // Add set to exercise
  const handleAddSet = (exerciseIndex) => {
    const newExList = [...workout.exercises];
    const ex = newExList[exerciseIndex];
    const prevSet = ex.sets[ex.sets.length - 1];

    const newSet = {
      setNumber: ex.sets.length + 1,
      type: 'normal',
      weight: prevSet ? prevSet.weight : 50,
      reps: prevSet ? prevSet.reps : 10,
      rpe: prevSet ? prevSet.rpe : 8,
      completed: false,
    };

    ex.sets.push(newSet);
    onUpdateWorkout({ ...workout, exercises: newExList });
  };

  // Remove set
  const handleRemoveSet = (exerciseIndex, setIndex) => {
    const newExList = [...workout.exercises];
    newExList[exerciseIndex].sets.splice(setIndex, 1);
    // Renumber remaining sets
    newExList[exerciseIndex].sets.forEach((s, idx) => {
      s.setNumber = idx + 1;
    });
    onUpdateWorkout({ ...workout, exercises: newExList });
  };

  // Update set values
  const handleUpdateSet = (exerciseIndex, setIndex, field, value) => {
    const newExList = [...workout.exercises];
    newExList[exerciseIndex].sets[setIndex][field] = value;
    onUpdateWorkout({ ...workout, exercises: newExList });
  };

  // Add new exercise from picker
  const handleAddExerciseFromPicker = (exercise) => {
    const lastPerf = storageService.getLastPerformance(exercise.id);
    const defaultWeight = lastPerf?.sets?.[0]?.weight || 40;
    const defaultReps = lastPerf?.sets?.[0]?.reps || 10;

    const newEx = {
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      category: exercise.category,
      equipment: exercise.equipment,
      defaultRest: exercise.defaultRest || 90,
      notes: '',
      sets: [
        { setNumber: 1, type: 'warmup', weight: Math.round(defaultWeight * 0.5), reps: 10, rpe: 6, completed: false },
        { setNumber: 2, type: 'normal', weight: defaultWeight, reps: defaultReps, rpe: 8, completed: false },
        { setNumber: 3, type: 'normal', weight: defaultWeight, reps: defaultReps, rpe: 8.5, completed: false },
      ],
    };

    const newExList = [...workout.exercises, newEx];
    onUpdateWorkout({ ...workout, exercises: newExList });
    setShowPicker(false);
  };

  // Remove exercise from workout
  const handleRemoveExercise = (exerciseIndex) => {
    const newExList = workout.exercises.filter((_, idx) => idx !== exerciseIndex);
    onUpdateWorkout({ ...workout, exercises: newExList });
  };

  // Open finish celebration modal
  const handlePrepareFinish = () => {
    setShowFinishModal(true);
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#34d399', '#6ee7b7', '#38bdf8', '#fbbf24'],
      });
    } catch (e) {}
  };

  // Confirm complete workout
  const handleConfirmFinish = () => {
    const totalVolume = calculateWorkoutVolume(workout.exercises);
    const finalWorkout = {
      ...workout,
      durationSeconds: elapsedSeconds,
      totalVolume,
      notes: sessionNotes,
      rating: workoutRating,
      date: new Date().toISOString(),
    };
    onFinishWorkout(finalWorkout);
  };

  const totalSetsCount = (workout.exercises || []).reduce(
    (sum, ex) => sum + (ex.sets || []).filter((s) => s.completed).length,
    0
  );
  const currentTotalVolume = calculateWorkoutVolume(workout.exercises);

  return (
    <div className="pb-32 pt-2 max-w-3xl mx-auto px-3 sm:px-4">
      {/* Active Workout Header Bar */}
      <div className="sticky top-14 z-20 bg-zinc-950/95 backdrop-blur-md py-3 border-b border-zinc-800/80 mb-4 flex items-center justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <input
              type="text"
              value={workout.name || 'Séance'}
              onChange={(e) => onUpdateWorkout({ ...workout, name: e.target.value })}
              className="font-black text-lg sm:text-xl text-zinc-100 bg-transparent border-b border-transparent hover:border-zinc-700 focus:border-emerald-500 focus:outline-none truncate w-full"
            />
          </div>
          <div className="flex items-center gap-3 text-xs text-zinc-400 font-mono mt-0.5">
            <span className="flex items-center gap-1 text-emerald-400 font-bold">
              <Clock className="w-3.5 h-3.5" />
              {formatDuration(elapsedSeconds)}
            </span>
            <span>•</span>
            <span>{totalSetsCount} séries faites</span>
            <span>•</span>
            <span>{currentTotalVolume.toLocaleString('fr-FR')} kg soulevés</span>
          </div>
        </div>

        {/* Top Actions */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowCancelConfirm(true)}
            className="px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-red-500/40 text-zinc-400 hover:text-red-400 text-xs font-semibold transition-all"
          >
            Annuler
          </button>
          <button
            onClick={handlePrepareFinish}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-black shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>Terminer</span>
          </button>
        </div>
      </div>

      {/* Exercises List */}
      <div className="space-y-4">
        {workout.exercises && workout.exercises.length > 0 ? (
          workout.exercises.map((ex, exIdx) => {
            const lastPerf = storageService.getLastPerformance(ex.exerciseId);
            const stats = storageService.getExerciseStats(ex.exerciseId);

            return (
              <div
                key={ex.exerciseId + '-' + exIdx}
                className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-3 sm:p-4 shadow-xl transition-all"
              >
                {/* Exercise Header */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h3 className="font-black text-base text-zinc-100 flex items-center gap-2">
                      <span>{ex.exerciseName}</span>
                      {stats.bestWeight > 0 && (
                        <span className="text-[10px] bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded font-normal">
                          PR: {stats.bestWeight}kg
                        </span>
                      )}
                    </h3>
                    {lastPerf && lastPerf.sets && lastPerf.sets.length > 0 && (
                      <p className="text-[11px] text-zinc-400 mt-0.5">
                        Dernière séance :{' '}
                        <span className="text-emerald-400/90 font-medium">
                          {lastPerf.sets.map((s) => `${s.weight}kg×${s.reps}`).join(', ')}
                        </span>
                      </p>
                    )}
                  </div>

                  {/* Exercise Actions */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        const targetW = ex.sets[0]?.weight || 60;
                        setPlateCalcWeight(Number(targetW));
                        setShowPlateCalc(true);
                      }}
                      title="Calculer les disques"
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-cyan-400 hover:bg-zinc-800"
                    >
                      <Disc className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleRemoveExercise(exIdx)}
                      title="Supprimer l'exercice"
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-zinc-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Optional Exercise Notes */}
                <input
                  type="text"
                  placeholder="Notes sur l'exercice (siège, tempo, ressenti...)"
                  value={ex.notes || ''}
                  onChange={(e) => {
                    const newExList = [...workout.exercises];
                    newExList[exIdx].notes = e.target.value;
                    onUpdateWorkout({ ...workout, exercises: newExList });
                  }}
                  className="w-full bg-zinc-950/60 border border-zinc-800/80 rounded-lg px-2.5 py-1 text-xs text-zinc-300 placeholder-zinc-500 mb-3 focus:outline-none focus:border-zinc-700"
                />

                {/* Sets Table */}
                <div className="space-y-1.5">
                  <div className="grid grid-cols-12 gap-1.5 text-[10px] font-bold text-zinc-400 uppercase tracking-wider px-2 py-1">
                    <span className="col-span-1 text-center">#</span>
                    <span className="col-span-3">Type</span>
                    <span className="col-span-3 text-center">Poids (kg)</span>
                    <span className="col-span-3 text-center">Reps</span>
                    <span className="col-span-2 text-center">Valider</span>
                  </div>

                  {ex.sets.map((set, setIdx) => {
                    const is1RM = calculate1RM(Number(set.weight), Number(set.reps));

                    return (
                      <div
                        key={setIdx}
                        className={`grid grid-cols-12 gap-1.5 items-center p-1.5 rounded-xl border transition-all ${
                          set.completed
                            ? 'bg-emerald-950/20 border-emerald-500/40 text-zinc-100'
                            : 'bg-zinc-950/70 border-zinc-800/80 text-zinc-300'
                        }`}
                      >
                        {/* Set Number */}
                        <div className="col-span-1 text-center font-mono font-bold text-xs text-zinc-400">
                          {set.setNumber}
                        </div>

                        {/* Set Type Selector */}
                        <div className="col-span-3">
                          <select
                            value={set.type}
                            onChange={(e) =>
                              handleUpdateSet(exIdx, setIdx, 'type', e.target.value)
                            }
                            className={`w-full text-[11px] font-semibold rounded-lg px-1.5 py-1.5 border focus:outline-none bg-zinc-900 ${
                              set.type === 'warmup'
                                ? 'text-amber-400 border-amber-500/30'
                                : set.type === 'dropset'
                                ? 'text-purple-400 border-purple-500/30'
                                : set.type === 'failure'
                                ? 'text-red-400 border-red-500/30'
                                : 'text-zinc-300 border-zinc-700'
                            }`}
                          >
                            <option value="normal">Normal</option>
                            <option value="warmup">Échauff.</option>
                            <option value="dropset">Drop Set</option>
                            <option value="failure">À l'échec</option>
                          </select>
                        </div>

                        {/* Weight Input */}
                        <div className="col-span-3">
                          <div className="flex items-center bg-zinc-900 border border-zinc-700/80 rounded-lg px-2 py-1">
                            <input
                              type="number"
                              step="0.5"
                              value={set.weight !== undefined ? set.weight : ''}
                              onChange={(e) =>
                                handleUpdateSet(exIdx, setIdx, 'weight', e.target.value)
                              }
                              className="w-full bg-transparent font-black text-xs text-center text-zinc-100 focus:outline-none"
                            />
                          </div>
                        </div>

                        {/* Reps Input */}
                        <div className="col-span-3">
                          <div className="flex items-center bg-zinc-900 border border-zinc-700/80 rounded-lg px-2 py-1">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={set.reps !== undefined ? set.reps : ''}
                              onChange={(e) =>
                                handleUpdateSet(exIdx, setIdx, 'reps', e.target.value)
                              }
                              className="w-full bg-transparent font-black text-xs text-center text-zinc-100 focus:outline-none"
                            />
                          </div>
                        </div>

                        {/* Validation Checkmark Button */}
                        <div className="col-span-2 flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleToggleSet(exIdx, setIdx)}
                            className={`w-8 h-8 rounded-lg flex items-center justify-center font-black transition-all active:scale-90 ${
                              set.completed
                                ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/30'
                                : 'bg-zinc-800 text-zinc-400 hover:text-emerald-400 hover:bg-zinc-700'
                            }`}
                          >
                            <Check className="w-4 h-4 stroke-[3]" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Add Set Button */}
                <div className="flex items-center justify-between mt-3 pt-2 border-t border-zinc-800/60">
                  <button
                    onClick={() => handleAddSet(exIdx)}
                    className="flex items-center gap-1 text-xs font-bold text-emerald-400 hover:text-emerald-300 py-1 px-2 rounded-lg hover:bg-emerald-500/10 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Ajouter une série</span>
                  </button>

                  <div className="flex items-center gap-2 text-[11px] text-zinc-400 font-mono">
                    <span>Repos conseillé : {ex.defaultRest || 90}s</span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-16 text-center border-2 border-dashed border-zinc-800 rounded-2xl p-6 bg-zinc-900/40">
            <Dumbbell className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
            <h3 className="font-bold text-zinc-300 text-base mb-1">Séance vide</h3>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto mb-4">
              Commencez par ajouter les exercices que vous souhaitez effectuer aujourd'hui.
            </p>
            <button
              onClick={() => setShowPicker(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs shadow-lg shadow-emerald-500/20"
            >
              <Plus className="w-4 h-4" />
              <span>Ajouter un premier exercice</span>
            </button>
          </div>
        )}
      </div>

      {/* Bottom Sticky Action: Add Exercise Button */}
      <div className="mt-4 flex gap-2">
        <button
          onClick={() => setShowPicker(true)}
          className="flex-1 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-850 border border-emerald-500/30 hover:border-emerald-500 text-emerald-400 font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter un exercice</span>
        </button>

        <button
          onClick={() => setShowRestTimer(true)}
          className="px-4 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 font-semibold text-xs flex items-center gap-2"
        >
          <Clock className="w-4 h-4 text-cyan-400" />
          <span>Chrono repos</span>
        </button>
      </div>

      {/* Rest Timer Overlay */}
      {showRestTimer && (
        <RestTimer
          initialSeconds={restTimerSeconds}
          onClose={() => setShowRestTimer(false)}
          soundEnabled={true}
        />
      )}

      {/* Plate Calculator Modal */}
      {showPlateCalc && (
        <PlateCalculator
          initialWeight={plateCalcWeight}
          onClose={() => setShowPlateCalc(false)}
        />
      )}

      {/* Exercise Picker Modal */}
      {showPicker && (
        <ExercisePickerModal
          exercises={exercises}
          onSelectExercise={handleAddExerciseFromPicker}
          onClose={() => setShowPicker(false)}
          alreadySelectedIds={(workout.exercises || []).map((e) => e.exerciseId)}
        />
      )}

      {/* Cancel Confirmation Modal */}
      {showCancelConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base text-zinc-100 mb-1">Annuler la séance ?</h3>
              <p className="text-xs text-zinc-400">
                La séance en cours ne sera pas enregistrée dans votre historique.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="flex-1 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold"
              >
                Continuer la séance
              </button>
              <button
                onClick={() => {
                  setShowCancelConfirm(false);
                  onCancelWorkout();
                }}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold"
              >
                Oui, supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Finish Workout Summary & Celebration Modal */}
      {showFinishModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-5 sm:p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            {/* Celebration Header */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-black mb-3 shadow-lg shadow-emerald-500/30">
                <Trophy className="w-8 h-8" />
              </div>
              <h2 className="font-black text-2xl text-zinc-100">Séance terminée ! 🔥</h2>
              <p className="text-xs text-zinc-400 mt-1">Excellent travail, vous progressez !</p>
            </div>

            {/* Workout KPI Summary Cards */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800">
                <span className="text-[10px] uppercase font-bold text-zinc-400 block mb-1">
                  Durée
                </span>
                <span className="font-black text-sm text-zinc-100">
                  {formatDuration(elapsedSeconds)}
                </span>
              </div>

              <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800">
                <span className="text-[10px] uppercase font-bold text-zinc-400 block mb-1">
                  Volume Total
                </span>
                <span className="font-black text-sm text-emerald-400">
                  {currentTotalVolume.toLocaleString('fr-FR')} kg
                </span>
              </div>

              <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800">
                <span className="text-[10px] uppercase font-bold text-zinc-400 block mb-1">
                  Séries
                </span>
                <span className="font-black text-sm text-cyan-400">{totalSetsCount}</span>
              </div>
            </div>

            {/* PRs Celebrations */}
            {workout.prs && workout.prs.length > 0 && (
              <div className="bg-emerald-950/30 border border-emerald-500/40 p-3.5 rounded-xl">
                <div className="flex items-center gap-1.5 text-xs font-black text-emerald-400 uppercase tracking-wider mb-1">
                  <Sparkles className="w-4 h-4 fill-current" />
                  <span>Nouveaux Records Battus (PR) !</span>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {workout.prs.map((prId) => {
                    const exObj = exercises.find((e) => e.id === prId);
                    return (
                      <span
                        key={prId}
                        className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1"
                      >
                        🏆 {exObj ? exObj.name : prId}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Workout Feeling Rating */}
            <div>
              <label className="text-xs font-bold text-zinc-300 block mb-2">
                Ressenti de la séance :
              </label>
              <div className="flex justify-between gap-2">
                {[
                  { emoji: '⚡', label: 'Facile' },
                  { emoji: '💪', label: 'Bon' },
                  { emoji: '🔥', label: 'Intense' },
                  { emoji: '💀', label: 'Extrême' },
                ].map((item) => (
                  <button
                    key={item.emoji}
                    type="button"
                    onClick={() => setWorkoutRating(item.emoji)}
                    className={`flex-1 py-2 rounded-xl flex flex-col items-center gap-1 border transition-all ${
                      workoutRating === item.emoji
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <span className="text-xl">{item.emoji}</span>
                    <span className="text-[10px] font-bold">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Session Notes */}
            <div>
              <label className="text-xs font-bold text-zinc-300 block mb-1.5">
                Notes & sensations :
              </label>
              <textarea
                rows="2"
                placeholder="Ex: Super énergie sur le couché, bonne congestion..."
                value={sessionNotes}
                onChange={(e) => setSessionNotes(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Final Action Buttons */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowFinishModal(false)}
                className="flex-1 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-xs"
              >
                Modifier la séance
              </button>
              <button
                onClick={handleConfirmFinish}
                className="flex-1 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs shadow-lg shadow-emerald-500/30"
              >
                Enregistrer l'entraînement
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
