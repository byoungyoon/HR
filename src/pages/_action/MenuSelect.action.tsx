'use client';

import { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';

type MenuItemProps = {
  to: string;
  label: string;
  icon: ReactNode;
};

function MenuItem({ to, label, icon }: MenuItemProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `relative flex items-center gap-[10px] rounded-[10px] p-[9px_12px] text-[14px] cursor-pointer transition-all duration-150 ${
          isActive
            ? 'bg-[oklch(0.347_0.042_267.6)] font-semibold text-white'
            : 'font-medium text-[oklch(0.88_0.015_260)] hover:bg-[oklch(0.32_0.03_260)] hover:text-white'
        }`
      }
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
}

export default function MenuSelectAction() {
  return (
    <div className="flex h-full w-[264px] shrink-0 flex-col gap-[30px] bg-[oklch(0.25_0.035_260)] p-[28px_18px] text-[oklch(0.94_0.01_260)]">
      {/* 로고 영역 */}
      <div className="flex flex-col items-center gap-[2px] px-[6px]">
        <div className="flex items-center gap-[6px]">
          <div>
            <img src="/assets/wh_logo-zOOw48sH.png" alt="hakon HR" className="h-[28px]" />
          </div>
          <div className="mb-[4px] flex items-center justify-center rounded-[8px] bg-[rgb(20,_61,_153)] p-[6px_8px] text-[16px] font-bold text-white">
            HR
          </div>
        </div>
        <div>
          <div className="text-[12px] text-[oklch(0.8_0.02_260)]">
            전자계약에서 시작하는 학원 인사 운영
          </div>
        </div>
      </div>

      {/* 메뉴 그룹 */}
      <div className="flex flex-col gap-[10px]">
        <div className="relative flex flex-col gap-[2px]">
          <MenuItem
            to="/admin/dashboard"
            label="대시보드"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-layout-dashboard"
                aria-hidden="true"
              >
                <rect width="7" height="9" x="3" y="3" rx="1" />
                <rect width="7" height="5" x="14" y="3" rx="1" />
                <rect width="7" height="9" x="14" y="12" rx="1" />
                <rect width="7" height="5" x="3" y="16" rx="1" />
              </svg>
            }
          />
          <MenuItem
            to="/admin/wizard"
            label="계약서 작성기"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-file-text"
                aria-hidden="true"
              >
                <path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z" />
                <path d="M14 2v5a1 1 0 0 0 1 1h5" />
                <path d="M10 9H8" />
                <path d="M16 13H8" />
                <path d="M16 17H8" />
              </svg>
            }
          />
        </div>

        <div className="mx-[10px] my-[6px] h-[1px] bg-[oklch(0.52_0.02_260)]" />

        <MenuItem
          to="/admin/cabinet"
          label="계약보관함"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-package"
              aria-hidden="true"
            >
              <path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z" />
              <path d="M12 22V12" />
              <polyline points="3.29 7 12 12 20.71 7" />
              <path d="m7.5 4.27 9 5.15" />
            </svg>
          }
        />
      </div>
    </div>
  );
}
