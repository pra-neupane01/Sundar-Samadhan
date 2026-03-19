import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import api from "../../services/api";
import {
  ArrowLeft,
  UploadCloud,
  MapPin,
  AlertCircle,
  X,
  Eye,
  Image as ImageIcon,
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
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData((prev) => ({
          ...prev,
          latitude: position.coords.latitude.toString(),
          longitude: position.coords.longitude.toString(),
        }));
      },
      (error) => {
        console.error("Error getting location:", error);
        alert("Failed to get your location. Please ensure location permissions are enabled.");
      }
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

      if (file) {
        data.append("image", file);
      }

      const response = await api.post("/complaints/create-complaint", data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setIsSuccess(true);
        setTimeout(() => {
          navigate("/dashboard");
        }, 3000);
      }
    } catch (error) {
      console.error("Error creating complaint:", error);
      alert(error.response?.data?.message || "Failed to submit complaint. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-complaint-page">
      {/* Navbar - Simplified for inner pages */}
      <nav className="dashboard-navbar" style={{ padding: "0 2rem", minHeight: "72px" }}>
        <div className="navbar-brand">
          <div className="logo-text-icon">
            <span className="logo-letter">S</span>
            <span className="logo-letter">S</span>
          </div>
          <span className="brand-text">Sundar Samadhan</span>
        </div>

        <div className="navbar-user-section">
          <Link to="/dashboard" className="back-link">
            <ArrowLeft size={18} />
            Back to Dashboard
          </Link>
        </div>
      </nav>

      <div className="complaint-content">
        <div className="complaint-container">
          <div className="complaint-header">
            <h2>Report an Issue</h2>
            <p>Help us improve our community by reporting issues in your area.</p>
          </div>

          {isSuccess ? (
            <div className="success-message">
              <CheckCircle2 size={64} className="success-icon" />
              <h3>Complaint Submitted Successfully!</h3>
              <p>Your complaint has been registered. You will be redirected to the dashboard shortly.</p>
              <button
                className="btn-primary mt-4"
                onClick={() => navigate("/dashboard")}
              >
                Go to Dashboard Now
              </button>
            </div>
          ) : (
            <form className="complaint-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="title">Complaint Title <span className="required">*</span></label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="E.g., Broken streetlight on Basundhara, Kathmandu"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="category">Category <span className="required">*</span></label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>Select a category</option>
                  {categories.map((cat, idx) => (
                    <option key={idx} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="ward_number">Ward Number <span className="required">*</span></label>
                <input
                  type="number"
                  id="ward_number"
                  name="ward_number"
                  value={formData.ward_number}
                  onChange={handleChange}
                  placeholder="E.g., 5"
                  required
                  min="1"
                  max="15"
                />
              </div>

              <div className="form-group">
                <label htmlFor="location">Location / Address <span className="required">*</span></label>
                <div className="input-icon-wrapper">
                  <MapPin size={20} className="input-icon" />
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Enter specific address or landmark"
                    className="with-icon"
                    required
                  />
                  <button type="button" className="btn-use-location" onClick={handleUseLocation}>Use My Location</button>
                </div>
              </div>

              <div className="form-row" style={{ display: "flex", gap: "1rem" }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label htmlFor="latitude">Latitude</label>
                  <input
                    type="text"
                    id="latitude"
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleChange}
                    placeholder="Auto-filled"
                    readOnly
                  />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label htmlFor="longitude">Longitude</label>
                  <input
                    type="text"
                    id="longitude"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleChange}
                    placeholder="Auto-filled"
                    readOnly
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="description">Detailed Description <span className="required">*</span></label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Please provide as many details as possible..."
                  rows="5"
                  required
                ></textarea>
              </div>

              <div className="form-group">
                <label>Attach Photo/Evidence</label>
                <div className="file-upload-container">
                  <input
                    type="file"
                    id="evidence"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden-file-input"
                  />
                  <label htmlFor="evidence" className="file-upload-label">
                    <UploadCloud size={32} className="upload-icon" />
                    <span className="upload-text">
                      {file ? file.name : "Click or drag to upload image"}
                    </span>
                    <span className="upload-hint">Supported formats: JPG, PNG (Max: 5MB)</span>
                  </label>
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => navigate("/dashboard")}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit Complaint"}
                </button>
              </div>
            </form>
          )}

          {!isSuccess && (
            <div className="info-alert">
              <AlertCircle size={20} />
              <p>False or misleading complaints may result in account suspension according to our community guidelines.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateComplaint;
