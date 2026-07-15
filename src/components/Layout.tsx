import { Outlet, useLocation } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { useEffect } from 'react';
import SelectModeAction from '../pages/_action/SelectMode.action';
import MenuSelectAction from '../pages/_action/MenuSelect.action';
import FontSizeControllerAction from '../pages/_action/FontSizeController.action';

export default function Layout() {
  const location = useLocation();
  const { currentRole, setCurrentRole, fontSize } = useStore();

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

  // Sync global HTML font-size with Zustand store
  useEffect(() => {
    document.documentElement.style.setProperty('--font-size', `${fontSize}px`);
  }, [fontSize]);

  const isAdmin = currentRole === 'admin';

  return (
    <div className="bg-foreground flex h-screen flex-col">
      <div className="fixed bottom-3 left-3 z-50">
        <SelectModeAction />
      </div>

      <div className="fixed bottom-3 right-3 z-50">
        <FontSizeControllerAction />
      </div>

      <main className="flex h-full w-full flex-1 flex-col">
        {isAdmin ? (
          <div className="flex h-full gap-8">
            <div className="h-full">
              <MenuSelectAction />
            </div>

            <div className="min-w-0 flex-1 space-y-6">
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
