import React, { useState } from "react";
import "./Login.css";

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Simple demo login
    if (mobile === "9876543210" && password === "1234") {
      setError("");
      onLogin();
    } else {
      setError("Invalid mobile number or password");
    }
  };

  return (
    <div className="login-page">

      {/* Header */}
      <header className="login-header">
        <div className="brand">
          <div className="brand-icon">🏛</div>
          <span>Sarkar Seva.</span>
        </div>

        <div className="header-right">
          <span>◉ English</span>
          <span className="demo-badge">Demo environment</span>
        </div>
      </header>

      {/* Main */}
      <main className="login-main">

        <div className="login-card">

          <div className="login-icon">
            🏛
          </div>

          <p className="eyebrow">CITIZEN PORTAL</p>

          <h1>Welcome back.</h1>

          <p className="login-description">
            Sign in to access your government services,
            applications and personalised assistance.
          </p>

          <form onSubmit={handleLogin}>

            {/* Mobile */}
            <div className="input-group">
              <label>Mobile number</label>

              <div className="input-wrapper">
                <span className="input-prefix">+91</span>

                <input
                  type="tel"
                  placeholder="Enter mobile number"
                  value={mobile}
                  maxLength={10}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    setMobile(value);
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div className="input-group">
              <label>Password</label>

              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Forgot password */}
            <div className="login-options">
              <label className="remember">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>

              <button
                type="button"
                className="forgot-password"
              >
                Forgot password?
              </button>
            </div>

            {/* Error */}
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            {/* Login button */}
            <button
              type="submit"
              className="login-button"
            >
              Login
              <span>→</span>
            </button>

          </form>

          <div className="divider">
            <span>or</span>
          </div>

          <button className="aadhaar-button">
            <span>◉</span>
            Continue with Aadhaar
          </button>

          <p className="demo-login">
            Demo credentials: <strong>9876543210</strong> / <strong>1234</strong>
          </p>

        </div>

        {/* Right side information */}
        <div className="login-info">

          <div className="info-badge">
            ● AI Governance Active
          </div>

          <h2>
            One connected experience
            <br />
            for essential services.
          </h2>

          <p>
            Access multiple government services through
            a single citizen portal, with transparent
            progress and guided assistance.
          </p>

          <div className="info-cards">

            <div className="info-card">
              <span>01</span>
              <div>
                <h3>One portal</h3>
                <p>
                  Access multiple services without
                  switching between platforms.
                </p>
              </div>
            </div>

            <div className="info-card">
              <span>02</span>
              <div>
                <h3>Assisted journey</h3>
                <p>
                  Get guidance at every step of your
                  application.
                </p>
              </div>
            </div>

            <div className="info-card">
              <span>03</span>
              <div>
                <h3>Track progress</h3>
                <p>
                  Follow your applications through
                  a transparent verification trail.
                </p>
              </div>
            </div>

          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="login-footer">
        <span>Independent prototype · Not an official government service.</span>
        <span>🔒 Secure demo environment</span>
      </footer>

    </div>
  );
};

export default Login;