import { useState, useEffect } from 'react';
import api from '../services/api';
import { useSocket } from '../hooks/useSocket';
import { Activity, Brain, Thermometer, AlertCircle } from 'lucide-react';

export default function Symptoms() {
  const [symptoms, setSymptoms] = useState<any[]>([]);
  const [symptomName, setSymptomName] = useState('');
  const [severity, setSeverity] = useState(5);
  const [notes, setNotes] = useState('');
  const socket = useSocket();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSymptoms() {
      try {
        const response = await api.get('/symptoms');
        setSymptoms(response.data.data || []);
      } catch (err) {
        console.error('Failure to fetch symptoms', err);
      } finally {
        setLoading(false);
      }
    }
    fetchSymptoms();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('symptom_created', (newSymptom) => {
        setSymptoms((prev) => {
          if (prev.some(s => s.id === newSymptom.id)) return prev;
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      await api.post('/symptoms', { symptomName, severity, notes });
      setSymptomName('');
      setSeverity(5);
      setNotes('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add symptom');
    }
  };

  const getSeverityColor = (sev: number) => {
    if (sev <= 3) return { bg: 'rgba(16, 185, 129, 0.1)', text: '#10b981' };
    if (sev <= 7) return { bg: 'rgba(245, 158, 11, 0.1)', text: '#f59e0b' };
    return { bg: 'rgba(239, 68, 68, 0.1)', text: '#ef4444' };
  };

  const getSymptomIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('fever') || n.includes('temperature')) return <Thermometer size={24} />;
    if (n.includes('headache') || n.includes('migraine')) return <Brain size={24} />;
    return <Activity size={24} />;
  };

  return (
    <div className="animate-fade-in">
      <h1 className="text-gradient" style={{ fontSize: '2.5rem' }}>Your Symptoms</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Log and track your health conditions.</p>

      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <h3 style={{ margin: '0 0 1rem 0', color: '#fff' }}>Log a New Symptom</h3>
        {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><AlertCircle size={16} /> {error}</div>}
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
          <div className="form-group">
            <label>Symptom</label>
            <input type="text" value={symptomName} onChange={(e) => setSymptomName(e.target.value)} required placeholder="e.g., Headache, Fever" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Severity (1-10)</label>
              <input type="number" min="1" max="10" value={severity} onChange={(e) => setSeverity(parseInt(e.target.value))} required />
            </div>
            <div className="form-group">
              <label>Notes</label>
              <input type="text" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional details..." />
            </div>
          </div>
          <button type="submit" className="btn" style={{ justifySelf: 'start' }}>Log Symptom</button>
        </form>
      </div>

      {loading ? (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: '100px' }} />)}
        </div>
      ) : symptoms.length === 0 ? (
        <div className="glass-panel" style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <Activity size={64} style={{ opacity: 0.2, marginBottom: '1rem' }} />
          <h3 style={{ color: '#fff', marginBottom: '0.5rem' }}>No symptoms logged yet</h3>
          <p>Your logged symptoms will appear here.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {symptoms.map((sym) => {
            const colors = getSeverityColor(sym.severity);
            return (
              <div key={sym.id} className="glass-panel card-hover" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <div style={{ background: colors.bg, color: colors.text, padding: '1rem', borderRadius: '12px' }}>
                    {getSymptomIcon(sym.symptomName)}
                  </div>
                  <div>
                    <h3 style={{ margin: '0 0 0.5rem 0', color: '#fff', fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      {sym.symptomName} 
                      <span style={{ fontSize: '0.875rem', fontWeight: 600, color: colors.text, background: colors.bg, padding: '0.25rem 0.75rem', borderRadius: '20px' }}>
                        Sev {sym.severity}
                      </span>
                    </h3>
                    {sym.notes && <p style={{ margin: 0, color: 'var(--text-muted)' }}>{sym.notes}</p>}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.875rem', color: 'var(--primary)', background: 'var(--primary-glow)', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>
                    {new Date(sym.timestamp).toLocaleString()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
