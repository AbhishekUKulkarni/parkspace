 
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api/axios";

function toLocalDateTime(date) {
  const localDate = new Date(
    date.getTime() - date.getTimezoneOffset() * 60000
  );

  return localDate.toISOString().slice(0, 16);
}

export default function ParkingLotDetails() {
  const { lotId } = useParams();
  const navigate = useNavigate();

  const [spots, setSpots] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [selectedVehicleId, setSelectedVehicleId] = useState("");

  const [startTime, setStartTime] = useState(() =>
    toLocalDateTime(new Date(Date.now() + 15 * 60 * 1000))
  );

  const [endTime, setEndTime] = useState(() =>
    toLocalDateTime(new Date(Date.now() + 75 * 60 * 1000))
  );

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [bookingResult, setBookingResult] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");

      try {
        const [spotsResponse, vehiclesResponse] = await Promise.all([
          API.get(`/spots/${lotId}`),
          API.get("/vehicles"),
        ]);

        setSpots(spotsResponse.data);
        setVehicles(vehiclesResponse.data);
      } catch (err) {
        console.error("Failed to load booking data:", err);

        if (err.response?.status === 401 || err.response?.status === 403) {
          setError("Your session may have expired. Please log in again.");
        } else {
          setError("Unable to load parking spots or vehicles.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [lotId]);

  const handleSpotSelect = (spot) => {
    if (spot.status !== "AVAILABLE") return;

    setSelectedSpot(spot);
    setBookingResult(null);
    setError("");
  };

  const handleBooking = async () => {
    setError("");
    setBookingResult(null);

    if (!selectedSpot) {
      setError("Please select an available parking spot.");
      return;
    }

    if (!selectedVehicleId) {
      setError("Please select your vehicle.");
      return;
    }

    if (!startTime || !endTime) {
      setError("Please select both booking start and end times.");
      return;
    }

    if (new Date(startTime) <= new Date()) {
      setError("The booking start time must be in the future.");
      return;
    }

    if (new Date(endTime) <= new Date(startTime)) {
      setError("The end time must be later than the start time.");
      return;
    }

    setSubmitting(true);

    try {
      const request = {
        vehicleId: selectedVehicleId,
        lotId,
        parkingSpotId: selectedSpot.id,
      };

      const response = await API.post("/bookings", request);

      setBookingResult(response.data);
      setSelectedSpot(null);

      try {
        const spotsResponse = await API.get(`/spots/${lotId}`);
        setSpots(spotsResponse.data);
      } catch (refreshError) {
        console.error("Could not refresh parking spots:", refreshError);
      }
    } catch (err) {
      console.error("Booking failed:", err.response?.data || err);

      if (err.response?.status === 401 || err.response?.status === 403) {
        setError("You are not authorized to book. Please log in again.");
      } else {
        setError(
          err.response?.data?.message ||
            err.response?.data?.error ||
            "Booking failed. The spot may no longer be available."
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="ps-details-page">
        <style>{styles}</style>
        <div className="ps-details-loading">
          <span className="ps-details-spinner" />
          <p>Loading parking spots and vehicles...</p>
        </div>
      </div>
    );
  }

  if (error && spots.length === 0) {
    return (
      <div className="ps-details-page">
        <style>{styles}</style>

        <div className="ps-details-error-page">
          <div className="ps-details-error-icon">!</div>
          <h2>Unable to load parking</h2>
          <p className="ps-details-error">{error}</p>

          <button
            type="button"
            className="ps-details-secondary-button"
            onClick={() => navigate("/dashboard")}
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const availableCount = spots.filter(
    (spot) => spot.status === "AVAILABLE"
  ).length;

  return (
    <div className="ps-details-page">
      <style>{styles}</style>

      <main className="ps-details-container">
        <button
          type="button"
          className="ps-details-back"
          onClick={() => navigate("/dashboard")}
        >
          <span aria-hidden="true">←</span> Dashboard
        </button>

        <header className="ps-details-header">
          <span className="ps-details-eyebrow">PARKSPACE / RESERVATIONS</span>

          <h1>
            Find your <span>parking spot.</span>
          </h1>

          <p>
            Choose an available spot, select your vehicle, and you're ready
            to go.
          </p>
        </header>

        <section className="ps-details-overview">
          <div className="ps-details-overview-item">
            <span className="ps-details-overview-icon">▦</span>
            <div>
              <span className="ps-details-overview-label">Total spots</span>
              <strong>{spots.length}</strong>
            </div>
          </div>

          <div className="ps-details-overview-divider" />

          <div className="ps-details-overview-item">
            <span className="ps-details-overview-icon ps-details-green-icon">
              ✓
            </span>
            <div>
              <span className="ps-details-overview-label">Available</span>
              <strong>{availableCount}</strong>
            </div>
          </div>

          <div className="ps-details-overview-divider" />

          <div className="ps-details-overview-item">
            <span className="ps-details-overview-icon">🚘</span>
            <div>
              <span className="ps-details-overview-label">Your vehicles</span>
              <strong>{vehicles.length}</strong>
            </div>
          </div>
        </section>

        <section className="ps-details-section">
          <div className="ps-details-section-heading">
            <div>
              <span className="ps-details-step">STEP 01</span>
              <h2>Select a parking spot</h2>
              <p>Tap an available spot to continue.</p>
            </div>

            <div className="ps-details-legend">
              <span>
                <i className="ps-legend-dot ps-legend-available" />
                Available
              </span>
              <span>
                <i className="ps-legend-dot ps-legend-selected" />
                Selected
              </span>
              <span>
                <i className="ps-legend-dot ps-legend-unavailable" />
                Occupied
              </span>
            </div>
          </div>

          {spots.length === 0 ? (
            <div className="ps-details-empty">
              <span className="ps-details-empty-icon">▦</span>
              <h3>No parking spots found</h3>
              <p>This parking lot has no configured spots yet.</p>
            </div>
          ) : (
            <div className="ps-details-grid">
              {spots.map((spot) => {
                const isAvailable = spot.status === "AVAILABLE";
                const isSelected = selectedSpot?.id === spot.id;

                return (
                  <button
                    key={spot.id}
                    type="button"
                    className={[
                      "ps-details-spot",
                      isSelected
                        ? "ps-details-spot-selected"
                        : isAvailable
                          ? "ps-details-spot-available"
                          : "ps-details-spot-unavailable",
                    ].join(" ")}
                    disabled={
                      !isAvailable || submitting || !!bookingResult
                    }
                    onClick={() => handleSpotSelect(spot)}
                    aria-pressed={isSelected}
                    aria-label={`Spot ${spot.spotNumber}, ${
                      isSelected
                        ? "selected"
                        : isAvailable
                          ? "available"
                          : "unavailable"
                    }`}
                  >
                    <span className="ps-details-spot-icon">
                      {isSelected ? "✓" : "P"}
                    </span>

                    <strong>{spot.spotNumber}</strong>

                    <span className="ps-details-spot-status">
                      {isSelected
                        ? "Selected"
                        : isAvailable
                          ? "Available"
                          : "Unavailable"}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </section>

        {error && spots.length > 0 && !selectedSpot && !bookingResult && (
          <div className="ps-details-alert" role="alert">
            <span>!</span>
            {error}
          </div>
        )}

        {selectedSpot && !bookingResult && (
          <section className="ps-details-form">
            <div className="ps-details-form-heading">
              <div>
                <span className="ps-details-step">STEP 02</span>
                <h2>Complete your booking</h2>
                <p>Confirm your vehicle and preferred time.</p>
              </div>

              <div className="ps-details-selected-badge">
                <span>Selected spot</span>
                <strong>{selectedSpot.spotNumber}</strong>
              </div>
            </div>

            <div className="ps-details-form-content">
              <div className="ps-details-field">
                <label htmlFor="ps-vehicle">Your vehicle</label>

                <select
                  id="ps-vehicle"
                  value={selectedVehicleId}
                  onChange={(e) => setSelectedVehicleId(e.target.value)}
                  disabled={submitting}
                >
                  <option value="">Choose a vehicle</option>

                  {vehicles.map((vehicle) => (
                    <option key={vehicle.id} value={vehicle.id}>
                      {vehicle.vehicleNumber} — {vehicle.vehicleType}
                    </option>
                  ))}
                </select>

                {vehicles.length === 0 && (
                  <p className="ps-details-hint">
                    You don't have any vehicles registered yet.{" "}
                    <button
                      type="button"
                      className="ps-details-inline-link"
                      onClick={() => navigate("/vehicles/add")}
                    >
                      Add a vehicle
                    </button>
                  </p>
                )}
              </div>

              <div className="ps-details-time-grid">
                <div className="ps-details-field">
                  <label htmlFor="ps-start-time">Start time</label>
                  <input
                    id="ps-start-time"
                    type="datetime-local"
                    value={startTime}
                    // eslint-disable-next-line react-hooks/purity
                    min={toLocalDateTime(new Date(Date.now() + 60 * 1000))}
                    onChange={(e) => setStartTime(e.target.value)}
                    disabled={submitting}
                  />
                </div>

                <div className="ps-details-field">
                  <label htmlFor="ps-end-time">End time</label>
                  <input
                    id="ps-end-time"
                    type="datetime-local"
                    value={endTime}
                    min={startTime || undefined}
                    onChange={(e) => setEndTime(e.target.value)}
                    disabled={submitting}
                  />
                </div>
              </div>

              {error && (
                <div className="ps-details-alert" role="alert">
                  <span>!</span>
                  {error}
                </div>
              )}

              <button
                type="button"
                className="ps-details-confirm"
                onClick={handleBooking}
                disabled={submitting || vehicles.length === 0}
              >
                {submitting ? (
                  <>
                    <span className="ps-details-button-spinner" />
                    Creating booking...
                  </>
                ) : (
                  <>
                    Confirm booking <span aria-hidden="true">↗</span>
                  </>
                )}
              </button>

              <p className="ps-details-secure-note">
                Your booking will be submitted securely.
              </p>
            </div>
          </section>
        )}

        {bookingResult && (
          <section className="ps-details-success">
            <div className="ps-details-success-icon">✓</div>

            <span className="ps-details-eyebrow">BOOKING CONFIRMED</span>
            <h2>You're all set.</h2>

            <p>
              Your parking spot{" "}
              <strong>
                {bookingResult.parkingSpotNumber ||
                  selectedSpot?.spotNumber ||
                  "has been booked"}
              </strong>{" "}
              has been booked successfully.
            </p>

            {bookingResult.bookingNumber && (
              <div className="ps-details-result-row">
                <span>Booking number</span>
                <strong>{bookingResult.bookingNumber}</strong>
              </div>
            )}

            {bookingResult.id && (
              <div className="ps-details-result-row">
                <span>Booking ID</span>
                <strong>{bookingResult.id}</strong>
              </div>
            )}

            {bookingResult.bookingStatus && (
              <div className="ps-details-result-row">
                <span>Status</span>
                <strong className="ps-details-status-confirmed">
                  {bookingResult.bookingStatus}
                </strong>
              </div>
            )}

            <button
              type="button"
              className="ps-details-confirm"
              onClick={() => navigate("/dashboard")}
            >
              Back to Dashboard <span aria-hidden="true">↗</span>
            </button>
          </section>
        )}
      </main>
    </div>
  );
}

const styles = `
  .ps-details-page {
    min-height: 100vh;
    padding: 32px 24px 64px;
    background: var(--bg, #0c0d0b);
    color: var(--text, #f4f5ef);
    font-family: inherit;
    box-sizing: border-box;
  }

  .ps-details-page *,
  .ps-details-page *::before,
  .ps-details-page *::after {
    box-sizing: border-box;
  }

  .ps-details-container {
    width: 100%;
    max-width: 1080px;
    margin: 0 auto;
  }

  .ps-details-back {
    display: inline-flex;
    align-items: center;
    gap: 9px;
    padding: 10px 14px;
    border: 1px solid var(--border, #292b25);
    border-radius: 10px;
    background: var(--surface, #151612);
    color: var(--text, #f4f5ef);
    font: inherit;
    font-size: 13px;
    cursor: pointer;
    transition: border-color 0.2s, background 0.2s;
  }

  .ps-details-back:hover {
    border-color: var(--accent, #c7ff45);
  }

  .ps-details-header {
    margin: 54px 0 34px;
  }

  .ps-details-eyebrow,
  .ps-details-step {
    color: var(--accent, #c7ff45);
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 1.8px;
  }

  .ps-details-header h1 {
    margin: 15px 0 12px;
    font-size: clamp(32px, 5vw, 48px);
    line-height: 1.12;
    letter-spacing: -1.8px;
    font-weight: 700;
  }

  .ps-details-header h1 span {
    color: var(--accent, #c7ff45);
  }

  .ps-details-header > p,
  .ps-details-section-heading p,
  .ps-details-form-heading p {
    margin: 0;
    color: var(--muted, #a1a49a);
    font-size: 14px;
    line-height: 1.7;
  }

  .ps-details-overview {
    display: flex;
    align-items: center;
    gap: 28px;
    padding: 22px 25px;
    margin-bottom: 54px;
    background: var(--surface, #151612);
    border: 1px solid var(--border, #292b25);
    border-radius: 16px;
  }

  .ps-details-overview-item {
    display: flex;
    align-items: center;
    gap: 14px;
    flex: 1;
    min-width: 0;
  }

  .ps-details-overview-icon {
    display: grid;
    place-items: center;
    flex-shrink: 0;
    width: 42px;
    height: 42px;
    border: 1px solid var(--border, #292b25);
    border-radius: 12px;
    background: var(--surface-2, #20211c);
    font-size: 19px;
  }

  .ps-details-green-icon {
    color: var(--accent, #c7ff45);
  }

  .ps-details-overview-item > div {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .ps-details-overview-label {
    color: var(--muted, #a1a49a);
    font-size: 12px;
  }

  .ps-details-overview-item strong {
    font-size: 23px;
    line-height: 1;
  }

  .ps-details-overview-divider {
    width: 1px;
    height: 42px;
    background: var(--border, #292b25);
  }

  .ps-details-section {
    margin-bottom: 40px;
  }

  .ps-details-section-heading,
  .ps-details-form-heading {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: 20px;
    margin-bottom: 25px;
  }

  .ps-details-section-heading h2,
  .ps-details-form-heading h2 {
    margin: 9px 0 7px;
    font-size: 23px;
    letter-spacing: -0.5px;
  }

  .ps-details-legend {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 16px;
    padding-bottom: 4px;
  }

  .ps-details-legend > span {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    color: var(--muted, #a1a49a);
    font-size: 11px;
  }

  .ps-legend-dot {
    display: inline-block;
    width: 9px;
    height: 9px;
    border-radius: 3px;
  }

  .ps-legend-available {
    background: var(--accent, #c7ff45);
  }

  .ps-legend-selected {
    background: #f4f5ef;
  }

  .ps-legend-unavailable {
    background: #575950;
  }

  .ps-details-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(105px, 1fr));
    gap: 12px;
  }

  .ps-details-spot {
    min-height: 112px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 14px 8px;
    border: 1px solid var(--border, #292b25);
    border-radius: 13px;
    font: inherit;
    transition: transform 0.18s, border-color 0.18s, background 0.18s;
  }

  .ps-details-spot-available {
    background: var(--surface, #151612);
    color: var(--text, #f4f5ef);
    cursor: pointer;
  }

  .ps-details-spot-available:hover {
    transform: translateY(-2px);
    border-color: var(--accent, #c7ff45);
    background: var(--surface-2, #20211c);
  }

  .ps-details-spot-selected {
    background: var(--accent, #c7ff45);
    color: #151612;
    border-color: var(--accent, #c7ff45);
    cursor: pointer;
  }

  .ps-details-spot-unavailable {
    background: var(--surface-2, #20211c);
    color: var(--muted, #a1a49a);
    opacity: 0.6;
    cursor: not-allowed;
  }

  .ps-details-spot-icon {
    display: grid;
    place-items: center;
    width: 29px;
    height: 29px;
    border: 1px solid currentColor;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 700;
  }

  .ps-details-spot strong {
    font-size: 15px;
  }

  .ps-details-spot-status {
    font-size: 10px;
    opacity: 0.8;
  }

  .ps-details-form {
    max-width: 720px;
    margin: 45px auto 0;
    overflow: hidden;
    border: 1px solid var(--border, #292b25);
    border-radius: 18px;
    background: var(--surface, #151612);
  }

  .ps-details-form-heading {
    align-items: center;
    margin: 0;
    padding: 26px 28px;
    border-bottom: 1px solid var(--border, #292b25);
  }

  .ps-details-selected-badge {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 6px;
    flex-shrink: 0;
  }

  .ps-details-selected-badge span {
    color: var(--muted, #a1a49a);
    font-size: 11px;
  }

  .ps-details-selected-badge strong {
    padding: 7px 12px;
    border-radius: 8px;
    background: var(--accent, #c7ff45);
    color: #151612;
    font-size: 14px;
  }

  .ps-details-form-content {
    padding: 26px 28px 24px;
  }

  .ps-details-field {
    display: flex;
    flex-direction: column;
    gap: 9px;
    min-width: 0;
  }

  .ps-details-field label {
    color: var(--text, #f4f5ef);
    font-size: 13px;
    font-weight: 600;
  }

  .ps-details-field select,
  .ps-details-field input {
    display: block;
    width: 100%;
    min-width: 0;
    min-height: 46px;
    padding: 12px 13px;
    border: 1px solid var(--border, #292b25);
    border-radius: 10px;
    outline: none;
    background: var(--surface-2, #20211c);
    color: var(--text, #f4f5ef);
    font: inherit;
    font-size: 13px;
    color-scheme: dark;
    transition: border-color 0.2s;
  }

  .ps-details-field select:focus,
  .ps-details-field input:focus {
    border-color: var(--accent, #c7ff45);
  }

  .ps-details-field select:disabled,
  .ps-details-field input:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .ps-details-time-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 18px;
    margin-top: 22px;
  }

  .ps-details-hint {
    margin: 2px 0 0;
    color: var(--muted, #a1a49a);
    font-size: 12px;
    line-height: 1.7;
  }

  .ps-details-inline-link {
    padding: 0;
    border: 0;
    background: transparent;
    color: var(--accent, #c7ff45);
    font: inherit;
    font-weight: 600;
    cursor: pointer;
  }

  .ps-details-confirm {
    width: 100%;
    min-height: 48px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    margin-top: 25px;
    padding: 13px 20px;
    border: 1px solid var(--accent, #c7ff45);
    border-radius: 10px;
    background: var(--accent, #c7ff45);
    color: #151612;
    font: inherit;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    transition: transform 0.2s, opacity 0.2s;
  }

  .ps-details-confirm:hover:not(:disabled) {
    transform: translateY(-1px);
  }

  .ps-details-confirm:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }

  .ps-details-secure-note {
    margin: 13px 0 0;
    color: var(--muted, #a1a49a);
    text-align: center;
    font-size: 11px;
  }

  .ps-details-alert {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    margin-top: 18px;
    padding: 13px 15px;
    border: 1px solid rgba(255, 100, 100, 0.25);
    border-radius: 10px;
    background: rgba(255, 80, 80, 0.07);
    color: #ff9292;
    font-size: 13px;
    line-height: 1.6;
  }

  .ps-details-alert > span {
    display: grid;
    place-items: center;
    flex-shrink: 0;
    width: 19px;
    height: 19px;
    border: 1px solid currentColor;
    border-radius: 50%;
    font-size: 11px;
    font-weight: 700;
  }

  .ps-details-empty {
    padding: 45px 20px;
    border: 1px dashed var(--border, #292b25);
    border-radius: 15px;
    text-align: center;
  }

  .ps-details-empty-icon {
    display: inline-block;
    margin-bottom: 10px;
    color: var(--accent, #c7ff45);
    font-size: 30px;
  }

  .ps-details-empty h3 {
    margin: 0 0 8px;
    font-size: 17px;
  }

  .ps-details-empty p {
    margin: 0;
    color: var(--muted, #a1a49a);
    font-size: 13px;
  }

  .ps-details-success {
    max-width: 580px;
    margin: 40px auto;
    padding: 36px;
    border: 1px solid var(--border, #292b25);
    border-radius: 18px;
    background: var(--surface, #151612);
    text-align: center;
  }

  .ps-details-success-icon {
    display: grid;
    place-items: center;
    width: 58px;
    height: 58px;
    margin: 0 auto 22px;
    border-radius: 50%;
    background: var(--accent, #c7ff45);
    color: #151612;
    font-size: 29px;
    font-weight: 700;
  }

  .ps-details-success h2 {
    margin: 12px 0;
    font-size: 28px;
    letter-spacing: -0.7px;
  }

  .ps-details-success > p {
    margin: 0 0 24px;
    color: var(--muted, #a1a49a);
    font-size: 13px;
    line-height: 1.8;
  }

  .ps-details-result-row {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    padding: 14px 0;
    border-top: 1px solid var(--border, #292b25);
    text-align: left;
    font-size: 12px;
  }

  .ps-details-result-row span {
    color: var(--muted, #a1a49a);
  }

  .ps-details-result-row strong {
    overflow-wrap: anywhere;
    text-align: right;
  }

  .ps-details-status-confirmed {
    color: var(--accent, #c7ff45);
  }

  .ps-details-success .ps-details-confirm {
    margin-top: 25px;
  }

  .ps-details-loading,
  .ps-details-error-page {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 65vh;
    text-align: center;
  }

  .ps-details-loading p {
    color: var(--muted, #a1a49a);
    font-size: 13px;
  }

  .ps-details-spinner,
  .ps-details-button-spinner {
    display: inline-block;
    border: 2px solid rgba(199, 255, 69, 0.25);
    border-top-color: var(--accent, #c7ff45);
    border-radius: 50%;
    animation: ps-details-spin 0.7s linear infinite;
  }

  .ps-details-spinner {
    width: 30px;
    height: 30px;
  }

  .ps-details-button-spinner {
    width: 17px;
    height: 17px;
    border-color: rgba(21, 22, 18, 0.25);
    border-top-color: #151612;
  }

  .ps-details-error-page {
    max-width: 500px;
    margin: auto;
  }

  .ps-details-error-icon {
    display: grid;
    place-items: center;
    width: 44px;
    height: 44px;
    border: 1px solid rgba(255, 100, 100, 0.35);
    border-radius: 50%;
    color: #ff9292;
    font-size: 22px;
  }

  .ps-details-error-page h2 {
    margin: 20px 0 8px;
  }

  .ps-details-error {
    color: #ff9292;
    font-size: 13px;
    line-height: 1.6;
  }

  .ps-details-secondary-button {
    margin-top: 15px;
    padding: 11px 16px;
    border: 1px solid var(--border, #292b25);
    border-radius: 9px;
    background: var(--surface, #151612);
    color: var(--text, #f4f5ef);
    font: inherit;
    font-size: 13px;
    cursor: pointer;
  }

  @keyframes ps-details-spin {
    to {
      transform: rotate(360deg);
    }
  }

  @media (max-width: 700px) {
    .ps-details-page {
      padding: 22px 16px 45px;
    }

    .ps-details-header {
      margin: 38px 0 26px;
    }

    .ps-details-overview {
      gap: 14px;
      padding: 17px 14px;
      margin-bottom: 40px;
    }

    .ps-details-overview-item {
      gap: 8px;
    }

    .ps-details-overview-icon {
      width: 34px;
      height: 34px;
      border-radius: 9px;
      font-size: 15px;
    }

    .ps-details-overview-label {
      font-size: 10px;
    }

    .ps-details-overview-item strong {
      font-size: 20px;
    }

    .ps-details-section-heading {
      align-items: flex-start;
      flex-direction: column;
    }

    .ps-details-legend {
      gap: 13px;
    }

    .ps-details-grid {
      grid-template-columns: repeat(auto-fill, minmax(85px, 1fr));
      gap: 9px;
    }

    .ps-details-spot {
      min-height: 100px;
    }

    .ps-details-form-heading {
      align-items: flex-start;
      padding: 22px 20px;
    }

    .ps-details-form-content {
      padding: 22px 20px;
    }

    .ps-details-time-grid {
      grid-template-columns: 1fr;
      gap: 17px;
    }

    .ps-details-success {
      padding: 27px 20px;
    }
  }

  @media (max-width: 420px) {
    .ps-details-overview {
      gap: 9px;
      padding: 14px 10px;
    }

    .ps-details-overview-divider {
      height: 34px;
    }

    .ps-details-overview-icon {
      display: none;
    }

    .ps-details-overview-label {
      font-size: 9px;
    }

    .ps-details-overview-item strong {
      font-size: 19px;
    }

    .ps-details-form-heading h2,
    .ps-details-section-heading h2 {
      font-size: 20px;
    }

    .ps-details-selected-badge span {
      font-size: 10px;
    }

    .ps-details-selected-badge strong {
      font-size: 12px;
    }
  }
`;
 
