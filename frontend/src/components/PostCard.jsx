export default function PostCard({ post, setRequests, user }) {

  const handleInterest = () => {
    if (post.owner === user.email) {
      alert("You cannot send request to your own post!");
      return;
    }

    const message = prompt("Write a message:");

    if (!message) {
      alert("Message required!");
      return;
    }

    const newRequest = {
      id: Date.now(),
      postTitle: post.title,
      status: "Pending",
      message,

      sender: user.email,
      senderRole: user.role,
      senderSpecialization: user.specialization,

      receiver: post.owner,

      // 🔥 YENİ MODEL
      medicalField: post.medicalField,
      aiField: post.aiField,

      meetingLink: null
    };

    setRequests(prev => [...prev, newRequest]);

    alert("Request sent!");
  };

  return (
    <div className="card">
      <h3>{post.title}</h3>

      {/* 🔥 OWNER */}
      <p><b>Owner:</b> {post.owner}</p>
      <p><b>Role:</b> {post.ownerRole}</p>

      {/* 🔥 MEDICAL FIELD */}
      <p><b>Medical Field:</b> {post.medicalField}</p>

      {/* 🔥 AI FIELD (SADECE VARSA) */}
      {post.aiField && (
        <p><b>AI Method:</b> {post.aiField}</p>
      )}

      {/* 🔥 OWNER SPECIALIZATION */}
      {post.ownerRole === "Doctor" && (
        <p><b>Doctor Field:</b> {post.ownerSpecialization}</p>
      )}

      {/* 🔥 STATUS */}
      <p>
        <b>Status:</b>{" "}
        <span
          style={{
            color:
              post.status === "Active"
                ? "green"
                : "red"
          }}
        >
          {post.status}
        </span>
      </p>

      <button
        className="button"
        onClick={handleInterest}
        disabled={post.status === "Closed"}
      >
        {post.status === "Closed" ? "Closed" : "Interested"}
      </button>
    </div>
  );
}