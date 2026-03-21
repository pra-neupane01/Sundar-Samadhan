import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  MessageSquare, 
  Clock,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success("Message sent! We'll get back to you soon.", {
        style: {
          borderRadius: '12px',
          background: '#064e3b',
          color: '#fff',
        },
      });
      setFormData({ name: '', email: '', subject: '', message: '' });
      setIsSubmitting(false);
    }, 1500);
  };

  const contactMethods = [
    {
      icon: <Mail className="method-icon" />,
      title: "Email Support",
      value: "support@sundarsamadhan.gov.np",
      desc: "Our response time is usually within 24 hours."
    },
    {
      icon: <Phone className="method-icon" />,
      title: "Phone Line",
      value: "+977 (01) 4567890",
      desc: "Available Sun-Fri, 10:00 AM - 5:00 PM."
    },
    {
      icon: <MapPin className="method-icon" />,
      title: "Municipal Office",
      value: "Ward No. 4, Green City, Nepal",
      desc: "Visit us for in-person administrative support."
    }
  ];

  return (
    <div className="contact-page">
      {/* Hero Header */}
      <header className="contact-hero">
        <div className="contact-container">
          <div className="contact-hero-content">
            <span className="contact-badge">Contact Support</span>
            <h1>Get in touch with <br/><span>Sundar Samadhan</span></h1>
            <p>
              Have questions or need assistance? We're here to bridge the gap 
              between you and your municipality. Reach out to our team today.
            </p>
          </div>
        </div>
      </header>

      <section className="contact-main">
        <div className="contact-container">
          <div className="contact-grid">
            
            {/* Contact Info Column */}
            <div className="contact-info">
              <div className="info-header">
                <h2>Direct Channels</h2>
                <p>Choose the most convenient way to reach us.</p>
              </div>

              <div className="methods-list">
                {contactMethods.map((m, idx) => (
                  <div className="method-card" key={idx}>
                    <div className="method-icon-wrapper">{m.icon}</div>
                    <div className="method-details">
                      <h3>{m.title}</h3>
                      <div className="method-value">{m.value}</div>
                      <p>{m.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="support-banner">
                <Clock className="banner-icon" />
                <div>
                  <h4>Emergency Reporting</h4>
                  <p>For urgent issues like water bursts or hazardous road conditions, please call our 24/7 hotline at 1660-01-XXXXX.</p>
                </div>
              </div>
            </div>

            {/* Contact Form Column */}
            <div className="contact-form-wrapper">
              <div className="form-card">
                <div className="form-header">
                  <MessageSquare className="header-icon" />
                  <h3>Send a Message</h3>
                  <p>Our support team will review your inquiry immediately.</p>
                </div>

                <form className="modern-form" onSubmit={handleSubmit}>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Full Name</label>
                      <input 
                        type="text" 
                        name="name" 
                        placeholder="John Doe" 
                        required 
                        value={formData.name}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>Email Address</label>
                      <input 
                        type="email" 
                        name="email" 
                        placeholder="john@example.com" 
                        required 
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Subject</label>
                    <select 
                      name="subject" 
                      required 
                      value={formData.subject}
                      onChange={handleChange}
                    >
                      <option value="">Select a category</option>
                      <option value="General">General Inquiry</option>
                      <option value="Technical">Technical Issue</option>
                      <option value="Account">Account Support</option>
                      <option value="Feedback">Feedback</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Message</label>
                    <textarea 
                      name="message" 
                      placeholder="How can we help you?" 
                      rows="6" 
                      required
                      value={formData.message}
                      onChange={handleChange}
                    ></textarea>
                  </div>

                  <button className="submit-btn" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <span className="btn-loading">Sending...</span>
                    ) : (
                      <>
                        Send Message <Send size={18} />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="faq-teaser">
        <div className="contact-container text-center">
          <h3>Common Concerns</h3>
          <div className="faq-grid">
            <div className="faq-item">
              <CheckCircle2 size={24} className="text-emerald" />
              <div>
                <h5>How long does verification take?</h5>
                <p>Municipal Officer requests are usually reviewed within 48 business hours.</p>
              </div>
            </div>
            <div className="faq-item">
              <CheckCircle2 size={24} className="text-emerald" />
              <div>
                <h5>Is my data secure?</h5>
                <p>We use industry-standard encryption for all your reports and personal information.</p>
              </div>
            </div>
          </div>
          <div className="mt-8">
            <button className="btn-link" onClick={() => window.location.href='/about'}>
              Learn more about our mission <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      <footer className="contact-footer">
        <p>&copy; 2026 Sundar Samadhan. Official Communication Hub.</p>
      </footer>
    </div>
  );
};

export default Contact;
