import { useEffect, useRef, useState, useCallback } from 'react';
import { TerraDraw } from 'terra-draw';
import { TerraDrawMapLibreGLAdapter } from 'terra-draw-maplibre-gl-adapter';
import { TerraDrawLineStringMode, TerraDrawPolygonMode } from 'terra-draw';
import maplibregl from 'maplibre-gl';
import { DRAW_STYLES } from './measurementUtils';

/**
 * TerraDraw 도구 관리 Hook
 */
export function useMeasureTool(map) {
    const drawRef = useRef(null);
    const onDrawingCallbackRef = useRef(null);
    const [isActive, setIsActive] = useState(false);
    const [measureMode, setMeasureMode] = useState(null);

    useEffect(() => {
        if (!map) return;

        const draw = new TerraDraw({
            adapter: new TerraDrawMapLibreGLAdapter({
                map,
                lib: maplibregl
            }),
            modes: [
                new TerraDrawLineStringMode({
                    styles: DRAW_STYLES.lineString
                }),
                new TerraDrawPolygonMode({
                    styles: DRAW_STYLES.polygon
                })
            ]
        });

        drawRef.current = draw;

        try {
            draw.start();
        } catch (e) {
            console.warn('TerraDraw start failed:', e);
        }

        // 실시간 그리기 이벤트
        const handleChange = (ids) => {
            if (onDrawingCallbackRef.current && ids.length > 0) {
                try {
                    const snapshot = draw.getSnapshot();
                    const currentFeature = snapshot[snapshot.length - 1];
                    if (currentFeature) {
                        onDrawingCallbackRef.current(currentFeature);
                    }
                } catch (e) {
                    console.warn('Drawing callback error:', e);
                }
            }
        };

        draw.on('change', handleChange);

        return () => {
            if (drawRef.current) {
                try {
                    drawRef.current.stop();
                } catch (e) {
                    console.warn('TerraDraw stop failed:', e);
                }
                drawRef.current = null;
            }
        };
    }, [map]);

    // onDrawing 콜백 설정
    const setOnDrawing = useCallback((callback) => {
        onDrawingCallbackRef.current = callback;
    }, []);

    const startDistance = useCallback(() => {
        if (!drawRef.current) return;
        try {
            drawRef.current.setMode('linestring');
            setIsActive(true);
            setMeasureMode('distance');
        } catch (e) {
            console.warn('Start distance failed:', e);
        }
    }, []);

    const startArea = useCallback(() => {
        if (!drawRef.current) return;
        try {
            drawRef.current.setMode('polygon');
            setIsActive(true);
            setMeasureMode('area');
        } catch (e) {
            console.warn('Start area failed:', e);
        }
    }, []);

    const stop = useCallback(() => {
        if (!drawRef.current) return;
        try {
            drawRef.current.setMode('static');
            setIsActive(false);
            setMeasureMode(null);
        } catch (e) {
            console.warn('Stop failed:', e);
        }
    }, []);

    const clear = useCallback(() => {
        if (!drawRef.current) return;
        try {
            drawRef.current.clear();
        } catch (e) {
            console.warn('Clear failed:', e);
        }
    }, []);

    const getSnapshot = useCallback(() => {
        if (!drawRef.current) return [];
        try {
            return drawRef.current.getSnapshot();
        } catch (e) {
            console.warn('Get snapshot failed:', e);
            return [];
        }
    }, []);

    const getDraw = useCallback(() => drawRef.current, []);

    return {
        getDraw,
        isActive,
        measureMode,
        startDistance,
        startArea,
        stop,
        clear,
        getSnapshot,
        setOnDrawing
    };
}
