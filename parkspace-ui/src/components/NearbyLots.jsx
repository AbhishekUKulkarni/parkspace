 
import { useNavigate } from "react-router-dom";
import { ParkingLotsSkeleton } from "./Skeleton";

export default function NearbyLots({
  lots = [],
  search,
  loading,
}) {
  const navigate = useNavigate();

  const handleLotClick = (lotId) => {
    if (lotId !== undefined && lotId !== null) {
      navigate(`/lots/${lotId}`);
    }
  };

  return (
    <section className="ps-lots">
      <style>{`
        .ps-lots {
          --lots-bg: var(--bg, #0c0d0b);
          --lots-card: var(--surface, #151612);
          --lots-text: var(--text, #f4f5ef);
          --lots-muted: var(--muted, #a1a49a);
          --lots-border: var(--border, #292b25);
          --lots-accent: var(--accent, #c7ff45);

          width: 100%;
          margin: 0 auto 36px;
          color: var(--lots-text);
          font-family: inherit;
        }

        .ps-lots *,
        .ps-lots *::before,
        .ps-lots *::after {
          box-sizing: border-box;
        }

        .ps-lots-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          flex-wrap: wrap;
          gap: 16px;
          margin-bottom: 22px;
        }

        .ps-lots-eyebrow {
          margin: 0 0 9px;
          color: var(--lots-accent);
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 2px;
        }

        .ps-lots-title {
          margin: 0;
          color: var(--lots-text);
          font-size: clamp(24px, 3vw, 31px);
          font-weight: 800;
          letter-spacing: -1.1px;
          line-height: 1.2;
        }

        .ps-lots-subtitle {
          margin: 10px 0 0;
          color: var(--lots-muted);
          font-size: 13px;
          line-height: 1.8;
        }

        .ps-lots-count {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
          padding: 9px 12px;
          background: var(--lots-card);
          color: var(--lots-muted);
          border: 1px solid var(--lots-border);
          border-radius: 9px;
          font-size: 11px;
          font-weight: 600;
        }

        .ps-lots-count-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--lots-accent);
        }

        .ps-lots-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
        }

        .ps-lots-card {
          display: flex;
          flex-direction: column;
          min-width: 0;
          padding: 21px;
          background: var(--lots-card);
          border: 1px solid var(--lots-border);
          border-radius: 15px;
          cursor: pointer;
          outline-offset: 4px;
          transition:
            transform 0.2s ease,
            border-color 0.2s ease,
            background 0.2s ease;
        }

        .ps-lots-card:hover {
          transform: translateY(-3px);
          border-color: rgba(199, 255, 69, 0.4);
        }

        .ps-lots-card:focus-visible {
          outline: 2px solid var(--lots-accent);
        }

        .ps-lots-card-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
          margin-bottom: 22px;
        }

        .ps-lots-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          flex-shrink: 0;
          background: rgba(199, 255, 69, 0.08);
          color: var(--lots-accent);
          border: 1px solid rgba(199, 255, 69, 0.19);
          border-radius: 12px;
        }

        .ps-lots-status {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 9px;
          background: rgba(199, 255, 69, 0.07);
          color: var(--lots-accent);
          border: 1px solid rgba(199, 255, 69, 0.17);
          border-radius: 8px;
          font-size: 10px;
          font-weight: 700;
        }

        .ps-lots-status-dot {
          width: 6px;
          height: 6px;
          background: var(--lots-accent);
          border-radius: 50%;
        }

        .ps-lots-name {
          margin: 0 0 10px;
          color: var(--lots-text);
          font-size: 16px;
          font-weight: 750;
          letter-spacing: -0.3px;
          line-height: 1.5;
          overflow-wrap: anywhere;
        }

        .ps-lots-address {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          min-height: 44px;
          margin: 0 0 20px;
          color: var(--lots-muted);
          font-size: 12px;
          line-height: 1.8;
          overflow-wrap: anywhere;
        }

        .ps-lots-address-icon {
          display: inline-flex;
          flex-shrink: 0;
          margin-top: 2px;
          color: var(--lots-accent);
        }

        .ps-lots-divider {
          height: 1px;
          margin-top: auto;
          margin-bottom: 16px;
          background: var(--lots-border);
        }

        .ps-lots-card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
        }

        .ps-lots-facility {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          color: var(--lots-muted);
          font-size: 10px;
        }

        .ps-lots-facility-icon {
          display: inline-flex;
          color: var(--lots-muted);
        }

        .ps-lots-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          min-height: 37px;
          padding: 0 12px;
          background: var(--lots-accent);
          color: #17190f;
          border: 1px solid transparent;
          border-radius: 9px;
          font-family: inherit;
          font-size: 11px;
          font-weight: 800;
          white-space: nowrap;
          cursor: pointer;
          transition: transform 0.18s, box-shadow 0.18s;
        }

        .ps-lots-button:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 14px rgba(199, 255, 69, 0.14);
        }

        .ps-lots-button:focus-visible {
          outline: 2px solid var(--lots-accent);
          outline-offset: 3px;
        }

        .ps-lots-button-arrow {
          font-size: 15px;
          line-height: 1;
        }

        .ps-lots-empty {
          padding: 42px 22px;
          background: var(--lots-card);
          border: 1px dashed var(--lots-border);
          border-radius: 15px;
          text-align: center;
        }

        .ps-lots-empty-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 55px;
          height: 55px;
          margin: 0 auto 17px;
          background: rgba(199, 255, 69, 0.07);
          color: var(--lots-accent);
          border: 1px solid rgba(199, 255, 69, 0.17);
          border-radius: 14px;
        }

        .ps-lots-empty-title {
          margin: 0;
          color: var(--lots-text);
          font-size: 17px;
          font-weight: 750;
        }

        .ps-lots-empty-text {
          max-width: 390px;
          margin: 10px auto 0;
          color: var(--lots-muted);
          font-size: 12px;
          line-height: 1.8;
          overflow-wrap: anywhere;
        }

        @media (max-width: 950px) {
          .ps-lots-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 600px) {
          .ps-lots {
            margin-bottom: 25px;
          }

          .ps-lots-header {
            align-items: flex-start;
            margin-bottom: 18px;
          }

          .ps-lots-grid {
            grid-template-columns: 1fr;
            gap: 12px;
          }

          .ps-lots-card {
            padding: 18px;
          }

          .ps-lots-card-top {
            margin-bottom: 17px;
          }

          .ps-lots-name {
            font-size: 15px;
          }

          .ps-lots-address {
            min-height: 0;
            margin-bottom: 16px;
          }

          .ps-lots-card-footer {
            gap: 10px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .ps-lots *,
          .ps-lots *::before,
          .ps-lots *::after {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      <div className="ps-lots-header">
        <div>
          <p className="ps-lots-eyebrow">
            {search ? "YOUR SEARCH RESULTS" : "PARKSPACE"}
          </p>

          <h2 className="ps-lots-title">
            {search ? "Parking near you" : "Nearby parking"}
          </h2>

          <p className="ps-lots-subtitle">
            Find the right parking space for your journey.
          </p>
        </div>

        {!loading && lots.length > 0 && (
          <span className="ps-lots-count">
            <span className="ps-lots-count-dot" />
            {lots.length} {lots.length === 1 ? "location" : "locations"}
          </span>
        )}
      </div>

      {loading && <ParkingLotsSkeleton count={3} />}

      {!loading && lots.length === 0 && (
        <div className="ps-lots-empty">
          <div className="ps-lots-empty-icon">
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="5" y="3" width="14" height="18" rx="3" />
              <path d="M10 17V7h3a3 3 0 0 1 0 6h-3" />
            </svg>
          </div>

          <h3 className="ps-lots-empty-title">
            {search
              ? "No parking locations found"
              : "Ready to find parking?"}
          </h3>

          <p className="ps-lots-empty-text">
            {search
              ? `We couldn't find parking near "${search}". Try another location.`
              : "Enter your location above to discover available parking facilities."}
          </p>
        </div>
      )}

      {!loading && lots.length > 0 && (
        <div className="ps-lots-grid">
          {lots.map((lot) => (
            <article
              key={lot.id}
              className="ps-lots-card"
              role="link"
              tabIndex={0}
              aria-label={`View details for ${lot.name || "parking facility"}`}
              onClick={() => handleLotClick(lot.id)}
              onKeyDown={(event) => {
                if (
                  (event.key === "Enter" || event.key === " ") &&
                  event.target === event.currentTarget
                ) {
                  event.preventDefault();
                  handleLotClick(lot.id);
                }
              }}
            >
              <div className="ps-lots-card-top">
                <div className="ps-lots-icon" aria-hidden="true">
                  <svg
                    width="23"
                    height="23"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 21V3h8a5 5 0 0 1 0 10H5" />
                    <path d="M9 9v4" />
                  </svg>
                </div>

                <span className="ps-lots-status">
                  <span className="ps-lots-status-dot" />
                  Facility
                </span>
              </div>

              <h3 className="ps-lots-name">
                {lot.name || "Parking Facility"}
              </h3>

              <p className="ps-lots-address">
                <span className="ps-lots-address-icon" aria-hidden="true">
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
                    <circle cx="12" cy="10" r="2.5" />
                  </svg>
                </span>

                <span>
                  {lot.address || "Address not available"}
                </span>
              </p>

              <div className="ps-lots-divider" />

              <div className="ps-lots-card-footer">
                <span className="ps-lots-facility">
                  <span className="ps-lots-facility-icon" aria-hidden="true">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="3" y="5" width="18" height="15" rx="2" />
                      <path d="M7 5V3h10v2M7 10h10M7 14h4" />
                    </svg>
                  </span>
                  Parking facility
                </span>

                <button
                  type="button"
                  className="ps-lots-button"
                  onClick={(event) => {
                    event.stopPropagation();
                    handleLotClick(lot.id);
                  }}
                  disabled={lot.id === undefined || lot.id === null}
                >
                  View Parking
                  <span className="ps-lots-button-arrow" aria-hidden="true">
                    ↗
                  </span>
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
 
