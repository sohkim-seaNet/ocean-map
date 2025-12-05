package com.seanet.ocean_map.service;

import com.seanet.ocean_map.domain.ShipCurrent;
import com.seanet.ocean_map.repository.ShipCurrentRepository;
import lombok.RequiredArgsConstructor;
import org.geolatte.geom.G2D;
import org.geolatte.geom.Point;
import org.geolatte.geom.crs.CoordinateReferenceSystems;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.Random;

import static org.geolatte.geom.builder.DSL.g;
import static org.geolatte.geom.builder.DSL.point;

/**
 * 선박 위치 데이터 생성 서비스
 */
@Service
@RequiredArgsConstructor
public class ShipDataGeneratorService {

    private final ShipCurrentRepository shipRepo;
    private final Random random = new Random();

    private static final org.geolatte.geom.crs.CoordinateReferenceSystem<G2D> WGS84 =
            CoordinateReferenceSystems.WGS84;

    // ========== 시뮬레이션용 초기값 ==========
    private double currentLon = 0.0;
    private double currentLat = -65.0;
    private float currentHeading = 180.0f;
    private float currentSpeed = 12.5f;

    /**
     * 선박 위치 데이터 생성 스케줄러
     */
    @Scheduled(fixedRate = 1000)
    @Transactional
    public void generateShipData() {

        // 1. 위치 계산
        double moveDistance = 0.01;
        double radians = Math.toRadians(currentHeading);

        currentLat += moveDistance * Math.cos(radians);
        currentLon += moveDistance * Math.sin(radians);
        currentHeading += random.nextFloat(-5, 5);
        currentSpeed += random.nextFloat(-1, 1);

        // 2. DB에 데이터 저장 (INSERT or UPDATE)
        ShipCurrent ship = shipRepo.findByMmsi(990000001L)
                .orElse(new ShipCurrent());

        // 선박 기본 정보 설정
        ship.setMmsi(990000001L);
        ship.setName("Araon");
        ship.setStatus("underway");
        ship.setHeading(currentHeading);
        ship.setSpeed(currentSpeed);
        ship.setLastUpdate(OffsetDateTime.now(ZoneOffset.UTC));

        // PostGIS Point geometry 생성
        Point<G2D> position = point(WGS84, g(currentLon, currentLat));
        ship.setGeom(position);

        // DB 저장
        shipRepo.save(ship);

        System.out.printf("위치 데이터 생성: (%.4f, %.4f) - heading: %.1f°%n",
                currentLon, currentLat, currentHeading);
    }
}
