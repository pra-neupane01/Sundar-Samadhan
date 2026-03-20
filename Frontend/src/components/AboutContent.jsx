import React from 'react';
import { Target, Eye, Activity, TrendingUp } from 'lucide-react';

const AboutContent = () => {
  return (
    <div className="about-content-embedded">
      <div className="section-header text-center" style={{ marginBottom: "40px", marginTop: "40px" }}>
        <h2 className="text-3xl font-extrabold text-gray-900" style={{ fontSize: "2.5rem", textAlign: "center", marginBottom: "8px" }}>Building the "Sundar" Vision</h2>
        <p className="text-gray-500 max-w-2xl mx-auto mt-2 text-lg" style={{ textAlign: "center", opacity: 0.8 }}>
          Sundar Samadhan leverages technology to bridge governance and citizens for a beautiful, responsive city.
        </p>
      </div>

      <div className="about-cards-grid" style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", 
        gap: "24px", 
        marginBottom: "40px" 
      }}>
        <div className="about-card-mini" style={{ padding: "32px", background: "white", borderRadius: "20px", border: "1px solid #f1f5f9", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.05)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "16px" }}>
            <div style={{ padding: "12px", background: "#f0fdf4", borderRadius: "12px", color: "#10b981" }}><Target size={28} /></div>
            <h3 className="text-xl font-bold" style={{ margin: 0 }}>The Mission</h3>
          </div>
          <p className="text-gray-600 leading-relaxed">
            Empowering every citizen with a direct digital voice to their local government. 
            Reducing bureaucracy and ensuring issue resolution with absolute transparency.
          </p>
        </div>

        <div className="about-card-mini" style={{ padding: "32px", background: "white", borderRadius: "20px", border: "1px solid #f1f5f9", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.05)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "16px" }}>
            <div style={{ padding: "12px", background: "#eff6ff", borderRadius: "12px", color: "#3b82f6" }}><Eye size={28} /></div>
            <h3 className="text-xl font-bold" style={{ margin: 0 }}>The Vision</h3>
          </div>
          <p className="text-gray-600 leading-relaxed">
            Building a smart, responsive community where trust is fostered through collective action 
            and real-time accountability to build a truly "Sundar" city.
          </p>
        </div>
      </div>

      <div className="trust-banner-about" style={{ 
        background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)", 
        borderRadius: "24px", 
        padding: "48px", 
        color: "white",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "32px",
        margin: "60px 0"
      }}>
        <div style={{ flex: 1, minWidth: "300px" }}>
          <h3 className="text-3xl font-bold mb-3 text-white">Platform of Accountability</h3>
          <p className="text-blue-100 opacity-80 text-lg">Every interaction is logged, every progress updated, and every contribution tracked for 100% integrity in local governance.</p>
        </div>
        <div style={{ display: "flex", gap: "48px" }}>
          <div className="text-center">
            <div className="text-4xl font-extrabold text-blue-400" style={{ fontSize: "2.5rem" }}>100%</div>
            <div className="text-xs uppercase tracking-widest opacity-60 font-bold mt-1">Transparency</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-extrabold text-indigo-400" style={{ fontSize: "2.5rem" }}>Secure</div>
            <div className="text-xs uppercase tracking-widest opacity-60 font-bold mt-1">Data Access</div>
          </div>
        </div>
      </div>

      <style>{`
        .about-card-mini { transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .about-card-mini:hover { transform: translateY(-5px); box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); }
        .text-center { text-align: center; }
      `}</style>
    </div>
  );
};

export default AboutContent;
