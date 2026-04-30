import { Link, useLocation } from 'react-router-dom';
import { Home, Pill, CalendarCheck, LogOut, HeartPulse, Activity, Calendar, MessageSquare, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
  const { logout, user } = useAuth();
  const location = useLocation();

  const links = [
    { to: '/dashboard', label: 'Overview', icon: <Home size={20} /> },
    { to: '/dashboard/calendar', label: 'Calendar', icon: <Calendar size={20} /> },
    { to: '/dashboard/chat', label: 'Health Assistant', icon: <MessageSquare size={20} /> },
    { to: '/dashboard/symptoms', label: 'Symptoms', icon: <Activity size={20} /> },
    { to: '/dashboard/medications', label: 'Medications', icon: <Pill size={20} /> },
    { to: '/dashboard/appointments', label: 'Appointments', icon: <CalendarCheck size={20} /> },
    { to: '/dashboard/reports', label: 'Reports', icon: <FileText size={20} /> },
  ];

  return (
    <div className="glass-panel" style={{ width: 'var(--sidebar-width)', height: 'calc(100vh - 2rem)', margin: '1rem', display: 'flex', flexDirection: 'column', position: 'fixed', left: 0, top: 0, borderRadius: '24px' }}>
      <div style={{ padding: '2rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ background: 'var(--primary)', padding: '0.5rem', borderRadius: '12px', display: 'flex', alignItems: 'center' }}>
          <HeartPulse size={24} color="white" />
        </div>
        <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }} className="text-gradient">SymptomSync</h2>
      </div>

      <nav style={{ flex: 1, padding: '0 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {links.map((link) => {
          const isActive = location.pathname === link.to;
          return (
            <Link
              key={link.to}
              to={link.to}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.875rem 1rem',
                borderRadius: '12px',
                color: isActive ? '#fff' : 'var(--text-muted)',
                background: isActive ? 'var(--primary)' : 'transparent',
                textDecoration: 'none',
                fontWeight: 600,
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                if (!isActive) (e.currentTarget.style.background = 'var(--glass-bg)');
              }}
              onMouseLeave={(e) => {
                if (!isActive) (e.currentTarget.style.background = 'transparent');
              }}
            >
              {link.icon}
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div style={{ padding: '1.5rem', borderTop: '1px solid var(--glass-border)' }}>
        <div style={{ marginBottom: '1rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Logged in as <br />
          <strong style={{ color: '#fff' }}>{user?.name || 'User'}</strong>
        </div>
        <button
          onClick={logout}
          className="btn btn-secondary"
          style={{ width: '100%', color: 'var(--danger)' }}
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </div>
  );
}
