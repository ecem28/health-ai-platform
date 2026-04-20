import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserMeetings } from '../services/meetingService';
import { Activity, LogOut, User, PlusCircle, LayoutDashboard, Shield, Bell } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [pendingRequests, setPendingRequests] = useState(0);

  useEffect(() => {
    const fetchMeetings = async () => {
      if (user) {
        try {
          const meetings = await getUserMeetings();
          // Adjust targetUserId to receiverId based on our backend schema
          const pending = meetings.filter(m => m.receiverId === user.id && m.status === 'Pending');
          setPendingRequests(pending.length);
        } catch (err) {
          console.error(err);
        }
      }
    };
    fetchMeetings();
  }, [user, location]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="glass-panel" style={{ margin: '1rem', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--primary-brand)', fontSize: '1.25rem', fontWeight: '700' }}>
        <Activity size={28} />
        <span>HEALTH <span className="hero-headline-ai">AI</span></span>
      </Link>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        {user ? (
          <>
            {user.role === 'Admin' ? (
              <Link to="/admin" className="btn btn-secondary"><Shield size={18} /> Admin Dashboard</Link>
            ) : (
              <>
                <Link to="/dashboard" className="btn btn-secondary"><LayoutDashboard size={18} /> Dashboard</Link>
                <Link to="/create-post" className="btn btn-primary"><PlusCircle size={18} /> New Post</Link>
                <Link to="/profile" className="btn btn-secondary"><User size={18} /> My Profile & Requests</Link>
                
                <Link to="/profile?tab=incoming" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.5rem', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)', transition: 'background 0.2s' }}>
                  <Bell size={20} />
                  {pendingRequests > 0 && (
                    <span style={{ position: 'absolute', top: 0, right: 0, background: 'var(--accent-danger)', color: 'white', fontSize: '0.65rem', fontWeight: 'bold', width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', transform: 'translate(25%, -25%)' }}>
                      {pendingRequests}
                    </span>
                  )}
                </Link>
              </>
            )}
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: '1px solid var(--border-color)', paddingLeft: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>{user.name}</span>
                <span className="badge badge-blue">{user.role}</span>
              </div>
              <button onClick={handleLogout} className="btn btn-danger" style={{ padding: '0.5rem' }} title="Logout">
                <LogOut size={18} />
              </button>
            </div>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-secondary">Sign In</Link>
            <Link to="/login?tab=register" className="btn btn-primary">Join Platform</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
