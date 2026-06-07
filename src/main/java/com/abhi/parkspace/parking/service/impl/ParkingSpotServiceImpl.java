package com.abhi.parkspace.parking.service.impl;

import com.abhi.parkspace.auth.entity.User;
import com.abhi.parkspace.parking.dto.request.ParkingSpotRequest;
import com.abhi.parkspace.parking.dto.response.ParkingSpotResponse;
import com.abhi.parkspace.parking.entity.ParkingFloor;
import com.abhi.parkspace.parking.entity.ParkingLot;
import com.abhi.parkspace.parking.entity.ParkingSpot;
import com.abhi.parkspace.parking.enums.ParkingSpotStatus;
import com.abhi.parkspace.parking.enums.ParkingSpotType;
import com.abhi.parkspace.parking.exception.ParkingAccessDeniedException;
import com.abhi.parkspace.parking.exception.ParkingFloorNotFoundException;
import com.abhi.parkspace.parking.exception.ParkingLotNotFoundException;
import com.abhi.parkspace.parking.exception.ParkingSpotAlreadyExistsException;
import com.abhi.parkspace.parking.exception.ParkingSpotNotFoundException;
import com.abhi.parkspace.parking.repository.ParkingFloorRepository;
import com.abhi.parkspace.parking.repository.ParkingLotRepository;
import com.abhi.parkspace.parking.repository.ParkingSpotRepository;
import com.abhi.parkspace.parking.service.ParkingSpotService;
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
public class ParkingSpotServiceImpl
        implements ParkingSpotService {

    private final ParkingSpotRepository
            parkingSpotRepository;

    private final ParkingFloorRepository
            parkingFloorRepository;

    private final ParkingLotRepository
            parkingLotRepository;

    @Override
    public ParkingSpotResponse createParkingSpot(
            UUID parkingLotId,
            UUID floorId,
            ParkingSpotRequest request,
            User admin
    ) {

        ParkingLot parkingLot =
                getParkingLot(parkingLotId);

        validateAdminOwnership(
                parkingLot,
                admin
        );

        ParkingFloor parkingFloor =
                getParkingFloor(
                        floorId,
                        parkingLot
                );

        validateSpotDoesNotExist(
                request.spotNumber(),
                parkingFloor
        );

        ParkingSpot parkingSpot =
                ParkingSpot.builder()
                        .spotNumber(
                                request.spotNumber()
                        )
                        .spotType(
                                request.spotType()
                        )
                        .status(
                                request.status()
                        )
                        .active(true)
                        .parkingFloor(parkingFloor)
                        .build();

        ParkingSpot savedSpot =
                parkingSpotRepository.save(
                        parkingSpot
                );

        log.info(
                "Parking spot created: {}",
                savedSpot.getSpotNumber()
        );

        return mapToResponse(savedSpot);
    }

    @Override
    public List<ParkingSpotResponse>
    getFloorParkingSpots(
            UUID parkingLotId,
            UUID floorId
    ) {

        ParkingLot parkingLot =
                getParkingLot(parkingLotId);

        ParkingFloor parkingFloor =
                getParkingFloor(
                        floorId,
                        parkingLot
                );

        return parkingSpotRepository
                .findByParkingFloor(parkingFloor)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public ParkingSpotResponse getParkingSpotById(
            UUID parkingLotId,
            UUID floorId,
            UUID spotId
    ) {

        ParkingLot parkingLot =
                getParkingLot(parkingLotId);

        ParkingFloor parkingFloor =
                getParkingFloor(
                        floorId,
                        parkingLot
                );

        ParkingSpot parkingSpot =
                getParkingSpot(
                        spotId,
                        parkingFloor
                );

        return mapToResponse(parkingSpot);
    }

    @Override
    public List<ParkingSpotResponse>
    getParkingSpotsByStatus(
            ParkingSpotStatus status
    ) {

        return parkingSpotRepository
                .findByStatus(status)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public List<ParkingSpotResponse>
    getParkingSpotsByType(
            ParkingSpotType type
    ) {

        return parkingSpotRepository
                .findBySpotType(type)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public ParkingSpotResponse updateParkingSpot(
            UUID parkingLotId,
            UUID floorId,
            UUID spotId,
            ParkingSpotRequest request,
            User admin
    ) {

        ParkingLot parkingLot =
                getParkingLot(parkingLotId);

        validateAdminOwnership(
                parkingLot,
                admin
        );

        ParkingFloor parkingFloor =
                getParkingFloor(
                        floorId,
                        parkingLot
                );

        ParkingSpot parkingSpot =
                getParkingSpot(
                        spotId,
                        parkingFloor
                );

        if (
                !parkingSpot.getSpotNumber()
                        .equals(request.spotNumber())
        ) {

            validateSpotDoesNotExist(
                    request.spotNumber(),
                    parkingFloor
            );
        }

        parkingSpot.setSpotNumber(
                request.spotNumber()
        );

        parkingSpot.setSpotType(
                request.spotType()
        );

        parkingSpot.setStatus(
                request.status()
        );

        ParkingSpot updatedSpot =
                parkingSpotRepository.save(
                        parkingSpot
                );

        log.info(
                "Parking spot updated: {}",
                updatedSpot.getSpotNumber()
        );

        return mapToResponse(updatedSpot);
    }

    @Override
    public void deleteParkingSpot(
            UUID parkingLotId,
            UUID floorId,
            UUID spotId,
            User admin
    ) {

        ParkingLot parkingLot =
                getParkingLot(parkingLotId);

        validateAdminOwnership(
                parkingLot,
                admin
        );

        ParkingFloor parkingFloor =
                getParkingFloor(
                        floorId,
                        parkingLot
                );

        ParkingSpot parkingSpot =
                getParkingSpot(
                        spotId,
                        parkingFloor
                );

        /*
         =====================================
                 SOFT DELETE
         =====================================
         */

        parkingSpot.setActive(false);

        parkingSpotRepository.save(
                parkingSpot
        );

        log.info(
                "Parking spot deleted: {}",
                parkingSpot.getSpotNumber()
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

    private ParkingFloor getParkingFloor(
            UUID floorId,
            ParkingLot parkingLot
    ) {

        return parkingFloorRepository
                .findByIdAndParkingLot(
                        floorId,
                        parkingLot
                )
                .orElseThrow(() ->
                        new ParkingFloorNotFoundException(
                                "Parking floor not found"
                        )
                );
    }

    private ParkingSpot getParkingSpot(
            UUID spotId,
            ParkingFloor parkingFloor
    ) {

        return parkingSpotRepository
                .findByIdAndParkingFloor(
                        spotId,
                        parkingFloor
                )
                .orElseThrow(() ->
                        new ParkingSpotNotFoundException(
                                "Parking spot not found"
                        )
                );
    }

    private void validateSpotDoesNotExist(
            String spotNumber,
            ParkingFloor parkingFloor
    ) {

        if (
                parkingSpotRepository
                        .existsBySpotNumberAndParkingFloor(
                                spotNumber,
                                parkingFloor
                        )
        ) {

            throw new ParkingSpotAlreadyExistsException(
                    "Parking spot already exists"
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
                    "You are not authorized"
            );
        }
    }

    private ParkingSpotResponse mapToResponse(
            ParkingSpot parkingSpot
    ) {

        return new ParkingSpotResponse(
                parkingSpot.getId(),
                parkingSpot.getSpotNumber(),
                parkingSpot.getSpotType(),
                parkingSpot.getStatus(),
                parkingSpot.getActive(),
                parkingSpot.getParkingFloor().getId(),
                parkingSpot.getCreatedAt()
        );
    }
}