export default function Profile({ user }) {
  return (
    <div className="container">
      <div className="card">
        <h2>Profile</h2>

        <p><b>Name:</b> {user?.name}</p>
        <p><b>Email:</b> {user?.email}</p>
        <p><b>Role:</b> {user?.role}</p>

        {/* 🔥 Doctor ise branch göster */}
        {user?.role === "Doctor" && (
          <p><b>Specialization:</b> {user?.specialization}</p>
        )}
      </div>
    </div>
  );
}