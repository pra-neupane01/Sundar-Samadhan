import { useNavigate } from "react-router-dom";
import { 
  XCircle, 
  ArrowLeft, 
  ShieldAlert,
  RefreshCw
} from "lucide-react";
import "./PaymentStatus.css";

const PaymentCancel = () => {
  const navigate = useNavigate();

  return (
    <div className="payment-status-container">
      <div className="status-card glass-morphism">
        <div className="status-content cancel">
          <div className="icon-wrapper cancel-bg">
            <ShieldAlert size={48} />
          </div>
          <h1>Donation Cancelled</h1>
          <p className="main-msg">The payment process was cancelled. No charges were made to your account.</p>
          
          <div className="info-note">
            <p>Your support is vital for our community projects. If you experienced any issues with the payment form, please let us know.</p>
          </div>

          <div className="action-buttons">
            <button 
              className="primary-btn"
              onClick={() => navigate("/citizen/donate")}
            >
              <RefreshCw size={18} />
              <span>Retry Donation</span>
            </button>
            <button 
              className="secondary-btn"
              onClick={() => navigate("/dashboard")}
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancel;
