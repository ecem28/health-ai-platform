import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createPost } from '../services/postService';
import { ArrowRight, CheckCircle, Info } from 'lucide-react';

const CreatePost = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const isEngineer = user?.role === 'Engineer';

  const [formData, setFormData] = useState({
    title: '',
    domain: '',
    shortExplanation: '',
    desiredExpertise: '',
    commitmentLevel: 'Advisor',
    projectStage: 'Idea',
    country: '',
    city: '',
    // New fields
    highLevelIdea: '', // Engineer only
    confidentialityLevel: 'Public short pitch',
    expiryDate: '',
    autoClose: false
  });

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleNext = () => setStep(step + 1);
  const handlePrev = () => setStep(step - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createPost(formData);
      navigate('/dashboard');
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '800px' }}>
      <h1 style={{ marginBottom: '2rem', textAlign: 'center' }}>
        Create <span className="text-gradient-cyan">{isEngineer ? 'Engineering Partner Request' : 'Clinical Partner Request'}</span>
      </h1>
      
      <div className="glass-panel" style={{ padding: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '3rem', gap: '1rem' }}>
          {[1, 2, 3].map(s => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ 
                width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: step >= s ? (isEngineer ? '#3b82f6' : '#10b981') : 'rgba(255,255,255,0.1)',
                color: step >= s ? 'white' : 'var(--text-secondary)',
                fontWeight: '600'
              }}>
                {s}
              </div>
              {s < 3 && <div style={{ width: '40px', height: '2px', background: step > s ? (isEngineer ? '#3b82f6' : '#10b981') : 'rgba(255,255,255,0.1)' }}></div>}
            </div>
          ))}
        </div>

        <form onSubmit={step === 3 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }}>
          
          {step === 1 && (
            <div className="animate-fade-in">
              <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Basic Information</h3>
              <div className="form-group">
                <label className="form-label">Post Title</label>
                <input type="text" name="title" className="form-input" value={formData.title} onChange={handleChange} required placeholder="Catchy title for your request" />
              </div>
              <div className="form-group" style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label className="form-label">{isEngineer ? 'Working Domain' : 'Medical Field'}</label>
                  <select name="domain" className="form-input form-select" value={formData.domain} onChange={handleChange} required>
                    <option value="" disabled>Select Domain</option>
                    <option value="Cardiology Imaging">Cardiology Imaging</option>
                    <option value="Neurology AI">Neurology AI</option>
                    <option value="Surgical Robotics">Surgical Robotics</option>
                    <option value="Digital Therapeutics">Digital Therapeutics</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label className="form-label">Project Stage</label>
                  <select name="projectStage" className="form-input form-select" value={formData.projectStage} onChange={handleChange}>
                    <option value="Idea">Idea / Concept</option>
                    <option value="Concept Validation">Concept Validation</option>
                    <option value="Prototype Developed">Prototype Developed</option>
                    <option value="Pilot Testing">Pilot Testing</option>
                    <option value="Pre-deployment">Pre-deployment</option>
                  </select>
                </div>
              </div>
              <div className="form-group" style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label className="form-label">Country</label>
                  <input type="text" name="country" className="form-input" value={formData.country} onChange={handleChange} required />
                </div>
                <div style={{ flex: 1 }}>
                  <label className="form-label">City</label>
                  <input type="text" name="city" className="form-input" value={formData.city} onChange={handleChange} required />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-fade-in">
              <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Details & Requirements</h3>
              
              <div style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)', padding: '1rem', borderRadius: '8px', display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <Info size={20} color="#60a5fa" style={{ flexShrink: 0 }} />
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
                  <strong>Security Note:</strong> Do NOT include any confidential intellectual property, patent details, or patient data in these fields. Use high-level descriptions.
                </p>
              </div>

              <div className="form-group">
                <label className="form-label">Short Explanation</label>
                <textarea name="shortExplanation" className="form-input" rows="3" value={formData.shortExplanation} onChange={handleChange} required placeholder="Briefly explain the project context..." style={{ resize: 'vertical' }} />
              </div>

              {isEngineer && (
                <div className="form-group">
                  <label className="form-label">High-level Idea (Without revealing sensitive details)</label>
                  <textarea name="highLevelIdea" className="form-input" rows="3" value={formData.highLevelIdea} onChange={handleChange} required placeholder="Describe the proposed technical solution broadly..." style={{ resize: 'vertical' }} />
                </div>
              )}

              <div className="form-group">
                <label className="form-label">
                  {isEngineer ? 'Desired Healthcare Expertise Needed' : 'Desired Technical Expertise Needed'}
                </label>
                <input type="text" name="desiredExpertise" className="form-input" value={formData.desiredExpertise} onChange={handleChange} required placeholder={isEngineer ? "e.g. Cardiologist experienced with arrhythmias" : "e.g. Machine Learning engineer for timeseries data"} />
              </div>
              
              <div className="form-group">
                <label className="form-label">Level of Commitment Required</label>
                <select name="commitmentLevel" className="form-input form-select" value={formData.commitmentLevel} onChange={handleChange}>
                  <option value="Advisor (1-2 hours/month)">Advisor (1-2 hours/month)</option>
                  <option value="Research Partner (Weekly)">Research Partner (Weekly)</option>
                  <option value="Co-founder (Intensive)">Co-founder (Intensive)</option>
                </select>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-fade-in">
              <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Post Configuration</h3>
              
              <div className="form-group">
                <label className="form-label">Confidentiality Level</label>
                <select name="confidentialityLevel" className="form-input form-select" value={formData.confidentialityLevel} onChange={handleChange}>
                  <option value="Public short pitch">Public short pitch</option>
                  <option value="Details discussed in meeting only">Details discussed in meeting only</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Expiry Date</label>
                <input type="date" name="expiryDate" className="form-input" value={formData.expiryDate} onChange={handleChange} required />
              </div>

              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}>
                <input type="checkbox" name="autoClose" checked={formData.autoClose} onChange={handleChange} style={{ width: '18px', height: '18px' }} />
                <label className="form-label" style={{ margin: 0 }}>Auto-close post when a meeting is scheduled</label>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '2rem' }}>
                <h4 style={{ margin: '0 0 1rem 0', color: isEngineer ? '#3b82f6' : '#10b981' }}>Preview: {formData.title}</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  <div><strong>Domain:</strong> {formData.domain}</div>
                  <div><strong>Stage:</strong> {formData.projectStage}</div>
                  <div style={{ gridColumn: '1 / -1' }}><strong>Seeking:</strong> {formData.desiredExpertise}</div>
                  <div style={{ gridColumn: '1 / -1' }}><strong>Confidentiality:</strong> {formData.confidentialityLevel}</div>
                </div>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
            {step > 1 ? (
              <button type="button" className="btn btn-secondary" onClick={handlePrev}>Back</button>
            ) : <div></div>}
            
            {step < 3 ? (
              <button type="submit" className="btn btn-primary" style={{ background: isEngineer ? '' : 'linear-gradient(135deg, #059669, #10b981)' }}>
                Next <ArrowRight size={18} />
              </button>
            ) : (
              <button type="submit" className="btn btn-primary" disabled={loading} style={{ background: isEngineer ? '' : 'linear-gradient(135deg, #059669, #10b981)' }}>
                {loading ? 'Publishing...' : <><CheckCircle size={18} /> Publish Announcement</>}
              </button>
            )}
          </div>

        </form>
      </div>
    </div>
  );
};

export default CreatePost;
