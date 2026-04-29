import { useState, useEffect } from 'react';
import api from '../services/api';
import { useSocket } from '../hooks/useSocket';

export default function DashboardHome() {
  const [symptoms, setSymptoms] = useState<any[]>([]);
  const socket = useSocket();
  
  useEffect(() => {
    async function fetchSymptoms() {
      try {
        const response = await api.get('/symptoms');
        setSymptoms(response.data.data || []);
      } catch (err) {
        console.error('Failed to fetch symptoms', err);
      }
    }
    fetchSymptoms();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('symptom_created', (newSymptom) => {
        setSymptoms((prevSymptoms) => [newSymptom, ...prevSymptoms]);
      });
    }

    return () => {
      if (socket) {
        socket.off('symptom_created');
      }
    };
  }, [socket]);

  return (
    <div>
      <h1 className="text-gradient" style={{ fontSize: '2.5rem' }}>Welcome to your Dashboard</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '1.1rem' }}>Here is an overview of your health context.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        
        {/* Simple Widget */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ margin: 0, color: 'var(--text-muted)', fontSize: '1rem' }}>Total Symptoms Logged</h3>
          <p style={{ fontSize: '3rem', fontWeight: 800, margin: '0.5rem 0', color: '#fff' }}>{symptoms.length}</p>
        </div>
        
      </div>
    </div>
  );
}
