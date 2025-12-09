package com.seanet.ocean_map.service;

import com.seanet.ocean_map.domain.ShipCurrent;
import com.seanet.ocean_map.domain.ShipHistory;
import com.seanet.ocean_map.repository.ShipCurrentRepository;
import com.seanet.ocean_map.repository.ShipHistoryRepository;
import jakarta.annotation.PostConstruct;
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
    private final ShipHistoryRepository historyRepo;
    private final Random random = new Random();

    private static final org.geolatte.geom.crs.CoordinateReferenceSystem<G2D> WGS84 =
            CoordinateReferenceSystems.WGS84;

    // ========== 시뮬레이션용 초기값 ==========
    private double currentLon = 0.0;
    private double currentLat = -65.0;
    private float currentHeading = 180.0f;
    private float currentSpeed = 12.5f;

    /**
     * 서버 시작 시 실행 - history 테이블 초기화
     */
    @PostConstruct
    @Transactional
    public void initOnStartup() {
        historyRepo.deleteAll();
        System.out.println("ships_history 테이블 초기화 완료 (테스트 모드)");
    }

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

        OffsetDateTime now = OffsetDateTime.now(ZoneOffset.UTC);
        // PostGIS Point geometry 생성
        Point<G2D> position = point(WGS84, g(currentLon, currentLat));

        // 2. DB에 데이터 저장 (INSERT or UPDATE)
        ShipCurrent ship = shipRepo.findByMmsi(990000001L)
                .orElse(new ShipCurrent());

        // 선박 기본 정보 설정
        ship.setMmsi(990000001L);
        ship.setName("Araon");
        ship.setStatus("underway");
        ship.setHeading((double) currentHeading);
        ship.setSpeed((double) currentSpeed);
        ship.setLastUpdate(now);
        ship.setGeom(position);

        // DB 저장
        shipRepo.save(ship);

        // 3. ship_history에 이력 추가 (항상 INSERT)
        ShipHistory history = new ShipHistory();
        history.setMmsi(990000001L);
        history.setTs(now);
        history.setStatus("underway");
        history.setHeading((double) currentHeading);
        history.setSpeed((double) currentSpeed);
        history.setGeom(position);

        historyRepo.save(history);

        System.out.printf("위치 데이터 생성: (%.4f, %.4f) - heading: %.1f° [이력 저장 완료]%n",
                currentLon, currentLat, currentHeading);
    }
}
