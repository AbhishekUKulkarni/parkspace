 
import API from "../api/axios";

// Register a new user
export const register = async (fullName, email, password) => {
  try {
    const response = await API.post("/auth/register", {
      fullName: fullName.trim(),
      email: email.trim(),
      password,
    });

    // Store authentication and user details if registration logs the user in
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    }

    if (response.data.fullName || fullName) {
      localStorage.setItem(
        "userName",
        response.data.fullName || fullName.trim()
      );
    }

    if (response.data.email || email) {
      localStorage.setItem(
        "email",
        response.data.email || email.trim()
      );
    }

    return response;
  } catch (error) {
    console.error("Registration failed:", error.response?.data);
    throw error;
  }
};

// Login an existing user
export const login = async (email, password) => {
  try {
    const response = await API.post("/auth/login", {
      email: email.trim(),
      password,
    });

    // Store JWT
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    } else {
      throw new Error("Login response did not contain an authentication token.");
    }

    // Store user information returned by the backend.
    // Fall back to the email entered during login when necessary.
    const userName =
      response.data.fullName ||
      response.data.name ||
      response.data.username ||
      "";

    localStorage.setItem("userName", userName || email.trim());
    localStorage.setItem("email", response.data.email || email.trim());

    return response;
  } catch (error) {
    console.error("Login failed:", error.response?.data || error.message);
    throw error;
  }
};

// Logout the current user
export const logout = async () => {
  try {
    await API.post("/auth/logout");
  } catch (error) {
    console.error("Logout API failed:", error.response?.data);
  } finally {
    // Always clear local authentication and profile information
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
  }
};
 
