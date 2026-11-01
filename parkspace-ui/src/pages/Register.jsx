 
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../services/authService";
import "./Auth.css";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleRegister = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!form.name.trim() || !form.email.trim()) {
      setError("Please enter your name and email address.");
      return;
    }

    if (form.password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      // Use the shared authentication service.
      await register(
        form.name.trim(),
        form.email.trim(),
        form.password
      );

      setSuccess("Your account has been created successfully.");

      // Allow the user to read the success message.
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 1200);
    } catch (err) {
      console.error(
        "Registration error:",
        err.response?.data || err.message
      );

      setError(
        err.response?.data?.message ||
          "Registration failed. Please check your details and try again."
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
        <Link to="/login" className="auth-brand">
          <span className="auth-brand-icon">P</span>
          <span>parkspace</span>
          <span className="auth-brand-period">.</span>
        </Link>

        <Link to="/login" className="auth-header-link">
          Already a member? <span>Sign in →</span>
        </Link>
      </header>

      {/* Main content */}
      <section className="auth-content">
        {/* Introduction */}
        <div className="auth-intro">
          <div className="auth-overline">
            <span className="auth-overline-line" />
            PARKSPACE / GET STARTED
          </div>

          <h1 className="auth-hero-title">
            Find your
            <br />
            <span>place.</span>
            <br />
            Own your journey.
          </h1>

          <p className="auth-hero-description">
            A simpler way to discover parking, manage your
            bookings, and spend less time searching for a space.
          </p>

          {/* Parking illustration */}
          <div className="auth-illustration">
            <div className="auth-illustration-top">
              <span>FIG. 002</span>
              <span>YOUR JOURNEY / STARTS HERE</span>
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
                <span>02 — 03</span>
              </div>
            </div>

            <div className="auth-illustration-bottom">
              <span>MADE FOR YOUR EVERYDAY JOURNEY</span>
              <span>↗</span>
            </div>
          </div>
        </div>

        {/* Registration form */}
        <div className="auth-form-panel">
          <div className="auth-form-card">
            <div className="auth-form-heading">
              <span className="auth-form-label">
                CREATE YOUR ACCOUNT
              </span>

              <h2>Join ParkSpace.</h2>

              <p>Enter your details to get started.</p>
            </div>

            <form onSubmit={handleRegister} className="auth-form">
              {/* Full name */}
              <div className="auth-field">
                <label htmlFor="register-name">
                  Full name
                </label>

                <input
                  id="register-name"
                  name="name"
                  type="text"
                  placeholder="Your full name"
                  value={form.name}
                  onChange={handleChange}
                  autoComplete="name"
                  maxLength={100}
                  required
                />
              </div>

              {/* Email */}
              <div className="auth-field">
                <label htmlFor="register-email">
                  Email address
                </label>

                <input
                  id="register-email"
                  name="email"
                  type="email"
                  placeholder="you@gmail.com"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                />
              </div>

              {/* Password */}
              <div className="auth-field">
                <label htmlFor="register-password">
                  Password
                </label>

                <div className="auth-password-wrapper">
                  <input
                    id="register-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="At least 8 characters"
                    value={form.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                    minLength={8}
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

              {/* Confirm password */}
              <div className="auth-field">
                <label htmlFor="register-confirm-password">
                  Confirm password
                </label>

                <input
                  id="register-confirm-password"
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Re-enter your password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  autoComplete="new-password"
                  required
                />
              </div>

              {/* Error */}
              {error && (
                <div className="auth-error" role="alert">
                  <span>!</span>
                  <p>{error}</p>
                </div>
              )}

              {/* Success */}
              {success && (
                <div className="auth-success" role="status">
                  <span>✓</span>
                  <p>{success}</p>
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
                    Creating account...
                  </>
                ) : (
                  <>
                    Create account
                    <span>→</span>
                  </>
                )}
              </button>
            </form>

            <div className="auth-divider">
              <span />
              <span>ALREADY REGISTERED?</span>
              <span />
            </div>

            <Link to="/login" className="auth-secondary-button">
              Sign in to your account
              <span>↗</span>
            </Link>

            <p className="auth-terms">
              Your account helps you manage your ParkSpace
              bookings in one place.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="auth-footer">
        <span>© {new Date().getFullYear()} PARKSPACE</span>
        <span>FIND A PLACE TO PARK. MAKE ROOM FOR WHAT MATTERS.</span>
        <span>MADE FOR YOUR JOURNEY.</span>
      </footer>
    </main>
  );
}
 
