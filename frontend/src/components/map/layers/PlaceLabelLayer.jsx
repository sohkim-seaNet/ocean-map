import { useEffect } from 'react';
import { useMap } from '../../../contexts/MapContext.js';
import { makeScheduledEnsure } from '../utils/scheduleEnsure.js';

const PLACES_SOURCE_ID = 'places-wfs';
const PLACES_LAYER_ID = 'places-label';

function PlaceLabelLayer() {
    const map = useMap();

    useEffect(() => {
        if (!map) return;

        const ensure = () => {
            if (!map.getStyle || !map.getStyle()) return;

            if (!map.getSource(PLACES_SOURCE_ID)) {
                map.addSource(PLACES_SOURCE_ID, {
                    type: 'geojson',
                    data:
                        '/geoserver/ocean/ows?' +
                        'service=WFS&version=1.0.0&request=GetFeature&' +
                        'typeName=ocean:ne_10m_populated_places&' +
                        'outputFormat=application/json'
                });
            }

            if (!map.getLayer(PLACES_LAYER_ID)) {
                map.addLayer({
                    id: PLACES_LAYER_ID,
                    type: 'symbol',
                    source: PLACES_SOURCE_ID,
                    layout: {
                        'text-field': ['coalesce', ['get', 'NAME'], ''],
                        'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
                        'text-size': 12,
                        'text-offset': [0, 0.6],
                        'text-anchor': 'top',
                        'text-allow-overlap': false,
                        'text-ignore-placement': false,
                        'symbol-sort-key': ['coalesce', ['get', 'SCALERANK'], 999]
                    },
                    paint: {
                        'text-color': '#ffffff',
                        'text-halo-color': '#000000',
                        'text-halo-width': 1.5
                    },
                    filter: ['<', ['coalesce', ['get', 'SCALERANK'], 999], 5]
                });
            }

            // labels는 맨 위가 보통 좋음
            map.moveLayer(PLACES_LAYER_ID);
        };

        const { schedule, cleanup } = makeScheduledEnsure(map, ensure);

        if (map.isStyleLoaded()) ensure();
        map.on('styledata', schedule);

        return () => {
            map.off('styledata', schedule);
            cleanup();
        };
    }, [map]);

    return null;
}

export default PlaceLabelLayer;
