import { useState } from "react";

export default function Requests({ requests, setRequests, user }) {

  const [view, setView] = useState("incoming");

  const [activeMeetingId, setActiveMeetingId] = useState(null);
  const [meetingDate, setMeetingDate] = useState("");
  const [meetingTime, setMeetingTime] = useState("");
  const [meetingLink, setMeetingLink] = useState("");

  const scheduleMeeting = (id) => {
    if (!meetingDate || !meetingTime || !meetingLink) {
      alert("Fill all fields!");
      return;
    }

    setRequests(prev =>
      prev.map(r =>
        r.id === id
          ? {
              ...r,
              status: "Accepted",
              meetingDate,
              meetingTime,
              meetingLink
            }
          : r
      )
    );

    setActiveMeetingId(null);
    setMeetingDate("");
    setMeetingTime("");
    setMeetingLink("");

    alert("Meeting scheduled!");
  };

  const updateStatus = (id, status) => {
    if (status === "Accepted") {
      setActiveMeetingId(id);
    } else {
      setRequests(prev =>
        prev.map(r =>
          r.id === id ? { ...r, status } : r
        )
      );
    }
  };

  const incoming = requests.filter(r => r.receiver === user.email);
  const sent = requests.filter(r => r.sender === user.email);

  const currentList = view === "incoming" ? incoming : sent;

  return (
    <div className="container">
      <h2>Requests</h2>

      {/* 🔥 TAB */}
      <div style={{ marginBottom: "20px" }}>
        <button className="button" onClick={() => setView("incoming")}>
          Incoming
        </button>

        <button
          className="button secondary"
          style={{ marginLeft: "10px" }}
          onClick={() => setView("sent")}
        >
          Sent
        </button>
      </div>

      {currentList.length === 0 && (
        <p>No {view} requests</p>
      )}

      {currentList.map((r) => (
        <div className="card" key={r.id} style={{ borderLeft: "5px solid #7c3aed" }}>

          {/* 🔥 TITLE */}
          <h3>{r.postTitle}</h3>

          {/* 🔥 FROM / TO */}
          {view === "incoming" ? (
            <p style={{ color: "#475569" }}>
              <b>From:</b> {r.sender}
            </p>
          ) : (
            <p style={{ color: "#475569" }}>
              <b>To:</b> {r.receiver}
            </p>
          )}

          {/* 🔥 MESSAGE */}
          <p>💬 {r.message}</p>

          {/* 🔥 FIELDS */}
          <p>🧠 <b>Medical:</b> {r.medicalField}</p>

          {r.aiField && (
            <p>🤖 <b>AI:</b> {r.aiField}</p>
          )}

          {/* 🔥 STATUS */}
          <p>
            <span
              className={`badge ${
                r.status === "Accepted"
                  ? "green"
                  : r.status === "Rejected"
                  ? "red"
                  : "orange"
              }`}
            >
              {r.status}
            </span>
          </p>

          {/* 🔥 MEETING INFO */}
          {r.meetingDate && (
            <p>📅 <b>Date:</b> {r.meetingDate}</p>
          )}

          {r.meetingTime && (
            <p>⏰ <b>Time:</b> {r.meetingTime}</p>
          )}

          {r.meetingLink && (
            <p>
              🔗{" "}
              <a
                href={r.meetingLink}
                target="_blank"
                rel="noreferrer"
                style={{ color: "#2563eb", fontWeight: "500" }}
              >
                Join Meeting
              </a>
            </p>
          )}

          {/* 🔥 MEETING FORM */}
          {activeMeetingId === r.id && (
            <div style={{ marginTop: "10px" }}>

              <input
                type="date"
                className="input"
                value={meetingDate}
                onChange={(e) => setMeetingDate(e.target.value)}
              />

              <br /><br />

              <input
                type="time"
                className="input"
                value={meetingTime}
                onChange={(e) => setMeetingTime(e.target.value)}
              />

              <br /><br />

              <input
                className="input"
                placeholder="Meeting Link"
                value={meetingLink}
                onChange={(e) => setMeetingLink(e.target.value)}
              />

              <br /><br />

              <button
                className="button"
                onClick={() => scheduleMeeting(r.id)}
              >
                Confirm Meeting
              </button>
            </div>
          )}

          {/* 🔥 ACTIONS */}
          {view === "incoming" && r.status === "Pending" && (
            <div style={{ marginTop: "10px" }}>
              <button
                className="button"
                onClick={() => updateStatus(r.id, "Accepted")}
              >
                Accept
              </button>

              <button
                className="button danger"
                style={{ marginLeft: "10px" }}
                onClick={() => updateStatus(r.id, "Rejected")}
              >
                Reject
              </button>
            </div>
          )}

        </div>
      ))}
    </div>
  );
}