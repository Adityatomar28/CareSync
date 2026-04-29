import { useState, useEffect } from 'react';
import api from '../services/api';
import { Trash2, CheckCircle, XCircle, CalendarCheck, Stethoscope, Clock } from 'lucide-react';

export default function Appointments() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [doctorName, setDoctorName] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    try {
      const response = await api.get('/appointments');
      setAppointments(response.data.data || []);
    } catch (err) {
      console.error('Failure to fetch appointments', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      await api.post('/appointments', { doctorName, specialty, date, location, notes });
      setDoctorName('');
      setSpecialty('');
      setDate('');
      setLocation('');
      setNotes('');
      fetchAppointments();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to schedule appointment');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/appointments/${id}`);
      setAppointments((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      console.error('Failed to delete appointment', err);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await api.patch(`/appointments/${id}/status`, { status });
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status } : a))
      );
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Past';
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    return `In ${diffDays} days`;
  };

  return (
    <div className="animate-fade-in">
      <h1 className="text-gradient" style={{ fontSize: '2.5rem' }}>Your Appointments</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Manage your upcoming medical visits.</p>

      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <h3 style={{ margin: '0 0 1rem 0', color: '#fff' }}>Schedule New Appointment</h3>
        {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem' }}>{error}</div>}
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div className="form-group">
              <label>Doctor Name</label>
              <input type="text" value={doctorName} onChange={(e) => setDoctorName(e.target.value)} required placeholder="Dr. Smith" />
            </div>
            <div className="form-group">
              <label>Specialty</label>
              <input type="text" value={specialty} onChange={(e) => setSpecialty(e.target.value)} placeholder="Cardiologist" />
            </div>
            <div className="form-group">
              <label>Date & Time</label>
              <input type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} required />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div className="form-group">
              <label>Location</label>
              <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Clinic Address" />
            </div>
            <div className="form-group">
              <label>Notes</label>
              <input type="text" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Bring medical records..." />
            </div>
          </div>
          <button type="submit" className="btn" style={{ justifySelf: 'start' }}>Schedule Appointment</button>
        </form>
      </div>

      {loading ? (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: '120px' }} />)}
        </div>
      ) : appointments.length === 0 ? (
        <div className="glass-panel" style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <CalendarCheck size={64} style={{ opacity: 0.2, marginBottom: '1rem' }} />
          <h3 style={{ color: '#fff', marginBottom: '0.5rem' }}>No upcoming appointments</h3>
          <p>Schedule your next visit above.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {appointments.map((appt) => (
            <div key={appt.id} className="glass-panel card-hover" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: appt.status === 'CANCELLED' ? 0.6 : 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div style={{ background: 'var(--glass-bg)', padding: '1rem', borderRadius: '50%', border: '1px solid var(--glass-border)' }}>
                  <Stethoscope size={32} color="var(--primary)" />
                </div>
                <div>
                  <h3 style={{ margin: '0 0 0.5rem 0', color: '#fff', fontSize: '1.25rem', textDecoration: appt.status === 'CANCELLED' ? 'line-through' : 'none', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    Dr. {appt.doctorName}
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 'normal', textDecoration: 'none' }}>
                      {appt.specialty && `• ${appt.specialty}`}
                    </span>
                  </h3>
                  <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: appt.status === 'SCHEDULED' ? 'var(--primary)' : 'inherit' }}>
                      <Clock size={14} /> {getRelativeTime(appt.date)} ({new Date(appt.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})})
                    </span>
                    {appt.location && <span>• {appt.location}</span>}
                  </div>
                  {appt.notes && <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Note: {appt.notes}</p>}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{
                  fontSize: '0.875rem', fontWeight: 700, padding: '0.5rem 1rem', borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '0.05em',
                  color: appt.status === 'SCHEDULED' ? '#fbbf24' : appt.status === 'COMPLETED' ? '#34d399' : '#f87171',
                  background: appt.status === 'SCHEDULED' ? 'rgba(251, 191, 36, 0.1)' : appt.status === 'COMPLETED' ? 'rgba(52, 211, 153, 0.1)' : 'rgba(248, 113, 113, 0.1)'
                }}>
                  {appt.status}
                </span>

                {appt.status === 'SCHEDULED' && (
                  <div style={{ display: 'flex', gap: '0.5rem', marginLeft: '0.5rem' }}>
                    <button onClick={() => handleStatusChange(appt.id, 'COMPLETED')} style={{ background: 'transparent', border: 'none', color: '#34d399', cursor: 'pointer', padding: '0.5rem', borderRadius: '50%', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(52, 211, 153, 0.1)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'} title="Mark Completed">
                      <CheckCircle size={22} />
                    </button>
                    <button onClick={() => handleStatusChange(appt.id, 'CANCELLED')} style={{ background: 'transparent', border: 'none', color: '#f87171', cursor: 'pointer', padding: '0.5rem', borderRadius: '50%', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(248, 113, 113, 0.1)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'} title="Cancel Appointment">
                      <XCircle size={22} />
                    </button>
                  </div>
                )}

                <button onClick={() => handleDelete(appt.id)} style={{ background: 'transparent', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: '0.5rem', marginLeft: '0.5rem', borderRadius: '50%', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'} title="Delete Record">
                  <Trash2 size={22} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
