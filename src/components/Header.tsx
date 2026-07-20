'use client';

import { useState, useEffect } from 'react';
import { Moon, Building2, User, ChevronDown } from 'lucide-react';

export default function Header() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check initial dark mode state
    const isDarkClass = document.documentElement.classList.contains('dark');
    setIsDark(isDarkClass);
  }, []);

  const toggleDarkMode = () => {
    const root = document.documentElement;
    if (root.classList.contains('dark')) {
      root.classList.remove('dark');
      setIsDark(false);
    } else {
      root.classList.add('dark');
      setIsDark(true);
    }
  };

  return (
    <header className="flex h-[64px] w-full items-center justify-between border-b border-slate-100 bg-transparent px-[32px] dark:border-slate-800">
      {/* Left side empty space to push elements to the right */}
      <div />

      {/* Right side items */}
      <div className="flex items-center gap-[24px]">
        {/* Dark mode toggle */}
        <button
          onClick={toggleDarkMode}
          className="flex h-[40px] w-[40px] items-center justify-center rounded-[12px] text-slate-500 transition-colors hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-900"
          title="테마 변경"
        >
          <Moon className={`h-[20px] w-[20px] ${isDark ? 'fill-current text-indigo-400' : ''}`} />
        </button>

        {/* Divider */}
        <div className="h-[24px] w-[1px] bg-slate-200 dark:bg-slate-800" />

        {/* Academy selector */}
        <div className="flex cursor-pointer items-center gap-[8px] rounded-[12px] px-[12px] py-[8px] transition-colors hover:bg-slate-50 dark:hover:bg-slate-900">
          <Building2 className="h-[16px] w-[16px] text-indigo-600" />
          <span className="text-[14px] font-bold text-slate-800 dark:text-slate-200">
            반포점짱솔학원
          </span>
          <ChevronDown className="h-[14px] w-[14px] text-slate-400" />
        </div>

        {/* User profile dropdown */}
        <div className="flex cursor-pointer items-center gap-[12px] rounded-[12px] px-[8px] py-[6px] transition-colors hover:bg-slate-50 dark:hover:bg-slate-900">
          {/* Avatar circle */}
          <div className="flex h-[36px] w-[36px] items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
            <User className="h-[18px] w-[18px]" />
          </div>

          {/* User info */}
          <div className="flex flex-col text-left">
            <span className="text-[13px] font-bold text-slate-800 dark:text-slate-200 leading-tight">
              총관리자 님
            </span>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-550 leading-tight mt-0.5">
              원장
            </span>
          </div>

          <ChevronDown className="h-[14px] w-[14px] text-slate-400" />
        </div>
      </div>
    </header>
  );
}
