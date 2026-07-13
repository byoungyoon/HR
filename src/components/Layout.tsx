import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Lock, Smartphone, Layers, Plus, FileText, Building } from 'lucide-react';
import { useEffect } from 'react';
import SelectModeAction from '../pages/_action/SelectMode.action';
import MenuSelectAction from '../pages/_action/MenuSelect.action';

export default function Layout() {
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

  const isAdmin = currentRole === 'admin';

  return (
    <div className="bg-foreground flex min-h-screen flex-col">
      <header className="bg-background border-b-custom-slate-border relative flex h-14 items-center justify-end border-b py-2 pr-4 shadow-xs transition-colors">
        <SelectModeAction />
      </header>

      <main className="mx-auto flex w-full max-w-[1660px] flex-1 flex-col p-8">
        {isAdmin ? (
          <div className="grid h-full flex-1 grid-cols-1 gap-6 lg:grid-cols-5">
            <div className="space-y-4 lg:col-span-1">
              <div className="bg-background h-full rounded-3xl p-3">
                <MenuSelectAction />
              </div>
            </div>

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
