import API from "../api/axios";

export const getParkingLots = () => {
  return API.get("/parking-lots");
};