// src/pages/Login.jsx
import React, { useState } from "react";
import { api } from "../lib/api";
import { useNavigate } from "react-router-dom";
import { setToken } from "../lib/auth";

export default function Login() {
  const nav = useNavigate();

  // Basic controlled form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Displays backend or validation errors
  const [err, setErr] = useState("");

  async function submit(e) {
    // Prevent page refresh on form submit
    e.preventDefault();

    setErr("");

    try {
      // Send credentials to backend
      const data = await api("/auth/login", { method: "POST", body: { email, password } });
     
      // Store JWT so the rest of the app knows we're authenticated
      setToken(data.token);

      // After login, send user to main page
      nav("/");
    } catch (e) {
      // Most likely wrong credentials or server error
      setErr(e.message);
    }
  }

  return (
    <div className="authWrap">
      <div className="card authCard">
        <div className="cardHeader">
          <div className="h1" style={{ fontSize: 34 }}>Login</div>
          <div className="sub">Welcome back. Time to climb.</div>
        </div>

        <div className="cardBody">
          {err && <div className="notice noticeBad">{err}</div>}

          {/* Simple controlled form */}
          <form onSubmit={submit} className="authForm">

            <div className="field">
              <div className="label">Email</div>
              <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            <div className="field">
              <div className="label">Password</div>
              <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>

             {/* Disable button until both fields have input */}
            <button className="btn" disabled={!email || !password}>
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}