import API from "../api/axios";

export const createBooking = (data) => {
  return API.post("/bookings", data);
};

export const getActiveBooking = (vehicleId) => {
  return API.get(`/bookings/active?vehicleId=${vehicleId}`);
};

export const endBooking = (bookingId) => {
  return API.put(`/bookings/${bookingId}/end`);
};
