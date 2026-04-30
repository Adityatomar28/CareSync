import React, { useState, useEffect, useRef } from 'react';
import { UploadCloud, FileText, Download, Trash2, Loader2, AlertCircle } from 'lucide-react';
import api from '../services/api';

interface Report {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  notes?: string;
  uploadedAt: string;
}

export default function Reports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [notes, setNotes] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await api.get('/reports');
      setReports(res.data);
    } catch (err) {
      setError('Failed to load reports');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement> | any) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setError('');
    }
  };

  const handleUploadConfirm = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    if (notes.trim()) {
      formData.append('notes', notes.trim());
    }
    formData.append('file', selectedFile);

    try {
      setUploading(true);
      setError('');
      await api.post('/reports', formData);
      await fetchReports();
      setSelectedFile(null);
      setNotes('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      setError('Failed to upload file');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleCancelUpload = () => {
    setSelectedFile(null);
    setNotes('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this report?')) return;
    try {
      await api.delete(`/reports/${id}`);
      setReports(reports.filter(r => r.id !== id));
    } catch (err) {
      setError('Failed to delete report');
      console.error(err);
    }
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (selectedFile) return; // Prevent drop if already reviewing a file
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const fileInput = fileInputRef.current;
      if (fileInput) {
          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(files[0]);
          fileInput.files = dataTransfer.files;
          const event = { target: { files: dataTransfer.files } } as any;
          handleFileSelect(event);
      }
    }
  };

  return (
    <div className="animate-fade-in" style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }} className="text-gradient">
          Patient Reports
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Securely manage and access your medical reports and documents.
        </p>
      </div>

      {error && (
        <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '1rem', borderRadius: '12px', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      {/* Upload Area */}
      <div 
        className="glass-panel" 
        style={{ 
          padding: '3rem 2rem', 
          textAlign: 'center', 
          marginBottom: '2rem', 
          border: '2px dashed var(--glass-border)',
          cursor: selectedFile ? 'default' : 'pointer',
          transition: 'all 0.3s ease',
          background: 'rgba(255, 255, 255, 0.02)'
        }}
        onClick={() => !selectedFile && fileInputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
          onChange={handleFileSelect}
        />
        
        {selectedFile ? (
          <div style={{ textAlign: 'left', padding: '1rem', width: '100%', maxWidth: '500px', margin: '0 auto' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '12px' }}>
               <FileText size={32} color="var(--primary)" />
               <div style={{ overflow: 'hidden' }}>
                 <p style={{ fontWeight: 600, color: 'var(--text-main)', margin: 0, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{selectedFile.name}</p>
                 <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
               </div>
            </div>
            
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'var(--text-muted)' }}>Notes (Optional)</label>
              <textarea 
                placeholder="e.g., Blood test results for Dr. Smith" 
                rows={3} 
                value={notes} 
                onChange={(e) => setNotes(e.target.value)} 
                disabled={uploading}
                style={{ width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', borderRadius: '8px', padding: '0.75rem', color: 'var(--text-main)' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
               <button className="btn" onClick={handleUploadConfirm} disabled={uploading} style={{ flex: 1 }}>
                 {uploading ? <Loader2 size={20} className="animate-spin" /> : <UploadCloud size={20} />}
                 {uploading ? 'Uploading...' : 'Confirm Upload'}
               </button>
               <button className="btn btn-secondary" onClick={handleCancelUpload} disabled={uploading}>
                 Cancel
               </button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: 'var(--primary-glow)', padding: '1rem', borderRadius: '50%' }}>
              <UploadCloud size={40} color="var(--primary)" />
            </div>
            <div>
              <p style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                Click or drag file to this area to upload
              </p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                We support PDF, PNG, JPG, JPEG files.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Reports List */}
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1.5rem' }} className="text-gradient">
          Your Documents
        </h2>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
             <div className="skeleton" style={{ height: '220px', width: '100%' }}></div>
             <div className="skeleton" style={{ height: '220px', width: '100%' }}></div>
          </div>
        ) : reports.length === 0 ? (
          <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
            <FileText size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>No reports uploaded yet.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {reports.map((report) => (
              <div key={report.id} className="glass-panel card-hover" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
                    <div style={{ background: 'rgba(255,255,255,0.1)', padding: '0.75rem', borderRadius: '12px' }}>
                      <FileText size={24} color="var(--secondary)" />
                    </div>
                    <div style={{ overflow: 'hidden' }}>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={report.fileName}>
                        {report.fileName}
                      </h3>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                        Uploaded on {new Date(report.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  {report.notes && (
                    <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem' }}>
                      <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: 1.4 }}>
                        {report.notes}
                      </p>
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                  <a 
                    href={`http://localhost:5001/${report.fileUrl}`} 
                    download
                    target="_blank"
                    rel="noreferrer"
                    className="btn" 
                    style={{ flex: 1, padding: '0.5rem', fontSize: '0.9rem', textDecoration: 'none' }}
                  >
                    <Download size={16} /> Download
                  </a>
                  <button 
                    className="btn btn-secondary" 
                    onClick={() => handleDelete(report.id)}
                    style={{ padding: '0.5rem', color: 'var(--danger)' }}
                    title="Delete Report"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
