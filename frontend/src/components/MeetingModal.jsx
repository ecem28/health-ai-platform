import React, { useState } from 'react';
import { X, ShieldAlert, CheckCircle } from 'lucide-react';
import { requestMeeting } from '../services/meetingService';

const MeetingModal = ({ post, onClose, onSuccess }) => {
  const [message, setMessage] = useState('');
  const [ndaAccepted, setNdaAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!ndaAccepted) {
      alert('You must accept the Non-Disclosure Agreement to send a meeting request.');
      return;
    }
    setLoading(true);
    try {
      await requestMeeting(post.id, post.authorId, message);
      onSuccess();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
      padding: '1rem'
    }}>
      <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '600px', backgroundColor: 'var(--bg-surface)' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Request Meeting</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} style={{ padding: '1.5rem' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>You are requesting a meeting regarding:</p>
            <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{post.title}</h3>
              <p style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>{post.domain}</p>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Introductory Message</label>
            <textarea 
              className="form-input" 
              rows="4" 
              placeholder="Briefly introduce yourself and why you're a good fit..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              style={{ resize: 'vertical' }}
            />
          </div>

          <div style={{ 
            background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', 
            padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'flex-start'
          }}>
            <ShieldAlert size={24} color="var(--accent-success)" style={{ flexShrink: 0 }} />
            <div>
              <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--accent-success)' }}>Confidentiality Agreement (NDA)</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
                By proceeding, you agree to maintain strict confidentiality regarding any proprietary information, ideas, or intellectual property discussed during the initial meeting. You understand that this platform facilitates first contact only and does not store technical IP or patient data.
              </p>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={ndaAccepted} 
                  onChange={(e) => setNdaAccepted(e.target.checked)} 
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>I accept the Non-Disclosure Agreement</span>
              </label>
            </div>
          </div>

          {error && <div style={{ color: 'var(--accent-danger)', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={!ndaAccepted || loading}>
              {loading ? 'Sending...' : (
                <>
                  <CheckCircle size={18} /> Send Request
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MeetingModal;
