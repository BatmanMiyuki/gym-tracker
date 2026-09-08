// src/components/SettingsModal.jsx
import React, { useRef } from 'react';
import {
  X,
  Settings,
  Volume2,
  VolumeX,
  Download,
  Upload,
  RefreshCw,
  Trash2,
  CheckCircle2,
  Shield,
  HelpCircle,
} from 'lucide-react';
import { storageService } from '../services/storage';

export default function SettingsModal({ settings, onUpdateSettings, onClose }) {
  const fileInputRef = useRef(null);

  const handleExport = () => {
    storageService.exportAllData();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result);
        const success = storageService.importData(json);
        if (success) {
          alert('Données importées avec succès !');
          window.location.reload();
        } else {
          alert("Erreur : Format de fichier d'import non valide.");
        }
      } catch (err) {
        alert('Erreur lors de la lecture du fichier JSON.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Settings className="w-4 h-4" />
            </div>
            <h2 className="font-bold text-sm text-zinc-100">Paramètres de l'application</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-5">
          {/* Audio & Timer Preferences */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              Préférences d'entraînement
            </h3>

            {/* Sound toggle */}
            <div className="flex items-center justify-between p-3 bg-zinc-950 rounded-xl border border-zinc-800">
              <div className="flex items-center gap-3">
                {settings.soundEnabled ? (
                  <Volume2 className="w-5 h-5 text-emerald-400" />
                ) : (
                  <VolumeX className="w-5 h-5 text-zinc-500" />
                )}
                <div>
                  <div className="font-bold text-xs text-zinc-200">Effets sonores (Bips chrono & PR)</div>
                  <div className="text-[11px] text-zinc-400">Synthétiseur audio Web Audio API</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.soundEnabled}
                onChange={(e) => onUpdateSettings({ ...settings, soundEnabled: e.target.checked })}
                className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
              />
            </div>

            {/* Auto rest timer toggle */}
            <div className="flex items-center justify-between p-3 bg-zinc-950 rounded-xl border border-zinc-800">
              <div>
                <div className="font-bold text-xs text-zinc-200">Lancement auto du chronomètre</div>
                <div className="text-[11px] text-zinc-400">Déclenche le repos dès qu'une série est cochée</div>
              </div>
              <input
                type="checkbox"
                checked={settings.autoStartTimer}
                onChange={(e) => onUpdateSettings({ ...settings, autoStartTimer: e.target.checked })}
                className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
              />
            </div>

            {/* Default Rest Time */}
            <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800">
              <label className="text-xs font-bold text-zinc-200 block mb-2">
                Temps de repos par défaut
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[60, 90, 120, 180].map((sec) => (
                  <button
                    key={sec}
                    type="button"
                    onClick={() => onUpdateSettings({ ...settings, defaultRest: sec })}
                    className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                      settings.defaultRest === sec
                        ? 'bg-emerald-500 text-black'
                        : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {sec}s
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Backup & Data Sync */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              Sauvegarde & Données (LocalStorage)
            </h3>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleExport}
                className="flex items-center justify-center gap-2 p-3 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 rounded-xl text-zinc-200 text-xs font-bold transition-colors"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                <span>Exporter (JSON)</span>
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center gap-2 p-3 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 rounded-xl text-zinc-200 text-xs font-bold transition-colors"
              >
                <Upload className="w-4 h-4 text-cyan-400" />
                <span>Importer (JSON)</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {/* Reset / Demo actions */}
            <div className="space-y-2 pt-2 border-t border-zinc-800/80">
              <button
                onClick={() => {
                  if (confirm('Recharger l’historique réaliste complet (Avril à Septembre 2026) ?')) {
                    storageService.resetToDemo();
                  }
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-xs font-semibold transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
                <span>Recharger les données de démonstration (depuis Avril)</span>
              </button>

              <button
                onClick={() => {
                  if (
                    confirm(
                      'Êtes-vous sûr de vouloir effacer tout votre historique pour repartir d’une page blanche ?'
                    )
                  ) {
                    storageService.clearAllData();
                  }
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-950/30 hover:bg-red-950/60 border border-red-500/30 text-red-400 text-xs font-semibold transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Effacer toutes les séances (Page blanche)</span>
              </button>
            </div>
          </div>

          {/* About */}
          <div className="bg-zinc-950 p-3.5 rounded-xl border border-zinc-800 text-xs text-zinc-400 space-y-1">
            <div className="font-bold text-zinc-200 flex items-center gap-1.5">
              <span>FORGE GYM PRO</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.2 rounded font-mono">
                v1.2.0
              </span>
            </div>
            <p className="text-[11px]">
              Application conçue pour le suivi de musculation, surcharge progressive, records 1RM et chronométrage précis en salle de sport.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-950/60">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-xs"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
