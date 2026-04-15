import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreatePost({ posts, setPosts, user }) {

  const [title, setTitle] = useState("");
  const [medicalField, setMedicalField] = useState("");
  const [aiField, setAiField] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // 🔥 VALIDATION
    if (!title || !medicalField) {
      alert("Fill required fields!");
      return;
    }

    if (user.role === "Doctor" && !aiField) {
      alert("Doctor must select AI field!");
      return;
    }

    const newPost = {
      id: Date.now(),
      title,

      // 🔥 ANA FİELDLAR
      medicalField,
      aiField: user.role === "Doctor" ? aiField : null,

      status: "Active",

      owner: user.email,
      ownerRole: user.role,
      ownerSpecialization: user.specialization
    };

    setPosts([...posts, newPost]);

    alert("Post created!");

    navigate("/browse");
  };

  return (
    <div className="container">
      <h2>Create Post</h2>

      <p><b>Creating as:</b> {user.role}</p>

      <form onSubmit={handleSubmit}>

        <input
          className="input"
          placeholder="Project / Problem Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <br /><br />

        {/* 🔥 HERKES MEDICAL FIELD SEÇER */}
        <select
          className="input"
          value={medicalField}
          onChange={(e) => setMedicalField(e.target.value)}
        >
          <option value="">Select Medical Field</option>
          <option>Cardiology</option>
          <option>Neurology</option>
          <option>Radiology</option>
          <option>Oncology</option>
        </select>

        <br /><br />

        {/* 🔥 SADECE DOCTOR → AI FIELD */}
        {user.role === "Doctor" && (
          <>
            <select
              className="input"
              value={aiField}
              onChange={(e) => setAiField(e.target.value)}
            >
              <option value="">Select AI Method</option>
              <option>Computer Vision</option>
              <option>NLP</option>
              <option>Machine Learning</option>
              <option>Data Analysis</option>
            </select>

            <br /><br />
          </>
        )}

        <button className="button">Create</button>
      </form>
    </div>
  );
}