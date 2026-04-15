import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register({ setUser }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Engineer");
  const [specialization, setSpecialization] = useState("");

  const navigate = useNavigate();

  const handleRegister = () => {
    if (!name || !email || !password) {
      alert("Please fill all fields!");
      return;
    }

    if (!email.endsWith(".edu")) {
      alert("Only .edu emails allowed!");
      return;
    }

    if (role === "Doctor" && !specialization) {
      alert("Please enter your specialization!");
      return;
    }

    const existingUsers =
      JSON.parse(localStorage.getItem("users")) || [];

    const userExists = existingUsers.find(u => u.email === email);

    if (userExists) {
      alert("User already exists!");
      return;
    }

    const newUser = {
      name,
      email,
      password,
      role,
      specialization: role === "Doctor" ? specialization : null
    };

    const updatedUsers = [...existingUsers, newUser];

    localStorage.setItem("users", JSON.stringify(updatedUsers));
    localStorage.setItem("currentUser", JSON.stringify(newUser));

    setUser(newUser);

    alert("Account created successfully!");

    navigate("/dashboard");
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #2563eb, #7c3aed)"
      }}
    >
      <div className="card" style={{ width: "380px" }}>
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
          Create Account
        </h2>

        <input
          className="input"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <br /><br />

        <input
          className="input"
          placeholder="Email (.edu)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <br /><br />

        <input
          type="password"
          className="input"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <br /><br />

        {/* 🔥 ROLE SELECT */}
        <select
          className="input"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="Engineer">Engineer</option>
          <option value="Doctor">Doctor</option>
        </select>

        {/* 🔥 DOCTOR SPECIALIZATION */}
        {role === "Doctor" && (
          <>
            <br /><br />
            <input
              className="input"
              placeholder="Specialization (e.g. Cardiology)"
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
            />
          </>
        )}

        <br /><br />

        <button
          className="button"
          style={{ width: "100%" }}
          onClick={handleRegister}
        >
          Register
        </button>

        {/* 🔥 LOGIN LINK */}
        <p style={{ marginTop: "15px", textAlign: "center" }}>
          Already have an account?{" "}
          <span
            style={{
              color: "#2563eb",
              cursor: "pointer",
              fontWeight: "500"
            }}
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}