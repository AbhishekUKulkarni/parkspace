function VehicleDropdown({ vehicles, onSelect }) {
  return (
    <select onChange={(e) => onSelect(e.target.value)}>
      <option value="">Select Vehicle</option>

      {vehicles.map((v) => (
        <option key={v.id} value={v.id}>
          {v.vehicleNumber}
        </option>
      ))}
    </select>
  );
}

export default VehicleDropdown;