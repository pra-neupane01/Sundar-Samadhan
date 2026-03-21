import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  CheckCircle, 
  Shield, 
  Zap, 
  MapPin, 
  MessageSquare, 
  Award,
  Users
} from 'lucide-react';
import './Landing.css';

const Landing = () => {
  return (
    <div className="landing-container">
      {/* Global Navbar is handled in App.jsx */}

      {/* Hero Section */}
      <header className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <div className="hero-badge">
              <span className="badge-dot"></span>
              Transforming Governance in Nepal
            </div>
            <h1>United for a <br /><span className="text-accent underline-draw">Better Community.</span></h1>
            <p>
              Sundar Samadhan brings citizens and local government together to build 
              a cleaner, happier, and more transparent municipality. 
              Together, we create beauty through accountability.
            </p>
            <div className="hero-actions">
              <Link to="/register" className="cta-primary">
                Get Started <ArrowRight size={18} />
              </Link>
              <a href="#features" className="cta-secondary">Learn More</a>
            </div>
            
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">5k+</span>
                <span className="stat-label">Resolved Issues</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <span className="stat-number">15+</span>
                <span className="stat-label">Municipalities</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <span className="stat-number">98%</span>
                <span className="stat-label">User Trust</span>
              </div>
            </div>
          </div>
          <div className="hero-image-container">
            <div className="image-blob"></div>
            <img src="/hero-portrait.png" alt="Community Leader" className="hero-portrait" />
            <div className="floating-card c1">
              <div className="f-icon green"><CheckCircle size={16} /></div>
              <div className="f-text">
                <strong>Complaint Resolved</strong>
                <span>Ward No. 4 - Road Repair</span>
              </div>
            </div>
            <div className="floating-card c2">
              <div className="f-icon blue"><Award size={16} /></div>
              <div className="f-text">
                <strong>+250 Sundar Points</strong>
                <span>Active Citizened Award</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="section-header">
          <h2 className="section-title">Why Sundar Samadhan?</h2>
          <p className="section-subtitle">We provide a seamless interface for digital governance that actually works for you.</p>
        </div>
        
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon-box green">
              <Zap size={24} />
            </div>
            <h3>Instant Submission</h3>
            <p>File complaints in seconds with photo evidence and GPS location tagging for immediate attention.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon-box blue">
              <Shield size={24} />
            </div>
            <h3>Total Transparency</h3>
            <p>Track every step of your complaint's progress with real-time updates and officer assignments.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon-box purple">
              <Users size={24} />
            </div>
            <h3>Community Driven</h3>
            <p>Collaborate with neighbors on location-specific issues and vote on priority improvements.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon-box orange">
              <Award size={24} />
            </div>
            <h3>Sundar Rewards</h3>
            <p>Earn points for every contribution to your community and redeem them for local benefits.</p>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="how-it-works">
        <div className="how-content">
          <div className="how-text-block">
            <h2 className="section-title text-white">How it works?</h2>
            <div className="steps-list">
              <div className="step-item">
                <div className="step-number">1</div>
                <div className="step-info">
                  <h4>Join the Community</h4>
                  <p>Register as a citizen or a group. It takes less than 2 minutes to get verified.</p>
                </div>
              </div>
              <div className="step-item">
                <div className="step-number">2</div>
                <div className="step-info">
                  <h4>Report an Issue</h4>
                  <p>Spotted a problem? Snap a photo, add a brief description, and hit submit.</p>
                </div>
              </div>
              <div className="step-item">
                <div className="step-number">3</div>
                <div className="step-info">
                  <h4>Track & Resolve</h4>
                  <p>Get notified when an official is assigned. Watch as your concern becomes a solution.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="how-visual">
            <div className="visual-card">
              <div className="visual-header">
                <MapPin size={20} />
                <span>Live Status Map</span>
              </div>
              <div className="visual-body">
                <div className="mock-map">
                  <div className="pin p1"></div>
                  <div className="pin p2"></div>
                  <div className="pin p3"></div>
                </div>
              </div>
              <div className="visual-footer">
                <span>Active Complaints: 142</span>
                <span className="dot-active">Live</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section id="impact" className="impact-section">
        <div className="impact-container">
          <div className="impact-card">
            <MessageSquare size={32} color="#22c55e" />
            <h3 className="impact-title">Join thousands of citizens making Nepal beautiful.</h3>
            <p className="impact-text">Your small contribution leads to massive changes in accountability.</p>
            <Link to="/register" className="impact-btn">Join Now</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="landing-logo">
              <img src="/logo.png" alt="Sundar Samadhan" className="logo-img" />
              <span>Sundar Samadhan</span>
            </div>
            <p>A Municipality Initiative for a Digital Nepal.</p>
          </div>
          <div className="footer-links-group">
            <div className="footer-col">
              <h5>Platform</h5>
              <a href="#features">Features</a>
              <a href="/login">Dashboard</a>
              <a href="/about">About Us</a>
            </div>
            <div className="footer-col">
              <h5>Support</h5>
              <a href="#">Help Center</a>
              <a href="#">Contact Support</a>
              <a href="#">Privacy Policy</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          &copy; 2026 Sundar Samadhan. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Landing;
