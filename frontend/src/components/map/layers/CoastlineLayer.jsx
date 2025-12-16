import { useEffect } from 'react';
import { useMap } from '../../../contexts/MapContext.js';
import { makeScheduledEnsure } from '../utils/scheduleEnsure.js';

const COASTLINE_SOURCE_ID = 'coastline-wms';
const COASTLINE_LAYER_ID = 'coastline-layer';

function CoastlineLayer() {
    const map = useMap();

    useEffect(() => {
        if (!map) return;

        const ensure = () => {
            if (!map.getStyle || !map.getStyle()) return;

            if (!map.getSource(COASTLINE_SOURCE_ID)) {
                map.addSource(COASTLINE_SOURCE_ID, {
                    type: 'raster',
                    tiles: [
                        '/geoserver/ocean/wms?' +
                        'service=WMS&version=1.1.1&request=GetMap&' +
                        'format=image/png&transparent=true&' +
                        'layers=ocean:ne_10m_coastline&' +
                        'srs=EPSG:3857&width=256&height=256&' +
                        'bbox={bbox-epsg-3857}'
                    ],
                    tileSize: 256
                });
            }

            if (!map.getLayer(COASTLINE_LAYER_ID)) {
                map.addLayer({
                    id: COASTLINE_LAYER_ID,
                    type: 'raster',
                    source: COASTLINE_SOURCE_ID,
                    paint: { 'raster-opacity': 1 }
                });
            }

            // 보통 coastline은 ships 아래에 두고 싶을 수 있어서:
            // ships-layer가 있으면 그 아래로 내림(= ships가 위)
            if (map.getLayer('ships-layer')) {
                map.moveLayer(COASTLINE_LAYER_ID, 'ships-layer');
            } else {
                map.moveLayer(COASTLINE_LAYER_ID);
            }
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

export default CoastlineLayer;
