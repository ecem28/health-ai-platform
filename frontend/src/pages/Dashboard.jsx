import { useNavigate } from "react-router-dom";

export default function Dashboard({ user, posts, requests }) {

  const navigate = useNavigate();

  const myPosts = posts.filter(p => p.owner === user.email);
  const myRequests = requests.filter(r => r.receiver === user.email);
  const myMeetings = requests.filter(r => r.meetingLink);

  return (
    <div className="container">
      <h2>Welcome, {user.name} 👋</h2>

      {/* 🔥 STATS CARDS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "20px",
          marginTop: "20px"
        }}
      >

        {/* 📌 POSTS */}
        <div
          className="card"
          style={{ cursor: "pointer", borderLeft: "5px solid #2563eb" }}
          onClick={() => navigate("/myposts")}
        >
          <h3>📌 My Posts</h3>
          <p>{myPosts.length} active posts</p>
        </div>

        {/* 📩 REQUESTS */}
        <div
          className="card"
          style={{ cursor: "pointer", borderLeft: "5px solid #f59e0b" }}
          onClick={() => navigate("/requests")}
        >
          <h3>📩 Incoming Requests</h3>
          <p>{myRequests.length} requests</p>
        </div>

        {/* 📅 MEETINGS */}
        <div
          className="card"
          style={{ cursor: "pointer", borderLeft: "5px solid #10b981" }}
          onClick={() => navigate("/requests")}
        >
          <h3>📅 Meetings</h3>
          <p>{myMeetings.length} scheduled</p>
        </div>

      </div>

      {/* 🔥 UPCOMING MEETINGS */}
      <div style={{ marginTop: "30px" }}>
        <h3>Upcoming Meetings</h3>

        {myMeetings.length === 0 && <p>No meetings yet</p>}

        {myMeetings.map(m => (
          <div className="card" key={m.id}>

            <p><b>{m.postTitle}</b></p>

            <p>📅 {m.meetingDate}</p>
            <p>⏰ {m.meetingTime}</p>

            <a
              href={m.meetingLink}
              target="_blank"
              rel="noreferrer"
              style={{ color: "#2563eb", fontWeight: "500" }}
            >
              Join Meeting
            </a>

          </div>
        ))}
      </div>
    </div>
  );
}