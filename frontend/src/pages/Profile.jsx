import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getPosts, updatePostStatus } from '../services/postService';
import { getUserMeetings, updateMeetingStatus } from '../services/meetingService';
import { FileText, Inbox, Send, Calendar, Check, X as XIcon, Clock } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('posts');
  
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [location]);
  
  const [myPosts, setMyPosts] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [outgoingRequests, setOutgoingRequests] = useState([]);

  const loadData = async () => {
    try {
      const posts = await getPosts({ authorId: user.id });
      setMyPosts(posts);
      const meetings = await getUserMeetings();
      // the schema we had in requestMeeting saved receiverId, wait let's check backend
      // wait, in my backend I used receiverId and requesterId
      setIncomingRequests(meetings.filter(m => m.receiverId === user.id || m.targetUserId === user.id));
      setOutgoingRequests(meetings.filter(m => m.requesterId === user.id));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const handlePostStatusChange = async (postId, newStatus) => {
    try {
      await updatePostStatus(postId, newStatus);
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleMeetingResponse = async (meetingId, newStatus, time = null) => {
    try {
      await updateMeetingStatus(meetingId, newStatus, time);
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="container" style={{ display: 'flex', gap: '2rem', minHeight: '80vh' }}>
      {/* Sidebar */}
      <div style={{ width: '250px', flexShrink: 0 }}>
        <div className="glass-panel" style={{ padding: '1rem', position: 'sticky', top: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', padding: '0 0.5rem' }}>
            My <span className="text-gradient-cyan">Profile</span>
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <button 
              onClick={() => setActiveTab('posts')}
              style={{ background: activeTab === 'posts' ? 'rgba(255,255,255,0.1)' : 'transparent', border: 'none', color: activeTab === 'posts' ? 'white' : 'var(--text-secondary)', padding: '0.75rem 1rem', borderRadius: '8px', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <FileText size={18} /> My Announcements
            </button>
            <button 
              onClick={() => setActiveTab('incoming')}
              style={{ background: activeTab === 'incoming' ? 'rgba(255,255,255,0.1)' : 'transparent', border: 'none', color: activeTab === 'incoming' ? 'white' : 'var(--text-secondary)', padding: '0.75rem 1rem', borderRadius: '8px', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Inbox size={18} /> Incoming Requests
              {incomingRequests.filter(m => m.status === 'Pending').length > 0 && (
                <span style={{ marginLeft: 'auto', background: 'var(--accent-warning)', color: 'black', padding: '0.1rem 0.4rem', borderRadius: '99px', fontSize: '0.7rem', fontWeight: 'bold' }}>
                  {incomingRequests.filter(m => m.status === 'Pending').length}
                </span>
              )}
            </button>
            <button 
              onClick={() => setActiveTab('outgoing')}
              style={{ background: activeTab === 'outgoing' ? 'rgba(255,255,255,0.1)' : 'transparent', border: 'none', color: activeTab === 'outgoing' ? 'white' : 'var(--text-secondary)', padding: '0.75rem 1rem', borderRadius: '8px', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Send size={18} /> Outgoing Requests
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1 }}>
        {activeTab === 'posts' && (
          <div className="animate-fade-in glass-panel" style={{ padding: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>My Announcements</h3>
            {myPosts.length === 0 ? <p style={{ color: 'var(--text-tertiary)' }}>You haven't posted any announcements yet.</p> : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {myPosts.map(post => (
                  <div key={post.id} style={{ border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1.5rem', background: 'rgba(0,0,0,0.2)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                      <div>
                        <h4 style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>{post.title}</h4>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <span className={`badge ${post.status === 'Active' ? 'badge-green' : post.status === 'Closed' ? 'badge-purple' : 'badge-gray'}`}>{post.status}</span>
                          <span className="badge badge-blue">{post.domain}</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => navigate(`/edit-post/${post.id}`)} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>Edit</button>
                        {post.status !== 'Closed' && (
                          <button onClick={() => handlePostStatusChange(post.id, 'Closed')} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', color: '#a78bfa', borderColor: 'rgba(139, 92, 246, 0.3)' }}>Mark Partner Found</button>
                        )}
                        {post.status === 'Active' && (
                          <button onClick={() => handlePostStatusChange(post.id, 'Draft')} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>Archive</button>
                        )}
                        {post.status === 'Draft' && (
                          <button onClick={() => handlePostStatusChange(post.id, 'Active')} className="btn btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>Publish</button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'incoming' && (
          <div className="animate-fade-in glass-panel" style={{ padding: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>Incoming Meeting Requests</h3>
            {incomingRequests.length === 0 ? <p style={{ color: 'var(--text-tertiary)' }}>No incoming requests.</p> : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {incomingRequests.map(req => {
                  const post = myPosts.find(p => p.id === req.postId);
                  return (
                    <div key={req.id} style={{ border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1.5rem', background: 'rgba(0,0,0,0.2)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <div>
                          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Regarding your post: <strong>{post?.title || 'Unknown Post'}</strong></span>
                          <h4 style={{ margin: '0.5rem 0 0.25rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            {req.requesterName || 'A User'}
                            <span className="badge badge-blue">{req.requesterDomain || 'Unknown Branch'}</span>
                          </h4>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>{req.requesterRole}</span>
                        </div>
                        <span className={`badge ${req.status === 'Pending' ? 'badge-orange' : req.status === 'Scheduled' ? 'badge-green' : 'badge-gray'}`}>{req.status}</span>
                      </div>
                      
                      <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                        <p style={{ margin: 0, fontStyle: 'italic', color: 'var(--text-primary)' }}>"{req.message}"</p>
                      </div>

                      {req.status === 'Pending' && (
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                          <button onClick={() => {
                            const time = prompt("Enter proposed meeting time (e.g. Next Tuesday 2PM via Zoom):");
                            if (time) handleMeetingResponse(req.id, 'Scheduled', time);
                          }} className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>
                            <Calendar size={16} /> Propose Time & Accept
                          </button>
                          <button onClick={() => handleMeetingResponse(req.id, 'Cancelled')} className="btn btn-danger" style={{ padding: '0.5rem 1rem' }}>
                            <XIcon size={16} /> Decline
                          </button>
                        </div>
                      )}
                      {req.status === 'Scheduled' && req.proposedTime && (
                        <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-success)', padding: '0.75rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '8px' }}>
                          <Clock size={18} />
                          <div>
                            <span style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Meeting Scheduled</span>
                            <strong style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>{req.proposedTime}</strong>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'outgoing' && (
          <div className="animate-fade-in glass-panel" style={{ padding: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>Outgoing Requests</h3>
            {outgoingRequests.length === 0 ? <p style={{ color: 'var(--text-tertiary)' }}>No outgoing requests.</p> : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {outgoingRequests.map(req => {
                  return (
                    <div key={req.id} style={{ border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1.5rem', background: 'rgba(0,0,0,0.2)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <div>
                          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>You requested a meeting for post ID: {req.postId}</span>
                        </div>
                        <span className={`badge ${req.status === 'Pending' ? 'badge-orange' : req.status === 'Scheduled' ? 'badge-green' : 'badge-gray'}`}>{req.status}</span>
                      </div>
                      <p style={{ margin: 0, fontStyle: 'italic', color: 'var(--text-tertiary)' }}>"{req.message}"</p>
                      {req.status === 'Scheduled' && req.proposedTime && (
                        <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-success)', padding: '0.75rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '8px' }}>
                          <Clock size={18} />
                          <div>
                            <span style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Meeting accepted! Scheduled for:</span>
                            <strong style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>{req.proposedTime}</strong>
                          </div>
                        </div>
                      )}
                      {req.status === 'Pending' && (
                         <button onClick={() => handleMeetingResponse(req.id, 'Cancelled')} className="btn btn-secondary" style={{ marginTop: '1rem', padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
                           Cancel Request
                         </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
