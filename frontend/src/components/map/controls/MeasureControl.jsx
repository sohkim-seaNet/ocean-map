import { useEffect, useState } from 'react';
import { useMap } from '../../../contexts/MapContext.js';
import * as turf from '@turf/turf';
import { useMeasureTool } from '../hooks/useMeasureTool.js';
import { useMeasurementLabels } from '../hooks/useMeasurementLabels.js';
import {
    DISTANCE_UNITS,
    AREA_UNITS,
    downloadGeoJSON,
    downloadCSV
} from '../utils/measurementUtils.js';
import MeasureControlUI from './MeasureControlUI.jsx';

/**
 * 측정 도구 컨트롤
 */
function MeasureControl() {
    const map = useMap();
    const [distanceUnit, setDistanceUnit] = useState('kilometers');
    const [areaUnit, setAreaUnit] = useState('kilometers');

    const {
        addLabel,
        updateTempLabel,
        clearTempLabel,
        clearLabels,
        getMeasurements,
        hasMeasurements
    } = useMeasurementLabels(map);

    const {
        getDraw,
        isActive,
        measureMode,
        startDistance,
        startArea,
        stop,
        clear,
        setOnDrawing
    } = useMeasureTool(map);

    // 실시간 측정 콜백 (단위 변경 시 업데이트)
    useEffect(() => {
        if (!setOnDrawing) return;

        const handleDrawing = (feature) => {
            if (feature.geometry.type === 'LineString' && feature.geometry.coordinates.length >= 2) {
                const length = turf.length(feature, { units: 'meters' });
                updateTempLabel(feature, length, distanceUnit, 'distance');
            } else if (feature.geometry.type === 'Polygon' && feature.geometry.coordinates[0]?.length >= 3) {
                try {
                    const area = turf.area(feature);
                    updateTempLabel(feature, area, areaUnit, 'area');
                } catch (e) {
                    console.warn('Area calculation failed:', e);
                }
            }
        };

        setOnDrawing(handleDrawing);
    }, [distanceUnit, areaUnit, updateTempLabel, setOnDrawing]);

    // TerraDraw finish 이벤트 처리
    useEffect(() => {
        const draw = getDraw();
        if (!draw) return;

        const handleFinish = (id) => {
            try {
                const snapshot = draw.getSnapshot();
                const feature = snapshot.find(f => f.id === id);

                if (!feature) return;

                if (feature.geometry.type === 'LineString') {
                    const length = turf.length(feature, { units: 'meters' });
                    addLabel(feature, length, distanceUnit, 'distance');
                } else if (feature.geometry.type === 'Polygon') {
                    const area = turf.area(feature);
                    addLabel(feature, area, areaUnit, 'area');
                }
            } catch (e) {
                console.warn('Finish handler error:', e);
            }
        };

        draw.on('finish', handleFinish);

        return () => {
            draw.off('finish', handleFinish);
        };
    }, [getDraw, distanceUnit, areaUnit, addLabel]);

    // 측정 중단
    const handleStop = () => {
        stop();
        clearTempLabel();
    };

    // 모두 지우기
    const handleClear = () => {
        stop();
        clear();
        clearLabels();
    };

    // 저장
    const handleSave = (format) => {
        const measurements = getMeasurements();
        if (format === 'geojson') {
            downloadGeoJSON(measurements);
        } else if (format === 'csv') {
            downloadCSV(measurements);
        }
    };

    return (
        <MeasureControlUI
            isActive={isActive}
            measureMode={measureMode}
            distanceUnit={distanceUnit}
            areaUnit={areaUnit}
            distanceUnits={DISTANCE_UNITS}
            areaUnits={AREA_UNITS}
            onStartDistance={startDistance}
            onStartArea={startArea}
            onStop={handleStop}
            onClear={handleClear}
            onSave={handleSave}
            onDistanceUnitChange={setDistanceUnit}
            onAreaUnitChange={setAreaUnit}
            hasMeasurements={hasMeasurements()}
        />
    );
}

export default MeasureControl;