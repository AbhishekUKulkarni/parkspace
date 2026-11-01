
import { useState } from "react";

export default function SearchBar({ onSearch, loading }) {
  const [location, setLocation] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();

    const query = location.trim();

    if (!query || loading) {
      return;
    }

    onSearch(query);
  };

  return (
    <div className="ps-search">
      <style>{`
        .ps-search {
          width: 100%;
          font-family: inherit;
        }

        .ps-search *,
        .ps-search *::before,
        .ps-search *::after {
          box-sizing: border-box;
        }

        .ps-search-form {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          margin: 0;
        }

        .ps-search-input-wrap {
          display: flex;
          align-items: center;
          flex: 1;
          min-width: 0;
          gap: 12px;
          padding: 0 15px;
          background: var(--surface-2, #20211c);
          border: 1px solid var(--border, #292b25);
          border-radius: 12px;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .ps-search-input-wrap:focus-within {
          border-color: var(--accent, #c7ff45);
          box-shadow: 0 0 0 3px rgba(199, 255, 69, 0.07);
        }

        .ps-search-location-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: var(--accent, #c7ff45);
        }

        .ps-search-input {
          display: block;
          width: 100%;
          min-width: 0;
          height: 52px;
          padding: 0;
          background: transparent;
          color: var(--text, #f4f5ef);
          border: none;
          outline: none;
          box-shadow: none;
          font: inherit;
          font-size: 13px;
        }

        .ps-search-input::placeholder {
          color: var(--muted, #a1a49a);
          opacity: 0.9;
        }

        .ps-search-input:focus {
          outline: none;
          box-shadow: none;
        }

        .ps-search-clear {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          width: 28px;
          height: 28px;
          padding: 0;
          background: transparent;
          color: var(--muted, #a1a49a);
          border: none;
          border-radius: 7px;
          font-size: 21px;
          cursor: pointer;
          transition: color 0.2s, background 0.2s;
        }

        .ps-search-clear:hover {
          background: rgba(255, 255, 255, 0.06);
          color: var(--text, #f4f5ef);
        }

        .ps-search-submit {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          min-height: 54px;
          padding: 0 21px;
          flex-shrink: 0;
          background: var(--accent, #c7ff45);
          color: #17190f;
          border: 1px solid transparent;
          border-radius: 12px;
          font-family: inherit;
          font-size: 12px;
          font-weight: 800;
          white-space: nowrap;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(199, 255, 69, 0.12);
          transition: transform 0.18s, box-shadow 0.18s, opacity 0.18s;
        }

        .ps-search-submit:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 7px 20px rgba(199, 255, 69, 0.2);
        }

        .ps-search-submit:active:not(:disabled) {
          transform: translateY(0);
        }

        .ps-search-submit:focus-visible,
        .ps-search-clear:focus-visible {
          outline: 2px solid var(--accent, #c7ff45);
          outline-offset: 3px;
        }

        .ps-search-submit:disabled {
          opacity: 0.55;
          cursor: not-allowed;
          box-shadow: none;
        }

        .ps-search-spinner {
          width: 15px;
          height: 15px;
          border: 2px solid rgba(23, 25, 15, 0.25);
          border-top-color: #17190f;
          border-radius: 50%;
          animation: ps-search-spin 0.7s linear infinite;
        }

        @keyframes ps-search-spin {
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 520px) {
          .ps-search-form {
            flex-direction: column;
            align-items: stretch;
            gap: 9px;
          }

          .ps-search-input-wrap {
            width: 100%;
          }

          .ps-search-input {
            height: 49px;
            font-size: 13px;
          }

          .ps-search-submit {
            width: 100%;
            min-height: 49px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .ps-search *,
          .ps-search *::before,
          .ps-search *::after {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      <form className="ps-search-form" onSubmit={handleSearch}>
        <div className="ps-search-input-wrap">
          <span className="ps-search-location-icon" aria-hidden="true">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
              <circle cx="12" cy="10" r="2.5" />
            </svg>
          </span>

          <input
            className="ps-search-input"
            type="text"
            placeholder="Enter a location or address"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            aria-label="Search parking by location"
            autoComplete="street-address"
            required
          />

          {location && (
            <button
              type="button"
              className="ps-search-clear"
              onClick={() => setLocation("")}
              aria-label="Clear location"
            >
              ×
            </button>
          )}
        </div>

        <button
          type="submit"
          className="ps-search-submit"
          disabled={loading || !location.trim()}
        >
          {loading ? (
            <>
              <span className="ps-search-spinner" aria-hidden="true" />
              <span>Searching...</span>
            </>
          ) : (
            <>
              <span>Find Parking</span>
              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
 
