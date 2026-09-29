package com.abhi.parkspace.booking.entity;

import com.abhi.parkspace.booking.enums.BookingStatus;
import com.abhi.parkspace.parking.entity.ParkingSpot;
import com.abhi.parkspace.vehicle.entity.Vehicle;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "bookings")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vehicle_id", nullable = false)
    private Vehicle vehicle;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parking_spot_id", nullable = false)
    private ParkingSpot parkingSpot;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BookingStatus status;

    @Column(nullable = false)
    private Instant startTime;

    private Instant endTime;

    @Version
    private Long version;

    @PrePersist
    public void prePersist() {
        if (status == null) {
            status = BookingStatus.ACTIVE;
        }
        if (startTime == null) {
            startTime = Instant.now();
        }
    }
}