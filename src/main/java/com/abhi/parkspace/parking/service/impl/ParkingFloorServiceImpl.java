package com.abhi.parkspace.parking.service.impl;

import com.abhi.parkspace.auth.entity.User;
import com.abhi.parkspace.parking.dto.request.ParkingFloorRequest;
import com.abhi.parkspace.parking.dto.response.ParkingFloorResponse;
import com.abhi.parkspace.parking.entity.ParkingFloor;
import com.abhi.parkspace.parking.entity.ParkingLot;
import com.abhi.parkspace.parking.exception.ParkingAccessDeniedException;
import com.abhi.parkspace.parking.exception.ParkingFloorAlreadyExistsException;
import com.abhi.parkspace.parking.exception.ParkingFloorNotFoundException;
import com.abhi.parkspace.parking.exception.ParkingLotNotFoundException;
import com.abhi.parkspace.parking.repository.ParkingFloorRepository;
import com.abhi.parkspace.parking.repository.ParkingLotRepository;
import com.abhi.parkspace.parking.service.ParkingFloorService;
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
public class ParkingFloorServiceImpl
        implements ParkingFloorService {

    private final ParkingFloorRepository
            parkingFloorRepository;

    private final ParkingLotRepository
            parkingLotRepository;

    @Override
    public ParkingFloorResponse createParkingFloor(
            UUID parkingLotId,
            ParkingFloorRequest request,
            User admin
    ) {

        ParkingLot parkingLot =
                getParkingLot(parkingLotId);

        validateAdminOwnership(
                parkingLot,
                admin
        );

        validateFloorDoesNotExist(
                request.floorNumber(),
                parkingLot
        );

        ParkingFloor parkingFloor =
                ParkingFloor.builder()
                        .floorNumber(
                                request.floorNumber()
                        )
                        .floorName(
                                request.floorName()
                        )
                        .parkingLot(parkingLot)
                        .build();

        ParkingFloor savedFloor =
                parkingFloorRepository.save(
                        parkingFloor
                );

        log.info(
                "Parking floor created: {}",
                savedFloor.getFloorName()
        );

        return mapToResponse(savedFloor);
    }

    @Override
    public List<ParkingFloorResponse>
    getParkingLotFloors(
            UUID parkingLotId
    ) {

        ParkingLot parkingLot =
                getParkingLot(parkingLotId);

        return parkingFloorRepository
                .findByParkingLot(parkingLot)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public ParkingFloorResponse
    getParkingFloorById(
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

        return mapToResponse(parkingFloor);
    }

    @Override
    public ParkingFloorResponse
    updateParkingFloor(
            UUID parkingLotId,
            UUID floorId,
            ParkingFloorRequest request,
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

        if (
                !parkingFloor.getFloorNumber()
                        .equals(request.floorNumber())
        ) {

            validateFloorDoesNotExist(
                    request.floorNumber(),
                    parkingLot
            );
        }

        parkingFloor.setFloorNumber(
                request.floorNumber()
        );

        parkingFloor.setFloorName(
                request.floorName()
        );

        ParkingFloor updatedFloor =
                parkingFloorRepository.save(
                        parkingFloor
                );

        log.info(
                "Parking floor updated: {}",
                updatedFloor.getFloorName()
        );

        return mapToResponse(updatedFloor);
    }

    @Override
    public void deleteParkingFloor(
            UUID parkingLotId,
            UUID floorId,
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

        parkingFloorRepository.delete(
                parkingFloor
        );

        log.info(
                "Parking floor deleted: {}",
                parkingFloor.getFloorName()
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

        return parkingLotRepository
                .findById(parkingLotId)
                .orElseThrow(() ->
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

    private void validateFloorDoesNotExist(
            Integer floorNumber,
            ParkingLot parkingLot
    ) {

        if (
                parkingFloorRepository
                        .existsByFloorNumberAndParkingLot(
                                floorNumber,
                                parkingLot
                        )
        ) {

            throw new ParkingFloorAlreadyExistsException(
                    "Floor already exists"
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

    private ParkingFloorResponse mapToResponse(
            ParkingFloor parkingFloor
    ) {

        return new ParkingFloorResponse(
                parkingFloor.getId(),
                parkingFloor.getFloorNumber(),
                parkingFloor.getFloorName(),
                parkingFloor.getParkingLot().getId(),
                parkingFloor.getCreatedAt()
        );
    }
}