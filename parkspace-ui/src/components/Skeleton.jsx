export function Skeleton({ className = "", style = {} }) {
  return (
    <div
      className={`skeleton ${className}`}
      style={style}
      aria-hidden="true"
    />
  );
}

export function ParkingLotSkeleton() {
  return (
    <div className="skeleton-lot-card">
      <Skeleton className="skeleton-lot-image" />

      <div className="skeleton-lot-content">
        <Skeleton style={{ width: "65%", height: "22px" }} />
        <Skeleton style={{ width: "85%", height: "14px" }} />
        <Skeleton style={{ width: "45%", height: "14px" }} />

        <div className="skeleton-lot-footer">
          <Skeleton style={{ width: "75px", height: "28px" }} />
          <Skeleton style={{ width: "100px", height: "36px" }} />
        </div>
      </div>
    </div>
  );
}

export function ParkingLotsSkeleton({ count = 3 }) {
  return (
    <div className="skeleton-lots-grid">
      {Array.from({ length: count }, (_, index) => (
        <ParkingLotSkeleton key={index} />
      ))}
    </div>
  );
}