package com.seanet.ocean_map.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import org.geolatte.geom.G2D;
import org.geolatte.geom.Point;

import java.time.OffsetDateTime;

/**
 * 선박 위치 이력 정보를 저장하는 JPA 엔티티
 * public.ships_history 테이블과 매핑
 */
@Entity
@Table(name = "ships_history")
@Getter
@Setter
public class ShipHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long mmsi;

    @Column(name = "ts", nullable = false)
    private OffsetDateTime ts;

    private String status;
    private Double heading;
    private Double speed;

    @Column(name = "geom", columnDefinition = "geometry(Point,4326)")
    @JdbcTypeCode(SqlTypes.GEOMETRY)
    private Point<G2D> geom;
}
