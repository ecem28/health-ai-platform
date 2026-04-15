import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

import Navbar from "./components/Navbar";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import BrowsePosts from "./pages/BrowsePosts";
import CreatePost from "./pages/CreatePost";
import MyPosts from "./pages/MyPosts";
import Requests from "./pages/Requests";
import Profile from "./pages/Profile";

import { posts as initialPosts } from "./data/mockData";

function AppContent() {

  // 🔥 USER
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("currentUser")) || null
  );

  // 🔥 POSTS
  const [posts, setPosts] = useState(
    JSON.parse(localStorage.getItem("posts")) || initialPosts
  );

  // 🔥 REQUESTS
  const [requests, setRequests] = useState(
    JSON.parse(localStorage.getItem("requests")) || []
  );

  // 🔥 SAVE POSTS
  useEffect(() => {
    localStorage.setItem("posts", JSON.stringify(posts));
  }, [posts]);

  // 🔥 SAVE REQUESTS
  useEffect(() => {
    localStorage.setItem("requests", JSON.stringify(requests));
  }, [requests]);

  const location = useLocation();

  // 🔥 PROTECTED ROUTE
  const ProtectedRoute = ({ children }) => {
    if (!user) return <Navigate to="/login" />;
    return children;
  };

  return (
    <>
      {/* 🔥 NAVBAR */}
      {user &&
        location.pathname !== "/login" &&
        location.pathname !== "/register" && (
          <Navbar user={user} setUser={setUser} />
        )}

      <Routes>

        {/* 🔥 LANDING REDIRECT */}
        <Route
          path="/"
          element={user ? <Navigate to="/dashboard" /> : <Landing />}
        />

        {/* PUBLIC */}
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register setUser={setUser} />} />

        {/* PROTECTED */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard user={user} posts={posts} requests={requests} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/browse"
          element={
            <ProtectedRoute>
              <BrowsePosts
                posts={posts}
                setRequests={setRequests}
                user={user}
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="/create"
          element={
            <ProtectedRoute>
              <CreatePost
                posts={posts}
                setPosts={setPosts}
                user={user}
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="/myposts"
          element={
            <ProtectedRoute>
              <MyPosts
                posts={posts}
                setPosts={setPosts}
                user={user}
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="/requests"
          element={
            <ProtectedRoute>
              <Requests
                requests={requests}
                setRequests={setRequests}
                user={user}
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile user={user} />
            </ProtectedRoute>
          }
        />

      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}