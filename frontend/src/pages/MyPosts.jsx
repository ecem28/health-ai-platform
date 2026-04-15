export default function MyPosts({ posts, setPosts, user }) {

  const closePost = (id) => {
    setPosts(prev =>
      prev.map(p =>
        p.id === id ? { ...p, status: "Closed" } : p
      )
    );
  };

  const myPosts = posts.filter(p => p.owner === user.email);

  return (
    <div className="container">
      <h2>My Posts</h2>

      {myPosts.length === 0 && <p>No posts yet</p>}

      {myPosts.map((p) => (
        <div className="card" key={p.id}>
          <p>{p.title}</p>
          <p>Status: {p.status}</p>

          {p.status === "Active" && (
            <button className="button" onClick={() => closePost(p.id)}>
              Close Post
            </button>
          )}
        </div>
      ))}
    </div>
  );
}