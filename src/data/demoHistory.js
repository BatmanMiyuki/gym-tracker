// src/data/demoHistory.js
// Pre-populated realistic workouts from April 2026 to September 2026

export const DEMO_HISTORY = [
  // --- Avril 2026 ---
  {
    id: 'demo-w1',
    templateId: 'ppl-push',
    name: 'Push (Pecs, Épaules, Triceps)',
    date: '2026-04-06T17:30:00.000Z',
    durationSeconds: 3420, // 57 min
    totalVolume: 7420,
    prs: ['bench-press'],
    notes: 'Première séance enregistrée ! Bonne énergie.',
    exercises: [
      {
        exerciseId: 'bench-press',
        exerciseName: 'Développé couché barre',
        sets: [
          { setNumber: 1, type: 'warmup', weight: 40, reps: 10, rpe: 6, completed: true },
          { setNumber: 2, type: 'normal', weight: 65, reps: 8, rpe: 8, completed: true },
          { setNumber: 3, type: 'normal', weight: 65, reps: 8, rpe: 8.5, completed: true },
          { setNumber: 4, type: 'normal', weight: 70, reps: 6, rpe: 9, completed: true },
        ],
      },
      {
        exerciseId: 'incline-dumbbell-press',
        exerciseName: 'Développé incliné haltères',
        sets: [
          { setNumber: 1, type: 'normal', weight: 22, reps: 10, rpe: 8, completed: true },
          { setNumber: 2, type: 'normal', weight: 22, reps: 9, rpe: 8.5, completed: true },
          { setNumber: 3, type: 'normal', weight: 22, reps: 8, rpe: 9, completed: true },
        ],
      },
      {
        exerciseId: 'lateral-raise-dumbbell',
        exerciseName: 'Élévations latérales haltères',
        sets: [
          { setNumber: 1, type: 'normal', weight: 8, reps: 15, rpe: 7.5, completed: true },
          { setNumber: 2, type: 'normal', weight: 8, reps: 14, rpe: 8.5, completed: true },
          { setNumber: 3, type: 'normal', weight: 8, reps: 12, rpe: 9, completed: true },
        ],
      },
      {
        exerciseId: 'triceps-rope-pushdown',
        exerciseName: 'Extension triceps corde poulie',
        sets: [
          { setNumber: 1, type: 'normal', weight: 20, reps: 12, rpe: 8, completed: true },
          { setNumber: 2, type: 'normal', weight: 22.5, reps: 10, rpe: 8.5, completed: true },
          { setNumber: 3, type: 'normal', weight: 22.5, reps: 10, rpe: 9, completed: true },
        ],
      },
    ],
  },
  {
    id: 'demo-w2',
    templateId: 'ppl-pull',
    name: 'Pull (Dos, Biceps)',
    date: '2026-04-08T18:00:00.000Z',
    durationSeconds: 3780, // 63 min
    totalVolume: 8650,
    prs: ['deadlift'],
    notes: 'Tirage propre, bonne congestion dos.',
    exercises: [
      {
        exerciseId: 'deadlift',
        exerciseName: 'Soulevé de terre (Deadlift)',
        sets: [
          { setNumber: 1, type: 'warmup', weight: 60, reps: 8, rpe: 6, completed: true },
          { setNumber: 2, type: 'normal', weight: 100, reps: 6, rpe: 7.5, completed: true },
          { setNumber: 3, type: 'normal', weight: 110, reps: 5, rpe: 8.5, completed: true },
        ],
      },
      {
        exerciseId: 'lat-pulldown',
        exerciseName: 'Tirage vertical poitrine (Poulie)',
        sets: [
          { setNumber: 1, type: 'normal', weight: 55, reps: 10, rpe: 7.5, completed: true },
          { setNumber: 2, type: 'normal', weight: 60, reps: 8, rpe: 8.5, completed: true },
          { setNumber: 3, type: 'normal', weight: 60, reps: 8, rpe: 9, completed: true },
        ],
      },
      {
        exerciseId: 'barbell-curl',
        exerciseName: 'Curl barre droite / EZ',
        sets: [
          { setNumber: 1, type: 'normal', weight: 27.5, reps: 10, rpe: 8, completed: true },
          { setNumber: 2, type: 'normal', weight: 30, reps: 8, rpe: 8.5, completed: true },
          { setNumber: 3, type: 'normal', weight: 30, reps: 7, rpe: 9.5, completed: true },
        ],
      },
    ],
  },
  {
    id: 'demo-w3',
    templateId: 'ppl-legs',
    name: 'Legs (Jambes complètes)',
    date: '2026-04-10T17:15:00.000Z',
    durationSeconds: 4100,
    totalVolume: 10400,
    prs: ['barbell-squat'],
    notes: 'Squat bien profond.',
    exercises: [
      {
        exerciseId: 'barbell-squat',
        exerciseName: 'Squat arrière barre (Back Squat)',
        sets: [
          { setNumber: 1, type: 'warmup', weight: 50, reps: 10, rpe: 6, completed: true },
          { setNumber: 2, type: 'normal', weight: 80, reps: 8, rpe: 8, completed: true },
          { setNumber: 3, type: 'normal', weight: 85, reps: 6, rpe: 8.5, completed: true },
          { setNumber: 4, type: 'normal', weight: 85, reps: 6, rpe: 9, completed: true },
        ],
      },
      {
        exerciseId: 'leg-press',
        exerciseName: 'Presse à cuisses 45°',
        sets: [
          { setNumber: 1, type: 'normal', weight: 140, reps: 12, rpe: 7.5, completed: true },
          { setNumber: 2, type: 'normal', weight: 160, reps: 10, rpe: 8.5, completed: true },
          { setNumber: 3, type: 'normal', weight: 170, reps: 8, rpe: 9, completed: true },
        ],
      },
    ],
  },

  // --- Mai 2026 ---
  {
    id: 'demo-w4',
    templateId: 'ppl-push',
    name: 'Push (Pecs & Épaules)',
    date: '2026-05-04T18:00:00.000Z',
    durationSeconds: 3600,
    totalVolume: 8200,
    prs: ['bench-press'],
    notes: 'Progression sur le couché : 75 kg passé facilement !',
    exercises: [
      {
        exerciseId: 'bench-press',
        exerciseName: 'Développé couché barre',
        sets: [
          { setNumber: 1, type: 'warmup', weight: 50, reps: 8, rpe: 6, completed: true },
          { setNumber: 2, type: 'normal', weight: 70, reps: 8, rpe: 7.5, completed: true },
          { setNumber: 3, type: 'normal', weight: 75, reps: 6, rpe: 8.5, completed: true },
          { setNumber: 4, type: 'normal', weight: 75, reps: 5, rpe: 9, completed: true },
        ],
      },
      {
        exerciseId: 'incline-dumbbell-press',
        exerciseName: 'Développé incliné haltères',
        sets: [
          { setNumber: 1, type: 'normal', weight: 24, reps: 10, rpe: 8, completed: true },
          { setNumber: 2, type: 'normal', weight: 24, reps: 8, rpe: 8.5, completed: true },
          { setNumber: 3, type: 'normal', weight: 24, reps: 8, rpe: 9, completed: true },
        ],
      },
      {
        exerciseId: 'lateral-raise-dumbbell',
        exerciseName: 'Élévations latérales haltères',
        sets: [
          { setNumber: 1, type: 'normal', weight: 10, reps: 12, rpe: 8, completed: true },
          { setNumber: 2, type: 'normal', weight: 10, reps: 12, rpe: 8.5, completed: true },
          { setNumber: 3, type: 'normal', weight: 10, reps: 10, rpe: 9, completed: true },
        ],
      },
    ],
  },
  {
    id: 'demo-w5',
    templateId: 'ppl-pull',
    name: 'Pull (Dos lourd)',
    date: '2026-05-12T17:45:00.000Z',
    durationSeconds: 3900,
    totalVolume: 9400,
    prs: ['deadlift', 'barbell-row'],
    notes: 'Deadlift à 120kg propre.',
    exercises: [
      {
        exerciseId: 'deadlift',
        exerciseName: 'Soulevé de terre (Deadlift)',
        sets: [
          { setNumber: 1, type: 'warmup', weight: 70, reps: 6, rpe: 6, completed: true },
          { setNumber: 2, type: 'normal', weight: 110, reps: 5, rpe: 7.5, completed: true },
          { setNumber: 3, type: 'normal', weight: 120, reps: 5, rpe: 8.5, completed: true },
        ],
      },
      {
        exerciseId: 'barbell-row',
        exerciseName: 'Rowing barre buste penché',
        sets: [
          { setNumber: 1, type: 'normal', weight: 60, reps: 10, rpe: 7.5, completed: true },
          { setNumber: 2, type: 'normal', weight: 65, reps: 8, rpe: 8.5, completed: true },
          { setNumber: 3, type: 'normal', weight: 65, reps: 8, rpe: 9, completed: true },
        ],
      },
    ],
  },

  // --- Juin 2026 ---
  {
    id: 'demo-w6',
    templateId: 'ppl-legs',
    name: 'Legs Day Intensitée',
    date: '2026-06-05T18:00:00.000Z',
    durationSeconds: 4200,
    totalVolume: 11800,
    prs: ['barbell-squat', 'leg-press'],
    notes: 'Squat à 95 kg x 6. Mollets bien congestionnés.',
    exercises: [
      {
        exerciseId: 'barbell-squat',
        exerciseName: 'Squat arrière barre (Back Squat)',
        sets: [
          { setNumber: 1, type: 'warmup', weight: 60, reps: 8, rpe: 6, completed: true },
          { setNumber: 2, type: 'normal', weight: 90, reps: 6, rpe: 8, completed: true },
          { setNumber: 3, type: 'normal', weight: 95, reps: 6, rpe: 8.5, completed: true },
          { setNumber: 4, type: 'normal', weight: 95, reps: 5, rpe: 9, completed: true },
        ],
      },
      {
        exerciseId: 'leg-press',
        exerciseName: 'Presse à cuisses 45°',
        sets: [
          { setNumber: 1, type: 'normal', weight: 180, reps: 10, rpe: 8, completed: true },
          { setNumber: 2, type: 'normal', weight: 200, reps: 10, rpe: 8.5, completed: true },
          { setNumber: 3, type: 'normal', weight: 210, reps: 8, rpe: 9.5, completed: true },
        ],
      },
    ],
  },
  {
    id: 'demo-w7',
    templateId: 'ppl-push',
    name: 'Push (Focus Développé)',
    date: '2026-06-18T17:30:00.000Z',
    durationSeconds: 3600,
    totalVolume: 8900,
    prs: ['bench-press'],
    notes: 'Couché 80 kg validé ! La barre des 80kg est passée.',
    exercises: [
      {
        exerciseId: 'bench-press',
        exerciseName: 'Développé couché barre',
        sets: [
          { setNumber: 1, type: 'warmup', weight: 50, reps: 8, rpe: 6, completed: true },
          { setNumber: 2, type: 'normal', weight: 75, reps: 6, rpe: 8, completed: true },
          { setNumber: 3, type: 'normal', weight: 80, reps: 5, rpe: 8.5, completed: true },
          { setNumber: 4, type: 'normal', weight: 80, reps: 4, rpe: 9.5, completed: true },
        ],
      },
      {
        exerciseId: 'incline-dumbbell-press',
        exerciseName: 'Développé incliné haltères',
        sets: [
          { setNumber: 1, type: 'normal', weight: 26, reps: 8, rpe: 8, completed: true },
          { setNumber: 2, type: 'normal', weight: 26, reps: 8, rpe: 8.5, completed: true },
          { setNumber: 3, type: 'normal', weight: 26, reps: 7, rpe: 9, completed: true },
        ],
      },
    ],
  },

  // --- Juillet 2026 ---
  {
    id: 'demo-w8',
    templateId: 'upper-body',
    name: 'Upper Body Explosif',
    date: '2026-07-09T18:15:00.000Z',
    durationSeconds: 3750,
    totalVolume: 9200,
    prs: ['pull-ups'],
    notes: 'Tractions au poids du corps : 10 reps propres.',
    exercises: [
      {
        exerciseId: 'incline-dumbbell-press',
        exerciseName: 'Développé incliné haltères',
        sets: [
          { setNumber: 1, type: 'normal', weight: 28, reps: 8, rpe: 8, completed: true },
          { setNumber: 2, type: 'normal', weight: 28, reps: 8, rpe: 8.5, completed: true },
          { setNumber: 3, type: 'normal', weight: 28, reps: 7, rpe: 9, completed: true },
        ],
      },
      {
        exerciseId: 'pull-ups',
        exerciseName: 'Tractions pronation',
        sets: [
          { setNumber: 1, type: 'normal', weight: 0, reps: 10, rpe: 8, completed: true },
          { setNumber: 2, type: 'normal', weight: 0, reps: 9, rpe: 8.5, completed: true },
          { setNumber: 3, type: 'normal', weight: 0, reps: 8, rpe: 9, completed: true },
        ],
      },
      {
        exerciseId: 'overhead-press',
        exerciseName: 'Développé militaire barre (OHP)',
        sets: [
          { setNumber: 1, type: 'normal', weight: 45, reps: 8, rpe: 8, completed: true },
          { setNumber: 2, type: 'normal', weight: 47.5, reps: 6, rpe: 8.5, completed: true },
          { setNumber: 3, type: 'normal', weight: 47.5, reps: 6, rpe: 9, completed: true },
        ],
      },
    ],
  },
  {
    id: 'demo-w9',
    templateId: 'ppl-pull',
    name: 'Pull - Dos & Biceps Focus',
    date: '2026-07-24T17:30:00.000Z',
    durationSeconds: 3800,
    totalVolume: 9900,
    prs: ['deadlift'],
    notes: 'Deadlift 130 kg x 4 reps. Énorme sensation.',
    exercises: [
      {
        exerciseId: 'deadlift',
        exerciseName: 'Soulevé de terre (Deadlift)',
        sets: [
          { setNumber: 1, type: 'warmup', weight: 80, reps: 6, rpe: 6, completed: true },
          { setNumber: 2, type: 'normal', weight: 120, reps: 5, rpe: 7.5, completed: true },
          { setNumber: 3, type: 'normal', weight: 130, reps: 4, rpe: 8.5, completed: true },
        ],
      },
      {
        exerciseId: 'lat-pulldown',
        exerciseName: 'Tirage vertical poitrine (Poulie)',
        sets: [
          { setNumber: 1, type: 'normal', weight: 65, reps: 10, rpe: 7.5, completed: true },
          { setNumber: 2, type: 'normal', weight: 70, reps: 8, rpe: 8.5, completed: true },
          { setNumber: 3, type: 'normal', weight: 70, reps: 8, rpe: 9, completed: true },
        ],
      },
    ],
  },

  // --- Août 2026 ---
  {
    id: 'demo-w10',
    templateId: 'ppl-push',
    name: 'Push - Pecs en feu',
    date: '2026-08-14T18:00:00.000Z',
    durationSeconds: 3900,
    totalVolume: 10100,
    prs: ['bench-press'],
    notes: '85 kg au couché x 5 reps ! Nouveau PR.',
    exercises: [
      {
        exerciseId: 'bench-press',
        exerciseName: 'Développé couché barre',
        sets: [
          { setNumber: 1, type: 'warmup', weight: 60, reps: 8, rpe: 6, completed: true },
          { setNumber: 2, type: 'normal', weight: 80, reps: 6, rpe: 7.5, completed: true },
          { setNumber: 3, type: 'normal', weight: 85, reps: 5, rpe: 8.5, completed: true },
          { setNumber: 4, type: 'normal', weight: 85, reps: 5, rpe: 9, completed: true },
        ],
      },
      {
        exerciseId: 'incline-dumbbell-press',
        exerciseName: 'Développé incliné haltères',
        sets: [
          { setNumber: 1, type: 'normal', weight: 28, reps: 9, rpe: 8, completed: true },
          { setNumber: 2, type: 'normal', weight: 28, reps: 8, rpe: 8.5, completed: true },
          { setNumber: 3, type: 'normal', weight: 28, reps: 8, rpe: 9, completed: true },
        ],
      },
      {
        exerciseId: 'lateral-raise-dumbbell',
        exerciseName: 'Élévations latérales haltères',
        sets: [
          { setNumber: 1, type: 'normal', weight: 12, reps: 12, rpe: 8, completed: true },
          { setNumber: 2, type: 'normal', weight: 12, reps: 12, rpe: 8.5, completed: true },
          { setNumber: 3, type: 'normal', weight: 12, reps: 10, rpe: 9, completed: true },
        ],
      },
    ],
  },
  {
    id: 'demo-w11',
    templateId: 'ppl-legs',
    name: 'Legs - Squat Lourd',
    date: '2026-08-27T17:30:00.000Z',
    durationSeconds: 4300,
    totalVolume: 12500,
    prs: ['barbell-squat', 'romanian-deadlift'],
    notes: 'Squat à 105 kg x 5 reps ! La barre des 100 kg est franchie.',
    exercises: [
      {
        exerciseId: 'barbell-squat',
        exerciseName: 'Squat arrière barre (Back Squat)',
        sets: [
          { setNumber: 1, type: 'warmup', weight: 60, reps: 8, rpe: 6, completed: true },
          { setNumber: 2, type: 'normal', weight: 95, reps: 6, rpe: 7.5, completed: true },
          { setNumber: 3, type: 'normal', weight: 105, reps: 5, rpe: 8.5, completed: true },
          { setNumber: 4, type: 'normal', weight: 105, reps: 4, rpe: 9, completed: true },
        ],
      },
      {
        exerciseId: 'romanian-deadlift',
        exerciseName: 'Soulevé de terre roumain (RDL)',
        sets: [
          { setNumber: 1, type: 'normal', weight: 90, reps: 10, rpe: 7.5, completed: true },
          { setNumber: 2, type: 'normal', weight: 95, reps: 8, rpe: 8, completed: true },
          { setNumber: 3, type: 'normal', weight: 100, reps: 8, rpe: 8.5, completed: true },
        ],
      },
    ],
  },

  // --- Début Septembre 2026 ---
  {
    id: 'demo-w12',
    templateId: 'ppl-pull',
    name: 'Pull (Rentré de vacances)',
    date: '2026-09-04T18:00:00.000Z',
    durationSeconds: 3700,
    totalVolume: 10200,
    prs: ['lat-pulldown', 'barbell-curl'],
    notes: 'Reprise en force ! Biceps bien pumpés.',
    exercises: [
      {
        exerciseId: 'deadlift',
        exerciseName: 'Soulevé de terre (Deadlift)',
        sets: [
          { setNumber: 1, type: 'warmup', weight: 80, reps: 6, rpe: 6, completed: true },
          { setNumber: 2, type: 'normal', weight: 125, reps: 5, rpe: 8, completed: true },
          { setNumber: 3, type: 'normal', weight: 135, reps: 4, rpe: 8.5, completed: true },
        ],
      },
      {
        exerciseId: 'lat-pulldown',
        exerciseName: 'Tirage vertical poitrine (Poulie)',
        sets: [
          { setNumber: 1, type: 'normal', weight: 70, reps: 10, rpe: 8, completed: true },
          { setNumber: 2, type: 'normal', weight: 75, reps: 8, rpe: 8.5, completed: true },
          { setNumber: 3, type: 'normal', weight: 75, reps: 8, rpe: 9, completed: true },
        ],
      },
      {
        exerciseId: 'barbell-curl',
        exerciseName: 'Curl barre droite / EZ',
        sets: [
          { setNumber: 1, type: 'normal', weight: 32.5, reps: 10, rpe: 8, completed: true },
          { setNumber: 2, type: 'normal', weight: 35, reps: 8, rpe: 8.5, completed: true },
          { setNumber: 3, type: 'normal', weight: 35, reps: 7, rpe: 9, completed: true },
        ],
      },
    ],
  },
];

export const DEMO_BODY_STATS = [
  { date: '2026-04-01', weight: 78.5, bodyFat: 17.5, chest: 102, arm: 36.5, waist: 84, thigh: 58 },
  { date: '2026-05-01', weight: 79.2, bodyFat: 17.0, chest: 103, arm: 37.0, waist: 83.5, thigh: 58.5 },
  { date: '2026-06-01', weight: 80.0, bodyFat: 16.5, chest: 104.5, arm: 37.5, waist: 83.0, thigh: 59.5 },
  { date: '2026-07-01', weight: 80.8, bodyFat: 16.0, chest: 106, arm: 38.0, waist: 82.5, thigh: 60.0 },
  { date: '2026-08-01', weight: 81.3, bodyFat: 15.5, chest: 107, arm: 38.5, waist: 82.0, thigh: 61.0 },
  { date: '2026-09-01', weight: 81.9, bodyFat: 15.2, chest: 108, arm: 39.0, waist: 81.5, thigh: 61.5 },
];
