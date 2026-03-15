import { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { 
  CheckCircle2, 
  ArrowRight, 
  Loader2, 
  XCircle,
  PackageCheck,
  Award
} from "lucide-react";
import "./PaymentStatus.css";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("verifying"); // verifying, success, error
  const [points, setPoints] = useState(0);
  const navigate = useNavigate();
  const donationId = searchParams.get("donation_id");
  const verificationStarted = useRef(false);

  useEffect(() => {
    const verifyPayment = async () => {
      if (!donationId) {
        setStatus("error");
        return;
      }

      try {
        const res = await api.post("/donations/verify", { donation_id: donationId });
        if (res.data.success) {
          setStatus("success");
          // Assume points = amount for now as per controller logic
          // In a real app, the verify API might return the updated user object or points
        } else {
          setStatus("error");
        }
      } catch (error) {
        console.error("Verification error:", error);
        setStatus("error");
      }
    };

    if (donationId && !verificationStarted.current) {
      verificationStarted.current = true;
      verifyPayment();
    }
  }, [donationId]);

  return (
    <div className="payment-status-container">
      <div className="status-card glass-morphism">
        {status === "verifying" && (
          <div className="status-content loading">
            <Loader2 className="spinner-icon" size={64} />
            <h2>Verifying Payment</h2>
            <p>Please wait while we confirm your contribution with the bank...</p>
          </div>
        )}

        {status === "success" && (
          <div className="status-content success">
            <div className="icon-wrapper success-bg">
              <CheckCircle2 size={48} />
            </div>
            <h1>Thank You!</h1>
            <p className="main-msg">Your donation has been received and processed successfully.</p>
            
            <div className="reward-box">
              <div className="reward-icon">
                <Award size={24} />
              </div>
              <div className="reward-text">
                <span className="reward-label">Community Impact</span>
                <span className="reward-value">Sundar Points Updated!</span>
              </div>
            </div>

            <div className="action-buttons">
              <button 
                className="primary-btn"
                onClick={() => navigate("/citizen/donations")}
              >
                <span>View Donation History</span>
                <ArrowRight size={18} />
              </button>
              <button 
                className="secondary-btn"
                onClick={() => navigate("/dashboard")}
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="status-content error">
            <div className="icon-wrapper error-bg">
              <XCircle size={48} />
            </div>
            <h1>Verification Failed</h1>
            <p className="main-msg">We couldn't verify your payment. If you were charged, please contact support.</p>
            
            <div className="action-buttons">
              <button 
                className="primary-btn retry"
                onClick={() => navigate("/citizen/donate")}
              >
                Try Again
              </button>
              <button 
                className="secondary-btn"
                onClick={() => navigate("/dashboard")}
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;
