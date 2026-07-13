import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '@/src/store/useStore';
import { Lock, Smartphone } from 'lucide-react';
import { useShallow } from 'zustand/shallow';

export default function SelectModeAction() {
  const { currentRole, setCurrentRole } = useStore(
    useShallow(state => ({
      currentRole: state.currentRole,
      setCurrentRole: state.setCurrentRole,
    }))
  );

  const navigate = useNavigate();
  const location = useLocation();

  const handleAdminSwitch = () => {
    setCurrentRole('admin');
    navigate('/admin/dashboard');
  };

  const handleInstructorSwitch = () => {
    setCurrentRole('instructor');
    navigate('/instructor');
  };

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
    <div className="bg-neutral flex items-center gap-1.5 rounded-2xl p-1.5">
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
  );
}
