// server/index.js
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_PATH = path.join(__dirname, '..', 'dist');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// List of popular gym exercises with muscle categories for auto-suggestions
const PRESET_EXERCISES = [
  { name: 'Développé couché', muscle_group: 'Pectoraux' },
  { name: 'Développé incliné haltères', muscle_group: 'Pectoraux' },
  { name: 'Développé couché prise serrée', muscle_group: 'Triceps' },
  { name: 'Dips', muscle_group: 'Pectoraux' },
  { name: 'Écarté poulie vis-à-vis', muscle_group: 'Pectoraux' },
  { name: 'Pompes', muscle_group: 'Pectoraux' },
  { name: 'Soulevé de terre (Deadlift)', muscle_group: 'Dos' },
  { name: 'Tirage vertical poitrine', muscle_group: 'Dos' },
  { name: 'Rowing barre', muscle_group: 'Dos' },
  { name: 'Rowing bûcheron haltère', muscle_group: 'Dos' },
  { name: 'Tractions pronation', muscle_group: 'Dos' },
  { name: 'Tirage horizontal poulie', muscle_group: 'Dos' },
  { name: 'Face Pull poulie', muscle_group: 'Épaules' },
  { name: 'Squat barre', muscle_group: 'Jambes' },
  { name: 'Presse à cuisses', muscle_group: 'Jambes' },
  { name: 'Soulevé de terre roumain (RDL)', muscle_group: 'Jambes' },
  { name: 'Fentes marchées', muscle_group: 'Jambes' },
  { name: 'Leg Extension', muscle_group: 'Jambes' },
  { name: 'Leg Curl', muscle_group: 'Jambes' },
  { name: 'Hip Thrust', muscle_group: 'Jambes' },
  { name: 'Mollets debout', muscle_group: 'Jambes' },
  { name: 'Développé militaire', muscle_group: 'Épaules' },
  { name: 'Développé haltères assis', muscle_group: 'Épaules' },
  { name: 'Élévations latérales', muscle_group: 'Épaules' },
  { name: 'Oiseau haltères / machine', muscle_group: 'Épaules' },
  { name: 'Curl barre EZ', muscle_group: 'Biceps' },
  { name: 'Curl haltères incliné', muscle_group: 'Biceps' },
  { name: 'Curl marteau', muscle_group: 'Biceps' },
  { name: 'Curl pupitre', muscle_group: 'Biceps' },
  { name: 'Extension triceps poulie', muscle_group: 'Triceps' },
  { name: 'Barre au front (Skullcrushers)', muscle_group: 'Triceps' },
  { name: 'Extension nuque haltère', muscle_group: 'Triceps' },
  { name: 'Relevé de jambes à la barre', muscle_group: 'Abdominaux' },
  { name: 'Crunch poulie haute', muscle_group: 'Abdominaux' },
  { name: 'Gainage planche', muscle_group: 'Abdominaux' }
];

// Healthcheck
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// GET Preset Exercises
app.get('/api/exercises/presets', (req, res) => {
  res.json(PRESET_EXERCISES);
});

// GET All Workouts
app.get('/api/workouts', (req, res) => {
  try {
    const workouts = db.getAllWorkouts();
    const search = (req.query.search || '').toLowerCase();
    const month = req.query.month;

    let filtered = workouts;

    if (search) {
      filtered = filtered.filter(
        (w) =>
          (w.title || '').toLowerCase().includes(search) ||
          (w.notes || '').toLowerCase().includes(search) ||
          (w.exercises || []).some((ex) => (ex.name || '').toLowerCase().includes(search))
      );
    }

    if (month && month !== 'all') {
      filtered = filtered.filter((w) => (w.date || '').startsWith(month));
    }

    res.json(filtered);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET Workout by ID
app.get('/api/workouts/:id', (req, res) => {
  try {
    const workout = db.getWorkoutById(req.params.id);
    if (!workout) {
      return res.status(404).json({ error: 'Séance non trouvée' });
    }
    res.json(workout);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST Create Workout
app.post('/api/workouts', (req, res) => {
  try {
    const { date, title, notes, duration_minutes, exercises } = req.body;
    if (!date) {
      return res.status(400).json({ error: 'La date de la séance est obligatoire' });
    }
    const created = db.createWorkout({
      date,
      title: title || 'Séance de musculation',
      notes: notes || '',
      duration_minutes: duration_minutes || 60,
      exercises: exercises || []
    });
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT Update Workout
app.put('/api/workouts/:id', (req, res) => {
  try {
    const updated = db.updateWorkout(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Séance non trouvée' });
    }
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE Workout
app.delete('/api/workouts/:id', (req, res) => {
  try {
    const success = db.deleteWorkout(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Séance non trouvée' });
    }
    res.json({ success: true, message: 'Séance supprimée' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET Aggregate Statistics
app.get('/api/stats', (req, res) => {
  try {
    const stats = db.getStats();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST Reset Database to initial demo history
app.post('/api/reset', (req, res) => {
  try {
    const resetData = db.resetToDemo();
    res.json({ success: true, message: 'Base de données réinitialisée aux données de démo', workouts: resetData });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST Clear all workouts (Fresh Start)
app.post('/api/clear', (req, res) => {
  try {
    db.clearAll();
    res.json({ success: true, message: 'Toutes les séances ont été effacées' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Serve static build if available
app.use(express.static(DIST_PATH));

// Bind API server strictly to 127.0.0.1 (internal loopback) so only Vite dev server is exposed to the preview iframe
app.listen(PORT, '127.0.0.1', () => {
  console.log(`🚀 Internal API Gym Server running on http://127.0.0.1:${PORT}`);
});
