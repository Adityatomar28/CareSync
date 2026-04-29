import { useState, useEffect } from 'react';
import api from '../services/api';

export default function Medications() {
  const [medications, setMedications] = useState<any[]>([]);

  useEffect(() => {
    async function fetchMedications() {
      try {
        const response = await api.get('/medications');
        setMedications(response.data.data || []);
      } catch (err) {
        console.error('Failure to fetch meds', err);
      }
    }
    fetchMedications();
  }, []);

  return (
    <div>
      <h1 className="text-gradient" style={{ fontSize: '2.5rem' }}>Your Medications</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Keep track of your active prescriptions.</p>

      {medications.length === 0 ? (
        <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          No medications active right now.
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {medications.map((med) => (
            <div key={med.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: '0 0 0.5rem 0', color: '#fff', fontSize: '1.25rem' }}>{med.name}</h3>
                <p style={{ margin: 0, color: 'var(--text-muted)' }}>{med.dosage} - {med.frequency}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.875rem', color: 'var(--primary)', background: 'var(--primary-glow)', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>
                  Since {new Date(med.startDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
