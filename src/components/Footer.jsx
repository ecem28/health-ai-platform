import React from 'react';
import './Footer.css';

const Footer = () => {
  const handleFeedbackClick = () => {
    window.location.href = 'mailto:support@healthai.com?subject=HealthAI Feedback & Suggestions';
  };

  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="footer-section">
          <h4>Support</h4>
          <p>
            For any issues or questions, please reach out to our team at<br />
            <a href="mailto:support@healthai.com" className="footer-link">support@healthai.com</a>
          </p>
        </div>
        <div className="footer-section">
          <h4>Feedback</h4>
          <p>
            Use the "Feedback" button below to submit suggestions or report issues. We value your input!
          </p>
          <button className="feedback-btn" onClick={handleFeedbackClick}>
            Feedback
          </button>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} HealthAI. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
