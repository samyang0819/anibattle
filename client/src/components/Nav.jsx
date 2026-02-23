// src/components/Nav.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { clearToken, isAuthed } from "../lib/auth";

export default function Nav() {
  // React Router navigation hook
  // Used for redirecting after logout
  const nav = useNavigate();

  // Simple auth check (token presence)
  // We intentionally call this on render instead of storing it in state,
  // so nav reflects login/logout immediately.
  const authed = isAuthed();

  // Small reusable nav item component.
  // Keeps markup clean and avoids repeating icon + label structure.
  const Item = ({ to, label, icon }) => (
    <Link className="pill" to={to}>
      <span style={{ opacity: 0.95 }}>{icon}</span>
      <span>{label}</span>
    </Link>
  );

  return (
    <div className="nav">
      <div className="navInner">

        {/* Brand section — left side */}
        <div className="brand">
           {/* Decorative badge element (pure visual) */}
          <div className="badge" />
          <div>
            <div className="brandName">ANIBATTLE</div>
            <div className="brandTag">Quiz • Rank • Battle</div>
          </div>
        </div>

        {/* Navigation links — right side */}
        <div className="navLinks">

          {/* Core gameplay routes */}
          <Item to="/" label="Solo" icon="🌀" />
          <Item to="/battle" label="Battle" icon="⚔️" />
          <Item to="/leaderboard" label="Ranks" icon="🏆" />
          <Item to="/gallery" label="Gallery" icon="🖼️" />

          {/* Auth-only routes */}
          {authed && <Item to="/profile" label="Profile" icon="👤" />}
          {authed && <Item to="/admin/questions" label="Admin" icon="🛠️" />}

          {/* Login / Signup if not authenticated */}
          {!authed ? (
            <>
              <Item to="/login" label="Login" icon="🔑" />
              <Item to="/signup" label="Signup" icon="📝" />
            </>
          ) : (
            // Logout button replaces login/signup when authenticated
            <button
              className="pill"
              onClick={() => {
                // Clear token from storage
                clearToken();

                // Redirect to login screen
                nav("/login");
              }}
            >
              🚪 Logout
            </button>
          )}
        </div>
      </div>
    </div>
  );
}