import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useSocket } from '../hooks/useSocket';
import { Activity, Pill, CalendarCheck, TrendingUp, TrendingDown, Thermometer, Brain, Stethoscope, Clock } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function DashboardHome() {
  const [symptoms, setSymptoms] = useState<any[]>([]);
  const [medications, setMedications] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);
  const socket = useSocket();

  useEffect(() => {
    async function fetchData() {
      try {
        const [symRes, medRes, apptRes] = await Promise.all([
          api.get('/symptoms'),
          api.get('/medications'),
          api.get('/appointments')
        ]);
        setSymptoms(symRes.data.data || []);
        setMedications(medRes.data.data || []);
        setAppointments(apptRes.data.data || []);
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('symptom_created', (newSymptom) => {
        setSymptoms((prev) => {
          if (prev.some(s => s.id === newSymptom.id)) return prev;
          setRecentlyAddedId(newSymptom.id);
          setTimeout(() => setRecentlyAddedId(null), 2000);
          return [newSymptom, ...prev];
        });
      });
    }

    return () => {
      if (socket) {
        socket.off('symptom_created');
      }
    };
  }, [socket]);

  // Derive some stats
  const scheduledAppointments = appointments.filter(a => a.status === 'SCHEDULED');
  const upcomingAppointments = scheduledAppointments.slice(0, 3);
  const recentSymptoms = symptoms.slice(0, 3);

  const getSeverityColor = (severity: number) => {
    if (severity <= 3) return { bg: 'rgba(16, 185, 129, 0.1)', text: '#10b981' };
    if (severity <= 7) return { bg: 'rgba(245, 158, 11, 0.1)', text: '#f59e0b' };
    return { bg: 'rgba(239, 68, 68, 0.1)', text: '#ef4444' };
  };

  const getSymptomIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('fever') || n.includes('temperature')) return <Thermometer size={16} />;
    if (n.includes('headache') || n.includes('migraine')) return <Brain size={16} />;
    return <Activity size={16} />;
  };

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays > 1 && diffDays < 7) return `In ${diffDays} days`;
    return date.toLocaleDateString();
  };

  // Prepare chart data (sort chronologically)
  const chartData = [...symptoms].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()).map(sym => ({
    date: new Date(sym.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    severity: sym.severity,
    name: sym.symptomName
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ background: 'var(--bg-gradient-end)', border: '1px solid var(--glass-border)', padding: '1rem', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.3)' }}>
          <p style={{ margin: '0 0 0.5rem 0', color: 'var(--text-muted)', fontSize: '0.875rem' }}>{label}</p>
          <p style={{ margin: 0, color: '#fff', fontWeight: 600 }}>
            {payload[0].payload.name}: <span style={{ color: 'var(--primary)' }}>{payload[0].value}/10</span>
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="animate-fade-in">
        <h1 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Loading Dashboard...</h1>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
          {[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: '140px' }} />)}
        </div>
        <div className="skeleton" style={{ height: '300px', marginBottom: '2rem' }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
          <div className="skeleton" style={{ height: '300px' }} />
          <div className="skeleton" style={{ height: '300px' }} />
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
        <h1 className="text-gradient" style={{ fontSize: '2.5rem', margin: 0 }}>Welcome to your Dashboard</h1>
        {socket && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--glass-bg)', padding: '0.5rem 1rem', borderRadius: '20px', border: '1px solid var(--glass-border)' }}>
            <div className="live-dot" />
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--secondary)' }}>Live Sync</span>
          </div>
        )}
      </div>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '1.1rem' }}>Here is an overview of your health context.</p>

      {/* Summary Widgets */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <div className="glass-panel card-hover" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '1.25rem', borderRadius: '16px', color: '#3b82f6' }}>
            <Activity size={36} />
          </div>
          <div>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Symptoms</p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginTop: '0.25rem' }}>
              <h2 style={{ margin: 0, fontSize: '3rem', color: '#fff', lineHeight: 1 }}>{symptoms.length}</h2>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem', color: 'var(--danger)', fontWeight: 600 }}>
                <TrendingUp size={16} /> 12%
              </span>
            </div>
          </div>
        </div>
        
        <div className="glass-panel card-hover" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ background: 'rgba(168, 85, 247, 0.1)', padding: '1.25rem', borderRadius: '16px', color: '#a855f7' }}>
            <Pill size={36} />
          </div>
          <div>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Active Meds</p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginTop: '0.25rem' }}>
              <h2 style={{ margin: 0, fontSize: '3rem', color: '#fff', lineHeight: 1 }}>{medications.length}</h2>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem', color: 'var(--secondary)', fontWeight: 600 }}>
                <TrendingDown size={16} /> 2
              </span>
            </div>
          </div>
        </div>

        <div className="glass-panel card-hover" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ background: 'rgba(236, 72, 153, 0.1)', padding: '1.25rem', borderRadius: '16px', color: '#ec4899' }}>
            <CalendarCheck size={36} />
          </div>
          <div>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Appointments</p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginTop: '0.25rem' }}>
              <h2 style={{ margin: 0, fontSize: '3rem', color: '#fff', lineHeight: 1 }}>{scheduledAppointments.length}</h2>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem', color: 'var(--secondary)', fontWeight: 600 }}>
                Next: {upcomingAppointments.length > 0 ? getRelativeTime(upcomingAppointments[0].date) : 'None'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Trend Graph */}
      <div className="glass-panel card-hover" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <h3 style={{ margin: '0 0 1.5rem 0', color: '#fff' }}>Overall Health Trend <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>(Symptom Severity)</span></h3>
        {chartData.length < 2 ? (
          <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
            Log at least 2 symptoms to see your health trend.
          </div>
        ) : (
          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                <XAxis dataKey="date" stroke="var(--text-muted)" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} tickLine={false} axisLine={false} />
                <YAxis domain={[0, 10]} stroke="var(--text-muted)" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="severity" stroke="var(--primary)" strokeWidth={3} dot={{ r: 4, fill: 'var(--bg-gradient-start)', stroke: 'var(--primary)', strokeWidth: 2 }} activeDot={{ r: 6, fill: 'var(--primary)' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
        {/* Recent Symptoms */}
        <div className="glass-panel card-hover" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ margin: 0, color: '#fff' }}>Recent Symptoms</h3>
            <Link to="/dashboard/symptoms" style={{ color: 'var(--primary)', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 600, background: 'var(--primary-glow)', padding: '0.5rem 1rem', borderRadius: '20px' }}>View All</Link>
          </div>
          {recentSymptoms.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-muted)' }}>
              <Activity size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
              <p>No recent symptoms logged.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              {recentSymptoms.map(sym => {
                const colors = getSeverityColor(sym.severity);
                return (
                  <div key={sym.id} className={sym.id === recentlyAddedId ? 'highlight-pulse' : ''} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ background: colors.bg, color: colors.text, padding: '0.5rem', borderRadius: '8px' }}>
                        {getSymptomIcon(sym.symptomName)}
                      </div>
                      <div>
                        <strong style={{ color: '#fff', display: 'block', fontSize: '1.1rem' }}>{sym.symptomName}</strong>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(sym.timestamp).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <span style={{ fontSize: '0.875rem', fontWeight: 700, color: colors.text, background: colors.bg, padding: '0.25rem 0.75rem', borderRadius: '20px' }}>
                      Sev {sym.severity}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Upcoming Appointments */}
        <div className="glass-panel card-hover" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ margin: 0, color: '#fff' }}>Upcoming Appointments</h3>
            <Link to="/dashboard/appointments" style={{ color: 'var(--primary)', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 600, background: 'var(--primary-glow)', padding: '0.5rem 1rem', borderRadius: '20px' }}>View All</Link>
          </div>
          {upcomingAppointments.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-muted)' }}>
              <CalendarCheck size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
              <p>No upcoming appointments.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              {upcomingAppointments.map(appt => (
                <div key={appt.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ background: 'var(--glass-bg)', padding: '0.75rem', borderRadius: '50%', border: '1px solid var(--glass-border)' }}>
                      <Stethoscope size={20} color="var(--primary)" />
                    </div>
                    <div>
                      <strong style={{ color: '#fff', display: 'block', fontSize: '1.1rem' }}>Dr. {appt.doctorName}</strong>
                      <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{appt.specialty || 'General'}</span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)', background: 'var(--glass-bg)', padding: '0.25rem 0.75rem', borderRadius: '20px' }}>
                      <Clock size={12} /> {getRelativeTime(appt.date)}
                    </span>
                    <br />
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'inline-block', marginTop: '0.25rem' }}>{new Date(appt.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
