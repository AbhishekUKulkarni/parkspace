package com.abhi.parkspace.vehicle.service.impl;

import com.abhi.parkspace.auth.entity.User;
import com.abhi.parkspace.vehicle.dto.request.VehicleRequest;
import com.abhi.parkspace.vehicle.dto.response.VehicleResponse;
import com.abhi.parkspace.vehicle.entity.Vehicle;
import com.abhi.parkspace.vehicle.exception.VehicleAlreadyExistsException;
import com.abhi.parkspace.vehicle.exception.VehicleNotFoundException;
import com.abhi.parkspace.vehicle.repository.VehicleRepository;
import com.abhi.parkspace.vehicle.service.VehicleService;
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
public class VehicleServiceImpl
        implements VehicleService {

    private final VehicleRepository
            vehicleRepository;

    @Override
    public VehicleResponse createVehicle(
            VehicleRequest request,
            User user
    ) {

        String normalizedVehicleNumber =
                normalizeVehicleNumber(
                        request.vehicleNumber()
                );

        validateVehicleDoesNotExist(
                normalizedVehicleNumber
        );

        Vehicle vehicle = Vehicle.builder()
                .vehicleNumber(
                        normalizedVehicleNumber
                )
                .vehicleType(
                        request.vehicleType()
                )
                .brand(request.brand())
                .model(request.model())
                .color(request.color())
                .owner(user)
                .active(true)
                .build();

        Vehicle savedVehicle =
                vehicleRepository.save(vehicle);

        log.info(
                "Vehicle created: {}",
                savedVehicle.getVehicleNumber()
        );

        return mapToResponse(savedVehicle);
    }

    @Override
    public List<VehicleResponse> getUserVehicles(
            User user
    ) {

        return vehicleRepository.findByOwner(user)
                .stream()
                .filter(Vehicle::getActive)
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public VehicleResponse getVehicleById(
            UUID vehicleId,
            User user
    ) {

        Vehicle vehicle =
                getVehicle(
                        vehicleId,
                        user
                );

        return mapToResponse(vehicle);
    }

    @Override
    public VehicleResponse updateVehicle(
            UUID vehicleId,
            VehicleRequest request,
            User user
    ) {

        Vehicle vehicle =
                getVehicle(
                        vehicleId,
                        user
                );

        String normalizedVehicleNumber =
                normalizeVehicleNumber(
                        request.vehicleNumber()
                );

        if (
                !vehicle.getVehicleNumber()
                        .equals(normalizedVehicleNumber)
        ) {

            validateVehicleDoesNotExist(
                    normalizedVehicleNumber
            );
        }

        vehicle.setVehicleNumber(
                normalizedVehicleNumber
        );

        vehicle.setVehicleType(
                request.vehicleType()
        );

        vehicle.setBrand(
                request.brand()
        );

        vehicle.setModel(
                request.model()
        );

        vehicle.setColor(
                request.color()
        );

        Vehicle updatedVehicle =
                vehicleRepository.save(vehicle);

        log.info(
                "Vehicle updated: {}",
                updatedVehicle.getVehicleNumber()
        );

        return mapToResponse(updatedVehicle);
    }

    @Override
    public void deleteVehicle(
            UUID vehicleId,
            User user
    ) {

        Vehicle vehicle =
                getVehicle(
                        vehicleId,
                        user
                );

        /*
         =====================================
                 SOFT DELETE
         =====================================
         */

        vehicle.setActive(false);

        vehicleRepository.save(vehicle);

        log.info(
                "Vehicle deleted: {}",
                vehicle.getVehicleNumber()
        );
    }

    /*
     =========================================
                HELPER METHODS
     =========================================
     */

    private Vehicle getVehicle(
            UUID vehicleId,
            User user
    ) {

        return vehicleRepository
                .findByIdAndOwner(
                        vehicleId,
                        user
                )
                .orElseThrow(() ->
                        new VehicleNotFoundException(
                                "Vehicle not found"
                        )
                );
    }

    private void validateVehicleDoesNotExist(
            String vehicleNumber
    ) {

        if (
                vehicleRepository
                        .existsByVehicleNumber(
                                vehicleNumber
                        )
        ) {

            throw new VehicleAlreadyExistsException(
                    "Vehicle number already exists"
            );
        }
    }

    private String normalizeVehicleNumber(
            String vehicleNumber
    ) {

        return vehicleNumber
                .replaceAll(
                        "[^a-zA-Z0-9]",
                        ""
                )
                .toUpperCase();
    }

    private VehicleResponse mapToResponse(
            Vehicle vehicle
    ) {

        return new VehicleResponse(
                vehicle.getId(),
                vehicle.getVehicleNumber(),
                vehicle.getVehicleType(),
                vehicle.getBrand(),
                vehicle.getModel(),
                vehicle.getColor(),
                vehicle.getOwner().getEmail(),
                vehicle.getCreatedAt()
        );
    }
}