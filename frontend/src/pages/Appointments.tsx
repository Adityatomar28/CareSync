import { useState, useEffect } from 'react';
import api from '../services/api';

export default function Appointments() {
  const [appointments, setAppointments] = useState<any[]>([]);

  useEffect(() => {
    async function fetchAppointments() {
      try {
        const response = await api.get('/appointments');
        setAppointments(response.data.data || []);
      } catch (err) {
        console.error('Failure', err);
      }
    }
    fetchAppointments();
  }, []);

  return (
    <div>
      <h1 className="text-gradient" style={{ fontSize: '2.5rem' }}>Upcoming Appointments</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Never miss a visit.</p>

      {appointments.length === 0 ? (
        <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          No upcoming appointments.
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {appointments.map((apt) => (
            <div key={apt.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: '4px solid var(--secondary)' }}>
              <div>
                <h3 style={{ margin: '0 0 0.5rem 0', color: '#fff', fontSize: '1.25rem' }}>{apt.doctorName} <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 400 }}>({apt.specialty})</span></h3>
                <p style={{ margin: 0, color: 'var(--text-muted)' }}>{apt.location}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)' }}>
                  {new Date(apt.date).toLocaleDateString()}
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--secondary)' }}>
                  {apt.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
