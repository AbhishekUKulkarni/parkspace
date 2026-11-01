import API from "../api/axios";

export const getVehicles = () => API.get("/vehicles");
export const addVehicle = (data) => API.post("/vehicles", data);