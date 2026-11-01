  
import { useState } from "react";
import SearchBar from "../components/SearchBar";
import NearbyLots from "../components/NearbyLots";
import API from "../api/axios";

export default function Dashboard() {
  const [search, setSearch] = useState("");
  const [lots, setLots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (location) => {
    const query = location?.trim();

    if (!query) {
      setError("Enter a location to find parking.");
      return;
    }

    setSearch(query);
    setLoading(true);
    setError("");
    setLots([]);

    try {
      const response = await API.get("/lots/search", {
        params: { location: query },
      });

      setLots(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Parking search failed:", err);

      if (err.response?.status === 401 || err.response?.status === 403) {
        setError("Your session may have expired. Please log in again.");
      } else if (!err.response) {
        setError("Unable to connect to the server. Please try again.");
      } else {
        setError(
          err.response?.data?.message ||
            "We couldn't find parking right now. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="ps-home">
      <style>{`
        .ps-home {
          --home-bg: var(--bg, #0c0d0b);
          --home-card: var(--surface, #151612);
          --home-input: var(--surface-2, #20211c);
          --home-text: var(--text, #f4f5ef);
          --home-muted: var(--muted, #a1a49a);
          --home-border: var(--border, #292b25);
          --home-accent: var(--accent, #c7ff45);

          min-height: 100vh;
          padding: 0 28px;
          background: var(--home-bg);
          color: var(--home-text);
          font-family: inherit;
          box-sizing: border-box;
        }

        .ps-home *,
        .ps-home *::before,
        .ps-home *::after {
          box-sizing: border-box;
        }

        .ps-home-inner {
          width: 100%;
          max-width: 1160px;
          margin: 0 auto;
        }

        /* Hero */

        .ps-home-hero {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: clamp(72px, 11vh, 112px) 0 58px;
          text-align: center;
        }

        .ps-home-eyebrow {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          margin: 0 0 22px;
          color: var(--home-accent);
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 2.5px;
          text-transform: uppercase;
        }

        .ps-home-eyebrow-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--home-accent);
          box-shadow: 0 0 12px rgba(199, 255, 69, 0.35);
        }

        .ps-home-title {
          max-width: 800px;
          margin: 0;
          color: var(--home-text);
          font-size: clamp(30px, 7vw, 70px);
          font-weight: 800;
          letter-spacing: -4px;
          line-height: 1.04;
        }
 
        .ps-home-title span {
          color: var(--home-accent);
        }

        .ps-home-description {
          max-width: 430px;
          margin: 23px 0 0;
          color: var(--home-muted);
          font-size: 14px;
          line-height: 1.9;
        }

        /* Search */

        .ps-home-search-wrap {
          width: 100%;
          max-width: 690px;
          margin-top: 38px;
          text-align: left;
        }

        .ps-home-search-label {
          display: block;
          margin: 0 0 11px 4px;
          color: var(--home-muted);
          font-size: 11px;
          font-weight: 650;
          letter-spacing: 0.5px;
        }

        .ps-home-search-panel {
          position: relative;
          padding: 8px;
          background: var(--home-card);
          border: 1px solid var(--home-border);
          border-radius: 17px;
          box-shadow: 0 14px 45px rgba(0, 0, 0, 0.12);
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .ps-home-search-panel:focus-within {
          border-color: rgba(199, 255, 69, 0.55);
          box-shadow: 0 0 0 4px rgba(199, 255, 69, 0.055);
        }

        /*
          SearchBar stays responsible for the actual search form,
          API-triggering callback, input and loading button.
        */

        .ps-home-search-panel form {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          margin: 0;
        }

        .ps-home-search-panel input {
          width: 100%;
          min-width: 0;
          min-height: 48px;
          padding: 0 15px;
          background: transparent;
          color: var(--home-text);
          border: none;
          outline: none;
          box-shadow: none;
          font: inherit;
          font-size: 14px;
        }

        .ps-home-search-panel input::placeholder {
          color: var(--home-muted);
          opacity: 0.8;
        }

        .ps-home-search-panel input:focus {
          outline: none;
          box-shadow: none;
        }

        .ps-home-search-panel button {
          display: inline-flex;
          flex-shrink: 0;
          align-items: center;
          justify-content: center;
          gap: 10px;
          min-height: 48px;
          padding: 0 23px;
          background: var(--home-accent);
          color: #17190f;
          border: 1px solid transparent;
          border-radius: 11px;
          font: inherit;
          font-size: 12px;
          font-weight: 800;
          white-space: nowrap;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(199, 255, 69, 0.12);
          transition:
            transform 0.18s ease,
            box-shadow 0.18s ease,
            background 0.18s ease;
        }

        .ps-home-search-panel button:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 7px 20px rgba(199, 255, 69, 0.2);
        }

        .ps-home-search-panel button:active:not(:disabled) {
          transform: translateY(0);
        }

        .ps-home-search-panel button:disabled {
          opacity: 0.65;
          cursor: wait;
        }

        .ps-home-search-panel button:focus-visible,
        .ps-home-clear:focus-visible {
          outline: 2px solid var(--home-accent);
          outline-offset: 3px;
        }

        .ps-home-search-hint {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin: 15px 0 0;
          color: var(--home-muted);
          font-size: 11px;
        }

        .ps-home-search-hint span {
          color: var(--home-accent);
          font-size: 13px;
        }

        /* Error */

        .ps-home-error {
          max-width: 690px;
          margin: 0 auto 24px;
          padding: 14px 17px;
          color: #ffaaaa;
          background: rgba(255, 100, 100, 0.07);
          border: 1px solid rgba(255, 100, 100, 0.2);
          border-radius: 12px;
          font-size: 13px;
          line-height: 1.7;
        }

        /* Search results */

        .ps-home-results {
          padding: 25px 0 48px;
          border-top: 1px solid var(--home-border);
        }

        .ps-home-results-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 18px;
          margin-bottom: 25px;
        }

        .ps-home-results-eyebrow {
          margin: 0 0 10px;
          color: var(--home-accent);
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 2px;
        }

        .ps-home-results-title {
          margin: 0;
          color: var(--home-text);
          font-size: clamp(25px, 4vw, 35px);
          font-weight: 800;
          letter-spacing: -1.2px;
        }

        .ps-home-results-description {
          margin: 9px 0 0;
          color: var(--home-muted);
          font-size: 12px;
          line-height: 1.7;
        }

        .ps-home-clear {
          flex-shrink: 0;
          padding: 9px 13px;
          background: transparent;
          color: var(--home-muted);
          border: 1px solid var(--home-border);
          border-radius: 9px;
          font: inherit;
          font-size: 11px;
          font-weight: 650;
          cursor: pointer;
          transition: color 0.2s, border-color 0.2s;
        }

        .ps-home-clear:hover {
          color: var(--home-accent);
          border-color: var(--home-accent);
        }

        .ps-home-lots {
          width: 100%;
          min-width: 0;
        }

        /* Features: only shown before searching */

        .ps-home-features {
          padding: 32px 0 70px;
          border-top: 1px solid var(--home-border);
        }

        .ps-home-features-heading {
          margin-bottom: 24px;
        }

        .ps-home-features-eyebrow {
          margin: 0 0 10px;
          color: var(--home-muted);
          font-size: 10px;
          font-weight: 750;
          letter-spacing: 2px;
        }

        .ps-home-features-title {
          margin: 0;
          color: var(--home-text);
          font-size: clamp(25px, 4vw, 32px);
          font-weight: 800;
          letter-spacing: -1.2px;
        }

        .ps-home-features-title span {
          color: var(--home-accent);
        }

        .ps-home-features-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 15px;
        }

        .ps-home-feature {
          min-width: 0;
          padding: 22px;
          background: var(--home-card);
          border: 1px solid var(--home-border);
          border-radius: 14px;
          transition: transform 0.2s, border-color 0.2s;
        }

        .ps-home-feature:hover {
          transform: translateY(-3px);
          border-color: #484b3d;
        }

        .ps-home-feature-number {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 34px;
          height: 34px;
          margin-bottom: 22px;
          color: var(--home-accent);
          background: rgba(199, 255, 69, 0.07);
          border: 1px solid rgba(199, 255, 69, 0.15);
          border-radius: 10px;
          font-size: 11px;
          font-weight: 800;
        }

        .ps-home-feature-title {
          margin: 0 0 9px;
          color: var(--home-text);
          font-size: 14px;
          font-weight: 750;
        }

        .ps-home-feature-description {
          margin: 0;
          color: var(--home-muted);
          font-size: 12px;
          line-height: 1.8;
        }

        /* Footer */

        .ps-home-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 22px 0 26px;
          border-top: 1px solid var(--home-border);
        }

        .ps-home-footer-brand {
          color: var(--home-text);
          font-size: 12px;
          font-weight: 850;
          letter-spacing: 1.5px;
        }

        .ps-home-footer-brand span {
          color: var(--home-accent);
        }

        .ps-home-footer-note {
          color: var(--home-muted);
          font-size: 10px;
          letter-spacing: 0.5px;
          text-align: right;
        }

        @media (min-width: 1400px) {
          .ps-home-hero {
            padding-top: 120px;
          }
        }

        @media (max-width: 768px) {
          .ps-home {
            padding: 0 22px;
          }

          .ps-home-hero {
            padding-top: 72px;
            padding-bottom: 45px;
          }

          .ps-home-title {
            letter-spacing: -2.5px;
          }

          .ps-home-features-grid {
            grid-template-columns: 1fr;
            gap: 11px;
          }

          .ps-home-feature {
            display: grid;
            grid-template-columns: 38px 1fr;
            column-gap: 14px;
            align-items: start;
            padding: 17px;
          }

          .ps-home-feature-number {
            grid-row: span 2;
            margin: 0;
          }

          .ps-home-feature-title {
            margin-bottom: 5px;
          }

          .ps-home-feature-description {
            grid-column: 2;
          }
        }

        @media (max-width: 520px) {
          .ps-home {
            padding: 0 17px;
          }

          .ps-home-hero {
            padding-top: 64px;
            padding-bottom: 38px;
          }

          .ps-home-eyebrow {
            margin-bottom: 18px;
            font-size: 9px;
            letter-spacing: 2px;
          }

          .ps-home-title {
            font-size: clamp(4px, 11vw, 56px);
            letter-spacing: -2.6px;
          }

          .ps-home-description {
            max-width: 330px;
            margin-top: 17px;
            font-size: 13px;
          }

          .ps-home-search-wrap {
            margin-top: 29px;
          }

          .ps-home-search-panel {
            padding: 7px;
            border-radius: 14px;
          }

          .ps-home-search-panel form {
            flex-direction: column;
            align-items: stretch;
            gap: 7px;
          }

          .ps-home-search-panel input {
            min-height: 47px;
            padding: 0 12px;
            font-size: 13px;
          }

          .ps-home-search-panel button {
            width: 100%;
            min-height: 47px;
          }

          .ps-home-search-hint {
            font-size: 10px;
          }

          .ps-home-results {
            padding-top: 22px;
          }

          .ps-home-results-header {
            align-items: flex-start;
          }

          .ps-home-results-title {
            font-size: 27px;
          }

          .ps-home-clear {
            padding: 8px 10px;
          }

          .ps-home-features {
            padding: 28px 0 45px;
          }

          .ps-home-feature {
            padding: 15px;
          }

          .ps-home-footer {
            align-items: flex-start;
            flex-direction: column;
            gap: 9px;
          }

          .ps-home-footer-note {
            text-align: left;
            line-height: 1.7;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .ps-home *,
          .ps-home *::before,
          .ps-home *::after {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
          }
        }
      `}</style>

      <div className="ps-home-inner">
        <section className="ps-home-hero">
          <p className="ps-home-eyebrow">
            <span className="ps-home-eyebrow-dot" />
           Find Trusted Parking, Faster
          </p>

          <p className="ps-home-title">
            PARKING, WITHOUT THE HASSLE
            <br />
            <span>.</span>
          </p>

          <div className="ps-home-search-wrap">
            <label className="ps-home-search-label">
               
            </label>

            <div className="ps-home-search-panel">
              <SearchBar onSearch={handleSearch} loading={loading} />
            </div>

            <p className="ps-home-search-hint">
              <span>✳</span>
              Search a location to explore available parking.
            </p>
          </div>
        </section>

        {error && (
          <div className="ps-home-error" role="alert">
            {error}
          </div>
        )}

        {search && (
          <section className="ps-home-results">
            <div className="ps-home-results-header">
              <div>
              

                {!loading && !error && (
                  <p className="ps-home-results-description">
                    {lots.length}{" "}
                    {lots.length === 1 ? "location" : "locations"} found
                    {" "}for "{search}".
                  </p>
                )}
              </div>

              <button
                type="button"
                className="ps-home-clear"
                onClick={() => {
                  setSearch("");
                  setLots([]);
                  setError("");
                }}
              >
                Clear search
              </button>
            </div>

            <div className="ps-home-lots">
              <NearbyLots
                lots={lots}
                search={search}
                loading={loading}
              />
            </div>
          </section>
        )}

        {!search && (
          <section className="ps-home-features">
            <div className="ps-home-features-heading">
              <p className="ps-home-features-eyebrow">
                THE PARKSPACE WAY
              </p>

              <h2 className="ps-home-features-title">
                Less searching. <span>More arriving.</span>
              </h2>
            </div>

            <div className="ps-home-features-grid">
              <Feature
                number="01"
                title="Find your location"
                description="Search by location and discover nearby parking facilities."
              />

              <Feature
                number="02"
                title="Choose your spot"
                description="Explore parking details and select an available space."
              />

              <Feature
                number="03"
                title="You're all set"
                description="Manage active bookings and revisit your parking history."
              />
            </div>
          </section>
        )}

        <footer className="ps-home-footer">
          <div className="ps-home-footer-brand">
            PARK<span>SPACE</span>.
          </div>

          <div className="ps-home-footer-note">
            A little more room for your journey.   ©{" "}
            {new Date().getFullYear()} ParkSpace
          </div>
        </footer>
      </div>
    </main>
  );
}

function Feature({ number, title, description }) {
  return (
    <article className="ps-home-feature">
      <span className="ps-home-feature-number">{number}</span>

      <h3 className="ps-home-feature-title">{title}</h3>

      <p className="ps-home-feature-description">{description}</p>
    </article>
  );
}