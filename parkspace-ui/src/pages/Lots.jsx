import { useEffect, useState } from "react";
import { getParkingLots } from "../services/parkingLotService";

export default function Lots() {
  const [lots, setLots] = useState([]);

  useEffect(() => {
    getParkingLots()
      .then((res) => setLots(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h2>Parking Lots</h2>
      {lots.map((lot) => (
        <div key={lot.id}>
          <h3>{lot.name}</h3>
          <p>{lot.address}</p>
        </div>
      ))}
    </div>
  );
}