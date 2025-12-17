import { useRef, useCallback } from 'react';
import maplibregl from 'maplibre-gl';
import * as turf from '@turf/turf';
import { convertMeasurement, createLabelElement } from './measurementUtils';

/**
 * 측정 라벨 관리 Hook
 */
export function useMeasurementLabels(map) {
    const markersRef = useRef([]);
    const tempMarkerRef = useRef(null);
    const measurementsRef = useRef(new Map());

    /**
     * 실시간 측정값 표시 (그리는 중)
     */
    const updateTempLabel = useCallback((feature, value, unit, type) => {
        if (!map) return;

        // 기존 임시 마커 제거
        if (tempMarkerRef.current) {
            tempMarkerRef.current.remove();
            tempMarkerRef.current = null;
        }

        // 좌표가 2개 미만이면 표시 안 함
        if (type === 'distance' && feature.geometry.coordinates.length < 2) return;
        if (type === 'area' && feature.geometry.coordinates[0]?.length < 3) return;

        const { convertedValue, label } = convertMeasurement(value, unit, type);
        const formattedValue = convertedValue.toFixed(2);

        const center = type === 'distance'
            ? turf.center(feature).geometry.coordinates
            : turf.centerOfMass(feature).geometry.coordinates;

        const el = createLabelElement(formattedValue, label, true);

        tempMarkerRef.current = new maplibregl.Marker({ element: el })
            .setLngLat(center)
            .addTo(map);
    }, [map]);

    /**
     * 완료된 측정값 라벨 추가
     */
    const addLabel = useCallback((feature, value, unit, type) => {
        if (!map) return;

        // 임시 마커 제거
        if (tempMarkerRef.current) {
            tempMarkerRef.current.remove();
            tempMarkerRef.current = null;
        }

        const { convertedValue, label } = convertMeasurement(value, unit, type);
        const formattedValue = convertedValue.toFixed(2);

        const center = type === 'distance'
            ? turf.center(feature).geometry.coordinates
            : turf.centerOfMass(feature).geometry.coordinates;

        const el = createLabelElement(formattedValue, label, false);

        const marker = new maplibregl.Marker({ element: el })
            .setLngLat(center)
            .addTo(map);

        markersRef.current.push(marker);

        measurementsRef.current.set(feature.id, {
            type,
            value,
            unit,
            convertedValue,
            label,
            feature
        });
    }, [map]);

    /**
     * 임시 라벨만 제거 (측정 중단 시)
     */
    const clearTempLabel = useCallback(() => {
        if (tempMarkerRef.current) {
            tempMarkerRef.current.remove();
            tempMarkerRef.current = null;
        }
    }, []);

    /**
     * 모든 라벨 제거 (모두 지우기 시)
     */
    const clearLabels = useCallback(() => {
        markersRef.current.forEach(marker => marker.remove());
        markersRef.current = [];

        if (tempMarkerRef.current) {
            tempMarkerRef.current.remove();
            tempMarkerRef.current = null;
        }

        measurementsRef.current.clear();
    }, []);

    /**
     * measurements Map 가져오기 함수
     */
    const getMeasurements = useCallback(() => measurementsRef.current, []);

    /**
     * measurements 개수 가져오기
     */
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
