// 거리 단위
export const DISTANCE_UNITS = [
    { value: 'meters', label: 'm', factor: 1 },
    { value: 'kilometers', label: 'km', factor: 1000 },
    { value: 'miles', label: 'mi', factor: 1609.34 },
    { value: 'nauticalmiles', label: 'NM', factor: 1852 },
    { value: 'yards', label: 'yd', factor: 0.9144 },
    { value: 'feet', label: 'ft', factor: 0.3048 }
];

// 면적 단위
export const AREA_UNITS = [
    { value: 'meters', label: 'm²', factor: 1 },
    { value: 'kilometers', label: 'km²', factor: 1000000 },
    { value: 'miles', label: 'mi²', factor: 2589988.11 },
    { value: 'nauticalmiles', label: 'NM²', factor: 3429904 },
    { value: 'hectares', label: 'ha', factor: 10000 },
    { value: 'acres', label: 'acre', factor: 4046.86 }
];

// 측정값 변환
export function convertMeasurement(value, unit, type) {
    const units = type === 'distance' ? DISTANCE_UNITS : AREA_UNITS;
    const unitInfo = units.find(u => u.value === unit);

    return {
        convertedValue: value / unitInfo.factor,
        label: unitInfo.label,
        unitInfo
    };
}

export function createLabelElement(formattedValue, label, isTemporary = false) {
    const el = document.createElement('div');
    el.className = isTemporary ? 'measure-label-temp' : 'measure-label';

    const bgColor = isTemporary ? 'rgba(25, 118, 210, 0.9)' : 'rgba(0, 0, 0, 0.85)';
    const borderColor = isTemporary ? 'rgba(25, 118, 210, 1)' : 'rgba(255, 255, 255, 0.2)';

    el.style.cssText = `
        background: ${bgColor};
        color: #ffffff;
        padding: 8px 14px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 600;
        pointer-events: none;
        border: 2px solid ${borderColor};
        box-shadow: 0 3px 12px rgba(0, 0, 0, 0.4);
        white-space: nowrap;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        letter-spacing: 0.3px;
        ${isTemporary ? 'opacity: 0.85;' : ''}
    `;
    el.textContent = `${formattedValue} ${label}`;
    return el;
}

/**
 * GeoJSON 다운로드
 */
export function downloadGeoJSON(measurements, filename = 'measurements') {
    const features = Array.from(measurements.values()).map(m => ({
        ...m.feature,
        properties: {
            measurementType: m.type,
            value: m.convertedValue,
            unit: m.label,
            rawValue: m.value
        }
    }));

    const geojson = {
        type: 'FeatureCollection',
        features
    };

    const blob = new Blob([JSON.stringify(geojson, null, 2)], {
        type: 'application/json'
    });
    const href = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = `${filename}_${new Date().toISOString().split('T')[0]}.geojson`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
}

/**
 * CSV 다운로드
 */
export function downloadCSV(measurements, filename = 'measurements') {
    const rows = [
        ['Type', 'Value', 'Unit', 'Raw Value (meters/m²)', 'Coordinates']
    ];

    measurements.forEach(m => {
        const coords = JSON.stringify(m.feature.geometry.coordinates);
        rows.push([
            m.type,
            m.convertedValue.toFixed(2),
            m.label,
            m.value.toFixed(2),
            coords
        ]);
    });

    const csv = rows.map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const href = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
}


// TerraDraw 스타일 설정
export const DRAW_STYLES = {
    lineString: {
        lineStringColor: '#1976d2',
        lineStringWidth: 3,
        closingPointColor: '#d32f2f',
        closingPointWidth: 3,
        closingPointOutlineColor: '#ffffff',
        closingPointOutlineWidth: 2
    },
    polygon: {
        fillColor: '#1976d2',
        fillOpacity: 0.3,
        outlineColor: '#1976d2',
        outlineWidth: 3,
        closingPointColor: '#d32f2f',
        closingPointWidth: 3,
        closingPointOutlineColor: '#ffffff',
        closingPointOutlineWidth: 2
    }
};
