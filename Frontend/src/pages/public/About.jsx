import React from 'react';
import { 
  Target, 
  Eye, 
  ShieldCheck, 
  Users, 
  Zap, 
  Lock, 
  Building2, 
  HeartHandshake,
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './About.css';

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="content-container">
          <div className="hero-badge">About Sundar Samadhan</div>
          <h1 className="hero-title">Empowering Citizens, <br /><span className="text-gradient">Transforming Governance</span></h1>
          <p className="hero-description">
            Sundar Samadhan is our municipality's digital leap toward a more transparent, 
            accountable, and responsive community management system.
          </p>
        </div>
        <div className="hero-shape"></div>
      </section>

      {/* Mission & Vision */}
      <section className="mission-vision">
        <div className="content-container grid-2">
          <div className="card mission-card">
            <div className="card-icon blue"><Target size={32} /></div>
            <h3>Our Mission</h3>
            <p>
              To leverage technology to bridge the gap between citizens and local government, 
              ensuring every voice is heard and every issue is addressed with efficiency.
            </p>
          </div>
          <div className="card vision-card">
            <div className="card-icon purple"><Eye size={32} /></div>
            <h3>Our Vision</h3>
            <p>
              To build a "Sundar" (Beautiful) city where technology fosters trust, 
              encourages civic participation, and creates a seamless living environment for all.
            </p>
          </div>
        </div>
      </section>

      {/* What the System Does */}
      <section className="system-features">
        <div className="content-container">
          <div className="section-header text-center">
            <h2 className="section-title">A Unified Civic Ecosystem</h2>
            <p className="section-subtitle">Designed to simplify the way you interact with your municipality.</p>
          </div>

          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-icon"><Building2 /></div>
              <h4>Complaint Management</h4>
              <p>Lodge issues ranging from waste management to infrastructure directly to your ward officer.</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon"><Zap /></div>
              <h4>Real-time Updates</h4>
              <p>Get notified instantly when your complaint status changes or new announcements are posted.</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon"><HeartHandshake /></div>
              <h4>Community Support</h4>
              <p>Contribute to city development through donations and earn Sundar Points for your social impact.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits for Citizens */}
      <section className="benefits-section">
        <div className="content-container grid-2 align-center">
          <div className="benefits-content">
            <h2 className="section-title">Why Use Sundar Samadhan?</h2>
            <ul className="benefits-list">
              <li>
                <div className="benefit-dot"></div>
                <div>
                  <strong>Voice for Everyone:</strong> Your issues reach the right officials without any middlemen.
                </div>
              </li>
              <li>
                <div className="benefit-dot"></div>
                <div>
                  <strong>Transparency:</strong> Track the history and progress of your requests in real-time.
                </div>
              </li>
              <li>
                <div className="benefit-dot"></div>
                <div>
                  <strong>Rewards:</strong> Earn points for being an active citizen and contributing to our community.
                </div>
              </li>
            </ul>
          </div>
          <div className="benefits-visual">
             <div className="visual-card">
                <div className="visual-header">
                   <ShieldCheck className="text-blue-500" />
                   <span>Verified Citizen Portal</span>
                </div>
                <div className="visual-body">
                   <div className="skeleton-line"></div>
                   <div className="skeleton-line short"></div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Trust & Accountability */}
      <section className="trust-section">
        <div className="content-container">
          <div className="trust-banner">
            <div className="trust-info">
              <h2 className="section-title text-white">Built on Trust & Transparency</h2>
              <p className="text-white opacity-80">
                We believe in accountability. Every complaint is logged, every update is timestamped, 
                and every donation is tracked to ensure complete integrity in local governance.
              </p>
            </div>
            <div className="trust-stats">
               <div className="stat-box">
                  <div className="stat-num">100%</div>
                  <div className="stat-lab">Digital Tracking</div>
               </div>
               <div className="stat-box">
                  <div className="stat-num">24/7</div>
                  <div className="stat-lab">Accessibility</div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="about-cta">
        <div className="content-container text-center">
          <h2>Ready to build a better community?</h2>
          <p>Join thousands of citizens making a difference today.</p>
          <div className="cta-buttons">
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/register')}>
              Get Started <ArrowRight size={18} />
            </button>
            <button className="btn btn-secondary btn-lg" onClick={() => navigate('/login')}>
              Citizen Login
            </button>
          </div>
        </div>
      </section>

      <footer className="about-footer">
        <p>&copy; 2026 Sundar Samadhan. A Municipality Initiative.</p>
      </footer>
    </div>
  );
};

export default About;
