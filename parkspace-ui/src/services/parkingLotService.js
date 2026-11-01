import API from "../api/axios";

export const getParkingLots = () => {
  return API.get("/parking-lots");
};

export const searchParkingLots = (location) => {
  return API.get("/parking-lots/search", {
    params: { location },
  });
};