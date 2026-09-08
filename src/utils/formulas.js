// src/utils/formulas.js

/**
 * Calculates Estimated 1RM (1 Rep Max) using the Brzycki & Epley formulas
 */
export function calculate1RM(weight, reps) {
  if (!weight || !reps || reps <= 0 || weight <= 0) return 0;
  if (reps === 1) return weight;
  // Epley formula: weight * (1 + reps / 30)
  // Brzycki formula: weight / (1.0278 - 0.0278 * reps)
  // We use Brzycki for reps <= 10, Epley for reps > 10
  if (reps <= 10) {
    const brzycki = weight / (1.0278 - 0.0278 * reps);
    return Math.round(brzycki * 10) / 10;
  }
  const epley = weight * (1 + reps / 30);
  return Math.round(epley * 10) / 10;
}

/**
 * Returns a percentage breakdown for a given 1RM
 */
export function get1RMPercentages(oneRepMax) {
  if (!oneRepMax || oneRepMax <= 0) return [];
  const percentages = [
    { pct: 100, reps: '1 RM', desc: 'Force max absolue' },
    { pct: 95, reps: '2 reps', desc: 'Force lourde' },
    { pct: 90, reps: '3-4 reps', desc: 'Force / Puissance' },
    { pct: 85, reps: '5-6 reps', desc: 'Force & Hypertrophie' },
    { pct: 80, reps: '7-8 reps', desc: 'Hypertrophie dense' },
    { pct: 75, reps: '9-10 reps', desc: 'Hypertrophie standard' },
    { pct: 70, reps: '11-12 reps', desc: 'Hypertrophie / Volume' },
    { pct: 65, reps: '13-15 reps', desc: 'Endurance de force' },
    { pct: 60, reps: '16-20 reps', desc: 'Endurance / Pompe' },
    { pct: 50, reps: '20+ reps', desc: 'Échauffement' },
  ];

  return percentages.map((p) => ({
    percentage: p.pct,
    reps: p.reps,
    description: p.desc,
    weight: Math.round((oneRepMax * (p.pct / 100)) * 2) / 2, // Rounded to nearest 0.5kg
  }));
}

/**
 * Calculates Olympic plate distribution for a target weight on a bar
 */
export const STANDARD_PLATES = [
  { weight: 25, color: '#ef4444', label: '25 kg', border: '#b91c1c' }, // Red
  { weight: 20, color: '#3b82f6', label: '20 kg', border: '#1d4ed8' }, // Blue
  { weight: 15, color: '#eab308', label: '15 kg', border: '#ca8a04' }, // Yellow
  { weight: 10, color: '#22c55e', label: '10 kg', border: '#15803d' }, // Green
  { weight: 5, color: '#f8fafc', label: '5 kg', border: '#cbd5e1' }, // White
  { weight: 2.5, color: '#18181b', label: '2.5 kg', border: '#52525b' }, // Black
  { weight: 1.25, color: '#a1a1aa', label: '1.25 kg', border: '#71717a' }, // Silver
];

export function calculatePlates(targetWeight, barWeight = 20) {
  if (targetWeight <= barWeight) {
    return { perSideWeight: 0, platesPerSide: [], remainder: targetWeight - barWeight };
  }

  const weightNeeded = targetWeight - barWeight;
  let remainingPerSide = weightNeeded / 2;
  const platesPerSide = [];

  for (const plate of STANDARD_PLATES) {
    if (remainingPerSide >= plate.weight) {
      const count = Math.floor(remainingPerSide / plate.weight);
      for (let i = 0; i < count; i++) {
        platesPerSide.push({ ...plate });
      }
      remainingPerSide = Math.round((remainingPerSide - count * plate.weight) * 100) / 100;
    }
  }

  return {
    perSideWeight: (targetWeight - barWeight) / 2,
    platesPerSide,
    remainder: remainingPerSide * 2,
  };
}

/**
 * Calculate total volume for a workout (weight * reps for non-warmup sets)
 */
export function calculateWorkoutVolume(exercises) {
  if (!exercises || !Array.isArray(exercises)) return 0;
  let total = 0;
  exercises.forEach((ex) => {
    (ex.sets || []).forEach((set) => {
      if (set.completed && set.type !== 'warmup' && set.weight && set.reps) {
        total += Number(set.weight) * Number(set.reps);
      }
    });
  });
  return total;
}
