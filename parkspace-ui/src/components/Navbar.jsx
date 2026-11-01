 
import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { logout } from "../services/authService";

function Navbar({ theme, onToggleTheme }) {
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);

  const getUserDetails = () => {
    const storedName =
      localStorage.getItem("userName") ||
      localStorage.getItem("username");

    const storedEmail = localStorage.getItem("email");
    const token = localStorage.getItem("token");

    let name = storedName || "";
    let email = storedEmail || "";

    // Read available user details from the JWT payload.
    if (token) {
      try {
        const base64Payload = token
          .split(".")[1]
          .replace(/-/g, "+")
          .replace(/_/g, "/");

        const payload = JSON.parse(atob(base64Payload));

        name =
          name ||
          payload.fullName ||
          payload.name ||
          payload.username ||
          "";

        email = email || payload.email || "";
      } catch {
        // Use locally stored information if JWT decoding fails.
      }
    }

    return {
      name: name || "User",
      email,
    };
  };

  const { name, email } = getUserDetails();

  const getInitials = (fullName) => {
    if (!fullName || fullName === "User") {
      return "UN";
    }

    const parts = fullName.trim().split(/\s+/);

    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }

    return fullName.slice(0, 2).toUpperCase();
  };

  const handleLogout = async () => {
  await logout();
  navigate("/login", { replace: true });
};

  const navLinks = [
    { label: "Explore", path: "/dashboard" },
    { label: "My Vehicles", path: "/vehicles" },
    { label: "Booking History", path: "/history" },
  ];

  return (
    <header className="ps-navbar">
      <div className="ps-navbar-inner">
        {/* Brand */}
        <Link to="/dashboard" className="ps-brand">
          <span className="ps-brand-icon">P</span>
          <span className="ps-brand-name">parkspace</span>
        </Link>

        {/* Navigation links */}
        <nav className="ps-nav-links">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `ps-nav-link ${isActive ? "active" : ""}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Theme and profile actions */}
        <div className="ps-nav-actions">
          <button
            type="button"
            className="ps-theme-toggle"
            onClick={onToggleTheme}
            aria-label={`Switch to ${
              theme === "dark" ? "light" : "dark"
            } mode`}
            title={`Switch to ${
              theme === "dark" ? "light" : "dark"
            } mode`}
          >
            {theme === "dark" ? "☀" : "☾"}
          </button>

          {/* Profile dropdown */}
          <div className="ps-profile-wrapper">
            <button
              type="button"
              className="ps-profile-button"
              onClick={() => setProfileOpen((open) => !open)}
              aria-expanded={profileOpen}
              aria-label="Open profile menu"
            >
              <span className="ps-avatar">
                {getInitials(name)}
              </span>

              <span className="ps-profile-chevron">
                {profileOpen ? "▴" : "▾"}
              </span>
            </button>

            {profileOpen && (
              <>
                <button
                  type="button"
                  className="ps-dropdown-backdrop"
                  aria-label="Close profile menu"
                  onClick={() => setProfileOpen(false)}
                />

                <div className="ps-profile-dropdown">
                  <div className="ps-dropdown-user">
                    <span className="ps-avatar ps-avatar-large">
                      {getInitials(name)}
                    </span>

                    <div className="ps-dropdown-user-info">
                      <p className="ps-greeting">
                        Hi, {name}
                      </p>

                      <span className="ps-user-caption">
                        {email || "Welcome to ParkSpace"}
                      </span>
                    </div>
                  </div>

                  <div className="ps-dropdown-divider" />

                  <button
                    type="button"
                    className="ps-dropdown-item"
                    onClick={() => {
                      setProfileOpen(false);
                      navigate("/profile");
                    }}
                  >
                    <span>◎</span>
                    My Profile
                  </button>

                  <button
                    type="button"
                    className="ps-dropdown-item ps-logout-item"
                    onClick={handleLogout}
                  >
                    <span>↪</span>
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
 
