package com.abhi.parkspace.parking.service.impl;

import com.abhi.parkspace.auth.entity.User;
import com.abhi.parkspace.common.exception.UnauthorizedException;
import com.abhi.parkspace.parking.dto.ParkingLotRequest;
import com.abhi.parkspace.parking.dto.ParkingLotResponse;
import com.abhi.parkspace.parking.entity.ParkingLot;
import com.abhi.parkspace.parking.exception.ParkingLotNotFoundException;
import com.abhi.parkspace.parking.repository.ParkingLotRepository;
import com.abhi.parkspace.parking.service.ParkingLotService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ParkingLotServiceImpl implements ParkingLotService {

    private final ParkingLotRepository repo;

    @Override
    public ParkingLotResponse create(ParkingLotRequest request, User admin) {

        ParkingLot lot = ParkingLot.builder()
                .name(request.name())
                .address(request.address())
                .admin(admin)
                .active(true)
                .build();

        return map(repo.save(lot));
    }

    @Override
    public List<ParkingLotResponse> getAll() {
        return repo.findByActiveTrue()
                .stream()
                .map(this::map)
                .toList();
    }

    @Override
    public ParkingLotResponse getById(UUID lotId) {

        ParkingLot lot = repo.findById(lotId)
                .orElseThrow(() -> new ParkingLotNotFoundException("Lot not found"));

        return map(lot);
    }

    @Override
    public List<ParkingLotResponse> getMyLots(User admin) {

        return repo.findByAdmin(admin)
                .stream()
                .map(this::map)
                .toList();
    }

    @Override
    public ParkingLotResponse update(UUID lotId, ParkingLotRequest request, User admin) {

        ParkingLot lot = repo.findById(lotId)
                .orElseThrow(() -> new ParkingLotNotFoundException("Lot not found"));

        if (!lot.getAdmin().getId().equals(admin.getId())) {
            throw new UnauthorizedException("Unauthorized");
        }

        lot.setName(request.name());
        lot.setAddress(request.address());

        return map(repo.save(lot));
    }

    @Override
    public void delete(UUID lotId, User admin) {

        ParkingLot lot = repo.findById(lotId)
                .orElseThrow(() -> new ParkingLotNotFoundException("Lot not found"));

        if (!lot.getAdmin().getId().equals(admin.getId())) {
            throw new UnauthorizedException("Unauthorized");
        }

        lot.setActive(false);
        repo.save(lot);
    }
    @Override
    public List<ParkingLotResponse> searchLots(String location) {

        if (location == null || location.isBlank()) {
            return getAll();
        }

        return repo.searchActiveLots(location.trim())
                .stream()
                .map(this::map)
                .toList();
    }


    private ParkingLotResponse map(ParkingLot lot) {
        return new ParkingLotResponse(
                lot.getId(),
                lot.getName(),
                lot.getAddress(),
                lot.getAdmin().getEmail(),
                lot.getActive(),
                lot.getCreatedAt()
        );
    }
}