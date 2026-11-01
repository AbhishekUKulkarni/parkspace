 
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

export default function BookingHistory() {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [endingBookingId, setEndingBookingId] = useState(null);

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get("/bookings");
      setBookings(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error(
        "Failed to fetch booking history:",
        err.response?.data || err
      );

      setError(
        err.response?.data?.message ||
          "Unable to load your bookings. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchBookings();
  }, [fetchBookings]);

  const handleEndBooking = async (bookingId) => {
    const confirmed = window.confirm(
      "Are you sure you want to end this parking booking?"
    );

    if (!confirmed) return;

    try {
      setError("");
      setEndingBookingId(bookingId);

      await API.put(`/bookings/${bookingId}/end`);

      await fetchBookings();

      window.alert("Booking ended successfully!");
    } catch (err) {
      console.error(
        "Failed to end booking:",
        err.response?.data || err
      );

      const errorMessage =
        typeof err.response?.data === "string"
          ? err.response.data
          : err.response?.data?.message ||
            "Unable to end booking. Please try again.";

      window.alert(errorMessage);
    } finally {
      setEndingBookingId(null);
    }
  };

  const formatDate = (value) => {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "—";

    return date.toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "ACTIVE":
        return "bh-status-active";
      case "COMPLETED":
        return "bh-status-completed";
      case "CANCELLED":
      case "EXPIRED":
        return "bh-status-cancelled";
      default:
        return "bh-status-default";
    }
  };

  const activeCount = bookings.filter(
    (booking) => booking.status === "ACTIVE"
  ).length;

  const completedCount = bookings.filter(
    (booking) => booking.status === "COMPLETED"
  ).length;

  return (
    <div className="bh-page">
      <style>{`
        .bh-page {
          min-height: 100vh;
          padding: 32px 24px 64px;
          background: var(--bg, #0c0d0b);
          color: var(--text, #f4f5ef);
          font-family: inherit;
          box-sizing: border-box;
        }

        .bh-page *,
        .bh-page *::before,
        .bh-page *::after {
          box-sizing: border-box;
        }

        .bh-container {
          width: 100%;
          max-width: 1080px;
          margin: 0 auto;
        }

        .bh-topbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          padding-bottom: 22px;
          border-bottom: 1px solid var(--border, #292b25);
        }

        .bh-back {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 14px;
          background: var(--surface, #151612);
          color: var(--text, #f4f5ef);
          border: 1px solid var(--border, #292b25);
          border-radius: 10px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: border-color 0.2s, background 0.2s;
        }

        .bh-back:hover {
          border-color: var(--accent, #c7ff45);
        }

        .bh-brand {
          font-size: 22px;
          font-weight: 850;
          letter-spacing: -1px;
          color: var(--text, #f4f5ef);
        }

        .bh-brand span {
          color: var(--accent, #c7ff45);
        }

        .bh-hero {
          max-width: 650px;
          margin: 0 auto;
          padding: 48px 0 34px;
          text-align: center;
        }

        .bh-eyebrow {
          margin: 0 0 12px;
          color: var(--accent, #c7ff45);
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 2.5px;
          text-transform: uppercase;
        }

        .bh-title {
          margin: 0;
          color: var(--text, #f4f5ef);
          font-size: clamp(30px, 5vw, 42px);
          font-weight: 800;
          letter-spacing: -1.8px;
          line-height: 1.15;
        }

        .bh-subtitle {
          max-width: 460px;
          margin: 15px auto 0;
          color: var(--muted, #a1a49a);
          font-size: 14px;
          line-height: 1.8;
        }

        .bh-summary {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
          margin-bottom: 40px;
        }

        .bh-summary-card {
          min-width: 0;
          padding: 23px 24px;
          background: var(--surface, #151612);
          border: 1px solid var(--border, #292b25);
          border-radius: 16px;
          transition: border-color 0.2s, transform 0.2s;
        }

        .bh-summary-card:hover {
          border-color: #484b3d;
          transform: translateY(-2px);
        }

        .bh-summary-label {
          display: block;
          margin-bottom: 14px;
          color: var(--muted, #a1a49a);
          font-size: 12px;
          font-weight: 500;
        }

        .bh-summary-number {
          display: block;
          color: var(--text, #f4f5ef);
          font-size: 32px;
          font-weight: 800;
          letter-spacing: -1px;
        }

        .bh-summary-card:first-child .bh-summary-number {
          color: var(--accent, #c7ff45);
        }

        .bh-section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 16px;
          margin-bottom: 20px;
        }

        .bh-section-title {
          margin: 0;
          color: var(--text, #f4f5ef);
          font-size: 21px;
          font-weight: 750;
          letter-spacing: -0.5px;
        }

        .bh-section-count {
          margin: 6px 0 0;
          color: var(--muted, #a1a49a);
          font-size: 12px;
        }

        .bh-refresh {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 10px 15px;
          background: var(--surface, #151612);
          color: var(--text, #f4f5ef);
          border: 1px solid var(--border, #292b25);
          border-radius: 10px;
          font-size: 12px;
          font-weight: 650;
          cursor: pointer;
          transition: border-color 0.2s;
        }

        .bh-refresh:hover:not(:disabled) {
          border-color: var(--accent, #c7ff45);
        }

        .bh-refresh:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .bh-booking-list {
          display: grid;
          gap: 16px;
        }

        .bh-card {
          min-width: 0;
          padding: 24px;
          background: var(--surface, #151612);
          border: 1px solid var(--border, #292b25);
          border-radius: 17px;
          transition: border-color 0.2s;
        }

        .bh-card:hover {
          border-color: #3b3e32;
        }

        .bh-card-header {
          display: flex;
          align-items: center;
          gap: 15px;
          min-width: 0;
        }

        .bh-parking-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          flex-shrink: 0;
          border: 1px solid rgba(199, 255, 69, 0.2);
          border-radius: 13px;
          background: rgba(199, 255, 69, 0.08);
          color: var(--accent, #c7ff45);
          font-size: 22px;
          font-weight: 800;
        }

        .bh-booking-info {
          flex: 1;
          min-width: 0;
        }

        .bh-booking-title {
          margin: 0 0 6px;
          color: var(--text, #f4f5ef);
          font-size: 16px;
          font-weight: 750;
        }

        .bh-booking-id {
          margin: 0;
          color: var(--muted, #a1a49a);
          font-size: 11px;
          overflow-wrap: anywhere;
        }

        .bh-status {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          padding: 7px 10px;
          border: 1px solid transparent;
          border-radius: 20px;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.6px;
        }

        .bh-status-active {
          color: #c7ff45;
          background: rgba(199, 255, 69, 0.09);
          border-color: rgba(199, 255, 69, 0.22);
        }

        .bh-status-completed {
          color: #8bd5ff;
          background: rgba(74, 163, 220, 0.1);
          border-color: rgba(74, 163, 220, 0.2);
        }

        .bh-status-cancelled {
          color: #ff9696;
          background: rgba(255, 100, 100, 0.08);
          border-color: rgba(255, 100, 100, 0.18);
        }

        .bh-status-default {
          color: var(--muted, #a1a49a);
          background: var(--surface-2, #20211c);
          border-color: var(--border, #292b25);
        }

        .bh-details {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 22px 28px;
          margin-top: 24px;
          padding: 22px 0;
          border-top: 1px solid var(--border, #292b25);
          border-bottom: 1px solid var(--border, #292b25);
        }

        .bh-detail {
          min-width: 0;
        }

        .bh-detail-label {
          display: block;
          margin-bottom: 8px;
          color: var(--muted, #a1a49a);
          font-size: 11px;
          font-weight: 550;
        }

        .bh-detail-value {
          display: block;
          color: var(--text, #f4f5ef);
          font-size: 12px;
          font-weight: 650;
          line-height: 1.6;
          overflow-wrap: anywhere;
        }

        .bh-card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 14px;
          margin-top: 20px;
        }

        .bh-active-message,
        .bh-completed-message,
        .bh-cancelled-message {
          color: var(--muted, #a1a49a);
          font-size: 12px;
          line-height: 1.6;
        }

        .bh-active-message {
          color: var(--accent, #c7ff45);
        }

        .bh-end-button {
          padding: 11px 16px;
          background: transparent;
          color: #ff9696;
          border: 1px solid rgba(255, 100, 100, 0.35);
          border-radius: 10px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.2s, opacity 0.2s;
        }

        .bh-end-button:hover:not(:disabled) {
          background: rgba(255, 100, 100, 0.09);
        }

        .bh-end-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .bh-completed-message {
          color: var(--accent, #c7ff45);
        }

        .bh-message-card,
        .bh-empty-card {
          padding: 48px 24px;
          background: var(--surface, #151612);
          border: 1px solid var(--border, #292b25);
          border-radius: 17px;
          text-align: center;
        }

        .bh-message-card p,
        .bh-empty-card p {
          margin: 12px 0 0;
          color: var(--muted, #a1a49a);
          font-size: 13px;
          line-height: 1.8;
        }

        .bh-empty-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 64px;
          height: 64px;
          margin: 0 auto 20px;
          background: rgba(199, 255, 69, 0.08);
          border: 1px solid rgba(199, 255, 69, 0.2);
          border-radius: 18px;
          color: var(--accent, #c7ff45);
          font-size: 29px;
        }

        .bh-empty-title {
          margin: 0;
          color: var(--text, #f4f5ef);
          font-size: 21px;
          font-weight: 750;
        }

        .bh-primary-button {
          display: inline-flex;
          justify-content: center;
          align-items: center;
          margin-top: 22px;
          padding: 12px 19px;
          background: var(--accent, #c7ff45);
          color: #11120e;
          border: none;
          border-radius: 10px;
          font-size: 12px;
          font-weight: 800;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.2s;
        }

        .bh-primary-button:hover {
          opacity: 0.9;
          transform: translateY(-1px);
        }

        .bh-error {
          color: #ff9696 !important;
        }

        .bh-spinner {
          width: 28px;
          height: 28px;
          margin: 0 auto 16px;
          border: 3px solid var(--border, #292b25);
          border-top-color: var(--accent, #c7ff45);
          border-radius: 50%;
          animation: bh-spin 0.8s linear infinite;
        }

        @keyframes bh-spin {
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 640px) {
          .bh-page {
            padding: 20px 16px 42px;
          }

          .bh-topbar {
            padding-bottom: 18px;
          }

          .bh-brand {
            font-size: 19px;
          }

          .bh-back {
            padding: 9px 11px;
            font-size: 12px;
          }

          .bh-hero {
            padding: 38px 0 27px;
          }

          .bh-summary {
            gap: 10px;
            margin-bottom: 32px;
          }

          .bh-summary-card {
            padding: 17px 12px;
            border-radius: 13px;
          }

          .bh-summary-label {
            min-height: 30px;
            margin-bottom: 10px;
            font-size: 10px;
            line-height: 1.5;
          }

          .bh-summary-number {
            font-size: 26px;
          }

          .bh-card {
            padding: 18px;
          }

          .bh-card-header {
            gap: 11px;
          }

          .bh-parking-icon {
            width: 42px;
            height: 42px;
            font-size: 19px;
          }

          .bh-booking-title {
            font-size: 14px;
          }

          .bh-status {
            padding: 6px 8px;
            font-size: 9px;
          }

          .bh-details {
            gap: 20px 14px;
            margin-top: 20px;
            padding: 19px 0;
          }

          .bh-detail-value {
            font-size: 11px;
          }

          .bh-card-footer {
            align-items: flex-start;
          }

          .bh-end-button {
            width: 100%;
          }
        }

        @media (max-width: 360px) {
          .bh-summary {
            grid-template-columns: 1fr;
          }

          .bh-summary-card {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 10px;
          }

          .bh-summary-label {
            min-height: auto;
            margin: 0;
          }

          .bh-summary-number {
            font-size: 23px;
          }

          .bh-details {
            grid-template-columns: 1fr;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .bh-page *,
          .bh-page *::before,
          .bh-page *::after {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      <div className="bh-container">
        <header className="bh-topbar">
          <button
            type="button"
            className="bh-back"
            onClick={() => navigate("/dashboard")}
          >
            ← Dashboard
          </button>

          <div className="bh-brand">
            Park<span>Space</span>
          </div>
        </header>

        <section className="bh-hero">
          <p className="bh-eyebrow">YOUR ACCOUNT</p>

          <h1 className="bh-title">Booking History</h1>

          <p className="bh-subtitle">
            Track your parking activity, view booking details,
            and manage your active bookings.
          </p>
        </section>

        {!loading && !error && (
          <section className="bh-summary" aria-label="Booking summary">
            <div className="bh-summary-card">
              <span className="bh-summary-label">Total Bookings</span>
              <strong className="bh-summary-number">
                {bookings.length}
              </strong>
            </div>

            <div className="bh-summary-card">
              <span className="bh-summary-label">Active Bookings</span>
              <strong className="bh-summary-number">
                {activeCount}
              </strong>
            </div>

            <div className="bh-summary-card">
              <span className="bh-summary-label">Completed Bookings</span>
              <strong className="bh-summary-number">
                {completedCount}
              </strong>
            </div>
          </section>
        )}

        {loading && (
          <div className="bh-message-card" role="status">
            <div className="bh-spinner" />
            <p>Loading your booking history...</p>
          </div>
        )}

        {!loading && error && (
          <div className="bh-message-card" role="alert">
            <p className="bh-error">{error}</p>

            <button
              type="button"
              className="bh-primary-button"
              onClick={fetchBookings}
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && bookings.length === 0 && (
          <div className="bh-empty-card">
            <div className="bh-empty-icon">P</div>

            <h2 className="bh-empty-title">No bookings yet</h2>

            <p>
              Your parking bookings will appear here after
              you reserve a parking spot.
            </p>

            <button
              type="button"
              className="bh-primary-button"
              onClick={() => navigate("/dashboard")}
            >
              Find Parking →
            </button>
          </div>
        )}

        {!loading && !error && bookings.length > 0 && (
          <section>
            <div className="bh-section-header">
              <div>
                <h2 className="bh-section-title">Your Bookings</h2>
                <p className="bh-section-count">
                  {bookings.length}{" "}
                  {bookings.length === 1 ? "booking" : "bookings"} found
                </p>
              </div>

              <button
                type="button"
                className="bh-refresh"
                onClick={fetchBookings}
                disabled={endingBookingId !== null}
              >
                ↻ Refresh
              </button>
            </div>

            <div className="bh-booking-list">
              {bookings.map((booking) => (
                <article
                  key={booking.bookingId}
                  className="bh-card"
                >
                  <div className="bh-card-header">
                    <div className="bh-parking-icon">P</div>

                    <div className="bh-booking-info">
                      <h3 className="bh-booking-title">
                        Parking Booking
                      </h3>

                      <p className="bh-booking-id">
                        Booking ID: {booking.bookingId}
                      </p>
                    </div>

                    <span
                      className={`bh-status ${getStatusClass(
                        booking.status
                      )}`}
                    >
                      {booking.status || "UNKNOWN"}
                    </span>
                  </div>

                  <div className="bh-details">
                    <div className="bh-detail">
                      <span className="bh-detail-label">
                        Vehicle ID
                      </span>

                      <strong className="bh-detail-value">
                        {booking.vehicleId || "—"}
                      </strong>
                    </div>

                    <div className="bh-detail">
                      <span className="bh-detail-label">
                        Parking Spot ID
                      </span>

                      <strong className="bh-detail-value">
                        {booking.parkingSpotId || "—"}
                      </strong>
                    </div>

                    <div className="bh-detail">
                      <span className="bh-detail-label">
                        Start Time
                      </span>

                      <strong className="bh-detail-value">
                        {formatDate(booking.startTime)}
                      </strong>
                    </div>

                    <div className="bh-detail">
                      <span className="bh-detail-label">
                        End Time
                      </span>

                      <strong className="bh-detail-value">
                        {formatDate(booking.endTime)}
                      </strong>
                    </div>
                  </div>

                  {booking.status === "ACTIVE" && (
                    <div className="bh-card-footer">
                      <span className="bh-active-message">
                        ● Your booking is currently active
                      </span>

                      <button
                        type="button"
                        className="bh-end-button"
                        onClick={() =>
                          handleEndBooking(booking.bookingId)
                        }
                        disabled={endingBookingId !== null}
                      >
                        {endingBookingId === booking.bookingId
                          ? "Ending Booking..."
                          : "End Booking"}
                      </button>
                    </div>
                  )}

                  {booking.status === "COMPLETED" && (
                    <div className="bh-card-footer">
                      <span className="bh-completed-message">
                        ✓ This booking has been completed.
                      </span>
                    </div>
                  )}

                  {(booking.status === "CANCELLED" ||
                    booking.status === "EXPIRED") && (
                    <div className="bh-card-footer">
                      <span className="bh-cancelled-message">
                        This booking is no longer active.
                      </span>
                    </div>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
 
