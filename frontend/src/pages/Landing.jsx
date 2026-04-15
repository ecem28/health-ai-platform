import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #2563eb, #7c3aed)",
        color: "white",
        textAlign: "center",
        padding: "20px"
      }}
    >
      <div>
        {/* 🔥 TITLE */}
        <h1 style={{ fontSize: "42px", marginBottom: "10px" }}>
          Health AI Platform
        </h1>

        {/* 🔥 SUBTEXT */}
        <p style={{ maxWidth: "500px", opacity: 0.9 }}>
          Connect engineers and healthcare professionals to build innovative AI solutions in medicine.
        </p>

        {/* 🔥 BUTTONS */}
        <div style={{ marginTop: "30px", display: "flex", gap: "15px", justifyContent: "center" }}>
          
          <button
            className="button"
            onClick={() => navigate("/login")}
          >
            Login
          </button>

          <button
            className="button secondary"
            onClick={() => navigate("/register")}
          >
            Register
          </button>
        </div>

        {/* 🔥 MINI FEATURES */}
        <div style={{ marginTop: "40px", fontSize: "14px", opacity: 0.85 }}>
          <p>🚀 Collaborate on AI Projects</p>
          <p>🧠 Match Medical & AI Expertise</p>
          <p>📅 Schedule Meetings Easily</p>
        </div>
      </div>
    </div>
  );
}