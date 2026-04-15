import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Navbar({ user, setUser }) {
  const navigate = useNavigate();
  const location = useLocation();

const handleLogout = () => {
  localStorage.removeItem("currentUser");
  setUser(null);

  window.location.href = "/"; // 🔥 kesin çözüm
};

  // 🔥 aktif link kontrol
  const isActive = (path) => location.pathname === path;

  const linkStyle = (path) => ({
    color: isActive(path) ? "#60a5fa" : "white",
    textDecoration: "none",
    fontWeight: isActive(path) ? "600" : "400",
    transition: "0.2s"
  });

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "15px 30px",
        background: "#1e293b",
        color: "white",
        boxShadow: "0 2px 10px rgba(0,0,0,0.2)"
      }}
    >
      {/* LOGO */}
      <h3
        style={{ cursor: "pointer" }}
        onClick={() => navigate("/dashboard")}
      >
        HealthAI
      </h3>

      {/* 🔥 NAV LINKS */}
      <div style={{ display: "flex", gap: "20px" }}>
        <Link style={linkStyle("/dashboard")} to="/dashboard">Dashboard</Link>
        <Link style={linkStyle("/browse")} to="/browse">Browse</Link>
        <Link style={linkStyle("/create")} to="/create">Create</Link>
        <Link style={linkStyle("/myposts")} to="/myposts">My Posts</Link>
        <Link style={linkStyle("/requests")} to="/requests">Requests</Link>
        <Link style={linkStyle("/profile")} to="/profile">Profile</Link>
      </div>

      {/* 🔥 USER INFO */}
      <div style={{ textAlign: "right" }}>
        <div><b>{user?.name}</b></div>

        <div style={{ fontSize: "12px", opacity: 0.8 }}>
          {user?.role}
          {user?.specialization ? ` • ${user.specialization}` : ""}
        </div>

        <button
          className="button"
          onClick={handleLogout}
          style={{ marginTop: "5px" }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}