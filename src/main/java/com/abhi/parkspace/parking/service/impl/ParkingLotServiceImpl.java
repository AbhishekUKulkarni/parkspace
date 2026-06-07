package com.abhi.parkspace.parking.service.impl;

import com.abhi.parkspace.auth.entity.User;
import com.abhi.parkspace.parking.dto.request.ParkingLotRequest;
import com.abhi.parkspace.parking.dto.response.ParkingLotResponse;
import com.abhi.parkspace.parking.entity.ParkingLot;
import com.abhi.parkspace.parking.exception.ParkingAccessDeniedException;
import com.abhi.parkspace.parking.exception.ParkingLotAlreadyExistsException;
import com.abhi.parkspace.parking.exception.ParkingLotNotFoundException;
import com.abhi.parkspace.parking.repository.ParkingLotRepository;
import com.abhi.parkspace.parking.service.ParkingLotService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class ParkingLotServiceImpl
        implements ParkingLotService {

    private final ParkingLotRepository
            parkingLotRepository;

    @Override
    public ParkingLotResponse createParkingLot(
            ParkingLotRequest request,
            User admin
    ) {

        validateParkingLotDoesNotExist(
                request.name(),
                request.address()
        );

        ParkingLot parkingLot = ParkingLot.builder()
                .name(request.name())
                .address(request.address())
                .city(request.city())
                .state(request.state())
                .pincode(request.pincode())
                .latitude(request.latitude())
                .longitude(request.longitude())
                .totalFloors(request.totalFloors())
                .status(request.status())
                .active(true)
                .admin(admin)
                .build();

        ParkingLot savedParkingLot =
                parkingLotRepository.save(
                        parkingLot
                );

        log.info(
                "Parking lot created: {}",
                savedParkingLot.getName()
        );

        return mapToResponse(savedParkingLot);
    }

    @Override
    public List<ParkingLotResponse>
    getAllParkingLots() {

        return parkingLotRepository
                .findByActiveTrue()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public ParkingLotResponse getParkingLotById(
            UUID parkingLotId
    ) {

        ParkingLot parkingLot =
                getParkingLot(parkingLotId);

        return mapToResponse(parkingLot);
    }

    @Override
    public List<ParkingLotResponse>
    getParkingLotsByCity(
            String city
    ) {

        return parkingLotRepository
                .findByCityIgnoreCase(city)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public List<ParkingLotResponse>
    getAdminParkingLots(
            User admin
    ) {

        return parkingLotRepository
                .findByAdmin(admin)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public ParkingLotResponse updateParkingLot(
            UUID parkingLotId,
            ParkingLotRequest request,
            User admin
    ) {

        ParkingLot parkingLot =
                getParkingLot(parkingLotId);

        validateAdminOwnership(
                parkingLot,
                admin
        );

        parkingLot.setName(request.name());
        parkingLot.setAddress(request.address());
        parkingLot.setCity(request.city());
        parkingLot.setState(request.state());
        parkingLot.setPincode(request.pincode());
        parkingLot.setLatitude(request.latitude());
        parkingLot.setLongitude(request.longitude());
        parkingLot.setTotalFloors(
                request.totalFloors()
        );
        parkingLot.setStatus(
                request.status()
        );

        ParkingLot updatedParkingLot =
                parkingLotRepository.save(
                        parkingLot
                );

        log.info(
                "Parking lot updated: {}",
                updatedParkingLot.getName()
        );

        return mapToResponse(updatedParkingLot);
    }

    @Override
    public void deleteParkingLot(
            UUID parkingLotId,
            User admin
    ) {

        ParkingLot parkingLot =
                getParkingLot(parkingLotId);

        validateAdminOwnership(
                parkingLot,
                admin
        );

        /*
         =====================================
                 SOFT DELETE
         =====================================
         */

        parkingLot.setActive(false);

        parkingLotRepository.save(parkingLot);

        log.info(
                "Parking lot deleted: {}",
                parkingLot.getName()
        );
    }

    /*
     =========================================
                HELPER METHODS
     =========================================
     */

    private ParkingLot getParkingLot(
            UUID parkingLotId
    ) {

        return parkingLotRepository.findById(
                parkingLotId
        ).orElseThrow(() ->
                new ParkingLotNotFoundException(
                        "Parking lot not found"
                )
        );
    }

    private void validateParkingLotDoesNotExist(
            String name,
            String address
    ) {

        if (
                parkingLotRepository
                        .existsByNameAndAddress(
                                name,
                                address
                        )
        ) {

            throw new ParkingLotAlreadyExistsException(
                    "Parking lot already exists"
            );
        }
    }

    private void validateAdminOwnership(
            ParkingLot parkingLot,
            User admin
    ) {

        if (
                !parkingLot.getAdmin()
                        .getId()
                        .equals(admin.getId())
        ) {

            throw new ParkingAccessDeniedException(
                    "You are not authorized for this parking lot"
            );
        }
    }

    private ParkingLotResponse mapToResponse(
            ParkingLot parkingLot
    ) {

        return new ParkingLotResponse(
                parkingLot.getId(),
                parkingLot.getName(),
                parkingLot.getAddress(),
                parkingLot.getCity(),
                parkingLot.getState(),
                parkingLot.getPincode(),
                parkingLot.getLatitude(),
                parkingLot.getLongitude(),
                parkingLot.getTotalFloors(),
                parkingLot.getStatus(),
                parkingLot.getActive(),
                parkingLot.getAdmin().getEmail(),
                parkingLot.getCreatedAt()
        );
    }
}