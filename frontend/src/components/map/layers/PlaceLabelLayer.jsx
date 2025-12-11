import { useEffect } from 'react';
import { useMap } from '../../../contexts/MapContext.js';

const PLACES_SOURCE_ID = 'places-wfs';
const PLACES_LAYER_ID = 'places-label';

function PlaceLabelLayer() {
    const map = useMap();

    useEffect(() => {
        if (!map) return;

        const addLayer = () => {
            // 맵/스타일이 사용 가능한 상태인지 체크
            if (!map || typeof map.getStyle !== 'function' || !map.getStyle()) return;

            if (map.getSource(PLACES_SOURCE_ID)) return;

            map.addSource(PLACES_SOURCE_ID, {
                type: 'geojson',
                data: '/geoserver/ocean/ows?service=WFS&version=1.0.0&request=GetFeature' +
                    '&typeName=ocean:ne_10m_populated_places&outputFormat=application/json',
            });

            map.addLayer({
                id: PLACES_LAYER_ID,
                type: 'symbol',
                source: PLACES_SOURCE_ID,
                layout: {
                    'text-field': ['get', 'NAME'],
                    'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
                    'text-size': 12,
                    'text-offset': [0, 0.6],
                    'text-anchor': 'top',
                    'text-allow-overlap': false,
                    'text-ignore-placement': false,
                    'symbol-sort-key': ['get', 'SCALERANK'],
                },
                paint: {
                    'text-color': '#ffffff',
                    'text-halo-color': '#000000',
                    'text-halo-width': 1.5,
                },
                filter: ['<', ['get', 'SCALERANK'], 5],
            });
        };

        if (map.isStyleLoaded()) addLayer();
        else map.on('load', addLayer);

        return () => {
            // load 리스너만 정리
            if (map && typeof map.off === 'function') {
                map.off('load', addLayer);
            }

            // 맵/스타일이 살아 있을 때만 레이어 제거
            if (!map || typeof map.getStyle !== 'function' || !map.getStyle()) return;

            if (typeof map.getLayer === 'function' && map.getLayer(PLACES_LAYER_ID)) {
                map.removeLayer(PLACES_LAYER_ID);
            }

        };
    }, [map]);

    return null;
}

export default PlaceLabelLayer;
