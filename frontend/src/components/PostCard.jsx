import React from 'react';
import { MapPin, Briefcase, Clock, ChevronRight } from 'lucide-react';

const PostCard = ({ post, onClick }) => {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Active': return <span className="badge badge-green">Active</span>;
      case 'Draft': return <span className="badge badge-gray">Draft</span>;
      case 'Meeting Scheduled': return <span className="badge badge-orange">Meeting Scheduled</span>;
      case 'Closed': return <span className="badge badge-purple">Closed</span>;
      default: return <span className="badge badge-gray">{status}</span>;
    }
  };

  return (
    <div 
      className="glass-panel glass-panel-interactive" 
      style={{ padding: '1.5rem', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '1rem' }}
      onClick={onClick}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
            {getStatusBadge(post.status)}
            <span className="badge badge-blue">{post.domain}</span>
          </div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{post.title}</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Seeking: <span style={{ color: 'var(--text-primary)', fontWeight: '500' }}>{post.desiredExpertise}</span>
          </p>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.5rem', borderRadius: '8px' }}>
          {post.authorRole === 'Engineer' ? (
            <span style={{ fontSize: '0.8rem', color: '#60a5fa', fontWeight: '600' }}>ENG</span>
          ) : (
            <span style={{ fontSize: '0.8rem', color: '#34d399', fontWeight: '600' }}>MED</span>
          )}
        </div>
      </div>

      <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
        {post.shortExplanation}
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>
          <MapPin size={14} />
          {post.city}, {post.country}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>
          <Briefcase size={14} />
          {post.projectStage}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>
          <Clock size={14} />
          {post.commitmentLevel}
        </div>
        <div style={{ marginLeft: 'auto', color: 'var(--primary-brand)', display: 'flex', alignItems: 'center', fontSize: '0.9rem', fontWeight: '500' }}>
          View Details <ChevronRight size={16} />
        </div>
      </div>
    </div>
  );
};

export default PostCard;
