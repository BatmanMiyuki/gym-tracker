// server/db.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'gym_database.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial realistic workout history starting from April 2026
const INITIAL_WORKOUTS = [
  {
    id: 'w-2026-04-06',
    date: '2026-04-06',
    title: 'Pectoraux & Triceps',
    notes: 'Première séance enregistrée début avril. Bonnes sensations.',
    duration_minutes: 55,
    exercises: [
      {
        id: 'ex-1',
        name: 'Développé couché',
        muscle_group: 'Pectoraux',
        sets: [
          { id: 's1', set_number: 1, weight_kg: 50, reps: 12 },
          { id: 's2', set_number: 2, weight_kg: 65, reps: 10 },
          { id: 's3', set_number: 3, weight_kg: 70, reps: 8 },
          { id: 's4', set_number: 4, weight_kg: 70, reps: 6 }
        ]
      },
      {
        id: 'ex-2',
        name: 'Développé incliné haltères',
        muscle_group: 'Pectoraux',
        sets: [
          { id: 's5', set_number: 1, weight_kg: 20, reps: 10 },
          { id: 's6', set_number: 2, weight_kg: 22, reps: 10 },
          { id: 's7', set_number: 3, weight_kg: 22, reps: 8 }
        ]
      },
      {
        id: 'ex-3',
        name: 'Extension triceps poulie',
        muscle_group: 'Triceps',
        sets: [
          { id: 's8', set_number: 1, weight_kg: 20, reps: 12 },
          { id: 's9', set_number: 2, weight_kg: 22.5, reps: 10 },
          { id: 's10', set_number: 3, weight_kg: 25, reps: 10 }
        ]
      }
    ]
  },
  {
    id: 'w-2026-04-08',
    date: '2026-04-08',
    title: 'Dos & Biceps',
    notes: 'Tirage lourd et bonne congestion.',
    duration_minutes: 60,
    exercises: [
      {
        id: 'ex-4',
        name: 'Soulevé de terre (Deadlift)',
        muscle_group: 'Dos',
        sets: [
          { id: 's11', set_number: 1, weight_kg: 70, reps: 8 },
          { id: 's12', set_number: 2, weight_kg: 100, reps: 6 },
          { id: 's13', set_number: 3, weight_kg: 110, reps: 5 }
        ]
      },
      {
        id: 'ex-5',
        name: 'Tirage vertical poitrine',
        muscle_group: 'Dos',
        sets: [
          { id: 's14', set_number: 1, weight_kg: 50, reps: 10 },
          { id: 's15', set_number: 2, weight_kg: 55, reps: 10 },
          { id: 's16', set_number: 3, weight_kg: 60, reps: 8 }
        ]
      },
      {
        id: 'ex-6',
        name: 'Curl barre EZ',
        muscle_group: 'Biceps',
        sets: [
          { id: 's17', set_number: 1, weight_kg: 25, reps: 10 },
          { id: 's18', set_number: 2, weight_kg: 27.5, reps: 8 },
          { id: 's19', set_number: 3, weight_kg: 30, reps: 8 }
        ]
      }
    ]
  },
  {
    id: 'w-2026-04-11',
    date: '2026-04-11',
    title: 'Jambes & Épaules',
    notes: 'Squat profond, bonne séance.',
    duration_minutes: 65,
    exercises: [
      {
        id: 'ex-7',
        name: 'Squat barre',
        muscle_group: 'Jambes',
        sets: [
          { id: 's20', set_number: 1, weight_kg: 60, reps: 10 },
          { id: 's21', set_number: 2, weight_kg: 80, reps: 8 },
          { id: 's22', set_number: 3, weight_kg: 85, reps: 6 },
          { id: 's23', set_number: 4, weight_kg: 85, reps: 6 }
        ]
      },
      {
        id: 'ex-8',
        name: 'Développé militaire',
        muscle_group: 'Épaules',
        sets: [
          { id: 's24', set_number: 1, weight_kg: 35, reps: 10 },
          { id: 's25', set_number: 2, weight_kg: 40, reps: 8 },
          { id: 's26', set_number: 3, weight_kg: 42.5, reps: 6 }
        ]
      },
      {
        id: 'ex-9',
        name: 'Élévations latérales',
        muscle_group: 'Épaules',
        sets: [
          { id: 's27', set_number: 1, weight_kg: 8, reps: 15 },
          { id: 's28', set_number: 2, weight_kg: 8, reps: 14 },
          { id: 's29', set_number: 3, weight_kg: 8, reps: 12 }
        ]
      }
    ]
  },
  {
    id: 'w-2026-05-05',
    date: '2026-05-05',
    title: 'Pectoraux & Triceps',
    notes: 'Progression sur le couché : 75 kg validé !',
    duration_minutes: 55,
    exercises: [
      {
        id: 'ex-10',
        name: 'Développé couché',
        muscle_group: 'Pectoraux',
        sets: [
          { id: 's30', set_number: 1, weight_kg: 60, reps: 10 },
          { id: 's31', set_number: 2, weight_kg: 70, reps: 8 },
          { id: 's32', set_number: 3, weight_kg: 75, reps: 7 },
          { id: 's33', set_number: 4, weight_kg: 75, reps: 6 }
        ]
      },
      {
        id: 'ex-11',
        name: 'Développé incliné haltères',
        muscle_group: 'Pectoraux',
        sets: [
          { id: 's34', set_number: 1, weight_kg: 24, reps: 10 },
          { id: 's35', set_number: 2, weight_kg: 24, reps: 8 },
          { id: 's36', set_number: 3, weight_kg: 26, reps: 8 }
        ]
      },
      {
        id: 'ex-12',
        name: 'Extension triceps poulie',
        muscle_group: 'Triceps',
        sets: [
          { id: 's37', set_number: 1, weight_kg: 22.5, reps: 12 },
          { id: 's38', set_number: 2, weight_kg: 25, reps: 10 },
          { id: 's39', set_number: 3, weight_kg: 27.5, reps: 8 }
        ]
      }
    ]
  },
  {
    id: 'w-2026-06-08',
    date: '2026-06-08',
    title: 'Dos & Biceps Focus',
    notes: 'Deadlift à 120kg propre.',
    duration_minutes: 60,
    exercises: [
      {
        id: 'ex-13',
        name: 'Soulevé de terre (Deadlift)',
        muscle_group: 'Dos',
        sets: [
          { id: 's40', set_number: 1, weight_kg: 80, reps: 6 },
          { id: 's41', set_number: 2, weight_kg: 110, reps: 5 },
          { id: 's42', set_number: 3, weight_kg: 120, reps: 5 }
        ]
      },
      {
        id: 'ex-14',
        name: 'Rowing barre',
        muscle_group: 'Dos',
        sets: [
          { id: 's43', set_number: 1, weight_kg: 60, reps: 10 },
          { id: 's44', set_number: 2, weight_kg: 65, reps: 8 },
          { id: 's45', set_number: 3, weight_kg: 65, reps: 8 }
        ]
      },
      {
        id: 'ex-15',
        name: 'Curl barre EZ',
        muscle_group: 'Biceps',
        sets: [
          { id: 's46', set_number: 1, weight_kg: 27.5, reps: 10 },
          { id: 's47', set_number: 2, weight_kg: 30, reps: 8 },
          { id: 's48', set_number: 3, weight_kg: 32.5, reps: 7 }
        ]
      }
    ]
  },
  {
    id: 'w-2026-07-10',
    date: '2026-07-10',
    title: 'Séance Jambes Lourde',
    notes: 'Squat à 95 kg x 6 reps !',
    duration_minutes: 65,
    exercises: [
      {
        id: 'ex-16',
        name: 'Squat barre',
        muscle_group: 'Jambes',
        sets: [
          { id: 's49', set_number: 1, weight_kg: 70, reps: 8 },
          { id: 's50', set_number: 2, weight_kg: 90, reps: 6 },
          { id: 's51', set_number: 3, weight_kg: 95, reps: 6 },
          { id: 's52', set_number: 4, weight_kg: 95, reps: 5 }
        ]
      },
      {
        id: 'ex-17',
        name: 'Presse à cuisses',
        muscle_group: 'Jambes',
        sets: [
          { id: 's53', set_number: 1, weight_kg: 160, reps: 12 },
          { id: 's54', set_number: 2, weight_kg: 180, reps: 10 },
          { id: 's55', set_number: 3, weight_kg: 200, reps: 8 }
        ]
      }
    ]
  },
  {
    id: 'w-2026-08-12',
    date: '2026-08-12',
    title: 'Pectoraux & Bras',
    notes: 'Développé couché à 85 kg passé ! Nouveau palier.',
    duration_minutes: 60,
    exercises: [
      {
        id: 'ex-18',
        name: 'Développé couché',
        muscle_group: 'Pectoraux',
        sets: [
          { id: 's56', set_number: 1, weight_kg: 60, reps: 10 },
          { id: 's57', set_number: 2, weight_kg: 75, reps: 8 },
          { id: 's58', set_number: 3, weight_kg: 85, reps: 5 },
          { id: 's59', set_number: 4, weight_kg: 85, reps: 5 }
        ]
      },
      {
        id: 'ex-19',
        name: 'Développé incliné haltères',
        muscle_group: 'Pectoraux',
        sets: [
          { id: 's60', set_number: 1, weight_kg: 26, reps: 8 },
          { id: 's61', set_number: 2, weight_kg: 28, reps: 8 },
          { id: 's62', set_number: 3, weight_kg: 28, reps: 7 }
        ]
      },
      {
        id: 'ex-20',
        name: 'Curl marteau',
        muscle_group: 'Biceps',
        sets: [
          { id: 's63', set_number: 1, weight_kg: 14, reps: 12 },
          { id: 's64', set_number: 2, weight_kg: 16, reps: 10 },
          { id: 's65', set_number: 3, weight_kg: 16, reps: 10 }
        ]
      }
    ]
  },
  {
    id: 'w-2026-08-28',
    date: '2026-08-28',
    title: 'Jambes & Force',
    notes: 'Squat à 105 kg x 5 reps ! Le cap des 100 kg est passé.',
    duration_minutes: 60,
    exercises: [
      {
        id: 'ex-21',
        name: 'Squat barre',
        muscle_group: 'Jambes',
        sets: [
          { id: 's66', set_number: 1, weight_kg: 70, reps: 8 },
          { id: 's67', set_number: 2, weight_kg: 95, reps: 6 },
          { id: 's68', set_number: 3, weight_kg: 105, reps: 5 },
          { id: 's69', set_number: 4, weight_kg: 105, reps: 4 }
        ]
      },
      {
        id: 'ex-22',
        name: 'Soulevé de terre roumain (RDL)',
        muscle_group: 'Jambes',
        sets: [
          { id: 's70', set_number: 1, weight_kg: 80, reps: 10 },
          { id: 's71', set_number: 2, weight_kg: 95, reps: 8 },
          { id: 's72', set_number: 3, weight_kg: 100, reps: 8 }
        ]
      }
    ]
  },
  {
    id: 'w-2026-09-04',
    date: '2026-09-04',
    title: 'Dos & Tirage Lourd',
    notes: 'Deadlift 135 kg x 4 reps. Énorme sensation de puissance.',
    duration_minutes: 60,
    exercises: [
      {
        id: 'ex-23',
        name: 'Soulevé de terre (Deadlift)',
        muscle_group: 'Dos',
        sets: [
          { id: 's73', set_number: 1, weight_kg: 80, reps: 6 },
          { id: 's74', set_number: 2, weight_kg: 120, reps: 5 },
          { id: 's75', set_number: 3, weight_kg: 135, reps: 4 }
        ]
      },
      {
        id: 'ex-24',
        name: 'Tirage vertical poitrine',
        muscle_group: 'Dos',
        sets: [
          { id: 's76', set_number: 1, weight_kg: 65, reps: 10 },
          { id: 's77', set_number: 2, weight_kg: 70, reps: 8 },
          { id: 's78', set_number: 3, weight_kg: 75, reps: 8 }
        ]
      },
      {
        id: 'ex-25',
        name: 'Curl barre EZ',
        muscle_group: 'Biceps',
        sets: [
          { id: 's79', set_number: 1, weight_kg: 30, reps: 10 },
          { id: 's80', set_number: 2, weight_kg: 35, reps: 8 },
          { id: 's81', set_number: 3, weight_kg: 35, reps: 7 }
        ]
      }
    ]
  }
];

class Database {
  constructor() {
    this.init();
  }

  init() {
    if (!fs.existsSync(DB_FILE)) {
      this.writeWorkouts(INITIAL_WORKOUTS);
    }
  }

  readWorkouts() {
    try {
      if (!fs.existsSync(DB_FILE)) {
        this.writeWorkouts(INITIAL_WORKOUTS);
        return INITIAL_WORKOUTS;
      }
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(raw);
    } catch (e) {
      console.error('Error reading database file:', e);
      return [];
    }
  }

  writeWorkouts(data) {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
      return true;
    } catch (e) {
      console.error('Error writing database file:', e);
      return false;
    }
  }

  getAllWorkouts() {
    const list = this.readWorkouts();
    // Sort by date descending (newest first)
    return list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  getWorkoutById(id) {
    const list = this.readWorkouts();
    return list.find((w) => w.id === id) || null;
  }

  createWorkout(workoutData) {
    const list = this.readWorkouts();
    const newWorkout = {
      id: `w-${Date.now()}`,
      date: workoutData.date || new Date().toISOString().split('T')[0],
      title: workoutData.title || 'Séance de musculation',
      notes: workoutData.notes || '',
      duration_minutes: Number(workoutData.duration_minutes) || 60,
      exercises: (workoutData.exercises || []).map((ex, exIdx) => ({
        id: ex.id || `ex-${Date.now()}-${exIdx}`,
        name: ex.name || 'Exercice',
        muscle_group: ex.muscle_group || 'Autre',
        sets: (ex.sets || []).map((s, sIdx) => ({
          id: s.id || `s-${Date.now()}-${exIdx}-${sIdx}`,
          set_number: s.set_number || sIdx + 1,
          weight_kg: Number(s.weight_kg) || 0,
          reps: Number(s.reps) || 0
        }))
      }))
    };

    list.unshift(newWorkout);
    this.writeWorkouts(list);
    return newWorkout;
  }

  updateWorkout(id, workoutData) {
    const list = this.readWorkouts();
    const index = list.findIndex((w) => w.id === id);
    if (index === -1) return null;

    const updated = {
      ...list[index],
      ...workoutData,
      id, // ensure ID is preserved
      exercises: (workoutData.exercises || []).map((ex, exIdx) => ({
        id: ex.id || `ex-${Date.now()}-${exIdx}`,
        name: ex.name || 'Exercice',
        muscle_group: ex.muscle_group || 'Autre',
        sets: (ex.sets || []).map((s, sIdx) => ({
          id: s.id || `s-${Date.now()}-${exIdx}-${sIdx}`,
          set_number: s.set_number || sIdx + 1,
          weight_kg: Number(s.weight_kg) || 0,
          reps: Number(s.reps) || 0
        }))
      }))
    };

    list[index] = updated;
    this.writeWorkouts(list);
    return updated;
  }

  deleteWorkout(id) {
    const list = this.readWorkouts();
    const filtered = list.filter((w) => w.id !== id);
    if (filtered.length === list.length) return false;
    this.writeWorkouts(filtered);
    return true;
  }

  resetToDemo() {
    this.writeWorkouts(INITIAL_WORKOUTS);
    return INITIAL_WORKOUTS;
  }

  clearAll() {
    this.writeWorkouts([]);
    return [];
  }

  // Aggregate stats computation
  getStats() {
    const workouts = this.getAllWorkouts();

    let totalVolumeKg = 0;
    let totalSets = 0;
    let totalReps = 0;
    const muscleVolumeMap = {};
    const exerciseProgressionMap = {};
    const personalRecordsMap = {};
    const monthlyStatsMap = {};

    // Sort chronologically (oldest to newest for progression curves)
    const sortedChrono = [...workouts].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    sortedChrono.forEach((w) => {
      let workoutVolume = 0;
      let workoutSets = 0;
      let workoutReps = 0;

      // Month key (ex: "2026-04")
      const monthKey = (w.date || '').substring(0, 7) || '2026-09';
      if (!monthlyStatsMap[monthKey]) {
        monthlyStatsMap[monthKey] = { month: monthKey, sessions_count: 0, volume_kg: 0, sets_count: 0 };
      }
      monthlyStatsMap[monthKey].sessions_count += 1;

      (w.exercises || []).forEach((ex) => {
        const exName = (ex.name || '').trim();
        const muscle = ex.muscle_group || 'Autre';

        if (!exerciseProgressionMap[exName]) {
          exerciseProgressionMap[exName] = {
            exercise_name: exName,
            muscle_group: muscle,
            history: [],
            max_weight: 0,
            best_1rm: 0,
            total_sets: 0,
            total_reps: 0,
            total_volume: 0
          };
        }

        let exSessionMaxWeight = 0;
        let exSessionMaxReps = 0;
        let exSessionVolume = 0;

        (ex.sets || []).forEach((s) => {
          const wKg = Number(s.weight_kg) || 0;
          const reps = Number(s.reps) || 0;
          const setVolume = wKg * reps;

          workoutVolume += setVolume;
          workoutSets += 1;
          workoutReps += reps;

          totalVolumeKg += setVolume;
          totalSets += 1;
          totalReps += reps;

          muscleVolumeMap[muscle] = (muscleVolumeMap[muscle] || 0) + setVolume;

          if (wKg > exSessionMaxWeight) {
            exSessionMaxWeight = wKg;
            exSessionMaxReps = reps;
          }
          exSessionVolume += setVolume;

          // 1RM estimation: Brzycki formula
          const estimated1RM = reps === 1 ? wKg : reps > 1 ? Math.round(wKg / (1.0278 - 0.0278 * Math.min(reps, 15)) * 10) / 10 : 0;

          if (wKg > exerciseProgressionMap[exName].max_weight) {
            exerciseProgressionMap[exName].max_weight = wKg;
          }
          if (estimated1RM > exerciseProgressionMap[exName].best_1rm) {
            exerciseProgressionMap[exName].best_1rm = estimated1RM;
          }
        });

        if (ex.sets && ex.sets.length > 0 && exSessionMaxWeight > 0) {
          exerciseProgressionMap[exName].total_sets += ex.sets.length;
          exerciseProgressionMap[exName].total_volume += exSessionVolume;
          exerciseProgressionMap[exName].history.push({
            date: w.date,
            workout_id: w.id,
            workout_title: w.title,
            max_weight_kg: exSessionMaxWeight,
            reps: exSessionMaxReps,
            volume_kg: exSessionVolume,
            sets_count: ex.sets.length
          });
        }
      });

      monthlyStatsMap[monthKey].volume_kg += workoutVolume;
      monthlyStatsMap[monthKey].sets_count += workoutSets;
    });

    // Compute muscle percentages
    const totalMuscleVolume = Object.values(muscleVolumeMap).reduce((a, b) => a + b, 0) || 1;
    const muscleDistribution = Object.entries(muscleVolumeMap)
      .map(([muscle, vol]) => ({
        muscle,
        volume_kg: vol,
        percentage: Math.round((vol / totalMuscleVolume) * 100)
      }))
      .sort((a, b) => b.volume_kg - a.volume_kg);

    // Personal records list
    const personalRecords = Object.values(exerciseProgressionMap)
      .filter((ex) => ex.max_weight > 0)
      .map((ex) => ({
        exercise_name: ex.exercise_name,
        muscle_group: ex.muscle_group,
        max_weight_kg: ex.max_weight,
        best_1rm_kg: ex.best_1rm,
        total_sessions: ex.history.length
      }))
      .sort((a, b) => b.max_weight_kg - a.max_weight_kg);

    // Sessions timeline for volume chart
    const volumeTimeline = sortedChrono.map((w) => {
      const vol = (w.exercises || []).reduce(
        (sum, ex) => sum + (ex.sets || []).reduce((sSum, s) => sSum + (Number(s.weight_kg) || 0) * (Number(s.reps) || 0), 0),
        0
      );
      const setsCount = (w.exercises || []).reduce((sum, ex) => sum + (ex.sets || []).length, 0);
      return {
        id: w.id,
        date: w.date,
        title: w.title,
        volume_kg: vol,
        sets_count: setsCount
      };
    });

    return {
      overview: {
        total_sessions: workouts.length,
        total_volume_kg: totalVolumeKg,
        total_volume_tonnes: (totalVolumeKg / 1000).toFixed(1),
        total_sets: totalSets,
        total_reps: totalReps,
        avg_volume_per_session: workouts.length ? Math.round(totalVolumeKg / workouts.length) : 0,
        avg_sets_per_session: workouts.length ? Math.round((totalSets / workouts.length) * 10) / 10 : 0
      },
      volume_timeline: volumeTimeline,
      monthly_breakdown: Object.values(monthlyStatsMap).sort((a, b) => a.month.localeCompare(b.month)),
      muscle_distribution: muscleDistribution,
      exercise_progressions: exerciseProgressionMap,
      personal_records: personalRecords
    };
  }
}

export const db = new Database();
