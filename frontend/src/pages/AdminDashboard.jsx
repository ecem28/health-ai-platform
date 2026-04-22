import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getLogs } from '../services/auditService';
import { getAllUsers, toggleUserStatus } from '../services/authService';
import { Activity, Users, Shield, FileText } from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('logs');
  const [logs, setLogs] = useState([]);
  const [users, setUsers] = useState([]);

  const loadData = async () => {
    if (user?.role === 'Admin') {
      try {
        const logsData = await getLogs();
        const usersData = await getAllUsers();
        setLogs(logsData);
        setUsers(usersData);
      } catch (err) {
        console.error(err);
      }
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  if (user?.role !== 'Admin') {
    return <div className="container" style={{ textAlign: 'center', marginTop: '4rem' }}><h2>Unauthorized Access</h2></div>;
  }

  const handleToggleUser = async (userId, currentStatus) => {
    try {
      const success = await toggleUserStatus(userId, !currentStatus);
      if (success !== false) {
        loadData(); // refresh
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container" style={{ display: 'flex', gap: '2rem', minHeight: '80vh' }}>
      
      {/* Sidebar */}
      <div style={{ width: '250px', flexShrink: 0 }}>
        <div className="glass-panel" style={{ padding: '1rem', position: 'sticky', top: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', padding: '0 0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Shield size={20} color="var(--primary-brand)" /> <span className="text-gradient-cyan">Admin Panel</span>
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <button 
              onClick={() => setActiveTab('logs')}
              style={{ background: activeTab === 'logs' ? 'rgba(255,255,255,0.1)' : 'transparent', border: 'none', color: activeTab === 'logs' ? 'white' : 'var(--text-secondary)', padding: '0.75rem 1rem', borderRadius: '8px', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'var(--transition-fast)' }}
            >
              <Activity size={18} /> Audit Logs
            </button>
            <button 
              onClick={() => setActiveTab('users')}
              style={{ background: activeTab === 'users' ? 'rgba(255,255,255,0.1)' : 'transparent', border: 'none', color: activeTab === 'users' ? 'white' : 'var(--text-secondary)', padding: '0.75rem 1rem', borderRadius: '8px', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'var(--transition-fast)' }}
            >
              <Users size={18} /> User Management
            </button>
            <button 
              onClick={() => setActiveTab('posts')}
              style={{ background: activeTab === 'posts' ? 'rgba(255,255,255,0.1)' : 'transparent', border: 'none', color: activeTab === 'posts' ? 'white' : 'var(--text-secondary)', padding: '0.75rem 1rem', borderRadius: '8px', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'var(--transition-fast)' }}
            >
              <FileText size={18} /> Content Moderation
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1 }}>
        {activeTab === 'logs' && (
          <div className="animate-fade-in glass-panel" style={{ padding: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>System Audit Trail</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              Comprehensive logging of all platform activities ensuring tamper-resistant compliance tracking.
            </p>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', textAlign: 'left' }}>
                    <th style={{ padding: '1rem 0.5rem' }}>Timestamp</th>
                    <th style={{ padding: '1rem 0.5rem' }}>User Role</th>
                    <th style={{ padding: '1rem 0.5rem' }}>Action</th>
                    <th style={{ padding: '1rem 0.5rem' }}>Target</th>
                    <th style={{ padding: '1rem 0.5rem' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map(log => (
                    <tr key={log.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '1rem 0.5rem', color: 'var(--text-tertiary)' }}>{new Date(log.timestamp).toLocaleString()}</td>
                      <td style={{ padding: '1rem 0.5rem' }}>{log.role}</td>
                      <td style={{ padding: '1rem 0.5rem', fontWeight: '500' }}>{log.actionType}</td>
                      <td style={{ padding: '1rem 0.5rem' }}>{log.targetEntity}</td>
                      <td style={{ padding: '1rem 0.5rem' }}>
                        <span className={`badge ${log.resultStatus === 'SUCCESS' ? 'badge-green' : 'badge-red'}`}>{log.resultStatus}</span>
                      </td>
                    </tr>
                  ))}
                  {logs.length === 0 && <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-tertiary)' }}>No logs found.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="animate-fade-in glass-panel" style={{ padding: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>User Management</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', textAlign: 'left' }}>
                    <th style={{ padding: '1rem 0.5rem' }}>Name</th>
                    <th style={{ padding: '1rem 0.5rem' }}>Email (.edu)</th>
                    <th style={{ padding: '1rem 0.5rem' }}>Role</th>
                    <th style={{ padding: '1rem 0.5rem' }}>Status</th>
                    <th style={{ padding: '1rem 0.5rem' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '1rem 0.5rem', fontWeight: '500' }}>{u.name}</td>
                      <td style={{ padding: '1rem 0.5rem' }}>{u.email}</td>
                      <td style={{ padding: '1rem 0.5rem' }}><span className="badge badge-blue">{u.role}</span></td>
                      <td style={{ padding: '1rem 0.5rem' }}>
                        <span className={`badge ${u.isActive ? 'badge-green' : 'badge-red'}`}>{u.isActive ? 'Active' : 'Suspended'}</span>
                      </td>
                      <td style={{ padding: '1rem 0.5rem' }}>
                        {u.role !== 'Admin' && (
                          <button 
                            onClick={() => handleToggleUser(u.id, u.isActive)}
                            className={`btn ${u.isActive ? 'btn-danger' : 'btn-secondary'}`}
                            style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem' }}
                          >
                            {u.isActive ? 'Suspend' : 'Reactivate'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'posts' && (
          <div className="animate-fade-in glass-panel" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-tertiary)' }}>
            <FileText size={48} style={{ margin: '0 auto 1rem auto', opacity: 0.5 }} />
            <h3>Content Moderation</h3>
            <p>Admin moderation views are simplified for this demo.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
