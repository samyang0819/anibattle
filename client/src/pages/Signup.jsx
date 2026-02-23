import React, { useState } from "react";
import { api } from "../lib/api";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const nav = useNavigate();

  // Controlled inputs for signup form
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Displays backend validation errors (duplicate email, weak password, etc.)
  const [err, setErr] = useState("");

  async function submit(e) {
    // Prevent full page reload
    e.preventDefault();

    setErr("");

    try {
      // Send signup data to backend
      const data = await api("/auth/signup", {
        method: "POST",
        body: { username, email, password }
      });

      // Store token immediately after successful signup
      // (Consider using setToken() for consistency with Login page.)
      localStorage.setItem("token", data.token);

      // Redirect user to main page after account creation
      nav("/");
    } catch (e) {
      // Most likely validation or duplicate account error
      setErr(e.message);
    }
  }

  return (
    <div className="hero" style={{ gridTemplateColumns: "1fr" }}>
      <div className="card">
        <div className="cardHeader">
          <div className="h1" style={{ fontSize: 44 }}>Signup</div>
          <div className="sub">Create an account and start climbing tiers.</div>
        </div>
        <div className="cardBody">
          {err && <div className="notice noticeBad">{err}</div>}

          {/* Simple stacked form layout */}
          <form onSubmit={submit} style={{ display: "grid", gap: 12, maxWidth: 520 }}>
            <div className="field">
              <div className="label">Username</div>
              <input className="input" value={username} onChange={e => setUsername(e.target.value)} />
            </div>

            <div className="field">
              <div className="label">Email</div>
              <input className="input" value={email} onChange={e => setEmail(e.target.value)} />
            </div>

            <div className="field">
              <div className="label">Password</div>
              <input className="input" type="password" value={password} onChange={e => setPassword(e.target.value)} />
            </div>

            {/* No fancy validation yet — backend handles it */}
            <button className="btn">Create Account</button>
          </form>
        </div>
      </div>
    </div>
  );
}