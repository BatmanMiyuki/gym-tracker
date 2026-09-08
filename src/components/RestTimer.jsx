// src/components/RestTimer.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, X, Plus, Minus, Bell, BellOff, Minimize2, Maximize2 } from 'lucide-react';
import { sounds } from '../utils/sound';

export default function RestTimer({
  initialSeconds = 90,
  onClose,
  soundEnabled = true,
  autoMinimize = false,
}) {
  const [totalSeconds, setTotalSeconds] = useState(initialSeconds);
  const [remaining, setRemaining] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(true);
  const [isMinimized, setIsMinimized] = useState(autoMinimize);
  const [soundOn, setSoundOn] = useState(soundEnabled);
  const lastBeepRef = useRef(null);

  useEffect(() => {
    sounds.setEnabled(soundOn);
  }, [soundOn]);

  useEffect(() => {
    let interval = null;
    if (isRunning && remaining > 0) {
      interval = setInterval(() => {
        setRemaining((prev) => {
          const next = prev - 1;
          // Audio cues
          if (next <= 3 && next > 0 && lastBeepRef.current !== next) {
            lastBeepRef.current = next;
            sounds.playCountdownBeep();
          } else if (next === 0 && lastBeepRef.current !== 0) {
            lastBeepRef.current = 0;
            sounds.playTimerDone();
          }
          return next > 0 ? next : 0;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, remaining]);

  const addTime = (secs) => {
    setRemaining((prev) => {
      const next = Math.max(0, prev + secs);
      if (next > totalSeconds) setTotalSeconds(next);
      return next;
    });
  };

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const progressPercent = totalSeconds > 0 ? (remaining / totalSeconds) * 100 : 0;

  // Floating Minimized Pill
  if (isMinimized) {
    return (
      <div className="fixed top-20 right-4 z-50 animate-bounce-subtle">
        <div
          onClick={() => setIsMinimized(false)}
          className={`flex items-center gap-2.5 px-3.5 py-2 rounded-full cursor-pointer shadow-xl border backdrop-blur-md transition-all ${
            remaining === 0
              ? 'bg-emerald-500 text-black border-emerald-400 timer-active'
              : 'bg-zinc-900/95 text-zinc-100 border-zinc-700 hover:border-emerald-500/50'
          }`}
        >
          <div className="relative w-4 h-4 flex items-center justify-center">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                remaining === 0 ? 'bg-black animate-ping' : isRunning ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
              }`}
            />
          </div>
          <span className="font-mono font-black text-sm">
            {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="text-zinc-400 hover:text-zinc-100 p-0.5 rounded"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  // Expanded Floating Card / Drawer
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  return (
    <div className="fixed bottom-20 sm:bottom-24 right-4 left-4 sm:left-auto sm:w-80 z-50">
      <div
        className={`rounded-2xl border p-4 shadow-2xl backdrop-blur-xl transition-all ${
          remaining === 0
            ? 'bg-zinc-900/95 border-emerald-500 text-white timer-active'
            : 'bg-zinc-900/95 border-zinc-800 text-zinc-100'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-zinc-800/80">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-400">
              Temps de repos
            </span>
            {remaining === 0 && (
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-1.5 py-0.5 rounded">
                Prêt ! ⚡
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setSoundOn(!soundOn)}
              title={soundOn ? 'Couper le son' : 'Activer le son'}
              className="p-1 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
            >
              {soundOn ? <Bell className="w-4 h-4 text-emerald-400" /> : <BellOff className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setIsMinimized(true)}
              title="Réduire"
              className="p-1 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              title="Fermer le chrono"
              className="p-1 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-zinc-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Circular Progress & Controls */}
        <div className="flex items-center justify-around py-3">
          {/* Quick minus */}
          <button
            onClick={() => addTime(-15)}
            className="flex flex-col items-center justify-center w-10 h-10 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 active:scale-95 transition-all text-xs font-bold"
          >
            -15s
          </button>

          {/* SVG Circular Display */}
          <div className="relative w-32 h-32 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 140 140">
              {/* Background circle */}
              <circle
                cx="70"
                cy="70"
                r={radius}
                className="text-zinc-800"
                strokeWidth="8"
                stroke="currentColor"
                fill="transparent"
              />
              {/* Animated Progress circle */}
              <circle
                cx="70"
                cy="70"
                r={radius}
                className={remaining === 0 ? 'text-emerald-400' : 'text-emerald-500'}
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                style={{ transition: 'stroke-dashoffset 0.5s ease-in-out' }}
              />
            </svg>

            {/* Center Time Display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-mono font-black text-2xl tracking-tighter">
                {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
              </span>
              <span className="text-[10px] text-zinc-400 uppercase font-semibold">
                {remaining === 0 ? 'À toi de jouer' : isRunning ? 'Repos...' : 'En pause'}
              </span>
            </div>
          </div>

          {/* Quick plus */}
          <button
            onClick={() => addTime(30)}
            className="flex flex-col items-center justify-center w-10 h-10 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 active:scale-95 transition-all text-xs font-bold"
          >
            +30s
          </button>
        </div>

        {/* Action Controls Footer */}
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl font-bold text-xs transition-all ${
              isRunning
                ? 'bg-zinc-800 hover:bg-zinc-700 text-amber-300'
                : 'bg-emerald-500 hover:bg-emerald-400 text-black'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Reprendre</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              setRemaining(0);
              sounds.playTimerDone();
            }}
            className="px-3 py-2 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold"
          >
            Passer
          </button>
        </div>
      </div>
    </div>
  );
}
