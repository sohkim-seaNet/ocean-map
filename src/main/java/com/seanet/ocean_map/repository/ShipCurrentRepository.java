package com.seanet.ocean_map.repository;

import com.seanet.ocean_map.domain.ShipCurrent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ShipCurrentRepository extends JpaRepository<ShipCurrent, Long> {
    Optional<ShipCurrent> findByMmsi(Long mmsi);
}
