// src/App.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Navbar from './components/Navbar';
import WorkoutList from './components/WorkoutList';
import WorkoutForm from './components/WorkoutForm';
import StatsPage from './components/StatsPage';
import BodyRankViewer from './components/BodyRankViewer';
import AchievementsModal from './components/AchievementsModal';
import { api } from './api';
import { calculateBodyRanks } from './utils/bodyRank';

export default function App() {
  const [activeTab, setActiveTab] = useState('bodyrank'); // 'bodyrank' | 'list' | 'form' | 'stats'
  const [workouts, setWorkouts] = useState([]);
  const [stats, setStats] = useState(null);
  const [presets, setPresets] = useState([]);
  const [editingWorkout, setEditingWorkout] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [showAchievements, setShowAchievements] = useState(false);

  // Show temporary toast notification
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Load all data from Backend API
  const loadData = useCallback(async () => {
    try {
      const [workoutsData, statsData, presetsData] = await Promise.all([
        api.getWorkouts(),
        api.getStats(),
        api.getPresets(),
      ]);
      setWorkouts(workoutsData);
      setStats(statsData);
      setPresets(presetsData);
    } catch (err) {
      console.error('Erreur de chargement', err);
      showToast('⚠️ Mode LocalStorage / Hors-ligne actif');
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Compute dynamic Liftoff BodyRank data across all 15 muscle groups
  const bodyRankData = useMemo(() => {
    return calculateBodyRanks(workouts);
  }, [workouts]);

  // Open form to add a new workout
  const handleOpenNewWorkout = () => {
    setEditingWorkout(null);
    setActiveTab('form');
  };

  // Open form to edit an existing workout
  const handleEditWorkout = (workout) => {
    setEditingWorkout(workout);
    setActiveTab('form');
  };

  // Duplicate a past workout for today
  const handleDuplicateWorkout = async (workout) => {
    try {
      setIsLoading(true);
      const duplicated = {
        date: new Date().toISOString().split('T')[0],
        title: workout.title || 'Séance de musculation',
        notes: `Dupliquée de la séance du ${workout.date}`,
        duration_minutes: workout.duration_minutes || 60,
        exercises: (workout.exercises || []).map((ex) => ({
          name: ex.name,
          muscle_group: ex.muscle_group,
          sets: (ex.sets || []).map((s, idx) => ({
            set_number: idx + 1,
            weight_kg: s.weight_kg,
            reps: s.reps,
          })),
        })),
      };

      await api.createWorkout(duplicated);
      await loadData();
      showToast('⚡ Séance dupliquée + XP attribués !');
      setActiveTab('list');
    } catch (err) {
      showToast(`❌ ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Save workout (create or update)
  const handleSaveWorkout = async (workoutData) => {
    try {
      setIsLoading(true);
      if (editingWorkout) {
        await api.updateWorkout(editingWorkout.id, workoutData);
        showToast('✅ Séance mise à jour avec succès !');
      } else {
        await api.createWorkout(workoutData);
        showToast('🔥 Séance enregistrée ! XP BodyRank gagnés !');
      }
      await loadData();
      setEditingWorkout(null);
      setActiveTab('bodyrank');
    } catch (err) {
      showToast(`❌ ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Delete workout
  const handleDeleteWorkout = async (id) => {
    try {
      setIsLoading(true);
      await api.deleteWorkout(id);
      await loadData();
      showToast('🗑️ Séance supprimée.');
    } catch (err) {
      showToast(`❌ ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset demo data
  const handleResetData = async () => {
    if (
      confirm(
        'Voulez-vous réinitialiser l’historique aux séances de démonstration depuis Avril 2026 ?'
      )
    ) {
      try {
        await api.resetData();
        await loadData();
        showToast('🔄 Données réinitialisées avec succès.');
      } catch (err) {
        showToast(`❌ ${err.message}`);
      }
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans antialiased selection:bg-emerald-500 selection:text-black">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setEditingWorkout(null);
          setActiveTab(tab);
        }}
        onOpenNewWorkout={handleOpenNewWorkout}
        onOpenAchievements={() => setShowAchievements(true)}
        onResetData={handleResetData}
        globalRank={bodyRankData.globalRank}
        globalLevel={bodyRankData.globalLevel}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 animate-bounce-subtle bg-zinc-900 border border-emerald-500/50 text-emerald-300 px-4 py-2.5 rounded-2xl shadow-2xl text-xs font-bold flex items-center gap-2">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main App Body */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6">
        {activeTab === 'bodyrank' && (
          <BodyRankViewer
            bodyRankData={bodyRankData}
            onSelectExercise={(exName) => {
              // Quick action if needed
            }}
          />
        )}

        {activeTab === 'list' && (
          <WorkoutList
            workouts={workouts}
            onEditWorkout={handleEditWorkout}
            onDeleteWorkout={handleDeleteWorkout}
            onDuplicateWorkout={handleDuplicateWorkout}
            onAddNewWorkout={handleOpenNewWorkout}
          />
        )}

        {activeTab === 'form' && (
          <WorkoutForm
            initialData={editingWorkout}
            presets={presets}
            onSave={handleSaveWorkout}
            onCancel={() => {
              setEditingWorkout(null);
              setActiveTab('bodyrank');
            }}
            isLoading={isLoading}
          />
        )}

        {activeTab === 'stats' && (
          <StatsPage
            stats={stats}
            bodyRankData={bodyRankData}
            onNavigateToBodyRank={() => setActiveTab('bodyrank')}
          />
        )}
      </main>

      {/* Achievements RPG Modal */}
      {showAchievements && (
        <AchievementsModal
          workouts={workouts}
          bodyRankData={bodyRankData}
          onClose={() => setShowAchievements(false)}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-6 text-center text-xs text-zinc-500">
        <p>LIFTOFF • BodyRank Fitness System • Node.js Express API & React</p>
      </footer>
    </div>
  );
}
