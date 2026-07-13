'use client';

import { NavLink } from 'react-router-dom';

export default function MenuSelectAction() {
  const menuItems = [
    {
      to: '/admin/dashboard',
      title: '대시보드',
      sub: '학원 현황 및 통계',
    },
    {
      to: '/admin/wizard',
      title: '계약서 작성',
      sub: '신속 마법사 및 계약서 생성',
    },
    {
      to: '/admin/cabinet',
      title: '계약서 보관함',
      sub: '작성 완료된 계약서 보관',
    },
    {
      to: '/admin/academy',
      title: '학원 정보 설정',
      sub: '대표자 및 학원 정보 관리',
    },
  ];

  return (
    <nav>
      {menuItems.map(item => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `relative flex w-full flex-col items-start rounded-2xl p-4 transition-all duration-200 ${
              isActive ? 'bg-custom-indigo-bg' : 'hover:bg-slate-50'
            }`
          }
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <div className="bg-custom-indigo absolute top-1/2 left-0 h-10 w-[5px] -translate-y-1/2 rounded-r-full" />
              )}
              <span
                className={`text-15 font-bold transition-colors ${
                  isActive ? 'text-custom-indigo' : 'text-slate-700'
                }`}
              >
                {item.title}
              </span>
              <span
                className={`text-11 mt-0.5 transition-colors ${
                  isActive ? 'text-custom-indigo-side font-bold' : 'text-text-side font-medium'
                }`}
              >
                {item.sub}
              </span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
