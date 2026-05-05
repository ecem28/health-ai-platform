import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getLogs } from '../services/auditService';
import { getAllUsers, toggleUserStatus } from '../services/authService';
import { getPosts, deletePost } from '../services/postService';
import { Activity, Users, Shield, FileText, Trash2, Download } from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('logs');
  const [logs, setLogs] = useState([]);
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  
  // Filters
  const [roleFilter, setRoleFilter] = useState('All');
  const [logDateFilter, setLogDateFilter] = useState('');
  const [logActionFilter, setLogActionFilter] = useState('All');

  const loadData = async () => {
    if (user?.role === 'Admin') {
      try {
        const logsData = await getLogs();
        const usersData = await getAllUsers();
        const postsData = await getPosts();
        setLogs(logsData);
        setUsers(usersData);
        setPosts(postsData);
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

  const handleDeletePost = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await deletePost(postId);
        loadData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleExportCSV = () => {
    if (logs.length === 0) return;
    const headers = ['Timestamp', 'User ID', 'Role', 'Action', 'Target Entity', 'Status', 'Additional Data'];
    const csvContent = [
      headers.join(','),
      ...filteredLogs.map(log => [
        new Date(log.timestamp).toISOString(),
        log.userId,
        log.role,
        log.actionType,
        log.targetEntity,
        log.resultStatus,
        `"${(log.additionalData || '').replace(/"/g, '""')}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `audit_logs_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredUsers = roleFilter === 'All' ? users : users.filter(u => u.role === roleFilter);
  const filteredLogs = logs.filter(l => {
    const dateMatch = !logDateFilter || new Date(l.timestamp).toISOString().split('T')[0] === logDateFilter;
    const actionMatch = logActionFilter === 'All' || l.actionType.includes(logActionFilter);
    return dateMatch && actionMatch;
  });

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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
              <h3 style={{ margin: 0 }}>System Audit Trail</h3>
              <button onClick={handleExportCSV} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
                <Download size={16} /> Export CSV
              </button>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ flex: 1 }}>
                <label className="form-label" style={{ fontSize: '0.8rem' }}>Filter by Date</label>
                <input 
                  type="date" 
                  className="form-input" 
                  value={logDateFilter} 
                  onChange={e => setLogDateFilter(e.target.value)} 
                  style={{ padding: '0.5rem' }} 
                />
              </div>
              <div style={{ flex: 1 }}>
                <label className="form-label" style={{ fontSize: '0.8rem' }}>Filter by Action</label>
                <select 
                  className="form-input form-select" 
                  value={logActionFilter} 
                  onChange={e => setLogActionFilter(e.target.value)}
                  style={{ padding: '0.5rem' }}
                >
                  <option value="All">All Actions</option>
                  <option value="LOGIN">LOGIN</option>
                  <option value="REGISTER">REGISTER</option>
                  <option value="POST_CREATE">POST_CREATE</option>
                  <option value="POST_DELETE">POST_DELETE</option>
                  <option value="POST_STATUS">POST_STATUS_UPDATE</option>
                </select>
              </div>
            </div>

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
                  {filteredLogs.map(log => (
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
                  {filteredLogs.length === 0 && <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-tertiary)' }}>No logs found matching filters.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="animate-fade-in glass-panel" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
              <h3 style={{ margin: 0 }}>User Management</h3>
              <select 
                className="form-input form-select" 
                value={roleFilter} 
                onChange={e => setRoleFilter(e.target.value)}
                style={{ width: 'auto', padding: '0.4rem 2rem 0.4rem 0.8rem', fontSize: '0.85rem' }}
              >
                <option value="All">All Roles</option>
                <option value="Doctor">Doctors</option>
                <option value="Engineer">Engineers</option>
                <option value="Admin">Admins</option>
              </select>
            </div>
            
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
                  {filteredUsers.map(u => (
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
                  {filteredUsers.length === 0 && <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-tertiary)' }}>No users found.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'posts' && (
          <div className="animate-fade-in glass-panel" style={{ padding: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>Content Moderation</h3>
            
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', textAlign: 'left' }}>
                    <th style={{ padding: '1rem 0.5rem' }}>Title</th>
                    <th style={{ padding: '1rem 0.5rem' }}>Author</th>
                    <th style={{ padding: '1rem 0.5rem' }}>Domain</th>
                    <th style={{ padding: '1rem 0.5rem' }}>Status</th>
                    <th style={{ padding: '1rem 0.5rem' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map(post => (
                    <tr key={post.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '1rem 0.5rem', fontWeight: '500' }}>{post.title}</td>
                      <td style={{ padding: '1rem 0.5rem' }}>{post.authorName}</td>
                      <td style={{ padding: '1rem 0.5rem' }}>{post.domain}</td>
                      <td style={{ padding: '1rem 0.5rem' }}>
                        <span className={`badge ${post.status === 'Active' ? 'badge-green' : 'badge-gray'}`}>{post.status}</span>
                      </td>
                      <td style={{ padding: '1rem 0.5rem' }}>
                        <button 
                          onClick={() => handleDeletePost(post.id)}
                          className="btn btn-danger"
                          style={{ padding: '0.35rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          title="Remove Post"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {posts.length === 0 && <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-tertiary)' }}>No posts found.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
