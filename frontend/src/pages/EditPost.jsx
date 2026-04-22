import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getPostById, editPost } from '../services/postService';
import { ArrowRight, CheckCircle, Info } from 'lucide-react';

const EditPost = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const isEngineer = user?.role === 'Engineer';

  const [formData, setFormData] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const post = await getPostById(id);
        if (!post) {
          alert('Post not found');
          navigate('/profile');
          return;
        }
        if (post.authorId !== user.id) {
          alert('Unauthorized');
          navigate('/profile');
          return;
        }
        setFormData(post);
      } catch (err) {
        console.error("Failed to fetch post:", err);
      } finally {
        setInitialLoading(false);
      }
    };
    fetchPost();
  }, [id, user, navigate]);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await editPost(id, formData);
      alert('Post updated successfully!');
      navigate('/profile');
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) return <div className="container" style={{ textAlign: 'center', marginTop: '4rem' }}>Loading...</div>;

  return (
    <div className="container" style={{ maxWidth: '800px' }}>
      <h1 style={{ marginBottom: '2rem', textAlign: 'center' }}>
        Edit Announcement
      </h1>
      
      <div className="glass-panel" style={{ padding: '2.5rem' }}>
        <form onSubmit={handleSubmit}>
          
          <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Basic Information</h3>
          <div className="form-group">
            <label className="form-label">Post Title</label>
            <input type="text" name="title" className="form-input" value={formData.title} onChange={handleChange} required />
          </div>
          <div className="form-group" style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ flex: 1 }}>
              <label className="form-label">{isEngineer ? 'Working Domain' : 'Medical Field'}</label>
              <input type="text" name="domain" className="form-input" value={formData.domain} onChange={handleChange} required />
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

          <h3 style={{ marginBottom: '1.5rem', marginTop: '2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Details & Requirements</h3>
          
          <div className="form-group">
            <label className="form-label">Short Explanation</label>
            <textarea name="shortExplanation" className="form-input" rows="3" value={formData.shortExplanation} onChange={handleChange} required style={{ resize: 'vertical' }} />
          </div>

          {formData.highLevelIdea !== undefined && (
            <div className="form-group">
              <label className="form-label">High-level Idea</label>
              <textarea name="highLevelIdea" className="form-input" rows="3" value={formData.highLevelIdea} onChange={handleChange} required style={{ resize: 'vertical' }} />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Desired Expertise Needed</label>
            <input type="text" name="desiredExpertise" className="form-input" value={formData.desiredExpertise} onChange={handleChange} required />
          </div>
          
          <div className="form-group">
            <label className="form-label">Level of Commitment Required</label>
            <select name="commitmentLevel" className="form-input form-select" value={formData.commitmentLevel} onChange={handleChange}>
              <option value="Advisor (1-2 hours/month)">Advisor (1-2 hours/month)</option>
              <option value="Research Partner (Weekly)">Research Partner (Weekly)</option>
              <option value="Co-founder (Intensive)">Co-founder (Intensive)</option>
            </select>
          </div>

          <h3 style={{ marginBottom: '1.5rem', marginTop: '2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Post Configuration</h3>
          
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
            <input type="checkbox" name="autoClose" checked={formData.autoClose || false} onChange={handleChange} style={{ width: '18px', height: '18px' }} />
            <label className="form-label" style={{ margin: 0 }}>Auto-close post when a meeting is scheduled</label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : <><CheckCircle size={18} /> Save Changes</>}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default EditPost;
