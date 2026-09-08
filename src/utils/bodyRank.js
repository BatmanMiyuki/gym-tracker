// src/utils/bodyRank.js
// Liftoff-style BodyRank & Strength Standards Engine

export const RANKS = [
  { id: 'E', name: 'Novice', minLevel: 1, maxLevel: 15, color: '#71717a', bg: 'rgba(113, 113, 122, 0.2)', border: '#52525b', text: 'text-zinc-400', badge: '⚪' },
  { id: 'D', name: 'Initié', minLevel: 16, maxLevel: 30, color: '#84cc16', bg: 'rgba(132, 204, 22, 0.2)', border: '#65a30d', text: 'text-lime-400', badge: '🟢' },
  { id: 'C', name: 'Intermédiaire', minLevel: 31, maxLevel: 50, color: '#06b6d4', bg: 'rgba(6, 182, 212, 0.2)', border: '#0891b2', text: 'text-cyan-400', badge: '🔵' },
  { id: 'B', name: 'Avancé', minLevel: 51, maxLevel: 70, color: '#a855f7', bg: 'rgba(168, 85, 247, 0.2)', border: '#9333ea', text: 'text-purple-400', badge: '🟣' },
  { id: 'A', name: 'Expert', minLevel: 71, maxLevel: 85, color: '#f43f5e', bg: 'rgba(244, 63, 94, 0.2)', border: '#e11d48', text: 'text-rose-400', badge: '🔴' },
  { id: 'S', name: 'Élite', minLevel: 86, maxLevel: 99, color: '#eab308', bg: 'rgba(234, 179, 8, 0.25)', border: '#ca8a04', text: 'text-amber-400', badge: '🟡' },
  { id: 'S+', name: 'Légende', minLevel: 100, maxLevel: 100, color: '#10b981', bg: 'rgba(16, 185, 129, 0.3)', border: '#059669', text: 'text-emerald-300', badge: '👑' },
];

export function getRankFromLevel(level) {
  const lvl = Math.max(1, Math.min(100, Math.round(level)));
  for (const r of RANKS) {
    if (lvl >= r.minLevel && lvl <= r.maxLevel) {
      return { ...r, currentLevel: lvl };
    }
  }
  return { ...RANKS[0], currentLevel: lvl };
}

// Definition of 15 body muscles with mapped exercises and strength benchmarks (for approx 75-80kg lifter)
export const MUSCLE_DEFINITIONS = {
  chest: {
    id: 'chest',
    name: 'Pectoraux',
    view: 'front',
    icon: '🛡️',
    description: 'Pectoraux sternaux et claviculaires (Développés, Écartés, Dips)',
    primaryExercises: ['Développé couché', 'Développé incliné haltères', 'Dips', 'Écarté poulie vis-à-vis'],
    // Benchmarks in kg for 1RM (Novice, Initié, Intermédiaire, Avancé, Expert, Élite)
    standards1RM: [45, 65, 85, 105, 125, 145],
  },
  front_delts: {
    id: 'front_delts',
    name: 'Épaules (Avant)',
    view: 'front',
    icon: '🥥',
    description: 'Faisceaux antérieurs des deltoïdes',
    primaryExercises: ['Développé militaire', 'Développé haltères assis'],
    standards1RM: [30, 45, 60, 75, 90, 105],
  },
  side_delts: {
    id: 'side_delts',
    name: 'Épaules (Latéral)',
    view: 'both',
    icon: '🥥',
    description: 'Largeur des épaules (Élévations latérales)',
    primaryExercises: ['Élévations latérales', 'Élévations latérales poulie'],
    standards1RM: [8, 12, 16, 20, 24, 30],
  },
  biceps: {
    id: 'biceps',
    name: 'Biceps',
    view: 'front',
    icon: '💪',
    description: 'Biceps brachial et brachial antérieur',
    primaryExercises: ['Curl barre EZ', 'Curl haltères', 'Curl marteau', 'Curl pupitre'],
    standards1RM: [20, 30, 40, 50, 60, 70],
  },
  forearms: {
    id: 'forearms',
    name: 'Avant-bras & Poigne',
    view: 'both',
    icon: '✊',
    description: 'Muscles fléchisseurs et extenseurs du poignet',
    primaryExercises: ['Curl marteau', 'Soulevé de terre (Deadlift)', 'Tractions pronation'],
    standards1RM: [40, 60, 80, 100, 120, 150],
  },
  abs: {
    id: 'abs',
    name: 'Abdominaux',
    view: 'front',
    icon: '🍫',
    description: 'Grand droit et sangle abdominale',
    primaryExercises: ['Relevé de jambes à la barre', 'Crunch poulie haute', 'Gainage planche'],
    standards1RM: [15, 30, 50, 70, 90, 110],
  },
  obliques: {
    id: 'obliques',
    name: 'Obliques',
    view: 'front',
    icon: '⚡',
    description: 'Muscles obliques et stabilité du tronc',
    primaryExercises: ['Gainage planche', 'Relevé de jambes à la barre'],
    standards1RM: [15, 30, 50, 70, 90, 110],
  },
  quads: {
    id: 'quads',
    name: 'Quadriceps',
    view: 'front',
    icon: '🦵',
    description: 'Vaste externe, interne et droit fémoral (Squat, Presse)',
    primaryExercises: ['Squat barre', 'Presse à cuisses', 'Leg Extension', 'Fentes marchées'],
    standards1RM: [60, 90, 120, 150, 180, 210],
  },
  traps: {
    id: 'traps',
    name: 'Trapèzes',
    view: 'back',
    icon: '⛰️',
    description: 'Trapèzes supérieurs et moyens',
    primaryExercises: ['Soulevé de terre (Deadlift)', 'Rowing barre', 'Face Pull poulie'],
    standards1RM: [70, 100, 130, 160, 190, 220],
  },
  lats: {
    id: 'lats',
    name: 'Grands Dorsaux (Largeur)',
    view: 'back',
    icon: '🦅',
    description: 'Largeur du dos en V (Tirage vertical, Tractions)',
    primaryExercises: ['Tirage vertical poitrine', 'Tractions pronation', 'Tirage horizontal poulie'],
    standards1RM: [50, 70, 90, 110, 130, 150],
  },
  upper_back: {
    id: 'upper_back',
    name: 'Épaisseur du Dos',
    view: 'back',
    icon: '🪵',
    description: 'Rhomboïdes et milieu du dos (Rowing)',
    primaryExercises: ['Rowing barre', 'Rowing bûcheron haltère', 'Face Pull poulie'],
    standards1RM: [50, 70, 90, 110, 130, 150],
  },
  rear_delts: {
    id: 'rear_delts',
    name: 'Arrière d\'épaules',
    view: 'back',
    icon: '🥥',
    description: 'Deltoïde postérieur (Face Pull, Oiseau)',
    primaryExercises: ['Face Pull poulie', 'Oiseau haltères / machine'],
    standards1RM: [15, 25, 35, 45, 55, 65],
  },
  triceps: {
    id: 'triceps',
    name: 'Triceps',
    view: 'back',
    icon: '🔱',
    description: 'Vaste externe, interne et longue portion',
    primaryExercises: ['Extension triceps poulie', 'Développé couché prise serrée', 'Barre au front (Skullcrushers)', 'Dips'],
    standards1RM: [25, 35, 50, 65, 80, 95],
  },
  glutes: {
    id: 'glutes',
    name: 'Fessiers',
    view: 'back',
    icon: '🍑',
    description: 'Grand et moyen fessier',
    primaryExercises: ['Squat barre', 'Hip Thrust', 'Soulevé de terre roumain (RDL)'],
    standards1RM: [60, 90, 120, 150, 185, 220],
  },
  hamstrings: {
    id: 'hamstrings',
    name: 'Ischio-jambiers',
    view: 'back',
    icon: '🦿',
    description: 'Chaîne postérieure de la cuisse (RDL, Leg Curl)',
    primaryExercises: ['Soulevé de terre roumain (RDL)', 'Leg Curl', 'Soulevé de terre (Deadlift)'],
    standards1RM: [50, 75, 100, 125, 150, 175],
  },
  calves: {
    id: 'calves',
    name: 'Mollets',
    view: 'both',
    icon: '🦿',
    description: 'Gastrocnémiens et soléaires',
    primaryExercises: ['Mollets debout', 'Presse à cuisses'],
    standards1RM: [40, 70, 100, 130, 160, 190],
  },
};

// Muscle mapping helper for exercises
export function mapExerciseToMuscles(exerciseName, muscleCategory) {
  const name = (exerciseName || '').toLowerCase();
  const cat = (muscleCategory || '').toLowerCase();

  const primary = [];
  const secondary = [];

  if (name.includes('couché') || name.includes('incliné') || name.includes('écarté') || name.includes('pompes')) {
    primary.push('chest');
    secondary.push('triceps', 'front_delts');
  } else if (name.includes('dips')) {
    primary.push('chest', 'triceps');
    secondary.push('front_delts');
  } else if (name.includes('deadlift') || name.includes('soulevé de terre') && !name.includes('roumain')) {
    primary.push('traps', 'upper_back', 'hamstrings', 'glutes');
    secondary.push('forearms', 'lats');
  } else if (name.includes('roumain') || name.includes('rdl')) {
    primary.push('hamstrings', 'glutes');
    secondary.push('upper_back');
  } else if (name.includes('tirage vertical') || name.includes('tractions')) {
    primary.push('lats');
    secondary.push('biceps', 'upper_back', 'rear_delts');
  } else if (name.includes('rowing') || name.includes('tirage horizontal')) {
    primary.push('upper_back', 'lats');
    secondary.push('biceps', 'rear_delts', 'traps');
  } else if (name.includes('militaire') || name.includes('haltères assis') && (cat.includes('épaules') || cat.includes('epaules'))) {
    primary.push('front_delts');
    secondary.push('triceps', 'side_delts');
  } else if (name.includes('latérales')) {
    primary.push('side_delts');
  } else if (name.includes('face pull') || name.includes('oiseau')) {
    primary.push('rear_delts', 'upper_back');
    secondary.push('traps', 'side_delts');
  } else if (name.includes('squat') || name.includes('fentes')) {
    primary.push('quads', 'glutes');
    secondary.push('abs');
  } else if (name.includes('presse')) {
    primary.push('quads', 'glutes');
    secondary.push('calves');
  } else if (name.includes('leg extension')) {
    primary.push('quads');
  } else if (name.includes('leg curl')) {
    primary.push('hamstrings');
  } else if (name.includes('hip thrust')) {
    primary.push('glutes', 'hamstrings');
  } else if (name.includes('mollets')) {
    primary.push('calves');
  } else if (name.includes('curl')) {
    primary.push('biceps');
    if (name.includes('marteau')) primary.push('forearms');
  } else if (name.includes('triceps') || name.includes('front') || name.includes('nuque') || name.includes('serrée')) {
    primary.push('triceps');
  } else if (name.includes('jambes à la barre') || name.includes('crunch') || name.includes('planche') || name.includes('gainage')) {
    primary.push('abs', 'obliques');
  } else {
    // Fallback category
    if (cat.includes('pec')) primary.push('chest');
    else if (cat.includes('dos')) primary.push('lats', 'upper_back');
    else if (cat.includes('épaule') || cat.includes('epaule')) primary.push('side_delts', 'front_delts');
    else if (cat.includes('biceps')) primary.push('biceps');
    else if (cat.includes('triceps')) primary.push('triceps');
    else if (cat.includes('jambe')) primary.push('quads', 'hamstrings');
    else if (cat.includes('abdo')) primary.push('abs');
  }

  return { primary, secondary };
}

// Calculate BodyRank stats for all muscles from workout history
export function calculateBodyRanks(workouts) {
  const muscleScores = {};

  // Initialize all muscle structures
  Object.keys(MUSCLE_DEFINITIONS).forEach((mKey) => {
    muscleScores[mKey] = {
      ...MUSCLE_DEFINITIONS[mKey],
      xp: 0,
      totalVolume: 0,
      totalSets: 0,
      bestLiftKg: 0,
      bestExerciseName: null,
      level: 1,
      rank: RANKS[0],
      progressToNextLevel: 0, // 0 to 100%
      currentTierXP: 0,
      nextTierXP: 500,
    };
  });

  if (!workouts || !Array.isArray(workouts)) {
    return {
      globalLevel: 1,
      globalRank: RANKS[0],
      totalXP: 0,
      muscleScores,
      strongestMuscles: [],
      laggingMuscles: [],
      radarData: [],
    };
  }

  // Iterate over all workouts and sets
  workouts.forEach((w) => {
    (w.exercises || []).forEach((ex) => {
      const { primary, secondary } = mapExerciseToMuscles(ex.name, ex.muscle_group);
      let exSessionVolume = 0;
      let exMaxWeight = 0;

      (ex.sets || []).forEach((s) => {
        const weight = Number(s.weight_kg) || 0;
        const reps = Number(s.reps) || 0;
        const setVolume = weight * reps;
        exSessionVolume += setVolume;
        if (weight > exMaxWeight) exMaxWeight = weight;

        // Earn XP: 1 XP per 2.5 kg lifted + reps bonus
        const setXP = Math.round(setVolume * 0.4 + reps * 5);

        primary.forEach((m) => {
          if (muscleScores[m]) {
            muscleScores[m].xp += setXP;
            muscleScores[m].totalVolume += setVolume;
            muscleScores[m].totalSets += 1;
            if (weight > muscleScores[m].bestLiftKg) {
              muscleScores[m].bestLiftKg = weight;
              muscleScores[m].bestExerciseName = ex.name;
            }
          }
        });

        secondary.forEach((m) => {
          if (muscleScores[m]) {
            muscleScores[m].xp += Math.round(setXP * 0.5);
            muscleScores[m].totalVolume += Math.round(setVolume * 0.5);
          }
        });
      });
    });
  });

  // Calculate Level and Rank for each muscle
  let totalLevelSum = 0;
  let totalAllXP = 0;

  Object.keys(muscleScores).forEach((mKey) => {
    const m = muscleScores[mKey];
    totalAllXP += m.xp;

    // Level formula: Derived from Strength Standards + Volume XP
    // Standards checkpoints: standards1RM [Novice(10), Initié(25), Inter(45), Avancé(65), Expert(80), Élite(95)]
    const standards = m.standards1RM || [30, 50, 70, 90, 110, 130];
    const bestWeight = m.bestLiftKg || 0;

    let strengthScore = 5;
    if (bestWeight >= standards[5]) strengthScore = 95 + Math.min(5, (bestWeight - standards[5]) / 5);
    else if (bestWeight >= standards[4]) strengthScore = 80 + ((bestWeight - standards[4]) / (standards[5] - standards[4])) * 15;
    else if (bestWeight >= standards[3]) strengthScore = 65 + ((bestWeight - standards[3]) / (standards[4] - standards[3])) * 15;
    else if (bestWeight >= standards[2]) strengthScore = 45 + ((bestWeight - standards[2]) / (standards[3] - standards[2])) * 20;
    else if (bestWeight >= standards[1]) strengthScore = 25 + ((bestWeight - standards[1]) / (standards[2] - standards[1])) * 20;
    else if (bestWeight >= standards[0]) strengthScore = 10 + ((bestWeight - standards[0]) / (standards[1] - standards[0])) * 15;
    else if (bestWeight > 0) strengthScore = Math.max(5, (bestWeight / standards[0]) * 10);

    // Volume XP bonus (up to +15 levels)
    const volumeBonus = Math.min(15, Math.floor(Math.sqrt(m.xp) / 10));

    const finalLevel = Math.max(1, Math.min(100, Math.round(strengthScore * 0.85 + volumeBonus)));
    m.level = finalLevel;
    m.rank = getRankFromLevel(finalLevel);

    // Progress within current rank tier
    const tierRange = m.rank.maxLevel - m.rank.minLevel + 1;
    const tierProgress = finalLevel - m.rank.minLevel;
    m.progressToNextLevel = Math.min(100, Math.round((tierProgress / Math.max(1, tierRange)) * 100));

    totalLevelSum += finalLevel;
  });

  // Global BodyRank calculation
  const muscleCount = Object.keys(muscleScores).length;
  const globalLevel = Math.max(1, Math.min(100, Math.round(totalLevelSum / muscleCount)));
  const globalRank = getRankFromLevel(globalLevel);

  // Strongest & Lagging muscles
  const sortedMuscles = Object.values(muscleScores).sort((a, b) => b.level - a.level);
  const strongestMuscles = sortedMuscles.slice(0, 3);
  const laggingMuscles = sortedMuscles.slice(-3).reverse();

  // Radar chart data for 6 core categories
  const radarData = [
    { label: 'Pectoraux', level: muscleScores.chest.level, rank: muscleScores.chest.rank.id },
    { label: 'Dos', level: Math.round((muscleScores.lats.level + muscleScores.upper_back.level) / 2), rank: muscleScores.lats.rank.id },
    { label: 'Épaules', level: Math.round((muscleScores.front_delts.level + muscleScores.side_delts.level + muscleScores.rear_delts.level) / 3), rank: muscleScores.side_delts.rank.id },
    { label: 'Bras', level: Math.round((muscleScores.biceps.level + muscleScores.triceps.level) / 2), rank: muscleScores.biceps.rank.id },
    { label: 'Jambes', level: Math.round((muscleScores.quads.level + muscleScores.hamstrings.level + muscleScores.glutes.level) / 3), rank: muscleScores.quads.rank.id },
    { label: 'Abdos', level: Math.round((muscleScores.abs.level + muscleScores.obliques.level) / 2), rank: muscleScores.abs.rank.id },
  ];

  return {
    globalLevel,
    globalRank,
    totalXP: totalAllXP,
    muscleScores,
    strongestMuscles,
    laggingMuscles,
    radarData,
  };
}

// RPG Achievements definitions
export const ACHIEVEMENTS = [
  { id: 'first_workout', title: 'Premier Pas de Titan', desc: 'Enregistrer sa première séance à la salle', icon: '🚀', tier: 'bronze', check: (w, b) => w.length >= 1 },
  { id: 'ten_workouts', title: 'Habitué de la Salle', desc: 'Enregistrer au moins 10 séances', icon: '🏋️', tier: 'silver', check: (w, b) => w.length >= 10 },
  { id: 'bench_80', title: 'Pectoraux d\'Acier', desc: 'Soulever 80 kg ou plus au Développé couché', icon: '🛡️', tier: 'silver', check: (w, b) => (b.muscleScores?.chest?.bestLiftKg || 0) >= 80 },
  { id: 'bench_100', title: 'Le Club des 100 kg', desc: 'Franchir la barre mythique des 100 kg au Couché', icon: '👑', tier: 'gold', check: (w, b) => (b.muscleScores?.chest?.bestLiftKg || 0) >= 100 },
  { id: 'squat_100', title: 'Piliers de Colosse', desc: 'Squat à 100 kg ou plus', icon: '🦵', tier: 'silver', check: (w, b) => (b.muscleScores?.quads?.bestLiftKg || 0) >= 100 },
  { id: 'deadlift_130', title: 'Force Tellurique', desc: 'Deadlift à 130 kg ou plus', icon: '⚡', tier: 'gold', check: (w, b) => (b.muscleScores?.traps?.bestLiftKg || 0) >= 130 },
  { id: 'tonnage_30t', title: 'Machine à Soulever', desc: 'Dépasser 30 tonnes cumulées sous la fonte', icon: '🚛', tier: 'silver', check: (w, b) => (b.totalXP || 0) >= 10000 },
  { id: 'bodyrank_c', title: 'Guerrier Intermédiaire', desc: 'Atteindre le Rang C Global (Niveau 31+)', icon: '🔵', tier: 'silver', check: (w, b) => b.globalLevel >= 31 },
  { id: 'bodyrank_b', title: 'Athlète Avancé', desc: 'Atteindre le Rang B Global (Niveau 51+)', icon: '🟣', tier: 'gold', check: (w, b) => b.globalLevel >= 51 },
  { id: 'all_muscles_d', title: 'Physique Équilibré', desc: 'Tous les groupes musculaires au moins Rang D (Niveau 16+)', icon: '⚖️', tier: 'gold', check: (w, b) => Object.values(b.muscleScores || {}).every(m => m.level >= 16) },
];
