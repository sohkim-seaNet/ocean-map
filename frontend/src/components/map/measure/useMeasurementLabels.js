import { useRef, useCallback } from 'react';
import maplibregl from 'maplibre-gl';
import * as turf from '@turf/turf';
import {
    convertMeasurement,
    createLabelElement,
    calculateBearing,
    createBearingLabelElement
} from './measurementUtils';

/**
 * 측정 라벨 관리 Hook (방향각 포함)
 */
export function useMeasurementLabels(map) {
    const markersRef = useRef([]);
    const bearingMarkersRef = useRef([]);
    const tempMarkerRef = useRef(null);
    const tempBearingMarkersRef = useRef([]);
    const measurementsRef = useRef(new Map());

    /**
     * 선분들의 방향각 라벨 표시 (실시간)
     */
    const updateTempBearingLabels = useCallback((feature) => {
        if (!map || feature.geometry.type !== 'LineString') return;

        tempBearingMarkersRef.current.forEach(marker => marker.remove());
        tempBearingMarkersRef.current = [];

        const coordinates = feature.geometry.coordinates;
        if (coordinates.length < 2) return;

        for (let i = 0; i < coordinates.length - 1; i++) {
            const start = coordinates[i];
            const end = coordinates[i + 1];

            const bearing = calculateBearing(start, end);
            const midpoint = turf.midpoint(
                { type: 'Point', coordinates: start },
                { type: 'Point', coordinates: end }
            );

            const el = createBearingLabelElement(bearing, true);
            const marker = new maplibregl.Marker({
                element: el,
                anchor: 'center',
                offset: [0, -25]  // 위로 25px 이동
            })
                .setLngLat(midpoint.geometry.coordinates)
                .addTo(map);

            tempBearingMarkersRef.current.push(marker);
        }
    }, [map]);

    /**
     * 완성된 선분의 방향각 라벨 추가
     */
    const addBearingLabels = useCallback((feature) => {
        if (!map || feature.geometry.type !== 'LineString') return;

        tempBearingMarkersRef.current.forEach(marker => marker.remove());
        tempBearingMarkersRef.current = [];

        const coordinates = feature.geometry.coordinates;
        if (coordinates.length < 2) return;

        for (let i = 0; i < coordinates.length - 1; i++) {
            const start = coordinates[i];
            const end = coordinates[i + 1];

            const bearing = calculateBearing(start, end);
            const midpoint = turf.midpoint(
                { type: 'Point', coordinates: start },
                { type: 'Point', coordinates: end }
            );

            const el = createBearingLabelElement(bearing, false);
            const marker = new maplibregl.Marker({
                element: el,
                anchor: 'center',
                offset: [0, -25]  // 위로 25px 이동
            })
                .setLngLat(midpoint.geometry.coordinates)
                .addTo(map);

            bearingMarkersRef.current.push(marker);
        }
    }, [map]);

    /**
     * 실시간 측정값 표시 (그리는 중)
     */
    const updateTempLabel = useCallback((feature, value, unit, type) => {
        if (!map) return;

        if (tempMarkerRef.current) {
            tempMarkerRef.current.remove();
            tempMarkerRef.current = null;
        }

        if (type === 'distance' && feature.geometry.coordinates.length < 2) return;
        if (type === 'area' && feature.geometry.coordinates[0]?.length < 3) return;

        const { convertedValue, label } = convertMeasurement(value, unit, type);
        const formattedValue = convertedValue.toFixed(2);

        // 전체 중심에 총 거리 표시
        const center = type === 'distance'
            ? turf.center(feature).geometry.coordinates
            : turf.centerOfMass(feature).geometry.coordinates;

        const el = createLabelElement(formattedValue, label, true);

        tempMarkerRef.current = new maplibregl.Marker({
            element: el,
            anchor: 'center'  // 중앙 정렬
        })
            .setLngLat(center)
            .addTo(map);

        // 거리 측정일 때만 방향각도 표시
        if (type === 'distance') {
            updateTempBearingLabels(feature);
        }
    }, [map, updateTempBearingLabels]);

    /**
     * 완료된 측정값 라벨 추가
     */
    const addLabel = useCallback((feature, value, unit, type) => {
        if (!map) return;

        if (tempMarkerRef.current) {
            tempMarkerRef.current.remove();
            tempMarkerRef.current = null;
        }

        const { convertedValue, label } = convertMeasurement(value, unit, type);
        const formattedValue = convertedValue.toFixed(2);

        // 전체 중심에 총 거리 표시
        const center = type === 'distance'
            ? turf.center(feature).geometry.coordinates
            : turf.centerOfMass(feature).geometry.coordinates;

        const el = createLabelElement(formattedValue, label, false);

        const marker = new maplibregl.Marker({
            element: el,
            anchor: 'center'  // 중앙 정렬
        })
            .setLngLat(center)
            .addTo(map);

        markersRef.current.push(marker);

        // 거리 측정일 때만 방향각도 표시
        if (type === 'distance') {
            addBearingLabels(feature);
        }

        measurementsRef.current.set(feature.id, {
            type,
            value,
            unit,
            convertedValue,
            label,
            feature
        });
    }, [map, addBearingLabels]);

    /**
     * 임시 라벨만 제거 (측정 중단 시)
     */
    const clearTempLabel = useCallback(() => {
        if (tempMarkerRef.current) {
            tempMarkerRef.current.remove();
            tempMarkerRef.current = null;
        }

        tempBearingMarkersRef.current.forEach(marker => marker.remove());
        tempBearingMarkersRef.current = [];
    }, []);

    /**
     * 모든 라벨 제거 (모두 지우기 시)
     */
    const clearLabels = useCallback(() => {
        markersRef.current.forEach(marker => marker.remove());
        markersRef.current = [];

        bearingMarkersRef.current.forEach(marker => marker.remove());
        bearingMarkersRef.current = [];

        if (tempMarkerRef.current) {
            tempMarkerRef.current.remove();
            tempMarkerRef.current = null;
        }

        tempBearingMarkersRef.current.forEach(marker => marker.remove());
        tempBearingMarkersRef.current = [];

        measurementsRef.current.clear();
    }, []);

    const getMeasurements = useCallback(() => measurementsRef.current, []);
    const hasMeasurements = useCallback(() => measurementsRef.current.size > 0, []);

    return {
        addLabel,
        updateTempLabel,
        clearTempLabel,
        clearLabels,
        getMeasurements,
        hasMeasurements
    };
}