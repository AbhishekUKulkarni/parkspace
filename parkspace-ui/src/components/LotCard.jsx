function LotCard({ lot, onBook }) {
  return (
    <div style={{ border: "1px solid black", margin: "10px", padding: "10px" }}>
      <h4>{lot.name}</h4>
      <p>{lot.address}</p>

      <button onClick={() => onBook(lot.id)}>
        Book Now
      </button>
    </div>
  );
}


export default LotCard;
