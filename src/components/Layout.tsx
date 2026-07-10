import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../store/useStore';
import {
  Lock,
  Smartphone,
  Layers,
  Plus,
  FileText,
  History,
  Building,
  Sparkles,
} from 'lucide-react';
import { useEffect } from 'react';

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentRole, setCurrentRole, toast, showToast, eventLogs, academies } = useStore();

  // Sync role state with active route on initial load/reload
  useEffect(() => {
    if (location.pathname.startsWith('/admin')) {
      if (currentRole !== 'admin') {
        setCurrentRole('admin');
      }
    } else if (location.pathname.startsWith('/instructor')) {
      if (currentRole !== 'instructor') {
        setCurrentRole('instructor');
      }
    }
  }, [location.pathname]);

  const handleAdminSwitch = () => {
    setCurrentRole('admin');
    showToast('원장 관리 모드로 진입하였습니다.', 'info');
    navigate('/admin/dashboard');
  };

  const handleInstructorSwitch = () => {
    setCurrentRole('instructor');
    showToast('강사 마이페이지 모드로 진입하였습니다.', 'info');
    navigate('/instructor');
  };

  const isAdmin = currentRole === 'admin';

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 font-sans text-slate-800">
      {/* 토스트 알림창 */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center space-x-2 rounded-xl border px-5 py-3 text-xs font-semibold shadow-lg ${
            toast.type === 'success'
              ? 'border-emerald-100 bg-emerald-50 text-emerald-800'
              : toast.type === 'warning'
                ? 'border-amber-100 bg-amber-50 text-amber-800'
                : 'border-indigo-100 bg-indigo-50 text-indigo-800'
          }`}
        >
          <span>{toast.text}</span>
        </div>
      )}

      {/* 플로팅 역할 전환 스위처 */}
      <div className="fixed bottom-4 left-4 z-50 flex items-center gap-1.5 rounded-2xl border border-slate-800 bg-slate-900/95 p-1.5 shadow-2xl backdrop-blur-md">
        <button
          id="role-switch-admin"
          onClick={handleAdminSwitch}
          className={`flex items-center space-x-1.5 rounded-xl px-3 py-1.5 text-[11px] font-bold transition-all ${
            isAdmin ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Lock className="h-3 w-3" />
          <span>원장(관리자)</span>
        </button>
        <button
          id="role-switch-instructor"
          onClick={handleInstructorSwitch}
          className={`flex items-center space-x-1.5 rounded-xl px-3 py-1.5 text-[11px] font-bold transition-all ${
            !isAdmin ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Smartphone className="h-3 w-3" />
          <span>강사 마이페이지</span>
        </button>
      </div>

      {/* 메인 컨텐츠 */}
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col p-4 sm:p-6 lg:p-8">
        {isAdmin ? (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
            {/* 좌측 탭 목록 - Bento Control Panel */}
            <div className="space-y-4 lg:col-span-1">
              <div className="rounded-3xl border border-slate-100 bg-white/95 p-5 shadow-[0_2px_14px_-4px_rgba(0,0,0,0.04),0_12px_24px_-10px_rgba(0,0,0,0.03)] backdrop-blur-sm transition-all duration-300 hover:shadow-md">
                <p className="mb-3.5 text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                  메인 컨트롤
                </p>
                <nav className="space-y-1.5">
                  <NavLink
                    to="/admin/dashboard"
                    className={({ isActive }) =>
                      `flex w-full items-center space-x-3 rounded-2xl px-4 py-3 text-left text-xs font-bold transition-all duration-200 ${
                        isActive
                          ? 'scale-[1.02] bg-slate-900 text-white shadow-lg shadow-slate-900/10'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`
                    }
                  >
                    <Layers className="h-4 w-4" />
                    <span>대시보드</span>
                  </NavLink>
                  <NavLink
                    to="/admin/wizard"
                    className={({ isActive }) =>
                      `flex w-full items-center space-x-3 rounded-2xl px-4 py-3 text-left text-xs font-bold transition-all duration-200 ${
                        isActive
                          ? 'scale-[1.02] bg-slate-900 text-white shadow-lg shadow-slate-900/10'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`
                    }
                  >
                    <Plus className="h-4 w-4" />
                    <span className="flex-1">계약서 작성기</span>
                    <span className="rounded bg-indigo-100 px-1.5 py-0.5 text-[9px] font-extrabold text-indigo-700">
                      EC-01
                    </span>
                  </NavLink>
                  <NavLink
                    to="/admin/cabinet"
                    className={({ isActive }) =>
                      `flex w-full items-center space-x-3 rounded-2xl px-4 py-3 text-left text-xs font-bold transition-all duration-200 ${
                        isActive
                          ? 'scale-[1.02] bg-slate-900 text-white shadow-lg shadow-slate-900/10'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`
                    }
                  >
                    <FileText className="h-4 w-4" />
                    <span className="flex-1">계약보관함</span>
                    <span className="rounded bg-slate-100 px-1 py-0.5 font-mono text-[8px] text-slate-500">
                      P1
                    </span>
                  </NavLink>
                  <NavLink
                    to="/admin/logs"
                    className={({ isActive }) =>
                      `flex w-full items-center space-x-3 rounded-2xl px-4 py-3 text-left text-xs font-bold transition-all duration-200 ${
                        isActive
                          ? 'scale-[1.02] bg-slate-900 text-white shadow-lg shadow-slate-900/10'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`
                    }
                  >
                    <History className="h-4 w-4" />
                    <span className="flex-1">시스템 감사로그</span>
                    <span className="font-mono text-xs font-bold text-slate-400">
                      {eventLogs.length}
                    </span>
                  </NavLink>
                  <NavLink
                    to="/admin/academy"
                    className={({ isActive }) =>
                      `flex w-full items-center space-x-3 rounded-2xl px-4 py-3 text-left text-xs font-bold transition-all duration-200 ${
                        isActive
                          ? 'scale-[1.02] bg-slate-900 text-white shadow-lg shadow-slate-900/10'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`
                    }
                  >
                    <Building className="h-4 w-4" />
                    <span className="flex-1">학원 정보 설정</span>
                    <span className="font-mono text-xs font-bold text-slate-400">
                      {academies.length}
                    </span>
                  </NavLink>
                </nav>
              </div>
            </div>

            {/* 우측 본문 */}
            <div className="space-y-6 lg:col-span-4">
              <Outlet />
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <Outlet />
          </div>
        )}
      </main>
    </div>
  );
}
