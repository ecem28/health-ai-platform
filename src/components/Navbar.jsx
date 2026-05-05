import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { getUserMeetings, markMeetingAsRead } from '../services/meetingService';
import { Activity, LogOut, User, PlusCircle, LayoutDashboard, Shield, Bell, Check, Moon, Sun } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchMeetings = async () => {
      if (user) {
        try {
          const meetings = await getUserMeetings();
          const notifs = meetings.filter(m => 
            (m.receiverId === user.id && m.status === 'Pending') || 
            (m.requesterId === user.id && m.status === 'Scheduled' && m.isRead === 0)
          );
          setNotifications(notifs);
        } catch (err) {
          console.error(err);
        }
      }
    };
    fetchMeetings();
  }, [user, location]);

  const handleNotificationClick = async (notif) => {
    if (notif.requesterId === user.id && notif.status === 'Scheduled' && notif.isRead === 0) {
      try {
        await markMeetingAsRead(notif.id);
      } catch (e) {
        console.error(e);
      }
    }
    setShowNotifications(false);
    if (notif.receiverId === user.id) {
      navigate('/profile?tab=incoming');
    } else {
      navigate('/profile?tab=outgoing');
    }
  };

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
        <button 
          onClick={toggleTheme} 
          style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.5rem' }}
          title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        {user ? (
          <>
            {user.role === 'Admin' ? (
              <Link to="/admin" className="btn btn-secondary"><Shield size={18} /> Admin Dashboard</Link>
            ) : (
              <>
                <Link to="/dashboard" className="btn btn-secondary"><LayoutDashboard size={18} /> Dashboard</Link>
                <Link to="/create-post" className="btn btn-primary"><PlusCircle size={18} /> New Post</Link>
                <Link to="/profile" className="btn btn-secondary"><User size={18} /> My Profile & Requests</Link>
                
                <div ref={notifRef} style={{ position: 'relative' }}>
                  <button 
                    onClick={() => setShowNotifications(!showNotifications)}
                    style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.5rem', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)', transition: 'background 0.2s', border: 'none', cursor: 'pointer' }}
                  >
                    <Bell size={20} />
                    {notifications.length > 0 && (
                      <span style={{ position: 'absolute', top: 0, right: 0, background: 'var(--accent-danger)', color: 'white', fontSize: '0.65rem', fontWeight: 'bold', width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', transform: 'translate(25%, -25%)' }}>
                        {notifications.length}
                      </span>
                    )}
                  </button>
                  
                  {showNotifications && (
                    <div className="glass-panel animate-fade-in" style={{ position: 'absolute', top: '120%', right: 0, width: '300px', padding: '1rem', zIndex: 50, display: 'flex', flexDirection: 'column', gap: '0.5rem', border: '1px solid var(--border-color)', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
                      <h4 style={{ fontSize: '0.9rem', margin: '0 0 0.5rem 0', color: 'var(--text-secondary)' }}>Notifications</h4>
                      {notifications.length === 0 ? (
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', textAlign: 'center', margin: '1rem 0' }}>No new notifications</p>
                      ) : (
                        notifications.map(notif => (
                          <div 
                            key={notif.id} 
                            onClick={() => handleNotificationClick(notif)}
                            style={{ padding: '0.75rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', cursor: 'pointer', transition: 'background 0.2s', borderLeft: notif.status === 'Scheduled' ? '3px solid var(--accent-success)' : '3px solid var(--accent-warning)' }}
                            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                            onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                          >
                            {notif.receiverId === user.id ? (
                              <div>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>New request from</span>
                                <strong style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-primary)' }}>{notif.requesterName || 'A User'}</strong>
                              </div>
                            ) : (
                              <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--accent-success)' }}>
                                  <Check size={14} />
                                  <span style={{ fontSize: '0.8rem' }}>Meeting Approved</span>
                                </div>
                                <strong style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-primary)', marginTop: '0.25rem' }}>View details</strong>
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
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
