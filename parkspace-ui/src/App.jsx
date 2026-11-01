import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";

import Register from "./pages/Register";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Vehicles from "./pages/Vehicles";
import BookingHistory from "./pages/BookingHistory";
import ParkingLotDetails from "./pages/ParkingLotDetails";
import AddVehicle from "./pages/AddVehicle";
import Profile from "./pages/Profile";

import "./index.css";

function ProtectedLayout({ theme, onToggleTheme }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <Navbar
        theme={theme}
        onToggleTheme={onToggleTheme}
      />

      <Outlet />
    </>
  );
}

function PublicLayout() {
  const token = localStorage.getItem("token");

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

export default function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("parkspace-theme") || "dark";
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;

    localStorage.setItem("parkspace-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((currentTheme) =>
      currentTheme === "dark" ? "light" : "dark"
    );
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route
            path="/"
            element={<Navigate to="/login" replace />}
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />
        </Route>

        {/* Protected Routes */}
        <Route
          element={
            <ProtectedLayout
              theme={theme}
              onToggleTheme={toggleTheme}
            />
          }
        >
          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/vehicles"
            element={<Vehicles />}
          />

          <Route
            path="/vehicles/add"
            element={<AddVehicle />}
          />

          <Route
            path="/history"
            element={<BookingHistory />}
          />

          <Route
            path="/lots/:lotId"
            element={<ParkingLotDetails />}
          />

          <Route
            path="/profile"
            element={<Profile />}
          />
        </Route>

        {/* Unknown Routes */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}