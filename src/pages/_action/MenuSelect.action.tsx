'use client';

import { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';

type MenuItemProps = {
  to: string;
  label: string;
  icon: ReactNode;
  isSub?: boolean;
};

function MenuItem({ to, label, icon, isSub = false }: MenuItemProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `relative flex items-center gap-[10px] rounded-[10px] p-[9px_12px] text-[14px] transition-all duration-150 ${
          isActive
            ? 'bg-[oklch(0.5_0.06_260)] font-bold text-white shadow-sm'
            : 'font-medium text-[oklch(0.88_0.015_260)] hover:bg-[oklch(0.45_0.03_260)] hover:text-white'
        }`
      }
    >
      {({ isActive }) => (
        <>
          {isSub && (
            <span
              className={`absolute top-1/2 left-[-15px] h-2 w-2 -translate-y-1/2 rounded-full transition-all duration-150 ${
                isActive ? 'bg-[oklch(0.75_0.15_250)]' : 'bg-transparent'
              }`}
            />
          )}
          <span
            className={`flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-[9px] transition-all duration-150 ${
              isActive ? 'bg-[oklch(0.45_0.1_250)]' : 'bg-[oklch(0.46_0.025_260)]'
            }`}
          >
            {icon}
          </span>
          {label}
        </>
      )}
    </NavLink>
  );
}

export default function MenuSelectAction() {
  return (
    <div className="flex h-full w-[264px] shrink-0 flex-col gap-[30px] bg-[oklch(0.4_0.035_260)] p-[28px_18px]">
      {/* 로고 영역 */}
      <div className="flex items-center gap-[11px] px-[6px]">
        <div className="flex h-[38px] w-[38px] items-center justify-center rounded-[11px] bg-gradient-to-br from-[oklch(0.7_0.15_250)] to-[oklch(0.55_0.16_300)] text-[17px] font-extrabold text-white">
          H
        </div>
        <div>
          <div className="text-[15px] font-bold text-white">hakon HR</div>
          <div className="text-[12px] text-[oklch(0.8_0.02_260)]">전자계약 · 인사 운영</div>
        </div>
      </div>

      <div className="flex flex-col gap-[10px]">
        <div className="px-[10px] text-[11px] font-semibold tracking-[0.08em] text-[oklch(0.78_0.02_260)]">
          WORKSPACE
        </div>

        <div className="relative flex flex-col gap-[2px]">
          <MenuItem
            to="/admin/dashboard"
            label="대시보드"
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <rect
                  x="3"
                  y="3"
                  width="8"
                  height="8"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
                <rect
                  x="13"
                  y="3"
                  width="8"
                  height="8"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
                <rect
                  x="3"
                  y="13"
                  width="8"
                  height="8"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
                <rect
                  x="13"
                  y="13"
                  width="8"
                  height="8"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
              </svg>
            }
          />

          <MenuItem
            to="/admin/wizard"
            label="계약서 작성기"
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M6 3h9l5 5v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
                <path
                  d="M15 3v5h5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
              </svg>
            }
          />
        </div>

        <div className="mx-[10px] my-[6px] h-[1px] bg-[oklch(0.52_0.02_260)]" />

        <MenuItem
          to="/admin/cabinet"
          label="계약보관함"
          icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M4 7h16M4 12h16M4 17h10"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          }
        />

        <MenuItem
          to="/admin/academy"
          label="학원 정보 설정"
          icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
              <path
                d="M19 12a7 7 0 0 0-.1-1.2l2-1.5-2-3.4-2.3.9a7 7 0 0 0-2-1.2L14 3h-4l-.6 2.6a7 7 0 0 0-2 1.2l-2.3-.9-2 3.4 2 1.5A7 7 0 0 0 5 12c0 .4 0 .8.1 1.2l-2 1.5 2 3.4 2.3-.9a7 7 0 0 0 2 1.2L10 21h4l.6-2.6a7 7 0 0 0 2-1.2l2.3.9 2-3.4-2-1.5c.1-.4.1-.8.1-1.2z"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinejoin="round"
              />
            </svg>
          }
        />
      </div>
    </div>
  );
}
