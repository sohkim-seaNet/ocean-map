package com.seanet.ocean_map.repository;

import com.seanet.ocean_map.domain.ShipHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ShipHistoryRepository extends JpaRepository<ShipHistory, Long> {
}
