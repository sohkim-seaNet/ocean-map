import { useEffect } from 'react';
import { useMap } from '../contexts/MapContext';

const COASTLINE_SOURCE_ID = 'coastline-wms';
const COASTLINE_LAYER_ID = 'coastline-layer';

function CoastlineLayer() {
    const map = useMap();

    useEffect(() => {
        if (!map) return;

        const addLayer = () => {
            // 맵/스타일이 사용 가능한 상태인지 체크
            if (!map || typeof map.getStyle !== 'function' || !map.getStyle()) return;

            if (map.getSource(COASTLINE_SOURCE_ID)) return;

            map.addSource(COASTLINE_SOURCE_ID, {
                type: 'raster',
                tiles: [
                    `/geoserver/ocean/wms?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&FORMAT=image/png&TRANSPARENT=true&LAYERS=ocean:ne_10m_coastline&SRS=EPSG:3857&WIDTH=256&HEIGHT=256&BBOX={bbox-epsg-3857}`,
                ],
                tileSize: 256,
            });

            map.addLayer({
                id: COASTLINE_LAYER_ID,
                type: 'raster',
                source: COASTLINE_SOURCE_ID,
                paint: { 'raster-opacity': 1.0 },
            });
        };

        if (map.isStyleLoaded()) addLayer();
        else map.on('load', addLayer);

        return () => {
            // load 리스너 정리
            if (map && typeof map.off === 'function') {
                map.off('load', addLayer);
            }

            // 맵/스타일이 아직 살아 있는 경우에만 레이어만 제거
            if (!map || typeof map.getStyle !== 'function' || !map.getStyle()) return;

            if (typeof map.getLayer === 'function' && map.getLayer(COASTLINE_LAYER_ID)) {
                map.removeLayer(COASTLINE_LAYER_ID);
            }

        };
    }, [map]);

    return null;
}

export default CoastlineLayer;
