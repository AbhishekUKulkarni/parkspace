package com.abhi.parkspace.parking.service.impl;

import com.abhi.parkspace.parking.dto.ParkingSpotRequest;
import com.abhi.parkspace.parking.dto.ParkingSpotResponse;
import com.abhi.parkspace.parking.entity.ParkingLot;
import com.abhi.parkspace.parking.entity.ParkingSpot;
import com.abhi.parkspace.parking.repository.ParkingLotRepository;
import com.abhi.parkspace.parking.repository.ParkingSpotRepository;
import com.abhi.parkspace.parking.service.ParkingSpotService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ParkingSpotServiceImpl implements ParkingSpotService {

    private final ParkingSpotRepository spotRepo;
    private final ParkingLotRepository lotRepo;

    @Override
    public ParkingSpotResponse create(UUID lotId, ParkingSpotRequest request) {

        ParkingLot lot = lotRepo.findById(lotId)
                .orElseThrow(() -> new RuntimeException("Lot not found"));

        ParkingSpot spot = ParkingSpot.builder()
                .spotNumber(request.spotNumber())
                .status(request.status())
                .parkingLot(lot)
                .build();

        return map(spotRepo.save(spot));
    }

    @Override
    public List<ParkingSpotResponse> getByLot(UUID lotId) {

        return spotRepo.findByParkingLotId(lotId)
                .stream()
                .map(this::map)
                .toList();
    }

    @Override
    public ParkingSpotResponse update(UUID spotId, ParkingSpotRequest request) {

        ParkingSpot spot = spotRepo.findById(spotId)
                .orElseThrow(() -> new RuntimeException("Spot not found"));

        spot.setSpotNumber(request.spotNumber());
        spot.setStatus(request.status());

        return map(spotRepo.save(spot));
    }

    @Override
    public void delete(UUID spotId) {
        spotRepo.deleteById(spotId);
    }

    private ParkingSpotResponse map(ParkingSpot s) {
        return new ParkingSpotResponse(
                s.getId(),
                s.getSpotNumber(),
                s.getStatus(),
                s.getParkingLot().getId(),
                s.getCreatedAt()
        );
    }
}