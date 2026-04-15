import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = () => {
    const users = JSON.parse(localStorage.getItem("users")) || [];

    const foundUser = users.find(
      u => u.email === email && u.password === password
    );

    if (!foundUser) {
      alert("User not found!");
      return;
    }

    localStorage.setItem("currentUser", JSON.stringify(foundUser));
    setUser(foundUser);

    navigate("/dashboard");
  };

  return (
    <div style={{
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "linear-gradient(135deg, #2563eb, #7c3aed)"
    }}>
      <div className="card" style={{ width: "350px", textAlign: "center" }}>
        <h2>Login</h2>

        <input
          className="input"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <br /><br />

        <input
          type="password"
          className="input"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <br /><br />

        <button className="button" onClick={handleLogin}>
          Login
        </button>
      </div>
    </div>
  );
}