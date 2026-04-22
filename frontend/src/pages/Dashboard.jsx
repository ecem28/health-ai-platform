import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getPosts } from '../services/postService';
import PostCard from '../components/PostCard';
import MeetingModal from '../components/MeetingModal';
import { Search, Filter, X } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [domainFilter, setDomainFilter] = useState('');
  
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const allPosts = await getPosts();
        const activePosts = allPosts.filter(p => p.status === 'Active' && p.authorId !== user.id);
        setPosts(activePosts);
        setFilteredPosts(activePosts);
      } catch (err) {
        console.error("Failed to fetch posts", err);
      }
    };
    fetchPosts();
  }, [user.id]);

  useEffect(() => {
    let result = posts;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        (p.title && p.title.toLowerCase().includes(q)) || 
        (p.shortExplanation && p.shortExplanation.toLowerCase().includes(q)) ||
        (p.desiredExpertise && p.desiredExpertise.toLowerCase().includes(q)) ||
        (p.domain && p.domain.toLowerCase().includes(q))
      );
    }
    if (cityFilter) {
      const c = cityFilter.toLowerCase();
      result = result.filter(p => p.city && p.city.toLowerCase().includes(c));
    }
    if (domainFilter) {
      result = result.filter(p => p.domain === domainFilter);
    }
    
    setFilteredPosts(result);
  }, [searchQuery, cityFilter, domainFilter, posts]);

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
            Find <span className="text-gradient-cyan">{user?.role === 'Engineer' ? 'Clinical Needs' : 'Engineering Talent'}</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            {user?.role === 'Engineer' 
              ? 'Browse clinical problems looking for your technical solutions.' 
              : 'Browse engineers looking to apply their skills to healthcare.'}
          </p>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 300px', display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', padding: '0 1rem', border: '1px solid var(--border-color)' }}>
          <Search size={20} color="var(--text-tertiary)" />
          <input 
            type="text" 
            placeholder="Search keywords..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ background: 'transparent', border: 'none', color: 'white', padding: '0.75rem', width: '100%', outline: 'none' }}
          />
        </div>
        
        <div style={{ flex: '1 1 200px', display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          <div style={{ padding: '0 1rem' }}><Filter size={18} color="var(--text-tertiary)" /></div>
          <select 
            value={domainFilter} 
            onChange={(e) => setDomainFilter(e.target.value)}
            className="form-select"
            style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', padding: '0.75rem 1rem 0.75rem 0', width: '100%', outline: 'none' }}
          >
            <option value="">All Domains</option>
            <option value="Cardiology Imaging">Cardiology Imaging</option>
            <option value="Neurology AI">Neurology AI</option>
            <option value="Surgical Robotics">Surgical Robotics</option>
            <option value="Digital Therapeutics">Digital Therapeutics</option>
          </select>
        </div>

        <div style={{ flex: '1 1 200px', display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          <input 
            type="text" 
            placeholder="City (e.g. Berlin)" 
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            style={{ background: 'transparent', border: 'none', color: 'white', padding: '0.75rem 1rem', width: '100%', outline: 'none' }}
          />
        </div>
      </div>

      {filteredPosts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-tertiary)' }}>
          <p>No announcements found matching your criteria.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
          {filteredPosts.map(post => (
            <PostCard 
              key={post.id} 
              post={post} 
              onClick={() => setSelectedPost(post)} 
            />
          ))}
        </div>
      )}

      {selectedPost && (
        <MeetingModal 
          post={selectedPost} 
          onClose={() => setSelectedPost(null)} 
          onSuccess={() => {
            setSelectedPost(null);
            alert('Meeting request sent successfully!');
          }} 
        />
      )}
    </div>
  );
};

export default Dashboard;
