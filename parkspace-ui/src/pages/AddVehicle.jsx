 
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

export default function AddVehicle() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    vehicleNumber: "",
    vehicleType: "CAR",
    brand: "",
    model: "",
    color: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: name === "vehicleNumber" ? value.toUpperCase() : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const vehicleNumber = form.vehicleNumber
      .replace(/[\s-]/g, "")
      .toUpperCase();

    const registrationPattern = /^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$/;

    if (!registrationPattern.test(vehicleNumber)) {
      setError("Enter a valid registration number, for example KA01AB1234.");
      return;
    }

    if (!form.brand.trim() || !form.model.trim() || !form.color.trim()) {
      setError("Please fill in all the vehicle details.");
      return;
    }

    setLoading(true);

    try {
      const response = await API.post("/vehicles", {
        ...form,
        vehicleNumber,
        brand: form.brand.trim(),
        model: form.model.trim(),
        color: form.color.trim(),
      });

      setSuccess(
        `${response.data.vehicleNumber || vehicleNumber} has been added successfully!`
      );

      setForm({
        vehicleNumber: "",
        vehicleType: "CAR",
        brand: "",
        model: "",
        color: "",
      });
    } catch (err) {
      console.error("Failed to add vehicle:", err.response?.data || err);

      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Unable to add vehicle. Please check the details and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="av-page">
      <style>{`
        .av-page {
          --av-bg: var(--bg, #0c0d0b);
          --av-surface: var(--surface, #151612);
          --av-input: var(--surface-2, #20211c);
          --av-text: var(--text, #f4f5ef);
          --av-muted: var(--muted, #a1a49a);
          --av-border: var(--border, #292b25);
          --av-accent: var(--accent, #c7ff45);

          min-height: 100vh;
          box-sizing: border-box;
          padding: 32px 24px 64px;
          background: var(--av-bg);
          color: var(--av-text);
          font-family: inherit;
        }

        .av-page *,
        .av-page *::before,
        .av-page *::after {
          box-sizing: border-box;
        }

        .av-container {
          width: 100%;
          max-width: 680px;
          margin: 0 auto;
        }

        .av-back {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 24px;
          padding: 10px 0;
          border: none;
          background: transparent;
          color: var(--av-muted);
          font: inherit;
          font-size: 14px;
          cursor: pointer;
          transition: color 0.2s ease;
        }

        .av-back:hover {
          color: var(--av-accent);
        }

        .av-back span {
          font-size: 19px;
        }

        .av-card {
          padding: 36px;
          border: 1px solid var(--av-border);
          border-radius: 22px;
          background: var(--av-surface);
        }

        .av-icon {
          display: flex;
          width: 52px;
          height: 52px;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
          border: 1px solid rgba(199, 255, 69, 0.25);
          border-radius: 15px;
          background: rgba(199, 255, 69, 0.09);
          color: var(--av-accent);
          font-size: 32px;
          font-weight: 400;
        }

        .av-eyebrow {
          display: block;
          margin-bottom: 12px;
          color: var(--av-accent);
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 2px;
        }

        .av-heading h1 {
          margin: 0;
          color: var(--av-text);
          font-size: clamp(28px, 4vw, 36px);
          font-weight: 800;
          letter-spacing: -1px;
        }

        .av-heading p {
          max-width: 460px;
          margin: 12px 0 30px;
          color: var(--av-muted);
          font-size: 14px;
          line-height: 1.8;
        }

        .av-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .av-field {
          display: flex;
          min-width: 0;
          flex-direction: column;
          gap: 9px;
        }

        .av-field label {
          color: var(--av-text);
          font-size: 13px;
          font-weight: 650;
        }

        .av-field input,
        .av-field select {
          width: 100%;
          min-height: 48px;
          padding: 12px 14px;
          border: 1px solid var(--av-border);
          border-radius: 10px;
          outline: none;
          background: var(--av-input);
          color: var(--av-text);
          font-family: inherit;
          font-size: 14px;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .av-field input::placeholder {
          color: var(--av-muted);
          opacity: 0.8;
        }

        .av-field input:focus,
        .av-field select:focus {
          border-color: var(--av-accent);
          box-shadow: 0 0 0 3px rgba(199, 255, 69, 0.09);
        }

        .av-field select {
          cursor: pointer;
        }

        .av-field select option {
          background: var(--av-surface);
          color: var(--av-text);
        }

        .av-field small {
          color: var(--av-muted);
          font-size: 12px;
          line-height: 1.5;
        }

        .av-submit {
          display: flex;
          min-height: 50px;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-top: 4px;
          padding: 14px 20px;
          border: none;
          border-radius: 999px;
          background: var(--av-accent);
          color: #11120e;
          font-family: inherit;
          font-size: 14px;
          font-weight: 800;
          cursor: pointer;
          transition: filter 0.2s, transform 0.2s;
        }

        .av-submit:hover:not(:disabled) {
          filter: brightness(1.06);
          transform: translateY(-1px);
        }

        .av-submit:disabled {
          cursor: not-allowed;
          opacity: 0.6;
        }

        .av-submit span {
          font-size: 19px;
        }

        .av-secondary {
          min-height: 46px;
          padding: 12px 18px;
          border: 1px solid var(--av-border);
          border-radius: 999px;
          background: transparent;
          color: var(--av-text);
          font-family: inherit;
          font-size: 14px;
          font-weight: 650;
          cursor: pointer;
        }

        .av-secondary:hover {
          border-color: var(--av-accent);
          color: var(--av-accent);
        }

        .av-alert {
          padding: 13px 15px;
          border: 1px solid transparent;
          border-radius: 10px;
          font-size: 13px;
          line-height: 1.7;
          overflow-wrap: anywhere;
        }

        .av-error {
          border-color: rgba(255, 110, 110, 0.25);
          background: rgba(255, 110, 110, 0.08);
          color: #ff9999;
        }

        .av-success {
          border-color: rgba(199, 255, 69, 0.25);
          background: rgba(199, 255, 69, 0.08);
          color: var(--av-accent);
        }

        .av-footer {
          margin-top: 28px;
          padding-top: 20px;
          border-top: 1px solid var(--av-border);
          color: var(--av-muted);
          font-size: 12px;
          line-height: 1.7;
          text-align: center;
        }

        @media (max-width: 600px) {
          .av-page {
            padding: 20px 16px 40px;
          }

          .av-back {
            margin-bottom: 16px;
          }

          .av-card {
            padding: 24px 20px;
            border-radius: 18px;
          }

          .av-heading h1 {
            font-size: 29px;
          }

          .av-form {
            gap: 18px;
          }
        }
      `}</style>

      <div className="av-container">
        <button
          type="button"
          className="av-back"
          onClick={() => navigate("/vehicles")}
        >
          <span aria-hidden="true">←</span>
          My Vehicles
        </button>

        <section className="av-card">
          <div className="av-icon" aria-hidden="true">
            +
          </div>

          <header className="av-heading">
            <span className="av-eyebrow">YOUR GARAGE</span>
            <h1>Add a vehicle</h1>
            <p>
              Register your vehicle once to make your future parking bookings
              easier.
            </p>
          </header>

          <form onSubmit={handleSubmit} className="av-form">
            <div className="av-field">
              <label htmlFor="vehicleNumber">Registration number</label>
              <input
                id="vehicleNumber"
                name="vehicleNumber"
                type="text"
                placeholder="e.g. KA01AB1234"
                value={form.vehicleNumber}
                onChange={handleChange}
                maxLength={12}
                autoComplete="off"
                required
              />
              <small>Enter your vehicle's registration number.</small>
            </div>

            <div className="av-field">
              <label htmlFor="vehicleType">Vehicle type</label>
              <select
                id="vehicleType"
                name="vehicleType"
                value={form.vehicleType}
                onChange={handleChange}
                required
              >
                <option value="CAR">Car</option>
                <option value="BIKE">Bike</option>
              </select>
            </div>

            <div className="av-field">
              <label htmlFor="brand">Brand</label>
              <input
                id="brand"
                name="brand"
                type="text"
                placeholder="e.g. Hyundai"
                value={form.brand}
                onChange={handleChange}
                maxLength={60}
                required
              />
            </div>

            <div className="av-field">
              <label htmlFor="model">Model</label>
              <input
                id="model"
                name="model"
                type="text"
                placeholder="e.g. Creta"
                value={form.model}
                onChange={handleChange}
                maxLength={60}
                required
              />
            </div>

            <div className="av-field">
              <label htmlFor="color">Color</label>
              <input
                id="color"
                name="color"
                type="text"
                placeholder="e.g. White"
                value={form.color}
                onChange={handleChange}
                maxLength={40}
                required
              />
            </div>

            {error && (
              <div className="av-alert av-error" role="alert">
                {error}
              </div>
            )}

            {success && (
              <div className="av-alert av-success" role="status">
                {success}
              </div>
            )}

            <button
              type="submit"
              className="av-submit"
              disabled={loading}
            >
              {loading ? "Adding vehicle..." : "Add vehicle"}
              {!loading && <span aria-hidden="true">→</span>}
            </button>

            {success && (
              <button
                type="button"
                className="av-secondary"
                onClick={() => navigate("/vehicles")}
              >
                View my vehicles
              </button>
            )}
          </form>

          <footer className="av-footer">
            Your vehicle details are used to manage your parking bookings.
          </footer>
        </section>
      </div>
    </main>
  );
}
 
