package com.seanet.ocean_map.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import org.geolatte.geom.G2D;
import org.geolatte.geom.Point;

import java.time.OffsetDateTime;

@Entity
@Table(name="ships_current")
@Getter
@Setter
public class ShipCurrent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * 선박 고유 식별 번호
     */
    private Long mmsi;

    private String name;
    private String status;
    private Float heading;
    private Float speed;

    @Column(name = "last_update")
    private OffsetDateTime lastUpdate;

    /**
     * 선박의 지리적 위치 (경도, 위도)
     * PostGIS geometry(Point, 4326) 타입과 매핑
     */
    @Column(name = "geom", columnDefinition = "geometry(Point,4326)")
    @JdbcTypeCode(SqlTypes.GEOMETRY)
    private Point<G2D> geom;
}
