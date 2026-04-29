import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

export default function DashboardLayout() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ flex: 1, marginLeft: 'calc(var(--sidebar-width) + 2rem)', padding: '2rem' }} className="animate-fade-in">
        <Outlet />
      </main>
    </div>
  );
}
