 
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

export default function Vehicles() {
  const navigate = useNavigate();

  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deletingVehicleId, setDeletingVehicleId] = useState(null);

  const [form, setForm] = useState({
    vehicleNumber: "",
    vehicleType: "CAR",
    brand: "",
    model: "",
    color: "",
  });

  const fetchVehicles = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await API.get("/vehicles");
      setVehicles(response.data);
    } catch (err) {
      console.error("Failed to fetch vehicles:", err);
      setError(
        err.response?.status === 401
          ? "Your session may have expired. Please log in again."
          : "Couldn't load your vehicles. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchVehicles();
  }, []);

  const handleEdit = (vehicle) => {
    setEditingVehicle(vehicle);
    setForm({
      vehicleNumber: vehicle.vehicleNumber || "",
      vehicleType: vehicle.vehicleType || "CAR",
      brand: vehicle.brand || "",
      model: vehicle.model || "",
      color: vehicle.color || "",
    });
    setError("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!form.vehicleNumber.trim()) {
      setError("Enter a vehicle registration number.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      await API.put(`/vehicles/${editingVehicle.id}`, {
        ...form,
        vehicleNumber: form.vehicleNumber.trim().toUpperCase(),
      });

      setEditingVehicle(null);
      await fetchVehicles();
    } catch (err) {
      console.error("Failed to update vehicle:", err);
      setError(
        err.response?.data?.message ||
          "Couldn't update the vehicle. Please check the details."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (vehicle) => {
    const confirmed = window.confirm(
      `Delete ${vehicle.vehicleNumber}? This action cannot be undone.`
    );

    if (!confirmed) return;

    setDeletingVehicleId(vehicle.id);
    setError("");

    try {
      await API.delete(`/vehicles/${vehicle.id}`);
      setVehicles((previous) =>
        previous.filter((item) => item.id !== vehicle.id)
      );
    } catch (err) {
      console.error("Failed to delete vehicle:", err);
      setError(
        err.response?.data?.message ||
          "Couldn't delete the vehicle. Please try again."
      );
    } finally {
      setDeletingVehicleId(null);
    }
  };

  const closeModal = () => {
    if (saving) return;
    setEditingVehicle(null);
    setError("");
  };

  return (
    <main className="pv-page">
      <style>{`
        .pv-page {
          --pv-bg: var(--bg, #0c0d0b);
          --pv-surface: var(--surface, #151612);
          --pv-input: var(--surface-2, #20211c);
          --pv-text: var(--text, #f4f5ef);
          --pv-muted: var(--muted, #a1a49a);
          --pv-border: var(--border, #292b25);
          --pv-accent: var(--accent, #c7ff45);

          min-height: 100vh;
          padding: 48px 24px 72px;
          box-sizing: border-box;
          background: var(--pv-bg);
          color: var(--pv-text);
          font-family: inherit;
        }

        .pv-page *,
        .pv-page *::before,
        .pv-page *::after {
          box-sizing: border-box;
        }

        .pv-container {
          width: 100%;
          max-width: 1080px;
          margin: 0 auto;
        }

        .pv-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 24px;
          margin-bottom: 42px;
        }

        .pv-eyebrow {
          margin: 0 0 12px;
          color: var(--pv-accent);
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 2px;
        }

        .pv-title {
          margin: 0 0 10px;
          font-size: clamp(30px, 4vw, 40px);
          font-weight: 800;
          letter-spacing: -1.5px;
        }

        .pv-subtitle {
          margin: 0;
          color: var(--pv-muted);
          font-size: 14px;
          line-height: 1.7;
        }

        .pv-button-primary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          min-height: 44px;
          padding: 12px 18px;
          border: 1px solid var(--pv-accent);
          border-radius: 999px;
          background: var(--pv-accent);
          color: #11120e;
          font: inherit;
          font-size: 13px;
          font-weight: 800;
          cursor: pointer;
          transition: filter 0.2s, transform 0.2s;
        }

        .pv-button-primary:hover:not(:disabled) {
          filter: brightness(1.05);
          transform: translateY(-1px);
        }

        .pv-button-primary:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }

        .pv-plus {
          font-size: 19px;
          line-height: 1;
        }

        .pv-list-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 18px;
        }

        .pv-list-label {
          color: var(--pv-muted);
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1.5px;
        }

        .pv-count {
          color: var(--pv-muted);
          font-size: 12px;
        }

        .pv-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(min(100%, 285px), 1fr));
          gap: 18px;
        }

        .pv-card {
          min-width: 0;
          padding: 24px;
          border: 1px solid var(--pv-border);
          border-radius: 18px;
          background: var(--pv-surface);
          transition: border-color 0.2s;
        }

        .pv-card:hover {
          border-color: rgba(199, 255, 69, 0.35);
        }

        .pv-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 25px;
        }

        .pv-vehicle-symbol {
          display: grid;
          width: 46px;
          height: 46px;
          place-items: center;
          border: 1px solid rgba(199, 255, 69, 0.2);
          border-radius: 13px;
          background: rgba(199, 255, 69, 0.08);
          color: var(--pv-accent);
        }

        .pv-type {
          padding: 6px 9px;
          border: 1px solid var(--pv-border);
          border-radius: 7px;
          color: var(--pv-muted);
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 1px;
        }

        .pv-registration {
          margin: 0 0 7px;
          font-size: 20px;
          font-weight: 800;
          letter-spacing: 0.3px;
          overflow-wrap: anywhere;
        }

        .pv-vehicle-name {
          min-height: 18px;
          margin: 0;
          color: var(--pv-muted);
          font-size: 13px;
        }

        .pv-color-row {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          margin-top: 22px;
          margin-bottom: 18px;
          padding-top: 15px;
          border-top: 1px solid var(--pv-border);
          font-size: 12px;
        }

        .pv-muted-label {
          color: var(--pv-muted);
        }

        .pv-color-value {
          font-weight: 650;
        }

        .pv-card-footer {
          display: flex;
          align-items: center;
          gap: 10px;
          padding-top: 16px;
          border-top: 1px solid var(--pv-border);
        }

        .pv-button-edit,
        .pv-button-delete,
        .pv-button-cancel {
          min-height: 39px;
          border-radius: 9px;
          font: inherit;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: border-color 0.2s, color 0.2s;
        }

        .pv-button-edit {
          display: inline-flex;
          flex: 1;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 10px;
          border: 1px solid var(--pv-border);
          background: transparent;
          color: var(--pv-text);
        }

        .pv-button-edit:hover {
          border-color: var(--pv-accent);
          color: var(--pv-accent);
        }

        .pv-button-delete {
          padding: 10px 14px;
          border: 1px solid rgba(255, 110, 110, 0.22);
          background: transparent;
          color: #ff9999;
        }

        .pv-button-delete:hover:not(:disabled) {
          border-color: #ff9999;
        }

        .pv-button-delete:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .pv-loading,
        .pv-empty {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          text-align: center;
        }

        .pv-loading {
          min-height: 240px;
          gap: 14px;
          color: var(--pv-muted);
          font-size: 13px;
        }

        .pv-spinner {
          width: 24px;
          height: 24px;
          border: 2px solid var(--pv-border);
          border-top-color: var(--pv-accent);
          border-radius: 50%;
          animation: pv-spin 0.8s linear infinite;
        }

        @keyframes pv-spin {
          to { transform: rotate(360deg); }
        }

        .pv-empty {
          padding: 64px 24px;
          border: 1px solid var(--pv-border);
          border-radius: 18px;
          background: var(--pv-surface);
        }

        .pv-empty-icon {
          display: grid;
          width: 58px;
          height: 58px;
          place-items: center;
          margin-bottom: 20px;
          border: 1px solid rgba(199, 255, 69, 0.2);
          border-radius: 16px;
          background: rgba(199, 255, 69, 0.08);
          color: var(--pv-accent);
        }

        .pv-empty h2 {
          margin: 0 0 10px;
          font-size: 21px;
        }

        .pv-empty p {
          margin: 0 0 24px;
          color: var(--pv-muted);
          font-size: 14px;
          line-height: 1.7;
        }

        .pv-alert {
          margin-bottom: 20px;
          padding: 13px 15px;
          border: 1px solid rgba(255, 110, 110, 0.25);
          border-radius: 10px;
          background: rgba(255, 110, 110, 0.08);
          color: #ff9999;
          font-size: 13px;
          line-height: 1.7;
          overflow-wrap: anywhere;
        }

        .pv-overlay {
          position: fixed;
          inset: 0;
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow-y: auto;
          padding: 20px;
          background: rgba(0, 0, 0, 0.72);
          backdrop-filter: blur(5px);
        }

        .pv-modal {
          width: 100%;
          max-width: 520px;
          max-height: 90vh;
          overflow-y: auto;
          padding: 28px;
          border: 1px solid var(--pv-border);
          border-radius: 18px;
          background: var(--pv-surface);
          box-shadow: 0 24px 80px rgba(0, 0, 0, 0.3);
        }

        .pv-modal-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 25px;
        }

        .pv-modal-title {
          margin: 0;
          font-size: 24px;
          font-weight: 800;
          letter-spacing: -0.8px;
        }

        .pv-close {
          display: grid;
          width: 34px;
          height: 34px;
          flex-shrink: 0;
          place-items: center;
          border: 1px solid var(--pv-border);
          border-radius: 9px;
          background: transparent;
          color: var(--pv-muted);
          font-size: 22px;
          cursor: pointer;
        }

        .pv-close:hover {
          border-color: var(--pv-accent);
          color: var(--pv-accent);
        }

        .pv-form-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 0 14px;
        }

        .pv-field {
          min-width: 0;
          margin-bottom: 18px;
        }

        .pv-field label {
          display: block;
          margin-bottom: 8px;
          color: var(--pv-text);
          font-size: 12px;
          font-weight: 700;
        }

        .pv-field input,
        .pv-field select {
          display: block;
          width: 100%;
          min-width: 0;
          min-height: 44px;
          padding: 11px;
          border: 1px solid var(--pv-border);
          border-radius: 9px;
          outline: none;
          background: var(--pv-input);
          color: var(--pv-text);
          font: inherit;
          font-size: 13px;
        }

        .pv-field input:focus,
        .pv-field select:focus {
          border-color: var(--pv-accent);
          box-shadow: 0 0 0 3px rgba(199, 255, 69, 0.08);
        }

        .pv-field select option {
          background: var(--pv-surface);
          color: var(--pv-text);
        }

        .pv-modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 8px;
          padding-top: 20px;
          border-top: 1px solid var(--pv-border);
        }

        .pv-button-cancel {
          padding: 11px 16px;
          border: 1px solid var(--pv-border);
          background: transparent;
          color: var(--pv-text);
        }

        .pv-button-cancel:hover:not(:disabled) {
          border-color: var(--pv-accent);
        }

        @media (max-width: 600px) {
          .pv-page {
            padding: 30px 16px 48px;
          }

          .pv-header {
            align-items: flex-start;
            flex-direction: column;
            margin-bottom: 32px;
          }

          .pv-button-primary {
            width: 100%;
          }

          .pv-card {
            padding: 20px;
          }

          .pv-form-grid {
            grid-template-columns: 1fr;
          }

          .pv-modal {
            padding: 22px 18px;
          }

          .pv-modal-footer {
            flex-direction: column-reverse;
          }

          .pv-modal-footer button {
            width: 100%;
          }

          .pv-empty {
            padding: 48px 20px;
          }
        }
      `}</style>

      <section className="pv-container">
        <header className="pv-header">
          <div>
            <p className="pv-eyebrow">ACCOUNT</p>
            <h1 className="pv-title">Your vehicles</h1>
            <p className="pv-subtitle">
              Everything you drive, in one place.
            </p>
          </div>

          <button
            type="button"
            className="pv-button-primary"
            onClick={() => navigate("/vehicles/add")}
          >
            <span className="pv-plus">+</span>
            Add vehicle
          </button>
        </header>

        {!loading && vehicles.length > 0 && (
          <div className="pv-list-header">
            <span className="pv-list-label">SAVED VEHICLES</span>
            <span className="pv-count">
              {vehicles.length}{" "}
              {vehicles.length === 1 ? "vehicle" : "vehicles"}
            </span>
          </div>
        )}

        {error && <div className="pv-alert" role="alert">{error}</div>}

        {loading ? (
          <div className="pv-loading">
            <div className="pv-spinner" />
            <p>Loading vehicles...</p>
          </div>
        ) : vehicles.length === 0 ? (
          <div className="pv-empty">
            <div className="pv-empty-icon">
              <svg
                width="30"
                height="30"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 17h14l1-6-2-5H6l-2 5 1 6Z" />
                <path d="M4 11h16M7 17v2m10-2v2M7 14h.01M17 14h.01" />
              </svg>
            </div>

            <h2>No vehicles yet</h2>
            <p>Add a vehicle to make your parking experience easier.</p>

            <button
              type="button"
              className="pv-button-primary"
              onClick={() => navigate("/vehicles/add")}
            >
              + Add your first vehicle
            </button>
          </div>
        ) : (
          <div className="pv-grid">
            {vehicles.map((vehicle) => (
              <article key={vehicle.id} className="pv-card">
                <div className="pv-card-top">
                  <div className="pv-vehicle-symbol">
                    {vehicle.vehicleType === "BIKE" ? (
                      <svg
                        width="26"
                        height="26"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="5.5" cy="17.5" r="3.5" />
                        <circle cx="18.5" cy="17.5" r="3.5" />
                        <path d="m12 17.5-4-8h4l4 8M9 9.5H6" />
                      </svg>
                    ) : (
                      <svg
                        width="27"
                        height="27"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 17h14l1-6-2-5H6l-2 5 1 6Z" />
                        <path d="M4 11h16M7 17v2m10-2v2" />
                        <circle cx="7" cy="14" r=".7" />
                        <circle cx="17" cy="14" r=".7" />
                      </svg>
                    )}
                  </div>

                  <span className="pv-type">
                    {vehicle.vehicleType === "BIKE" ? "BIKE" : "CAR"}
                  </span>
                </div>

                <div>
                  <h2 className="pv-registration">
                    {vehicle.vehicleNumber}
                  </h2>
                  <p className="pv-vehicle-name">
                    {[vehicle.brand, vehicle.model]
                      .filter(Boolean)
                      .join(" ") || "Personal vehicle"}
                  </p>
                </div>

                {vehicle.color && (
                  <div className="pv-color-row">
                    <span className="pv-muted-label">Color</span>
                    <span className="pv-color-value">{vehicle.color}</span>
                  </div>
                )}

                <div className="pv-card-footer">
                  <button
                    type="button"
                    className="pv-button-edit"
                    onClick={() => handleEdit(vehicle)}
                  >
                    Edit details
                  </button>

                  <button
                    type="button"
                    className="pv-button-delete"
                    disabled={deletingVehicleId === vehicle.id}
                    onClick={() => handleDelete(vehicle)}
                  >
                    {deletingVehicleId === vehicle.id
                      ? "Deleting..."
                      : "Delete"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {editingVehicle && (
        <div
          className="pv-overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <section
            className="pv-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="pv-edit-title"
          >
            <div className="pv-modal-header">
              <div>
                <p className="pv-eyebrow">VEHICLE SETTINGS</p>
                <h2 id="pv-edit-title" className="pv-modal-title">
                  Edit vehicle
                </h2>
              </div>

              <button
                type="button"
                className="pv-close"
                onClick={closeModal}
                disabled={saving}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleUpdate}>
              <div className="pv-form-grid">
                <div className="pv-field">
                  <label htmlFor="edit-vehicleNumber">
                    Registration number
                  </label>
                  <input
                    id="edit-vehicleNumber"
                    name="vehicleNumber"
                    value={form.vehicleNumber}
                    onChange={handleChange}
                    placeholder="KA01AB1234"
                    required
                  />
                </div>

                <div className="pv-field">
                  <label htmlFor="edit-vehicleType">Vehicle type</label>
                  <select
                    id="edit-vehicleType"
                    name="vehicleType"
                    value={form.vehicleType}
                    onChange={handleChange}
                    required
                  >
                    <option value="CAR">Car</option>
                    <option value="BIKE">Bike</option>
                  </select>
                </div>

                <div className="pv-field">
                  <label htmlFor="edit-brand">Brand</label>
                  <input
                    id="edit-brand"
                    name="brand"
                    value={form.brand}
                    onChange={handleChange}
                    placeholder="Hyundai"
                  />
                </div>

                <div className="pv-field">
                  <label htmlFor="edit-model">Model</label>
                  <input
                    id="edit-model"
                    name="model"
                    value={form.model}
                    onChange={handleChange}
                    placeholder="Creta"
                  />
                </div>

                <div className="pv-field">
                  <label htmlFor="edit-color">Color</label>
                  <input
                    id="edit-color"
                    name="color"
                    value={form.color}
                    onChange={handleChange}
                    placeholder="White"
                  />
                </div>
              </div>

              {error && <div className="pv-alert" role="alert">{error}</div>}

              <div className="pv-modal-footer">
                <button
                  type="button"
                  className="pv-button-cancel"
                  onClick={closeModal}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="pv-button-primary"
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save changes"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}
 
