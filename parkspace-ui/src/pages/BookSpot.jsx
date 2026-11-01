 
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getVehicles } from "../services/vehicleService";
import { createBooking } from "../services/bookingService";

export default function BookSpot() {
  const { lotId } = useParams();
  const navigate = useNavigate();

  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState("");

  const fetchVehicles = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getVehicles();
      setVehicles(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Failed to fetch vehicles:", err);
      setError("Unable to load your vehicles. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchVehicles();
  }, [fetchVehicles]);

  const handleBooking = async () => {
    if (!selectedVehicle || booking) return;

    try {
      setBooking(true);
      setError("");

      await createBooking({
        vehicleId: selectedVehicle,
        lotId,
      });

      window.alert("Parking booked successfully!");
      navigate("/history");
    } catch (err) {
      console.error("Booking failed:", err);

      const message =
        typeof err.response?.data === "string"
          ? err.response.data
          : err.response?.data?.message ||
            "Unable to complete your booking. Please try again.";

      setError(message);
    } finally {
      setBooking(false);
    }
  };

  return (
    <main className="ps-bookspot">
      <style>{`
        .ps-bookspot {
          min-height: 100vh;
          padding: 28px 22px 60px;
          background: var(--bg, #0c0d0b);
          color: var(--text, #f4f5ef);
          font-family: inherit;
          box-sizing: border-box;
        }

        .ps-bookspot *,
        .ps-bookspot *::before,
        .ps-bookspot *::after {
          box-sizing: border-box;
        }

        .ps-bookspot-container {
          width: 100%;
          max-width: 850px;
          margin: 0 auto;
        }

        .ps-bookspot-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          padding-bottom: 22px;
          border-bottom: 1px solid var(--border, #292b25);
        }

        .ps-bookspot-back {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 13px;
          background: var(--surface, #151612);
          color: var(--text, #f4f5ef);
          border: 1px solid var(--border, #292b25);
          border-radius: 9px;
          font: inherit;
          font-size: 12px;
          font-weight: 650;
          cursor: pointer;
          transition: border-color 0.2s;
        }

        .ps-bookspot-back:hover {
          border-color: var(--accent, #c7ff45);
        }

        .ps-bookspot-brand {
          color: var(--text, #f4f5ef);
          font-size: 20px;
          font-weight: 850;
          letter-spacing: -0.8px;
        }

        .ps-bookspot-brand span {
          color: var(--accent, #c7ff45);
        }

        .ps-bookspot-hero {
          padding: 52px 0 32px;
          text-align: center;
        }

        .ps-bookspot-eyebrow {
          margin: 0 0 13px;
          color: var(--accent, #c7ff45);
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 2.3px;
        }

        .ps-bookspot-title {
          margin: 0;
          color: var(--text, #f4f5ef);
          font-size: clamp(30px, 5vw, 42px);
          font-weight: 800;
          letter-spacing: -1.8px;
        }

        .ps-bookspot-subtitle {
          max-width: 430px;
          margin: 13px auto 0;
          color: var(--muted, #a1a49a);
          font-size: 13px;
          line-height: 1.8;
        }

        .ps-bookspot-panel {
          padding: 24px;
          background: var(--surface, #151612);
          border: 1px solid var(--border, #292b25);
          border-radius: 17px;
        }

        .ps-bookspot-section-heading {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
        }

        .ps-bookspot-section-title {
          margin: 0;
          color: var(--text, #f4f5ef);
          font-size: 17px;
          font-weight: 750;
          letter-spacing: -0.4px;
        }

        .ps-bookspot-count {
          color: var(--muted, #a1a49a);
          font-size: 11px;
        }

        .ps-bookspot-list {
          display: grid;
          gap: 12px;
        }

        .ps-bookspot-vehicle {
          display: flex;
          align-items: center;
          gap: 15px;
          width: 100%;
          min-width: 0;
          padding: 17px;
          background: var(--bg, #0c0d0b);
          border: 1px solid var(--border, #292b25);
          border-radius: 13px;
          color: var(--text, #f4f5ef);
          text-align: left;
          cursor: pointer;
          transition: border-color 0.2s, background 0.2s;
        }

        .ps-bookspot-vehicle:hover {
          border-color: #525648;
        }

        .ps-bookspot-vehicle.selected {
          background: rgba(199, 255, 69, 0.045);
          border-color: var(--accent, #c7ff45);
        }

        .ps-bookspot-vehicle:focus-visible {
          outline: 2px solid var(--accent, #c7ff45);
          outline-offset: 3px;
        }

        .ps-bookspot-vehicle-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          flex-shrink: 0;
          background: var(--surface, #151612);
          border: 1px solid var(--border, #292b25);
          border-radius: 12px;
          color: var(--accent, #c7ff45);
        }

        .ps-bookspot-vehicle-info {
          flex: 1;
          min-width: 0;
        }

        .ps-bookspot-vehicle-number {
          display: block;
          color: var(--text, #f4f5ef);
          font-size: 14px;
          font-weight: 750;
          overflow-wrap: anywhere;
        }

        .ps-bookspot-vehicle-type {
          display: block;
          margin-top: 6px;
          color: var(--muted, #a1a49a);
          font-size: 11px;
        }

        .ps-bookspot-radio {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 21px;
          height: 21px;
          flex-shrink: 0;
          border: 1px solid #56594c;
          border-radius: 50%;
        }

        .ps-bookspot-vehicle.selected .ps-bookspot-radio {
          border-color: var(--accent, #c7ff45);
        }

        .ps-bookspot-vehicle.selected .ps-bookspot-radio::after {
          width: 11px;
          height: 11px;
          border-radius: 50%;
          background: var(--accent, #c7ff45);
          content: "";
        }

        .ps-bookspot-error {
          margin: 0 0 18px;
          padding: 13px 15px;
          color: #ffaaaa;
          background: rgba(255, 100, 100, 0.07);
          border: 1px solid rgba(255, 100, 100, 0.2);
          border-radius: 10px;
          font-size: 12px;
          line-height: 1.7;
        }

        .ps-bookspot-empty {
          padding: 32px 18px;
          text-align: center;
          background: var(--bg, #0c0d0b);
          border: 1px dashed var(--border, #292b25);
          border-radius: 12px;
        }

        .ps-bookspot-empty-title {
          margin: 0;
          color: var(--text, #f4f5ef);
          font-size: 15px;
          font-weight: 750;
        }

        .ps-bookspot-empty-text {
          margin: 9px 0 0;
          color: var(--muted, #a1a49a);
          font-size: 12px;
          line-height: 1.8;
        }

        .ps-bookspot-secondary {
          margin-top: 17px;
          padding: 10px 14px;
          background: transparent;
          color: var(--text, #f4f5ef);
          border: 1px solid var(--border, #292b25);
          border-radius: 9px;
          font: inherit;
          font-size: 12px;
          font-weight: 650;
          cursor: pointer;
        }

        .ps-bookspot-secondary:hover {
          border-color: var(--accent, #c7ff45);
        }

        .ps-bookspot-spinner {
          width: 25px;
          height: 25px;
          margin: 0 auto 13px;
          border: 2px solid var(--border, #292b25);
          border-top-color: var(--accent, #c7ff45);
          border-radius: 50%;
          animation: ps-bookspot-spin 0.7s linear infinite;
        }

        @keyframes ps-bookspot-spin {
          to { transform: rotate(360deg); }
        }

        .ps-bookspot-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 15px;
          margin-top: 22px;
          padding-top: 19px;
          border-top: 1px solid var(--border, #292b25);
        }

        .ps-bookspot-footer-label {
          color: var(--muted, #a1a49a);
          font-size: 11px;
        }

        .ps-bookspot-submit {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          min-height: 46px;
          padding: 0 20px;
          background: var(--accent, #c7ff45);
          color: #17190f;
          border: none;
          border-radius: 11px;
          font: inherit;
          font-size: 12px;
          font-weight: 800;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(199, 255, 69, 0.1);
          transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s;
        }

        .ps-bookspot-submit:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 7px 20px rgba(199, 255, 69, 0.18);
        }

        .ps-bookspot-submit:focus-visible {
          outline: 2px solid var(--accent, #c7ff45);
          outline-offset: 4px;
        }

        .ps-bookspot-submit:disabled {
          opacity: 0.45;
          cursor: not-allowed;
          box-shadow: none;
        }

        @media (max-width: 520px) {
          .ps-bookspot {
            padding: 20px 15px 40px;
          }

          .ps-bookspot-hero {
            padding: 38px 0 26px;
          }

          .ps-bookspot-panel {
            padding: 17px;
          }

          .ps-bookspot-vehicle {
            gap: 11px;
            padding: 13px;
          }

          .ps-bookspot-vehicle-icon {
            width: 42px;
            height: 42px;
          }

          .ps-bookspot-footer {
            align-items: stretch;
            flex-direction: column;
          }

          .ps-bookspot-submit {
            width: 100%;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .ps-bookspot *,
          .ps-bookspot *::before,
          .ps-bookspot *::after {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      <div className="ps-bookspot-container">
        <header className="ps-bookspot-topbar">
          <button
            type="button"
            className="ps-bookspot-back"
            onClick={() => navigate(-1)}
          >
            ← Back
          </button>

          <div className="ps-bookspot-brand">
            Park<span>Space</span>
          </div>
        </header>

        <section className="ps-bookspot-hero">
          <p className="ps-bookspot-eyebrow">
            COMPLETE YOUR BOOKING
          </p>

          <h1 className="ps-bookspot-title">
            Choose your vehicle<span>.</span>
          </h1>

          <p className="ps-bookspot-subtitle">
            Select the vehicle you want to park. Review your selection
            before confirming your booking.
          </p>
        </section>

        <section className="ps-bookspot-panel">
          <div className="ps-bookspot-section-heading">
            <h2 className="ps-bookspot-section-title">
              Your vehicles
            </h2>

            {!loading && (
              <span className="ps-bookspot-count">
                {vehicles.length}{" "}
                {vehicles.length === 1 ? "vehicle" : "vehicles"}
              </span>
            )}
          </div>

          {error && (
            <div className="ps-bookspot-error" role="alert">
              {error}
            </div>
          )}

          {loading ? (
            <div className="ps-bookspot-empty" role="status">
              <div className="ps-bookspot-spinner" />
              <p className="ps-bookspot-empty-text">
                Loading your vehicles...
              </p>
            </div>
          ) : vehicles.length === 0 ? (
            <div className="ps-bookspot-empty">
              <h3 className="ps-bookspot-empty-title">
                No vehicles added yet
              </h3>

              <p className="ps-bookspot-empty-text">
                Add a vehicle before making a parking booking.
              </p>

              <button
                type="button"
                className="ps-bookspot-secondary"
                onClick={() => navigate("/vehicles/add")}
              >
                + Add a vehicle
              </button>
            </div>
          ) : (
            <div className="ps-bookspot-list">
              {vehicles.map((vehicle) => (
                <button
                  type="button"
                  key={vehicle.id}
                  className={`ps-bookspot-vehicle ${
                    selectedVehicle === vehicle.id ? "selected" : ""
                  }`}
                  onClick={() => setSelectedVehicle(vehicle.id)}
                  aria-pressed={selectedVehicle === vehicle.id}
                >
                  <span className="ps-bookspot-vehicle-icon">
                    {vehicle.vehicleType?.toUpperCase() === "BIKE" ||
                    vehicle.vehicleType?.toUpperCase() === "MOTORCYCLE" ? (
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <circle cx="6" cy="17" r="3" />
                        <circle cx="18" cy="17" r="3" />
                        <path d="m6 17 4-7h4l4 7M10 10l-2-2H5M10 10l3 7M14 10h3" />
                      </svg>
                    ) : (
                      <svg
                        width="25"
                        height="25"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="m5 11 2-5h10l2 5" />
                        <path d="M3 11h18v8H3z" />
                        <path d="M6 19v2M18 19v2M3 15h3M18 15h3" />
                        <circle cx="7" cy="15" r="1" />
                        <circle cx="17" cy="15" r="1" />
                      </svg>
                    )}
                  </span>

                  <span className="ps-bookspot-vehicle-info">
                    <span className="ps-bookspot-vehicle-number">
                      {vehicle.vehicleNumber}
                    </span>

                    <span className="ps-bookspot-vehicle-type">
                      {vehicle.vehicleType || "Vehicle"}
                    </span>
                  </span>

                  <span className="ps-bookspot-radio" aria-hidden="true" />
                </button>
              ))}
            </div>
          )}

          {!loading && vehicles.length > 0 && (
            <div className="ps-bookspot-footer">
              <span className="ps-bookspot-footer-label">
                {selectedVehicle
                  ? "Vehicle selected. Ready to continue."
                  : "Select a vehicle to continue."}
              </span>

              <button
                type="button"
                className="ps-bookspot-submit"
                onClick={handleBooking}
                disabled={!selectedVehicle || booking}
              >
                {booking ? "Booking..." : "Book Parking"}
                {!booking && <span aria-hidden="true">→</span>}
              </button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
 
