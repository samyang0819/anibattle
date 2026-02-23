import React from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";

// Pages
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Profile from "./pages/Profile.jsx";
import BattlePlay from "./pages/BattlePlay.jsx";
import Solo from "./pages/Solo.jsx";
import Leaderboard from "./pages/Leaderboard.jsx";
import Battle from "./pages/Battle.jsx";
import Gallery from "./pages/Gallery.jsx";
import ProtectedRoute from "./components/ProtectedRoute";

// Components
import AutoMusic from "./components/AutoMusic";
import WallpaperBackground from "./components/WallpaperBackground.jsx";

/**
 * Navigation component lives inside App
 * because it depends on routing + auth state.
 */
function Nav() {
  const nav = useNavigate();

  // Simple auth check (token presence = logged in)
  const token = localStorage.getItem("token");

  /**
   * Small wrapper to keep nav items consistent.
   * Centralizes styling + ARIA attributes.
   */
  const NavItem = ({ to, label, icon, active }) => (
    <Link 
      className={`pill ${active ? 'active' : ''}`} 
      to={to}
      role="button"
      aria-current={active ? 'page' : undefined}
    >
      <span aria-hidden="true">{icon}</span>
      <span>{label}</span>
    </Link>
  );

  return (
    <nav className="nav" role="navigation" aria-label="Main navigation">
      <div className="navInner">

        {/* Brand always routes to Solo page */}
        <Link to="/" className="brand" aria-label="AniBattle Home">
          <div className="badge" aria-hidden="true">⚡</div>
          <div>
            <div className="brandName">ANIBATTLE</div>
            <div className="brandTag">Quiz • Rank • Battle</div>
          </div>
        </Link>

        <div className="navLinks" role="menubar">
          <NavItem to="/" label="Solo" icon="🌀" />
          <NavItem to="/battle" label="Battle" icon="⚔️" />
          <NavItem to="/leaderboard" label="Ranks" icon="🏆" />
          <NavItem to="/gallery" label="Gallery" icon="🖼️" />
          <NavItem to="/profile" label="Profile" icon="👤" />

          {/* Auth-based rendering */}
          {!token ? (
            <>
              <NavItem to="/login" label="Login" icon="🔑" />
              <NavItem to="/signup" label="Signup" icon="📝" />
            </>
          ) : (
            <button
              className="pill"
              onClick={() => {
                // Clear auth state and redirect
                localStorage.removeItem("token");
                nav("/login");
              }}
              aria-label="Log out"
            >
              🚪 Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <>
      {/* Background layer renders behind everything */}
      <WallpaperBackground />
      
      {/* Ambient music controller (self-contained logic) */}
      <AutoMusic />

      {/* Subtle glow overlay purely for visual polish */}
      <div className="glow" aria-hidden="true" />

      {/* Global navigation */}
      <Nav />

     {/* Global navigation */}
      <main className="container" role="main">
        <Routes>

          {/* Public routes */}
          <Route path="/" element={<Solo />} />
          <Route path="/battle" element={<Battle />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/battle/:id" element={<BattlePlay />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Example if you later want protection:
              <Route path="/profile" element={
                <ProtectedRoute><Profile /></ProtectedRoute>
              } />
          */}
        </Routes>
      </main>

      {/* Optional floating action button (currently cosmetic) */}
      <button className="fab" aria-label="Quick action">
        ⚡
      </button>
    </>
  );
}