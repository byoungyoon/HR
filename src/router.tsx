import { createBrowserRouter, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Wizard from './pages/wizard/Wizard';
import Cabinet from './pages/Cabinet';
import Logs from './pages/Logs';
import AcademyPage from './pages/Academy';
import Instructor from './pages/Instructor';
import { useStore } from './store/useStore';

function RootRedirect() {
  const currentRole = useStore(state => state.currentRole);
  if (currentRole === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  } else {
    return <Navigate to="/instructor" replace />;
  }
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <RootRedirect />,
      },
      {
        path: 'admin/dashboard',
        element: <Dashboard />,
      },
      {
        path: 'admin/wizard',
        element: <Wizard />,
      },
      {
        path: 'admin/cabinet',
        element: <Cabinet />,
      },
      {
        path: 'admin/logs',
        element: <Logs />,
      },
      {
        path: 'admin/academy',
        element: <AcademyPage />,
      },
      {
        path: 'instructor',
        element: <Instructor />,
      },
      {
        path: '*',
        element: <RootRedirect />,
      },
    ],
  },
]);
