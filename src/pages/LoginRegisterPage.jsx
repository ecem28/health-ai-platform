import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AlertCircle } from 'lucide-react';

const LoginRegisterPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login, register } = useAuth();
  
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Engineer',
    university: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('tab') === 'register') {
      setIsLogin(false);
    }
  }, [location]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
        // Navigate based on role
        const storedUser = JSON.parse(localStorage.getItem('healthai_current_user'));
        if (storedUser?.role === 'Admin') navigate('/admin');
        else navigate('/dashboard');
      } else {
        await register(formData);
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-display)', marginBottom: '0.5rem' }}>
          Health <span className="hero-headline-ai">AI</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>Secure co-creation platform</p>
      </div>

      <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '450px', padding: '2.5rem' }}>
        
        <div style={{ display: 'flex', marginBottom: '2rem', borderBottom: '1px solid var(--border-color)' }}>
          <button 
            onClick={() => { setIsLogin(true); setError(''); }}
            style={{ 
              flex: 1, padding: '1rem', background: 'none', border: 'none', 
              color: isLogin ? 'var(--primary-brand)' : 'var(--text-secondary)',
              borderBottom: isLogin ? '2px solid var(--primary-brand)' : '2px solid transparent',
              fontWeight: isLogin ? '600' : '400', cursor: 'pointer', fontSize: '1.1rem'
            }}
          >
            Sign In
          </button>
          <button 
            onClick={() => { setIsLogin(false); setError(''); }}
            style={{ 
              flex: 1, padding: '1rem', background: 'none', border: 'none', 
              color: !isLogin ? 'var(--primary-brand)' : 'var(--text-secondary)',
              borderBottom: !isLogin ? '2px solid var(--primary-brand)' : '2px solid transparent',
              fontWeight: !isLogin ? '600' : '400', cursor: 'pointer', fontSize: '1.1rem'
            }}
          >
            Register
          </button>
        </div>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '1rem', borderRadius: '8px', color: 'var(--accent-danger)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <AlertCircle size={18} />
            <span style={{ fontSize: '0.9rem' }}>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input type="text" name="name" className="form-input" value={formData.name} onChange={handleChange} required />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Institutional Email (.edu required)</label>
            <input 
              type="email" 
              name="email" 
              className="form-input" 
              placeholder="name@university.edu"
              value={formData.email} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" name="password" className="form-input" value={formData.password} onChange={handleChange} required />
          </div>

          {!isLogin && (
            <>
              <div className="form-group">
                <label className="form-label">I am a...</label>
                <select name="role" className="form-input form-select" value={formData.role} onChange={handleChange} required>
                  <option value="Engineer">Engineer</option>
                  <option value="Healthcare Professional">Healthcare Professional</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">My Domain / Branch</label>
                <select name="domain" className="form-input form-select" value={formData.domain || ''} onChange={handleChange} required>
                  <option value="" disabled>Select Domain</option>
                  <option value="Cardiology Imaging">Cardiology Imaging</option>
                  <option value="Neurology AI">Neurology AI</option>
                  <option value="Surgical Robotics">Surgical Robotics</option>
                  <option value="Digital Therapeutics">Digital Therapeutics</option>
                  <option value="Orthopedic Tech">Orthopedic Tech</option>
                  <option value="General HealthTech">General HealthTech</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">University / Institute</label>
                <input 
                  type="text" 
                  name="university" 
                  className="form-input" 
                  placeholder="e.g. Stanford University"
                  value={formData.university || ''} 
                  onChange={handleChange} 
                  required 
                />
              </div>
            </>
          )}

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', padding: '0.8rem' }} disabled={loading}>
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>

      </div>
    </div>
  );
};

export default LoginRegisterPage;
