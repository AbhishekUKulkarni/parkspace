/* eslint-disable no-undef */
 
import { useNavigate } from "react-router-dom";

function getUserDetails() {
  const storedName =
    localStorage.getItem("userName") ||
    localStorage.getItem("username");

  const token = localStorage.getItem("token");

  let name = storedName || "";

  let email = localStorage.getItem("email") || "";

  if (token) {
    try {
      const payload = JSON.parse(
        atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))
      );

      name =
        name ||
        payload.name ||
        payload.fullName ||
        payload.username ||
        "";

      email =
        email ||
        payload.email ||
        "";
    } catch {
      // Use locally stored information when the token cannot be decoded.
    }
  }

  return {
    name: name || "User",
    email: email || "Email not available",
  };
}

function Profile() {
  const navigate = useNavigate();
  const { name, email } = getUserDetails();

  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase() || "UN";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("username");

    navigate("/login", { replace: true });
  };

  return (
    <main className="ps-page">
      {/* Page heading */}
      <section style={{ marginBottom: "32px" }}>
        <p
          className="ps-muted"
          style={{
            marginBottom: "8px",
            fontSize: "13px",
            fontWeight: 600,
            letterSpacing: "1.5px",
            textTransform: "uppercase",
          }}
        >
          Account settings
        </p>

        <h1 className="ps-page-title">
          My Profile
        </h1>

        <p className="ps-page-description">
          Manage your ParkSpace account and personal details.
        </p>
      </section>

      {/* Profile card */}
      <section
        className="ps-card"
        style={{
          maxWidth: "760px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            flexWrap: "wrap",
            paddingBottom: "28px",
            borderBottom: "1px solid var(--ps-border)",
          }}
        >
          <div
            className="ps-avatar"
            style={{
              width: "88px",
              height: "88px",
              fontSize: "26px",
            }}
          >
            {initials}
          </div>

          <div>
            <p
              className="ps-muted"
              style={{
                margin: "0 0 4px",
                fontSize: "14px",
              }}
            >
              Welcome back
            </p>

            <h2
              style={{
                margin: 0,
                fontSize: "28px",
                fontWeight: 800,
                letterSpacing: "-0.8px",
                overflowWrap: "anywhere",
              }}
            >
               // eslint-disable-next-line no-undef
               Hi, {userName || "User"} 
            </h2>

            <p
              className="ps-muted"
              style={{
                margin: "6px 0 0",
                fontSize: "14px",
                overflowWrap: "anywhere",
              }}
            >
              {email}
            </p>
          </div>
        </div>

        {/* Account information */}
        <div style={{ paddingTop: "24px" }}>
          <h3
            style={{
              margin: "0 0 20px",
              fontSize: "17px",
              fontWeight: 750,
            }}
          >
            Account information
          </h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "16px",
            }}
          >
            <div
              style={{
                padding: "18px",
                background: "var(--ps-bg)",
                border: "1px solid var(--ps-border)",
                borderRadius: "16px",
              }}
            >
              <p
                className="ps-muted"
                style={{ margin: "0 0 8px", fontSize: "12px" }}
              >
                FULL NAME
              </p>

              <p
                style={{
                  margin: 0,
                  fontWeight: 650,
                  overflowWrap: "anywhere",
                }}
              >
                {name}
              </p>
            </div>

            <div
              style={{
                padding: "18px",
                background: "var(--ps-bg)",
                border: "1px solid var(--ps-border)",
                borderRadius: "16px",
              }}
            >
              <p
                className="ps-muted"
                style={{ margin: "0 0 8px", fontSize: "12px" }}
              >
                EMAIL ADDRESS
              </p>

              <p
                style={{
                  margin: 0,
                  fontWeight: 650,
                  overflowWrap: "anywhere",
                }}
              >
                {email}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
            marginTop: "28px",
            paddingTop: "24px",
            borderTop: "1px solid var(--ps-border)",
          }}
        >
          <button
            type="button"
            className="ps-button-secondary"
            onClick={() => navigate("/dashboard")}
          >
            Back to Dashboard
          </button>

          <button
            type="button"
            className="ps-button-primary"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </section>
    </main>
  );
}

export default Profile;
 
