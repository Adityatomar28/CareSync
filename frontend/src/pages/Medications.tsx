import { useState, useEffect } from 'react';
import api from '../services/api';
import { Trash2, Pill } from 'lucide-react';

export default function Medications() {
  const [medications, setMedications] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('');
  const [startDate, setStartDate] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchMedications = async () => {
    try {
      const response = await api.get('/medications');
      setMedications(response.data.data || []);
    } catch (err) {
      console.error('Failure to fetch meds', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedications();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      await api.post('/medications', { name, dosage, frequency, startDate, notes });
      setName('');
      setDosage('');
      setFrequency('');
      setStartDate('');
      setNotes('');
      fetchMedications();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add medication');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/medications/${id}`);
      setMedications((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      console.error('Failed to delete medication', err);
    }
  };

  return (
    <div className="animate-fade-in">
      <h1 className="text-gradient" style={{ fontSize: '2.5rem' }}>Your Medications</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Keep track of your active prescriptions.</p>

      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <h3 style={{ margin: '0 0 1rem 0', color: '#fff' }}>Add New Medication</h3>
        {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem' }}>{error}</div>}
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div className="form-group">
              <label>Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="e.g., Amoxicillin" />
            </div>
            <div className="form-group">
              <label>Dosage</label>
              <input type="text" value={dosage} onChange={(e) => setDosage(e.target.value)} required placeholder="e.g., 500mg" />
            </div>
            <div className="form-group">
              <label>Frequency</label>
              <input type="text" value={frequency} onChange={(e) => setFrequency(e.target.value)} required placeholder="e.g., Twice a day" />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div className="form-group">
              <label>Start Date</label>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Notes</label>
              <input type="text" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Take with food..." />
            </div>
          </div>
          <button type="submit" className="btn" style={{ justifySelf: 'start' }}>Add Medication</button>
        </form>
      </div>

      {loading ? (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: '90px' }} />)}
        </div>
      ) : medications.length === 0 ? (
        <div className="glass-panel" style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <Pill size={64} style={{ opacity: 0.2, marginBottom: '1rem' }} />
          <h3 style={{ color: '#fff', marginBottom: '0.5rem' }}>No active medications</h3>
          <p>Add your first prescription above.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {medications.map((med) => (
            <div key={med.id} className="glass-panel card-hover" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: '0 0 0.5rem 0', color: '#fff', fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Pill size={20} color="var(--primary)" /> {med.name}
                </h3>
                <p style={{ margin: 0, color: 'var(--text-muted)' }}>{med.dosage} - {med.frequency}</p>
                {med.notes && <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Note: {med.notes}</p>}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontSize: '0.875rem', color: 'var(--primary)', background: 'var(--primary-glow)', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>
                  Since {new Date(med.startDate).toLocaleDateString()}
                </span>
                <button
                  onClick={() => handleDelete(med.id)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: '0.5rem', borderRadius: '50%', transition: 'background 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  title="Delete Medication"
                >
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
