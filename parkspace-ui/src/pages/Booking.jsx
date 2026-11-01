 
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import API from "../api/axios";

export default function Booking() {
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState("");

  const [params] = useSearchParams();
  const navigate = useNavigate();
  const lotId = params.get("lotId");

  const fetchVehicles = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get("/vehicles");
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
    if (!selectedVehicle || !lotId || booking) {
      setError(
        !lotId
          ? "Parking location is missing. Please select a parking lot again."
          : "Please select a vehicle before continuing."
      );
      return;
    }

    try {
      setBooking(true);
      setError("");

      const response = await API.post("/bookings", {
        vehicleId: selectedVehicle,
        lotId,
      });

      console.log("Booking created:", response.data);

      window.alert("Booking successful!");
      navigate("/history");
    } catch (err) {
      console.error("Booking failed:", err);

      const message =
        typeof err.response?.data === "string"
          ? err.response.data
          : err.response?.data?.message ||
            "Booking failed. Please try again.";

      setError(message);
    } finally {
      setBooking(false);
    }
  };

  return (
    <main className="ps-booking">
      <style>{`
        .ps-booking {
          min-height: 100vh;
          padding: 28px 22px 60px;
          background: var(--bg, #0c0d0b);
          color: var(--text, #f4f5ef);
          font-family: inherit;
          box-sizing: border-box;
        }

        .ps-booking *,
        .ps-booking *::before,
        .ps-booking *::after {
          box-sizing: border-box;
        }

        .ps-booking-container {
          width: 100%;
          max-width: 760px;
          margin: 0 auto;
        }

        .ps-booking-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 14px;
          padding-bottom: 22px;
          border-bottom: 1px solid var(--border, #292b25);
        }

        .ps-booking-back {
          padding: 10px 14px;
          background: var(--surface, #151612);
          color: var(--text, #f4f5ef);
          border: 1px solid var(--border, #292b25);
          border-radius: 10px;
          font: inherit;
          font-size: 12px;
          font-weight: 650;
          cursor: pointer;
          transition: border-color 0.2s;
        }

        .ps-booking-back:hover {
          border-color: var(--accent, #c7ff45);
        }

        .ps-booking-brand {
          font-size: 20px;
          font-weight: 850;
          letter-spacing: -0.8px;
        }

        .ps-booking-brand span {
          color: var(--accent, #c7ff45);
        }

        .ps-booking-hero {
          padding: 54px 0 34px;
          text-align: center;
        }

        .ps-booking-eyebrow {
          margin: 0 0 13px;
          color: var(--accent, #c7ff45);
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 2.2px;
        }

        .ps-booking-title {
          margin: 0;
          font-size: clamp(30px, 5vw, 42px);
          font-weight: 800;
          letter-spacing: -1.8px;
          line-height: 1.15;
        }

        .ps-booking-title span {
          color: var(--accent, #c7ff45);
        }

        .ps-booking-subtitle {
          max-width: 420px;
          margin: 13px auto 0;
          color: var(--muted, #a1a49a);
          font-size: 13px;
          line-height: 1.8;
        }

        .ps-booking-panel {
          padding: 25px;
          background: var(--surface, #151612);
          border: 1px solid var(--border, #292b25);
          border-radius: 17px;
        }

        .ps-booking-panel-heading {
          margin: 0 0 7px;
          font-size: 17px;
          font-weight: 750;
          letter-spacing: -0.4px;
        }

        .ps-booking-panel-description {
          margin: 0 0 23px;
          color: var(--muted, #a1a49a);
          font-size: 12px;
          line-height: 1.7;
        }

        .ps-booking-field-label {
          display: block;
          margin-bottom: 10px;
          color: var(--text, #f4f5ef);
          font-size: 12px;
          font-weight: 650;
        }

        .ps-booking-select-wrap {
          position: relative;
        }

        .ps-booking-select {
          display: block;
          width: 100%;
          min-height: 53px;
          padding: 0 42px 0 15px;
          appearance: none;
          background: var(--bg, #0c0d0b);
          color: var(--text, #f4f5ef);
          border: 1px solid var(--border, #292b25);
          border-radius: 11px;
          outline: none;
          font: inherit;
          font-size: 13px;
          cursor: pointer;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .ps-booking-select:focus {
          border-color: var(--accent, #c7ff45);
          box-shadow: 0 0 0 3px rgba(199, 255, 69, 0.07);
        }

        .ps-booking-select:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .ps-booking-select option {
          background: var(--bg, #0c0d0b);
          color: var(--text, #f4f5ef);
        }

        .ps-booking-select-arrow {
          position: absolute;
          top: 50%;
          right: 15px;
          color: var(--muted, #a1a49a);
          pointer-events: none;
          transform: translateY(-50%);
        }

        .ps-booking-error {
          margin-top: 16px;
          padding: 13px 14px;
          background: rgba(255, 100, 100, 0.07);
          color: #ffaaaa;
          border: 1px solid rgba(255, 100, 100, 0.2);
          border-radius: 10px;
          font-size: 12px;
          line-height: 1.7;
        }

        .ps-booking-loading {
          padding: 25px 15px;
          text-align: center;
          color: var(--muted, #a1a49a);
          font-size: 12px;
        }

        .ps-booking-spinner {
          width: 24px;
          height: 24px;
          margin: 0 auto 13px;
          border: 2px solid var(--border, #292b25);
          border-top-color: var(--accent, #c7ff45);
          border-radius: 50%;
          animation: ps-booking-spin 0.7s linear infinite;
        }

        @keyframes ps-booking-spin {
          to { transform: rotate(360deg); }
        }

        .ps-booking-empty {
          padding: 25px 18px;
          background: var(--bg, #0c0d0b);
          border: 1px dashed var(--border, #292b25);
          border-radius: 12px;
          text-align: center;
        }

        .ps-booking-empty-title {
          margin: 0;
          font-size: 14px;
          font-weight: 750;
        }

        .ps-booking-empty-text {
          margin: 9px 0 0;
          color: var(--muted, #a1a49a);
          font-size: 12px;
          line-height: 1.8;
        }

        .ps-booking-add {
          margin-top: 16px;
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

        .ps-booking-add:hover {
          border-color: var(--accent, #c7ff45);
        }

        .ps-booking-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
          margin-top: 25px;
          padding-top: 22px;
          border-top: 1px solid var(--border, #292b25);
        }

        .ps-booking-footer-note {
          max-width: 240px;
          color: var(--muted, #a1a49a);
          font-size: 11px;
          line-height: 1.7;
        }

        .ps-booking-confirm {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          min-height: 47px;
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

        .ps-booking-confirm:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 7px 20px rgba(199, 255, 69, 0.18);
        }

        .ps-booking-confirm:focus-visible,
        .ps-booking-add:focus-visible,
        .ps-booking-back:focus-visible {
          outline: 2px solid var(--accent, #c7ff45);
          outline-offset: 3px;
        }

        .ps-booking-confirm:disabled {
          opacity: 0.45;
          cursor: not-allowed;
          box-shadow: none;
        }

        @media (max-width: 520px) {
          .ps-booking {
            padding: 20px 15px 40px;
          }

          .ps-booking-hero {
            padding: 38px 0 26px;
          }

          .ps-booking-panel {
            padding: 18px;
          }

          .ps-booking-footer {
            align-items: stretch;
            flex-direction: column;
          }

          .ps-booking-confirm {
            width: 100%;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .ps-booking *,
          .ps-booking *::before,
          .ps-booking *::after {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      <div className="ps-booking-container">
        <header className="ps-booking-nav">
          <button
            type="button"
            className="ps-booking-back"
            onClick={() => navigate(-1)}
          >
            ← Back
          </button>

          <div className="ps-booking-brand">
            Park<span>Space</span>
          </div>
        </header>

        <section className="ps-booking-hero">
          <p className="ps-booking-eyebrow">ONE MORE STEP</p>

          <h1 className="ps-booking-title">
            Confirm your <span>parking.</span>
          </h1>

          <p className="ps-booking-subtitle">
            Choose the vehicle you want to park and confirm your booking.
            You're almost there.
          </p>
        </section>

        <section className="ps-booking-panel">
          <h2 className="ps-booking-panel-heading">
            Select your vehicle
          </h2>

          <p className="ps-booking-panel-description">
            Choose one of your registered vehicles for this booking.
          </p>

          {loading ? (
            <div className="ps-booking-loading" role="status">
              <div className="ps-booking-spinner" />
              Loading your vehicles...
            </div>
          ) : vehicles.length === 0 ? (
            <div className="ps-booking-empty">
              <h3 className="ps-booking-empty-title">
                No vehicles found
              </h3>

              <p className="ps-booking-empty-text">
                Add a vehicle before making a parking booking.
              </p>

              <button
                type="button"
                className="ps-booking-add"
                onClick={() => navigate("/vehicles/add")}
              >
                + Add a vehicle
              </button>
            </div>
          ) : (
            <>
              <label
                className="ps-booking-field-label"
                htmlFor="booking-vehicle"
              >
                Registered vehicle
              </label>

              <div className="ps-booking-select-wrap">
                <select
                  id="booking-vehicle"
                  className="ps-booking-select"
                  value={selectedVehicle}
                  onChange={(event) =>
                    setSelectedVehicle(event.target.value)
                  }
                  disabled={booking}
                >
                  <option value="">Choose a vehicle</option>

                  {vehicles.map((vehicle) => (
                    <option key={vehicle.id} value={vehicle.id}>
                      {vehicle.vehicleNumber}
                      {vehicle.vehicleType
                        ? ` — ${vehicle.vehicleType}`
                        : ""}
                    </option>
                  ))}
                </select>

                <span
                  className="ps-booking-select-arrow"
                  aria-hidden="true"
                >
                  ▼
                </span>
              </div>
            </>
          )}

          {error && (
            <div className="ps-booking-error" role="alert">
              {error}
            </div>
          )}

          {!loading && vehicles.length > 0 && (
            <div className="ps-booking-footer">
              <span className="ps-booking-footer-note">
                Your booking will be submitted for the selected parking lot.
              </span>

              <button
                type="button"
                className="ps-booking-confirm"
                onClick={handleBooking}
                disabled={!selectedVehicle || !lotId || booking}
              >
                {booking ? "Confirming..." : "Confirm Booking"}
                {!booking && <span aria-hidden="true">→</span>}
              </button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
 
