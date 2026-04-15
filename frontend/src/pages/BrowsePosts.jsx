import { useState } from "react";
import PostCard from "../components/PostCard";

export default function BrowsePosts({ posts, setRequests, user }) {

  const [search, setSearch] = useState("");

  // 🔥 SMART FILTER (ROLE BAĞIMSIZ)
  const filteredPosts =
  user.specialization
    ? posts.filter(p =>
        p.medicalField?.toLowerCase() ===
        user.specialization?.toLowerCase()
      )
    : posts;

  // 🔥 SEARCH
  const searchedPosts = filteredPosts.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container">
      <h2>Browse Posts</h2>

      <input
        className="input"
        placeholder="Search posts..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <br /><br />

      {searchedPosts.length === 0 && <p>No posts found</p>}

      {searchedPosts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          setRequests={setRequests}
          user={user}
        />
      ))}
    </div>
  );
}