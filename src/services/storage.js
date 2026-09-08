// src/services/storage.js
import { INITIAL_EXERCISES } from '../data/exercises';
import { DEFAULT_TEMPLATES } from '../data/defaultTemplates';
import { DEMO_HISTORY, DEMO_BODY_STATS } from '../data/demoHistory';
import { calculate1RM } from '../utils/formulas';

const STORAGE_KEYS = {
  WORKOUTS: 'forge_workouts_v1',
  TEMPLATES: 'forge_templates_v1',
  EXERCISES: 'forge_exercises_v1',
  ACTIVE_WORKOUT: 'forge_active_workout_v1',
  BODY_STATS: 'forge_body_stats_v1',
  SETTINGS: 'forge_settings_v1',
};

const DEFAULT_SETTINGS = {
  soundEnabled: true,
  weightUnit: 'kg',
  defaultRest: 90,
  autoStartTimer: true,
  vibrate: true,
  viewMode: 'full', // 'full' or 'mobile-frame'
};

export const storageService = {
  // --- SETTINGS ---
  getSettings() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
    } catch (e) {
      return DEFAULT_SETTINGS;
    }
  },

  saveSettings(settings) {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Error saving settings', e);
    }
  },

  // --- EXERCISES ---
  getExercises() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.EXERCISES);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.EXERCISES, JSON.stringify(INITIAL_EXERCISES));
        return INITIAL_EXERCISES;
      }
      return JSON.parse(data);
    } catch (e) {
      return INITIAL_EXERCISES;
    }
  },

  saveExercises(exercises) {
    try {
      localStorage.setItem(STORAGE_KEYS.EXERCISES, JSON.stringify(exercises));
    } catch (e) {
      console.error('Error saving exercises', e);
    }
  },

  addExercise(exercise) {
    const list = this.getExercises();
    const newEx = {
      ...exercise,
      id: exercise.id || `custom-${Date.now()}`,
    };
    list.push(newEx);
    this.saveExercises(list);
    return newEx;
  },

  // --- TEMPLATES ---
  getTemplates() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TEMPLATES);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(DEFAULT_TEMPLATES));
        return DEFAULT_TEMPLATES;
      }
      return JSON.parse(data);
    } catch (e) {
      return DEFAULT_TEMPLATES;
    }
  },

  saveTemplates(templates) {
    try {
      localStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(templates));
    } catch (e) {
      console.error('Error saving templates', e);
    }
  },

  addTemplate(template) {
    const list = this.getTemplates();
    const newTpl = {
      ...template,
      id: template.id || `tpl-${Date.now()}`,
    };
    list.unshift(newTpl);
    this.saveTemplates(list);
    return newTpl;
  },

  updateTemplate(updated) {
    const list = this.getTemplates().map((t) => (t.id === updated.id ? updated : t));
    this.saveTemplates(list);
  },

  deleteTemplate(id) {
    const list = this.getTemplates().filter((t) => t.id !== id);
    this.saveTemplates(list);
  },

  // --- WORKOUT HISTORY ---
  getWorkouts() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.WORKOUTS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.WORKOUTS, JSON.stringify(DEMO_HISTORY));
        return DEMO_HISTORY;
      }
      return JSON.parse(data);
    } catch (e) {
      return DEMO_HISTORY;
    }
  },

  saveWorkouts(workouts) {
    try {
      localStorage.setItem(STORAGE_KEYS.WORKOUTS, JSON.stringify(workouts));
    } catch (e) {
      console.error('Error saving workouts', e);
    }
  },

  addWorkout(workout) {
    const list = this.getWorkouts();
    const newW = {
      ...workout,
      id: workout.id || `workout-${Date.now()}`,
      date: workout.date || new Date().toISOString(),
    };
    list.unshift(newW);
    this.saveWorkouts(list);
    this.clearActiveWorkout();
    return newW;
  },

  deleteWorkout(id) {
    const list = this.getWorkouts().filter((w) => w.id !== id);
    this.saveWorkouts(list);
  },

  // --- ACTIVE WORKOUT IN PROGRESS ---
  getActiveWorkout() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ACTIVE_WORKOUT);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  },

  saveActiveWorkout(active) {
    try {
      if (!active) {
        localStorage.removeItem(STORAGE_KEYS.ACTIVE_WORKOUT);
      } else {
        localStorage.setItem(STORAGE_KEYS.ACTIVE_WORKOUT, JSON.stringify(active));
      }
    } catch (e) {
      console.error('Error saving active workout', e);
    }
  },

  clearActiveWorkout() {
    try {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_WORKOUT);
    } catch (e) {}
  },

  // --- BODY STATS ---
  getBodyStats() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BODY_STATS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.BODY_STATS, JSON.stringify(DEMO_BODY_STATS));
        return DEMO_BODY_STATS;
      }
      return JSON.parse(data);
    } catch (e) {
      return DEMO_BODY_STATS;
    }
  },

  saveBodyStats(stats) {
    try {
      localStorage.setItem(STORAGE_KEYS.BODY_STATS, JSON.stringify(stats));
    } catch (e) {
      console.error('Error saving body stats', e);
    }
  },

  addBodyStat(stat) {
    const list = this.getBodyStats();
    list.push({ ...stat, date: stat.date || new Date().toISOString().split('T')[0] });
    list.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    this.saveBodyStats(list);
    return list;
  },

  // --- PR (PERSONAL RECORDS) ENGINE ---
  getExerciseHistory(exerciseId) {
    const workouts = this.getWorkouts();
    const historyEntries = [];

    // Order from oldest to newest
    const sorted = [...workouts].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    sorted.forEach((w) => {
      const ex = (w.exercises || []).find((e) => e.exerciseId === exerciseId);
      if (ex && ex.sets && ex.sets.length > 0) {
        const completedSets = ex.sets.filter((s) => s.completed && Number(s.weight) > 0);
        if (completedSets.length > 0) {
          const maxWeight = Math.max(...completedSets.map((s) => Number(s.weight)));
          const max1RM = Math.max(...completedSets.map((s) => calculate1RM(Number(s.weight), Number(s.reps))));
          const totalVolume = completedSets.reduce((sum, s) => sum + Number(s.weight) * Number(s.reps), 0);
          
          historyEntries.push({
            workoutId: w.id,
            date: w.date,
            workoutName: w.name,
            sets: completedSets,
            maxWeight,
            max1RM,
            totalVolume,
          });
        }
      }
    });

    return historyEntries;
  },

  getExerciseStats(exerciseId) {
    const entries = this.getExerciseHistory(exerciseId);
    if (entries.length === 0) {
      return {
        bestWeight: 0,
        best1RM: 0,
        totalSets: 0,
        totalReps: 0,
        totalVolume: 0,
        history: [],
      };
    }

    let bestWeight = 0;
    let best1RM = 0;
    let totalSets = 0;
    let totalReps = 0;
    let totalVolume = 0;

    entries.forEach((entry) => {
      if (entry.maxWeight > bestWeight) bestWeight = entry.maxWeight;
      if (entry.max1RM > best1RM) best1RM = entry.max1RM;
      totalVolume += entry.totalVolume;
      entry.sets.forEach((s) => {
        totalSets++;
        totalReps += Number(s.reps || 0);
      });
    });

    return {
      bestWeight,
      best1RM,
      totalSets,
      totalReps,
      totalVolume,
      history: entries,
    };
  },

  getLastPerformance(exerciseId) {
    const workouts = this.getWorkouts();
    for (const w of workouts) {
      const ex = (w.exercises || []).find((e) => e.exerciseId === exerciseId);
      if (ex && ex.sets && ex.sets.some((s) => s.completed)) {
        return {
          date: w.date,
          sets: ex.sets.filter((s) => s.completed),
        };
      }
    }
    return null;
  },

  // Check if a new set is a PR
  isSetNewPR(exerciseId, weight, reps) {
    if (!weight || !reps || weight <= 0 || reps <= 0) return false;
    const stats = this.getExerciseStats(exerciseId);
    if (!stats || stats.history.length === 0) return false; // Initial baseline
    const current1RM = calculate1RM(weight, reps);
    return current1RM > stats.best1RM || weight > stats.bestWeight;
  },

  // --- EXPORT & IMPORT ---
  exportAllData() {
    const data = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      workouts: this.getWorkouts(),
      templates: this.getTemplates(),
      exercises: this.getExercises(),
      bodyStats: this.getBodyStats(),
      settings: this.getSettings(),
    };
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `forge-muscu-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  },

  importData(jsonData) {
    try {
      if (jsonData.workouts && Array.isArray(jsonData.workouts)) {
        this.saveWorkouts(jsonData.workouts);
      }
      if (jsonData.templates && Array.isArray(jsonData.templates)) {
        this.saveTemplates(jsonData.templates);
      }
      if (jsonData.exercises && Array.isArray(jsonData.exercises)) {
        this.saveExercises(jsonData.exercises);
      }
      if (jsonData.bodyStats && Array.isArray(jsonData.bodyStats)) {
        this.saveBodyStats(jsonData.bodyStats);
      }
      if (jsonData.settings) {
        this.saveSettings(jsonData.settings);
      }
      return true;
    } catch (e) {
      console.error('Import failed', e);
      return false;
    }
  },

  resetToDemo() {
    localStorage.removeItem(STORAGE_KEYS.WORKOUTS);
    localStorage.removeItem(STORAGE_KEYS.TEMPLATES);
    localStorage.removeItem(STORAGE_KEYS.EXERCISES);
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_WORKOUT);
    localStorage.removeItem(STORAGE_KEYS.BODY_STATS);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    window.location.reload();
  },

  clearAllData() {
    this.saveWorkouts([]);
    this.saveBodyStats([]);
    this.clearActiveWorkout();
    window.location.reload();
  },
};
