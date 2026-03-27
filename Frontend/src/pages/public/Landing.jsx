import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, Shield, MapPin, PlusCircle, 
  Activity, AlertTriangle, Wrench, Trash2, Droplets, Star, Quote,
  Lightbulb, Construction, Smartphone, QrCode as QrCodeIcon
} from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import './Landing.css';

const Landing = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="landing-container">
      {/* Navbar Shell */}
      <nav className="landing-nav" style={{ backgroundColor: 'rgba(248, 249, 249, 0.8)', backdropFilter: 'blur(12px)' }}>
        <div className="nav-logo" style={{ color: '#004d34', fontSize: '1.5rem' }}>Sundar Samadhan</div>
        <div className="nav-links">
          <Link to="#services" className="active">Services</Link>
          <Link to="#track">Track Report</Link>
          <Link to="#governance">Governance</Link>
          <Link to="#community">Community</Link>
        </div>
        <div className="nav-actions">
          {!user ? (
            <Link to="/login" className="nav-login">Login</Link>
          ) : (
            <Link to="/dashboard" className="nav-login">Dashboard</Link>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        {/* Background Image & Overlay */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCSFdftfF0w2-afAoxyB7I6EsB261QvWC_8JQ6qFMb4-cpQauKdpODdL-_YW2D0ocgAAdW4AE3OVA9Bs8p5OTwKutDyh5Ln68TqB9OfddWO0_bYj4oLCj-CJi_22C085YJqPXmK-nbsWCFVQ_nXYQPvD03Qd36Wu_wStqsMDLKR3A8bfMnWHpC5vXDJEoND8dldGj0KMqk7n90GYNNzSWUB1d087Aqb5hyfVqnU1KtpfeKihHU7NV2VqgKqB-4HReoOTPkQNdyzucep" 
            alt="Patan Durbar Square" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
          <div className="hero-overlay"></div>
        </div>

        <div className="hero-content">
          <div className="tag-digital">
            <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'var(--primary)', animation: 'pulse 2s infinite' }}></span>
            DIGITAL HERITAGE
          </div>
          <h1 className="hero-title">Sundar <br/> Samadhan</h1>
          <p className="hero-text" style={{ fontWeight: 500 }}>
            A modern bridge between citizens and local governance. Report issues, track progress, 
            and build a smarter city together through our digital foundation.
          </p>
          <div className="hero-buttons">
            <Link to="/citizen/report" className="btn-primary" style={{ padding: '16px 32px', borderRadius: '12px' }}>
              <PlusCircle size={20} /> Report an Issue
            </Link>
            <Link to="/citizen/track" className="btn-secondary" style={{ padding: '16px 32px', borderRadius: '12px', background: 'var(--surface-container-highest)' }}>
              <Activity size={20} /> Track Progress
            </Link>
          </div>
        </div>

        {/* Floating Recent Card */}
        <div className="hero-recent" style={{ background: 'rgba(255,255,255,0.4)', backdropFilter: 'blur(16px)', borderRadius: '2rem' }}>
          <div style={{ position: 'absolute', top: 0, right: 0, padding: '16px', opacity: 0.1 }}>
            <Activity size={96} strokeWidth={1} />
          </div>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '24px' }}>Recent Resolution</h3>
          <div className="recent-item" style={{ background: 'rgba(255,255,255,0.6)' }}>
            <div className="recent-icon"><Lightbulb size={20} /></div>
            <div className="recent-info">
              <div>Streetlight Fixed</div>
              <span>Lalitpur Metro - Ward 3</span>
            </div>
            <div className="recent-status" style={{ color: 'var(--primary)' }}>Resolved</div>
          </div>
          <div className="recent-item" style={{ background: 'rgba(255,255,255,0.6)' }}>
            <div className="recent-icon" style={{ background: 'var(--secondary-fixed)', color: 'var(--secondary)' }}><Droplets size={20} /></div>
            <div className="recent-info">
              <div>Water Leakage</div>
              <span>Kathmandu Metro - Ward 12</span>
            </div>
            <div className="recent-status">In Progress</div>
          </div>
        </div>
      </section>

      {/* Governance Pillars */}
      <section className="bg-checkered dhaka-pattern" style={{ backgroundColor: '#f3f4f4' }}>
        <h2 className="section-label">Governance Pillars</h2>
        <div className="pillars-grid">
          <div className="pillar-card dhaka-pattern" style={{ borderBottom: '4px solid rgba(0,77,52,0.2)', transition: 'all 0.3s' }}>
            <div className="pillar-icon" style={{ width: 64, height: 64, borderRadius: '16px' }}>
              <Activity size={32} />
            </div>
            <h3>Quick Reporting</h3>
            <p>File a complaint in just three easy steps with photo evidence and GPS location tagging.</p>
            <ul style={{ listStyle: 'none', fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Shield size={14} /> Photo Upload</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Shield size={14} /> Automatic Geotag</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Shield size={14} /> Instant Ticket ID</li>
            </ul>
          </div>
          <div className="pillar-card" style={{ borderBottom: '4px solid rgba(0,77,52,0.2)' }}>
            <div className="pillar-icon" style={{ width: 64, height: 64, borderRadius: '16px', backgroundColor: 'var(--secondary-fixed)', color: 'var(--secondary)' }}>
              <Activity size={32} />
            </div>
            <h3>Real-time Transparency</h3>
            <p>Monitor the entire lifecycle of your request. Know exactly who is handling your concern at each stage.</p>
            <div style={{ display: 'flex', gap: '-12px', marginTop: '16px', position: 'relative' }}>
               <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#cbd5e1', border: '2px solid white' }}></div>
               <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#94a3b8', border: '2px solid white', marginLeft: -12 }}></div>
               <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#64748b', border: '2px solid white', marginLeft: -12 }}></div>
               <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--primary)', border: '2px solid white', marginLeft: -12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 10, fontWeight: 900 }}>+12</div>
            </div>
          </div>
          <div className="pillar-card" style={{ borderBottom: '4px solid rgba(0,77,52,0.2)' }}>
            <div className="pillar-icon" style={{ width: 64, height: 64, borderRadius: '16px', backgroundColor: 'var(--primary-container)', color: 'white' }}>
              <Activity size={32} />
            </div>
            <h3>Direct Accountability</h3>
            <p>Direct communication channel between you and ward officials. Every issue is linked to a responsible officer.</p>
            <Link to="/about" style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, marginTop: '24px' }}>
              Learn more <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Select Issues */}
      <section className="quick-select-section" style={{ overflow: 'hidden' }}>
        <div className="quick-header">
          <div style={{ maxWidth: 600 }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: 16 }}>Quick Select Issues</h2>
            <p style={{ fontSize: '1.1rem' }}>Select a category below to start your report immediately. Our system routes these to specialized response teams.</p>
          </div>
          <div className="urgent-text" style={{ fontSize: '4rem', opacity: 0.2 }}>URGENT ACTIONS</div>
        </div>
        <div className="quick-grid">
          <div className="quick-item" style={{ padding: 32, backgroundColor: 'var(--surface-container)', transition: 'all 0.3s' }}>
            <Lightbulb size={32} color="var(--primary)" style={{ marginBottom: 16 }} />
            <div style={{ fontSize: '1.25rem' }}>Broken Streetlights</div>
          </div>
          <div className="quick-item" style={{ padding: 32, backgroundColor: 'var(--surface-container)' }}>
            <Construction size={32} color="var(--primary)" style={{ marginBottom: 16 }} />
            <div style={{ fontSize: '1.25rem' }}>Pothole Repair</div>
          </div>
          <div className="quick-item" style={{ padding: 32, backgroundColor: 'var(--surface-container)' }}>
            <Trash2 size={32} color="var(--primary)" style={{ marginBottom: 16 }} />
            <div style={{ fontSize: '1.25rem' }}>Waste Management</div>
          </div>
          <div className="quick-item" style={{ padding: 32, backgroundColor: 'var(--surface-container)' }}>
            <Droplets size={32} color="var(--primary)" style={{ marginBottom: 16 }} />
            <div style={{ fontSize: '1.25rem' }}>Water Supply</div>
          </div>
        </div>
      </section>

      {/* Voices of Our City */}
      <section className="voices-section" style={{ backgroundColor: '#f3f4f4', padding: '100px 5%', overflow: 'hidden' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: 64, color: 'var(--primary)', fontWeight: 800 }}>Voices of Our City</h2>
        
        <div className="testimonial-card dhaka-pattern" style={{ backgroundColor: '#ffffff', padding: '60px', borderRadius: '3rem', border: '12px solid rgba(0,77,52,0.05)', display: 'flex', alignItems: 'center', gap: '60px', maxWidth: '1000px', margin: '0 auto', position: 'relative', flexDirection: 'row' }}>
          {/* Decorative Corner */}
          <div style={{ position: 'absolute', top: 0, left: 0, width: 120, height: 120, backgroundColor: 'rgba(0,77,52,0.1)', borderRadius: '3rem 0 100% 0' }}></div>
          
          {/* Photo side */}
          <div className="testimonial-img-wrapper" style={{ flexShrink: 0, width: '350px', height: '400px', transform: 'rotate(-3deg)', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.15)', border: '12px solid white', position: 'relative', zIndex: 2 }}>
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAkj5okK7dEY7vsH4I7Py-SOGjOE5038ALHKxKXs2tzJ368DsOVARoV59wTm8rr7sXE1cBeniOMohX9I5VDB-qtybsZFxpa6-ZP2NXXRgv-UlpAhfqZg4KxboaGmS5Ss5hjnok7xyX7xz0xz6KPeWHacrWqlen78S0uH22B5EogiRdecvdKycuDFvuQetioq6EH0i1SKXnYNB4waH4qRUcr6sbdniAJqUfjpSHdjyoqCZ4idDjZaZaTi4Q0gmy-9OJU3ReiciHF1BJf" 
              alt="Nepali citizen" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          
          {/* Content side */}
          <div className="testimonial-content" style={{ flex: 1, textAlign: 'left', position: 'relative', zIndex: 2 }}>
            <div className="quote-icon-bg" style={{ position: 'absolute', top: '-40px', left: '-20px', color: 'rgba(0,77,52,0.05)', zIndex: 0 }}>
              <Quote size={120} fill="currentColor" />
            </div>
            
            <div className="stars" style={{ display: 'flex', gap: 6, color: 'var(--primary)', marginBottom: 24, position: 'relative', zIndex: 2 }}>
              <Star size={24} fill="currentColor" />
              <Star size={24} fill="currentColor" />
              <Star size={24} fill="currentColor" />
              <Star size={24} fill="currentColor" />
              <Star size={24} fill="currentColor" />
            </div>
            
            <div className="quote-text" style={{ fontSize: '1.5rem', lineHeight: 1.6, fontStyle: 'italic', fontWeight: 500, color: 'var(--text-main)', marginBottom: 32, position: 'relative', zIndex: 2 }}>
              "The leakage in our neighborhood had been there for months. Using Sundar Samadhan, the water board arrived within 48 hours. This is the transparency we needed."
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, position: 'relative', zIndex: 2 }}>
                <div style={{ width: 48, height: 4, backgroundColor: 'var(--primary)', borderRadius: 2 }}></div>
                <div>
                    <div className="quote-author" style={{ fontSize: '1.25rem', color: 'var(--primary)', fontWeight: 800 }}>Ram Bahadur Gurung</div>
                    <div className="quote-role" style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>Community Elder, Ward 7</div>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-card" style={{ borderRadius: '3rem', position: 'relative', overflow: 'hidden' }}>
          <div className="dhaka-pattern" style={{ position: 'absolute', inset: 0, opacity: 0.2, mixBlendMode: 'overlay' }}></div>
          <h2 style={{ fontSize: '4rem' }}>Build a Smarter City Together</h2>
          <p style={{ fontSize: '1.25rem', opacity: 0.9 }}>Stay updated with the latest municipal developments and community improvements.</p>
          <div className="cta-form" style={{ marginTop: 40 }}>
            <input 
                type="email" 
                placeholder="Enter your email address" 
                style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', padding: '16px 32px', borderRadius: '12px', width: 400, color: 'white' }} 
            />
            <button style={{ padding: '16px 32px', borderRadius: '12px' }}>Join Us</button>
          </div>
          <div className="app-links" style={{ marginTop: 64 }}>
            <div className="app-link">
              <Smartphone size={40} />
              <div>
                <span style={{ fontSize: 10, letterSpacing: 1 }}>GET IT ON</span>
                <div style={{ fontSize: 20 }}>Mobile App</div>
              </div>
            </div>
            <div style={{ width: 1, height: 40, background: 'rgba(255,255,255,0.2)' }}></div>
            <div className="app-link">
              <QrCodeIcon size={40} />
              <div>
                <span style={{ fontSize: 10, letterSpacing: 1 }}>SCAN TO</span>
                <div style={{ fontSize: 20 }}>Report Quick</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="site-footer" style={{ padding: '80px 5%', background: '#f3f4f4' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div className="footer-logo" style={{ fontSize: '1.5rem' }}>Sundar Samadhan</div>
              <p className="footer-desc" style={{ fontSize: '0.9rem', marginTop: 16 }}>
                © 2026 The Civic Architect. A Digital Foundation For Community Progress.<br /> 
                Transforming municipal governance through transparency and heritage.
              </p>
            </div>
            <div className="footer-links">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Accessibility</a>
              <a href="#">Contact Us</a>
            </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
