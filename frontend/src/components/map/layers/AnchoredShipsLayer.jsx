import { useEffect } from 'react';
import { useMap } from '../../../contexts/MapContext.js';
import { makeScheduledEnsure } from '../utils/scheduleEnsure.js';

const SOURCE_ID = 'ships';
const LAYER_ID = 'ships-layer';

function AnchoredShipsLayer() {
    const map = useMap();

    useEffect(() => {
        if (!map) return;

        const ensure = () => {
            if (!map.getStyle || !map.getStyle()) return;

            if (!map.getSource(SOURCE_ID)) {
                map.addSource(SOURCE_ID, {
                    type: 'raster',
                    tiles: [
                        '/geoserver/ocean/wms?' +
                        'service=WMS&request=GetMap&version=1.1.1&' +
                        'layers=ocean:ships&styles=&' +
                        'bbox={bbox-epsg-3857}&' +
                        'width=256&height=256&' +
                        'srs=EPSG:3857&' +
                        'format=image/png&transparent=true'
                    ],
                    tileSize: 256
                });
            }

            if (!map.getLayer(LAYER_ID)) {
                map.addLayer({
                    id: LAYER_ID,
                    type: 'raster',
                    source: SOURCE_ID,
                    paint: { 'raster-opacity': 1 }
                });
            }

            // 항상 최상단
            map.moveLayer(LAYER_ID);
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

export default AnchoredShipsLayer;
