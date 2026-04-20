import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Stethoscope, Cpu, ShieldCheck, ChevronDown as MouseDown } from 'lucide-react';
import logoUrl from '../assets/logo.png';

const LandingPage = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let rafId;
    let isFading = false;
    
    // 0.5s fade in/out
    const fadeDuration = 500; 

    const updateOpacity = () => {
      if (!video) return;
      const duration = video.duration;
      const currentTime = video.currentTime;
      
      if (isNaN(duration)) {
        rafId = requestAnimationFrame(updateOpacity);
        return;
      }

      if (currentTime < fadeDuration / 1000) {
        // Fade in
        video.style.opacity = (currentTime / (fadeDuration / 1000)).toString();
      } else if (currentTime > duration - (fadeDuration / 1000)) {
        // Fade out
        const remaining = duration - currentTime;
        video.style.opacity = Math.max(0, remaining / (fadeDuration / 1000)).toString();
      } else {
        // Fully visible
        video.style.opacity = '1';
      }

      rafId = requestAnimationFrame(updateOpacity);
    };

    const handleEnded = () => {
      video.style.opacity = '0';
      setTimeout(() => {
        video.currentTime = 0;
        video.play().catch(e => console.log('Video play prevented:', e));
      }, 100);
    };

    const handleLoadedMetadata = () => {
      video.style.opacity = '0';
      video.play().catch(e => console.log('Video play prevented:', e));
      rafId = requestAnimationFrame(updateOpacity);
    };

    video.addEventListener('ended', handleEnded);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);

    // Initial trigger if already loaded
    if (video.readyState >= 1) {
      handleLoadedMetadata();
    }

    return () => {
      cancelAnimationFrame(rafId);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, []);

  const logos = [
    { name: 'Vortex', initial: 'V' },
    { name: 'Nimbus', initial: 'N' },
    { name: 'Prysma', initial: 'P' },
    { name: 'Cirrus', initial: 'C' },
    { name: 'Kynder', initial: 'K' },
    { name: 'Halcyn', initial: 'H' },
  ];

  // Duplicate for seamless loop
  const marqueeLogos = [...logos, ...logos];

  const scrollToFeatures = () => {
    document.getElementById('features-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main>
      <section className="hero-wrapper">
      {/* Background Video */}
      <video
        ref={videoRef}
        className="hero-video"
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_065045_c44942da-53c6-4804-b734-f9e07fc22e08.mp4"
        muted
        playsInline
      />

      {/* Blurred Overlay Shape */}
      <div className="hero-overlay-blur"></div>

      {/* Hero Content Layer */}
      <div className="hero-content-layer">
        
        {/* Navbar */}
        <div>
          <nav className="hero-navbar">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <img src={logoUrl} alt="Logo" style={{ height: '32px' }} />
            </div>
            
            <div>
              <Link to="/login?tab=register" className="btn-hero-secondary">
                Sign Up
              </Link>
            </div>
          </nav>
          <div className="hero-divider"></div>
        </div>

        {/* Main Centered Content */}
        <div className="hero-main-content">
          <h1 className="hero-headline">
            Health <span className="hero-headline-ai">AI</span>
          </h1>
          <p className="hero-subtitle">
            Where Clinical Needs Meet Engineering Innovation.<br />
            A secure co-creation platform for health-tech.
          </p>
          <Link to="/login?tab=register" className="btn-hero-secondary hero-cta">
            Schedule a Consult
          </Link>
        </div>
        
        {/* Scroll Indicator */}
        <div className="scroll-indicator" onClick={scrollToFeatures}>
          <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Discover Platform</span>
          <MouseDown size={24} />
        </div>
      </div>
    </section>

    {/* Explanation / Features Section */}
    <section id="features-section" className="features-section">
      <div className="features-header">
        <h2 className="features-title">Accelerate Medical Innovation</h2>
        <p className="features-subtitle">
          Health AI brings together healthcare professionals and engineers into a single, secure environment to validate ideas and build life-saving prototypes.
        </p>
      </div>

      <div className="features-grid">
        <div className="feature-card">
          <div className="feature-icon-wrapper blue">
            <Stethoscope size={28} />
          </div>
          <h3 className="feature-card-title">For Healthcare Pros</h3>
          <p className="feature-card-desc">
            You understand the clinical workflows and patient needs. Find the exact engineering talent required to turn your observations into working technological prototypes.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon-wrapper cyan">
            <Cpu size={28} />
          </div>
          <h3 className="feature-card-title">For Engineers</h3>
          <p className="feature-card-desc">
            You have the technical skills. Connect with leading doctors to ensure your health-tech solutions solve real problems and navigate complex clinical validations.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon-wrapper emerald">
            <ShieldCheck size={28} />
          </div>
          <h3 className="feature-card-title">Secure & Compliant</h3>
          <p className="feature-card-desc">
            No patient data. No IP leakage. Built-in NDA acceptance workflows ensure safe first-contact initiation before deep technical discussions occur.
          </p>
        </div>
      </div>
    </section>
  </main>
  );
};

export default LandingPage;
