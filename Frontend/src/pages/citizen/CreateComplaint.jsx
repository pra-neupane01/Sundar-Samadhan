import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import api from "../../services/api";
import {
  UploadCloud, MapPin, AlertCircle, CheckCircle2,
  FileText, Tag, Hash, Navigation
} from "lucide-react";
import "./CreateComplaint.css";

const CreateComplaint = () => {
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    location: "",
    ward_number: "",
    latitude: "",
    longitude: "",
  });

  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const categories = [
    "Roads & Infrastructure",
    "Water & Sanitation",
    "Electricity & Power",
    "Waste Management",
    "Public Services",
    "Other",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) setFile(e.target.files[0]);
  };

  const handleUseLocation = () => {
    if (!navigator.geolocation) { alert("Geolocation not supported"); return; }
    navigator.geolocation.getCurrentPosition(
      (pos) => setFormData(prev => ({ ...prev, latitude: pos.coords.latitude.toString(), longitude: pos.coords.longitude.toString() })),
      () => alert("Failed to get location. Please ensure location permissions are enabled.")
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("category", formData.category);
      data.append("description", formData.description);
      data.append("ward_number", formData.ward_number);
      data.append("address", formData.location);
      data.append("latitude", formData.latitude);
      data.append("longitude", formData.longitude);
      if (file) data.append("image", file);

      const response = await api.post("/complaints/create-complaint", data, {
        headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setIsSuccess(true);
        setTimeout(() => navigate("/dashboard"), 3000);
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to submit complaint.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-shell">
      <div className="content-container" style={{ maxWidth: "720px" }}>

        {/* Header */}
        <div style={{ marginBottom: "32px" }}>
          <h1 className="page-title">Report an Issue</h1>
          <p className="page-subtitle">Help us improve your community by reporting problems in your area.</p>
        </div>

        {isSuccess ? (
          <div className="cc-success-card card">
            <CheckCircle2 size={56} style={{ color: "#10b981" }} />
            <h2 style={{ margin: "16px 0 8px", color: "#065f46" }}>Complaint Submitted!</h2>
            <p style={{ color: "#64748b", marginBottom: "20px" }}>Your complaint has been registered successfully. You're being redirected…</p>
            <button className="btn btn-primary" onClick={() => navigate("/dashboard")}>Go to Overview Now</button>
          </div>
        ) : (
          <div className="card" style={{ padding: "32px" }}>
            <form onSubmit={handleSubmit} className="cc-form">

              {/* Title */}
              <div className="form-group">
                <label className="form-label">Complaint Title <span className="required">*</span></label>
                <div className="cc-input-wrap">
                  <FileText size={17} className="cc-input-icon" />
                  <input className="form-control cc-with-icon" type="text" name="title" value={formData.title}
                    onChange={handleChange} placeholder="e.g. Broken streetlight on Basundhara" required />
                </div>
              </div>

              {/* Category + Ward Row */}
              <div className="cc-row">
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Category <span className="required">*</span></label>
                  <div className="cc-input-wrap">
                    <Tag size={17} className="cc-input-icon" />
                    <select className="form-control cc-with-icon" name="category" value={formData.category} onChange={handleChange} required>
                      <option value="" disabled>Select a category</option>
                      {categories.map((cat, i) => <option key={i} value={cat}>{cat}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Ward Number <span className="required">*</span></label>
                  <div className="cc-input-wrap">
                    <Hash size={17} className="cc-input-icon" />
                    <input className="form-control cc-with-icon" type="number" name="ward_number" value={formData.ward_number}
                      onChange={handleChange} placeholder="e.g. 5" required min="1" max="15" />
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="form-group">
                <label className="form-label">Location / Address <span className="required">*</span></label>
                <div className="cc-input-wrap">
                  <MapPin size={17} className="cc-input-icon" />
                  <input className="form-control cc-with-icon" type="text" name="location" value={formData.location}
                    onChange={handleChange} placeholder="Enter specific address or landmark" required />
                </div>
                <button type="button" className="cc-location-btn" onClick={handleUseLocation}>
                  <Navigation size={14} /> Use My Current Location
                </button>
              </div>

              {/* Lat/Lon */}
              {(formData.latitude || formData.longitude) && (
                <div className="cc-row">
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">Latitude</label>
                    <input className="form-control" type="text" value={formData.latitude} readOnly style={{ background: "#f8fafc", color: "#94a3b8" }} />
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">Longitude</label>
                    <input className="form-control" type="text" value={formData.longitude} readOnly style={{ background: "#f8fafc", color: "#94a3b8" }} />
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="form-group">
                <label className="form-label">Detailed Description <span className="required">*</span></label>
                <textarea className="form-control" name="description" value={formData.description} onChange={handleChange}
                  placeholder="Describe the issue in detail — location, severity, how long it has been occurring…" rows="5" required />
              </div>

              {/* File Upload */}
              <div className="form-group">
                <label className="form-label">Attach Photo / Evidence</label>
                <div className="cc-upload-zone">
                  <input type="file" id="evidence" accept="image/*" onChange={handleFileChange} className="cc-file-hidden" />
                  <label htmlFor="evidence" className="cc-upload-label">
                    <UploadCloud size={28} style={{ color: "#94a3b8" }} />
                    <span className="cc-upload-text">{file ? file.name : "Click or drag to upload image"}</span>
                    <span className="cc-upload-hint">JPG, PNG · Max 5MB</span>
                  </label>
                </div>
              </div>

              {/* Actions */}
              <div className="cc-actions">
                <button type="button" className="btn btn-secondary" onClick={() => navigate("/dashboard")}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting…" : "Submit Complaint"}
                </button>
              </div>
            </form>

            {/* Info Alert */}
            <div className="cc-info-alert">
              <AlertCircle size={18} />
              <p>False or misleading complaints may result in account suspension per our community guidelines.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateComplaint;
