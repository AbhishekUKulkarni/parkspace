 
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../services/authService";
import "./Auth.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // authService stores the token and available user details.
      await login(email.trim(), password);

      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error(
        "Login error:",
        err.response?.data || err.message
      );

      setError(
        err.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-background-grid" />

      {/* Header */}
      <header className="auth-header">
        <Link to="/" className="auth-brand">
          <span className="auth-brand-icon">P</span>
          <span>parkspace</span>
          <span className="auth-brand-period">.</span>
        </Link>

        <Link to="/register" className="auth-header-link">
          Create account <span>↗</span>
        </Link>
      </header>

      {/* Main content */}
      <section className="auth-content">
        {/* Left panel */}
        <div className="auth-intro">
          <div className="auth-overline">
            <span className="auth-overline-line" />
            PARKSPACE / YOUR JOURNEY STARTS HERE
          </div>

          <h1 className="auth-hero-title">
            Your next
            <br />
            destination.
            <br />
            <span>One less worry.</span>
          </h1>

          <p className="auth-hero-description">
            Find your parking space, manage your bookings,
            and make every journey a little simpler.
          </p>

          {/* Parking illustration */}
          <div className="auth-illustration">
            <div className="auth-illustration-top">
              <span>FIG. 001</span>
              <span>PARKSPACE / MOBILITY</span>
            </div>

            <div className="auth-garage">
              <div className="auth-garage-ceiling" />

              <div className="auth-garage-opening">
                <div className="auth-garage-sign">P.</div>

                <div className="auth-garage-label">
                  YOUR SPACE
                  <br />
                  AWAITS
                </div>

                <div className="auth-garage-floor">
                  <span />
                  <span />
                  <span />
                </div>
              </div>

              <div className="auth-garage-caption">
                <span>SPACE TO ARRIVE.</span>
                <span>01 — 03</span>
              </div>
            </div>

            <div className="auth-illustration-bottom">
              <span>DESIGNED AROUND YOUR JOURNEY</span>
              <span>↗</span>
            </div>
          </div>
        </div>

        {/* Login form */}
        <div className="auth-form-panel">
          <div className="auth-form-card">
            <div className="auth-form-heading">
              <span className="auth-form-label">
                YOUR ACCOUNT
              </span>

              <h2>Welcome back.</h2>

              <p>
                Enter your details to sign in to ParkSpace.
              </p>
            </div>

            <form onSubmit={handleLogin} className="auth-form">
              {/* Email */}
              <div className="auth-field">
                <label htmlFor="login-email">
                  Email address
                </label>

                <input
                  id="login-email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>

              {/* Password */}
              <div className="auth-field">
                <div className="auth-password-heading">
                  <label htmlFor="login-password">
                    Password
                  </label>
                </div>

                <div className="auth-password-wrapper">
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                  />

                  <button
                    type="button"
                    className="auth-password-toggle"
                    onClick={() =>
                      setShowPassword((previous) => !previous)
                    }
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {/* Error message */}
              {error && (
                <div className="auth-error" role="alert">
                  <span>!</span>
                  <p>{error}</p>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                className="auth-submit-button"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="auth-button-spinner" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in
                    <span>→</span>
                  </>
                )}
              </button>
            </form>

            <div className="auth-divider">
              <span />
              <span>NEW TO PARKSPACE?</span>
              <span />
            </div>

            <Link to="/register" className="auth-secondary-button">
              Create an account
              <span>↗</span>
            </Link>

            <p className="auth-terms">
              By continuing, you agree to use ParkSpace
              responsibly.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="auth-footer">
        <span>© {new Date().getFullYear()} PARKSPACE</span>

        <span>
          FIND A PLACE TO PARK. MAKE ROOM FOR WHAT MATTERS.
        </span>

        <span>MADE FOR YOUR JOURNEY.</span>
      </footer>
    </main>
  );
}

export default Login;
 
