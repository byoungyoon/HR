'use client';

import { useShallow } from 'zustand/shallow';
import { useStore } from '../../store/useStore';
import { Type, Minus, Plus, RotateCcw } from 'lucide-react';

export default function FontSizeControllerAction() {
  const { fontSize, setFontSize } = useStore(
    useShallow(state => ({
      fontSize: state.fontSize,
      setFontSize: state.setFontSize,
    }))
  );

  const decreaseFontSize = () => {
    if (fontSize > 12) {
      setFontSize(fontSize - 1);
    }
  };

  const increaseFontSize = () => {
    if (fontSize < 24) {
      setFontSize(fontSize + 1);
    }
  };

  const resetFontSize = () => {
    setFontSize(18);
  };

  return (
    <div className="bg-neutral/90 border-neutral-border/30 flex items-center gap-1.5 rounded-2xl border p-1.5 shadow-lg backdrop-blur-md">
      <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-slate-800 text-white">
        <Type className="h-4 w-4" />
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={decreaseFontSize}
          disabled={fontSize <= 12}
          className="flex h-7 w-7 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
        >
          <Minus className="h-3.5 w-3.5" />
        </button>
        <span className="text-12 min-w-10 text-center font-bold text-white select-none">
          {fontSize}px
        </span>
        <button
          onClick={increaseFontSize}
          disabled={fontSize >= 24}
          className="flex h-7 w-7 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="h-4 w-px bg-slate-700" />
      <button
        onClick={resetFontSize}
        title="기본 크기로 초기화 (18px)"
        className="flex h-7 w-7 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white cursor-pointer"
      >
        <RotateCcw className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
